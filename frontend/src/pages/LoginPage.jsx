import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, Sparkles, Zap } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-base-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105
              transition-all shadow-inner"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-sm text-base-content/60 font-medium">Sign in to your Chatty AI workspace</p>
            </div>
          </div>

          {/* Instant Demo Sign In */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-primary/20 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-3">
              <Zap className="size-4 text-amber-500 fill-amber-500" />
              <span>⚡ Instant Demo Sign In (1-Click)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn btn-sm btn-primary btn-outline text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                onClick={() => login({ email: "emma.thompson@example.com", password: "123456" })}
                disabled={isLoggingIn}
              >
                <span>👩 Emma (Lead)</span>
              </button>
              <button
                type="button"
                className="btn btn-sm btn-accent btn-outline text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:scale-102 transition-all"
                onClick={() => login({ email: "james.anderson@example.com", password: "123456" })}
                disabled={isLoggingIn}
              >
                <span>👨 James (Dev)</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered input-md w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold text-xs">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered input-md w-full pl-9 pr-10 rounded-xl text-sm focus:outline-none focus:border-primary`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-base-content/40" />
                  ) : (
                    <Eye className="h-4 w-4 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary font-bold">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome to Chatty AI!"}
        subtitle={"Real-time messaging supercharged with LangChain, Groq RAG, and AI Semantic Search."}
      />
    </div>
  );
};
export default LoginPage;
