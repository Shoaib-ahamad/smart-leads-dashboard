import {
  useState,
  type FormEvent,
} from "react";

import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

import { loginUser } from "../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await loginUser({
          email,
          password,
        });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      toast.success(
        "Login successful"
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex-col justify-center px-20">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Smart Leads
          <br />
          Dashboard
        </h1>

        <p className="text-lg text-blue-100 leading-relaxed max-w-md">
          Manage leads, track
          conversions, analyze
          customer insights, and
          streamline your CRM
          workflow with a modern
          analytics dashboard.
        </p>

        <div className="mt-10 flex gap-6">
          <div>
            <h2 className="text-3xl font-bold">
              10K+
            </h2>

            <p className="text-blue-200">
              Leads Managed
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              98%
            </h2>

            <p className="text-blue-200">
              Customer Satisfaction
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-2">
              Login to continue to
              your dashboard
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-8">
            Smart Leads Dashboard ©
            2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;