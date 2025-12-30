import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderProps } from '../types';

const Header: React.FC<HeaderProps> = ({ title, icon, colorClass, bgClass, backLink = false }) => (
    <div className="layout-container flex w-full flex-col border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex justify-center w-full">
            <div className="flex w-full max-w-[1280px] flex-col">
                <header className="flex items-center justify-between whitespace-nowrap px-4 py-4 md:px-10">
                    <div className="flex items-center gap-3">
                        {backLink ? (
                            <Link to="/" className="mr-2 p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined block">arrow_back</span>
                            </Link>
                        ) : null}
                        <div className={`size-10 flex items-center justify-center rounded-xl ${bgClass} ${colorClass}`}>
                            <span className="material-symbols-outlined text-[24px]">{icon}</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">{title}</h2>
                    </div>
                    {/* Navigation Links */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
                        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">홈</Link>
                        <Link to="/behavior" className="hover:text-slate-900 dark:hover:text-white transition-colors">행특</Link>
                        <Link to="/subject" className="hover:text-slate-900 dark:hover:text-white transition-colors">세특</Link>
                        <Link to="/creative" className="hover:text-slate-900 dark:hover:text-white transition-colors">창체</Link>
                    </nav>
                </header>
            </div>
        </div>
    </div>
);

export default Header;