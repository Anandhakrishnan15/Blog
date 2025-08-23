// api.js
import axios from "axios";
const BASE_URL = "http://localhost:5000/api/auth";

/**
 * Signup a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} - user object + token
 */
export const signupUser = async (userData) => {
    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Signup failed");
        return data; // { token, user }
    } catch (error) {
        console.error("Signup Error:", error.message);
        throw error;
    }
};

/**
 * Login an existing user
 * @param {Object} loginData - { email, password }
 * @returns {Promise<Object>} - user object + token
 */
export const loginUser = async (loginData) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        return data; // { token, user }
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

export const getUserFromToken = async (token) => {
    const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user; // return the user object
};
