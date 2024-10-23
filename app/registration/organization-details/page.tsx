"use client"

import { OrganizationDetailsFormWrapper } from '@/components/pages/registration/wrappers/OrganizationDetailsFormWrapper'

export default function OrganizationDetailsPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Organization Details</h1>
      <OrganizationDetailsFormWrapper />
    </div>
  )
}
