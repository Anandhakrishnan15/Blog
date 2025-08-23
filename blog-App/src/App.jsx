// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Blogs from "./pages/BlogDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Home } from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import Myblogs from "./pages/Myblogs";
import Write from "./pages/Write";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Myblogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/write" element={<Write />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
