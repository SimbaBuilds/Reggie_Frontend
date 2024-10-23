// Replace enums with const objects and union types
export const SubscriptionType = {
  Free: "free",
  DigitizeOnly: "digitize_only",
  Full: "full",
} as const;
export type SubscriptionType = typeof SubscriptionType[keyof typeof SubscriptionType];

export const OrganizationType = {
  School: "school",
  District: "district",
  Other: "other",
} as const;
export type OrganizationType = typeof OrganizationType[keyof typeof OrganizationType];

export const OrganizationSize = {
  Small: "small",
  Large: "large",
} as const;
export type OrganizationSize = typeof OrganizationSize[keyof typeof OrganizationSize];

export const ProcessingStatus = {
  Pending: "pending",
  Processing: "processing",
  Uploaded: "uploaded",
  Failed: "failed",
} as const;
export type ProcessingStatus = typeof ProcessingStatus[keyof typeof ProcessingStatus];

export const JobStatus = {
  Pending: "pending",
  InProgress: "in_progress",
  Completed: "completed",
  Failed: "failed",
} as const;
export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export interface OrgData {
  id: number;
  name: string;
  created_at: string;
  type: OrganizationType;
  size: OrganizationSize;
  created_by: number;
  rosters_uploaded: boolean;
  records_digitized: boolean;
  records_organized: boolean;
  transcripts_uploaded: boolean;
  email_labels_created: boolean;
  email_template_created: boolean;
  subscription_type: SubscriptionType;
  }


export interface UserData {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  email_alias?: string;
}


export interface Student {
  id?: number;
  organization_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Staff {
  id?: number;
  organization_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface RecordProcessing {
  id?: number;
  student_id?: number;
  staff_id?: number;
  original_filename: string;
  status: ProcessingStatus;
  error_message?: string;
  created_at: string; // ISO date string
  processed_at?: string; // ISO date string
  cloud_upload_path?: string;
}

export interface DigitizationJob {
  id?: number;
  user_id: number;
  status: JobStatus;
  created_at: string; // ISO date string
  completed_at?: string; // ISO date string
}

export interface EmailAutomation {
  id?: number;
  user_id: number;
  label: string;
  is_active: boolean;
  created_at: string; // ISO date string
  last_triggered?: string; // ISO date string
  total_emails_processed: number;
}

export interface EmailTemplate {
  id?: number;
  user_id: number;
  name: string;
  description?: string;
  content: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface AuditLog {
  id?: number;
  user_id: number;
  action: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO date string
}

export interface UserUsage {
  id?: number;
  user_id: number;
  date: string; // ISO date string
  emails_sent_to_reggie: number;
  cumulative_files_processed: number;
  miscellaneous_labeled_processed: number;
  miscellaneous_unlabeled_processed: number;
  records_requests_processed: number;
  template_responses_processed: number;
}

export interface EmailThreadInfo {
  thread_id: string;
  history_id?: string;
}



  
export interface UserResponse extends UserData {
id: string;
message: string;
}



export interface PlanData {
name: SubscriptionType;
price: number;
}

export interface ExistingOrganization {
id: string;
name: string;
type: OrganizationType;
size: OrganizationSize;
}