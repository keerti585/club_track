import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/Badge';

const FloatingCards = () => {
    return (
        <div className="absolute right-6 top-24 z-30 hidden lg:block">
            <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mb-4 w-72 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_rgba(59,130,246,0.06)] backdrop-blur">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Live Attendance</div>
                    <Badge label="LIVE" color="green" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-2xl font-bold">184</p>
                        <p className="text-xs text-[#9CA3AF]">Present</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-[#9CA3AF]">Absent</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">94%</p>
                        <p className="text-xs text-[#9CA3AF]">Rate</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }} className="mb-4 w-64 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(139,92,246,0.04)] backdrop-blur">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">QR Session</div>
                    <Badge label="Active" color="blue" />
                </div>
                <div className="mt-4">
                    <p className="text-sm text-[#9CA3AF]">QR expires in</p>
                    <p className="text-lg font-semibold text-white">00:28</p>
                </div>
            </motion.div>

            <motion.div initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="w-80 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_36px_rgba(6,182,212,0.04)] backdrop-blur">
                <div className="text-sm font-semibold">Activity Feed</div>
                <ul className="mt-3 space-y-2">
                    <li className="flex items-center justify-between rounded-md bg-white/3 px-3 py-2">
                        <div>
                            <p className="text-sm font-semibold">John Doe checked in</p>
                            <p className="text-xs text-[#9CA3AF]">2 mins ago</p>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </li>
                    <li className="flex items-center justify-between rounded-md bg-white/3 px-3 py-2">
                        <div>
                            <p className="text-sm font-semibold">Anna marked present</p>
                            <p className="text-xs text-[#9CA3AF]">5 mins ago</p>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </li>
                </ul>
            </motion.div>
        </div>
    );
};

export default FloatingCards;
