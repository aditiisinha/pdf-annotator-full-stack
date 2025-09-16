import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">PDF Annotator</h1>
      </div>

      <div className="navbar-center">
        <ul className="navbar-links">
          <li><a href="/dashboard" className="active">Dashboard</a></li>
          <li><a href="/library">My Library</a></li>
          <li><a href="/upload">Upload PDF</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">{user?.email}</span>
        <button className="navbar-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
