import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    BarChart3,
    Bell,
    Calendar,
    CalendarDays,
    CheckSquare,
    ClipboardList,
    Download,
    LayoutDashboard,
    LayoutGrid,
    LogOut,
    MapPin,
    Moon,
    Percent,
    QrCode,
    RefreshCw,
    Settings,
    Sun,
    Trash2,
    UserCheck,
    UserX,
    Users,
    X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/ui/Avatar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';

const statusStyles = {
    DRAFT: 'border border-white/10 text-[#9CA3AF] bg-white/5',
    ACTIVE: 'border border-emerald-500/30 text-emerald-200 bg-emerald-500/15',
    CLOSED: 'border border-red-500/30 text-red-200 bg-red-500/15'
};

const typeAccent = {
    WORKSHOP: 'bg-blue-500',
    MEETING: 'bg-purple-500',
    HACKATHON: 'bg-amber-500',
    GENERAL: 'bg-gray-500'
};

const formatTimeAgo = (value) => {
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
};

const useCountUp = (value) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let frameId;
        const start = performance.now();
        const duration = 600;

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setDisplay(Math.round(progress * value));
            if (progress < 1) {
                frameId = requestAnimationFrame(step);
            }
        };

        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [value]);

    return display;
};

const AdminPage = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [sessionsError, setSessionsError] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState('');
    const [qrLoadingId, setQrLoadingId] = useState('');

    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [expandedSessionId, setExpandedSessionId] = useState('');
    const [attendanceTab, setAttendanceTab] = useState('live');
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState('');
    const [attendanceList, setAttendanceList] = useState([]);
    const [attendanceCount, setAttendanceCount] = useState(0);

    const [members, setMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [membersError, setMembersError] = useState('');
    const [sessionMembers, setSessionMembers] = useState([]);
    const [sessionMembersLoading, setSessionMembersLoading] = useState(false);
    const [sessionMembersError, setSessionMembersError] = useState('');
    const [sessionSummary, setSessionSummary] = useState({ presentCount: 0, totalCount: 0 });
    const [memberSearch, setMemberSearch] = useState('');
    const [bulkLoading, setBulkLoading] = useState(false);
    const [memberActionIds, setMemberActionIds] = useState({});

    const [qrPanelCode, setQrPanelCode] = useState('');
    const [qrPanelError, setQrPanelError] = useState('');
    const [qrPanelLoading, setQrPanelLoading] = useState(false);
    const [qrPanelSecondsLeft, setQrPanelSecondsLeft] = useState(600);
    const [qrPanelScanUrl, setQrPanelScanUrl] = useState('');
    const [qrPanelCopyLabel, setQrPanelCopyLabel] = useState('Copy Link');

    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrModalSession, setQrModalSession] = useState(null);
    const [qrModalCode, setQrModalCode] = useState('');
    const [qrModalError, setQrModalError] = useState('');
    const [qrModalSecondsLeft, setQrModalSecondsLeft] = useState(600);
    const [qrModalScanUrl, setQrModalScanUrl] = useState('');
    const [qrModalCopyLabel, setQrModalCopyLabel] = useState('Copy Link');
    const [qrModalCopySuccess, setQrModalCopySuccess] = useState(false);

    const [detailSession, setDetailSession] = useState(null);
    const [detailAttendance, setDetailAttendance] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState('');

    const [activeView, setActiveView] = useState('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState([]);
    const [quickMember, setQuickMember] = useState({ name: '', email: '' });
    const [quickMemberLoading, setQuickMemberLoading] = useState(false);
    const [memberFormOpen, setMemberFormOpen] = useState(false);
    const [memberForm, setMemberForm] = useState({ name: '', email: '' });
    const [memberFormLoading, setMemberFormLoading] = useState(false);
    const [qrManagerSessionId, setQrManagerSessionId] = useState('');
    const [reportOverall, setReportOverall] = useState({
        totalSessions: 0,
        totalMembers: 0,
        presentToday: 0,
        absentToday: 0,
        attendancePercent: '0.0',
        qrCount: 0,
        manualCount: 0
    });
    const [hasActiveSession, setHasActiveSession] = useState(false);
    const [reportOverallLoading, setReportOverallLoading] = useState(false);
    const [reportOverallError, setReportOverallError] = useState('');
    const [reportSessionId, setReportSessionId] = useState('');
    const [reportSession, setReportSession] = useState(null);
    const [reportSessionLoading, setReportSessionLoading] = useState(false);
    const [reportSessionError, setReportSessionError] = useState('');
    const [expandedAssignmentsSessionId, setExpandedAssignmentsSessionId] = useState('');
    const [assignments, setAssignments] = useState({});
    const [assignmentsLoading, setAssignmentsLoading] = useState({});
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentDueDate, setAssignmentDueDate] = useState('');
    const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const notificationRef = useRef(null);
    const settingsRef = useRef(null);
    const avatarRef = useRef(null);

    const selectedSession = useMemo(
        () => sessions.find(session => session._id === selectedSessionId),
        [sessions, selectedSessionId]
    );

    const activeSession = useMemo(
        () => sessions.find(session => session.status === 'ACTIVE'),
        [sessions]
    );

    const filteredSessionMembers = useMemo(() => {
        const search = memberSearch.trim().toLowerCase();
        if (!search) return sessionMembers;
        return sessionMembers.filter(member => (
            member.name.toLowerCase().includes(search) ||
            member.email.toLowerCase().includes(search)
        ));
    }, [memberSearch, sessionMembers]);

    const filteredSessionsView = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return sessions;
        return sessions.filter(session => (
            session.title.toLowerCase().includes(query) ||
            session.venue.toLowerCase().includes(query) ||
            session.type.toLowerCase().includes(query)
        ));
    }, [searchQuery, sessions]);

    const filteredMembersView = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return members;
        return members.filter(member => (
            member.name.toLowerCase().includes(query) ||
            member.email.toLowerCase().includes(query)
        ));
    }, [searchQuery, members]);

    const sessionPresentCount = useMemo(
        () => sessionSummary.presentCount || sessionMembers.filter(member => member.isPresent).length,
        [sessionSummary.presentCount, sessionMembers]
    );
    const sessionTotalCount = sessionSummary.totalCount || sessionMembers.length;

    const totalSessions = sessions.length;
    const thisWeekSessions = sessions.filter(session => (
        Date.now() - new Date(session.date).getTime() <= 7 * 24 * 60 * 60 * 1000
    )).length;
    const totalMembers = members.length;
    const today = new Date().toDateString();
    const todayAttendance = attendanceList.filter(record => new Date(record.markedAt).toDateString() === today).length;
    const absentToday = Math.max(totalMembers - todayAttendance, 0);
    const absentPercent = totalMembers ? Math.round((absentToday / totalMembers) * 100) : 0;
    const attendancePercent = totalMembers ? Math.round((todayAttendance / totalMembers) * 100) : 0;

    const totalSessionsValue = useCountUp(totalSessions);
    const presentTodayValue = useCountUp(todayAttendance);
    const absentTodayValue = useCountUp(absentToday);
    const attendancePercentValue = useCountUp(attendancePercent);

    const getSearchPlaceholder = () => {
        switch (activeView) {
            case 'Sessions':
                return 'Search sessions by title or venue...';
            case 'Members':
                return 'Search members by name or email...';
            case 'Reports':
                return 'Search sessions for report...';
            default:
                return 'Search is available on Sessions or Members';
        }
    };

    const isSearchDisabled = () => {
        return activeView === 'Dashboard' || activeView === 'QR Manager';
    };

    const filteredSessionOptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query || activeView !== 'Reports') return sessions;
        return sessions.filter(session =>
            session.title.toLowerCase().includes(query)
        );
    }, [searchQuery, sessions, activeView]);

    const pushToast = (type, message) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const handleDismissToast = id => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const fetchSessions = useCallback(async () => {
        setLoadingSessions(true);
        setSessionsError('');
        try {
            const response = await api.get('/api/sessions');
            setSessions(response.data);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load sessions';
            setSessionsError(message);
            pushToast('error', message);
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    const fetchAttendance = useCallback(async (sessionId) => {
        if (!sessionId) return;
        setAttendanceLoading(true);
        setAttendanceError('');
        try {
            const response = await api.get(`/api/attendance/session/${sessionId}`);
            const attendance = response.data.attendance || [];
            const count = response.data.count ?? attendance.length;
            setAttendanceList(attendance);
            setAttendanceCount(count);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load attendance';
            setAttendanceError(message);
            pushToast('error', message);
        } finally {
            setAttendanceLoading(false);
        }
    }, []);

    const fetchMembers = useCallback(async (sessionId) => {
        if (!sessionId) return;
        setSessionMembersLoading(true);
        setSessionMembersError('');
        try {
            const response = await api.get(`/api/users/session/${sessionId}`);
            setSessionMembers(response.data.members || []);
            setSessionSummary({
                presentCount: response.data.presentCount || 0,
                totalCount: response.data.totalCount || 0
            });
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load members';
            setSessionMembersError(message);
            pushToast('error', message);
        } finally {
            setSessionMembersLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setMembersLoading(true);
        setMembersError('');
        try {
            const response = await api.get('/api/users');
            console.log('Users response:', response.data);
            setMembers(response.data.users || []);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load members';
            setMembersError(message);
            pushToast('error', message);
        } finally {
            setMembersLoading(false);
        }
    }, []);

    const fetchQrPanel = useCallback(async (sessionId, showLoading = true) => {
        if (!sessionId) return;
        if (showLoading) setQrPanelLoading(true);
        setQrPanelError('');
        try {
            const response = await api.get(`/api/sessions/${sessionId}/qr`);
            setQrPanelCode(response.data.qrCode);
            setQrPanelScanUrl(response.data.scanUrl || '');
            setQrPanelSecondsLeft(600);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to generate QR';
            setQrPanelError(message);
            pushToast('error', message);
        } finally {
            if (showLoading) setQrPanelLoading(false);
        }
    }, []);

    const fetchQrModal = useCallback(async (sessionId, showLoading = true) => {
        if (!sessionId) return;
        if (showLoading) setQrLoadingId(sessionId);
        setQrModalError('');
        try {
            const response = await api.get(`/api/sessions/${sessionId}/qr`);
            const data = response.data;
            setQrModalCode(data.qrCode);
            setQrModalScanUrl(data.scanUrl || '');
            setQrModalSecondsLeft(600);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to generate QR';
            setQrModalError(message);
            pushToast('error', message);
        } finally {
            if (showLoading) setQrLoadingId('');
        }
    }, []);

    const fetchDetailAttendance = useCallback(async (sessionId) => {
        if (!sessionId) return;
        setDetailLoading(true);
        setDetailError('');
        try {
            const response = await api.get(`/api/attendance/session/${sessionId}`);
            setDetailAttendance(response.data.attendance || []);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load session details';
            setDetailError(message);
            pushToast('error', message);
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const fetchOverallReport = useCallback(async () => {
        setReportOverallLoading(true);
        setReportOverallError('');
        try {
            const sessionRes = await api.get('/api/sessions');
            const activeSessions = (sessionRes.data || []).filter(session => session.status === 'ACTIVE');
            setHasActiveSession(activeSessions.length > 0);

            const response = await api.get('/api/attendance/report/overall');
            console.log('Stats response:', response.data);
            setReportOverall(response.data);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load overall report';
            setReportOverallError(message);
            pushToast('error', message);
        } finally {
            setReportOverallLoading(false);
        }
    }, []);

    const fetchSessionReport = useCallback(async (sessionId) => {
        if (!sessionId) return;
        setReportSessionLoading(true);
        setReportSessionError('');
        try {
            const response = await api.get(`/api/attendance/report/session/${sessionId}`);
            setReportSession(response.data);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to load session report';
            setReportSessionError(message);
            pushToast('error', message);
        } finally {
            setReportSessionLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    useEffect(() => {
        if (!selectedSessionId && activeSession) {
            setSelectedSessionId(activeSession._id);
        }
    }, [activeSession, selectedSessionId]);

    useEffect(() => {
        if (!selectedSession || selectedSession.status !== 'ACTIVE') return;
        fetchAttendance(selectedSession._id);

        const intervalId = setInterval(() => {
            fetchAttendance(selectedSession._id);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [fetchAttendance, selectedSession]);

    useEffect(() => {
        if (!selectedSession || selectedSession.status !== 'ACTIVE') return;
        fetchMembers(selectedSession._id);

        const intervalId = setInterval(() => {
            fetchMembers(selectedSession._id);
        }, 15000);

        return () => clearInterval(intervalId);
    }, [fetchMembers, selectedSession]);

    useEffect(() => {
        if (!activeSession) return;
        fetchQrPanel(activeSession._id, true);
        const intervalId = setInterval(() => {
            setQrPanelSecondsLeft(prev => {
                if (prev <= 1) {
                    fetchQrPanel(activeSession._id, false);
                    return 600;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [activeSession, fetchQrPanel]);

    useEffect(() => {
        if (!qrModalOpen || !qrModalSession) return;
        const intervalId = setInterval(() => {
            setQrModalSecondsLeft(prev => {
                if (prev <= 1) {
                    fetchQrModal(qrModalSession._id, false);
                    return 600;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [fetchQrModal, qrModalOpen, qrModalSession]);

    useEffect(() => {
        if (!qrManagerSessionId && activeSession) {
            setQrManagerSessionId(activeSession._id);
        }
    }, [activeSession, qrManagerSessionId]);

    useEffect(() => {
        if (activeView !== 'QR Manager' || !qrManagerSessionId) return;
        fetchQrPanel(qrManagerSessionId, true);
    }, [activeView, fetchQrPanel, qrManagerSessionId]);

    useEffect(() => {
        if (activeView !== 'Members') return;
        fetchUsers();
    }, [activeView, fetchUsers]);

    useEffect(() => {
        if (activeView !== 'Dashboard') return;
        fetchOverallReport();
    }, [activeView, fetchOverallReport]);

    useEffect(() => {
        if (activeView !== 'Dashboard') return;

        const intervalId = setInterval(() => {
            fetchOverallReport();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [activeView, fetchOverallReport]);

    useEffect(() => {
        setSearchQuery('');
    }, [activeView]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
            if (avatarRef.current && !avatarRef.current.contains(event.target)) {
                setAvatarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    useEffect(() => {
        if (!reportSessionId) return;
        fetchSessionReport(reportSessionId);
    }, [fetchSessionReport, reportSessionId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleStatusUpdate = async (sessionId, status) => {
        setActionLoadingId(sessionId);
        try {
            const response = await api.patch(`/api/sessions/${sessionId}/status`, { status });
            setSessions(prev => prev.map(session => (
                session._id === sessionId ? response.data : session
            )));
            setHasActiveSession(prev => {
                const updatedSessions = sessions.map(session => (
                    session._id === sessionId ? response.data : session
                ));
                return updatedSessions.some(session => session.status === 'ACTIVE');
            });
            pushToast('success', `Session marked as ${status}.`);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to update status';
            setSessionsError(message);
            pushToast('error', message);
        } finally {
            setActionLoadingId('');
        }
    };

    const handleShowQr = async session => {
        setQrModalSession(session);
        setQrModalOpen(true);
        setQrModalCode('');
        await fetchQrModal(session._id, true);
    };

    const handleOpenAttendance = async (session, tab = 'live') => {
        if (session.status !== 'ACTIVE') {
            pushToast('error', 'Session must be ACTIVE to view attendance.');
            return;
        }
        setSelectedSessionId(session._id);
        setExpandedSessionId(prev => (prev === session._id ? '' : session._id));
        setAttendanceTab(tab);
        await fetchAttendance(session._id);
        await fetchMembers(session._id);
    };

    const setMemberActionLoading = (memberId, isLoading) => {
        setMemberActionIds(prev => ({
            ...prev,
            [memberId]: isLoading
        }));
    };

    const handleMarkPresent = async member => {
        if (!selectedSessionId) return;
        setSessionMembersError('');
        setMemberActionLoading(member._id, true);
        try {
            const response = await api.post('/api/attendance/manual', {
                sessionId: selectedSessionId,
                userId: member._id
            });
            const attendanceId = response.data.attendanceId;
            const markedAt = new Date().toISOString();

            setMembers(prev => prev.map(item => (
                item._id === member._id
                    ? { ...item, isPresent: true, attendanceId }
                    : item
            )));
            setSessionMembers(prev => prev.map(item => (
                item._id === member._id
                    ? { ...item, isPresent: true, attendanceId, method: 'MANUAL', markedAt }
                    : item
            )));
            setAttendanceList(prev => ([
                {
                    _id: attendanceId,
                    userId: member._id,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                    method: 'MANUAL',
                    markedAt,
                    markedByName: 'You'
                },
                ...prev
            ]));
            setAttendanceCount(prev => prev + 1);
            setSessionSummary(prev => ({
                presentCount: prev.presentCount + 1,
                totalCount: prev.totalCount || sessionMembers.length
            }));
            pushToast('success', `Marked ${member.name} present.`);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to mark attendance';
            setSessionMembersError(message);
            pushToast('error', message);
        } finally {
            setMemberActionLoading(member._id, false);
        }
    };

    const handleUndoAttendance = async member => {
        if (!member.attendanceId) return;
        setSessionMembersError('');
        setMemberActionLoading(member._id, true);
        try {
            await api.delete(`/api/attendance/${member.attendanceId}`);
            setMembers(prev => prev.map(item => (
                item._id === member._id
                    ? { ...item, isPresent: false, attendanceId: null }
                    : item
            )));
            setSessionMembers(prev => prev.map(item => (
                item._id === member._id
                    ? { ...item, isPresent: false, attendanceId: null, method: null, markedAt: null }
                    : item
            )));
            setAttendanceList(prev => prev.filter(record => record._id !== member.attendanceId));
            setAttendanceCount(prev => Math.max(prev - 1, 0));
            setSessionSummary(prev => ({
                presentCount: Math.max(prev.presentCount - 1, 0),
                totalCount: prev.totalCount || sessionMembers.length
            }));
            pushToast('info', `Undo for ${member.name} completed.`);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to undo attendance';
            setSessionMembersError(message);
            pushToast('error', message);
        } finally {
            setMemberActionLoading(member._id, false);
        }
    };

    const handleMarkAllPresent = async () => {
        if (!selectedSessionId) return;
        setSessionMembersError('');
        setBulkLoading(true);
        const unmarkedMembers = sessionMembers.filter(member => !member.isPresent);

        for (const member of unmarkedMembers) {
            await handleMarkPresent(member);
        }

        setBulkLoading(false);
    };

    const handleOpenDetails = async session => {
        setDetailSession(session);
        await fetchDetailAttendance(session._id);
    };

    const handleCloseDetails = () => {
        setDetailSession(null);
        setDetailAttendance([]);
        setDetailError('');
    };

    const handleExportCsv = () => {
        if (!detailSession) return;
        const rows = [
            ['Name', 'Email', 'Method', 'Time'],
            ...detailAttendance.map(record => (
                [
                    record.name || 'Unknown',
                    record.email || '',
                    record.method || '',
                    record.markedAt ? new Date(record.markedAt).toLocaleString() : ''
                ]
            ))
        ];

        const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${detailSession.title.replace(/\s+/g, '-').toLowerCase()}-attendance.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleExportReportCsv = () => {
        if (!reportSession?.session) return;
        const rows = [
            ['Name', 'Email', 'Method', 'Marked At'],
            ...reportSession.attendance.map(record => (
                [
                    record.name || 'Unknown',
                    record.email || '',
                    record.method || '',
                    record.markedAt ? new Date(record.markedAt).toLocaleString() : ''
                ]
            ))
        ];

        const csvContent = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportSession.session.title.replace(/\s+/g, '-').toLowerCase()}-attendance.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCloseQr = () => {
        setQrModalOpen(false);
        setQrModalSession(null);
        setQrModalCode('');
        setQrModalError('');
        setQrModalSecondsLeft(600);
        setQrModalScanUrl('');
        setQrModalCopyLabel('Copy Link');
        setQrModalCopySuccess(false);
    };

    const handleQuickAddMember = async (event) => {
        event.preventDefault();
        if (!quickMember.name.trim() || !quickMember.email.trim()) return;
        setQuickMemberLoading(true);
        try {
            await api.post('/api/users/create', {
                name: quickMember.name,
                email: quickMember.email
            });
            setQuickMember({ name: '', email: '' });
            pushToast('success', 'Member added!');
            if (selectedSessionId) {
                await fetchMembers(selectedSessionId);
            }
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to add member';
            pushToast('error', message);
        } finally {
            setQuickMemberLoading(false);
        }
    };

    const handleMemberCreate = async (event) => {
        event.preventDefault();
        if (!memberForm.name.trim() || !memberForm.email.trim()) return;
        setMemberFormLoading(true);
        try {
            await api.post('/api/users/create', {
                name: memberForm.name,
                email: memberForm.email
            });
            setMemberForm({ name: '', email: '' });
            setMemberFormOpen(false);
            pushToast('success', 'Member added!');
            await fetchUsers();
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to add member';
            pushToast('error', message);
        } finally {
            setMemberFormLoading(false);
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm(
            'Are you sure you want to delete this member? This will also delete their attendance records.'
        )) return;

        try {
            await api.delete(`/api/users/${memberId}`);
            setMembers(prev => prev.filter(member => member._id !== memberId));
            pushToast('success', 'Member deleted successfully');
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to delete member';
            pushToast('error', message);
        }
    };

    const fetchAssignments = async (sessionId) => {
        setAssignmentsLoading(prev => ({ ...prev, [sessionId]: true }));
        try {
            const response = await api.get(`/api/assignments/session/${sessionId}`);
            setAssignments(prev => ({ ...prev, [sessionId]: response.data.assignments || [] }));
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
            setAssignments(prev => ({ ...prev, [sessionId]: [] }));
        } finally {
            setAssignmentsLoading(prev => ({ ...prev, [sessionId]: false }));
        }
    };

    const handleCreateAssignment = async (sessionId) => {
        if (!assignmentTitle.trim() || !assignmentDescription.trim()) {
            pushToast('error', 'Title and description are required');
            return;
        }

        setAssignmentSubmitting(true);
        try {
            await api.post('/api/assignments/create', {
                sessionId,
                title: assignmentTitle,
                description: assignmentDescription,
                dueDate: assignmentDueDate || null
            });
            setAssignmentTitle('');
            setAssignmentDescription('');
            setAssignmentDueDate('');
            pushToast('success', 'Assignment created!');
            await fetchAssignments(sessionId);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to create assignment';
            pushToast('error', message);
        } finally {
            setAssignmentSubmitting(false);
        }
    };

    const handleDeleteAssignment = async (assignmentId, sessionId) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;

        try {
            await api.delete(`/api/assignments/${assignmentId}`);
            pushToast('success', 'Assignment deleted!');
            await fetchAssignments(sessionId);
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to delete assignment';
            pushToast('error', message);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="min-h-screen">
            <Toast toasts={toasts} onDismiss={handleDismissToast} />

            <aside
                className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r md:flex"
                style={{
                    backgroundColor: '#1A2744',
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF'
                }}
            >
                <div className="px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/15 text-[#3B82F6]">
                            <LayoutGrid size={18} />
                        </div>
                        <div>
                            <p style={{ color: theme === 'light' ? '#FFFFFF' : '#FFFFFF' }} className="text-sm font-semibold">SmartAttend</p>
                            <p style={{ color: theme === 'light' ? 'rgba(255,255,255,0.6)' : '#4B5563' }} className="text-xs uppercase tracking-[0.3em]">Developer's Club</p>
                        </div>
                    </div>
                </div>
                <div
                    className="mx-6 border-t"
                    style={{ borderColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--border-color)' }}
                />

                <nav className="mt-6 flex-1 space-y-1 px-3 text-sm">
                    {[
                        { label: 'Dashboard', icon: LayoutDashboard },
                        { label: 'Sessions', icon: CalendarDays },
                        { label: 'Members', icon: Users },
                        { label: 'Reports', icon: BarChart3 },
                        { label: 'QR Manager', icon: QrCode }
                    ].map(item => {
                        const isActive = activeView === item.label;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                    setActiveView(item.label);
                                    setSearchQuery('');
                                }}
                                style={{
                                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.85)',
                                    backgroundColor: isActive ? 'rgba(59,130,246,0.2)' : 'transparent',
                                    borderLeftColor: isActive ? '#3B82F6' : 'transparent'
                                }}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition border-l-2 font-medium text-[14px] tracking-[0.01em] hover:bg-white/10 hover:text-white`}
                            >
                                <item.icon className={`h-4 w-4 transition ${isActive ? 'text-[#60A5FA] opacity-100' : 'opacity-80'}`} />
                                <span className="whitespace-nowrap">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div
                    className="mt-auto space-y-4 border-t px-6 py-5"
                    style={{ borderColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--border-color)' }}
                >
                    <button
                        onClick={() => pushToast('info', 'Report feature coming soon.')}
                        className="w-full rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)] transition hover:translate-y-[-1px]"
                    >
                        Generate Report
                    </button>
                    <div className="flex items-center gap-3">
                        <Avatar name={user?.name || 'Admin'} size="md" />
                        <div>
                            <p style={{ color: theme === 'light' ? '#FFFFFF' : '#FFFFFF' }} className="text-sm font-semibold">{user?.name || 'Admin'}</p>
                            <span
                                className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                                style={{
                                    borderColor: theme === 'light' ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                                    color: theme === 'light' ? 'rgba(255,255,255,0.8)' : '#93C5FD'
                                }}
                            >
                                ADMIN
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition"
                        style={{
                            borderColor: theme === 'light' ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                            backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                            color: theme === 'light' ? 'rgba(255,255,255,0.7)' : '#9CA3AF'
                        }}
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </aside>

            <main className="min-h-screen px-4 pb-20 pt-6 md:pl-[15rem] md:pr-10">
                <div
                    className="sticky top-0 z-20 mb-8 flex items-center justify-between border-b px-2 py-4 backdrop-blur md:px-6"
                    style={{
                        borderColor: 'var(--border-color)',
                        backgroundColor: theme === 'light' ? 'rgba(240, 244, 255, 0.95)' : 'rgba(2,8,23,0.9)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#4B5563]">{activeView}</p>
                        <h1 className="mt-1 text-2xl font-semibold">Admin Control Room</h1>
                    </div>
                    <div className="hidden flex-1 px-8 md:block">
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={event => setSearchQuery(event.target.value)}
                                    placeholder={getSearchPlaceholder()}
                                    disabled={isSearchDisabled()}
                                    style={{
                                        backgroundColor: theme === 'light' ? '#FFFFFF' : '#1F2937',
                                        borderColor: theme === 'light' ? '#C8D0DC' : 'rgba(255,255,255,0.1)',
                                        color: theme === 'light' ? '#0F172A' : '#9CA3AF',
                                        paddingRight: searchQuery ? '40px' : '16px',
                                        opacity: isSearchDisabled() ? 0.5 : 1,
                                        cursor: isSearchDisabled() ? 'not-allowed' : 'text'
                                    }}
                                    className="w-full rounded-full border px-4 py-2 text-sm placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60 disabled:cursor-not-allowed disabled:opacity-70"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white transition"
                                        aria-label="Clear search"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            {searchQuery && !isSearchDisabled() && (
                                <p className="mt-2 text-xs" style={{ color: theme === 'light' ? '#9CA3AF' : '#6B7280' }}>
                                    Showing {activeView === 'Sessions' ? filteredSessionsView.length : activeView === 'Members' ? filteredMembersView.length : activeView === 'Reports' ? filteredSessionOptions.length : 0} results for "{searchQuery}"
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="relative flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="rounded-full border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition hover:text-white"
                            >
                                <Bell size={18} />
                            </button>
                            {notificationOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-[#111827] shadow-lg"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                                        color: theme === 'light' ? '#0F172A' : '#FFFFFF',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        zIndex: 50,
                                        padding: '8px'
                                    }}
                                >
                                    <div className="px-4 py-3 font-semibold border-b" style={{ borderColor: 'var(--border-color)' }}>Notifications</div>
                                    <div className="px-4 py-3 text-sm">
                                        {activeSession ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                                    <span>{activeSession.title} is currently active</span>
                                                </div>
                                                <div className="mt-2 text-xs" style={{ color: theme === 'light' ? '#4B5563' : '#9CA3AF' }}>
                                                    {attendanceCount || 0} members present
                                                </div>
                                            </>
                                        ) : (
                                            <span style={{ color: theme === 'light' ? '#4B5563' : '#9CA3AF' }}>No active sessions right now</span>
                                        )}
                                    </div>
                                    <div className="border-t px-4 py-3 text-xs" style={{ borderColor: 'var(--border-color)', color: theme === 'light' ? '#9CA3AF' : '#6B7280' }}>All caught up!</div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="rounded-full border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition hover:text-white"
                            >
                                <Settings size={18} />
                            </button>
                            {settingsOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-[#111827] shadow-lg"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                                        color: theme === 'light' ? '#0F172A' : '#FFFFFF',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        zIndex: 50,
                                        padding: '8px'
                                    }}
                                >
                                    <div className="px-4 py-3 font-semibold border-b" style={{ borderColor: 'var(--border-color)' }}>Settings</div>
                                    <button
                                        onClick={() => {
                                            toggleTheme();
                                            setSettingsOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm hover:bg-white/10 flex items-center justify-between"
                                    >
                                        <span>Dark Mode</span>
                                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                    </button>
                                    <div className="border-t" style={{ borderColor: 'var(--border-color)' }} />
                                    <div className="px-4 py-3 text-xs" style={{ color: theme === 'light' ? '#9CA3AF' : '#6B7280' }}>Version 1.0.0</div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen(!avatarOpen)}
                                className="rounded-full border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition hover:text-white"
                            >
                                <Avatar name={user?.name || 'Admin'} size="sm" />
                            </button>
                            {avatarOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-[#111827] shadow-lg"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                        backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                                        color: theme === 'light' ? '#0F172A' : '#FFFFFF',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        zIndex: 50,
                                        padding: '12px'
                                    }}
                                >
                                    <div className="flex flex-col items-center gap-3 border-b px-4 py-4" style={{ borderColor: 'var(--border-color)' }}>
                                        <Avatar name={user?.name || 'Admin'} size="lg" />
                                        <div className="text-center">
                                            <p className="font-semibold text-sm">{user?.name || 'Admin'}</p>
                                            <p className="text-xs" style={{ color: theme === 'light' ? '#9CA3AF' : '#6B7280' }}>{user?.email || 'admin@example.com'}</p>
                                            <span
                                                className="mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                                                style={{
                                                    borderColor: theme === 'light' ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                                                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : 'var(--bg-input)',
                                                    color: theme === 'light' ? 'rgba(255,255,255,0.8)' : '#93C5FD'
                                                }}
                                            >
                                                {user?.role || 'ADMIN'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/login');
                                            setAvatarOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-red-200 hover:bg-red-500/10 flex items-center gap-2 border-t"
                                        style={{ borderColor: 'var(--border-color)' }}
                                    >
                                        <LogOut size={16} />
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[{
                        label: 'Total Sessions',
                        value: reportOverall?.totalSessions ?? 0,
                        icon: CalendarDays,
                        badge: `+${thisWeekSessions} this week`,
                        badgeClass: 'text-emerald-200',
                        accentColor: '#60A5FA'
                    }, {
                        label: 'Present Today',
                        value: hasActiveSession ? (reportOverall?.presentToday ?? 0) : '-',
                        icon: UserCheck,
                        badge: hasActiveSession ? '● Live' : 'No active session',
                        badgeClass: hasActiveSession ? 'text-emerald-200' : 'text-[#9CA3AF]',
                        accentColor: '#34D399'
                    }, {
                        label: 'Absent Today',
                        value: hasActiveSession ? (reportOverall?.absentToday ?? 0) : '-',
                        icon: UserX,
                        badge: hasActiveSession ? `${reportOverall?.attendancePercent ?? '0'}% attendance` : '-',
                        badgeClass: hasActiveSession ? 'text-red-200' : 'text-[#9CA3AF]',
                        accentColor: '#F87171'
                    }, {
                        label: 'Attendance %',
                        value: hasActiveSession ? `${reportOverall?.attendancePercent ?? '0'}%` : '-',
                        icon: Percent,
                        badge: hasActiveSession ? (() => {
                            const percent = parseFloat(reportOverall?.attendancePercent ?? 0);
                            if (percent >= 75) return 'Good';
                            if (percent >= 50) return 'Average';
                            return 'Low';
                        })() : '-',
                        badgeClass: hasActiveSession ? (() => {
                            const percent = parseFloat(reportOverall?.attendancePercent ?? 0);
                            if (percent >= 75) return 'text-emerald-200';
                            if (percent >= 50) return 'text-amber-200';
                            return 'text-red-200';
                        })() : 'text-[#9CA3AF]',
                        accentColor: '#A78BFA'
                    }].map((card, index) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            style={{
                                background: theme === 'light'
                                    ? `linear-gradient(135deg, #1A2744, #243560)`
                                    : 'linear-gradient(135deg, rgba(30, 42, 94, 0.8), rgba(36, 53, 96, 0.8))',
                                borderLeft: theme === 'light' ? `4px solid ${card.accentColor}` : 'none',
                                borderRadius: '16px',
                                padding: '24px',
                                color: theme === 'light' ? '#FFFFFF' : 'currentColor',
                                boxShadow: theme === 'light'
                                    ? '0 4px 16px rgba(26, 39, 68, 0.15)'
                                    : '0 0 0 1px rgba(59,130,246,0.2), 0 4px 24px rgba(0,0,0,0.4)',
                                border: theme === 'light' ? 'none' : '1px solid rgba(255,255,255,0.1)'
                            }}
                            className="rounded-2xl"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p style={{ color: theme === 'light' ? 'rgba(255,255,255,0.7)' : '#9CA3AF', fontSize: '14px' }}>{card.label}</p>
                                    <p style={{ color: theme === 'light' ? '#FFFFFF' : '#FFFFFF', fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{card.value}</p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.1)' : '#1F2937',
                                    color: theme === 'light' ? card.accentColor : '#3B82F6'
                                }}>
                                    <card.icon size={18} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: theme === 'light' ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>
                                {card.label === 'Present Today' ? (
                                    <span className="flex items-center gap-1 text-emerald-200">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                        {card.badge}
                                    </span>
                                ) : (
                                    <span className={card.badgeClass}>{card.badge}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </section>

                {activeView === 'Dashboard' && (
                    <section className="mt-10 space-y-6">
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                                border: theme === 'light' ? '1.5px solid #D0DBFF' : '1px solid rgba(255,255,255,0.1)',
                                color: theme === 'light' ? '#1A2744' : '#FFFFFF',
                                boxShadow: theme === 'light' ? '0 4px 16px rgba(26, 39, 68, 0.08)' : '0 0 0 1px rgba(59,130,246,0.2)'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold" style={{ color: theme === 'light' ? '#1A2744' : '#FFFFFF' }}>Active Session Panel</h2>
                                {activeSession && (
                                    <span
                                        className="rounded-full px-2 py-1 text-xs font-semibold"
                                        style={{
                                            backgroundColor: '#10B981',
                                            color: '#FFFFFF',
                                            border: 'none'
                                        }}
                                    >
                                        Active
                                    </span>
                                )}
                            </div>

                            {activeSession ? (
                                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                                    <div
                                        className="rounded-xl p-4"
                                        style={{
                                            backgroundColor: theme === 'light' ? '#FFFFFF' : '#0B1220',
                                            border: theme === 'light' ? '1.5px solid #D0DBFF' : '1px solid rgba(255,255,255,0.1)',
                                            color: theme === 'light' ? '#1A2744' : '#FFFFFF'
                                        }}
                                    >
                                        <h3 className="text-lg font-semibold" style={{ color: theme === 'light' ? '#1A2744' : '#FFFFFF' }}>{activeSession.title}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: theme === 'light' ? '#5B7AB5' : '#9CA3AF' }}>
                                            <span className="inline-flex items-center gap-1">
                                                <Calendar size={14} className="text-[#3B82F6]" />
                                                {new Date(activeSession.date).toLocaleDateString()}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <MapPin size={14} className="text-[#3B82F6]" />
                                                {activeSession.venue}
                                            </span>
                                        </div>
                                        <p className="mt-4 text-sm" style={{ color: theme === 'light' ? '#5B7AB5' : '#9CA3AF' }}>
                                            {attendanceCount} present
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleShowQr(activeSession)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2563EB]"
                                            >
                                                <QrCode size={14} />
                                                Show QR
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(activeSession._id, 'CLOSED')}
                                                className="rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-60"
                                                style={{
                                                    border: theme === 'light' ? '2px solid #1A2744' : '1px solid rgba(239, 68, 68, 0.4)',
                                                    color: theme === 'light' ? '#1A2744' : '#F87171',
                                                    backgroundColor: 'transparent'
                                                }}
                                                disabled={actionLoadingId === activeSession._id}
                                            >
                                                {actionLoadingId === activeSession._id ? 'Updating...' : 'Close Session'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">Attendance</p>
                                            <div className="inline-flex rounded-full border border-white/10 bg-[#1F2937] p-1">
                                                <button
                                                    onClick={() => setAttendanceTab('live')}
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${attendanceTab === 'live' ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF]'}`}
                                                >
                                                    Live Feed
                                                </button>
                                                <button
                                                    onClick={() => setAttendanceTab('manual')}
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${attendanceTab === 'manual' ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF]'}`}
                                                >
                                                    Manual Mark
                                                </button>
                                            </div>
                                        </div>

                                        {attendanceTab === 'live' && (
                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-[#9CA3AF]">Live Attendance</p>
                                                    <span className="text-xs text-[#9CA3AF]">Auto refreshes every 10s</span>
                                                </div>
                                                {attendanceLoading ? (
                                                    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] p-6 animate-pulse" />
                                                ) : attendanceList.length ? (
                                                    attendanceList.map(record => (
                                                        <div key={record._id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0F172A] px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar name={record.name || 'Unknown'} size="sm" />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">{record.name || 'Unknown'}</p>
                                                                    <p className="text-xs text-[#9CA3AF]">{record.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${record.method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                                    {record.method}
                                                                </span>
                                                                <p className="mt-1 text-xs text-[#9CA3AF]">{formatTimeAgo(record.markedAt)}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-[#6B7280]">No attendance recorded yet.</p>
                                                )}
                                            </div>
                                        )}

                                        {attendanceTab === 'manual' && (
                                            <div className="mt-4 space-y-4">
                                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                    <input
                                                        type="text"
                                                        placeholder="Search member..."
                                                        value={memberSearch}
                                                        onChange={event => setMemberSearch(event.target.value)}
                                                        className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60 md:max-w-sm"
                                                    />
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <p className="text-[#9CA3AF]">
                                                            {sessionPresentCount} / {sessionTotalCount} members present
                                                        </p>
                                                        <button
                                                            onClick={handleMarkAllPresent}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:brightness-110 disabled:opacity-60"
                                                            disabled={bulkLoading || sessionMembersLoading}
                                                        >
                                                            {bulkLoading ? <LoadingSpinner size={14} /> : null}
                                                            Mark All Present
                                                        </button>
                                                    </div>
                                                </div>

                                                {sessionMembersError && <p className="text-sm text-red-200">{sessionMembersError}</p>}
                                                {sessionMembersLoading ? (
                                                    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] p-6 animate-pulse" />
                                                ) : (
                                                    <div className="space-y-3">
                                                        {filteredSessionMembers.map(member => {
                                                            const method = member.method || 'QR';
                                                            const markedAt = member.markedAt;
                                                            const canUndo = Boolean(markedAt) &&
                                                                Date.now() - new Date(markedAt).getTime() < 10 * 60 * 1000;

                                                            return (
                                                                <div key={member._id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0B1220] p-4 md:flex-row md:items-center md:justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar name={member.name} size="sm" />
                                                                        <div>
                                                                            <p className="text-sm font-semibold text-white">{member.name}</p>
                                                                            <p className="text-xs text-[#9CA3AF]">{member.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-[#9CA3AF]">
                                                                            {member.role}
                                                                        </span>
                                                                        {!member.isPresent ? (
                                                                            <button
                                                                                onClick={() => handleMarkPresent(member)}
                                                                                className="rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] transition hover:brightness-110 disabled:opacity-60"
                                                                                disabled={memberActionIds[member._id]}
                                                                            >
                                                                                {memberActionIds[member._id] ? 'Marking...' : 'Mark Present'}
                                                                            </button>
                                                                        ) : (
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                                                    {method}
                                                                                </span>
                                                                                {canUndo && (
                                                                                    <button
                                                                                        onClick={() => handleUndoAttendance(member)}
                                                                                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-[#9CA3AF] transition hover:bg-white/10 disabled:opacity-60"
                                                                                        disabled={memberActionIds[member._id]}
                                                                                    >
                                                                                        {memberActionIds[member._id] ? 'Undoing...' : 'Undo'}
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        {!filteredSessionMembers.length && (
                                                            <p className="text-sm text-[#6B7280]">No members found.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 rounded-xl border border-white/10 bg-[#0B1220] p-6 text-center">
                                    <h3 className="text-lg font-semibold text-white">No active session</h3>
                                    <p className="mt-2 text-sm text-[#9CA3AF]">
                                        Create a session and activate it to start tracking.
                                    </p>
                                    <button
                                        onClick={() => navigate('/admin/create-session')}
                                        className="mt-4 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)] transition hover:translate-y-[-1px]"
                                    >
                                        Create Session →
                                    </button>
                                </div>
                            )}
                        </div>

                        <div
                            className="rounded-2xl p-6"
                            style={{
                                backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                                border: theme === 'light' ? '1.5px solid #D0DBFF' : '1px solid rgba(255,255,255,0.1)',
                                color: theme === 'light' ? '#1A2744' : '#FFFFFF',
                                boxShadow: theme === 'light' ? '0 4px 16px rgba(26, 39, 68, 0.08)' : 'none'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Quick Add Member</h2>
                                <span className="text-xs" style={{ color: theme === 'light' ? '#5B7AB5' : '#9CA3AF' }}>Add new members instantly</span>
                            </div>
                            <form onSubmit={handleQuickAddMember} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={quickMember.name}
                                    onChange={event => setQuickMember(prev => ({ ...prev, name: event.target.value }))}
                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={quickMember.email}
                                    onChange={event => setQuickMember(prev => ({ ...prev, email: event.target.value }))}
                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2563EB] disabled:opacity-60"
                                    disabled={quickMemberLoading}
                                >
                                    {quickMemberLoading ? 'Adding...' : 'Add Member'}
                                </button>
                            </form>
                        </div>
                    </section>
                )}

                {activeView === 'Sessions' && (
                    <section className="mt-10">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">All Sessions</h2>
                                <p className="mt-1 text-sm" style={{ color: theme === 'light' ? '#5B7AB5' : '#9CA3AF' }}>Manage sessions and control attendance in real time.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => navigate('/admin/create-session')}
                                    className="rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)] transition hover:translate-y-[-1px]"
                                >
                                    New Session +
                                </button>
                                <button
                                    onClick={fetchSessions}
                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition hover:opacity-80"
                                    style={{
                                        border: theme === 'light' ? '1px solid #D0DBFF' : '1px solid rgba(255,255,255,0.1)',
                                        backgroundColor: theme === 'light' ? '#F0F4FF' : 'rgba(255,255,255,0.05)',
                                        color: theme === 'light' ? '#1A2744' : '#FFFFFF'
                                    }}
                                >
                                    <RefreshCw size={14} />
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {sessionsError && (
                            <p className="mb-4 text-sm text-red-200">{sessionsError}</p>
                        )}

                        <div className="space-y-4">
                            {loadingSessions && !sessions.length ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={`session-skeleton-${index}`}
                                        className="h-40 rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] animate-pulse"
                                    />
                                ))
                            ) : filteredSessionsView.length ? (
                                filteredSessionsView.map((session, index) => (
                                    <motion.div
                                        key={session._id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative rounded-xl border border-white/10 bg-[#0F172A] p-4"
                                    >
                                        <span className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${typeAccent[session.type] || 'bg-gray-500'}`} />
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="pl-3">
                                                <button
                                                    onClick={() => handleOpenDetails(session)}
                                                    className="text-left text-lg font-semibold text-white transition hover:text-[#93C5FD]"
                                                >
                                                    {session.title}
                                                </button>
                                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar size={14} className="text-[#3B82F6]" />
                                                        {new Date(session.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin size={14} className="text-[#3B82F6]" />
                                                        {session.venue}
                                                    </span>
                                                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase text-[#9CA3AF]">
                                                        {session.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${statusStyles[session.status]}`}>
                                                {session.status === 'ACTIVE' ? (
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                                        Active
                                                    </span>
                                                ) : session.status}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-2 pl-3">
                                            <button
                                                onClick={() => handleStatusUpdate(session._id, 'ACTIVE')}
                                                className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:opacity-60"
                                                disabled={actionLoadingId === session._id || session.status === 'ACTIVE'}
                                            >
                                                {actionLoadingId === session._id ? 'Updating...' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(session._id, 'CLOSED')}
                                                className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:opacity-60"
                                                disabled={actionLoadingId === session._id || session.status === 'CLOSED'}
                                            >
                                                {actionLoadingId === session._id ? 'Updating...' : 'Close'}
                                            </button>
                                            <button
                                                onClick={() => handleShowQr(session)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2563EB] disabled:opacity-60"
                                                disabled={qrLoadingId === session._id}
                                            >
                                                <QrCode size={14} />
                                                {qrLoadingId === session._id ? 'Loading...' : 'Show QR'}
                                            </button>
                                            <button
                                                onClick={() => handleOpenAttendance(session, 'live')}
                                                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-[#9CA3AF] transition hover:bg-white/10"
                                            >
                                                Attendance ↓
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setExpandedAssignmentsSessionId(prev => prev === session._id ? '' : session._id);
                                                    if (expandedAssignmentsSessionId !== session._id) {
                                                        fetchAssignments(session._id);
                                                    }
                                                }}
                                                className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/10 disabled:opacity-60"
                                            >
                                                <ClipboardList size={14} />
                                                Assignments
                                            </button>
                                        </div>

                                        <AnimatePresence initial={false}>
                                            {expandedSessionId === session._id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#111827]"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.2em] text-[#4B5563]">Attendance</p>
                                                            <p className="text-sm font-semibold text-white">{attendanceCount} members present</p>
                                                        </div>
                                                        <div className="inline-flex rounded-full border border-white/10 bg-[#1F2937] p-1">
                                                            <button
                                                                onClick={() => setAttendanceTab('live')}
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${attendanceTab === 'live' ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF]'}`}
                                                            >
                                                                Live Feed
                                                            </button>
                                                            <button
                                                                onClick={() => setAttendanceTab('manual')}
                                                                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${attendanceTab === 'manual' ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF]'}`}
                                                            >
                                                                Manual Mark
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {attendanceTab === 'live' && (
                                                        <div className="space-y-3 px-4 py-4">
                                                            {attendanceError && (
                                                                <p className="text-sm text-red-200">{attendanceError}</p>
                                                            )}
                                                            {attendanceLoading ? (
                                                                <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] p-6 animate-pulse" />
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    {attendanceList.map(record => (
                                                                        <div key={record._id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0B1220] p-4 md:flex-row md:items-center md:justify-between">
                                                                            <div className="flex items-center gap-3">
                                                                                <Avatar name={record.name || 'Unknown'} size="sm" />
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-white">{record.name || 'Unknown'}</p>
                                                                                    <p className="text-xs text-[#9CA3AF]">{record.email}</p>
                                                                                    {record.markedByName && (
                                                                                        <p className="text-xs text-[#4B5563]">Marked by {record.markedByName}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${record.method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                                                    {record.method}
                                                                                </span>
                                                                                <span className="text-xs text-[#9CA3AF]">
                                                                                    {formatTimeAgo(record.markedAt)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {!attendanceList.length && (
                                                                        <p className="text-sm text-[#6B7280]">No attendance recorded yet.</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {attendanceTab === 'manual' && (
                                                        <div className="space-y-4 px-4 py-4">
                                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search member..."
                                                                    value={memberSearch}
                                                                    onChange={event => setMemberSearch(event.target.value)}
                                                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60 md:max-w-sm"
                                                                />
                                                                <div className="flex items-center gap-3 text-sm">
                                                                    <p className="text-[#9CA3AF]">
                                                                        {sessionPresentCount} / {sessionTotalCount} members present
                                                                    </p>
                                                                    <button
                                                                        onClick={handleMarkAllPresent}
                                                                        className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-3 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:brightness-110 disabled:opacity-60"
                                                                        disabled={bulkLoading || sessionMembersLoading}
                                                                    >
                                                                        {bulkLoading ? <LoadingSpinner size={14} /> : null}
                                                                        Mark All Present
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {sessionMembersError && <p className="text-sm text-red-200">{sessionMembersError}</p>}
                                                            {sessionMembersLoading ? (
                                                                <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] p-6 animate-pulse" />
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    {filteredSessionMembers.map(member => {
                                                                        const method = member.method || 'QR';
                                                                        const markedAt = member.markedAt;
                                                                        const canUndo = Boolean(markedAt) &&
                                                                            Date.now() - new Date(markedAt).getTime() < 10 * 60 * 1000;

                                                                        return (
                                                                            <div key={member._id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[#0B1220] p-4 md:flex-row md:items-center md:justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                    <Avatar name={member.name} size="sm" />
                                                                                    <div>
                                                                                        <p className="text-sm font-semibold text-white">{member.name}</p>
                                                                                        <p className="text-xs text-[#9CA3AF]">{member.email}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-[#9CA3AF]">
                                                                                        {member.role}
                                                                                    </span>
                                                                                    {!member.isPresent ? (
                                                                                        <button
                                                                                            onClick={() => handleMarkPresent(member)}
                                                                                            className="rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-[#0A0A0A] transition hover:brightness-110 disabled:opacity-60"
                                                                                            disabled={memberActionIds[member._id]}
                                                                                        >
                                                                                            {memberActionIds[member._id] ? 'Marking...' : 'Mark Present'}
                                                                                        </button>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                                                                {method}
                                                                                            </span>
                                                                                            {canUndo && (
                                                                                                <button
                                                                                                    onClick={() => handleUndoAttendance(member)}
                                                                                                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-[#9CA3AF] transition hover:bg-white/10 disabled:opacity-60"
                                                                                                    disabled={memberActionIds[member._id]}
                                                                                                >
                                                                                                    {memberActionIds[member._id] ? 'Undoing...' : 'Undo'}
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    {!filteredSessionMembers.length && (
                                                                        <p className="text-sm text-[#6B7280]">No members found.</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}

                                            {expandedAssignmentsSessionId === session._id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#111827]"
                                                >
                                                    <div className="space-y-4 px-4 py-4">
                                                        <div>
                                                            <h3 className="mb-3 text-sm font-semibold text-white">Add Assignment</h3>
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Assignment title..."
                                                                    value={assignmentTitle}
                                                                    onChange={e => setAssignmentTitle(e.target.value)}
                                                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/60"
                                                                />
                                                                <textarea
                                                                    rows={3}
                                                                    placeholder="Description..."
                                                                    value={assignmentDescription}
                                                                    onChange={e => setAssignmentDescription(e.target.value)}
                                                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/60"
                                                                />
                                                                <input
                                                                    type="date"
                                                                    value={assignmentDueDate}
                                                                    onChange={e => setAssignmentDueDate(e.target.value)}
                                                                    className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/60"
                                                                />
                                                                <button
                                                                    onClick={() => handleCreateAssignment(session._id)}
                                                                    disabled={assignmentSubmitting}
                                                                    className="w-full rounded-lg bg-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C3AED] disabled:opacity-60"
                                                                >
                                                                    {assignmentSubmitting ? 'Adding...' : 'Add Assignment →'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="border-t border-white/10 pt-4">
                                                            <h3 className="mb-3 text-sm font-semibold text-white">Assignments</h3>
                                                            {assignmentsLoading[session._id] ? (
                                                                <p className="text-sm text-[#9CA3AF]">Loading...</p>
                                                            ) : assignments[session._id] && assignments[session._id].length > 0 ? (
                                                                <div className="space-y-3">
                                                                    {assignments[session._id].map(assignment => {
                                                                        const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
                                                                        const isFuture = assignment.dueDate && new Date(assignment.dueDate) > new Date();

                                                                        return (
                                                                            <div key={assignment._id} className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    <h4 className="font-semibold text-white">{assignment.title}</h4>
                                                                                    {assignment.dueDate && (
                                                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${isOverdue ? 'bg-red-500/20 text-red-200' : 'bg-amber-500/20 text-amber-200'}`}>
                                                                                            {isOverdue ? 'Overdue' : isFuture ? `Due ${new Date(assignment.dueDate).toLocaleDateString()}` : ''}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="mt-2 text-xs text-[#9CA3AF]">{assignment.description}</p>
                                                                                <div className="mt-3 flex items-center justify-between">
                                                                                    <p className="text-xs text-[#6B7280]">Added by {assignment.createdByName || 'Unknown'}</p>
                                                                                    <button
                                                                                        onClick={() => handleDeleteAssignment(assignment._id, session._id)}
                                                                                        className="inline-flex items-center gap-1 text-xs text-red-400 transition hover:text-red-300"
                                                                                    >
                                                                                        <Trash2 size={14} /> Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-[#6B7280]">No assignments for this session yet</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-white/20 py-10 text-center text-sm text-[#6B7280]">
                                    {searchQuery ? `No sessions match "${searchQuery}"` : 'No sessions yet. Create one to get started.'}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {
                    activeView === 'Members' && (
                        <section className="mt-10 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold">Members</h2>
                                    <p className="mt-1 text-sm text-[#9CA3AF]">Manage member access and profiles.</p>
                                </div>
                                <button
                                    onClick={() => setMemberFormOpen(prev => !prev)}
                                    className="rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(59,130,246,0.25)] transition hover:translate-y-[-1px]"
                                >
                                    Add Member
                                </button>
                            </div>

                            {memberFormOpen && (
                                <form onSubmit={handleMemberCreate} className="rounded-xl border border-white/10 bg-[#111827] p-4">
                                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={memberForm.name}
                                            onChange={event => setMemberForm(prev => ({ ...prev, name: event.target.value }))}
                                            className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={memberForm.email}
                                            onChange={event => setMemberForm(prev => ({ ...prev, email: event.target.value }))}
                                            className="w-full rounded-lg border border-white/10 bg-[#1F2937] px-4 py-2 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2563EB] disabled:opacity-60"
                                            disabled={memberFormLoading}
                                        >
                                            {memberFormLoading ? 'Adding...' : 'Add Member'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="rounded-2xl border border-white/10 bg-[#111827]">
                                <div className="grid grid-cols-[1.2fr_1.4fr_0.6fr_0.8fr_0.6fr] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase text-[#4B5563]">
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Role</span>
                                    <span>Joined Date</span>
                                    <span>Actions</span>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {membersLoading ? (
                                        <div className="p-4 text-sm text-[#9CA3AF]">Loading members...</div>
                                    ) : filteredMembersView.length ? (
                                        filteredMembersView.map(member => (
                                            <div
                                                key={member._id}
                                                className="grid grid-cols-[1.2fr_1.4fr_0.6fr_0.8fr_0.6fr] gap-3 px-4 py-3 text-sm"
                                            >
                                                <span className="text-white">{member.name}</span>
                                                <span className="text-[#9CA3AF]">{member.email}</span>
                                                <span className="text-[#9CA3AF]">{member.role}</span>
                                                <span className="text-[#9CA3AF]">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '--'}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => pushToast('info', 'Edit member coming soon.')}
                                                        className="rounded-lg border border-white/10 px-2 py-1 text-xs text-[#9CA3AF] transition hover:bg-white/10"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMember(member._id)}
                                                        className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-200 transition hover:bg-red-500/10"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-[#9CA3AF]">No members found.</div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )
                }

                {
                    activeView === 'QR Manager' && (
                        <section className="mt-10">
                            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">QR Manager</h2>
                                        <p className="mt-1 text-sm text-[#9CA3AF]">Manage QR codes for active sessions.</p>
                                    </div>
                                    <select
                                        value={qrManagerSessionId}
                                        onChange={event => {
                                            setQrManagerSessionId(event.target.value);
                                            fetchQrPanel(event.target.value, true);
                                        }}
                                        className="rounded-lg border border-white/10 bg-[#1F2937] px-3 py-2 text-sm text-white"
                                    >
                                        {sessions.filter(session => session.status === 'ACTIVE').map(session => (
                                            <option key={session._id} value={session._id}>
                                                {session.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-[#0B1220] p-4">
                                    {qrPanelError && (
                                        <p className="mb-3 text-sm text-red-200">{qrPanelError}</p>
                                    )}
                                    {qrPanelLoading ? (
                                        <div className="h-48 rounded-xl bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] animate-pulse" />
                                    ) : qrPanelCode ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <img src={qrPanelCode} alt="Session QR" className="h-40 w-40" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-8 text-center text-sm text-[#6B7280]">
                                            <QrCode size={20} />
                                            Select an active session to generate QR
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#9CA3AF]">
                                    <span>Refreshes in {qrPanelSecondsLeft}s</span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => qrManagerSessionId && fetchQrPanel(qrManagerSessionId, true)}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                                        disabled={!qrManagerSessionId}
                                    >
                                        <RefreshCw size={14} />
                                        Force Refresh
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!qrPanelScanUrl) return;
                                            try {
                                                await navigator.clipboard.writeText(qrPanelScanUrl);
                                                setQrPanelCopyLabel('Copied');
                                                pushToast('success', 'QR link copied.');
                                                setTimeout(() => setQrPanelCopyLabel('Copy Link'), 2000);
                                            } catch (copyError) {
                                                setQrPanelCopyLabel('Copy Link');
                                            }
                                        }}
                                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                                        disabled={!qrPanelScanUrl}
                                    >
                                        {qrPanelCopyLabel}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const session = sessions.find(item => item._id === qrManagerSessionId);
                                            if (session) handleShowQr(session);
                                        }}
                                        className="flex-1 rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#2563EB]"
                                        disabled={!qrManagerSessionId}
                                    >
                                        Full Screen
                                    </button>
                                </div>
                            </div>
                        </section>
                    )
                }

                {
                    activeView === 'Reports' && (
                        <section className="mt-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Reports</h2>
                                    <p className="mt-1 text-sm text-[#9CA3AF]">Insights across sessions and attendance.</p>
                                </div>
                            </div>



                            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Session Report</h3>
                                        <p className="mt-1 text-sm text-[#9CA3AF]">Select a session to view attendance breakdown.</p>
                                    </div>
                                    <select
                                        value={reportSessionId}
                                        onChange={event => {
                                            setReportSessionId(event.target.value);
                                            setReportSession(null);
                                        }}
                                        className="rounded-lg border border-white/10 bg-[#1F2937] px-3 py-2 text-sm text-white"
                                    >
                                        <option value="">Select a session to view report</option>
                                        {filteredSessionOptions.map(session => (
                                            <option key={session._id} value={session._id}>
                                                {session.title} · {new Date(session.date).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {reportSessionLoading ? (
                                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <div
                                                key={`session-skeleton-${index}`}
                                                className="h-24 rounded-xl border border-white/10 bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : reportSession ? (
                                    <div className="mt-6 space-y-6">
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                            {[
                                                { label: 'Present', value: reportSession.presentCount, badge: 'bg-emerald-500/15 text-emerald-200' },
                                                { label: 'Absent', value: reportSession.absentCount, badge: 'bg-red-500/15 text-red-200' },
                                                { label: 'Attendance %', value: `${reportSession.attendancePercent}%`, badge: 'bg-blue-500/15 text-blue-200' },
                                                { label: 'QR vs Manual', value: `${reportSession.qrCount} / ${reportSession.manualCount}`, badge: 'bg-amber-500/15 text-amber-200' }
                                            ].map(card => (
                                                <div key={card.label} className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                                    <p className="text-sm text-[#9CA3AF]">{card.label}</p>
                                                    <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
                                                    <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${card.badge}`}>
                                                        {card.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-[#0B1220] p-4">
                                            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                                                <span>Present {reportSession.attendancePercent}%</span>
                                                <span>Absent {100 - reportSession.attendancePercent}%</span>
                                            </div>
                                            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[#1F2937]">
                                                <div
                                                    className="h-full bg-emerald-500"
                                                    style={{ width: `${reportSession.attendancePercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-white/10 bg-[#0B1220]">
                                            <div className="grid grid-cols-[40px_1fr_1fr_100px_140px] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase text-[#4B5563]">
                                                <span>#</span>
                                                <span>Name</span>
                                                <span>Email</span>
                                                <span>Method</span>
                                                <span>Time</span>
                                            </div>
                                            <div className="max-h-72 overflow-y-auto">
                                                {reportSession.attendance.length ? (
                                                    reportSession.attendance.map((record, index) => (
                                                        <div
                                                            key={`${record.email}-${record.markedAt}-${index}`}
                                                            className={`grid grid-cols-[40px_1fr_1fr_100px_140px] gap-3 px-4 py-3 text-sm ${index % 2 === 0 ? 'bg-[#0F172A]' : ''}`}
                                                        >
                                                            <span className="text-[#9CA3AF]">{index + 1}</span>
                                                            <span className="text-white">{record.name || 'Unknown'}</span>
                                                            <span className="text-[#9CA3AF]">{record.email}</span>
                                                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${record.method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                                {record.method}
                                                            </span>
                                                            <span className="text-[#9CA3AF]">
                                                                {record.markedAt ? new Date(record.markedAt).toLocaleString() : '--'}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-sm text-[#9CA3AF]">No attendance recorded</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleExportReportCsv}
                                                className="inline-flex items-center gap-2 rounded-lg bg-[#10B981] px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:brightness-110"
                                            >
                                                <Download size={14} />
                                                Export CSV
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-6 rounded-xl border border-dashed border-white/20 py-10 text-center text-sm text-[#6B7280]">
                                        Select a session to view report details.
                                    </div>
                                )}

                                {reportSessionError && (
                                    <p className="mt-4 text-sm text-red-200">{reportSessionError}</p>
                                )}
                            </div>
                        </section>
                    )
                }
            </main >

            <AnimatePresence>
                {qrModalOpen && qrModalSession && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
                        >
                            <button
                                onClick={handleCloseQr}
                                className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-[#9CA3AF] hover:text-white"
                            >
                                <X size={16} />
                            </button>
                            <h3 className="text-lg font-semibold text-white">{qrModalSession.title}</h3>
                            <p className="mt-1 text-xs text-[#9CA3AF]">Refreshes in {qrModalSecondsLeft}s</p>
                            <div className="mt-4 flex flex-col items-center">
                                {qrModalError && <p className="mb-3 text-sm text-red-200">{qrModalError}</p>}
                                {qrModalCode ? (
                                    <img src={qrModalCode} alt="Session QR" className="h-64 w-64" />
                                ) : (
                                    <div className="h-64 w-64 rounded-xl bg-gradient-to-r from-[#0D1117] via-[#111827] to-[#0D1117] animate-pulse" />
                                )}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={async () => {
                                        if (!qrModalScanUrl) return;
                                        try {
                                            await navigator.clipboard.writeText(qrModalScanUrl);
                                            setQrModalCopySuccess(true);
                                            pushToast('success', 'QR link copied.');
                                            setTimeout(() => setQrModalCopySuccess(false), 2000);
                                        } catch (copyError) {
                                            const textArea = document.createElement('textarea');
                                            textArea.value = qrModalScanUrl;
                                            document.body.appendChild(textArea);
                                            textArea.select();
                                            document.execCommand('copy');
                                            document.body.removeChild(textArea);
                                            setQrModalCopySuccess(true);
                                            setTimeout(() => setQrModalCopySuccess(false), 2000);
                                        }
                                    }}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    {qrModalCopySuccess ? '✅ Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {detailSession && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-6"
                        >
                            <button
                                onClick={handleCloseDetails}
                                className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-[#9CA3AF] hover:text-white"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-semibold text-white">{detailSession.title}</h3>
                                <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${statusStyles[detailSession.status]}`}>
                                    {detailSession.status}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-3 text-xs text-[#9CA3AF] md:grid-cols-3">
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">Date</p>
                                    <p className="mt-1 text-sm text-white">{new Date(detailSession.date).toLocaleDateString()}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">Venue</p>
                                    <p className="mt-1 text-sm text-white">{detailSession.venue}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">Type</p>
                                    <p className="mt-1 text-sm text-white">{detailSession.type}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 text-xs text-[#9CA3AF] md:grid-cols-3">
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">Total Present</p>
                                    <p className="mt-1 text-sm text-white">{detailAttendance.length}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">QR Scans</p>
                                    <p className="mt-1 text-sm text-white">{detailAttendance.filter(item => item.method === 'QR').length}</p>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-[#0B1220] p-3">
                                    <p className="text-[10px] uppercase">Manual Marks</p>
                                    <p className="mt-1 text-sm text-white">{detailAttendance.filter(item => item.method === 'MANUAL').length}</p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl border border-white/10 bg-[#0B1220]">
                                <div className="grid grid-cols-[40px_1fr_1fr_100px_120px] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase text-[#4B5563]">
                                    <span>#</span>
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Method</span>
                                    <span>Time</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {detailLoading ? (
                                        <div className="p-4 text-sm text-[#9CA3AF]">Loading attendance...</div>
                                    ) : detailError ? (
                                        <div className="p-4 text-sm text-red-200">{detailError}</div>
                                    ) : detailAttendance.length ? (
                                        detailAttendance.map((record, index) => (
                                            <div
                                                key={record._id}
                                                className={`grid grid-cols-[40px_1fr_1fr_100px_120px] gap-3 px-4 py-3 text-sm ${index % 2 === 0 ? 'bg-[#0F172A]' : ''}`}
                                            >
                                                <span className="text-[#9CA3AF]">{index + 1}</span>
                                                <span className="text-white">{record.name || 'Unknown'}</span>
                                                <span className="text-[#9CA3AF]">{record.email}</span>
                                                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${record.method === 'QR' ? 'bg-blue-500/15 text-blue-200' : 'bg-amber-500/15 text-amber-200'}`}>
                                                    {record.method}
                                                </span>
                                                <span className="text-[#9CA3AF]">
                                                    {record.markedAt ? new Date(record.markedAt).toLocaleTimeString() : '--'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-[#9CA3AF]">No attendance yet.</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleStatusUpdate(detailSession._id, 'ACTIVE')}
                                    className="rounded-lg border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10 disabled:opacity-60"
                                    disabled={actionLoadingId === detailSession._id || detailSession.status === 'ACTIVE'}
                                >
                                    Activate
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(detailSession._id, 'CLOSED')}
                                    className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:opacity-60"
                                    disabled={actionLoadingId === detailSession._id || detailSession.status === 'CLOSED'}
                                >
                                    Close Session
                                </button>
                                <button
                                    onClick={handleExportCsv}
                                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                                >
                                    <Download size={14} />
                                    Export CSV
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminPage;
