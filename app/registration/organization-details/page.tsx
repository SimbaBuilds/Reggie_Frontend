"use client"

import { OrganizationDetailsFormWrapper } from '@/components/pages/registration/OrganizationDetailsFormWrapper'

export default function OrganizationDetailsPage() {
  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <OrganizationDetailsFormWrapper />
      </div>
    </div>
  )
}
