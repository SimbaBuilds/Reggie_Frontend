"use client"

import React from 'react'
import { useRegistrationFlow, RegistrationState } from '@/hooks/registration/useRegistrationFlow'
import { InitialRegistrationForm } from './forms/InitialRegistrationForm'
import { OrganizationDetailsForm } from './forms/OrganizationDetailsForm'
import { PlanSelectionForm } from './forms/PlanSelectionForm'
import { GoogleIntegrationForm } from './forms/GoogleIntegrationForm'
import { DataUploadForm } from './forms/DataUploadForm'
import { TranscriptHandlingForm } from './forms/TranscriptHandlingForm'
import { EmailConfigurationForm } from './forms/EmailConfigurationForm'
import { UserAccountsForm } from './forms/UserAccountsForm'
import { DriveSetupForm } from './forms/DriveSetupForm'
import { DigitizationPreferencesForm } from './forms/DigitizationPreferencesForm'
import { TemplateResponsesForm } from './forms/EmailTemplatesForm'
import { OnboardingTutorialForm } from './forms/OnboardingTutorialForm'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ComponentType } from 'react'

const STEP_COMPONENTS: Record<string, ComponentType<StepProps>> = {
  initialSignUp: InitialRegistrationForm,
  organizationDetails: OrganizationDetailsForm,
  planSelection: PlanSelectionForm,
  googleIntegration: GoogleIntegrationForm,
  dataUpload: DataUploadForm,
  driveSetup: DriveSetupForm,
  digitizationPreferences: DigitizationPreferencesForm,
  emailConfiguration: EmailConfigurationForm,
  transcriptHandling: TranscriptHandlingForm,
  templateResponses: TemplateResponsesForm,
  userAccounts: UserAccountsForm,
  onboardingTutorial: OnboardingTutorialForm,
} as const;

export interface StepProps {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
  onPrevious: () => void;
}

export function RegistrationPage() {
  const {
    registrationState,
    currentStep,
    isLastStep,
    handleStepSubmit,
    goToPreviousStep,
    calculateProgress,
    finalizeRegistration,
  } = useRegistrationFlow();

  const StepComponent = STEP_COMPONENTS[currentStep.key as keyof typeof STEP_COMPONENTS] as ComponentType<StepProps>;

  const handleSubmit = async (data: any) => {
    await handleStepSubmit(data);
    if (isLastStep) {
      await finalizeRegistration();
    }
  };

  const progress = calculateProgress();

  return (
    <div className="container mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2 text-center">
            Registration Progress: {progress}%
          </p>
        </div>
        <StepComponent
          onSubmit={handleSubmit}
          registrationState={registrationState}
          onPrevious={goToPreviousStep}
        />
        <div className="mt-4 flex justify-between">
          {currentStep.key !== 'initialSignUp' && (
            <Button onClick={goToPreviousStep} variant="outline">
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
