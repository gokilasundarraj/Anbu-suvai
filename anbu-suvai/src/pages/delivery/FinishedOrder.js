import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import DeliveryFooter from "../../components/DeliveryFooter"

export default function FinishedOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchFinished = async () => {
      const q = query(
        collection(db, "orders"),
        where("status", "==", "delivered")
      );

      const snap = await getDocs(q);

      setOrders(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchFinished();
  }, []);

  return (
    <div className="finished-page">

      <h2 className="finished-title">Finished Orders</h2>

      {orders.length === 0 && (
        <p className="no-finished">No finished orders..</p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="finished-card">
          <div className="box">
          <p className="order-id">
            <b>Order ID:</b> {order.id}
          </p>

          <p className="order-address">
            <b>Address:</b> {order.address}
          </p>

          <div className="finished-items">
            {order.items.map((item) => (
              <div key={item.id} className="finished-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="finished-img"
                />

                <div className="finished-info">
                  <p className="food-name">{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      ))}
      <DeliveryFooter/>
    </div>
  );
}
