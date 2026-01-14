import Logo from '../img/logo.png'
import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();

  return (
    
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-left">
          <img src={Logo} className="footer-logo" alt=""/>
          <p className="footer-text">
            Delicious food delivered fresh & fast.
          </p>
        </div>

        <div className="footer-middle">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => navigate("/user/home")}>Home</li>
            <li onClick={() => navigate("/myorders")}>My Orders</li>
            <li onClick={() => navigate("/userorder")}>History</li>
          </ul>
        </div>

        <div className="footer-right">
          <h4>Contact</h4>
          <p>+91 9025100000</p>
          <p>support@anbusuvai.com</p>
          <p>Coimbatore, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Anbu Suvai. All rights reserved.</p>
      </div>
    </footer>
  );
}
