import React from 'react';

const AuthInput = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon,
    rightSlot,
    hasError,
    hasSuccess,
}) => {
    const glowClass = hasError
        ? 'ring-2 ring-red-500/40 shadow-[0_0_18px_rgba(239,68,68,0.35)]'
        : hasSuccess
            ? 'ring-2 ring-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.35)]'
            : 'focus-within:ring-2 focus-within:ring-indigo-400/50 focus-within:shadow-[0_0_18px_rgba(59,130,246,0.35)]';

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]"
            >
                {label}
            </label>
            <div className={`flex items-center gap-3 rounded-xl border border-white/10 bg-[#1F2937]/80 px-4 py-3 text-sm text-[#F9FAFB] backdrop-blur transition ${glowClass}`}>
                <span className="text-[#93C5FD]">{icon}</span>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-[#F9FAFB] placeholder:text-[#4B5563] focus:outline-none"
                    required
                />
                {rightSlot}
            </div>
        </div>
    );
};

export default AuthInput;
