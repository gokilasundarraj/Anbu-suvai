import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default function DeliveryManOrders() {
  const [orders, setOrders] = useState([]);
  const [otpInput, setOtpInput] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(
      collection(db, "orders"),
      where("status", "in", ["pending", "assigned"])
    );

    const snap = await getDocs(q);
    setOrders(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  const openMap = (lat, lng) => {
    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank"
    );
  };

  const requestDelivery = async (id) => {
    await updateDoc(doc(db, "orders", id), {
      status: "assigned",
      deliveryRequested: true,
    });

    alert("Delivery request sent..");
    fetchOrders();
  };

  const verifyOTP = async (order) => {
    if (otpInput[order.id] == order.otp) {
      await updateDoc(doc(db, "orders", order.id), {
        status: "delivered",
        deliveredAt: new Date(),
      });

      alert("Delivery successfully");
      fetchOrders();
    } else {
      alert("Wrong OTP");
    }
  };

  return (
    <div className="delivery-page">

      <h2>Pending Deliveries</h2>

      {orders.length === 0 && (
        <p className="no-orders">No pending orders</p>
      )}

      {orders.map((order) => (
        <div className="delivery-card" key={order.id}>
          <div className="box">
          <p>
            <b>User:</b> {order.name || "Customer"}
          </p>

          <p>
            <b>Address:</b> {order.address}
          </p>

          <button
            className="map-btn"
            onClick={() =>
              openMap(order.location.lat, order.location.lng)
            }
          >
            Open Location
          </button>

          <div className="delivery-items">
            {order.items.map((item) => (
              <div className="delivery-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                />
                <div>
                  <p>{item.name}</p>
                  <p>
                    {item.qty} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {order.status === "pending" && (
            <button
              className="request-btn"
              onClick={() => requestDelivery(order.id)}
            >
              Request Delivery
            </button>
          )}

          {order.status === "assigned" && (
            <div className="otp-box">
              <input
                type="number"
                placeholder="Enter OTP"
                value={otpInput[order.id] || ""}
                onChange={(e) =>
                  setOtpInput({
                    ...otpInput,
                    [order.id]: e.target.value,
                  })
                }
              />
              <button onClick={() => verifyOTP(order)}>
                OK
              </button>
            </div>
          )}
          </div>
        </div>
      ))}

    </div>
  );
}
