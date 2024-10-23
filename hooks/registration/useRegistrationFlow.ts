import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useRegistrationSteps } from './useRegistrationSteps';
import { OrganizationType, OrganizationSize, SubscriptionType } from '@/types/types';
import { useInitialRegistration } from './sub-hooks/useInitialRegistration';
import { useOrganizationRegistration } from './sub-hooks/useOrganizationDetails';
import { UserData, OrgData, PlanData, UserResponse } from '@/types/types';
import { DataUpload } from './sub-hooks/useDataUpload';

export interface RegistrationState {
  user: UserData;
  organization: OrgData;
  plan: PlanData;
  googleIntegration: boolean;
  dataUpload: DataUpload;
  googleDriveSetup: boolean;
  digitizationMethod: 'consistentFirstPage' | 'coverPage' | 'manualOrganization' | null;
  transcriptHandling: boolean;
  emailConfiguration: boolean;
  templateResponses: string[];
  userAccounts: string[];
  isOrganizationPrimaryUser: boolean;
  onboardingTutorialCompleted: boolean;
}

export function useRegistrationFlow() {
  const [registrationState, setRegistrationState] = useState<RegistrationState>(() => ({
    user: { email: '', password: '', first_name: '', last_name: '', email_alias: '' },
    organization: {
      id: 0, // or undefined if you prefer
      name: '',
      created_at: '', // or new Date().toISOString() if you want a default
      type: OrganizationType.School,
      size: OrganizationSize.Small,
      created_by: 0, // or undefined
      rosters_uploaded: false,
      records_digitized: false,
      records_organized: false,
      transcripts_uploaded: false,
      email_labels_created: false,
      email_template_created: false,
      subscription_type: SubscriptionType.Free
    },
    plan: { name: SubscriptionType.Free, price: 0 },
    googleIntegration: false,
    dataUpload: {
      studentList: false,
      staffList: false,
    },
    googleDriveSetup: false,
    digitizationMethod: null,
    transcriptHandling: false,
    emailConfiguration: false,
    templateResponses: [],
    userAccounts: [],
    isOrganizationPrimaryUser: false,
    onboardingTutorialCompleted: false,
  }));

  const { getToken } = useAuth();
  const initialRegistration = useInitialRegistration();
  const organizationRegistration = useOrganizationRegistration();
  const router = useRouter();
  const {
    REGISTRATION_STEPS,
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    calculateProgress,
  } = useRegistrationSteps(registrationState);

  const updateRegistrationState = useCallback((update: Partial<RegistrationState>) => {
    setRegistrationState(prev => ({ ...prev, ...update }));
  }, []);

  const handleInitialSignUp = async (signUpResult: UserResponse) => {
    try {
      updateRegistrationState({ user: signUpResult });
    } catch (error) {
      console.error('Error during initial sign up:', error);
      throw error;
    }
  };

  const handleOrganizationDetails = async (orgData: OrgData): Promise<void> => {
    try {
      await organizationRegistration.createNewOrganization(orgData);
      setRegistrationState(prevState => ({
        ...prevState,
        organization: {
          ...prevState.organization,
          ...orgData,
        },
      }));
    } catch (error) {
      console.error('Error setting organization details:', error);
      throw error;
    }
  };

  const handleJoinExistingOrganization = async (organizationId: string) => {
    try {
      await organizationRegistration.joinExistingOrganization(organizationId);
      // Update registration state with joined organization details
      // You might need to fetch the organization details after joining
    } catch (error) {
      console.error('Error joining existing organization:', error);
      throw error;
    }
  };

  const handlePlanSelection = async (planData: PlanData) => {
    try {
      await organizationRegistration.setPlan(planData);
      updateRegistrationState({ plan: planData });
    } catch (error) {
      console.error('Error setting plan:', error);
      throw error;
    }
  };

  const handleGoogleIntegration = (integrated: boolean) => {
    updateRegistrationState({ googleIntegration: integrated });
  };

  const handleDataUpload = (uploaded: { studentList: boolean; staffList: boolean }) => {
    updateRegistrationState({ dataUpload: uploaded });
  };

  const handleTranscriptHandling = (configured: boolean) => {
    updateRegistrationState({ transcriptHandling: configured });
  };

  const handleEmailConfiguration = (configured: boolean) => {
    updateRegistrationState({ emailConfiguration: configured });
  };

  const handleUserAccounts = (accounts: string[]) => {
    updateRegistrationState({ userAccounts: accounts });
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
    updateRegistrationState({ googleDriveSetup: setup });
  };

  const handleDigitizationPreferences = (method: 'consistentFirstPage' | 'coverPage' | 'manualOrganization') => {
    updateRegistrationState({ digitizationMethod: method });
  };

  const handleTemplateResponses = (templates: string[]) => {
    updateRegistrationState({ templateResponses: templates });
  };

  const handleOnboardingTutorial = (completed: boolean) => {
    updateRegistrationState({ onboardingTutorialCompleted: completed });
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
    handleJoinExistingOrganization,
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
  };
}
