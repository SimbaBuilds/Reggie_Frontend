"use client"

import React from 'react'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { registrationState } = useRegistrationFlow()

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registration</h1>
        <main className="mb-6">
          {children}
        </main>
        <footer className="text-sm text-gray-600 text-center">
          Registration Progress: {Object.keys(registrationState).filter(key => (registrationState as any)[key]).length} / {Object.keys(registrationState).length} steps completed
        </footer>
      </div>
    </div>
  )
}
