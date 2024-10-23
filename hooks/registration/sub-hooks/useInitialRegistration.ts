import { useState, useEffect } from 'react'
import { useRegistrationFlow } from 'hooks/registration/useRegistrationFlow'
import { signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { signUpUser, startSignupProcess } from '../../../services/fastapi_backend/registration/api'

// Define the UserData interface if it's not already defined elsewhere
export interface UserData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  email_alias?: string;
}

export interface UserResponse extends UserData {
  id: string;
  message: string;
}

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

  const { handleInitialSignUp } = useRegistrationFlow()
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
      await startSignupProcess({
        email: data.email,
        password: userData.password,
        first_name: data.first_name,
        last_name: data.last_name,
        email_alias: data.email_alias
      })

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

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordStrength.length || !passwordStrength.numberOrSymbol || !passwordStrength.match) {
      setPasswordError("Please ensure all password requirements are met")
      return
    }
    try {
      const userData: UserData = { email, password, first_name: firstName, last_name: lastName }
      const signUpResult: UserResponse = await handleSignUp(userData)
      
      await handleInitialSignUp({ ...signUpResult, password })
    } catch (error) {
      console.error('Error signing up:', error)
      setSignupError(error instanceof Error ? error.message : 'An error occurred during signup')
    }
  }

  const handleGoogleSignUpClick = async () => {
    try {
      console.log('Initiating Google Sign-In')
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: `${window.location.origin}/auth/callback`
      })
      
      console.log('Google Sign-In result:', result)
      
      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        console.log('Google Sign-In successful, proceeding with registration')
        // Note: handleGoogleSignUp is removed as it's now handled in the callback
        toast({
          title: "Google Sign Up Initiated",
          description: "Please complete the registration process.",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error signing up with Google:', error)
      setSignupError(error instanceof Error ? error.message : 'An error occurred during Google signup')
      toast({
        title: "Google Sign Up Failed",
        description: error instanceof Error ? error.message : 'An error occurred during Google signup',
        variant: "destructive",
        duration: 5000,
      })
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
