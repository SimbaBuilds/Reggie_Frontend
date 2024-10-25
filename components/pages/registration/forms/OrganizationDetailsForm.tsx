"use client"

import { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrganizationDetails } from '@/hooks/registration/sub-hooks/useOrganizationDetails'
import { StepProps } from '../RegistrationPage'

export function OrganizationDetailsForm({ onSubmit, registrationState }: StepProps) {
  const {
    formData,
    existingOrganizations,
    isLoading,
    handleInputChange,
    handleRadioChange,
    checkExistingOrganization,
    handleSubmit,
  } = useOrganizationDetails();

  useEffect(() => {
    if (!formData.isNewOrg && formData.name) {
      checkExistingOrganization(formData.name);
    }
  }, [formData.isNewOrg, formData.name, checkExistingOrganization]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { orgData, isPrimaryUser } = await handleSubmit(e);
      onSubmit({ ...orgData, isPrimaryUser });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="org-type">Organization Type</Label>
        <RadioGroup value={formData.isNewOrg ? "new" : "existing"} onValueChange={(value) => handleRadioChange('isNewOrg', value === "new" ? "true" : "false")}>
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

      {formData.isNewOrg ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Organization Type</Label>
            <RadioGroup value={formData.type} onValueChange={(value) => handleRadioChange('type', value)}>
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
            <RadioGroup value={formData.size} onValueChange={(value) => handleRadioChange('size', value)}>
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
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter organization name to search"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectedOrgId">Select Existing Organization</Label>
            <Select name="selectedOrgId" value={formData.selectedOrgId} onValueChange={(value) => handleRadioChange('selectedOrgId', value)}>
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
              name="selectedOrgId"
              value={formData.selectedOrgId || ''}
              onChange={handleInputChange}
              placeholder="Enter organization ID"
              required
            />
          </div>
        </>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
