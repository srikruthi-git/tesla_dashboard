export type JobStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'On Hold';

export interface JobApi {
  id: number;
  customer: string;
  installation_type: string;
  status: JobStatus;
  assigned_engineer: string;
  scheduled_date: string;
}

export interface JobCreateRequest {
  customer: string;
  installation_type: string;
  status: JobStatus;
  assigned_engineer: string;
  scheduled_date: string;
}

export interface JobUpdateRequest extends JobCreateRequest {}

export interface JobCreateInput {
  customer: string;
  installationType: string;
  status: JobStatus;
  assignedEngineer: string;
  scheduledDate: string;
}

export interface JobUpdateInput extends JobCreateInput {}

export interface JobRecord {
  id: number;
  customer: string;
  installationType: string;
  status: JobStatus;
  assignedEngineer: string;
  scheduledDate: string;
}
