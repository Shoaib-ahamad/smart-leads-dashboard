import api from "./api";

import type {
  LoginFormData,
  LoginResponse,
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