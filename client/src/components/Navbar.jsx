import { startTransition, useState } from "react";
import {
  Bolt,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  UserCircle2,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useGeneralContext } from "../context/GeneralContext.js";

export default function Navbar({ adminMode = false }) {
  const { cart, globalSearch, setGlobalSearch, user, logout } = useGeneralContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (adminMode) {
    return (
      <header className="navbar navbar-admin">
        <Link className="brand" to="/admin">
          <Bolt size={16} /> ShopEZ <span>(admin)</span>
        </Link>
        <nav className="admin-nav">
          <NavLink to="/admin">Home</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/products/new">New Product</NavLink>
          <button className="ghost-button icon-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </header>
    );
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <Bolt size={16} /> ShopEZ
      </Link>
      <div className="navbar-search">
        <Search size={16} />
        <input
          type="search"
          placeholder="Search Electronics, Fashion, mobiles, etc."
          value={globalSearch}
          onChange={(event) => {
            const { value } = event.target;
            startTransition(() => setGlobalSearch(value));
          }}
        />
        <button onClick={() => navigate("/products")}>Search</button>
      </div>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Shop</NavLink>
        <NavLink to="/products?featured=true">Featured</NavLink>
        {user ? (
          <>
            <NavLink className="nav-icon-link cart-link" to="/cart">
              <ShoppingCart size={18} />
              <span className="cart-badge">{cart.items.length}</span>
            </NavLink>
            <div className="profile-menu">
              <button className="ghost-button profile-trigger" onClick={() => setMenuOpen((open) => !open)}>
                <UserCircle2 size={18} />
                {user.username}
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="profile-dropdown">
                  <Link className="dropdown-item" onClick={() => setMenuOpen(false)} to="/profile">
                    <UserCircle2 size={16} /> Profile
                  </Link>
                  <Link className="dropdown-item" onClick={() => setMenuOpen(false)} to="/profile?tab=orders">
                    <Package size={16} /> Orders
                  </Link>
                  {user.usertype === "admin" && (
                    <Link className="dropdown-item" onClick={() => setMenuOpen(false)} to="/admin">
                      <LayoutDashboard size={16} /> Admin
                    </Link>
                  )}
                  <button className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <NavLink className="nav-icon-link" to="/auth">
            <ShoppingBag size={18} />
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
