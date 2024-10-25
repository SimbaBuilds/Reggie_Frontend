import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRegistrationSteps } from './useRegistrationSteps';
import { OrgData, PlanData, UserResponse } from '@/types/types';


export interface RegistrationState {
  user:{
    email: string;
    first_name: string;
    last_name: string;
    isPrimaryUser: boolean;
  }
  organization: {
    name: string;
    plan: PlanData;
  }
  currentStep: {
    key: string;
    completed: boolean;
  };
  integrations: {
    googleConnected: boolean;
    driveConfigured: boolean;
    csvUploaded: {
      studentList: boolean;
      staffList: boolean;
    };
    emailLabelsCreated: boolean;
    transcriptBatchUploaded: boolean;
  };
  preferences: {
    digitizationMethod: 'consistentFirstPage' | 'coverPage' | 'manualOrganization' | null;
    hasTranscripts: boolean;
    emailAlias: boolean;
    templateCount: number;
    maxUsers: number;
    currentUserCount: number;
  };
}

export function useRegistrationFlow(initialStep?: string | null) {
  const [registrationState, setRegistrationState] = useState<RegistrationState>(() => ({
    user: {
      email: '',
      first_name: '',
      last_name: '',
      isPrimaryUser: true,
    },
    organization:{
      name: '',
      plan: {} as PlanData
    },
    currentStep: {
      key: initialStep || '',
      completed: false,
    },
    integrations: {
      googleConnected: false,
      driveConfigured: false,
      csvUploaded: {
        studentList: false,
        staffList: false,
      },
      emailLabelsCreated: false,
      transcriptBatchUploaded: false,
    },
    preferences: {
      digitizationMethod: null,
      hasTranscripts: false,
      emailAlias: false,
      templateCount: 0,
      maxUsers: 1,
      currentUserCount: 1,
    },
  }));

  const { getToken } = useAuth();
  const {
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    calculateProgress,
    setCurrentStepByKey,
  } = useRegistrationSteps(registrationState, initialStep);

  const updateRegistrationState = useCallback((update: Partial<RegistrationState>) => {
    setRegistrationState(prev => ({ ...prev, ...update }));
  }, []);

  const handleInitialSignUp = async (signUpResult: UserResponse) => {
  
      updateRegistrationState({ 
        currentStep: { 
          key: 'initialSignUp', 
          completed: true 
      },
      user: {
        email: signUpResult.email,
        first_name: signUpResult.first_name,
        last_name: signUpResult.last_name,
        isPrimaryUser: true,
      }
    });
  };

  const handleOrganizationDetails = async (orgData: OrgData & { isPrimaryUser: boolean }): Promise<void> => {
    try {
      updateRegistrationState({
        organization: {
          name: orgData.name,
          plan: registrationState.organization.plan,
        },
        user: {
          ...registrationState.user,
          isPrimaryUser: orgData.isPrimaryUser,
        },
        currentStep: { 
          key: 'organizationDetails', 
          completed: true 
        },
      });
      goToNextStep();
    } catch (error) {
      console.error('Error setting organization details:', error);
      throw error;
    }
  };

  const handlePlanSelection = async (planData: PlanData) => {
    try {
      updateRegistrationState({ currentStep: { key: 'planSelection', completed: true } });
    } catch (error) {
      console.error('Error setting plan:', error);
      throw error;
    }
  };

  const handleGoogleIntegration = (integrated: boolean) => {
    updateRegistrationState({ integrations: { ...registrationState.integrations, googleConnected: integrated } });
  };

  const handleDataUpload = (uploaded: { studentList: boolean; staffList: boolean }) => {
    updateRegistrationState({ integrations: { ...registrationState.integrations, driveConfigured: true } });
  };

  const handleTranscriptHandling = (configured: boolean) => {
    updateRegistrationState({ preferences: { ...registrationState.preferences, hasTranscripts: configured } });
  };

  const handleEmailConfiguration = (configured: boolean) => {
    updateRegistrationState({ currentStep: { key: 'emailConfiguration', completed: true } });
  };

  const handleUserAccounts = (accounts: string[]) => {
    updateRegistrationState({ currentStep: { key: 'userAccounts', completed: true } });
  };

  const finalizeRegistration = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/finalize-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(registrationState),
      });

      if (!response.ok) throw new Error('Failed to finalize registration');
    } catch (error) {
      console.error('Error finalizing registration:', error);
      throw error;
    }
  };

  const handleStepSubmit = useCallback(async (data: any) => {
    const stepHandlers: Record<string, (data: any) => Promise<void> | void> = {
      initialSignUp: handleInitialSignUp,
      organizationDetails: handleOrganizationDetails,
      planSelection: handlePlanSelection,
      googleIntegration: handleGoogleIntegration,
      dataUpload: handleDataUpload,
      googleDriveSetup: handleGoogleDriveSetup,
      digitizationPreferences: handleDigitizationPreferences,
      emailConfiguration: handleEmailConfiguration,
      transcriptHandling: handleTranscriptHandling,
      templateResponses: handleTemplateResponses,
      userAccounts: handleUserAccounts,
      onboardingTutorial: handleOnboardingTutorial,
    };

    const handler = stepHandlers[currentStep.key];
    if (handler) {
      try {
        await handler(data);
        goToNextStep();
      } catch (error) {
        console.error(`Error in ${currentStep.key} step:`, error);
        // Handle the error appropriately, e.g., show an error message
      }
    } else {
      console.error('Unknown step:', currentStep.key);
    }
  }, [currentStep.key, goToNextStep]);

  const handleGoogleDriveSetup = (setup: boolean) => {
    updateRegistrationState({ integrations: { ...registrationState.integrations, driveConfigured: setup } });
  };

  const handleDigitizationPreferences = (method: 'consistentFirstPage' | 'coverPage' | 'manualOrganization') => {
    updateRegistrationState({ preferences: { ...registrationState.preferences, digitizationMethod: method } });
  };

  const handleTemplateResponses = (templates: string[]) => {
    updateRegistrationState({ currentStep: { key: 'templateResponses', completed: true } });
  };

  const handleOnboardingTutorial = (completed: boolean) => {
    updateRegistrationState({ currentStep: { key: 'onboardingTutorial', completed: completed } });
  };

  return {
    registrationState,
    currentStep,
    isLastStep,
    handleStepSubmit,
    goToPreviousStep,
    calculateProgress,
    finalizeRegistration,
    handleInitialSignUp,
    handleOrganizationDetails,
    handlePlanSelection,
    handleGoogleIntegration,
    handleDataUpload,
    handleTranscriptHandling,
    handleEmailConfiguration,
    handleUserAccounts,
    handleGoogleDriveSetup,
    handleDigitizationPreferences,
    handleTemplateResponses,
    handleOnboardingTutorial,
    setCurrentStepByKey,
  };
}
