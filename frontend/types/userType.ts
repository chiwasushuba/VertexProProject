export interface UserType {
  id: string;
  name: string;
  email: string;
  pfp: string;
  verified: boolean;
  role: "user" | "admin" | "superAdmin"
}

