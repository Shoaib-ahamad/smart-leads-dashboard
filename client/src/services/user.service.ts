import api from "./api";
import type { UsersResponse } from "../types/auth.types";

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await api.get("/users");

  return response.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const response = await api.put(`/users/${id}/role`, { role });

  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);

  return response.data;
};
