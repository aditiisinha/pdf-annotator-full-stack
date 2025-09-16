import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function UploadPDF() {
  const [file, setFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pdfs", {
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/pdfs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setFile(null);
      fetchPdfs(); // refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="dashboard-card">
        <h2 className="dashboard-title">Upload PDF</h2>
        
        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            backgroundColor: '#ffe0e0', 
            padding: '10px', 
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleUpload} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setError("");
              }}
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#fffaf2',
                color: '#333'
              }}
            />
            {file && (
              <p style={{ 
                marginTop: '0.5rem', 
                color: '#ffa500',
                fontSize: '0.9rem' 
              }}>
                Selected: {file.name}
              </p>
            )}
          </div>
          
          <button 
            className="dashboard-button" 
            type="submit" 
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>

        <h3 className="dashboard-title" style={{ marginBottom: '1rem' }}>My PDFs</h3>
        
        {pdfs.length === 0 ? (
          <p style={{ 
            color: '#ddd', 
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            No PDFs uploaded yet
          </p>
        ) : (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {pdfs.map((pdf) => (
              <li 
                key={pdf.uuid} 
                style={{
                  padding: '10px',
                  margin: '0.5rem 0',
                  backgroundColor: '#fffaf2',
                  borderRadius: '6px',
                  color: '#333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{pdf.filename}</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#888' 
                }}>
                  {new Date(pdf.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}
