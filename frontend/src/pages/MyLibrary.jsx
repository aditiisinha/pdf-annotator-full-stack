import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/mylibrary.css";

export default function MyLibrary() {
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState("");

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pdf", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load PDFs");
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/pdf/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPdfs(); // refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="library-container">
      <h2 className="library-title">My Library</h2>

      {error && <div className="library-error">{error}</div>}

      {pdfs.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", fontStyle: "italic" }}>
          No PDFs uploaded yet
        </p>
      ) : (
        <ul className="library-list">
          {pdfs.map((pdf) => (
            <li key={pdf.uuid} className="library-item">
              <span>{pdf.filename}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="library-meta">
                  {new Date(pdf.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => navigate(`/view/${pdf.uuid}`)}
                  className="library-button library-button-view"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(pdf.uuid)}
                  className="library-button library-button-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
