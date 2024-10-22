"use client"

import { useState } from 'react'
import { RegistrationState } from '@/hooks/registration/useRegistrationFlow'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface OrganizationDetailsFormProps {
  onSubmit: (data: any) => Promise<void>;
  registrationState: RegistrationState;
}

export function OrganizationDetailsForm({ onSubmit, registrationState }: OrganizationDetailsFormProps) {
  const [name, setName] = useState(registrationState.organization.name)
  const [type, setType] = useState<'school' | 'district' | 'other'>(registrationState.organization.type)
  const [size, setSize] = useState<'small' | 'large'>(registrationState.organization.size)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !type || !size) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit({ name, type, size })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An error occurred while submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="org-name">Organization Name</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your organization name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Organization Type</Label>
        <RadioGroup value={type} onValueChange={(value: 'school' | 'district' | 'other') => setType(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="school" id="school" />
            <Label htmlFor="school">School</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="district" id="district" />
            <Label htmlFor="district">District</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Organization Size</Label>
        <RadioGroup value={size} onValueChange={(value: 'small' | 'large') => setSize(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small">Small (Less than 1000 people)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="large" />
            <Label htmlFor="large">Large (1000 or more people)</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Next"}
      </Button>
    </form>
  )
}
