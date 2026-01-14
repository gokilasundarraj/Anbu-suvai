import { useEffect, useState } from "react";
import UserNav from "../../components/UserNav";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

export default function UserHome() {
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchFoods = async () => {
    try {
      let q;

      if (activeCategory === "Veg" || activeCategory === "Non-Veg") {
        q = query(
          collection(db, "foods"),
          where("category", "==", activeCategory)
        );
      } else {
        q = collection(db, "foods");
      }

      const snapshot = await getDocs(q);

      let list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (search.trim() !== "") {
        list = list.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setFoods(list);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [activeCategory, search]);

  return (
    <div>
      <UserNav />

      <div className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered Fast...</h1>
          <p>Search & order your favourite food</p>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>
      </div>

      <div className="category">
        <button
          className={activeCategory === "all" ? "active" : ""}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>

        <button
          className={activeCategory === "Veg" ? "active" : ""}
          onClick={() => setActiveCategory("Veg")}
        >
          Veg
        </button>

        <button
          className={activeCategory === "Non-Veg" ? "active" : ""}
          onClick={() => setActiveCategory("Non-Veg")}
        >
          Non-Veg
        </button>
      </div>

      <div className="food-grid">
        {foods.length === 0 ? (
          <p className="no-food">No food found..</p>
        ) : (
          foods.map((item) => (
            <div
              className="food-card"
              key={item.id}
              onClick={() => navigate(`/food/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
}
