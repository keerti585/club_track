import React from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Admin', href: '#admin' },
    { label: 'Contact', href: '#contact' }
];

const Navbar = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70">
                        <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                    <span className="text-lg font-semibold text-white">SmartAttend</span>
                </div>
                <nav className="hidden items-center gap-6 rounded-full border border-white/10 px-6 py-2 text-sm lg:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="cursor-pointer text-white/70 transition hover:text-white"
                        >
                            {item.label}
                        </a>
                    ))}
                    <span className="flex items-center gap-2 text-white/70">
                        Contact <ArrowRight size={14} />
                    </span>
                </nav>
                <div className="hidden items-center gap-3 lg:flex">
                    <Link
                        to="/login"
                        className="rounded-full border border-white/30 px-4 py-2 text-sm text-white/80 transition hover:text-white"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-full bg-[#5ed29c] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                    >
                        Start Session
                    </Link>
                </div>
                <button className="text-white/80 transition hover:text-white lg:hidden" type="button">
                    <Menu size={20} />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
