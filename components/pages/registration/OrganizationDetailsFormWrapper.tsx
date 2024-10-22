"use client"

import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'
import { OrganizationDetailsForm } from './OrganizationDetailsForm'
import { useRouter } from 'next/navigation'

export function OrganizationDetailsFormWrapper() {
  const { registrationState, handleOrganizationDetails } = useRegistrationFlow()
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      await handleOrganizationDetails(data)
      router.push('/registration/plan-selection') // Adjust this path as needed
    } catch (error) {
      console.error('Error submitting organization details:', error)
      // Handle error (e.g., show error message)
    }
  }

  return (
    <OrganizationDetailsForm
      onSubmit={handleSubmit}
      registrationState={registrationState}
    />
  )
}
