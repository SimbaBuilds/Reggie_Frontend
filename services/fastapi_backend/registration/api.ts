import { OrgData, PlanData, ExistingOrganization, UserData, UserResponse } from '@/types/types';

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

export async function createOrganization(orgData: OrgData, token: string): Promise<OrgData> {
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

export async function joinOrganization(organizationId: string, token: string): Promise<OrgData> {
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
