"use client"

import { useState } from 'react'
import { useRegistrationFlow } from '@/hooks/registration/useRegistrationFlow'

export function UserAccountsForm() {
  const { handleUserAccounts } = useRegistrationFlow()
  return (
    <div>
      <h1>User Accounts Form</h1>
    </div>
  )
}
