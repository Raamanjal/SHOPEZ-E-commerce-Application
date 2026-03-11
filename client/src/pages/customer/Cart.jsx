import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGeneralContext } from "../../context/GeneralContext.js";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, placeOrder, removeCartItem, status, user } = useGeneralContext();
  const [orderForm, setOrderForm] = useState({
    name: user?.username || "",
    email: user?.email || "",
    mobile: "",
    address: "",
    pincode: "",
    paymentMethod: "cash on delivery",
  });

  const totals = useMemo(() => cart.totals || { subtotal: 0, discountedTotal: 0 }, [cart.totals]);

  const handleOrder = async (event) => {
    event.preventDefault();
    await placeOrder(orderForm);
    navigate("/profile");
  };

  return (
    <div className="page cart-layout">
      <section className="panel cart-list">
        <div className="section-heading">
          <h2>Cart</h2>
          <span>{cart.items.length} items</span>
        </div>
        {cart.items.map((item) => (
          <article className="cart-item" key={item._id}>
            <img src={item.mainImg} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                Size: <strong>{item.size}</strong> | Quantity: <strong>{item.quantity}</strong>
              </p>
              <p>Price: Rs {item.price - (item.discount || 0)}</p>
            </div>
            <button className="danger-button" onClick={() => removeCartItem(item._id)}>
              Remove
            </button>
          </article>
        ))}
      </section>

      <aside className="panel cart-summary">
        <h2>Place Order</h2>
        <div className="summary-line">
          <span>Total MRP</span>
          <strong>Rs {totals.subtotal}</strong>
        </div>
        <div className="summary-line">
          <span>Discount</span>
          <strong>- Rs {Math.max(totals.subtotal - totals.discountedTotal, 0)}</strong>
        </div>
        <div className="summary-line total">
          <span>Final Price</span>
          <strong>Rs {totals.discountedTotal}</strong>
        </div>
        <form className="stack-form" onSubmit={handleOrder}>
          <input
            placeholder="Full name"
            value={orderForm.name}
            onChange={(event) => setOrderForm({ ...orderForm, name: event.target.value })}
          />
          <input
            placeholder="Email"
            value={orderForm.email}
            onChange={(event) => setOrderForm({ ...orderForm, email: event.target.value })}
          />
          <input
            placeholder="Mobile"
            value={orderForm.mobile}
            onChange={(event) => setOrderForm({ ...orderForm, mobile: event.target.value })}
          />
          <textarea
            placeholder="Address"
            value={orderForm.address}
            onChange={(event) => setOrderForm({ ...orderForm, address: event.target.value })}
          />
          <input
            placeholder="Pincode"
            value={orderForm.pincode}
            onChange={(event) => setOrderForm({ ...orderForm, pincode: event.target.value })}
          />
          <select
            value={orderForm.paymentMethod}
            onChange={(event) =>
              setOrderForm({ ...orderForm, paymentMethod: event.target.value })
            }
          >
            <option value="cash on delivery">Cash on delivery</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
          <button className="primary-button" disabled={!cart.items.length} type="submit">
            Place order
          </button>
        </form>
        {status.error && <p className="message error">{status.error}</p>}
      </aside>
    </div>
  );
}
