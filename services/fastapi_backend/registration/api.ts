import { UserData, UserResponse } from '../../../hooks/registration/sub-hooks/useInitialRegistration';
import { OrganizationData, PlanData } from '../../../hooks/registration/sub-hooks/useOrganizationDetails';
import { ExistingOrganization } from '../../../hooks/registration/sub-hooks/useOrganizationDetails';

const API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL;

export async function signUpUser(userData: UserData): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/api/registration/signup/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Signup failed with status ${response.status}`);
  }

  return await response.json();
}

export async function startSignupProcess(userData: UserData): Promise<void> {
  await fetch(`${API_BASE_URL}/signup/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
}

export async function checkExistingOrganizations(name: string, token: string): Promise<ExistingOrganization[]> {
  const response = await fetch(`${API_BASE_URL}/api/organizations?name=${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch organizations');
  const data = await response.json();
  return data.data;
}

export async function createOrganization(orgData: OrganizationData, token: string): Promise<OrganizationData> {
  const response = await fetch(`${API_BASE_URL}/api/organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orgData),
  });

  if (!response.ok) throw new Error('Failed to create organization');
  const data = await response.json();
  return data.data;
}

export async function joinOrganization(organizationId: string, token: string): Promise<OrganizationData> {
  const response = await fetch(`${API_BASE_URL}/api/join-organization`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ organization_id: organizationId }),
  });

  if (!response.ok) throw new Error('Failed to join organization');
  const data = await response.json();
  return data.data;
}

export async function setPlan(planData: PlanData, token: string): Promise<OrganizationData> {
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
