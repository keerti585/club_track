import React, { useState } from 'react';
import { Calendar, CalendarPlus, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Toast from '../components/ui/Toast';

const typeOptions = [
    { value: 'WORKSHOP', label: 'Workshop', icon: '🔧' },
    { value: 'MEETING', label: 'Meeting', icon: '👥' },
    { value: 'HACKATHON', label: 'Hackathon', icon: '⚡' },
    { value: 'GENERAL', label: 'General', icon: '📋' }
];

const CreateSessionPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        venue: '',
        type: 'WORKSHOP',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdSession, setCreatedSession] = useState(null);
    const [toasts, setToasts] = useState([]);

    const pushToast = (type, message) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(prev => [...prev, { id, type, message }]);
    };

    const handleDismissToast = id => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/sessions/create', {
                title: formData.title,
                date: formData.date,
                venue: formData.venue,
                type: formData.type,
                description: formData.description
            });
            setCreatedSession(response.data);
            pushToast('success', 'Session created successfully.');
        } catch (submitError) {
            const message = submitError.response?.data?.error || 'Failed to create session';
            setError(message);
            pushToast('error', message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            date: '',
            venue: '',
            type: 'WORKSHOP',
            description: ''
        });
        setError('');
        setCreatedSession(null);
    };

    return (
        <div className="relative min-h-screen bg-[#080C14] text-[#F9FAFB]">
            <Toast toasts={toasts} onDismiss={handleDismissToast} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.2),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] opacity-20" />

            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-6">
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#9CA3AF] transition hover:text-white"
                >
                    ← Back to Dashboard
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="mt-8 rounded-3xl border border-white/10 bg-[#111827] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
                            <CalendarPlus size={22} />
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold">Create New Session</h1>
                        <p className="mt-2 text-sm text-[#9CA3AF]">Fill in the session details below</p>
                    </div>

                    {createdSession ? (
                        <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200"
                            >
                                <CheckCircle size={28} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="mt-6 text-2xl font-bold text-emerald-100">Session Created Successfully!</h2>
                                <p className="mt-3 text-lg font-semibold text-white">{createdSession.title}</p>
                                <p className="mt-2 text-sm text-emerald-200">The session is ready to go. You can activate it now or later from the dashboard.</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
                            >
                                <button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            await api.patch(`/api/sessions/${createdSession._id}/status`, { status: 'ACTIVE' });
                                            pushToast('success', 'Session is now ACTIVE!');
                                            navigate('/admin');
                                        } catch (err) {
                                            pushToast('error', 'Failed to activate session');
                                        }
                                    }}
                                    className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(16,185,129,0.3)] transition hover:bg-emerald-600 hover:scale-[1.02]"
                                >
                                    Activate Now →
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin')}
                                    className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Activate Later
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            {error && (
                                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Session Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={event => setFormData(prev => ({ ...prev, title: event.target.value }))}
                                        placeholder="e.g. Intro to Web3"
                                        className="w-full rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Date</label>
                                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3">
                                        <Calendar size={16} className="text-[#93C5FD]" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={event => setFormData(prev => ({ ...prev, date: event.target.value }))}
                                            className="w-full bg-transparent text-sm text-white focus:outline-none"
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Venue</label>
                                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3">
                                        <MapPin size={16} className="text-[#93C5FD]" />
                                        <input
                                            type="text"
                                            value={formData.venue}
                                            onChange={event => setFormData(prev => ({ ...prev, venue: event.target.value }))}
                                            placeholder="e.g. Seminar Hall, Lab 2"
                                            className="w-full bg-transparent text-sm text-white placeholder:text-[#4B5563] focus:outline-none"
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Session Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={event => setFormData(prev => ({ ...prev, type: event.target.value }))}
                                            className="w-full appearance-none rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                            disabled={loading}
                                        >
                                            {typeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.icon} {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#4B5563]">▼</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">Description (optional)</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={event => setFormData(prev => ({ ...prev, description: event.target.value }))}
                                    placeholder="What will this session cover?"
                                    className="w-full rounded-xl border border-white/10 bg-[#1F2937] px-4 py-3 text-sm text-white placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/60"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] py-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,130,246,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner /> : null}
                                {loading ? 'Creating...' : 'Create Session →'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CreateSessionPage;
