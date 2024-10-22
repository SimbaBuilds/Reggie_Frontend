"use client"

import { useState } from 'react'
import { RegistrationState } from 'hooks/registration/useRegistrationFlow'

interface OrganizationDetailsFormProps {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
}

export function OrganizationDetailsForm({ onSubmit, registrationState }: OrganizationDetailsFormProps) {
  const [name, setName] = useState(registrationState.organization.name)
  const [type, setType] = useState<'school' | 'district' | 'other'>(registrationState.organization.type)
  const [size, setSize] = useState<'small' | 'large'>(registrationState.organization.size)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, type, size })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields here */}
    </form>
  )
}
