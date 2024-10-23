import { useState } from 'react'
import { RegistrationState } from './useRegistrationFlow'


interface RegistrationStep {
  key: string;
  label: string;
  isCompleted: (state: RegistrationState) => boolean;
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    key: 'initialSignUp',
    label: 'Initial Sign Up',
    isCompleted: (state) => !!state.user.email,
  },
  {
    key: 'organizationDetails',
    label: 'Organization Details',
    isCompleted: (state) => !!state.organization.name,
  },
  {
    key: 'planSelection',
    label: 'Plan Selection',
    isCompleted: (state) => !!state.plan.name,
  },
  {
    key: 'googleIntegration',
    label: 'Google Integration',
    isCompleted: (state) => state.googleIntegration,
  },
  {
    key: 'dataUpload',
    label: 'Data Upload',
    isCompleted: (state) => state.dataUpload,
  },
  {
    key: 'transcriptHandling',
    label: 'Transcript Handling',
    isCompleted: (state) => state.transcriptHandling,
  },
  {
    key: 'emailConfiguration',
    label: 'Email Configuration',
    isCompleted: (state) => state.emailConfiguration,
  },
  {
    key: 'userAccounts',
    label: 'User Accounts',
    isCompleted: (state) => state.userAccounts.length > 0,
  },
];

export function useRegistrationSteps(registrationState: RegistrationState) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = REGISTRATION_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === REGISTRATION_STEPS.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const calculateProgress = () => {
    const completedSteps = REGISTRATION_STEPS.filter((step) =>
      step.isCompleted(registrationState)
    ).length;
    return Math.round((completedSteps / REGISTRATION_STEPS.length) * 100);
  };

  return {
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    calculateProgress,
    REGISTRATION_STEPS,
  };
}


