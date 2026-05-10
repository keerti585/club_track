import React from 'react';

const steps = [
    {
        number: '01',
        title: 'Create Session',
        description: 'Admin creates a session and generates QR'
    },
    {
        number: '02',
        title: 'Scan QR',
        description: 'Members scan the QR to mark attendance'
    },
    {
        number: '03',
        title: 'Track Instantly',
        description: 'Admin sees live attendance updates'
    }
];

const HowItWorks = () => {
    return (
        <section className="relative bg-[#000000] py-24 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3B82F620,_transparent_70%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Workflow</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">How It Works</h2>
                    <p className="mt-4 text-sm text-white/70 sm:text-base">
                        A simple three-step flow designed to keep sessions organized and effortless.
                    </p>
                </div>

                <div className="relative mt-12 grid gap-6 md:grid-cols-3">
                    <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/30 to-transparent md:block" />
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                        >
                            <span className="text-xs font-semibold tracking-[0.35em] text-white/50">{step.number}</span>
                            <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                            <p className="mt-3 text-sm text-white/70 sm:text-base">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
