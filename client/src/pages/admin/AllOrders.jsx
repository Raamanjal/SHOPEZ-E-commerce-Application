import { useGeneralContext } from "../../context/GeneralContext.js";

const statuses = ["order placed", "processing", "shipped", "delivered", "cancelled"];

export default function AllOrders() {
  const { adminOrders, updateOrderStatus } = useGeneralContext();

  return (
    <section className="page panel">
      <div className="section-heading">
        <h2>All Orders</h2>
        <span>{adminOrders.length} orders</span>
      </div>
      <div className="order-list">
        {adminOrders.map((order) => (
          <article className="order-card order-card--admin" key={order._id}>
            <div>
              <h3>{order.items?.map((item) => item.title).join(", ")}</h3>
              <p>Name: {order.name}</p>
              <p>Email: {order.email}</p>
              <p>Mobile: {order.mobile}</p>
              <p>Address: {order.address}</p>
            </div>
            <div>
              <p>Total: Rs {order.totalAmount}</p>
              <p>Ordered: {new Date(order.orderDate).toLocaleString()}</p>
              <select
                value={order.orderStatus}
                onChange={(event) => updateOrderStatus(order._id, event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
