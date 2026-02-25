"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../common/Colors";
import { Button } from "../ui/components/Button";
import API, { URL_PATH } from "../common/API";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const payload = { email, password };

      const data = await API("POST", URL_PATH.AdminLogin, payload);

      if (data?.token) localStorage.setItem("adminToken", data.token);
      if (data?.admin) localStorage.setItem("admin_profile", JSON.stringify(data.admin));

      nav("/admin/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `linear-gradient(180deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-6 shadow-sm"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.border,
          boxShadow: colors.shadow,
        }}
      >
        <h1 className="text-xl font-extrabold" style={{ color: colors.textPrimary }}>
          Admin Login
        </h1>

        <p className="mt-2 text-sm" style={{ color: colors.textMuted }}>
          Login to manage menu, orders and analytics.
        </p>

        {error ? (
          <div
            className="mt-4 rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: `${colors.danger || "#EF4444"}40`,
              backgroundColor: `${colors.danger || "#EF4444"}10`,
              color: colors.textPrimary,
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardSoft,
              color: colors.textPrimary,
            }}
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardSoft,
              color: colors.textPrimary,
            }}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm" style={{ color: colors.textMuted }}>
          New restaurant?{" "}
          <button
            onClick={() => nav("/admin/register")}
            className="font-extrabold"
            style={{ color: colors.primary }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}