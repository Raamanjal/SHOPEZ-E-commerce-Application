import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import { useGeneralContext } from "./context/GeneralContext.js";
import Admin from "./pages/admin/Admin.jsx";
import AllOrders from "./pages/admin/AllOrders.jsx";
import AllProducts from "./pages/admin/AllProducts.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";
import NewProduct from "./pages/admin/NewProduct.jsx";
import UpdateProduct from "./pages/admin/UpdateProduct.jsx";
import Authentication from "./pages/Authentication.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/customer/Cart.jsx";
import CategoryProducts from "./pages/customer/CategoryProducts.jsx";
import IndividualProduct from "./pages/customer/IndividualProduct.jsx";
import Profile from "./pages/customer/Profile.jsx";
import "./App.css";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useGeneralContext();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user.usertype !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/auth";
  const { status } = useGeneralContext();

  return (
    <div className={`app-shell ${isAdminRoute ? "admin-shell" : ""}`}>
      {!isAuthRoute && <Navbar adminMode={isAdminRoute} />}
      <main className="app-main">
        {(status.error || status.success) && (
          <div className={`app-status ${status.error ? "error" : "success"}`}>
            {status.error || status.success}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/products" element={<CategoryProducts />} />
          <Route path="/products/:category" element={<CategoryProducts />} />
          <Route path="/product/:id" element={<IndividualProduct />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AllOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <AllProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute adminOnly>
                <NewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <UpdateProduct />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
