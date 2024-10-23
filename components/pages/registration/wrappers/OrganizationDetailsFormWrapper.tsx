"use client"

import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'
import { OrganizationDetailsForm } from '../OrganizationDetailsForm'
import { useState } from 'react'
import { ExistingOrganizationSelector } from '@/components/pages/registration/ExistingOrganizationSelector'
import { useRouter } from 'next/navigation'

export function OrganizationDetailsFormWrapper() {
  const { registrationState, handleOrganizationDetails, checkExistingOrganization } = useRegistrationFlow()
  const [existingOrgs, setExistingOrgs] = useState<any[]>([])
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    try {
      await handleOrganizationDetails(data)
      router.push('/registration/plan-selection')
    } catch (error) {
      console.error('Error submitting organization details:', error)
    }
  }

  const handleExistingOrg = async (name: string) => {
    try {
      const orgs = await checkExistingOrganization(name)
      if (orgs.length > 0) {
        setExistingOrgs(orgs)
      } else {
        // No existing organizations found, proceed as new organization
        handleSubmit({ name, type: 'school', size: 'small' })
      }
    } catch (error) {
      console.error('Error checking existing organization:', error)
    }
  }

  return (
    <div>
      {existingOrgs.length > 0 ? (
        <ExistingOrganizationSelector organizations={existingOrgs} onSelect={handleSubmit} />
      ) : (
        <OrganizationDetailsForm
          onSubmit={handleSubmit}
          onExistingOrg={handleExistingOrg}
          registrationState={registrationState}
        />
      )}
    </div>
  )
}
