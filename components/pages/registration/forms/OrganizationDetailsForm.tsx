"use client"

import { useState } from 'react'
import { RegistrationState } from '@/hooks/registration/useRegistrationFlow'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StepProps } from '../RegistrationPage'

export function OrganizationDetailsForm({ onSubmit, registrationState, onPrevious }: StepProps) {
  const [name, setName] = useState(registrationState.organization.name)
  const [type, setType] = useState<'school' | 'district' | 'other'>(registrationState.organization.type)
  const [size, setSize] = useState<'small' | 'large'>(registrationState.organization.size)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewOrg, setIsNewOrg] = useState(true)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted. IsNewOrg:", isNewOrg, "Name:", name)

    if (!name) {
      toast({
        title: "Error",
        description: "Please enter an organization name.",
        variant: "destructive",
      })
      return
    }

    if (isNewOrg && (!type || !size)) {
      toast({
        title: "Error",
        description: "Please select organization type and size.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ name, type, size, isNewOrg })
      console.log("Form submission successful")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="org-type">Organization Type</Label>
        <RadioGroup value={isNewOrg ? "new" : "existing"} onValueChange={(value) => setIsNewOrg(value === "new")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">New Organization</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing">Existing Organization</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="org-name">Organization Name</Label>
        <Input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isNewOrg ? "Enter your organization name" : "Enter existing organization name"}
          required
        />
      </div>

      {isNewOrg && (
        <>
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
        </>
      )}

      <div className="flex justify-between">
        <Button type="button" onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Next"}
        </Button>
      </div>
    </form>
  )
}
