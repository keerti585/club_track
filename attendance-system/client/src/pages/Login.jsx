import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutGrid, Lock, Key, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AuthInput from '../components/ui/AuthInput';
import AuthButton from '../components/ui/AuthButton';

const Login = () => {
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [accessCode, setAccessCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(accessCode.toUpperCase(), password);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        const role = result.user?.role;
        if (role === 'ADMIN' || role === 'VOLUNTEER') {
            navigate('/admin');
        } else {
            navigate('/member');
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] opacity-20" />

            <nav
                className="fixed left-0 top-0 z-20 w-full border-b backdrop-blur"
                style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-navbar)'
                }}
            >
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl border text-[#3B82F6]"
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--border-color)'
                            }}
                        >
                            <LayoutGrid size={18} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">SmartAttend</p>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em]">Developer&apos;s Club</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full p-2 hover:bg-white/5">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <Link
                            to="/register"
                            style={{ color: 'var(--text-secondary)' }}
                            className="text-sm font-medium transition hover:opacity-70"
                        >
                            New here? Register →
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: 'var(--bg-card-alpha)'
                    }}
                    className="w-full max-w-md rounded-3xl border p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div
                        className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border text-[#3B82F6] shadow-[0_0_18px_rgba(59,130,246,0.25)]"
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)'
                        }}
                    >
                        <LayoutGrid size={20} />
                    </div>
                    <div className="mt-4 text-center">
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.35em]">SmartAttend</p>
                        <h1 style={{ color: 'var(--text-primary)' }} className="mt-2 text-2xl font-semibold">Smart Attendance System</h1>
                    </div>

                    <div className="mt-8 text-center">
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-semibold">Sign In</h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="mt-2 text-sm">Enter your access code and password to continue</p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <AuthInput
                            id="access-code"
                            label="Access Code"
                            type="text"
                            value={accessCode}
                            onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                            placeholder="Enter your 6-digit code e.g. K7X2MN"
                            icon={<Key size={18} />}
                            hasError={Boolean(error)}
                            style={{ textTransform: 'uppercase' }}
                        />

                        <AuthInput
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            icon={<Lock size={18} />}
                            hasError={Boolean(error)}
                            rightSlot={(
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="text-[#9CA3AF] transition hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        />

                        <AuthButton disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
                        </AuthButton>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
