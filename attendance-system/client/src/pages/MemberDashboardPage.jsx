import React, { useEffect, useState } from 'react';
import { CalendarDays, CheckSquare, LogOut, LayoutGrid, Sun, Moon, Clock, TrendingUp, Zap, ClipboardList, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import Avatar from '../components/ui/Avatar';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-full justify-start rounded-lg px-3 py-2 text-sm transition"
            style={{
                border: theme === 'light' ? '1px solid #D0DBFF' : '1px solid rgba(255,255,255,0.1)',
                backgroundColor: theme === 'light' ? '#F0F4FF' : 'rgba(255,255,255,0.05)',
                color: theme === 'light' ? '#1A2744' : '#9CA3AF'
            }}
        >
            {theme === 'dark' ? <Sun className="inline-block mr-2 h-4 w-4" /> : <Moon className="inline-block mr-2 h-4 w-4" />}
            Toggle theme
        </button>
    );
};

const MemberDashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [activeSession, setActiveSession] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [qrTimer, setQrTimer] = useState(600);
    const [userMarkedPresent, setUserMarkedPresent] = useState(false);

    const [stats, setStats] = useState({ attended: 0, totalSessions: 0, percentage: 0, streak: 0, sessionsAttended: [] });
    const [attendanceRows, setAttendanceRows] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const [activeRes, statsRes, attendanceRes, assignmentsRes] = await Promise.all([
                    api.get('/api/sessions/active/current'),
                    api.get('/api/attendance/member/my-stats'),
                    api.get('/api/attendance/member/my-attendance'),
                    api.get('/api/assignments/all')
                ]);

                const active = activeRes.data?.session;
                setActiveSession(active);
                setStats(statsRes.data || { attended: 0, totalSessions: 0, percentage: 0, streak: 0, sessionsAttended: [] });
                setAttendanceRows(attendanceRes.data.attendance || []);
                setAssignments(assignmentsRes.data.assignments || []);

                if (active) {
                    try {
                        const qrRes = await api.get(`/api/sessions/${active._id}/qr`);
                        setQrCode(qrRes.data.qrCode);
                        setQrTimer(Math.floor((qrRes.data.expiresAt - Date.now()) / 1000));

                        const attendanceCheckRes = await api.get(`/api/attendance/session/${active._id}`);
                        const userAttended = attendanceCheckRes.data.attendance?.some(a => a.userId === user._id);
                        setUserMarkedPresent(!!userAttended);
                    } catch (err) {
                        console.error('Error fetching QR:', err);
                    }
                }
            } catch (err) {
                const message = err.response?.data?.error || 'Failed to load dashboard data';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        if (!activeSession || !qrCode) return;

        const interval = setInterval(() => {
            setQrTimer(prev => {
                if (prev <= 1) {
                    setQrCode(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession, qrCode]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getAssignmentsBySession = () => {
        const grouped = {};
        assignments.forEach(assignment => {
            const sessionId = assignment.sessionId?._id;
            if (!grouped[sessionId]) {
                grouped[sessionId] = { session: assignment.sessionId, assignments: [] };
            }
            grouped[sessionId].assignments.push(assignment);
        });
        return Object.values(grouped);
    };

    const isAssignmentOverdue = (dueDate) => {
        return dueDate && new Date(dueDate) < new Date();
    };

    const formatDueDate = (dueDate) => {
        if (!dueDate) return null;
        const due = new Date(dueDate);
        const today = new Date();
        const isOverdue = isAssignmentOverdue(dueDate);

        if (isOverdue) {
            return { text: `Overdue · ${due.toLocaleDateString()}`, color: 'red' };
        } else {
            return { text: `Due: ${due.toLocaleDateString()}`, color: 'amber' };
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#080C14]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen [font-family:'Inter',sans-serif]">
            <div className="flex min-h-screen">
                <aside
                    style={{
                        backgroundColor: '#1A2744',
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: '#FFFFFF'
                    }}
                    className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r md:flex"
                >
                    <div className="px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6]">
                                <LayoutGrid size={18} />
                            </div>
                            <div>
                                <p style={{ color: theme === 'light' ? '#FFFFFF' : 'var(--text-primary)' }} className="text-sm font-semibold">SmartAttend</p>
                                <p style={{ color: theme === 'light' ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.3em]">DEVELOPER'S CLUB</p>
                            </div>
                        </div>
                    </div>
                    <div className="mx-6 border-t" style={{ borderColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--border-color)' }} />

                    <nav className="mt-6 flex-1 space-y-1 px-3 text-sm">
                        <button
                            style={{
                                borderLeftColor: '#3B82F6',
                                backgroundColor: '#3B82F6/10',
                                color: theme === 'light' ? '#FFFFFF' : '#FFFFFF'
                            }}
                            className="flex w-full items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-left transition"
                        >
                            <CheckSquare className="h-4 w-4 text-[#3B82F6]" />
                            My Dashboard
                        </button>
                    </nav>

                    <div
                        className="mt-auto space-y-4 border-t px-6 py-5"
                        style={{ borderColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--border-color)' }}
                    >
                        <ThemeToggle />

                        <div className="flex items-center gap-3">
                            <Avatar name={user?.name} size="md" />
                            <div>
                                <p style={{ color: theme === 'light' ? '#FFFFFF' : 'var(--text-primary)' }} className="text-sm font-semibold">{user?.name || 'Member'}</p>
                                <span
                                    className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                                    style={{
                                        borderColor: theme === 'light' ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                        backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                                        color: theme === 'light' ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)'
                                    }}
                                >
                                    MEMBER
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition"
                            style={{
                                borderColor: theme === 'light' ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                                color: theme === 'light' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'
                            }}
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-6 py-8 md:pl-[18rem] md:pr-12">
                    <header className="mb-8">
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-[0.3em]">Member Dashboard</p>
                        <h1 style={{ color: 'var(--text-primary)' }} className="mt-1 text-3xl font-semibold">Welcome, {user?.name || 'Member'}</h1>
                        <p style={{ color: 'var(--text-secondary)' }} className="mt-2">Track your attendance and sessions.</p>
                    </header>

                    {error && (
                        <div className="mb-8 rounded-xl border p-4 text-sm" style={{ borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--text-primary)' }}>
                            {error}
                        </div>
                    )}

                    {/* SECTION 1: Active Session Banner */}
                    {activeSession ? (
                        <div style={{ borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }} className="mb-8 flex gap-6 rounded-2xl border-l-4 border-l-emerald-500 p-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 mb-3 border border-emerald-500/30">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    LIVE
                                </div>
                                <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mt-2">{activeSession.title}</h2>
                                <div className="mt-3 flex gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays size={16} />
                                        {new Date(activeSession.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <LayoutGrid size={16} />
                                        {activeSession.venue}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-3">
                                {userMarkedPresent ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                            <CheckCircle size={32} className="text-emerald-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-emerald-300">You're marked present!</p>
                                    </div>
                                ) : qrCode ? (
                                    <div>
                                        <img src={qrCode} alt="QR Code" className="h-40 w-40 rounded-lg border" style={{ borderColor: 'var(--border-color)' }} />
                                        <p style={{ color: 'var(--text-secondary)' }} className="mt-2 text-center text-xs">Scan to mark attendance</p>
                                        <p style={{ color: 'var(--text-secondary)' }} className="text-center text-xs mt-1">Refreshes in {qrTimer}s</p>
                                    </div>
                                ) : (
                                    <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs text-center">QR Code Expired</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(100, 100, 100, 0.1)' }} className="mb-8 rounded-2xl border p-6 text-center">
                            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                                No active session right now. Check back when your admin starts a session.
                            </p>
                        </div>
                    )}

                    {/* SECTION 2: Stats Row */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                        <StatCard
                            icon={CheckSquare}
                            label="Sessions Attended"
                            value={stats.attended}
                            color="blue"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Attendance %"
                            value={`${stats.percentage}%`}
                            color="green"
                        />
                        <StatCard
                            icon={Zap}
                            label="Current Streak"
                            value={stats.streak}
                            color="amber"
                        />
                    </div>

                    {/* SECTION 3: My Attendance History */}
                    <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="mb-10 overflow-hidden rounded-2xl border shadow-xl">
                        <div style={{ borderBottomColor: 'var(--border-color)' }} className="border-b px-6 py-4">
                            <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold">My Attendance History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Session</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Venue</th>
                                        <th className="px-6 py-4 font-medium">Method</th>
                                        <th className="px-6 py-4 font-medium text-right">Marked At</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderColor: 'var(--border-color)' }} className="divide-y">
                                    {attendanceRows.length > 0 ? (
                                        attendanceRows.map((row) => (
                                            <tr key={row._id} className="transition hover:bg-white/5">
                                                <td style={{ color: 'var(--text-primary)' }} className="whitespace-nowrap px-6 py-4 font-medium">{row.title}</td>
                                                <td style={{ color: 'var(--text-secondary)' }} className="whitespace-nowrap px-6 py-4">
                                                    {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)' }} className="whitespace-nowrap px-6 py-4">{row.venue}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Badge
                                                        label={row.method}
                                                        color={row.method === 'QR' ? 'blue' : 'amber'}
                                                    />
                                                </td>
                                                <td style={{ color: 'var(--text-secondary)' }} className="whitespace-nowrap px-6 py-4 text-right">
                                                    {new Date(row.markedAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td style={{ color: 'var(--text-secondary)' }} colSpan="5" className="px-6 py-10 text-center">
                                                You haven't attended any sessions yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SECTION 4: Assignments */}
                    <div>
                        <div className="mb-6 flex items-center gap-2">
                            <ClipboardList size={20} style={{ color: 'var(--text-primary)' }} />
                            <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold">My Assignments</h2>
                        </div>

                        {assignments.length > 0 ? (
                            <div className="space-y-4">
                                {getAssignmentsBySession().map((group) => (
                                    <div key={group.session?._id}>
                                        <h3 style={{ color: 'var(--text-secondary)' }} className="mb-3 text-sm font-semibold uppercase tracking-wider">
                                            {group.session?.title || 'Unknown Session'}
                                        </h3>
                                        <div className="space-y-3 ml-2">
                                            {group.assignments.map((assignment) => {
                                                const dueInfo = formatDueDate(assignment.dueDate);
                                                return (
                                                    <div
                                                        key={assignment._id}
                                                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                                                        className="rounded-xl border p-4"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 style={{ color: 'var(--text-primary)' }} className="font-semibold">
                                                                    {assignment.title}
                                                                </h4>
                                                                <p style={{ color: 'var(--text-secondary)' }} className="mt-1 text-sm">
                                                                    {assignment.description}
                                                                </p>
                                                                <div className="mt-3 flex items-center gap-3">
                                                                    {dueInfo && (
                                                                        <Badge
                                                                            label={dueInfo.text}
                                                                            color={dueInfo.color}
                                                                        />
                                                                    )}
                                                                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                                                                        Assigned by {assignment.createdBy?.name || 'Unknown'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} className="rounded-2xl border p-8 text-center">
                                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                                    No assignments have been given yet
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MemberDashboardPage;
