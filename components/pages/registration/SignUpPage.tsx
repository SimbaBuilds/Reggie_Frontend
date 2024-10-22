"use client"

import { useState } from 'react'
import { useRegistrationFlow, RegistrationState } from 'hooks/registration/useRegistrationFlow'
import { InitialRegistrationForm } from './InitialRegistrationForm'
import { OrganizationDetailsForm } from './OrganizationDetailsForm'
import { PlanSelectionForm } from './PlanSelectionForm'
import { GoogleIntegrationForm } from './GoogleIntegrationForm'
import { DataUploadForm } from './DataUploadForm'
import { TranscriptHandlingForm } from './TranscriptHandlingForm'
import { EmailConfigurationForm } from './EmailConfigurationForm'
import { UserAccountsForm } from './UserAccountsForm'
import { useRouter } from 'next/navigation';

// Update the StepComponent type
type BaseStepProps = {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
};

type StepComponent = React.FC<BaseStepProps>;

// Update the InitialRegistrationForm type
type InitialRegistrationFormProps = BaseStepProps & {
  onGoogleSignUp: () => void;
};

// Ensure each component in STEPS is properly typed
const STEPS: Array<{
  component: StepComponent;
  handler: keyof ReturnType<typeof useRegistrationFlow>;
}> = [
  { component: InitialRegistrationForm as StepComponent, handler: 'handleInitialSignUp' },
  { component: OrganizationDetailsForm as StepComponent, handler: 'handleOrganizationDetails' },
  { component: PlanSelectionForm as StepComponent, handler: 'handlePlanSelection' },
  { component: GoogleIntegrationForm as StepComponent, handler: 'handleGoogleIntegration' },
  { component: DataUploadForm as StepComponent, handler: 'handleDataUpload' },
  { component: TranscriptHandlingForm as StepComponent, handler: 'handleTranscriptHandling' },
  { component: EmailConfigurationForm as StepComponent, handler: 'handleEmailConfiguration' },
  { component: UserAccountsForm as StepComponent, handler: 'handleUserAccounts' }
];

export default function SignUpPage() {
  const [step, setStep] = useState(0)
  const registrationHook = useRegistrationFlow()
  const router = useRouter();
  const {
    registrationState,
    finalizeRegistration,
    handleGoogleSignUp
  } = registrationHook

  const CurrentStep = STEPS[step].component
  const currentHandler = registrationHook[STEPS[step].handler] as (data: any) => Promise<void>

  const handleSubmit = async (data: any) => {
    await currentHandler(data)
    if (step < STEPS.length - 1) {
      setStep((prevStep) => prevStep + 1)
    } else {
      await finalizeRegistration()
    }
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <CurrentStep
          onSubmit={handleSubmit}
          registrationState={registrationState}
        />
      </div>
    </div>
  )
}
