"use client";

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../common/Colors";
import { Button } from "../ui/components/Button";
import API, { URL_PATH } from "../common/API";
import { FiShield, FiEye, FiEyeOff } from "react-icons/fi";


// Optional Lottie:
import Lottie from "lottie-react";
import adminAnim from "../assets/lottie/admin-login.json";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const danger = colors.danger || "#EF4444";

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const payload = { email, password };

      const data = await API("POST", URL_PATH.AdminLogin, payload);
      

      if (data?.token) {
        // if remember off, you can store in sessionStorage instead
        const store = remember ? localStorage : sessionStorage;
        store.setItem("adminToken", data.token);
      }

      if (data?.admin) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem("admin_profile", JSON.stringify(data.admin));
      }

      nav("/admin/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `radial-gradient(1100px 520px at 15% 15%, ${colors.primary}18 0%, transparent 60%),
                     radial-gradient(900px 520px at 90% 25%, ${colors.accent}18 0%, transparent 55%),
                     linear-gradient(180deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
      }}
    >
      <div className="w-full max-w-md">


        {/* Card */}
        <div
          className="rounded-[28px] border overflow-hidden shadow-sm"
          style={{
            borderColor: colors.border,
            boxShadow: colors.shadow,
            backgroundColor: `${colors.white}CC`,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Accent bar */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            }}
          />

          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>
                  Admin Login
                </h1>
                <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>
                  Login to manage menu, orders and analytics.
                </p>
              </div>

              {/* Lottie slot (optional) */}
              <div
                className="hidden sm:flex w-20 h-20 rounded-2xl border items-center justify-center overflow-hidden"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.cardSoft,
                }}
              >
                <Lottie animationData={adminAnim} loop autoplay />
                <span className="text-[10px]" style={{ color: colors.textMuted }}>
                  Lottie
                </span>
              </div>
            </div>

            {/* Error */}
            {error ? (
              <div
                className="mt-5 rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: `${danger}40`,
                  backgroundColor: `${danger}10`,
                  color: colors.textPrimary,
                }}
              >
                <div className="font-extrabold" style={{ color: danger }}>
                  Login failed
                </div>
                <div className="mt-0.5">{error}</div>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold" style={{ color: colors.textMuted }}>
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  type="email"
                  required
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold" style={{ color: colors.textMuted }}>
                  Password
                </label>

                <div
                  className="w-full rounded-2xl border px-3 py-2 flex items-center gap-2"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                  }}
                >
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    type={showPass ? "text" : "password"}
                    required
                    className="w-full bg-transparent px-1 py-1 text-sm outline-none"
                    style={{ color: colors.textPrimary }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="h-9 w-9 rounded-xl flex items-center justify-center border"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.white,
                    }}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <FiEyeOff size={16} color={colors.textPrimary} />
                    ) : (
                      <FiEye size={16} color={colors.textPrimary} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs" style={{ color: colors.textMuted }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Keep me signed in
                  </label>

                  <button
                    type="button"
                    className="text-xs font-extrabold"
                    style={{ color: colors.primary }}
                    onClick={() => nav("/admin/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* CTA */}
              <Button type="submit" disabled={!canSubmit}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Secondary */}
              <div className="pt-1 text-center text-sm" style={{ color: colors.textMuted }}>
                New restaurant?{" "}
                <button
                  type="button"
                  onClick={() => nav("/admin/register")}
                  className="font-extrabold"
                  style={{ color: colors.primary }}
                >
                  Create account
                </button>
              </div>
            </form>

            <div className="mt-5 text-center text-xs" style={{ color: colors.textMuted }}>
              By continuing you agree to the admin security policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}