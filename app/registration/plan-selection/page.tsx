"use client"

import { PlanSelectionForm } from '@/components/pages/registration/PlanSelectionForm'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export default function PlanSelectionPage() {
  const { handlePlanSelection } = useRegistrationFlow()

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Select a Plan</h1>
      <PlanSelectionForm onSubmit={handlePlanSelection} />
    </div>
  )
}
