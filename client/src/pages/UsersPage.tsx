import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, updateUserRole, deleteUser } from "../services/user.service";
import type { UserRecord } from "../types/auth.types";

const UsersPage = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user details to prevent self-deletion or self-demotion
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user account?");
    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      toast.success("User account deleted successfully");
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const UsersSkeleton = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-100 shadow-lg overflow-hidden animate-pulse">
      <div className="p-6 border-b border-slate-100 h-20 bg-slate-50/50" />
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-6 bg-slate-200 rounded flex-1" />
            <div className="h-6 bg-slate-200 rounded flex-1" />
            <div className="h-6 bg-slate-200 rounded w-32" />
            <div className="h-6 bg-slate-200 rounded w-24" />
            <div className="h-6 bg-slate-200 rounded w-28" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl px-8 py-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            User Management & RBAC
          </h1>
          <p className="text-slate-300 mt-2 text-lg font-medium">
            Promote user privileges, view accounts, or clean up team registry.
          </p>
        </div>
      </div>

      {/* Main Database Table */}
      {loading ? (
        <UsersSkeleton />
      ) : (
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">
              Authorized Team Registry
            </h2>
            <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-2xl uppercase tracking-wider">
              {users.length} Total Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold text-sm border-b border-slate-100">
                  <th className="p-5 font-bold">User Name</th>
                  <th className="p-5 font-bold">Email Address</th>
                  <th className="p-5 font-bold">Created On</th>
                  <th className="p-5 font-bold">Role Assignment</th>
                  <th className="p-5 font-bold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isSelf = user._id === currentUser?.id;
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <td className="p-5 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          {user.name}
                          {isSelf && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-5 text-slate-600 font-medium">
                        {user.email}
                      </td>

                      <td className="p-5 text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={isSelf}
                          className="border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none bg-slate-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                          <option value="sales">Sales</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="p-5 text-right flex justify-end gap-2.5">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={isSelf}
                          className="text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/75 p-2 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isSelf ? "Cannot delete yourself" : "Delete User"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
