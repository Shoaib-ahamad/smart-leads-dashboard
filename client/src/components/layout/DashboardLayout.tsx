import {
  Outlet,
  useNavigate,
  NavLink,
} from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();

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
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-500 text-white px-5 py-3 rounded-xl font-medium shadow"
                  : "hover:bg-slate-800 px-5 py-3 rounded-xl text-slate-300 transition-all"
              }
            >
              Dashboard
            </NavLink>

            {/* Leads */}
            <NavLink
              to="/dashboard"
              className="hover:bg-slate-800 px-5 py-3 rounded-xl text-slate-300 transition-all"
            >
              Leads
            </NavLink>

            {/* Analytics */}
            <NavLink
              to="/dashboard"
              className="hover:bg-slate-800 px-5 py-3 rounded-xl text-slate-300 transition-all"
            >
              Analytics
            </NavLink>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-3 rounded-xl w-full font-medium"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;