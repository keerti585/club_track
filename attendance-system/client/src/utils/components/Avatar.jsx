import React from 'react';

const palette = [
    'bg-blue-500/20 text-blue-200',
    'bg-emerald-500/20 text-emerald-200',
    'bg-purple-500/20 text-purple-200',
    'bg-amber-500/20 text-amber-200',
    'bg-rose-500/20 text-rose-200'
];

const sizeMap = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base'
};

const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ').filter(Boolean);
    const initials = parts.length === 1
        ? parts[0].slice(0, 2)
        : `${parts[0][0] || ''}${parts[1][0] || ''}`;
    return initials.toUpperCase();
};

const getColorClass = (name) => {
    if (!name) return palette[0];
    const index = name.trim().toUpperCase().charCodeAt(0) % palette.length;
    return palette[index];
};

const Avatar = ({ name, size = 'md' }) => {
    const initials = getInitials(name);
    const colorClass = getColorClass(name);

    return (
        <div className={`flex items-center justify-center rounded-full font-semibold ${sizeMap[size]} ${colorClass}`}>
            {initials}
        </div>
    );
};

export default Avatar;
