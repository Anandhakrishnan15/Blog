const express = require("express");
const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    deleteBlog,
    getBlogById
} = require("../controllers/blogController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBlog);
router.get("/", getAllBlogs);
router.get("/me", protect, getMyBlogs);  // put this BEFORE /:id
router.get("/:id", getBlogById);
router.delete("/:id", protect, deleteBlog);


module.exports = router;
