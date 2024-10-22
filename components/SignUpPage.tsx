"use client"

import { useState } from 'react'
import { DigitizationPreferencesForm } from './signup/DigitizationPreferencesForm'
import { DriveSetupComponent } from './signup/DriveSetupComponent'
import { InitialRegistrationForm } from './signup/InitialRegistrationForm'
import { OrganizationDetailsForm } from './signup/OrganizationDetailsForm'
import { PlanSelectionForm } from './signup/PlanSelectionForm'
import { EmailConfigurationForm } from './signup/EmailConfigurationForm'
import { GoogleIntegrationForm } from './signup/GoogleIntegrationForm'
import { OnboardingTutorialForm } from './signup/OnboardingTutorialForm'
import { TemplateResponsesForm } from './signup/TemplateResponsesForm'
import { TranscriptHandlingForm } from './signup/TranscriptHandlingForm'
import { UserAccountsForm } from './signup/UserAccountsForm'



export default function SignUpPage() {
  const [step, setStep] = useState(1)

  const handleGoogleSignUp = async () => {
    try {
      const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/auth/google/signup`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error('Google signup failed')
      }

      const data = await response.json()
      // Redirect to Google OAuth URL provided by your backend
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error signing up with Google:', error)
      alert('Error signing up with Google')
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InitialRegistrationForm onGoogleSignUp={handleGoogleSignUp} />
      case 2:
        return <OrganizationDetailsForm />
      case 3:
        return <PlanSelectionForm />

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        {renderStep()}
      </div>
    </div>
  );
}
