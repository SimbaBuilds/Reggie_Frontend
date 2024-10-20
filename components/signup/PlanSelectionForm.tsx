"use client"

import { useState, useEffect } from 'react'
import { useSignUpProcess } from 'hooks/useSignUpProcess'

const plans = {
  digitize: { name: 'digitize', price: 100, description: 'Digitize your records' },
  small: { name: 'small', price: 40, description: 'Reggie assistant for smaller organizations (less than 500 people)' },
  large: { name: 'large', price: 80, description: 'Reggie assistant for larger organizations (500+ people)' },
}

export function PlanSelectionForm() {
  const { organizationData, setPlan } = useSignUpProcess()
  const [selectedPlan, setSelectedPlan] = useState<'digitize' | 'small' | 'large'>('digitize')

  useEffect(() => {
    if (organizationData?.size === 'large') {
      setSelectedPlan('large')
    } else {
      setSelectedPlan('small')
    }
  }, [organizationData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPlan({ name: selectedPlan, price: plans[selectedPlan].price })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Select a Plan</h2>
      {Object.entries(plans).map(([key, plan]) => (
        <div key={key} className="flex items-center space-x-3">
          <input
            type="radio"
            id={key}
            name="plan"
            value={key}
            checked={selectedPlan === key}
            onChange={() => setSelectedPlan(key as 'digitize' | 'small' | 'large')}
            className="form-radio"
          />
          <label htmlFor={key} className="flex flex-col">
            <span className="font-medium">{plan.description}</span>
            <span className="text-sm text-gray-500">${plan.price}/month</span>
          </label>
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-medium"
      >
        Continue
      </button>
    </form>
  )
}
