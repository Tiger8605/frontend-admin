// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import AdminLogin from "./screens/AdminLogin";
// import Dashboard from "./screens/Dashboard";
// import AdminLayout from "./ui/layout/AdminLayout";
// import AdminRegister from "./screens/AdminRegister";
// import MenuManagement from "./screens/MenuManagement";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/register" element={<AdminRegister />} />
//         {/* <Route path="/admin/menu" element={<MenuManagement />} /> */}


//         {/* Protected layout later */}
//         <Route path="/admin" element={<AdminLayout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route index element={<Navigate to="/admin/dashboard" replace />} />
//           <Route index element={<Navigate to="/admin/menu" replace />} />
//           <Route index element={<Navigate to="/admin/analytics" replace />} />

//         </Route>

//         <Route path="*" element={<Navigate to="/admin/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./screens/AdminLogin";
import Dashboard from "./screens/Dashboard";
import AdminLayout from "./ui/layout/AdminLayout";
import AdminRegister from "./screens/AdminRegister";
import MenuManagement from "./screens/MenuManagement";
import TableManagement from "./screens/TableManagement";
import OrderManagement from "./screens/OrderManagement";
import Analytics from "./screens/Analytics";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Layout Routes (NOT PROTECTED) */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* Default redirect when visiting /admin */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="tables" element={<TableManagement />}/>
          <Route path="Orders" element={<OrderManagement/>}/>
          {/* If you add analytics later */}
          {/* <Route path="analytics" element={<Analytics />} /> */}

        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}