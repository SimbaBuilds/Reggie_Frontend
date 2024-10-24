"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StepProps } from '../RegistrationPage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganizationDetails } from '@/hooks/registration/sub-hooks/useOrganizationDetails'
import { OrgData, ExistingOrganization, PlanData } from '@/types/types';


export function OrganizationDetailsForm({ onSubmit, registrationState, onPrevious }: StepProps) {
  const [name, setName] = useState(registrationState.organization.name)
  const [type, setType] = useState<'school' | 'district' | 'other'>(registrationState.organization.type)
  const [size, setSize] = useState<'small' | 'large'>(registrationState.organization.size)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNewOrg, setIsNewOrg] = useState(true)
  const [selectedOrg, setSelectedOrg] = useState('')
  const [orgId, setOrgId] = useState('')
  const { toast } = useToast()

  const {
    organizationData,
    existingOrganizations,
    checkExistingOrganization,
    createNewOrganization,
    joinExistingOrganization,
  } = useOrganizationDetails()

  useEffect(() => {
    if (!isNewOrg) {
      checkExistingOrganization(name)
    }
  }, [isNewOrg, name, checkExistingOrganization])

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
      if (isNewOrg) {
        await createNewOrganization({ name, type, size } as OrgData)
      } else {
        await joinExistingOrganization(selectedOrg)
      }
      console.log("Form submission successful")
      onSubmit(organizationData)
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

      {isNewOrg ? (
        <>
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
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="org-select">Select Existing Organization</Label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {existingOrganizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name} ({org.type}, {org.size})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-id">Organization ID</Label>
            <Input
              id="org-id"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              placeholder="Enter organization ID"
              required
            />
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
