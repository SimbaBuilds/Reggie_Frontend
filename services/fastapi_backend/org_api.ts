import { OrgCreateData, OrgData, PlanData, ExistingOrganization } from '@/types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL;

  
  export async function createOrganization(createOrgData: OrgCreateData): Promise<OrgData> {
    try {
      // Ensure created_by is included in the data
      if (!createOrgData.created_by) {
        throw new Error('created_by is required for organization creation');
      }

      console.log('Creating new organization:', JSON.stringify(createOrgData, null, 2));
      const response = await fetch(`${API_BASE_URL}/api/registration/create/organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createOrgData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }
  
  export async function checkExistingOrganizations(name: string, id: number): Promise<ExistingOrganization[]> {
    console.log('Checking existing organizations with name:', name, 'and id:', id);
    const response = await fetch(`${API_BASE_URL}/api/organizations?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      console.error('Failed to fetch organizations:', response.status, response.statusText);
      throw new Error('Failed to fetch organizations');
    }
    const data = await response.json();
    console.log('Existing organizations found:', data.data);
    return data.data;
  }

  export async function joinOrganization(organizationId: number): Promise<OrgData> {
    console.log('Joining organization with ID:', organizationId);
    const response = await fetch(`${API_BASE_URL}/api/join-organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organization_id: organizationId }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to join organization:', response.status, errorData);
      throw new Error(errorData.detail || `Failed to join organization with status ${response.status}`);
    }
  
    const joinedOrg = await response.json();
    console.log('Successfully joined organization:', joinedOrg);
    return joinedOrg;
  }
  
  export async function setPlan(planData: PlanData, token: string): Promise<PlanData> {
    const response = await fetch(`${API_BASE_URL}/api/plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(planData),
    });
  
    if (!response.ok) throw new Error('Failed to set plan');
    const data = await response.json();
    return data.data;
  }
  
