export enum SubscriptionType {
  Free = "free",
  DigitizeOnly = "digitize_only",
  Full = "full",
}

export enum OrganizationType {
  School = "school",
  District = "district",
  Other = "other",
}

export enum OrganizationSize {
  Small = "small",
  Large = "large",
}

export enum ProcessingStatus {
  Pending = "pending",
  Processing = "processing",
  Uploaded = "uploaded",
  Failed = "failed",
}

export enum JobStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
  Failed = "failed",
}

export interface User {
  id?: number;
  email: string;
  hashed_password?: string;
  first_name: string;
  last_name: string;
  organization_id: number;
  organization_name: string;
  created_at: string; // ISO date string
  last_login?: string; // ISO date string
  email_alias?: string;
}

export interface Organization {
  id: number;
  name: string;
  created_at: string; // ISO date string
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

