import React from 'react';
import { Activity, BarChart3, Hand, QrCode } from 'lucide-react';

const features = [
    {
        title: 'QR-Based Check-in',
        description: 'Instant attendance with secure QR scanning',
        icon: QrCode
    },
    {
        title: 'Real-Time Tracking',
        description: 'See who has checked in live during sessions',
        icon: Activity
    },
    {
        title: 'Manual Override',
        description: 'Mark attendance manually when needed',
        icon: Hand
    },
    {
        title: 'Smart Reports',
        description: 'View attendance data with timestamps and insights',
        icon: BarChart3
    }
];

const FeaturesSection = () => {
    return (
        <section className="relative bg-[#000000] py-24 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1F293720,_transparent_65%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Features</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Everything You Need to Manage Attendance
                    </h2>
                    <p className="mt-4 text-sm text-white/70 sm:text-base">
                        Purpose-built tools for clubs, classrooms, and events. Keep it fast, accurate, and effortless.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
                                    <Icon className="text-white/80" size={22} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="mt-3 text-sm text-white/70 sm:text-base">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
