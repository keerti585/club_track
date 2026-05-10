import React, { createContext, useContext, useState } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser);
        } catch (error) {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const login = async (accessCode, password) => {
        setLoading(true);
        try {
            const response = await api.post('/api/auth/login', { accessCode, password });
            const { token: newToken, user: newUser } = response.data;
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
            return { success: true, user: newUser };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        setLoading(true);
        try {
            const response = await api.post('/api/auth/register', { name, email, password, role });
            return { success: true, accessCode: response.data.accessCode };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
