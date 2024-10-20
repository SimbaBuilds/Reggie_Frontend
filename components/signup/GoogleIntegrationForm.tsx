"use client"

import { useState } from 'react'
import { useSignUpProcess } from '@/hooks/useSignUpProcess'

export function GoogleIntegrationForm() {
  const { completeSignUp } = useSignUpProcess()

  const handleGoogleIntegration = async () => {
    // Implement Google integration logic here
    // This might involve redirecting to a Google OAuth page
    // or calling an API endpoint to initiate the integration
    try {
      await completeSignUp()
      // Redirect to dashboard or next step
    } catch (error) {
      console.error('Error integrating with Google:', error)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        To complete your signup, please integrate your Google account for Drive and Gmail access.
      </p>
      <button
        onClick={handleGoogleIntegration}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-medium"
      >
        Connect Google Account
      </button>
    </div>
  )
}
