import api from "./api";

import type {
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
} from "../types/auth.types";

export const loginUser = async (
  data: LoginFormData
): Promise<LoginResponse> => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const registerUser = async (
  data: RegisterFormData
): Promise<RegisterResponse> => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};