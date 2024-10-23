"use client"

import { TranscriptHandlingForm } from '@/components/pages/registration/TranscriptHandlingForm'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export default function TranscriptHandlingPage() {
  const { handleTranscriptHandling } = useRegistrationFlow()

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Transcript Handling</h1>
      <TranscriptHandlingForm onSubmit={handleTranscriptHandling} />
    </div>
  )
}
