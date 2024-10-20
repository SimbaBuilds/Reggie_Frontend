import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export function useSignUpProcess() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const router = useRouter();

  const startSignUpProcess = async (data: UserData) => {
    setUserData(data);
    router.push('/signup/organization-details');
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

  return { 
    startSignUpProcess,
    setOrganizationDetails,
    setPlan,
    userData,
    organizationData,
    planData,
    completeSignUp 
  };
}
