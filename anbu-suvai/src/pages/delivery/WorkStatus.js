import { useState } from "react";
import DeliveryNav from "../../components/DeliveryNav";
import FinishedOrders from "./FinishedOrder";
import DeliveryManOrders from "./DeliverymanOrder";
import DeliveryFooter from '../../components/DeliveryFooter'

export default function WorkStatus() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="work-status">
      <DeliveryNav />

      <h2>Work Status</h2>

      <div className="work-tabs">
        <button
          className={`tab-btn ${
            activeTab === "pending" ? "active pending" : ""
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders
        </button>

        <button
          className={`tab-btn ${
            activeTab === "finished" ? "active finished" : ""
          }`}
          onClick={() => setActiveTab("finished")}
        >
          Finished Orders
        </button>
      </div>

      <div className="work-content">
        {activeTab === "pending" && <DeliveryManOrders />}
        {activeTab === "finished" && <FinishedOrders />}
      </div>
      <DeliveryFooter/>
    </div>
  );
}
