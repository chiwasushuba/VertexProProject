export interface SignupType {
  email: string;
  password: string;
  role: "user" | "admin";
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: "Male" | "Female" | "";
  position: "Coordinator" | "Sampler" | "Helper" | "";
  completeAddress?: string;
  nbiRegistrationDate?: string;
  nbiExpirationDate?: string;
  fitToWorkExpirationDate?: string;
  gcashNumber?: string;
  gcashName?: string;
  profileImage?: File | null;
}