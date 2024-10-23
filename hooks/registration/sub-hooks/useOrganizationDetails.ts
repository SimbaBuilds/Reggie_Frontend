import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { SubscriptionType } from '@/types/db_models';
import { checkExistingOrganizations, createOrganization, joinOrganization, setPlan } from '../../../services/fastapi_backend/registration/api';

export interface OrganizationData {
  name: string;
  type: 'school' | 'district' | 'other';
  size: 'small' | 'large';
}

export type PlanData = {
  name: SubscriptionType;
  price: number;
};

export interface ExistingOrganization {
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

      const data = await checkExistingOrganizations(name, token);
      setExistingOrganizations(data);
      return data;
    } catch (error) {
      console.error('Error checking existing organizations:', error);
      return [];
    }
  };

  const createNewOrganization = async (orgData: OrganizationData): Promise<void> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const data = await createOrganization(orgData, token);
      setOrganizationData(data);
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const joinExistingOrganization = async (organizationId: string): Promise<void> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const data = await joinOrganization(organizationId, token);
      setOrganizationData(data);
    } catch (error) {
      console.error('Error joining organization:', error);
      throw error;
    }
  };

  const setOrganizationPlan = async (planData: PlanData): Promise<void> => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const data = await setPlan(planData, token);
      setOrganizationData(prev => ({ ...prev, ...data }));
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
    setPlan: setOrganizationPlan,
  };
}
