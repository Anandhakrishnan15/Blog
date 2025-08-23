import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Api/auth";
import { AuthContext } from "../context/AuthContext"; // ✅ import context

const Login = () => {
    const navigate = useNavigate();
    const { setToken, setUser } = useContext(AuthContext); // ✅ use context

    const [formData, setFormData] = useState({
        email: "admin@gmail.com",
        password: "123456",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData); // backend API
            console.log("Login Success:", data);
            alert("Login successful! Welcome " + data.user.name);

            // ✅ Update context (this triggers your useEffect in AuthContext)
            setToken(data.token);
            setUser(data.user);

            // Redirect
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Login
                </button>

                {/* Signup link */}
                <p className="text-center text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
