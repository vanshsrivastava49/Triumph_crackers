import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "applicant", // Default selection
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    //if (!formData.termsAccepted)
      //newErrors.termsAccepted = "You must accept the terms and conditions.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/signup", formData);
      console.log("Success:", response.data);

      // Redirect based on user type
      if (formData.userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/upload");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="heading-container">
        <h1>TermSheet Validation using AI</h1>
      </div>
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* <div className="form-group">
            <label>Organization (Optional):</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
            />
          </div> */}
          

          {/* User Type Selection */}
          <div className="form-group">
            <label>User Type:</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

        {/* <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              I accept the Terms & Conditions
            </label>
            {errors.termsAccepted && (
              <p className="error">{errors.termsAccepted}</p>
            )}
          </div>*/} 

          <button type="submit" className="btn">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
        <Link to="/upload">
          <button className="btn">User Dashboard</button>
        </Link>
        <Link to="/admin">
          <button className="btn">Admin Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
