import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pdfupload.css";

export default function UploadPDF() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch PDFs from backend
  const fetchPdfs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/pdf", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
      return res.data;
    } catch (err) {
      console.error(err);
      setError("Failed to load PDFs");
      return [];
    }
  };

  useEffect(() => {
    setPdfs([]); // start empty (only latest uploads will show)
  }, []);

  // Upload PDF
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
      await axios.post("http://localhost:5000/api/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedList = await fetchPdfs();
      if (updatedList.length > 0) {
        setPdfs([updatedList[updatedList.length - 1]]);
      }

      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete PDF
  const handleDelete = async (uuid) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/pdf/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPdfs([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload PDF</h2>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setError("");
          }}
          className="file-input"
        />
        {file && <p className="file-selected">Selected: {file.name}</p>}

        <button className="button button-upload" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>

      <h3 className="upload-title">My PDFs</h3>

      {pdfs.length === 0 ? (
        <p className="no-pdfs">No PDFs uploaded yet</p>
      ) : (
        <ul className="pdf-list">
          {pdfs.map((pdf) => (
            <li key={pdf.uuid} className="pdf-item">
              <span>{pdf.filename}</span>
              <div className="pdf-actions">
                <span className="pdf-meta">
                  {new Date(pdf.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => navigate(`/view/${pdf.uuid}`)}
                  className="button button-view"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(pdf.uuid)}
                  className="button button-delete"
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
