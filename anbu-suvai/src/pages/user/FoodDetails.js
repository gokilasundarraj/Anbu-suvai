import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import UserNav from "../../components/UserNav";
import Footer from "../../components/Footer";


export default function FoodDetails() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      const ref = doc(db, "foods", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setFood({ id: snap.id, ...snap.data() });
      }
    };
    fetchFood();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(food);
    setMessage("Item added to cart");
    setTimeout(() => setMessage(""), 2000);
  };

  if (!food) return <p>Loading...</p>;

  return (
    <div className="food-details">  
      <UserNav />

      <img
        src={food.image}
        alt={food.name}
        className="food-image"
      />

      <h2 className="food-title">{food.name}</h2>
      <p className="food-desc">{food.description}</p>
      <h3 className="food-price">₹{food.price}</h3>

      {message && (
        <p className="success-msg">{message}</p>
      )}

      <div className="btn-group">
        <button
          className="btn btn-cart"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        <button
          className="btn btn-buy"
          onClick={() =>
            navigate("/checkout", {
              state: { singleItem: { ...food, qty: 1 } },
            })
          }
        >
          Buy Now
        </button>
      </div>
      <Footer/>
    </div>
  );
}
