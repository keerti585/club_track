import React from 'react';
import { Check } from 'lucide-react';

const highlights = [
    'Create sessions easily',
    'Activate & close attendance',
    'Monitor live check-ins',
    'Prevent duplicate entries'
];

const AdminSection = () => {
    return (
        <section className="relative bg-[#000000] py-24 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_#0F172A80,_transparent_65%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Admin Control</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Built for Admins & Organizers
                        </h2>
                        <p className="mt-4 text-sm text-white/70 sm:text-base">
                            Stay in control with powerful oversight tools. Launch sessions quickly and keep attendance trustworthy.
                        </p>
                        <div className="mt-8 grid gap-4">
                            {highlights.map((item) => (
                                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10">
                                        <Check size={16} className="text-white/80" />
                                    </span>
                                    <span className="text-sm text-white/80 sm:text-base">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#3B82F620] via-transparent to-[#0EA5E920] blur-3xl" />
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/60">Live Dashboard</span>
                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">Active</span>
                            </div>
                            <div className="mt-6 grid gap-4">
                                {[
                                    { label: 'Active Session', value: 'AI Study Jam' },
                                    { label: 'Check-ins', value: '182/220' },
                                    { label: 'Late Arrivals', value: '12' }
                                ].map((row) => (
                                    <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                                        <span className="text-sm text-white/60">{row.label}</span>
                                        <span className="text-sm font-semibold text-white">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-r from-[#3B82F640] via-[#0EA5E920] to-transparent px-4 py-4">
                                <p className="text-sm text-white/80">No duplicates detected. Attendance syncing in real time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminSection;
