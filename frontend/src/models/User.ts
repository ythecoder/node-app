export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  age?: number;
}
