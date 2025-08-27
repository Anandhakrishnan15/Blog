import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// 👉 helper to render Draft.js blocks
const renderBlocks = (blocks) => {
  return blocks.map((block, idx) => {
    switch (block.type) {
      case "header-one":
        return (
          <h1 key={idx} className="text-3xl font-bold my-4">
            {block.text}
          </h1>
        );
      case "header-two":
        return (
          <h2 key={idx} className="text-2xl font-semibold my-3">
            {block.text}
          </h2>
        );
      case "unordered-list-item":
        return (
          <ul key={idx} className="list-disc list-inside my-2">
            <li>{block.text}</li>
          </ul>
        );
      case "ordered-list-item":
        return (
          <ol key={idx} className="list-decimal list-inside my-2">
            <li>{block.text}</li>
          </ol>
        );
      default:
        return (
          <p key={idx} className="my-2">
            {block.text}
          </p>
        );
    }
  });
};

const BlogDetails = () => {
  const { id } = useParams(); // comes from /blogs/:id
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-8">Loading blog...</p>;
  }

  if (!blog) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
        <Link to="/" className="text-blue-600 underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
     

      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 mb-4">
        By {blog.author} • {new Date(blog.date).toDateString()}
      </p>

      {/* Blog Image (if exists) */}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}


      <div className="text-lg leading-relaxed text-gray-700 prose max-w-none">
        {typeof blog.content === "string"
          ? blog.content
          : blog.content?.blocks
            ? renderBlocks(blog.content.blocks)
            : null}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-blue-600 underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;
