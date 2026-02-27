"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { colors } from "../common/Colors";
import API, { URL_PATH } from "../common/API";
import { FiPlus, FiDownload, FiTrash2 } from "react-icons/fi";
import { Button } from "../ui/components/Button";
import { QRCodeCanvas } from "qrcode.react";
import { toast, ToastContainer } from "react-toastify";

/* ==================== TYPES ==================== */

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

/* ==================== MAIN COMPONENT ==================== */

export default function TableManagement() {
  /* ==================== STATE ==================== */

  const [activeTab, setActiveTab] = useState<TabKey>("tableNumber");
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [tableError, setTableError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<TableItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ==================== HELPERS ==================== */

  const mapApiToUI = (t: ApiTable): TableItem => ({
    id: t._id,
    tableNo: t.tableNumber,
    url: t.qrValue || `${window.location.origin}/menu?tableId=${t._id}`,
  });

  /* ==================== FETCH ==================== */

  const fetchTables = useCallback(async () => {
    try {
      setIsLoading(true);

      const token =
        localStorage.getItem("admin_token") ||
        sessionStorage.getItem("admin=_token");

      const res = await API("GET", URL_PATH.GetTables);

      const data: ApiTable[] = res?.data || [];
      setTables(data.map(mapApiToUI));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch tables");
    } finally {
      setIsLoading(false);
    }
  }, []);

const deleteTable = useCallback(
  async (tableId: string) => {
    try {
      setDeleting(true);

      await API("DELETE", URL_PATH.DeleteTable(tableId));

      toast.success("Table deleted successfully");

      // 🔁 Refresh list after delete
      await fetchTables();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete table"
      );
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setTableToDelete(null);
    }
  },
  [fetchTables]
);

  useEffect(() => {
    fetchTables();
  }, [fetchTables,]);
  /* ==================== ACTIONS ==================== */

const handleCreate = async () => {
  try {
    setCreating(true);
    setTableError("");

    const payload = newTableNumber.trim()
      ? { tableNumber: newTableNumber.trim() }
      : {};

    await API("POST", URL_PATH.Tables, payload);

    // ✅ IMPORTANT: refetch from backend
    await fetchTables();

    setNewTableNumber("");
    setIsTableModalOpen(false);

    toast.success("Table created successfully");
  } catch (err: any) {
    setTableError(err?.response?.data?.message || "Failed to create table");
  } finally {
    setCreating(false);
  }
};

  const handleDeleteClick = (table: TableItem) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!tableToDelete) return;
    deleteTable(tableToDelete.id);
  };

  const handleDownload = (t: TableItem) => {
    const canvas = document.getElementById(
      `qr-${t.id}`,
    ) as HTMLCanvasElement | null;
    if (!canvas) return toast.error("QR not found");

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `table-${t.tableNo}-qr.png`;
    link.click();
  };

  /* ==================== UI ==================== */

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
          <p
            className="text-sm font-semibold mt-1"
            style={{ color: colors.textMuted }}
          >
            Generate QR codes for tables and manage them.
          </p>
        </div>

        <Button
          onClick={() => setIsTableModalOpen(true)}
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
          {isLoading ? (
            <div
              className="py-10 text-sm font-semibold"
              style={{ color: colors.textMuted }}
            >
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
                  onDelete={() => handleDeleteClick(t)}
                />
              ))}
            </div>
          )}

          {!isLoading && tables.length === 0 && (
            <div
              className="py-10 text-sm font-semibold"
              style={{ color: colors.textMuted }}
            >
              No tables yet. Click “Create New Table”.
            </div>
          )}
        </div>
      </div>

      {/* ================= CREATE TABLE MODAL ================= */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div
            className="w-full max-w-md mx-4 sm:mx-auto rounded-xl p-6"
            style={{
              backgroundColor: colors.card,
              boxShadow: colors.shadow,
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: colors.textPrimary }}
            >
              Create New Table
            </h2>

            <input
              type="text"
              placeholder="Table Number (optional)"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                borderColor: colors.border,
              }}
            />

            {tableError && (
              <p className="text-sm mt-2" style={{ color: colors.danger }}>
                {tableError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsTableModalOpen(false);
                  setTableError("");
                  setNewTableNumber("");
                }}
                className="px-4 py-2 rounded-lg border"
                style={{
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-4 py-2 text-white rounded-lg"
                style={{
                  backgroundColor: creating
                    ? colors.neutral[400]
                    : colors.primary,
                }}
              >
                {creating ? "Creating..." : "Save Table"}
              </button>
            </div>
          </div>
        </div>
      )}
    
        {/* ================= DELETE CONFIRM MODAL ================= */}
    {isDeleteModalOpen && tableToDelete && (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div
          className="w-full max-w-md mx-4 sm:mx-auto rounded-xl p-6"
          style={{
            backgroundColor: colors.card,
            boxShadow: colors.shadow,
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: colors.textPrimary }}
          >
            Delete Table
          </h2>

          <p
            className="text-sm mb-6"
            style={{ color: colors.textSecondary }}
          >
            Are you sure you want to delete{" "}
            <span className="font-bold">
              Table {tableToDelete.tableNo}
            </span>
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setTableToDelete(null);
              }}
              className="px-4 py-2 rounded-lg border"
              style={{
                borderColor: colors.border,
                color: colors.textSecondary,
              }}
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              disabled={deleting}
              className="px-4 py-2 text-white rounded-lg"
              style={{
                backgroundColor: deleting
                  ? colors.neutral[400]
                  : colors.danger,
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    )}
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
  const showQR =
    activeTab === "qrCode" ||
    activeTab === "tableNumber" ||
    activeTab === "actions";

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
          <div
            className="text-xs font-bold"
            style={{ color: colors.textMuted }}
          >
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
          <div
            className="h-5 w-5 rounded-md"
            style={{ backgroundColor: colors.primary }}
          />
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
            <div
              className="font-extrabold mb-2"
              style={{ color: colors.textPrimary }}
            >
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
      <div
        className="mt-3 text-center text-xs font-semibold"
        style={{ color: colors.textMuted }}
      >
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
