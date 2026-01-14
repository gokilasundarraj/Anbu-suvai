import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(list);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const successOrders = orders.filter(
    (order) => order.status !== "cancelled"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  );

  return (
    <>
      <UserNav />

      <div className="order-history">
        <h2 className="page-title">ORDER HISTORY</h2>

        {loading && (
          <p className="empty-text">Loading orders...</p>
        )}

        <h3 className="section-title success">
          Successful Orders
        </h3>

        {!loading && successOrders.length === 0 && (
          <p className="empty-text">
            No successful orders
          </p>
        )}

        {successOrders.map((order) => (
          <div
            className="order-card success-card"
            key={order.id}
          >
            <p className="order-status">
              <b>Status:</b> {order.status}
            </p>

            {order.address && (
              <p className="order-address">
                <b>Address:</b> {order.address}
              </p>
            )}

            <h4 className="items-title">Items</h4>

            {order.items?.map((item, index) => (
              <div className="item-row" key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                />

                <div className="item-info">
                  <p className="item-name">
                    {item.name}
                  </p>
                  <p className="item-price">
                    {item.qty} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}


        <h3 className="section-title cancelled">
          Cancelled Orders
        </h3>

        {!loading && cancelledOrders.length === 0 && (
          <p className="empty-text">
            No cancelled orders
          </p>
        )}

        {cancelledOrders.map((order) => (
          <div
            className="order-card cancelled-card"
            key={order.id}
          >
            <p className="cancel-text">
              Cancelled
            </p>

            <h4 className="items-title">Items</h4>

            {order.items?.map((item, index) => (
              <div className="item-row" key={index}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                />

                <div className="item-info">
                  <p className="item-name">
                    {item.name}
                  </p>
                  <p className="item-price">
                    {item.qty} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
