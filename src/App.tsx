import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./screens/AdminLogin";
import Dashboard from "./screens/Dashboard";
import AdminLayout from "./ui/layout/AdminLayout";
import AdminRegister from "./screens/AdminRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected layout later */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route index element={<Navigate to="/admin/menu" replace />} />
          <Route index element={<Navigate to="/admin/analytics" replace />} />

        </Route>

        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}