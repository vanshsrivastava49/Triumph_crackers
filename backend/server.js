const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const usersFilePath = path.join(__dirname, "data", "users.json");
if (!fs.existsSync(usersFilePath) || fs.readFileSync(usersFilePath, "utf-8").trim() === "") {
  fs.writeFileSync(usersFilePath, JSON.stringify([]), "utf-8");
  console.log("✅ users.json file initialized with an empty array.");
}
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading users.json:", error);
    return [];
  }
};
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to users.json:", error);
  }
};
app.post("/api/signup", (req, res) => {
  const { fullName, email, password, userType } = req.body;
  if (!fullName || !email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" });
  }
  const newUser = {
    id: Date.now(),
    fullName,
    email,
    password,
    userType,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: "User registered successfully", user: newUser });
});
app.get("/api/users", (req, res) => {
  const users = readUsers();
  res.json(users);
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
