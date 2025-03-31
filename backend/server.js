const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uploadsDir = path.join(__dirname, "uploads");
const resultsFilePath = path.join(__dirname, "data", "validationResults.json");
const usersFilePath = path.join(__dirname, "data", "users.json");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(resultsFilePath)) fs.writeFileSync(resultsFilePath, JSON.stringify([]), "utf-8");
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]), "utf-8");
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});
const upload = multer({ storage });
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
  }
};

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const fileId = Date.now();
  const fileName = req.file.filename;

  const validationResult = {
    id: fileId,
    fileName,
    status: "Validated",
    issues: [
      { line: 5, error: "Missing clause in section 3" },
      { line: 12, error: "Invalid date format" }
    ],
    uploadedAt: new Date().toISOString()
  };

  const results = readJSONFile(resultsFilePath);
  results.push(validationResult);
  writeJSONFile(resultsFilePath, results);

  res.status(201).json({
    message: "File uploaded and validated successfully",
    fileId,
    validationResult
  });
});

app.get("/api/validation", (req, res) => {
  const results = readJSONFile(resultsFilePath);
  res.json(results);
});

app.get("/api/validation/:id", (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const results = readJSONFile(resultsFilePath);

  const result = results.find(r => r.id === fileId);

  if (!result) {
    return res.status(404).json({ message: "Validation result not found." });
  }

  res.json(result);
});

app.post("/api/signup", (req, res) => {
  const { fullName, email, password, userType } = req.body;

  if (!fullName || !email || !password || !userType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const users = readJSONFile(usersFilePath);
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
  writeJSONFile(usersFilePath, users);

  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// ✅ Route to Fetch All Users
app.get("/api/users", (req, res) => {
  const users = readJSONFile(usersFilePath);
  res.json(users);
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
