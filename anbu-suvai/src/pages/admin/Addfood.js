import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNav from "../../components/AdminNav";

export default function AddFood() {
  const [food, setFood] = useState({
    name: "",
    qty: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const [foods, setFoods] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !food.name ||
      !food.qty ||
      !food.price ||
      !food.description ||
      !food.category ||
      !food.image
    ) {
      alert("Please fill all details..");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "foods", editId), food);
        setEditId(null);
      } else {
        await addDoc(collection(db, "foods"), food);
      }

      setFood({
        name: "",
        qty: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });

      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFoods = async () => {
    const snapshot = await getDocs(collection(db, "foods"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFoods(list);
  };

  const deleteFood = async (id) => {
    await deleteDoc(doc(db, "foods", id));
    fetchFoods();
  };

  const editFood = (item) => {
    setFood(item);
    setEditId(item.id);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return (
    <div className="add-food">
      <AdminNav />

      <h2 className="add-food-title">Add Food</h2>

      <form className="food-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Food Name"
          value={food.name}
          onChange={handleChange}
        />

        <input
          name="qty"
          placeholder="Quantity"
          value={food.qty}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          value={food.price}
          onChange={handleChange}
        />

        <input
          name="image"
          placeholder="Image URL"
          value={food.image}
          onChange={handleChange}
        />

        {food.image && (
          <img className="preview-img" src={food.image} alt="preview" />
        )}

        <select
          name="category"
          value={food.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option>Veg</option>
          <option>Non-Veg</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={food.description}
          onChange={handleChange}
        />

        <button className="submit-btn" type="submit">
          {editId ? "Update Food" : "Add Food"}
        </button>
      </form>

      <hr />

      <div className="food-grid">
        {foods.map((item) => (
          <div className="food-card" key={item.id}>
            <img
              className="food-img"
              src={item.image}
              alt={item.name}
            />

            <h3 className="food-name">{item.name}</h3>
            <p className="food-price">₹{item.price}</p>

            <div className="food-actions">
              <button
                className="edit-btn"
                onClick={() => editFood(item)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteFood(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
