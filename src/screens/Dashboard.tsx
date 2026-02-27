"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { colors } from "../common/Colors";
import { FiSearch } from "react-icons/fi";

// ---------------- Types ----------------

type ApiTable = {
  _id: string;
  tableNumber: string;
  occupied: boolean;
};

type Table = {
  id: string;
  label: string; // "01", "02"
  occupied: boolean; // later from orders
};

type Category = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
};

type CartItem = {
  item: MenuItem;
  qty: number;
};

// ✅ Backend base URL (Vite env OR fallback)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard() {

console.log("ADMIN TOKEN:", localStorage.getItem("admin_token"));


  // ---------------- UI state ----------------

  const [tables, setTables] = useState<Table[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);

  const [activeTableId, setActiveTableId] = useState<string>("");
 
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const [search, setSearch] = useState("");
  // const [cart, setCart] = useState<CartItem[]>([]);
  const [cartByTable, setCartByTable] = useState<Record<string, CartItem[]>>(
    {},
  );
  const cart = cartByTable[activeTableId] || [];

  // ---------------- Axios instance (with token) ----------------
  // ⚠️ IMPORTANT: your login stored token as "admin_token"
  const axiosInstance = useMemo(() => {
    const token = localStorage.getItem("admin_token"); // ✅ correct key
    return axios.create({
      baseURL: API_BASE,
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }, []);

  // ---------------- Fetch tables from backend ----------------

  const fetchTables = async () => {
    setTablesLoading(true);
    try {
      const res = await axiosInstance.get("/api/tables");
      const data: ApiTable[] = res.data?.data || [];

      // ✅ map backend tables -> UI tables
      const mapped: Table[] = data.map((t) => ({
        id: t._id,
        label: t.tableNumber,
        occupied: !!t.occupied, // ✅ from backend
      }));

      setTables(mapped);

      // ✅ auto-select first table
      if (!activeTableId && mapped.length > 0) {
        setActiveTableId(mapped[0].id);
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to load tables",
      );
    } finally {
      setTablesLoading(false);
    }
  };
  

    // ---------------- Categories Dishes API ----------------

const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get("/api/menu/category");

    const data = res.data?.data || [];

    const mapped: Category[] = data.map((c: any) => ({
      id: c._id,
      name: c.name,
    }));

    setCategories(mapped);

    // auto select first category
    if (mapped.length > 0 && !activeCategoryId) {
      setActiveCategoryId(mapped[0].id);
    }
  } catch (err: any) {
    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load categories",
    );
  }
};

const fetchDishes = async () => {
  setMenuLoading(true);
  try {
    const res = await axiosInstance.get("/api/menu/dish");

    const data = res.data?.data || [];

    const mapped: MenuItem[] = data
      .filter((d: any) => d.isAvailable !== false)
      .map((d: any) => ({
        id: d._id,
        name: d.name,
        price: d.price,
        categoryId: d.categoryId?._id || d.categoryId,
      }));

    setItems(mapped);
  } catch (err: any) {
    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load dishes",
    );
  } finally {
    setMenuLoading(false);
  }
};

  // ---------------- Load active order for selected table ----------------
const loadActiveOrder = async (tableId: string) => {
  try {
    const res = await axiosInstance.get(`/api/orders/active/${tableId}`);
    const order = res.data?.data;

    const loadedCart: CartItem[] = (order?.items || []).map((i: any) => ({
      item: {
        id: i.dish?._id,
        name: i.dish?.name,
        price: i.dish?.price ?? 0,
        categoryId: i.dish?.categoryId?._id || i.dish?.categoryId,
      },
      qty: i.qty ?? 1,
    }));

    setCartByTable((prev) => ({
      ...prev,
      [tableId]: loadedCart,
    }));
  } catch (err: any) {
    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to load active order",
    );
  }
};

  // ✅ load tables once on page mount
  // ✅ when table changes -> load its active order
  useEffect(() => {
    if (!activeTableId) return;
    loadActiveOrder(activeTableId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTableId]);

  

  // ---------------- Filter items by category + search ----------------

  const visibleItems = useMemo(() => {
    const byCategory = items.filter((i) => i.categoryId === activeCategoryId);
    const q = search.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, activeCategoryId, search]);

  // ---------------- Cart actions ----------------

  const addToCart = (item: MenuItem) => {
    if (!activeTableId) return;

    setCartByTable((prev) => {
      const current = prev[activeTableId] || [];

      const idx = current.findIndex((x) => x.item.id === item.id);

      let updated: CartItem[];

      if (idx >= 0) {
        updated = [...current];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
      } else {
        updated = [...current, { item, qty: 1 }];
      }

      return { ...prev, [activeTableId]: updated };
    });
  };

  const decQty = (id: string) => {
    if (!activeTableId) return;

    setCartByTable((prev) => {
      const current = prev[activeTableId] || [];
      const idx = current.findIndex((x) => x.item.id === id);
      if (idx < 0) return prev;

      const copy = [...current];
      const nextQty = copy[idx].qty - 1;

      const updated =
        nextQty <= 0
          ? copy.filter((x) => x.item.id !== id)
          : copy.map((x) => (x.item.id === id ? { ...x, qty: nextQty } : x));

      return { ...prev, [activeTableId]: updated };
    });
  };

  const total = useMemo(
    () => cart.reduce((sum, c) => sum + c.qty * c.item.price, 0),
    [cart],
  );

  // ---------------- Place Order ----------------
  const placeOrder = async () => {
    if (!activeTableId) {
      return alert("Select a table first");
    }
    if (cart.length === 0) {
      return alert("Cart is empty");
    }

    try {
      await axiosInstance.post("/api/orders/place", {
        tableId: activeTableId,
        items: cart,
      });

      // ✅ refresh tables to update occupied status
      await fetchTables();

      alert("Order placed ✅");
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to place order",
      );
    }
  };

  // ✅ load tables once on page mount
