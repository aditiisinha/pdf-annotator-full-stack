import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import PdfUpload from "./pages/PdfUpload";
import PdfViewer from "./pages/PdfViewer";
import MyLibrary from "./pages/MyLibrary";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  
  if (user === null) {
    // Show loading while checking authentication
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Layout><PdfUpload /></Layout></PrivateRoute>} />
        <Route path="/view/:id" element={<PrivateRoute><Layout><PdfViewer /></Layout></PrivateRoute>} />
        <Route path="/library" element={<PrivateRoute><Layout><MyLibrary /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
