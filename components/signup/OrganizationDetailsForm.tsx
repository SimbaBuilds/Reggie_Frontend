"use client"

import { useState, useEffect } from 'react'
import { useSignUpProcess } from 'hooks/useSignUpProcess'

export function OrganizationDetailsForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState<'school' | 'district' | 'other'>('school')
  const [size, setSize] = useState<'small' | 'large'>('small')
  const { checkExistingOrganization, joinExistingOrganization, existingOrganizations, createNewOrganization } = useSignUpProcess()
  const [isChecking, setIsChecking] = useState(false)
  const [showExisting, setShowExisting] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (name.length > 2) {
        setIsChecking(true)
        try {
          const exists = await checkExistingOrganization(name)
          setShowExisting(exists)
        } catch (error) {
          console.error('Error checking organizations:', error)
          // Optionally show an error message to the user
        } finally {
          setIsChecking(false)
        }
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createNewOrganization({ name, type, size })
  }

  const handleJoinOrganization = async (organizationId: string) => {
    try {
      await joinExistingOrganization(organizationId)
    } catch (error) {
      console.error('Error joining organization:', error)
      // Optionally show an error message to the user
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Organization Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {isChecking && <p className="text-sm text-gray-500">Checking...</p>}
      </div>
      {showExisting && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Existing organizations found:</p>
          <ul className="mt-2 space-y-2">
            {existingOrganizations.map((org) => (
              <li key={org.id} className="flex items-center justify-between">
                <span>{org.name}</span>
                <button
                  type="button"
                  onClick={() => handleJoinOrganization(org.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!showExisting && (
        <>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Organization Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'school' | 'district' | 'other')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="school">School</option>
              <option value="district">District</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Organization Size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value as 'small' | 'large')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="small">Small (Less than 500 people)</option>
              <option value="large">Large (500+ people)</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-medium"
          >
            Continue
          </button>
        </>
      )}
    </form>
  )
}
