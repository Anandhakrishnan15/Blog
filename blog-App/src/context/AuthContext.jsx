// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";
import { getUserFromToken } from "../Api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Whenever token changes → fetch user
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const fetchedUser = await getUserFromToken(token);
                setUser(fetchedUser);
            } catch (err) {
                console.error("❌ Failed to fetch user:", err.message);
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]); // ✅ triggers on login/logout

    // Save user + token to localStorage
    useEffect(() => {
        if (user && token) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }, [user, token]);

    const logout = () => {
        setUser(null);
        setToken(null);
        setLoading(false);
    };

    const contextValue = useMemo(
        () => ({ user, token, loading, setUser, setToken, logout }),
        [user, token, loading]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
