import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const NavItem = ({ children }) => (
    <a className="relative px-3 py-2 text-sm text-white/80 transition-transform transform hover:scale-[1.02] hover:text-white">
        <span className="after:block after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-400 after:to-purple-500 hover:after:w-full after:transition-all" />
        {children}
    </a>
);

const NavbarLanding = () => {
    return (
        <header className="fixed top-6 left-1/2 z-40 w-[92%] -translate-x-1/2 rounded-full border border-white/10 bg-black/30 backdrop-blur-xl px-4 py-2 shadow-[0_8px_30px_rgba(59,130,246,0.06)]">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0F172A] text-[#7DD3FC]">
                        <LayoutGrid size={18} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white">SmartAttend</div>
                        <div className="text-xs text-white/60">Attendance for campuses</div>
                    </div>
                </div>

                <nav className="hidden items-center gap-6 lg:flex">
                    <NavItem>Features</NavItem>
                    <NavItem>Security</NavItem>
                    <NavItem>Dashboard</NavItem>
                    <NavItem>Analytics</NavItem>
                    <NavItem>Pricing</NavItem>
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <Link to="/login" className="rounded-full px-3 py-2 text-sm text-white/80 hover:text-white">Sign In</Link>
                    <Link
                        to="/register"
                        className="rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.12)] hover:brightness-105"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default NavbarLanding;
