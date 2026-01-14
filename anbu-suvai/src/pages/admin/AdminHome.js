import { useEffect, useState } from "react";
import { collection,getDocs,query,where,} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import AdminNav from "../../components/AdminNav";
import AdminFooter from '../../components/AdminFooter'

export default function AdminHome() {
  const [usersCount, setUsersCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [successOrders, setSuccessOrders] = useState(0);
  const [cancelOrders, setCancelOrders] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
  
      const usersSnap = await getDocs(collection(db, "users"));
      setUsersCount(usersSnap.size);

      const usersData = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      const ordersSnap = await getDocs(collection(db, "orders"));
      setTotalOrders(ordersSnap.size);

      const successQuery = query(
        collection(db, "orders"),
        where("status", "==", "delivered")
      );
      const successSnap = await getDocs(successQuery);
      setSuccessOrders(successSnap.size);

      let profit = 0;
      successSnap.docs.forEach((doc) => {
        const order = doc.data();
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            profit += (item.price || 0) * (item.qty || 0);
          });
        }
      });
      setTotalProfit(profit);

      const cancelQuery = query(
        collection(db, "orders"),
        where("status", "==", "cancelled")
      );
      const cancelSnap = await getDocs(cancelQuery);
      setCancelOrders(cancelSnap.size);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNav />

      <h1 className="dashboard-title">Admin Dashboard</h1>

      {loading && (
        <p className="dashboard-loading">Loading dashboard...</p>
      )}

      {!loading && (
        <div className="full">
      
          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Users</p>
              <h3>{usersCount}</h3>
            </div>

            <div className="stat-card">
              <p>Total Orders</p>
              <h3>{totalOrders}</h3>
            </div>

            <div className="stat-card">
              <p>Successful Orders</p>
              <h3>{successOrders}</h3>
            </div>

            <div className="stat-card">
              <p>Cancelled Orders</p>
              <h3>{cancelOrders}</h3>
            </div>

            <div className="stat-card profit-card">
              <p>Total Profit</p>
              <h3>₹{totalProfit}</h3>
            </div>
          </div>

          <div className="users-section">
            <h2>User Details</h2>

            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Password</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.username || user.name || "-"}</td>
                        <td>{user.email || "-"}</td>
                        <td className="password-cell">
                          {user.password || "******"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      <AdminFooter/>
    </div>
  );
}
