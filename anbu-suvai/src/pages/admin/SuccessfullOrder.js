import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNav from "../../components/AdminNav";
import AdminFooter from '../../components/AdminFooter'

export default function SuccessfulOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      
      const q = query(
        collection(db, "orders"),
        where("status", "==", "delivered")
      );

      const snap = await getDocs(q);

      console.log("Delivered orders count:", snap.docs.length);

      const ordersWithUser = await Promise.all(
        snap.docs.map(async (orderDoc) => {
          const orderData = orderDoc.data();
          let username = "Customer";

          if (orderData.userId) {
            const userSnap = await getDoc(
              doc(db, "users", orderData.userId)
            );
            if (userSnap.exists()) {
              username = userSnap.data().username;
            }
          }

          return {
            id: orderDoc.id,
            ...orderData,
            username,
          };
        })
      );

      setOrders(ordersWithUser);
    } catch (error) {
      console.error("Error fetching successful orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="successful-orders">
      <AdminNav />

      <h2 className="page-title">Successful Orders</h2>

      {loading && <p className="loading-text">Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="empty-text">No successful orders</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <p>
                <b>Order ID:</b> {order.id}
              </p>
              <span className="order-status">Delivered</span>
            </div>

            <p>
              <b>User:</b> {order.username}
            </p>

            <p>
              <b>Address:</b> {order.address}
            </p>

            <h4 className="items-title">Items</h4>

            <div className="items-list">
              {order.items?.map((item, i) => (
                <div className="item-row" key={i}>
                  <img
                    className="item-img"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">
                      {item.qty} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="delivered-time">
              <b>Delivered At:</b>{" "}
              {order.deliveredAt
                ? order.deliveredAt.toDate().toLocaleString()
                : "—"}
            </p>
          </div>
        ))}
      </div>
      <AdminFooter/>
    </div>
  );
}
