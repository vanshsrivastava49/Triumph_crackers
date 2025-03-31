import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="app-container">
      <h1>Welcome to TermSheet Validator</h1>
      <p>Empowering Your Decisions with AI-Driven Term Sheet Validation.</p>
      <Link to="/signup">
        <button className="btn">Get Started</button>
      </Link>
    </div>
  );
};

export default App;
