import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNav from "../../components/AdminNav";
import AdminFooter from '../../components/AdminFooter'

export default function CancelledOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(
        collection(db, "orders"),
        where("status", "==", "cancelled")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancelled-orders">
      <AdminNav />

      <h2 className="page-title cancelled-title">Cancelled Orders</h2>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p>No cancelled orders</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card cancelled-card">

            <div className="order-header">
              <p><b>Order ID:</b> {order.id}</p>
              <span className="order-status cancelled-status">
                Cancelled
              </span>
            </div>

            {order.items?.map((item, index) => (
              <div className="item-row" key={index}>
                <img
                  className="item-img"
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">
                    Qty: {item.qty} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>
      <AdminFooter/>
    </div>
  );
}
