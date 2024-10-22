"use client"

import { OrganizationDetailsForm } from '@/components/pages/registration/OrganizationDetailsForm'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export default function OrganizationDetailsPage() {
  const { registrationState, handleOrganizationDetails } = useRegistrationFlow()

  const handleSubmit = async (data: any) => {
    await handleOrganizationDetails(data)
    // You can add navigation logic here if needed
  }

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <OrganizationDetailsForm
          onSubmit={handleSubmit}
          registrationState={registrationState}
        />
      </div>
    </div>
  )
}
