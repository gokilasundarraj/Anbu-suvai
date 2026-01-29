import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [qtyMap, setQtyMap] = useState({});

  useEffect(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.qty || 1;
    });
    setQtyMap(map);
  }, [cart]);

  const increaseQty = (id) => {
    setQtyMap((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQtyMap((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <UserNav />
        <h3 className="cart-empty">No item in cart</h3>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <UserNav />
      <h2 className="cart-title">CART</h2>

      <div className="cart-list">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="cart-details">
              <h3>{item.name}</h3>

        
              <p>₹{item.price * qtyMap[item.id]}</p>

              <div className="qty-box">
                <button onClick={() => decreaseQty(item.id)}>-</button>
                <span>{qtyMap[item.id]}</span>
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>

              <button
                className="buy-btn"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      singleItem: { ...item, qty: qtyMap[item.id] },
                    },
                  })
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
