import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../img/logo1.jpeg'

export default function AdminNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setOpen(false);
    alert("Logout successfully..")
    navigate("/admin/login");
  };

  return (
    <>
     
      <div className="admin-nav">
        <img src={Logo} />

        <div className="menu-icon"  onClick={() => setOpen(true)}>
          ☰
        </div>
      </div>

      <div className={`side-menu ${open ? "open" : ""}`}>
       
        <span className="close" onClick={() => setOpen(false)}>
          ✖
        </span>

        <Link to="/admin" onClick={() => setOpen(false)}>
          Dashboard
        </Link>

        <Link to="/admin/add-food" onClick={() => setOpen(false)}>
          Add Food
        </Link>

         <Link to="/admin/successfullorder" onClick={() => setOpen(false)}>
          Finished Orders
        </Link>
         <Link to="/admin/cancelledorder" onClick={() => setOpen(false)}>
          Cancelled Orders
        </Link>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </>
  );
}
