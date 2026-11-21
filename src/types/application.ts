export interface Application {
  _id?: string;
  jobId: string;
  applicantId: string;
  email: string;
  jobTitle: string;
  companyName: string;
  appliedAt?: string;
}
