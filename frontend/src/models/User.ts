export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: any;
  isActive?: boolean;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleId?: string;
  phone?: string;
}
