import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page } from "react-pdf";
import axios from "axios";
import "../styles/pdfviewer.css";

export default function PdfViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [highlights, setHighlights] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch PDF data and highlights when component loads
  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch PDF metadata
        const pdfRes = await axios.get(`http://localhost:5000/api/pdf/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setPdfData(pdfRes.data);
        
        // Fetch highlights
        const highlightsRes = await axios.get(`http://localhost:5000/api/highlights/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHighlights(highlightsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load PDF data", err);
        setError("Failed to load PDF");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPdfData();
    }
  }, [id]);

  const handleTextSelection = async (currentPageNumber) => {
    const selection = window.getSelection();
    if (!selection.toString()) return;

    const text = selection.toString();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const boundingBox = {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/highlights/${id}`,
        { pageNumber: currentPageNumber, text, boundingBox },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighlights((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to save highlight", err);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => prev + 0.2);
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  if (loading) {
    return (
      <div className="pdf-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading PDF...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-container">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
          {error}
          <br />
          <button 
            onClick={() => navigate('/upload')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ffa500',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  const fileUrl = `http://localhost:5000/uploads/${pdfData?.filepath?.split('\\').pop() || pdfData?.filepath?.split('/').pop()}`;

  return (
    <div className="pdf-container">
      <div className="pdf-header">
        <h2>{pdfData?.filename || 'PDF Viewer'}</h2>
        <button 
          onClick={() => navigate('/upload')}
          className="back-button"
        >
          ← Back to Upload
        </button>
      </div>
      
      {/* Controls */}
      <div className="pdf-controls">
        <button 
          onClick={goToPreviousPage} 
          disabled={pageNumber <= 1}
          className="control-button"
        >
          ⬅ Prev
        </button>
        <span className="page-info">
          Page {pageNumber} of {numPages}
        </span>
        <button 
          onClick={goToNextPage} 
          disabled={pageNumber >= numPages}
          className="control-button"
        >
          Next ➡
        </button>
        <button onClick={zoomIn} className="control-button">
          Zoom In ➕
        </button>
        <button onClick={zoomOut} className="control-button">
          Zoom Out ➖
        </button>
      </div>

      {/* PDF Display */}
      <div className="pdf-viewer">
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading PDF..."
        >
          <div 
            className="pdf-page"
            onMouseUp={() => handleTextSelection(pageNumber)}
          >
            <Page pageNumber={pageNumber} scale={scale} />
            
            {/* Render highlights for current page */}
            {highlights
              .filter((h) => h.pageNumber === pageNumber)
              .map((h, i) => (
                <div
                  key={i}
                  className="highlight"
                  style={{
                    top: h.boundingBox.y,
                    left: h.boundingBox.x,
                    width: h.boundingBox.width,
                    height: h.boundingBox.height,
                  }}
                  title={h.text}
                />
              ))}
          </div>
        </Document>
      </div>
    </div>
  );
}
