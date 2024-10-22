import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRegisterUser } from './useRegisterUser';
import { useOrganizationRegistration } from './useRegisterOrg';

export interface RegistrationState {
  user: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    email_alias?: string;
  };
  organization: {
    name: string;
    type: 'school' | 'district' | 'other';
    size: 'small' | 'large';
    rosters_uploaded: boolean;
    records_digitized: boolean;
    records_organized: boolean;
    transcripts_uploaded: boolean;
    email_labels_created: boolean;
    email_template_created: boolean;
  };
  plan: {
    name: 'digitize' | 'small' | 'large';
    price: number;
  };
  googleIntegration: boolean;
  dataUpload: boolean;
  transcriptHandling: boolean;
  emailConfiguration: boolean;
  userAccounts: string[];
}

export function useRegistrationFlow() {
  const [registrationState, setRegistrationState] = useState<RegistrationState>({
    user: { email: '', password: '', first_name: '', last_name: '', email_alias: '' },
    organization: { name: '', type: 'school', size: 'small', rosters_uploaded: false, records_digitized: false, records_organized: false, transcripts_uploaded: false, email_labels_created: false, email_template_created: false  },
    plan: { name: 'small', price: 40 },
    googleIntegration: false,
    dataUpload: false,
    transcriptHandling: false,
    emailConfiguration: false,
    userAccounts: [],
  });

  const { getToken } = useAuth();
  const { handleSignUp } = useRegisterUser();
  const { createNewOrganization, setPlan } = useOrganizationRegistration();

  const updateRegistrationState = (update: Partial<RegistrationState>) => {
    setRegistrationState((prev) => ({ ...prev, ...update }));
  };

  const handleInitialSignUp = async (userData: { email: string; password: string; first_name: string; last_name: string }) => {
    try {
      await handleSignUp(userData);
      updateRegistrationState({ user: { email: userData.email, password: userData.password, first_name: userData.first_name, last_name: userData.last_name } });
    } catch (error) {
      console.error('Error during initial sign up:', error);
      throw error;
    }
  };

  const handleOrganizationDetails = async (orgData: { name: string; type: 'school' | 'district' | 'other'; size: 'small' | 'large' }) => {
    try {
      await createNewOrganization(orgData);
      updateRegistrationState({
        organization: {
          ...registrationState.organization,
          ...orgData,
        }
      });
    } catch (error) {
      console.error('Error setting organization details:', error);
      throw error;
    }
  };

  const handlePlanSelection = async (planData: { name: 'digitize' | 'small' | 'large'; price: number }) => {
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

  const handleDataUpload = (uploaded: boolean) => {
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

  return {
    registrationState,
    handleInitialSignUp,
    handleOrganizationDetails,
    handlePlanSelection,
    handleGoogleIntegration,
    handleDataUpload,
    handleTranscriptHandling,
    handleEmailConfiguration,
    handleUserAccounts,
    finalizeRegistration,
  };
}
