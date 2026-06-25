import {
  useState,
  type FormEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/auth.service";

const SignupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("sales");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await registerUser({
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center px-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Smart Leads
            <br />
            Dashboard
          </h1>

          <p className="text-lg text-blue-100 leading-relaxed max-w-md">
            Create an account to start managing your leads, tracking conversions, and streamlining your CRM workflows.
          </p>

          <div className="mt-10 flex gap-6">
            <div>
              <h2 className="text-3xl font-bold">100%</h2>
              <p className="text-blue-200">Data Control</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">RBAC</h2>
              <p className="text-blue-200">Role Security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Get Started
            </h2>

            <p className="text-gray-500 mt-2">
              Create a new user account
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-800"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-800"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all text-slate-800"
                minLength={6}
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3.5 rounded-xl font-semibold shadow-md active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-sm text-gray-500 text-center mt-8">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
