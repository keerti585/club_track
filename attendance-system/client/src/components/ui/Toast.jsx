import React, { useEffect, useRef } from 'react';

const toastStyles = {
    success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
    error: 'bg-red-500/15 text-red-200 border-red-500/30',
    info: 'bg-blue-500/15 text-blue-200 border-blue-500/30'
};

const Toast = ({ toasts = [], onDismiss }) => {
    const timersRef = useRef(new Map());

    useEffect(() => {
        const activeIds = new Set(toasts.map(toast => toast.id));

        timersRef.current.forEach((timeoutId, id) => {
            if (!activeIds.has(id)) {
                clearTimeout(timeoutId);
                timersRef.current.delete(id);
            }
        });

        toasts.forEach(toast => {
            if (timersRef.current.has(toast.id)) return;
            const timeoutId = setTimeout(() => {
                if (onDismiss) onDismiss(toast.id);
                timersRef.current.delete(toast.id);
            }, 3000);
            timersRef.current.set(toast.id, timeoutId);
        });

        return () => {
            timersRef.current.forEach(timeoutId => clearTimeout(timeoutId));
            timersRef.current.clear();
        };
    }, [toasts, onDismiss]);

    if (!toasts.length) return null;

    return (
        <div className="pointer-events-none fixed right-6 top-6 z-[60] flex w-80 flex-col gap-3">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur [@keyframes_toastIn{0%{opacity:0;transform:translateX(16px)}100%{opacity:1;transform:translateX(0)}}] [animation:toastIn_0.25s_ease-out] ${toastStyles[toast.type] || toastStyles.info}`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default Toast;
