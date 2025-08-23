// src/components/Myblogs.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx"; // to get user token

const Myblogs = () => {
    const { user, token } = useContext(AuthContext); // get logged-in user + token
    const [myBlogs, setMyBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's blogs from API
    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/blogs/me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setMyBlogs(data);
            } catch (err) {
                console.error("Error fetching blogs:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchMyBlogs();
    }, [token]);

    // Delete blog handler
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                await fetch(`http://localhost:5000/api/blogs/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMyBlogs(myBlogs.filter((blog) => blog._id !== id));
            } catch (err) {
                console.error("Error deleting blog:", err);
            }
        }
    };

    if (loading) return <p className="text-center mt-8">Loading blogs...</p>;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">My Blogs</h2>

                {myBlogs.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myBlogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                {blog.image && (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        {new Date(blog.date).toDateString()}
                                    </p>

                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/blogs/${blog._id}`}
                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <Eye size={16} /> view
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                        <><p className="text-gray-600 text-lg">You haven’t written any blogs yet.</p>
                        <br/>
                            <Link
                                to="/write"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                + Write New
                            </Link>

</>
                    

                )}
            </div>
        </div>
    );
};

export default Myblogs;
