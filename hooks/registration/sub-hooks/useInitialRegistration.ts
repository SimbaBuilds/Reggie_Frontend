import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { signUpUser } from '../../../services/fastapi_backend/registration/api'
import { UserData, UserResponse } from '@/types/types'
import { clearGoogleAuth } from '@/utils/auth-utils'

export function useInitialRegistration() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [signupError, setSignupError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    numberOrSymbol: false,
    match: false
  })

  const { toast } = useToast()

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8 && password.length <= 20,
      numberOrSymbol: /[\d!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password !== ''
    })
  }, [password, confirmPassword])

  const handleSignUp = async (userData: UserData): Promise<UserResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await signUpUser(userData)
      toast({
        title: "Sign Up Successful",
        description: "Your account has been created successfully.",
        duration: 5000,
      })
      return data
    } catch (error) {
      console.error('Error signing up:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during signup')
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred during signup',
        variant: "destructive",
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitForm = async (e: React.FormEvent, onSubmit: (data: UserResponse) => Promise<void>) => {
    e.preventDefault()
    if (isLoading) return // Prevent multiple submissions
    if (!passwordStrength.length || !passwordStrength.numberOrSymbol || !passwordStrength.match) {
      setPasswordError("Please ensure all password requirements are met")
      return
    }
    try {
      const userData: UserData = { email, password, first_name: firstName, last_name: lastName }
      const signUpResult = await handleSignUp(userData)
      await onSubmit(signUpResult)
    } catch (error) {
      console.error('Error signing up:', error)
      setSignupError(error instanceof Error ? error.message : 'An error occurred during signup')
    }
  }

  const handleGoogleSignUpClick = async () => {
    try {
      console.log('Initiating Google Sign-In');
      
      // Clear Google auth cache before initiating new sign-in
      await clearGoogleAuth();
      
      // Add a small delay to ensure cache clearing is complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: `${window.location.origin}/api/auth/callback/google`
      });
      
      console.log('Google Sign-In result:', result);
      
      if (result?.error) {
        console.error('Error during Google Sign-In:', result.error);
        throw new Error(result.error);
      }

      if (result?.ok) {
        console.log('Google Sign-In successful, redirecting to callback');
        window.location.href = result.url || '/api/auth/callback/google';
      }
    } catch (error) {
      console.error('Error signing up with Google:', error);
      setSignupError(error instanceof Error ? error.message : 'An error occurred during Google signup');
      toast({
        title: "Google Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred during Google signup',
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    passwordError,
    signupError,
    passwordStrength,
    isLoading,
    error,
    onSubmitForm,
    handleGoogleSignUpClick,
    handleSignUp
  }
}
