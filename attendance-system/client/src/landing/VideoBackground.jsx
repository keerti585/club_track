import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { motion } from 'framer-motion';

// Lightweight HLS background video component
const VideoBackground = ({ src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }) => {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls;
        const setup = async () => {
            try {
                if (Hls.isSupported()) {
                    hls = new Hls({ lowLatencyMode: true, maxBufferLength: 30 });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play().catch(() => { });
                        setReady(true);
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                    video.addEventListener('loadedmetadata', () => {
                        video.play().catch(() => { });
                        setReady(true);
                    });
                } else {
                    // fallback: set source element (may not work for HLS)
                    video.src = src;
                    setReady(true);
                }
            } catch (err) {
                // degrade gracefully
                console.warn('HLS setup failed', err);
                setReady(true);
            }
        };

        setup();

        return () => {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        };
    }, [src]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 -z-10 h-screen w-full overflow-hidden"
        >
            <video
                ref={videoRef}
                muted
                playsInline
                loop
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
        </motion.div>
    );
};

export default VideoBackground;
