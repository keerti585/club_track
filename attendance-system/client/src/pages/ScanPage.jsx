import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, LogOut, QrCode } from 'lucide-react';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const getStoredUser = () => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (error) {
        return null;
    }
};

const ScanPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { theme } = useTheme();

    const storedUser = getStoredUser();
    const [sessionId, setSessionId] = useState('');
    const [token, setToken] = useState('');
    const [name, setName] = useState(() => storedUser?.name || localStorage.getItem('attendanceName') || '');
    const [email, setEmail] = useState(() => storedUser?.email || localStorage.getItem('attendanceEmail') || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState('');

    const scannerRef = useRef(null);
    const scannerId = 'qr-reader';

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlSessionId = params.get('sessionId');
        const urlToken = params.get('token');

        if (urlSessionId && urlToken) {
            setSessionId(urlSessionId);
            setToken(urlToken);
        }
    }, [location.search]);

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
                scannerRef.current.clear().catch(() => { });
            }
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleStartScan = async () => {
        setScanError('');
        setMessage('');
        setError('');
        setIsScanning(true);

        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        try {
            await html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                decodedText => {
                    setIsScanning(false);
                    html5QrCode.stop().catch(() => { });
                    html5QrCode.clear().catch(() => { });

                    try {
                        const url = new URL(decodedText);
                        const params = new URLSearchParams(url.search);
                        const scannedSessionId = params.get('sessionId');
                        const scannedToken = params.get('token');

                        if (!scannedSessionId || !scannedToken) {
                            setScanError('Invalid QR code. Please try again.');
                            return;
                        }

                        setSessionId(scannedSessionId);
                        setToken(scannedToken);
                    } catch (parseError) {
                        setScanError('Invalid QR code. Please try again.');
                    }
                },
                () => { }
            );
        } catch (scanStartError) {
            setScanError('Unable to access camera. Please check permissions.');
            setIsScanning(false);
        }
    };

    const handleStopScan = async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
        } catch (stopError) {
            // Ignore camera stop errors
        } finally {
            setIsScanning(false);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!sessionId || !token) {
            setError('Scan a valid QR code to continue.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/api/attendance/scan', {
                sessionId,
                token,
                name,
                email
            });
            const displayName = response.data.name || name;
            setMessage(`Attendance Marked! Welcome, ${displayName}.`);
            localStorage.setItem('attendanceName', name);
            localStorage.setItem('attendanceEmail', email);
        } catch (submitError) {
            const messageText = submitError.response?.data?.error || 'Failed to mark attendance';
            setError(messageText);
        } finally {
            setLoading(false);
        }
    };

    const hasDirectParams = Boolean(sessionId && token);

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen [font-family:'DM Sans',sans-serif]">
            <div className="min-h-screen px-4 py-10" style={{ backgroundImage: theme === 'light' ? 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)' : 'radial-gradient(#2A2A2A 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
                <div className="mx-auto max-w-xl text-center">
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.35em] [font-family:'Space Mono',monospace]">Developer&apos;s Club Attendance</p>
                    <h1 style={{ color: 'var(--text-primary)' }} className="mt-3 text-3xl font-semibold [font-family:'Space Mono',monospace]">Mark Your Attendance</h1>
                </div>

                <div style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }} className="mx-auto mt-10 w-full max-w-sm rounded-2xl border p-6 shadow-[inset_0_0_0_1px]">
                    {!hasDirectParams && !message && (
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#111111]">
                                <QrCode className="h-8 w-8 text-[#3B82F6]" />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold [font-family:'Space Mono',monospace]">Scan QR Code</h2>
                            <p className="mt-2 text-sm text-[#9CA3AF]">
                                Point your camera at the QR code displayed at the session.
                            </p>
                            {scanError && (
                                <p className="mt-3 text-sm text-red-200">{scanError}</p>
                            )}
                            <div id={scannerId} className="mt-4" />
                            <button
                                onClick={isScanning ? handleStopScan : handleStartScan}
                                className="mt-5 w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#F9FAFB] transition hover:bg-[#2563EB]"
                            >
                                {isScanning ? 'Stop Scanner' : 'Open Camera Scanner'}
                            </button>
                        </div>
                    )}

                    {(hasDirectParams || message) && (
                        <div className="text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
                                <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold [font-family:'Space Mono',monospace]">You&apos;re In!</h2>
                            <p className="mt-2 text-sm text-[#9CA3AF]">Complete your attendance below.</p>
                        </div>
                    )}

                    {message ? (
                        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-center text-sm text-emerald-200">
                            <p className="text-lg font-semibold">✅ Attendance Marked!</p>
                            <p className="mt-2 text-sm">{message}</p>
                        </div>
                    ) : hasDirectParams ? (
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            {error && (
                                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF] [font-family:'Space Mono',monospace]">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                    className="mt-2 w-full rounded-lg border border-[#2A2A2A] bg-[#111111] px-4 py-2 text-sm text-[#F9FAFB] placeholder:text-[#6B7280] focus:outline-none focus:shadow-[0_0_0_2px_#3B82F6] transition"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF] [font-family:'Space Mono',monospace]">Email</label>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                    className="mt-2 w-full rounded-lg border border-[#2A2A2A] bg-[#111111] px-4 py-2 text-sm text-[#F9FAFB] placeholder:text-[#6B7280] focus:outline-none focus:shadow-[0_0_0_2px_#3B82F6] transition"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-[#22C55E] px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition hover:brightness-110 disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? 'Marking...' : 'Mark Attendance →'}
                            </button>
                        </form>
                    ) : null}
                </div>

                <div className="mt-6 text-center text-sm text-[#9CA3AF]">
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#F9FAFB] transition"
                    >
                        <LogOut size={16} />
                        Wrong account? Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
