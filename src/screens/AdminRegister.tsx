"use client";

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../common/Colors";
import { Button } from "../ui/components/Button";
import API, { URL_PATH } from "../common/API";



export default function AdminRegister() {
  const nav = useNavigate();

  // Owner account
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Restaurant details
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI-only validation
  const isValid = useMemo(() => {
    const ownerOk = ownerName.trim().length >= 2;
    const emailOk = email.trim().includes("@");
    const passOk = password.trim().length >= 6;
    const restOk = restaurantName.trim().length >= 2;
    const phoneOk = restaurantPhone.trim().length >= 10;
    return ownerOk && emailOk && passOk && restOk && phoneOk;
  }, [ownerName, email, password, restaurantName, restaurantPhone]);


  //----------Handlers-----------

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setError("");
    setLoading(true);

    try {
      const payload = {
        name: ownerName,            // backend expects "name"
        email,
        password,
        restroname: restaurantName, // backend expects "restroname"
        phone: restaurantPhone,     // backend expects "phone"
        city,
        address,
      };

      const data = await API("POST", URL_PATH.AdminRegister, payload);

      // store auth
      if (data?.token) localStorage.setItem("admi_token", data.token);
      if (data?.admin) localStorage.setItem("admin_profile", JSON.stringify(data.admin));

      nav("/admin/dashboard");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: `linear-gradient(180deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
      }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border p-7 shadow-sm"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.border,
          boxShadow: colors.shadow,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              Restaurant Registration
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>
              Create owner account and register your restaurant.
            </p>
          </div>

          <button
            onClick={() => nav("/admin/login")}
            className="rounded-2xl px-4 py-2 text-sm font-bold border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardSoft,
              color: colors.textPrimary,
            }}
          >
            Back to Login
          </button>
        </div>

        <form onSubmit={handleRegister} className="mt-6 space-y-7">
          {/* Owner Details */}
          <div>
            <h2
              className="text-sm font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              Owner Details
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Owner Name
                </label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner name"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  type="password"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Restaurant Details */}
          <div>
            <h2
              className="text-sm font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              Restaurant Details
            </h2>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Restaurant Name
                </label>
                <input
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Enter restaurant name"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Restaurant Phone
                </label>
                <input
                  value={restaurantPhone}
                  onChange={(e) =>
                    setRestaurantPhone(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="10-digit number"
                  inputMode="numeric"
                  maxLength={10}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div>
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="text-xs font-bold"
                  style={{ color: colors.textSecondary }}
                >
                  Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                    color: colors.textPrimary,
                  }}
                />
              </div>
            </div>
          </div>

   {/* Action */}
          <div className="pt-2">
            <Button type="submit" disabled={!isValid || loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <p className="mt-4 text-center text-sm" style={{ color: colors.textMuted }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => nav("/admin/login")}
                className="font-extrabold"
                style={{ color: colors.primary }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}