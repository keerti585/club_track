import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import VideoBackground from '../landing/VideoBackground';
import { LayoutGrid, Menu, CheckCircle2, QrCode, CalendarPlus, CheckCircle, RefreshCw, ShieldCheck, Users, BarChart3, Smartphone, Lock, Sun, Moon } from 'lucide-react';

// Landing page — single file implementation with injected CSS and fonts
const Navbar = ({ onOpenMobile, theme, onLogin, onRegister }) => {
    const navVariants = { hidden: { y: -100, opacity: 0 }, enter: { y: 0, opacity: 1 } };
    const { toggleTheme } = useTheme();
    return (
        <motion.header variants={navVariants} initial="hidden" animate="enter" transition={{ duration: 0.6 }} className="fixed inset-x-6 top-6 z-50">
            <div
                className="mx-auto flex h-16 items-center justify-between gap-6 rounded-full px-4 py-2 backdrop-blur-xl border"
                style={{
                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(2,8,23,0.8)',
                    borderColor: theme === 'light' ? '#D0D7E3' : 'rgba(255,255,255,0.06)'
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg border text-[#60A5FA]"
                        style={{
                            backgroundColor: theme === 'light' ? 'rgba(59,130,246,0.1)' : '#071029',
                            borderColor: theme === 'light' ? '#D0D7E3' : 'rgba(59,130,246,0.08)'
                        }}
                    >
                        <LayoutGrid size={18} />
                    </div>
                    <div>
                        <div
                            className="text-lg font-semibold"
                            style={{
                                fontFamily: 'Space Grotesk, sans-serif',
                                color: theme === 'light' ? '#1A2744' : '#FFFFFF'
                            }}
                        >
                            SmartAttend
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    <a onClick={onLogin} style={{ color: theme === 'light' ? '#1A2744' : '#9CA3AF' }} className="text-sm font-medium hover:opacity-75 transition cursor-pointer">Sign In</a>
                    <a onClick={onRegister} className="rounded-full bg-[#3B82F6] px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:brightness-105 transition">Get Started →</a>
                </div>

                <button onClick={onOpenMobile} style={{ color: theme === 'light' ? '#1A2744' : '#9CA3AF' }} className="lg:hidden">
                    <Menu />
                </button>
            </div>
        </motion.header>
    );
};

const Hero = ({ onLaunch, onSeeHow, theme }) => {
    const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
    const item = (delay = 0) => ({ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, delay } } });

    return (
        <section className="relative z-20 min-h-screen flex items-center justify-center py-24">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(11,22,47,0.45)_0%,_transparent_45%)] pointer-events-none" />

            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative mx-auto max-w-4xl text-center px-6">
                <motion.div variants={item(0)} className="inline-flex items-center justify-center rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase" style={{ color: theme === 'light' ? '#1A2744' : '#93C5FD' }}>
                    <span className="mr-2 block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Now Live · BEC Developer&apos;s Club
                </motion.div>

                <motion.h1 variants={item(0.1)} className="mt-6 text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.02, color: theme === 'light' ? '#1A2744' : '#FFFFFF' }}>
                    <div>Track Attendance</div>
                    <div>Like Never</div>
                    <div className="mt-1 bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] animate-gradient">Before.</div>
                </motion.h1>

                <motion.p variants={item(0.2)} className="mt-6 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: theme === 'light' ? '#5B7AB5' : '#94A3B8' }}>
                    QR-based attendance for college clubs. Rotating tokens, manual fallback, live dashboard — built for real sessions.
                </motion.p>

                <motion.div variants={item(0.3)} className="mt-8 flex justify-center gap-4">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onLaunch} className="rounded-full bg-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.4)]">Launch Dashboard →</motion.button>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onSeeHow} className="rounded-full px-8 py-4 text-base font-semibold" style={{ border: `2px solid ${theme === 'light' ? '#1A2744' : 'rgba(255,255,255,0.2)'}`, backgroundColor: 'transparent', color: theme === 'light' ? '#1A2744' : '#FFFFFF' }}>See How It Works</motion.button>
                </motion.div>

                <motion.div variants={item(0.4)} className="mt-8 flex justify-center gap-6">
                    {["QR Auto-Refresh Every 10 Min", "Manual Attendance Fallback", "Live Admin Dashboard"].map((t, i) => (
                        <div key={t} className="flex items-center gap-3 text-sm" style={{ color: theme === 'light' ? '#5B7AB5' : '#64748B' }}>
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span>{t}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

const FloatingMockup = () => {
    return (
        <motion.section initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="relative z-20 -mt-12 px-6">
            <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[#0D1117] to-[#020817] shadow-[0_0_80px_rgba(59,130,246,0.15),0_40px_80px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] px-6 py-3 bg-[#0D1117]">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-slate-500">localhost:5173/admin</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2"><Lock className="h-4 w-4 text-slate-400" /> Secure</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6">
                        <div className="text-lg font-semibold text-white">Admin Control Room</div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-[#0F1720] p-3 text-xs">
                                <div className="font-semibold">6 Sessions</div>
                                <div className="text-slate-400">Active & upcoming</div>
                            </div>
                            <div className="rounded-lg bg-[#0F1720] p-3 text-xs">
                                <div className="font-semibold">24 Present</div>
                                <div className="text-slate-400">Live now</div>
                            </div>
                            <div className="rounded-lg bg-[#0F1720] p-3 text-xs">
                                <div className="font-semibold">3 Absent</div>
                                <div className="text-slate-400">Marked</div>
                            </div>
                            <div className="rounded-lg bg-[#0F1720] p-3 text-xs">
                                <div className="font-semibold">88% Rate</div>
                                <div className="text-slate-400">Average</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-l border-[rgba(255,255,255,0.06)]">
                        <div className="text-sm font-semibold text-teal-300">Dynamic QR Gate</div>
                        <div className="mt-4 grid grid-cols-8 gap-1 w-max">
                            {Array.from({ length: 64 }).map((_, i) => (
                                <div key={i} className={`h-3 w-3 ${i % 5 === 0 ? 'bg-neutral-900' : 'bg-white'}`}></div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-slate-400">Refreshes in 8:42</div>
                        <div className="mt-2 text-xs text-green-400">Active · Git and Github Session</div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

const FeatureCard = ({ Icon, title, desc, color = 'bg-blue-500/10' }) => (
    <motion.div whileInView={{ y: 0, opacity: 1 }} initial={{ y: 16, opacity: 0 }} viewport={{ once: true }} className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D1117] p-6 hover:shadow-[0_0_20px_rgba(59,130,246,0.06)] transition">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white/90" />
        </div>
        <div className="mt-4 text-white font-semibold">{title}</div>
        <div className="mt-2 text-sm text-slate-400">{desc}</div>
    </motion.div>
);

const Features = () => (
    <section id="features" className="py-24 bg-[#020817]">
        <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="text-xs tracking-widest text-blue-400 uppercase">FEATURES</div>
            <h2 className="mt-4 text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Everything your club needs</h2>
            <p className="mt-2 text-slate-400 max-w-2xl mx-auto">A complete attendance tool built for college clubs and campus organizations — secure, reliable, and realtime.</p>

            <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard Icon={QrCode} title="Instant QR Generation" desc="Create a session, activate it, QR appears immediately." color="bg-blue-500/10" />
                <FeatureCard Icon={RefreshCw} title="Auto-Rotating Tokens" desc="QR refreshes every 10 minutes. Screenshots are useless." color="bg-teal-400/10" />
                <FeatureCard Icon={ShieldCheck} title="Anti-Proxy Protection" desc="Each token works only once. No sharing loopholes." color="bg-emerald-400/10" />
                <FeatureCard Icon={Users} title="Member Management" desc="Add members, track history, manage roles easily." color="bg-violet-400/10" />
                <FeatureCard Icon={BarChart3} title="Live Reports" desc="Real-time attendance with CSV export." color="bg-amber-400/10" />
                <FeatureCard Icon={Smartphone} title="Manual Fallback" desc="Camera broken? Mark attendance manually in one click." color="bg-blue-500/10" />
            </div>
        </div>
    </section>
);

const HowItWorks = () => {
    const steps = [
        { num: '01', title: 'Admin Creates a Session', desc: 'Set title, venue, date and type. Takes 30 seconds.', Icon: CalendarPlus },
        { num: '02', title: 'Members Scan the QR', desc: 'QR displayed on projector. Members scan with phone camera.', Icon: QrCode },
        { num: '03', title: 'Attendance Recorded Instantly', desc: 'Live feed updates in real time. Export CSV anytime.', Icon: CheckCircle }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-[#020817]">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <div className="text-xs tracking-widest text-blue-400 uppercase">How it Works</div>
                    <h3 className="mt-4 text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Up and running in minutes</h3>
                </div>

                <div className="mt-12 space-y-10">
                    {steps.map((s, i) => (
                        <motion.div key={s.num} initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-center md:gap-8">
                            <div className="md:w-36 flex items-center md:justify-center">
                                <div className="text-7xl font-bold text-[rgba(59,130,246,0.12)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.num}</div>
                            </div>
                            <div className="md:flex-1">
                                <div className="text-2xl font-semibold text-white">{s.title}</div>
                                <div className="mt-2 text-slate-400">{s.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = ({ onRegister, onLogin }) => (
    <section className="py-24">
        <motion.div whileInView={{ scale: 1, opacity: 1 }} initial={{ scale: 0.95, opacity: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl rounded-3xl p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 0 60px rgba(59,130,246,0.1)' }}>
            <h3 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Ready to go paperless?</h3>
            <p className="text-slate-400 mb-8">Set up your first session in under 2 minutes.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onRegister} className="rounded-full bg-[#3B82F6] px-8 py-4 font-semibold text-white hover:brightness-105">Get Started Free →</button>
                <button onClick={onLogin} className="rounded-full border border-white/20 px-8 py-4 text-white">Sign In</button>
            </div>
        </motion.div>
    </section>
);

const Footer = ({ onLogin, onRegister }) => (
    <footer className="border-t border-[rgba(255,255,255,0.05)] py-12">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded bg-[#071029] text-[#60A5FA]"><LayoutGrid /></div>
                    <div>
                        <div className="font-semibold">SmartAttend</div>
                        <div className="text-sm text-slate-500">Smart Attendance System for Developer's Club</div>
                    </div>
                </div>
                <div className="text-sm text-slate-500">Built at BEC · 2026</div>
            </div>

            <div>
                <div className="text-xs text-slate-400 uppercase mb-3">Navigation</div>
                <div className="flex flex-col gap-2">
                    <a href="#" className="text-sm text-slate-500 hover:text-white">Home</a>
                    <a href="#features" className="text-sm text-slate-500 hover:text-white">Features</a>
                    <a href="#how-it-works" className="text-sm text-slate-500 hover:text-white">How it Works</a>
                </div>
            </div>

            <div>
                <div className="text-xs text-slate-400 uppercase mb-3">Account</div>
                <div className="flex flex-col gap-2">
                    <a onClick={onLogin} className="text-sm text-slate-500 hover:text-white cursor-pointer">Sign In</a>
                    <a onClick={onRegister} className="text-sm text-slate-500 hover:text-white cursor-pointer">Register</a>
                </div>
            </div>
        </div>
        <div className="mt-8 border-t border-[rgba(255,255,255,0.04)] pt-8 text-center text-slate-600 text-xs">© 2026 SmartAttend · BEC Developer&apos;s Club</div>
    </footer>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const howRef = useRef(null);

    useEffect(() => {
        // inject fonts if not present
        const id = 'smartattend-fonts';
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap";
            document.head.appendChild(link);
        }
    }, []);

    const handleLaunch = () => navigate('/login');
    const handleRegister = () => navigate('/register');
    const handleSeeHow = () => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const openMobile = () => {
        // minimal mobile fallback: navigate to register
        navigate('/register');
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }} className="relative min-h-screen overflow-x-hidden">
            {/* Inject page-local CSS for gradient and grid overlay */}
            <style>{`
                @keyframes gradient-shift { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
                .animate-gradient { animation: gradient-shift 3s ease infinite; background-size:200% 200%; }
                .dot-grid { background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px); background-size:32px 32px; }
                .gradient-text { background: linear-gradient(135deg,#3B82F6,#8B5CF6,#06B6D4); -webkit-background-clip: text; background-clip: text; color: transparent; background-size:200% 200%; animation: gradient-shift 3s ease infinite; }
            `}</style>

            <VideoBackground />

            <div className="absolute inset-0 dot-grid opacity-5 pointer-events-none" />

            <Navbar onOpenMobile={openMobile} theme={theme} onLogin={handleLaunch} onRegister={handleRegister} />

            <main>
                <Hero onLaunch={handleLaunch} onSeeHow={handleSeeHow} theme={theme} />

                <FloatingMockup />

                <Features />

                <div ref={howRef}><HowItWorks /></div>

                <CTA onRegister={handleRegister} onLogin={handleLaunch} />

                <Footer onLogin={handleLaunch} onRegister={handleRegister} />
            </main>
        </div>
    );
};

export default LandingPage;
