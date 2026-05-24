import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    setIsLoading(true);

    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/admin");
    } catch (error) {
      console.error(error);

      setError(
        "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative w-[100vw]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

        <div className="absolute bottom-[-250px] right-[-150px] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-14 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />

              <span className="text-sm text-gray-300">
                Secure Administrative
                Network
              </span>
            </div>

            <h1 className="text-6xl font-black leading-tight mt-10 tracking-tight">
              Field
              <br />
              Reporting
              <br />
              Platform
            </h1>

            <p className="text-gray-400 text-lg mt-8 max-w-lg leading-relaxed">
              Enterprise-grade employee
              reporting and media
              submission infrastructure for
              secure operational workflows.
            </p>
          </div>

          {/* Bottom Metrics */}
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5">
              <h2 className="text-3xl font-bold">
                24/7
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Availability
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5">
              <h2 className="text-3xl font-bold">
                AES
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Security
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-5">
              <h2 className="text-3xl font-bold">
                Live
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="lg:hidden mb-10 text-center">
              <h1 className="text-4xl font-black">
                Field Reporting
              </h1>

              <p className="text-gray-400 mt-3">
                Secure Admin Portal
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-2xl">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mb-5">
                  🔐
                </div>

                <h2 className="text-4xl font-bold tracking-tight">
                  Welcome Back
                </h2>

                <p className="text-gray-400 mt-3">
                  Authenticate to access the
                  control center.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 px-5 py-4 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="text-sm text-gray-300 block mb-3">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    disabled={isLoading}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="admin@company.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-400 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-3">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    value={password}
                    disabled={isLoading}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-400 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading
                  }
                  className="w-full bg-white text-black hover:scale-[1.02] transition-all duration-300 py-4 rounded-2xl font-bold text-lg disabled:opacity-50 mt-4"
                >
                  {isLoading
                    ? "Authenticating..."
                    : "Enter Dashboard"}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Protected Session
                </span>

                <span>
                  v1.0 Enterprise
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}