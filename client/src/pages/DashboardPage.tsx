import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useLocation } from "react-router-dom";

import { CSVLink } from "react-csv";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import toast from "react-hot-toast";

import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  getLeadsStats,
} from "../services/lead.service";

import type {
  Lead,
  LeadStats,
} from "../types/lead.types";

const DashboardPage = () => {
  // Get current user details for RBAC UI gating
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser?.role === "admin";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Create Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState("New");
  const [leadSource, setLeadSource] = useState("Website");

  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState("New");
  const [editSource, setEditSource] = useState("Website");

  // Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, sourceFilter]);

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads({
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        page,
        limit: 10,
      });
      setLeads(response.leads);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Global Stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getLeadsStats({
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
      });
      setStats(response.stats);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [debouncedSearch, statusFilter, sourceFilter, page]);

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

  // Create Lead
  const handleCreateLead = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createLead({
        name: leadName,
        email: leadEmail,
        status: leadStatus,
        source: leadSource,
      });

      // Reset form
      setLeadName("");
      setLeadEmail("");
      setLeadStatus("New");
      setLeadSource("Website");

      fetchLeads();
      fetchStats();
      toast.success("Lead created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lead");
    }
  };

  // Open Edit Modal
  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setEditName(lead.name);
    setEditEmail(lead.email);
    setEditStatus(lead.status);
    setEditSource(lead.source);
  };

  // Update Lead
  const handleUpdateLead = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    try {
      await updateLead(editingLead._id, {
        name: editName,
        email: editEmail,
        status: editStatus,
        source: editSource,
      });

      setEditingLead(null);
      fetchLeads();
      fetchStats();
      toast.success("Lead updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    try {
      await deleteLead(id);
      fetchLeads();
      fetchStats();
      toast.success("Lead deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // Recharts Chart Formats
  const statusData = [
    { name: "New", value: stats?.status.New || 0 },
    { name: "Contacted", value: stats?.status.Contacted || 0 },
    { name: "Qualified", value: stats?.status.Qualified || 0 },
    { name: "Lost", value: stats?.status.Lost || 0 },
  ];

  const sourceData = [
    { name: "Website", value: stats?.source.Website || 0 },
    { name: "Instagram", value: stats?.source.Instagram || 0 },
    { name: "Referral", value: stats?.source.Referral || 0 },
  ];

  const COLORS = ["#3B82F6", "#EC4899", "#F59E0B", "#10B981"];

  // CSV Export Data Formatter
  const csvData = leads.map((lead) => ({
    Name: lead.name,
    Email: lead.email,
    Status: lead.status,
    Source: lead.source,
    "Created By": lead.createdBy?.name || "N/A",
    "Created At": new Date(lead.createdAt).toLocaleDateString(),
  }));

  // Skeletons
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-lg animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded-md mb-4" />
          <div className="h-10 w-16 bg-slate-200 rounded-md" />
        </div>
      ))}
    </div>
  );

  const ChartsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-lg animate-pulse h-96">
          <div className="h-6 w-32 bg-slate-200 rounded-md mb-6" />
          <div className="h-64 bg-slate-100 rounded-2xl w-full" />
        </div>
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-lg overflow-hidden animate-pulse">
      <div className="p-6 border-b border-slate-100 h-20 bg-slate-50/50" />
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-6 bg-slate-200 rounded flex-1" />
            <div className="h-6 bg-slate-200 rounded flex-1" />
            <div className="h-6 bg-slate-200 rounded w-24" />
            <div className="h-6 bg-slate-200 rounded w-24" />
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-6 bg-slate-200 rounded w-36" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Banner */}
      <div id="summary" className="scroll-mt-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl px-8 py-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Smart Leads Dashboard
          </h1>
          <p className="text-slate-300 mt-2 text-lg font-medium">
            Global metrics, intelligence tracking, and client conversions.
          </p>
        </div>
      </div>

      {/* Global Statistics Cards */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total leads card */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 group flex items-center justify-between">
            <div>
              <h2 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
                Total Leads
              </h2>
              <p className="text-4xl font-extrabold text-slate-800 mt-2 transition-transform duration-300 group-hover:scale-105 origin-left">
                {stats?.total || 0}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Qualified Leads Card */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 group flex items-center justify-between">
            <div>
              <h2 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
                Qualified Conversions
              </h2>
              <p className="text-4xl font-extrabold text-emerald-600 mt-2 transition-transform duration-300 group-hover:scale-105 origin-left">
                {stats?.status.Qualified || 0}
              </p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Lost Leads Card */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-all duration-300 group flex items-center justify-between">
            <div>
              <h2 className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
                Lost Leads
              </h2>
              <p className="text-4xl font-extrabold text-rose-500 mt-2 transition-transform duration-300 group-hover:scale-105 origin-left">
                {stats?.status.Lost || 0}
              </p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Leads Database Section */}
      <div id="leads" className="scroll-mt-6 space-y-8">
        {/* Creation form */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 mb-8 transition-all hover:shadow-lg duration-300">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Quick Add New Lead
        </h2>

        <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Lead Name"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            required
          />

          <input
            type="email"
            placeholder="Lead Email"
            value={leadEmail}
            onChange={(e) => setLeadEmail(e.target.value)}
            className="border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            required
          />

          <select
            value={leadStatus}
            onChange={(e) => setLeadStatus(e.target.value)}
            className="border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700 cursor-pointer"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={leadSource}
            onChange={(e) => setLeadSource(e.target.value)}
            className="border border-slate-200 p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700 cursor-pointer"
          >
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 text-white p-3.5 rounded-2xl col-span-1 md:col-span-4 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2"
          >
            Create Lead Record
          </button>
        </form>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-200 pl-11 pr-4 py-3 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700 cursor-pointer w-full md:w-48"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 text-slate-700 cursor-pointer w-full md:w-48"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="w-full md:w-auto">
          <CSVLink
            data={csvData}
            filename="leads_export.csv"
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Sheet
          </CSVLink>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div id="analytics" className="scroll-mt-6">
        {statsLoading ? (
          <ChartsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart for Sources */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
              Acquisition Channels
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} (${percent !== undefined ? (percent * 100).toFixed(0) : 0}%)`}
                  >
                    {sourceData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart for Statuses */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
              Lead Status Stages
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#64748B" />
                  <YAxis tickLine={false} axisLine={false} stroke="#64748B" />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Main Database Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">
              Database Records
            </h2>
            <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-2xl uppercase tracking-wider">
              {leads.length} Records Loaded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-slate-100">
                  <th className="p-5 font-bold">Contact Name</th>
                  <th className="p-5 font-bold">Email Reference</th>
                  <th className="p-5 font-bold">Pipeline Stage</th>
                  <th className="p-5 font-bold">Lead Source</th>
                  <th className="p-5 font-bold">Assigned Sales</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-400 font-medium">
                      No matching records found. Create one above!
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <td className="p-5 font-semibold text-slate-800">
                        {lead.name}
                      </td>

                      <td className="p-5 text-slate-600 font-medium">
                        {lead.email}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                          ${
                            lead.status === "Qualified"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : lead.status === "Lost"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : lead.status === "Contacted"
                              ? "bg-amber-50 text-amber-800 border border-amber-100"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-5 text-slate-500 font-medium">
                        {lead.source}
                      </td>

                      <td className="p-5 text-slate-500 font-medium">
                        {lead.createdBy?.name || "Unassigned"}
                      </td>

                      <td className="p-5 text-right flex justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(lead)}
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/70 p-2 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
                          title="Edit Lead"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/75 p-2 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow"
                            title="Delete Lead"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Simple Clean Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-6 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:bg-slate-100 px-5 py-2 rounded-xl font-semibold text-slate-700 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <span className="font-bold text-slate-600 text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:bg-slate-100 px-5 py-2 rounded-xl font-semibold text-slate-700 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      </div>

      {/* Edit Dialog Overlay / Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 transform transition-all duration-300 scale-100 animate-[scaleIn_0.25s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modify Lead Record
              </h3>
              <button
                onClick={() => setEditingLead(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Pipeline Stage
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer text-slate-800"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    Lead Source
                  </label>
                  <select
                    value={editSource}
                    onChange={(e) => setEditSource(e.target.value)}
                    className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 cursor-pointer text-slate-800"
                  >
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;