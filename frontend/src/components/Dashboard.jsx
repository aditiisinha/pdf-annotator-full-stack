import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div>
      <h2>Welcome {user?.email}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
