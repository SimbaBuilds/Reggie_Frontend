"use client"

import { useState } from 'react'
import { useSignUpProcess } from '@/hooks/useSignUpProcess'

export function OrganizationDetailsForm() {
  const [name, setName] = useState('')
  const [type, setType] = useState<'school' | 'district' | 'other'>('school')
  const [size, setSize] = useState<'small' | 'large'>('small')
  const { setOrganizationDetails } = useSignUpProcess()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrganizationDetails({ name, type, size })
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
      </div>
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
    </form>
  )
}
