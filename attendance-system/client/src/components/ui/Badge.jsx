import React from 'react';

const badgeStyles = {
    blue: 'bg-blue-500/15 text-blue-200 border-blue-500/30',
    green: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    red: 'bg-red-500/15 text-red-200 border-red-500/30',
    amber: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    gray: 'bg-slate-500/15 text-slate-200 border-slate-500/30',
    purple: 'bg-purple-500/15 text-purple-200 border-purple-500/30',
    orange: 'bg-orange-500/15 text-orange-200 border-orange-500/30'
};

const Badge = ({ label, color = 'gray', className = '' }) => {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[color] || badgeStyles.gray} ${className}`}>
            {label}
        </span>
    );
};

export default Badge;
