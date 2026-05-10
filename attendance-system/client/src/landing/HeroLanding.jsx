import React from 'react';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

const Stat = ({ label }) => (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm text-[#D1D5DB]">
        <CheckSquare className="h-4 w-4 text-[#60A5FA]" />
        <span>{label}</span>
    </div>
);

const HeroLanding = ({ onLaunch }) => {
    return (
        <div className="absolute left-6 bottom-10 max-w-xl sm:left-8 md:left-12 lg:left-16 z-30">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#93C5FD]">AI-Powered Attendance Tracking</div>

                <h1 className="mt-4 max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl">Smart Attendance for Modern Campuses</h1>

                <p className="mt-4 max-w-lg text-sm text-[#9CA3AF]">Track attendance in real-time using secure QR authentication, live analytics, and intelligent attendance monitoring.</p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={onLaunch} className="rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(59,130,246,0.18)]">Launch Dashboard</button>
                    <button className="rounded-full border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/90">Watch Demo</button>
                </div>

                <div className="mt-6 flex gap-3">
                    <Stat label="10K+ Scans" />
                    <Stat label="99.9% Accuracy" />
                    <Stat label="Real-time Monitoring" />
                </div>
            </motion.div>
        </div>
    );
};

export default HeroLanding;
