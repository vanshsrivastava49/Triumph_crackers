import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin.css"; // Admin CSS

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSheets: 15,
    pending: 8,
    errors: 5,
    successful: 27,
  });

  const [recentSheets, setRecentSheets] = useState([
    { id: "TSID-1001", title: "FX Forward - USD/EUR", user: "Ratna Durgesh Tiwari", status: "Validated", date: "2025-03-25" },
    { id: "TSID-1002", title: "Interest Rate Swap", user: "Vansh Srivastava", status: "Pending", date: "2025-03-26" }
  ]);
  const [users, setUsers] = useState([
    { name: "Ratna Durgesh Tiwari", email: "ratna@gmail.com", role: "Applicant", dateJoined: "2025-01-12", active: true },
    { name: "Vansh Srivastava", email: "vansh49@gmail.com", role: "Admin", dateJoined: "2024-12-05", active: true }
  ]);
  const [search, setSearch] = useState("");

  // Fetch statistics, recent sheets, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await axios.get("http://localhost:5000/api/stats");
        const recentResponse = await axios.get("http://localhost:5000/api/recent-sheets");
        const usersResponse = await axios.get("http://localhost:5000/api/users");

        setStats(statsResponse.data);
        setRecentSheets(recentResponse.data);
        setUsers(usersResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter function for term sheets
  const filteredSheets = recentSheets.filter(sheet =>
    sheet.title.toLowerCase().includes(search.toLowerCase()) ||
    sheet.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h2>{stats.totalSheets}</h2>
          <p>Total Term Sheets</p>
        </div>
        <div className="stat-card pending">
          <h2>{stats.pending}</h2>
          <p>Pending Reviews</p>
        </div>
        <div className="stat-card errors">
          <h2>{stats.errors}</h2>
          <p>Validation Errors</p>
        </div>
        <div className="stat-card validated">
          <h2>{stats.successful}</h2>
          <p>Successful Validations</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by File ID, Status, or Applicant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Recent Term Sheets */}
      <div className="recent-sheets">
        <h3>📄 Recent Term Sheets</h3>
        <table>
          <thead>
            <tr>
              <th>TSID</th>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSheets.map((sheet, index) => (
              <tr key={index}>
                <td>{sheet.id}</td>
                <td>{sheet.title}</td>
                <td>{sheet.user}</td>
                <td>{sheet.status}</td>
                <td>{sheet.date}</td>
                <td>
                  <button className="btn-action">Download</button>
                  <button className="btn-action">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Management Section */}
      <div className="user-management">
        <h3>👥 User Management</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.dateJoined}</td>
                <td>{user.active ? "Active" : "Inactive"}</td>
                <td>
                  <button className="btn-action">Edit</button>
                  <button className="btn-action">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Section */}
      <br/>
      <div className="upload-section">
        <h3>📥 Upload New Term Sheet</h3>
        <input type="file" />
        <button className="btn-upload">Upload</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
