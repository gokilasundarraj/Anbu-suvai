import { useEffect, useState } from "react";
import {collection,getDocs,query,where,} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import DeliveryNav from "../../components/DeliveryNav";
import DeliveryFooter from "../../components/DeliveryFooter"

export default function DeliveryHome() {
  const [pendingCount, setPendingCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderCounts();
  }, []);

  const fetchOrderCounts = async () => {
    try {
      
      const pendingQuery = query(
        collection(db, "orders"),
        where("status", "==", "pending")
      );
      const pendingSnap = await getDocs(pendingQuery);
      setPendingCount(pendingSnap.size);

      const finishedQuery = query(
        collection(db, "orders"),
        where("status", "==", "delivered")
      );
      const finishedSnap = await getDocs(finishedQuery);
      setFinishedCount(finishedSnap.size);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-home">
      <DeliveryNav />

      <h1 className="delivery-title">
        Welcome Delivery Man 
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="delivery-stats">
          <div className="delivery-card pending">
            <h3>Pending Orders</h3>
            <p>{pendingCount}</p>
          </div>

          <div className="delivery-card finished">
            <h3>Finished Orders</h3>
            <p>{finishedCount}</p>
          </div>
        </div>
      )}
      <DeliveryFooter/>
    </div>
  );
}
