import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";

export const Home = () => {
    const { user } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [sort, setSort] = useState("Newest");
    const [blogs, setBlogs] = useState([]); // fetched blogs
    const [loading, setLoading] = useState(true);
    // console.log(blogs);
    

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/blogs");
                const data = await res.json();
                if (res.ok) {
                    setBlogs(data);
                } else {
                    console.error("Failed to fetch blogs:", data.message);
                }
            } catch (err) {
                console.error("Error fetching blogs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Filter + search + sort
    const filteredBlogs = blogs
        .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
        .filter((b) => (filter === "All" ? true : b.category === filter))
        .sort((a, b) => {
            if (sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sort === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sort === "Most Liked") return (b.likes || 0) - (a.likes || 0);
            return 0;
        });

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome to MyBlog
                </h1>
                {user && (
                    <p className="text-xl mb-2">Hello, {user.name} 👋</p>
                )}
                <p className="text-lg md:text-xl">
                    Discover articles, tutorials, and insights from top writers.
                </p>
            </section>

            {/* Blog List Section */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Latest Blogs</h2>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>All</option>
                        <option>Technology</option>
                        <option>Design</option>
                        <option>AI</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Newest</option>
                        <option>Oldest</option>
                        <option>Most Liked</option>
                    </select>
                </div>

                {/* Blog Cards */}
                {loading ? (
                    <p className="text-center text-gray-600">Loading blogs...</p>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <div
                                    key={blog._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                                >
                                    <img
                                        src={blog.image || "https://via.placeholder.com/400x200"}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />

                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            <Link
                                                to={`/blogs/${blog._id}`}
                                                className="hover:text-blue-600"
                                            >
                                                {blog.title}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {blog.subtitle}
                                        </p>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>
                                                By {blog.author} •{" "}
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                            <button className="flex items-center gap-1 text-red-500 hover:text-red-600">
                                                <Eye size={18} /> {Math.floor((blog.views?.length || 0) / 2)}

                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 col-span-3">
                                No blogs found.
                            </p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};
