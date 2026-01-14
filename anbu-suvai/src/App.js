import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainHome from "./pages/home/MainHome";
import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserHome from "./pages/user/UserHome";
import FoodDetails from "./pages/user/FoodDetails";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrder";
import OrderHistory from "./pages/user/OrderHistory";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AddFood from "./pages/admin/Addfood";
import SuccessfulOrders from "./pages/admin/SuccessfullOrder";
import CancelledOrders from "./pages/admin/CancelledOrder";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryHome from "./pages/delivery/DeliveryHome";
import DeliverymanOrders from "./pages/delivery/DeliverymanOrder";
import FinishedOrders from "./pages/delivery/FinishedOrder";
import WorkStatus from "./pages/delivery/WorkStatus";
import { CartProvider } from "./context/CartContext";
import Loading from "./components/Loading";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <CartProvider>
      <Routes>
       
        <Route path="/" element={<MainHome />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/userorder" element={<OrderHistory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/add-food" element={<AddFood />} />
        <Route path="/admin/successfullorder" element={<SuccessfulOrders />} />
        <Route path="/admin/cancelledorder" element={<CancelledOrders />} />
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery" element={<DeliveryHome />} />
        <Route path="/orderpending" element={<DeliverymanOrders />} />
        <Route path="/delivery/finish" element={<FinishedOrders />} />
        <Route path="/delivery/status" element={<WorkStatus />} />
      </Routes>
    </CartProvider>
  );
}
