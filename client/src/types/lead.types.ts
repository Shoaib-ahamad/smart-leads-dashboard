export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;

  createdBy: {
    name: string;
    email: string;
    role: string;
  };

  createdAt: string;
}

export interface LeadsResponse {
  success: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  leads: Lead[];
}

export interface LeadStats {
  total: number;
  status: {
    New: number;
    Contacted: number;
    Qualified: number;
    Lost: number;
  };
  source: {
    Website: number;
    Instagram: number;
    Referral: number;
  };
}

export interface LeadStatsResponse {
  success: boolean;
  stats: LeadStats;
}