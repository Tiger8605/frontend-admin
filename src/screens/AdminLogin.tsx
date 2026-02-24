"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../common/Colors";
import { Button } from "../ui/components/Button";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Later replace with real API
    // Example:
    // await axios.post("/admin/login", { email, password });

    nav("/admin/dashboard");
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
        <h1
          className="text-xl font-extrabold"
          style={{ color: colors.textPrimary }}
        >
          Admin Login
        </h1>

        <p
          className="mt-2 text-sm"
          style={{ color: colors.textMuted }}
        >
          Login to manage menu, orders and analytics.
        </p>

        {/* FORM START */}
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

          <Button type="submit">
            Login
          </Button>
        </form>

        {/* Optional Register Link */}
        <div
          className="mt-4 text-center text-sm"
          style={{ color: colors.textMuted }}
        >
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