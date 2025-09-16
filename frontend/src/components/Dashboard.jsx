import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome {user?.email}</h2>
    </div>
  );
}
