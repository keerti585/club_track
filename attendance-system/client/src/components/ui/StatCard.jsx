import React from 'react';

const accentStyles = {
    blue: 'border-blue-500/60 text-blue-200',
    green: 'border-emerald-500/60 text-emerald-200',
    amber: 'border-amber-500/60 text-amber-200',
    purple: 'border-purple-500/60 text-purple-200'
};

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    return (
        <div className={`rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4 shadow-[inset_0_0_0_1px_#111111] transition-transform duration-200 hover:-translate-y-0.5 ${accentStyles[color] || accentStyles.blue}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6B7280] [font-family:'Space Mono',monospace]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-[#F9FAFB]">{value}</p>
                </div>
                {Icon && (
                    <span className="rounded-full border border-[#2A2A2A] bg-[#111111] p-2">
                        <Icon className="h-5 w-5" />
                    </span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
