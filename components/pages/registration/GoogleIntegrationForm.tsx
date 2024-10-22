"use client"

import { useState } from 'react'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export function GoogleIntegrationForm() {
  const { handleGoogleIntegration } = useRegistrationFlow()

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        To complete your signup, please integrate your Google account for Drive and Gmail access.
      </p>
      <button
        onClick={() => handleGoogleIntegration(false)}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-medium"
      >
        Connect Google Account
      </button>
    </div>
  )
}
