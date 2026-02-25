"use client";

import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { colors } from "../../common/Colors";
import { FiGrid, FiList, FiBarChart2, FiLogOut } from "react-icons/fi";

export default function AdminLayout() {
  const nav = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: <FiGrid />, path: "/admin/dashboard" },
    { label: "Analytics", icon: <FiBarChart2 />, path: "/admin/analytics" },
    { label: "Menu Management", icon: <FiList />, path: "/admin/menu" },
    { label: "Table Management ", icon: <FiList />, path: "/admin/tables" },
    { label: "Order Management ", icon: <FiList />, path: "/admin/Orders" },
  ];

  return (
    <div
      className="h-screen overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex max-w-7xl mx-auto h-full py-8">
        {/* Sidebar */}
        <aside
          className="hidden md:flex w-[240px] shrink-0 flex-col rounded-3xl border-r"
          style={{ backgroundColor: colors.white, borderColor: colors.border }}
        >
          <div className="p-5 border-b" style={{ borderColor: colors.border }}>
            <h1
              className="text-lg font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              Restaurant Admin
            </h1>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: colors.textMuted }}
            >
              Manage menu • orders • analytics
            </p>
          </div>

          <div className="p-3 space-y-2">
            {navItems.map((it) => {
              const active = location.pathname === it.path;
              return (
                <button
                  key={it.path}
                  onClick={() => nav(it.path)}
                  className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition"
                  style={{
                    backgroundColor: active ? colors.primary : colors.cardSoft,
                    color: active ? colors.white : colors.textPrimary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {it.icon}
                  {it.label}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t mt-auto" style={{ borderColor: colors.border }}>
            <button
              onClick={() => nav("/admin/login")}
              className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold"
              style={{
                backgroundColor: colors.neutral[900],
                color: colors.white,
              }}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <header
            className="border-b shrink-0 rounded-3xl"
            style={{
              backgroundColor: colors.white,
              borderColor: colors.border,
            }}
          >
            <div className="mx-auto w-full max-w-6xl px-4 py-4 flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: colors.textMuted }}
                >
                  Admin Panel
                </p>
                <h2
                  className="text-lg font-extrabold"
                  style={{ color: colors.textPrimary }}
                >
                  Overview
                </h2>
              </div>

              <div
                className="rounded-2xl px-4 py-2 text-sm font-bold"
                style={{
                  backgroundColor: colors.cardSoft,
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Owner
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
