import api from "./api";

import type {
  LeadsResponse,
  LeadStatsResponse,
} from "../types/lead.types";

interface GetLeadsParams {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export const getLeads = async (
  params?: GetLeadsParams
): Promise<LeadsResponse> => {
  const response = await api.get("/leads", { params });

  return response.data;
};

export const getLeadsStats = async (
  params?: GetLeadsParams
): Promise<LeadStatsResponse> => {
  const response = await api.get("/leads/stats", { params });

  return response.data;
};

interface CreateLeadData {
  name: string;
  email: string;
  status: string;
  source: string;
}

export const createLead = async (data: CreateLeadData) => {
  const response = await api.post("/leads", data);

  return response.data;
};

export const updateLead = async (
  id: string,
  data: Partial<CreateLeadData>
) => {
  const response = await api.put(`/leads/${id}`, data);

  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await api.delete(`/leads/${id}`);

  return response.data;
};