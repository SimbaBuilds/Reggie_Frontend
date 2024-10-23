"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ExistingOrganizationSelectorProps {
  organizations: Array<{ id: string; name: string; type: string; size: string }>;
  onSelect: (data: any) => Promise<void>;
}

export function ExistingOrganizationSelector({ organizations, onSelect }: ExistingOrganizationSelectorProps) {
  const [selectedOrg, setSelectedOrg] = useState('')
  const [orgId, setOrgId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const org = organizations.find(o => o.id === selectedOrg)
    if (org) {
      onSelect({ ...org, id: orgId })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="org-select">Select Existing Organization</Label>
        <Select value={selectedOrg} onValueChange={setSelectedOrg}>
          <SelectTrigger>
            <SelectValue placeholder="Select an organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
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

      <Button type="submit" disabled={!selectedOrg || !orgId}>
        Join Organization
      </Button>
    </form>
  )
}
