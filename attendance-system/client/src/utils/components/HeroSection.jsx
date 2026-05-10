import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HeroSection = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        const source =
            'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

        if (Hls.isSupported()) {
            const hls = new Hls({ enableWorker: false });
            hls.loadSource(source);
            hls.attachMedia(video);

            return () => {
                hls.destroy();
            };
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        }

        return undefined;
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden bg-black text-white">
            <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b0a] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />
            <div className="absolute inset-0">
                <span className="absolute left-1/4 top-0 h-full w-px bg-white/10" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
                <span className="absolute left-3/4 top-0 h-full w-px bg-white/10" />
            </div>
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_#5ed29c55,_transparent_70%)] blur-3xl" />

            <div className="relative z-10 min-h-screen">
                <Navbar />

                <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-32 sm:px-6 lg:px-8">
                    <div className="flex w-full flex-col items-start gap-8 text-left">
                        <div className="flex h-[200px] w-[200px] translate-y-[-50px] flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur">
                            <span className="text-sm font-semibold text-white/70">[ 2025 ]</span>
                            <div className="space-y-2">
                                <p className="text-base font-semibold text-white">Built for Developer Clubs</p>
                                <p className="text-sm text-white/70">
                                    QR-based attendance with real-time tracking
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Smart Attendance System</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                                ATTENDANCE, SIMPLIFIED FOR DEVELOPER{' '}
                                <span className="text-[#5ed29c]">CLUBS.</span>
                            </h1>
                            <p className="max-w-2xl text-sm text-white/75 sm:text-base">
                                Scan QR codes, track attendance live, and manage sessions effortlessly.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-3 rounded-full bg-[#5ed29c] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
                                >
                                    Launch Session
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
