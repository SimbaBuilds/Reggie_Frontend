"use client"

import { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useOrganizationDetails } from '@/hooks/registration/sub-hooks/useOrganizationDetails'
import { StepProps } from '../RegistrationPage'

export function OrganizationDetailsForm({ onSubmit, registrationState }: StepProps) {
  const {
    formData,
    existingOrganizations,
    isLoading,
    handleInputChange,
    handleRadioChange,
    handleRadioChangeNewExisting,
    checkExistingOrganization,
    handleSubmit,
  } = useOrganizationDetails(registrationState);

  useEffect(() => {
    if (!formData.isNewOrg && (formData.name || formData.selectedOrgId)) {
      checkExistingOrganization(formData.name, formData.selectedOrgId ?? 0);
    }
  }, [formData.isNewOrg, formData.name, formData.selectedOrgId, checkExistingOrganization]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await handleSubmit(e);
      onSubmit(result);
    } catch (error) {
      // Error is already handled in handleSubmit
    }
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="org-type">Organization New/Existing</Label>
        <RadioGroup 
          value={formData.isNewOrg ? "new" : "existing"} 
          onValueChange={(value) => handleRadioChangeNewExisting('isNewOrg', value)}
        >
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
            <Label htmlFor="type">Organization Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value) => handleRadioChange('type', value)}
              name="type"
              required
            >
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
            <Label htmlFor="size">Organization Size</Label>
            <RadioGroup 
              value={formData.size} 
              onValueChange={(value) => handleRadioChange('size', value)}
              name="size"
              required
            >
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
              placeholder="Enter existing organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selectedOrgId">Organization ID</Label>
            <Input
              id="selectedOrgId"
              name="selectedOrgId"
              value={formData.selectedOrgId?.toString() || ''}
              onChange={(e) => handleInputChange(e)}
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
