import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, Shield, Activity, RefreshCw, AlertCircle } from "lucide-react";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      setError("Invalid administrative credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 overflow-hidden relative w-full antialiased font-sans selection:bg-blue-500/30">
      {/* Ambient Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Branding & Highlights (Desktop Only) */}

        <div className="hidden lg:flex flex-col justify-between p-16 border-r border-slate-900/60 bg-slate-950/20 backdrop-blur-xs">
          <div> <img src="/logo.jpeg" alt="Brand Logo" className="h-20 rounded-full my-4" />
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">


              <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                Secure Administrative Network
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] mt-12 bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Field <br />
              Reporting <br />
              Platform
            </h1>

            <p className="text-slate-400 text-base xl:text-lg mt-6 max-w-md leading-relaxed font-medium">
              Enterprise-grade employee reporting and media submission infrastructure engineered for secure operational workflows.
            </p>
          </div>

          {/* Infrastructure Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <MetricBlock label="Availability" value="24/7" icon={RefreshCw} />
            <MetricBlock label="Encryption" value="AES" icon={Shield} />
            <MetricBlock label="Monitoring" value="Live" icon={Activity} />
          </div>
        </div>

        {/* Right Panel - Login Interaction Area */}
        <div className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Adaptive Header */}
            <div className="lg:hidden text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Field Reporting System
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Secure Management Portal
              </p>
            </div>

            {/* Login Architecture Wrapper */}
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/40">
              <div className="mb-8">
                <div className="md:h-12 md:w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />   <img src="/logo.jpeg" alt="Brand Logo" className="h-6 rounded-lg m-4 md:hidden flex" />
                </div>

              
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                  Welcome Back
                </h2>
                 <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5">
                  Authenticate credentials to access the central operations panel.
                </p>
              </div>

              {/* Server/Validation Response Output */}
              {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-3 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      disabled={isLoading}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none rounded-xl pl-11 pr-5 py-3 text-sm text-white placeholder:text-slate-600 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                    System Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      disabled={isLoading}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none rounded-xl pl-11 pr-5 py-3 text-sm text-white placeholder:text-slate-600 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-white active:scale-[0.99] text-slate-950 transition-all duration-200 py-3 rounded-xl font-bold text-sm disabled:opacity-50 mt-3 shadow-lg shadow-white/5"
                >
                  {isLoading ? (
                    "Verifying Identity..."
                  ) : (
                    <>
                      Enter Dashboard <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* System Compliance Subtext */}
              <div className="mt-8 pt-5 border-t border-slate-900 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Protected Session</span>
                <span>v1.0 Enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Local Component Helper for Metrics Display */
function MetricBlock({ label, value, icon: Icon }) {
  return (
    <div className="bg-slate-900/30 border border-slate-800/60 backdrop-blur-xs rounded-2xl p-4 flex items-center gap-3.5">
      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-lg font-bold tracking-tight text-slate-200">{value}</h3>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}