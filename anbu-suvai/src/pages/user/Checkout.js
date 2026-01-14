import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import UserNav from "../../components/UserNav";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Footer from "../../components/Footer";

export default function Checkout() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const singleItem = location.state?.singleItem;

  const items = singleItem
    ? [{ ...singleItem, qty: singleItem.qty || 1 }]
    : cart;

  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setLat(latitude);
        setLng(longitude);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        if (data.address) {
          const a = data.address;
          const fullAddress = [
            a.house_number,
            a.road,
            a.suburb || a.neighbourhood,
            a.city || a.town || a.village,
            a.state,
            a.postcode,
          ]
            .filter(Boolean)
            .join(", ");

          setAddress(fullAddress);
        }

        setLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const placeOrder = async () => {
    if (!address || !lat || !lng) {
      alert("Location select pannu bro");
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await addDoc(collection(db, "orders"), {
      items,
      address,
      location: { lat, lng },
      status: "pending",
      otp,
      createdAt: serverTimestamp(),
    });

    alert("Order placed..");
    navigate("/myorders");
  };

  return (
    <div className="checkout-page">
      <UserNav />

      <h2>Checkout</h2>

      <div className="checkout-items">
        {items.map((item) => (
          <div className="checkout-item" key={item.id}>
            <img
              src={item.image}
              alt={item.name}
              className="checkout-item-img"
            />

            <div className="checkout-item-info">
              <p className="checkout-item-name">{item.name}</p>
              <p className="checkout-item-qty">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="address-box">
        <h3>Delivery Address</h3>

        <textarea
          rows="4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery address"
        />

        <button
          className="location-btn"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? "Getting location..." : "Use Current Location"}
        </button>
      </div>

      <div className="place-order-bar">
        <button
          className="place-order-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
      <Footer/>
    </div>
  );
}
