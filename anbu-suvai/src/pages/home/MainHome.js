import React from "react";
import MainNav from "../../components/MainNav";
import { useNavigate } from "react-router-dom";

export default function MainHome() {
  const navigate = useNavigate()
  return (
    <div className="main-home">
      <MainNav />

      <section className="hero">
        <h1>Welcome to Anbu Suvai</h1>
        <p>Fresh • Fast • Delivered with Love</p>
      </section>

      <section className="features">
        <div className="feature-card" onClick={() => navigate("/user/signup")}>
          <h3>Order Food</h3>
          <p>Best hotels near you</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/admin/login")}>
          <h3>Admin Panel</h3>
          <p>Manage foods & orders</p>
        </div>

        <div className="feature-card" onClick={() => navigate("/delivery/login")}>
          <h3>Delivery</h3>
          <p>Fast & safe delivery</p>
        </div>
      </section>

      <footer className="footer">
        © 2025 Anbu Suvai
      </footer>
    </div>
  );
}
