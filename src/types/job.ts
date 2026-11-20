export interface Job {
  _id?: string;
  jobTitle: string;
  companyName: string;
  jobCategory: string;
  jobType: string;
  remoteWork?: boolean;
  jobLocation: string;
  applicationDeadline?: string;
  minSalary?: number;
  maxSalary?: number;
  frequency?: string;
  responsibilities?: string;
  qualifications?: string;
  applicantCount?: number;
  status?: "active" | "expired";
}

export interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobCategory: string;
  jobType: string;
  remoteWork: boolean;
  jobLocation: string;
  applicationDeadline: string;
  minSalary: number;
  maxSalary: number;
  frequency: string;
  responsibilities: string;
  qualifications: string;
}
