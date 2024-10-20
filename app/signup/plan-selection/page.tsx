import { PlanSelectionForm } from '@/components/signup/PlanSelectionForm'

export default function PlanSelectionPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Select a Plan</h1>
      <PlanSelectionForm />
    </div>
  )
}
