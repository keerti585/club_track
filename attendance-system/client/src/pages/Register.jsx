import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LayoutGrid, Lock, Mail, User, Sun, Moon, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthInput from '../components/ui/AuthInput';
import AuthButton from '../components/ui/AuthButton';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('ADMIN');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registeredAccessCode, setRegisteredAccessCode] = useState(null);
    const [copyLabel, setCopyLabel] = useState('Copy Code');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password, role);
        setLoading(false);

        if (!result.success) {
            setError(result.error);
            return;
        }

        setRegisteredAccessCode(result.accessCode);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(registeredAccessCode);
        setCopyLabel('Copied!');
        setTimeout(() => setCopyLabel('Copy Code'), 2000);
    };

    const { theme, toggleTheme } = useTheme();

    if (registeredAccessCode) {
        return (
            <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="relative min-h-screen overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),_transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] opacity-20" />

                <nav style={{ borderBottomColor: 'var(--border-color)', backgroundColor: 'var(--bg-navbar)' }} className="fixed left-0 top-0 z-20 w-full border-b backdrop-blur">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex h-10 w-10 items-center justify-center rounded-xl border text-accent-primary">
                                <LayoutGrid size={18} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">SmartAttend</p>
                                <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em]">Developer&apos;s Club</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full p-2 hover:bg-[var(--hover-bg)] text-[var(--text-primary)]">
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card-alpha)' }}
                        className="w-full max-w-md rounded-3xl border p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.3)]"
                        >
                            <Check size={32} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 text-center"
                        >
                            <h1 style={{ color: 'var(--text-primary)' }} className="text-3xl font-bold">Registration Successful!</h1>
                            <p style={{ color: 'var(--text-secondary)' }} className="mt-2 text-sm">Your account has been created. Below is your access code.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ borderColor: 'var(--accent-primary)', backgroundColor: 'var(--accent-primary-alpha)' }}
                            className="mt-8 rounded-2xl border-2 p-6 text-center"
                        >
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em] mb-3">Your Access Code</p>
                            <p className="font-mono text-4xl font-bold text-accent-primary tracking-[0.1em]">
                                {registeredAccessCode}
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }} className="mt-4 text-xs">
                                Save this code — you need it to login.
                            </p>
                            <p className="mt-2 text-xs text-red-400 font-medium">
                                ⚠️ This code will not be shown again!
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={handleCopyCode}
                            style={{
                                borderColor: 'var(--border-color)',
                                backgroundColor: 'var(--accent-primary-alpha)',
                                color: 'var(--accent-primary)'
                            }}
                            className="mt-6 w-full rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-blue-500/30"
                        >
                            {copyLabel}
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={() => navigate('/login')}
                            style={{
                                backgroundColor: 'var(--accent-primary)',
                                color: 'white'
                            }}
                            className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium transition hover:brightness-110 shadow-[var(--shadow-button)]"
                        >
                            Proceed to Login →
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] opacity-20" />

            <nav style={{ borderBottomColor: 'var(--border-color)', backgroundColor: 'rgba(var(--bg-primary), 0.9)' }} className="fixed left-0 top-0 z-20 w-full border-b backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="flex h-10 w-10 items-center justify-center rounded-xl border text-[#3B82F6]">
                            <LayoutGrid size={18} />
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">SmartAttend</p>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.2em]">Developer&apos;s Club</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full p-2 hover:bg-white/5 text-slate-300">
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#9CA3AF] transition hover:text-white"
                        >
                            Already have access? Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="relative flex min-h-screen items-center justify-center px-4 pb-12 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="w-full max-w-md rounded-3xl border p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border text-[#3B82F6] shadow-[0_0_18px_rgba(59,130,246,0.25)]">
                        <LayoutGrid size={20} />
                    </div>
                    <div className="mt-4 text-center">
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.35em]">SmartAttend</p>
                        <h1 style={{ color: 'var(--text-primary)' }} className="mt-2 text-2xl font-semibold">Smart Attendance System</h1>
                    </div>

                    <div className="mt-8 text-center">
                        <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-semibold">Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)' }} className="mt-2 text-sm">Register to manage your attendance.</p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <AuthInput
                            id="full-name"
                            label="Full Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Full name"
                            icon={<User size={18} />}
                            hasError={Boolean(error)}
                        />

                        <AuthInput
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            icon={<Mail size={18} />}
                            hasError={Boolean(error)}
                        />

                        <div className="space-y-2">
                            <label
                                htmlFor="role"
                                className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]"
                            >
                                Role
                            </label>
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#1F2937]/80 px-4 py-3 text-sm text-[#F9FAFB] backdrop-blur transition focus-within:ring-2 focus-within:ring-indigo-400/50 focus-within:shadow-[0_0_18px_rgba(59,130,246,0.35)]">
                                <span className="text-[#93C5FD]"><User size={18} /></span>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    className="flex-1 bg-transparent text-sm text-[#F9FAFB] focus:outline-none"
                                    required
                                >
                                    <option value="ADMIN" className="bg-[#111827]">
                                        Admin
                                    </option>
                                    <option value="MEMBER" className="bg-[#111827]">
                                        Member
                                    </option>
                                </select>
                            </div>
                        </div>

                        <AuthInput
                            id="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 6 characters"
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

                        <AuthInput
                            id="confirm-password"
                            label="Confirm Password"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Re-enter password"
                            icon={<Lock size={18} />}
                            hasError={Boolean(error)}
                            rightSlot={(
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(prev => !prev)}
                                    className="text-[#9CA3AF] transition hover:text-white"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        />

                        <AuthButton disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </AuthButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-[#9CA3AF]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#93C5FD] transition hover:text-white">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
