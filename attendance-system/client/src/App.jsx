import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import CreateSessionPage from './pages/CreateSessionPage';
import ScanPage from './pages/ScanPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Member route restored */}
            <Route
                path="/member"
                element={
                    <ProtectedRoute allowedRoles={['MEMBER']}>
                        <MemberDashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'VOLUNTEER']}>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/create-session"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'VOLUNTEER']}>
                        <CreateSessionPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/scan" element={<ScanPage />} />
        </Routes>
    );
};

export default App;
