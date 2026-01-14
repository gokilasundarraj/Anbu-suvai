import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../img/logo.png";

export default function MainNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="nav-logo">
        <img src={Logo} alt="logo" />
      </div>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-menu ${open ? "active" : ""}`}>
        <button onClick={() => navigate("/user/signup")}>User</button>
        <button onClick={() => navigate("/admin/login")}>Admin</button>
        <button onClick={() => navigate("/delivery/login")}> Delivery</button>
      </div>
    </nav>
  );
}
