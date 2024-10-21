import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface OrganizationData {
  name: string;
  type: 'school' | 'district' | 'other';
  size: 'small' | 'large';
}

interface PlanData {
  name: 'digitize' | 'small' | 'large';
  price: number;
}

interface ExistingOrganization {
  id: string;
  name: string;
  type: 'school' | 'district' | 'other';
  size: 'small' | 'large';
}

export function useSignUpProcess() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [existingOrganizations, setExistingOrganizations] = useState<ExistingOrganization[]>([]);
  const router = useRouter();
  const { signup, getToken } = useAuth();

  const startSignUpProcess = async (data: UserData) => {
    try {
      await signup(data.email, data.password);
      setUserData(data);
      router.push('/signup/organization-details');
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error (e.g., show error message to user)
    }
  };

  const setOrganizationDetails = (data: OrganizationData) => {
    setOrganizationData(data);
    router.push('/signup/plan-selection');
  };

  const setPlan = async (plan: PlanData) => {
    setPlanData(plan);
    // Here you would typically send all the collected data to your backend
    // For now, we'll just simulate this and move to the next step
    console.log('Signup data:', { userData, organizationData, planData: plan });
    router.push('/signup/google-integration');
  };

  const completeSignUp = async () => {
    // Implement the logic to complete the sign-up process
    // This might involve sending all collected data to your backend
    console.log('Completing sign-up with data:', { userData, organizationData, planData });
    // Add API call here
    router.push('/dashboard'); // or wherever you want to redirect after signup
  };

  const checkExistingOrganization = async (name: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations?name=${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setExistingOrganizations(data.data);
      return data.data.length > 0;
    } catch (error) {
      console.error('Error checking existing organizations:', error);
      return false;
    }
  };

  const joinExistingOrganization = async (organizationId: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/join-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ organization_id: organizationId }),
      });
      if (!response.ok) throw new Error('Failed to join organization');
      const data = await response.json();
      setOrganizationData(data.data);
      router.push('/signup/google-integration');
    } catch (error) {
      console.error('Error joining organization:', error);
      alert('Failed to join organization. Please try again.');
    }
  };

  const createNewOrganization = async (organizationData: OrganizationData) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(organizationData),
      });
      if (!response.ok) throw new Error('Failed to create organization');
      const data = await response.json();
      setOrganizationData(data.data);
      router.push('/signup/plan-selection');
    } catch (error) {
      console.error('Error creating organization:', error);
      alert('Failed to create organization. Please try again.');
    }
  };

  return { 
    startSignUpProcess,
    setOrganizationDetails,
    setPlan,
    userData,
    organizationData,
    planData,
    completeSignUp,
    checkExistingOrganization,
    joinExistingOrganization,
    existingOrganizations,
    createNewOrganization,
  };
}