useEffect(() => {
  fetchTables();
   fetchCategories();
  fetchDishes();
}, []);

  // ---------------- UI ----------------

  return (
    <>
      {/* Tables row */}
      <div
        className="rounded-2xl border p-3 flex flex-wrap gap-2"
        style={{ backgroundColor: colors.white, borderColor: colors.border }}
      >
        {tablesLoading ? (
          <div
            className="text-sm font-semibold"
            style={{ color: colors.textMuted }}
          >
            Loading tables...
          </div>
        ) : tables.length === 0 ? (
          <div
            className="text-sm font-semibold"
            style={{ color: colors.textMuted }}
          >
            No tables found. Create tables from Table Management.
          </div>
        ) : (
          tables.map((t) => {
            const isActive = t.id === activeTableId;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTableId(t.id)}
                className="h-10 px-4 rounded-xl text-sm font-extrabold border transition"
                style={{
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive
                    ? `${colors.primary}18`
                    : t.occupied
                      ? `${colors.success ?? "#22C55E"}22`
                      : colors.cardSoft,
                  color: t.occupied
                    ? (colors.success ?? "#16A34A")
                    : colors.textPrimary,
                }}
                title={t.occupied ? "Occupied" : "Free"}
              >
                {t.label}
              </button>
            );
          })
        )}
      </div>

      {/* Search + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left: Categories + Items */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: colors.white,
              borderColor: colors.border,
            }}
          >
            <FiSearch style={{ color: colors.textMuted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu item..."
              className="w-full outline-none text-sm font-semibold"
              style={{ color: colors.textPrimary }}
            />
          </div>

          {/* Categories grid */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c.id === activeCategoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategoryId(c.id)}
                  className="h-10 px-4 rounded-xl text-sm font-extrabold border"
                  style={{
                    backgroundColor: active ? colors.primary : colors.white,
                    color: active ? colors.white : colors.textPrimary,
                    borderColor: active ? colors.primary : colors.border,
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Items list */}
          <div
            className="rounded-2xl border p-3"
            style={{
              backgroundColor: colors.white,
              borderColor: colors.border,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {visibleItems.map((it) => (
                <button
                  key={it.id}
                  onClick={() => addToCart(it)}
                  className="rounded-2xl border p-4 text-left hover:opacity-95 transition"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.cardSoft,
                  }}
                >
                  <div
                    className="text-sm font-extrabold"
                    style={{ color: colors.textPrimary }}
                  >
                    {it.name}
                  </div>
                  <div
                    className="mt-1 text-xs font-semibold"
                    style={{ color: colors.textMuted }}
                  >
                    ₹ {it.price}
                  </div>
                  <div
                    className="mt-3 text-xs font-bold"
                    style={{ color: colors.primary }}
                  >
                    + Add
                  </div>
                </button>
              ))}
            </div>

            {visibleItems.length === 0 && (
              <div
                className="py-6 text-sm font-semibold text-center"
                style={{ color: colors.textMuted }}
              >
                No items found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart */}
        <div
          className="rounded-2xl border p-4 h-fit"
          style={{ backgroundColor: colors.white, borderColor: colors.border }}
        >
          <div
            className="text-sm font-extrabold"
            style={{ color: colors.textPrimary }}
          >
            Cart
          </div>

          <div
            className="text-xs font-semibold mt-1"
            style={{ color: colors.textMuted }}
          >
            Table:{" "}
            <span style={{ color: colors.textPrimary }}>
              {tables.find((t) => t.id === activeTableId)?.label ?? "-"}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {cart.map((c) => (
              <div
                key={c.item.id}
                className="rounded-xl border px-3 py-2 flex items-center justify-between"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.cardSoft,
                }}
              >
                <div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {c.item.name}
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: colors.textMuted }}
                  >
                    ₹ {c.item.price} × {c.qty}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decQty(c.item.id)}
                    className="h-8 w-8 rounded-xl font-extrabold border"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }}
                  >
                    −
                  </button>
                  <button
                    onClick={() => addToCart(c.item)}
                    className="h-8 w-8 rounded-xl font-extrabold"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div
                className="py-6 text-sm font-semibold text-center"
                style={{ color: colors.textMuted }}
              >
                Cart is empty.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div
              className="text-sm font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              Total
            </div>
            <div
              className="text-sm font-extrabold"
              style={{ color: colors.textPrimary }}
            >
              ₹ {total}
            </div>
          </div>

          <button
            onClick={placeOrder} // ✅ add this
            className="mt-4 w-full h-11 rounded-2xl text-sm font-extrabold"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}
