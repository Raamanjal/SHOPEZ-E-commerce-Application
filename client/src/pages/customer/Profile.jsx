import { BadgeCheck, Mail, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useGeneralContext } from "../../context/GeneralContext.js";

export default function Profile() {
  const { orders, user } = useGeneralContext();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");

  return (
    <div className="page profile-page">
      <section className="panel profile-hero">
        <div className="profile-avatar">{user?.username?.[0] || "U"}</div>
        <div>
          <h2>{user?.username}</h2>
          <p><Mail size={16} /> {user?.email}</p>
          <span className="profile-role-chip">
            <BadgeCheck size={15} /> {user?.usertype === "admin" ? "Admin" : "Buyer"}
          </span>
        </div>
      </section>

      <section className="panel profile-form-panel">
        <h3>Personal Info</h3>
        <div className="profile-form-grid">
          <label>
            Full Name
            <input readOnly value={user?.username || ""} />
          </label>
          <label>
            Email
            <input readOnly value={user?.email || ""} />
          </label>
          <label className="profile-form-span">
            New Password (optional)
            <input placeholder="Leave blank to keep current" />
          </label>
        </div>
      </section>

      <section className="panel profile-form-panel">
        <h3>Shipping Address</h3>
        <div className="profile-form-grid">
          <label className="profile-form-span">
            Street
            <input placeholder="123 Main St" />
          </label>
          <label>
            City
            <input placeholder="City" />
          </label>
          <label>
            State
            <input placeholder="State" />
          </label>
          <label>
            ZIP
            <input placeholder="ZIP" />
          </label>
          <label>
            Country
            <input placeholder="Country" />
          </label>
        </div>
      </section>

      {activeTab === "orders" && (
        <section className="panel orders-panel" id="orders">
          <div className="section-heading">
            <h2>Orders</h2>
            <span>{orders.length} orders</span>
          </div>
          <div className="order-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div>
                  <h3>{order.items?.[0]?.title || "Order item"}</h3>
                  <p>
                    Size: {order.items?.[0]?.size} | Quantity: {order.items?.[0]?.quantity}
                  </p>
                  <p>Payment: {order.paymentMethod}</p>
                  <p>Status: {order.orderStatus}</p>
                </div>
                <div>
                  <p>Ordered: {new Date(order.orderDate).toLocaleDateString()}</p>
                  <p><MapPin size={14} /> {order.address || order.pincode}</p>
                  <p>Total: Rs {order.totalAmount}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
