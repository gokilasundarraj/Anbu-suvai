import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

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
              <p>₹{item.price}</p>
              <p>Qty: {item.qty}</p>
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
                    state: { singleItem: item },
                  })
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
}
