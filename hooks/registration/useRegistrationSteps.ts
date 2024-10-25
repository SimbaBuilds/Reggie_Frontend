import { useState } from 'react'
import { RegistrationState } from './useRegistrationFlow'

interface RegistrationStep {
  key: string;
  label: string;
  isCompleted: (state: RegistrationState) => boolean;
  isSkippable?: (state: RegistrationState) => boolean;  // This is fine as optional
}

const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    key: 'initialSignUp',
    label: 'Initial Registration',
    isCompleted: (state) => state.currentStep.completed,
  },
  {
    key: 'organizationDetails',
    label: 'Organization Setup',
    isCompleted: (state) => Boolean(state.organization.name && 
      state.organization.plan),
  },
  {
    key: 'planSelection',
    label: 'Plan Selection',
    isCompleted: (state) => Boolean(state.organization.plan?.name),
    isSkippable: (state) => !state.user.isPrimaryUser,
  },
  {
    key: 'googleIntegration',
    label: 'Google Account Integration',
    isCompleted: (state) => state.integrations.googleConnected,
  },
  {
    key: 'dataUpload',
    label: 'Student & Staff Lists',
    isCompleted: (state) => state.integrations.csvUploaded.studentList,
    isSkippable: (state) => !state.user.isPrimaryUser,
  },
  {
    key: 'googleDriveSetup',
    label: 'Drive Structure Setup',
    isCompleted: (state) => state.integrations.driveConfigured,
  },
  {
    key: 'digitizationPreferences',
    label: 'Record Identification Method',
    isCompleted: (state) => Boolean(state.preferences.digitizationMethod),
  },
  {
    key: 'emailConfiguration',
    label: 'Email Setup',
    isCompleted: (state) => state.integrations.emailLabelsCreated,
  },
  {
    key: 'transcriptHandling',
    label: 'Transcript Batch Upload',
    isCompleted: (state) => state.integrations.transcriptBatchUploaded || !state.preferences.hasTranscripts,
    isSkippable: (state) => !state.preferences.hasTranscripts,
  },
  {
    key: 'templateResponses',
    label: 'Email Templates',
    isCompleted: (state) => state.preferences.templateCount > 0,
    isSkippable: (state) => Boolean(!state.organization.plan?.name?.includes('assistant')),
  },
  {
    key: 'userAccounts',
    label: 'Additional Users',
    isCompleted: (state) => state.preferences.currentUserCount > 0,
    isSkippable: (state) => !state.user.isPrimaryUser || 
      Boolean(state.organization.plan?.name?.includes('digitize')),
  },
  {
    key: 'onboardingTutorial',
    label: 'Getting Started',
    isCompleted: (state) => state.currentStep.completed,
  },
];

export function useRegistrationSteps(registrationState: RegistrationState, initialStep?: string | null) {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (initialStep) {
      const index = REGISTRATION_STEPS.findIndex(step => step.key === initialStep);
      return index !== -1 ? index : 0;
    }
    return 0;
  });

  const currentStep = REGISTRATION_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === REGISTRATION_STEPS.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      let nextIndex = currentStepIndex + 1;
      // Skip steps that are skippable based on current state
      while (nextIndex < REGISTRATION_STEPS.length && 
             REGISTRATION_STEPS[nextIndex].isSkippable?.(registrationState)) {
        nextIndex++;
      }
      setCurrentStepIndex(nextIndex);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      let prevIndex = currentStepIndex - 1;
      // Skip steps that are skippable based on current state
      while (prevIndex >= 0 && 
             REGISTRATION_STEPS[prevIndex].isSkippable?.(registrationState)) {
        prevIndex--;
      }
      setCurrentStepIndex(prevIndex);
    }
  };

  const calculateProgress = () => {
    const relevantSteps = REGISTRATION_STEPS.filter(
      step => !step.isSkippable?.(registrationState)
    );
    const completedSteps = relevantSteps.filter(
      step => step.isCompleted(registrationState)
    ).length;
    return Math.round((completedSteps / relevantSteps.length) * 100);
  };

  const setCurrentStepByKey = (stepKey: string) => {
    const index = REGISTRATION_STEPS.findIndex(step => step.key === stepKey);
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
  };

  return {
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    calculateProgress,
    REGISTRATION_STEPS,
    setCurrentStepByKey,
  };
}





