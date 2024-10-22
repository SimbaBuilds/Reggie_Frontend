import { useState } from 'react';
import { useToast } from 'hooks/use-toast';
import { signIn } from 'next-auth/react';

interface UserData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  google_id?: string;
}

interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_alias: string | null;
  message: string;
}

interface GoogleUserData {
  email: string;
  first_name: string;
  last_name: string;
  google_id: string;
}

export function useRegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);

    const signupUrl = `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/registration/signup/user`;
    
    try {
      // Register user
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status); // Log the response status

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log the error response
        throw new Error(errorData.detail || `Signup failed with status ${response.status}`);
      }

      const data: UserResponse = await response.json();

      // Start signup process
      await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/signup/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: userData.password,
          first_name: data.first_name,
          last_name: data.last_name,
          email_alias: data.email_alias
        }),
      });

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created successfully.",
        duration: 5000,
      });

      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during signup');
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred during signup',
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (): Promise<UserResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Initiate Google OAuth flow
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: `${window.location.origin}/registration/organization-details`
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error('Failed to sign in with Google');
      }

      // Fetch user info from Google
      const userInfoResponse = await fetch('/api/auth/session');
      const userInfo = await userInfoResponse.json();

      if (!userInfo.user) {
        throw new Error('Failed to fetch user information');
      }

      const googleUserData: GoogleUserData = {
        email: userInfo.user.email,
        first_name: userInfo.user.name?.split(' ')[0] || '',
        last_name: userInfo.user.name?.split(' ').slice(1).join(' ') || '',
        google_id: userInfo.user.id,
      };

      // Register user with backend
      const signupUrl = `${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/registration/signup/google`;
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Google signup failed with status ${response.status}`);
      }

      const data: UserResponse = await response.json();

      toast({
        title: "Google Sign Up Successful",
        description: "Your account has been created successfully using Google.",
        duration: 5000,
      });

      return data;
    } catch (error) {
      console.error('Error signing up with Google:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during Google signup');
      toast({
        title: "Google Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred during Google signup',
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignUp,
    handleGoogleSignUp,
    isLoading,
    error,
  };
}
