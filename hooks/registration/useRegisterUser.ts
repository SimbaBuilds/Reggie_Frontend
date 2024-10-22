import { useState } from 'react';
import { useToast } from 'hooks/use-toast';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_alias: string | null;
  message: string;
}

export function useRegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Register user
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/signup/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
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

  return {
    handleSignUp,
    isLoading,
    error,
  };
}
