import {
  createElement,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

const GeneralContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const initialBanner = {
  banner: [],
  categories: ["Fashion", "Electronics", "Mobiles", "Groceries", "Sports Equipment"],
};

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function GeneralProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("shopez-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("shopez-token") || "");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(initialBanner.categories);
  const [bannerData, setBannerData] = useState(initialBanner);
  const [cart, setCart] = useState({ items: [], totals: { subtotal: 0, discountedTotal: 0 } });
  const [orders, setOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const isBootstrapped = useRef(false);

  const setMessage = (updates) => {
    setStatus((current) => ({ ...current, ...updates }));
  };

  const request = async (endpoint, options = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return parseResponse(response);
  };

  const loadStorefront = async () => {
    try {
      const [productData, categoryData, banner] = await Promise.all([
        request("/products"),
        request("/products/categories/all"),
        request("/banner").catch(() => initialBanner),
      ]);

      setProducts(productData);
      setCategories(categoryData.length ? categoryData : initialBanner.categories);
      setBannerData(banner.banner ? banner : initialBanner);
    } catch (error) {
      setMessage({ error: error.message });
    }
  };

  const loadCart = async () => {
    if (!token) {
      setCart({ items: [], totals: { subtotal: 0, discountedTotal: 0 } });
      return;
    }

    try {
      const data = await request("/cart");
      setCart(data);
    } catch (error) {
      setMessage({ error: error.message });
    }
  };

  const loadOrders = async () => {
    if (!token) {
      setOrders([]);
      return;
    }

    try {
      const data = await request("/orders/my-orders");
      setOrders(data);
    } catch (error) {
      setMessage({ error: error.message });
    }
  };

  const loadAdminData = async () => {
    if (!token || user?.usertype !== "admin") {
      setAdminOrders([]);
      setUsers([]);
      setDashboard(null);
      return;
    }

    try {
      const [orderData, userData, dashboardData] = await Promise.all([
        request("/orders/admin/all"),
        request("/users"),
        request("/admin/dashboard"),
      ]);

      setAdminOrders(orderData);
      setUsers(userData);
      setDashboard(dashboardData);
    } catch (error) {
      setMessage({ error: error.message });
    }
  };

  const loadStorefrontEffect = useEffectEvent(() => {
    void loadStorefront();
  });

  const loadSessionDataEffect = useEffectEvent(() => {
    void loadCart();
    void loadOrders();
    void loadAdminData();
  });

  useEffect(() => {
    if (!isBootstrapped.current) {
      isBootstrapped.current = true;
      queueMicrotask(() => {
        loadStorefrontEffect();
      });
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadSessionDataEffect();
    });
  }, [token, user]);

  const persistAuth = (data) => {
    localStorage.setItem("shopez-token", data.token);
    localStorage.setItem("shopez-user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const clearAuth = () => {
    localStorage.removeItem("shopez-token");
    localStorage.removeItem("shopez-user");
    setToken("");
    setUser(null);
    setOrders([]);
    setAdminOrders([]);
    setUsers([]);
    setCart({ items: [], totals: { subtotal: 0, discountedTotal: 0 } });
  };

  const register = async (payload) => {
    setMessage({ loading: true, error: "", success: "" });

    try {
      const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      persistAuth(data);
      setMessage({ loading: false, success: "Registration successful" });
      return data;
    } catch (error) {
      setMessage({ loading: false, error: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (payload) => {
    setMessage({ loading: true, error: "", success: "" });

    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      persistAuth(data);
      setMessage({ loading: false, success: "Login successful" });
      return data;
    } catch (error) {
      setMessage({ loading: false, error: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    setMessage({ success: "Logged out successfully", error: "" });
    toast.success("Logged out successfully");
  };

  const addToCart = async ({ productId, size, quantity }) => {
    try {
      await request("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, size, quantity }),
      });
      await loadCart();
      setMessage({ success: "Product added to cart", error: "" });
      toast.success("Added to cart");
    } catch (error) {
      setMessage({ error: error.message });
      toast.error(error.message);
      throw error;
    }
  };

  const removeCartItem = async (id) => {
    await request(`/cart/${id}`, { method: "DELETE" });
    await loadCart();
    toast.success("Removed from cart");
  };

  const placeOrder = async (payload) => {
    const order = await request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await Promise.all([loadCart(), loadOrders(), loadAdminData()]);
    setMessage({ success: "Order placed successfully", error: "" });
    toast.success("Order placed");
    return order;
  };

  const createProduct = async (payload) => {
    await request("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await Promise.all([loadStorefront(), loadAdminData()]);
    toast.success("Product created");
  };

  const saveProduct = async (id, payload) => {
    await request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    await Promise.all([loadStorefront(), loadAdminData()]);
    toast.success("Product updated");
  };

  const deleteProduct = async (id) => {
    await request(`/products/${id}`, { method: "DELETE" });
    await Promise.all([loadStorefront(), loadAdminData()]);
    toast.success("Product deleted");
  };

  const updateOrderStatus = async (id, orderStatus) => {
    await request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus }),
    });
    await Promise.all([loadOrders(), loadAdminData()]);
    toast.success("Order status updated");
  };

  const updateBanner = async (payload) => {
    const data = await request("/banner", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    setBannerData(data);
    await loadAdminData();
    toast.success("Banner updated");
  };

  const getProductById = async (id) => {
    const existing = products.find((product) => product._id === id);
    return existing || request(`/products/${id}`);
  };

  const refreshStore = () => {
    startTransition(() => {
      loadStorefront();
      loadCart();
      loadOrders();
      loadAdminData();
    });
  };

  const value = {
    user,
    token,
    products,
    categories,
    bannerData,
    cart,
    orders,
    adminOrders,
    users,
    dashboard,
    globalSearch,
    status,
    setGlobalSearch,
    register,
    login,
    logout,
    addToCart,
    removeCartItem,
    placeOrder,
    createProduct,
    saveProduct,
    deleteProduct,
    updateOrderStatus,
    updateBanner,
    getProductById,
    refreshStore,
  };

  return createElement(GeneralContext.Provider, { value }, children);
}

export function useGeneralContext() {
  const context = useContext(GeneralContext);

  if (!context) {
    throw new Error("useGeneralContext must be used inside GeneralProvider");
  }

  return context;
}
