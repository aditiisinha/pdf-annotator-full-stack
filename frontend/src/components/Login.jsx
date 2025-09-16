import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      alert(errorMessage);
    }
  };

  return (
    <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="form-title">Login</h2>
      <input className="form-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="form-input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="form-button">Login</button>
      <p className="form-footer">No account? <Link to="/register" className="form-link">Register</Link></p>
    </form>
    </div>
  );
}
