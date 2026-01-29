import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";


export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();

      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((order) => {
          if (order.status === "cancelled") return false;

          if (order.status === "delivered" && order.deliveredAt) {
            const deliveredTime = order.deliveredAt.seconds * 1000;
            if (now - deliveredTime > 120000) return false;
          }

          return true;
        });

      setOrders(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Order cancel panna poriya?")) return;

    await updateDoc(doc(db, "orders", orderId), {
      status: "cancelled",
      cancelledAt: serverTimestamp(),
    });
  };

  return (
    <div className="myorders-page">
      <UserNav />
      <h2 className="page-title">MY ORDERS</h2>

      {loading && <p className="status-message">Loading orders...</p>}
      {!loading && orders.length === 0 && (
        <p className="status-message">No active orders</p>
      )}

      {orders.map((order) => {
  
        const estimatedDeliveryTime = new Date(
          order.createdAt.seconds * 1000 + 60 * 60 * 1000
        );
        const options = { hour: "2-digit", minute: "2-digit", hour12: true };
        const deliveryTimeStr = estimatedDeliveryTime.toLocaleTimeString([], options);

        return (
          <div key={order.id} className="order-card">
            <p className="order-status">
              <b>Status:</b>{" "}
              {order.status === "pending" && (
                <span className="status-pending">Pending</span>
              )}
              {order.status === "assigned" && (
                <span className="status-assigned">Out for delivery</span>
              )}
              {order.status === "delivered" && (
                <span className="status-delivered">Delivered</span>
              )}
            </p>

            <p className="order-address">
              <b>Address:</b> {order.address}
            </p>

            {order.status === "assigned" && (
              <p className="order-otp">Delivery OTP: {order.otp}</p>
            )}

            {(order.status === "pending" || order.status === "assigned") && (
              <p className="order-delivery-time">
                Estimated Delivery: {deliveryTimeStr}
              </p>
            )}

            <h4 className="items-title">Items</h4>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      {item.qty} × ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.status === "pending" && (
              <button
                className="cancel-btn"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        );
      })}
      <Footer/>
    </div>
  );
}
