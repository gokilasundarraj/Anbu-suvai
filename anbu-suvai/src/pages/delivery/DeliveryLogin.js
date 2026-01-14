import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DeliveryLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (name === "Deliveryman" && password === "gokilasundarraj") {
      setError("");
      alert("Login Successfully")
      navigate("/delivery"); 
    } else {
      setError("Invalid Delivery Man credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Delivery Man Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Deliveryman"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="gokilasundarraj"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
