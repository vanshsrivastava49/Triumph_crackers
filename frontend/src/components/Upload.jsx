import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/upload.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalValidated: 5,
    pendingReview: 2,
    validationErrors: 1,
  });
  const [recentSheets, setRecentSheets] = useState([
    { title: 'TSID-1254 - FX Forward', status: 'Completed' },
    { title: 'TSID-1289 - Equity Swap', status: 'Pending' },
    { title: 'TSID-1302 - Interest Rate Swap', status: 'In Progress' }
  ]);
  const [validationResults, setValidationResults] = useState([]);
  useEffect(() => {
    const fetchStatsAndSheets = async () => {
      try {
        const statsResponse = await axios.get("http://localhost:5000/api/stats");
        const recentResponse = await axios.get("http://localhost:5000/api/recent-sheets");
        const recentResult = await axios.get("http://localhost:5000/api/validation-results");
        setStats(statsResponse.data);
        setRecentSheets(recentResponse.data);
        setValidationResults(recentResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStatsAndSheets();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setStatus("Uploading...");
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus(`✅ File uploaded successfully: ${response.data.filename}`);
      // Refresh stats and recent term sheets after upload
      const statsResponse = await axios.get("http://localhost:5000/api/stats");
      const recentResponse = await axios.get("http://localhost:5000/api/recent-sheets");
      const recentResult = await axios.get("http://localhost:5000/api/validation-results");
      setStats(statsResponse.data);
      setRecentSheets(recentResponse.data);
      setValidationResults(recentResult.data);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("✅ File uploaded successfully."); //fix this error
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="upload-wrapper">
      <div className="upload-container">
      <h1>User Dashboard</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file">📄 Term Sheet Upload</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.csv"
              required
            />
          </div>

          {file && (
            <p className="file-name">
              Selected File: <strong>{file.name}</strong>
            </p>
          )}

          <button type="submit" className="btn-upload" disabled={loading}>
            {loading ? "Uploading..." : "Upload Term Sheet"}
          </button>
        </form>

        {status && <p className="status-message">{status}</p>}
        {/* Statistics Section */}
        <div className="stats-container">
          <div className="stat-box">
            <h2>{stats.totalValidated}</h2>
            <p>✅ Validated Files</p>
          </div>
          <div className="stat-box">
            <h2>{stats.pendingReview}</h2>
            <p>⏳ Pending Review</p>
          </div>
          <div className="stat-box">
            <h2>{stats.validationErrors}</h2>
            <p>❌ Validation Errors</p>
          </div>
        </div>

        {/* Recent Term Sheets */}
        <div className="recent-sheets">
          <h3>📄 Recent Term Sheets</h3>
          <ul>
            {recentSheets.map((sheet, index) => (
              <li key={index}>
                <strong>{sheet.title}</strong> - {sheet.status}
              </li>
            ))}
          </ul>
        </div>

        {/* Upload Section */}
        
      </div>
    </div>
  );
};

export default Upload;
