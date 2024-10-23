"use client"

import { useState } from 'react'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export function TranscriptHandlingForm() {
  const { handleTranscriptHandling } = useRegistrationFlow()
  return (
    <div>
      <h1>Transcript Handling Form</h1>
    </div>
  )
}
