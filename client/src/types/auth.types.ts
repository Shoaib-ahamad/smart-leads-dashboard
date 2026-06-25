export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: UserRecord[];
}