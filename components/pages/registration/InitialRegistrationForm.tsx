"use client"

import { useState, useEffect } from 'react'
import { useRegistrationFlow } from 'hooks/registration/useRegistrationFlow'
import { RegistrationState } from '@/hooks/registration/useRegistrationFlow';
import { useRegisterUser } from '@/hooks/registration/useRegisterUser';
import { useRouter } from 'next/navigation';

interface InitialRegistrationFormProps {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
}

export function InitialRegistrationForm({ onSubmit, registrationState }: InitialRegistrationFormProps) {
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
  const { handleSignUp } = useRegisterUser();
  const router = useRouter();

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
      await handleSignUp({ email, password, first_name: firstName, last_name: lastName })
      router.push('/registration/organization-details')
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
      </div>
    </form>
  )
}
