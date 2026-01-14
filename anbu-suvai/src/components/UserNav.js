import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../img/logo.png'
import {
  FaBars,
  FaTimes,
  FaUserCircle
} from "react-icons/fa";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase/auth";
import { db } from "../firebase/firebaseConfig";

export default function UserNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUsername(snap.data().name); 
        }
      } else {
        setUsername("");
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logout successfully");
    navigate("/user/login");
  };

  return (
    <>
      
      <nav className="user-nav">
        <div className="nav-left">
          <img src={Logo} alt=""/>
        </div>

        <div className="nav-right">
          <div className="profile-box">
            <FaUserCircle className="profile-icon" />
            <span className="profile-name">
              {username || "User"}
            </span>
          </div>

          <FaBars
            className="menu-icon"
            onClick={() => setOpen(true)}
          />
        </div>
      </nav>

      <div className={`side-menu ${open ? "show" : ""}`}>
       
        <ul>
          <li onClick={() => navigate("/user/home")}>Home</li>
          <li onClick={() => navigate("/cart")}>Add to Cart</li>
          <li onClick={() => navigate("/myorders")}>My Orders</li>
          <li onClick={() => navigate("/userorder")}>History</li>

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
