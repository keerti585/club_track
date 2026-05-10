import React from 'react';

const CTASection = () => {
    return (
        <section className="relative bg-[#000000] py-24 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3B82F620,_transparent_60%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Get Started</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Start Managing Attendance Smarter
                </h2>
                <p className="mt-4 text-sm text-white/70 sm:text-base">
                    Launch your next session with seamless QR-based tracking.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <button
                        className="rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                        type="button"
                    >
                        Launch Session
                    </button>
                    <button
                        className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
                        type="button"
                    >
                        Contact Us
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
