import { useState } from 'react'
import { RegistrationState } from './useRegistrationFlow'
import { SubscriptionType } from '../../types/types'

interface RegistrationStep {
  key: string;
  label: string;
  isCompleted: (state: RegistrationState) => boolean;
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    key: 'initialSignUp',
    label: 'Initial Sign Up',
    isCompleted: (state) => !!state.user.email && !!state.user.password && !!state.user.first_name && !!state.user.last_name,
  },
  {
    key: 'organizationDetails',
    label: 'Organization Details',
    isCompleted: (state) => !!state.organization.name && !!state.organization.type && !!state.organization.size,
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
    isCompleted: (state) => state.dataUpload.studentList && (state.dataUpload.staffList || !state.organization.size),
  },
  {
    key: 'googleDriveSetup',
    label: 'Google Drive Setup',
    isCompleted: (state) => state.googleDriveSetup,
  },
  {
    key: 'digitizationPreferences',
    label: 'Digitization Preferences',
    isCompleted: (state) => !!state.digitizationMethod,
  },
  {
    key: 'emailConfiguration',
    label: 'Email Configuration',
    isCompleted: (state) => state.emailConfiguration && state.organization.email_labels_created,
  },
  {
    key: 'transcriptHandling',
    label: 'Transcript Handling',
    isCompleted: (state) => state.transcriptHandling || state.plan.name === SubscriptionType.Free,
  },
  {
    key: 'templateResponses',
    label: 'Template Responses',
    isCompleted: (state) => state.templateResponses.length > 0 || state.plan.name === SubscriptionType.Free,
  },
  {
    key: 'userAccounts',
    label: 'User Accounts',
    isCompleted: (state) => state.userAccounts.length > 0 || !state.isOrganizationPrimaryUser,
  },
  {
    key: 'onboardingTutorial',
    label: 'Onboarding Tutorial',
    isCompleted: (state) => state.onboardingTutorialCompleted,
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



