"use client"

import { useState, useEffect } from 'react'
import { useRegistrationFlow } from 'hooks/registration/useRegistrationFlow'
import { RegistrationState } from '@/hooks/registration/useRegistrationFlow';

interface InitialRegistrationFormProps {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
  onGoogleSignUp: () => void;
}

export function InitialRegistrationForm({ onSubmit, registrationState, onGoogleSignUp }: InitialRegistrationFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [signupError, setSignupError] = useState('')
  const { handleInitialSignUp } = useRegistrationFlow()
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    numberOrSymbol: false,
    match: false
  })

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8 && password.length <= 20,
      numberOrSymbol: /[\d!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password !== ''
    })
  }, [password, confirmPassword])

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordStrength.length || !passwordStrength.numberOrSymbol || !passwordStrength.match) {
      setPasswordError("Please ensure all password requirements are met")
      return
    }
    try {
      await handleInitialSignUp({ email, password, first_name: firstName, last_name: lastName })
      // Remove the router.push line
    } catch (error) {
      console.error('Error signing up:', error)
      setSignupError(error instanceof Error ? error.message : 'An error occurred during signup')
    }
  }

  return (
    <form onSubmit={onSubmitForm} className="bg-background shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="mt-2 text-sm">
          <p className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
            • 8-20 characters
          </p>
          <p className={passwordStrength.numberOrSymbol ? "text-green-500" : "text-red-500"}>
            • Contains at least one number or symbol
          </p>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="mt-2 text-sm">
          <p className={passwordStrength.match ? "text-green-500" : "text-red-500"}>
            • Passwords match
          </p>
        </div>
        {passwordError && <p className="text-red-500 text-xs italic mt-2">{passwordError}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
          First Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="firstName"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
          Last Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>


      {signupError && <p className="text-red-500 text-xs italic mb-4">{signupError}</p>}

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-medium"
        >
          Sign Up
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-gray-500">Or</span>
          </div>
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-50 py-2 px-4 rounded border border-gray-300 font-medium transition duration-150 ease-in-out"
          onClick={onGoogleSignUp}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Sign up with Google
        </button>
      </div>
    </form>
  )
}
