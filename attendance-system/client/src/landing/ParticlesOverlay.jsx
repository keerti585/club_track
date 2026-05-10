import React from 'react';

const ParticlesOverlay = () => {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#3B82F620,_transparent_25%),radial-gradient(circle_at_bottom_right,_#8B5CF620,_transparent_25%)] mix-blend-overlay opacity-60" />
            <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
                <defs>
                    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
                        <path d="M56 0H0v56" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute left-[-10%] top-[-20%] h-[480px] w-[480px] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] blur-3xl opacity-20 animate-blob" />
            <div className="absolute right-[-8%] bottom-[-16%] h-[360px] w-[360px] rounded-full bg-gradient-to-r from-[#6366F1] to-[#06B6D4] blur-3xl opacity-18 animate-blob animation-delay-2000" />
        </div>
    );
};

export default ParticlesOverlay;
