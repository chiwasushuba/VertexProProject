export interface UserType {
  id: string;
  company_id: string;
  name: string;
  email: string;
  pfp: string;
  verified: boolean;
  role: "user" | "admin" | "superAdmin"
  request: boolean;
}

