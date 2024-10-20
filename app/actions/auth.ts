'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (response.ok) {
    cookies().delete('auth_token')
    redirect('/login')
  } else {
    throw new Error('Logout failed')
  }
}

