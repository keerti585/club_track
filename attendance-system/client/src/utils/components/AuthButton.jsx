import React from 'react';

const AuthButton = ({ children, disabled, type = 'submit' }) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.25)] transition hover:scale-[1.02] hover:shadow-[0_18px_36px_rgba(139,92,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {children}
        </button>
    );
};

export default AuthButton;
