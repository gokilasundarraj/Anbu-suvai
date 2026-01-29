import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Logo from '../img/logo1.jpeg'

export default function DeliveryNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logout successfully");
    navigate("/delivery/login");
  };

  return (
    <>

      <nav className="delivery-nav">
        
        <div className="nav-left">
          <img src={Logo} alt="logo" style={{borderRadius:"50%"}} />
        </div>

        <div className="nav-right">
          <FaBars
            className="menu-icon"
            onClick={() => setOpen(true)}
          />
        </div>
      </nav>

      <div className={`delivery-menu ${open ? "show" : ""}`}>
      
        <FaTimes
          className="close-icon"
          onClick={() => setOpen(false)}
        />

        <ul>
          <li onClick={() => navigate("/delivery")}>
            Home
          </li>
          <li onClick={() => navigate("/delivery/status")}>
            Work Status
          </li>

          <li className="logout" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
