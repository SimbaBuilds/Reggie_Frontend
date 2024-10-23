import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOrganizationRegistration, PlanData } from './sub-hooks/useOrganizationDetails';
import { useRouter } from 'next/navigation';
import { useRegistrationSteps } from './useRegistrationSteps';
import { OrganizationType, OrganizationSize, SubscriptionType } from '@/types/db_models';
import { useInitialRegistration, UserData } from './sub-hooks/useInitialRegistration';

export interface RegistrationState {
  user: UserData;
  organization: {
    name: string;
    type: OrganizationType;
    size: OrganizationSize;
    rosters_uploaded: boolean;
    records_digitized: boolean;
    records_organized: boolean;
    transcripts_uploaded: boolean;
    email_labels_created: boolean;
    email_template_created: boolean;
  };
  plan: PlanData;
  googleIntegration: boolean;
  dataUpload: {
    studentList: boolean;
    staffList: boolean;
  };
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
  const [registrationState, setRegistrationState] = useState<RegistrationState>({
    user: { email: '', password: '', first_name: '', last_name: '', email_alias: '' },
    organization: { 
      name: '', 
      type: OrganizationType.School, 
      size: OrganizationSize.Small, 
      rosters_uploaded: false, 
      records_digitized: false, 
      records_organized: false, 
      transcripts_uploaded: false, 
      email_labels_created: false, 
      email_template_created: false  
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
  });

  const { getToken } = useAuth();
  const { handleSignUp, handleGoogleSignUpClick } = useInitialRegistration();
  const { createNewOrganization, joinExistingOrganization, setPlan, checkExistingOrganization } = useOrganizationRegistration();
  const router = useRouter();
  const {
    REGISTRATION_STEPS,
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    calculateProgress,
  } = useRegistrationSteps(registrationState);

  const updateRegistrationState = (update: Partial<RegistrationState>) => {
    setRegistrationState((prev) => ({ ...prev, ...update }));
  };

  const handleInitialSignUp = async (userData: UserData) => {
    try {
      const signUpResult = await handleSignUp(userData);
      updateRegistrationState({ user: signUpResult });
    } catch (error) {
      console.error('Error during initial sign up:', error);
      throw error;
    }
  };

  const handleOrganizationDetails = async (orgData: { name: string; type: OrganizationType; size: OrganizationSize }) => {
    try {
      await createNewOrganization(orgData);
      updateRegistrationState({
        organization: {
          ...registrationState.organization,
          ...orgData,
        }
      });
      return true;
    } catch (error) {
      console.error('Error setting organization details:', error);
      throw error;
    }
  };

  const handleJoinExistingOrganization = async (organizationId: string) => {
    try {
      await joinExistingOrganization(organizationId);
      // Update registration state with joined organization details
      // You might need to fetch the organization details after joining
    } catch (error) {
      console.error('Error joining existing organization:', error);
      throw error;
    }
  };

  const handlePlanSelection = async (planData: PlanData) => {
    try {
      await setPlan(planData);
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

  const handleStepSubmit = async (data: any) => {
    switch (currentStep.key) {
      case 'initialSignUp':
        await handleInitialSignUp(data);
        break;
      case 'organizationDetails':
        await handleOrganizationDetails(data);
        break;
      case 'planSelection':
        await handlePlanSelection(data);
        break;
      case 'googleIntegration':
        handleGoogleIntegration(data);
        break;
      case 'dataUpload':
        handleDataUpload(data);
        break;
      case 'googleDriveSetup':
        handleGoogleDriveSetup(data);
        break;
      case 'digitizationPreferences':
        handleDigitizationPreferences(data);
        break;
      case 'emailConfiguration':
        handleEmailConfiguration(data);
        break;
      case 'transcriptHandling':
        handleTranscriptHandling(data);
        break;
      case 'templateResponses':
        handleTemplateResponses(data);
        break;
      case 'userAccounts':
        handleUserAccounts(data);
        break;
      case 'onboardingTutorial':
        handleOnboardingTutorial(data);
        break;
      default:
        console.error('Unknown step:', currentStep.key);
    }
    goToNextStep();
  };

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
    handleGoogleSignUpClick,
    checkExistingOrganization,
    handleGoogleDriveSetup,
    handleDigitizationPreferences,
    handleTemplateResponses,
    handleOnboardingTutorial,
  };
}
