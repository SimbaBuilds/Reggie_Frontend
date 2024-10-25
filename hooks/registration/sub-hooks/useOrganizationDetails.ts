import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { OrgData, ExistingOrganization, OrganizationType, OrganizationSize, PlanData } from '@/types/types';
import { checkExistingOrganizations, createOrganization, joinOrganization } from '../../../services/fastapi_backend/registration/api';
import { useToast } from '@/hooks/use-toast';


// Update the OrganizationDetailsFormData type
type OrganizationDetailsFormData = OrgData & {
  isNewOrg: boolean;
  selectedOrgId: string;
};

export function useOrganizationDetails() {
  const [formData, setFormData] = useState<OrganizationDetailsFormData>({
    name: '',
    type: '' as OrganizationType, // Use type assertion
    size: '' as OrganizationSize, // Use type assertion
    isNewOrg: true,
    selectedOrgId: '',
  });
  const [existingOrganizations, setExistingOrganizations] = useState<ExistingOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkExistingOrganization = async (name: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      const data = await checkExistingOrganizations(name, token);
      setExistingOrganizations(data);
    } catch (error) {
      console.error('Error checking existing organizations:', error);
      toast({
        title: "Error",
        description: "Failed to check existing organizations",
        variant: "destructive",
      });
    }
  };

  
  const setPlan = async (planData: PlanData) => {
    setFormData(prev => ({ ...prev, subscription_type: planData.subscription_type }));
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available');

      let orgData: OrgData;
      let isPrimaryUser: boolean;

      if (formData.isNewOrg) {
        orgData = await createOrganization({
          name: formData.name,
          type: formData.type,
          size: formData.size,
        }, token);
        isPrimaryUser = true;
      } else {
        if (!formData.selectedOrgId) throw new Error('No organization selected');
        orgData = await joinOrganization(formData.selectedOrgId, token);
        isPrimaryUser = false;
      }

      toast({
        title: "Success",
        description: formData.isNewOrg ? "Organization created successfully" : "Joined organization successfully",
      });

      return { orgData, isPrimaryUser };
    } catch (error) {
      console.error('Error submitting organization details:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    existingOrganizations,
    isLoading,
    handleInputChange,
    handleRadioChange,
    checkExistingOrganization,
    handleSubmit,
  };
}
