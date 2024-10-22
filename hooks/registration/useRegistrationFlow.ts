import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { useRegisterUser } from './useRegisterUser';
import { useOrganizationRegistration } from './useRegisterOrg';

export interface RegistrationState {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  organization: {
    name: string;
    type: 'school' | 'district' | 'other';
    size: 'small' | 'large';
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
    user: { email: '', firstName: '', lastName: '' },
    organization: { name: '', type: 'school', size: 'small' },
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

  const handleInitialSignUp = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      await handleSignUp(userData);
      updateRegistrationState({ user: { email: userData.email, firstName: userData.firstName, lastName: userData.lastName } });
    } catch (error) {
      console.error('Error during initial sign up:', error);
      throw error;
    }
  };

  const handleOrganizationDetails = async (orgData: { name: string; type: 'school' | 'district' | 'other'; size: 'small' | 'large' }) => {
    try {
      await createNewOrganization(orgData);
      updateRegistrationState({ organization: orgData });
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
