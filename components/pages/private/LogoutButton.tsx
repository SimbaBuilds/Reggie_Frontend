'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page or login page after successful logout
    } catch (error) {
      console.error('Logout failed:', error)
      // Handle logout error (e.g., show an error message to the user)
    }
  }

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  )
}
