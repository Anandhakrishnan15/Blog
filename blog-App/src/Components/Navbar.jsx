// src/components/Navbar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Common styles for NavLinks
  const baseLink =
    "cursor-pointer transition px-2 py-1 rounded-md";
  const activeLink = "bg-white text-blue-600 font-semibold";

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
      {/* Logo */}
      <NavLink
        to="/"
        className="text-2xl font-bold cursor-pointer hover:text-gray-200"
      >
        MyBlog
      </NavLink>

      {/* Nav Links */}
      <ul className="hidden md:flex gap-6 text-lg">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : "hover:text-gray-200"}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : "hover:text-gray-200"}`
            }
          >
            Blogs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/write"
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : "hover:text-gray-200"}`
            }
          >
            Write
          </NavLink>
        </li>
      </ul>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        {!user ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 ${isActive ? "ring-2 ring-yellow-400" : ""
                }`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                `px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 ${isActive ? "ring-2 ring-white" : ""
                }`
              }
            >
              Sign Up
            </NavLink>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
