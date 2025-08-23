const Blog = require("../models/Blog");
const User = require("../models/User");

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    try {
        const { title, subtitle, author, date, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const blog = new Blog({
            title,
            subtitle,
            author,
            date: date || new Date(),
            content,
            user: req.user.id,
        });

        await blog.save();

        await User.findByIdAndUpdate(req.user.id, {
            $push: { blogs: blog._id },
        });

        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all blogs (homepage)
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("user", "username email")
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get logged-in user blogs
// @route   GET /api/blogs/me
// @access  Private
const getMyBlogs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("blogs");
        res.json(user.blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate("user", "username email");

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(blog);
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid blog ID" });
        }
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!blog) return res.status(404).json({ message: "Blog not found" });

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { blogs: blog._id },
        });

        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid blog ID" });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    deleteBlog,
};
