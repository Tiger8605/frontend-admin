"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { colors } from "../common/Colors";
import { FiPlus, FiDownload, FiTrash2 } from "react-icons/fi";
import { Button } from "../ui/components/Button";
import { QRCodeCanvas } from "qrcode.react";

type TabKey = "tableNumber" | "qrCode" | "qrData" | "actions";

type ApiTable = {
  _id: string;
  tableNumber: string;
  qrValue?: string;
};

type TableItem = {
  id: string;
  tableNo: string;
  url: string; // this is what we encode in QR
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "tableNumber", label: "Table Number" },
  { key: "qrCode", label: "QR Code" },
  { key: "qrData", label: "QR Data" },
  { key: "actions", label: "Actions" },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TableManagement() {
  const [activeTab, setActiveTab] = useState<TabKey>("tableNumber");
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // ✅ If you store token in localStorage, add it here.
  // If you use cookies, set withCredentials: true and configure CORS.
  const axiosInstance = useMemo(() => {
    const token = localStorage.getItem("adminToken"); // change key if your project uses different
    return axios.create({
      baseURL: API_BASE,
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }, []);

  const mapApiToUI = (t: ApiTable): TableItem => ({
    id: t._id,
    tableNo: t.tableNumber,
    url:
      t.qrValue ||
      `${window.location.origin}/menu?tableId=${t._id}`, // fallback if backend doesn't send qrValue
  });

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/tables");
      const data: ApiTable[] = res.data?.data || [];
      setTables(data.map(mapApiToUI));
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const handleCreate = async () => {
  // ✅ Ask user for table number (optional)
  // If user cancels -> null
  // If user leaves empty -> auto create
  const input = window.prompt("Enter table number (leave blank for auto):", "");

  // If user clicked "Cancel"
  if (input === null) return;

  setCreating(true);

  try {
    // ✅ If input is empty -> send {}
    // ✅ If input has value -> send { tableNumber: input }
    const payload = input.trim() ? { tableNumber: input.trim() } : {};

    const res = await axiosInstance.post("/api/tables", payload);
    const created: ApiTable = res.data?.data;

    if (!created?._id) {
      await fetchTables();
      return;
    }

    setTables((prev) => [mapApiToUI(created), ...prev]);
  } catch (err: any) {
    alert(err?.response?.data?.message || err.message || "Failed to create table");
  } finally {
    setCreating(false);
  }
};

  const handleDelete = async (t: TableItem) => {
    const ok = window.confirm(`Delete table ${t.tableNo}?`);
    if (!ok) return;

    try {
      await axiosInstance.delete(`/api/tables/${t.id}`);
      setTables((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "Failed to delete table");
    }
  };

  const handleDownload = (t: TableItem) => {
    // download QR canvas as PNG
    const canvas = document.getElementById(`qr-${t.id}`) as HTMLCanvasElement | null;
    if (!canvas) return alert("QR not found");

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `table-${t.tableNo}-qr.png`;
    link.click();
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl sm:text-2xl font-extrabold"
            style={{ color: colors.textPrimary }}
          >
            Table Management
          </h1>
          <p className="text-sm font-semibold mt-1" style={{ color: colors.textMuted }}>
            Generate QR codes for tables and manage them.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          disabled={creating}
          className="h-11 px-4 rounded-2xl font-bold text-sm flex items-center gap-2"
          style={{
            backgroundColor: creating ? colors.neutral[300] : colors.primary,
            color: creating ? colors.textMuted : colors.white,
            boxShadow: creating ? "none" : `0 10px 25px ${colors.primary}35`,
            cursor: creating ? "not-allowed" : "pointer",
          }}
        >
          <FiPlus />
          {creating ? "Creating..." : "Create New Table"}
        </Button>
      </div>

      {/* Main Card */}
      <div
        className="rounded-3xl border overflow-hidden"
        style={{
          backgroundColor: colors.white,
          borderColor: colors.border,
          boxShadow: colors.shadow,
        }}
      >
        {/* Tabs */}
        <div
          className="flex flex-wrap gap-6 px-5 pt-4"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          {TABS.map((t) => {
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="relative pb-4 text-sm font-extrabold"
                style={{
                  color: isActive ? colors.primary : colors.textMuted,
                }}
              >
                {t.label}
                {isActive && (
                  <span
                    className="absolute left-0 bottom-0 h-[3px] w-full rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="p-5">
          {loading ? (
            <div className="py-10 text-sm font-semibold" style={{ color: colors.textMuted }}>
              Loading tables...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tables.map((t) => (
                <TableCard
                  key={t.id}
                  item={t}
                  activeTab={activeTab}
                  onDownload={() => handleDownload(t)}
                  onDelete={() => handleDelete(t)}
                />
              ))}
            </div>
          )}

          {!loading && tables.length === 0 && (
            <div className="py-10 text-sm font-semibold" style={{ color: colors.textMuted }}>
              No tables yet. Click “Create New Table”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TableCard({
  item,
  activeTab,
  onDownload,
  onDelete,
}: {
  item: TableItem;
  activeTab: TabKey;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const showQR = activeTab === "qrCode" || activeTab === "tableNumber" || activeTab === "actions";

  return (
    <div
      className="rounded-3xl border p-4"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.white,
        boxShadow: `0 10px 25px ${colors.neutral[900]}10`,
      }}
    >
      {/* top */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold" style={{ color: colors.textMuted }}>
            Table
          </div>
          <div
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            {item.tableNo}
          </div>
        </div>

        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${colors.primary}12` }}
        >
          <div className="h-5 w-5 rounded-md" style={{ backgroundColor: colors.primary }} />
        </div>
      </div>

      {/* content */}
      <div className="mt-4 flex items-center justify-center">
        {activeTab === "qrData" ? (
          <div
            className="w-full rounded-2xl border px-4 py-4 text-sm"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.cardSoft,
              color: colors.textSecondary,
            }}
          >
            <div className="font-extrabold mb-2" style={{ color: colors.textPrimary }}>
              QR Data
            </div>
            <div className="break-all font-semibold">{item.url}</div>
          </div>
        ) : showQR ? (
          <div
            className="rounded-2xl border p-3"
            style={{
              borderColor: `${colors.primary}30`,
              backgroundColor: colors.white,
            }}
          >
            <QRCodeCanvas
              id={`qr-${item.id}`}
              value={item.url}
              size={150}
              level="H"
              includeMargin={true}
              bgColor={colors.white}
              fgColor={colors.primary}
            />
          </div>
        ) : null}
      </div>

      {/* url */}
      <div className="mt-3 text-center text-xs font-semibold" style={{ color: colors.textMuted }}>
        {item.url}
      </div>

      {/* actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onDownload}
          className="flex-1 h-10 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 border"
          style={{
            backgroundColor: `${colors.primary}12`,
            borderColor: `${colors.primary}35`,
            color: colors.primary,
          }}
        >
          <FiDownload />
          Download QR
        </button>

        <button
          onClick={onDelete}
          className="flex-1 h-10 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2"
          style={{
            backgroundColor: colors.danger ?? "#EF4444",
            color: colors.white,
          }}
        >
          <FiTrash2 />
          Delete Table
        </button>
      </div>
      
    </div>
  );
}