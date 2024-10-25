import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { OrganizationDetailsFormData, ExistingOrganization, OrganizationType, OrganizationSize, PlanData, OrgData, OrgCreateData } from '@/types/types';
import { checkExistingOrganizations, createOrganization, joinOrganization } from '../../../services/fastapi_backend/org_api';
import { useToast } from '@/hooks/use-toast';
import { RegistrationState } from '@/hooks/registration/useRegistrationFlow';



export function useOrganizationDetails(registrationState: RegistrationState) {
  const [formData, setFormData] = useState<OrganizationDetailsFormData>({
    name: '',
    type: '' as OrganizationType, // Use type assertion
    size: '' as OrganizationSize, // Use type assertion
    created_by: 0,
    isNewOrg: true,
    selectedOrgId: 0,
  });
  const [existingOrganizations, setExistingOrganizations] = useState<ExistingOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChangeNewExisting = (name: string, value: string) => {
    console.log(`Radio changed: ${name} = ${value}`);
    if (value === "new") {
      setFormData(prev => ({ ...prev, [name]: true }));
    } else {
      setFormData(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    console.log(`Radio changed: ${name} = ${value}`);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkExistingOrganization = async (name: string, id: number) => {
    console.log(`Checking existing organizations for name: ${name} and id: ${id}`);
    try {
      const data = await checkExistingOrganizations(name, id);
      console.log('Existing organizations found:', data);
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
    console.log('Setting plan:', planData);
    setFormData(prev => ({ ...prev, type: planData.type }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting organization details:', formData);

    try {
      let orgData: OrgData;
      let isPrimaryUser: boolean;

      if (formData.isNewOrg) {
        if (!registrationState.user?.id) {
          throw new Error('User ID is not available');
        }
        const createOrgData: OrgCreateData = {
          name: formData.name,
          type: formData.type as OrganizationType,
          size: formData.size as OrganizationSize,
          created_by: registrationState.user.id,
        };
        orgData = await createOrganization(createOrgData);
        isPrimaryUser = true;
      } else {
        if (!formData.selectedOrgId) throw new Error('No organization selected');
        console.log('Joining existing organization');
        orgData = await joinOrganization(formData.selectedOrgId);
        isPrimaryUser = false;
      }

      console.log('Organization operation successful:', orgData);
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
    handleRadioChangeNewExisting,
    checkExistingOrganization,
    handleSubmit,
  };
}
