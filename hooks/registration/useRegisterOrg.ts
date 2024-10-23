import { useState } from 'react';
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
  const [existingOrganizations, setExistingOrganizations] = useState<ExistingOrganization[]>([]);
  const { getToken } = useAuth();

  const checkExistingOrganization = async (name: string): Promise<ExistingOrganization[]> => {
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
      return data.data;
    } catch (error) {
      console.error('Error checking existing organizations:', error);
      return [];
    }
  };

  const createNewOrganization = async (orgData: OrganizationData): Promise<void> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL}/api/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orgData),
      });
      if (!response.ok) throw new Error('Failed to create organization');
      const data = await response.json();
      setOrganizationData(data.data);
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const joinExistingOrganization = async (organizationId: string): Promise<void> => {
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
    } catch (error) {
      console.error('Error joining organization:', error);
      throw error;
    }
  };

  const setPlan = async (planData: PlanData): Promise<void> => {
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
      setOrganizationData(prev => ({ ...prev, ...data.data }));
    } catch (error) {
      console.error('Error setting plan:', error);
      throw error;
    }
  };

  return {
    organizationData,
    existingOrganizations,
    checkExistingOrganization,
    createNewOrganization,
    joinExistingOrganization,
    setPlan,
  };
}
