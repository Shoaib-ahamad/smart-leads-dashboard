import {
  Outlet,
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const location = useLocation();
  const currentHash = location.hash;

  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-72 bg-slate-900 text-white shadow-2xl p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-blue-400 mb-12">
            Smart Leads
          </h1>

          <div className="flex flex-col gap-3">
            {/* Dashboard */}
            <Link
              to="/dashboard#summary"
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                location.pathname === "/dashboard" && (currentHash === "" || currentHash === "#summary")
                  ? "bg-blue-500 text-white shadow"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              Dashboard
            </Link>

            {/* Leads */}
            <Link
              to="/dashboard#leads"
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                location.pathname === "/dashboard" && currentHash === "#leads"
                  ? "bg-blue-500 text-white shadow"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              Leads
            </Link>

            {/* Analytics */}
            <Link
              to="/dashboard#analytics"
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                location.pathname === "/dashboard" && currentHash === "#analytics"
                  ? "bg-blue-500 text-white shadow"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              Analytics
            </Link>

            {/* Users (Admin Only) */}
            {currentUser?.role === "admin" && (
              <Link
                to="/users"
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  location.pathname === "/users"
                    ? "bg-blue-500 text-white shadow"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                Users
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {currentUser && (
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/25 text-blue-400 flex items-center justify-center font-bold text-lg uppercase shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm truncate text-white">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="mt-2.5 pt-2.5 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Role:
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold border
                  ${
                    currentUser.role === "admin"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 transition-all duration-200 text-red-400 hover:text-white px-4 py-3.5 rounded-xl w-full font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;