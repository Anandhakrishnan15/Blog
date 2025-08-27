const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // ✅ CommonJS
const blogRoutes = require("./routes/blogRoutes.js");
const uploadRoutes = require("./routes/upload");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes); // ✅ authRoutes must be a router function
app.use("/api/blogs", blogRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
