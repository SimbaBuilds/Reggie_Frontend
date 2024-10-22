import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth';


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



export function useOrganizationRegistration() {
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [planData] = useState<PlanData | null>(null);
  const [existingOrganizations, setExistingOrganizations] = useState<ExistingOrganization[]>([]);
  const router = useRouter();
  const {getToken } = useAuth();
  
  
  const setOrganizationDetails = (data: OrganizationData) => {
    setOrganizationData(data);
    router.push('/signup/plan-selection');
  };
  
  
  const checkExistingOrganization = async (name: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/organizations?name=${encodeURIComponent(name)}`, {
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
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/join-organization`, {
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
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/organization`, {
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

  const setPlan = async (planData: PlanData) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });
      if (!response.ok) throw new Error('Failed to set plan');
      const data = await response.json();
      setOrganizationData(data.data);
    } catch (error) {
      console.error('Error setting plan:', error);
      alert('Failed to set plan. Please try again.');
    }
  };
  
  return { 
    setOrganizationDetails,
    organizationData,
    planData,
    checkExistingOrganization,
    joinExistingOrganization,
    existingOrganizations,
    createNewOrganization,
    setPlan,
  };
}
