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

