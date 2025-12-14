"use client";

import { ReactNode, useState } from "react";
import Button from "./button";

const navItems = [
    {
        label: "Panel główny",
        href: "/",
        icon: (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21h3a1 1 0 001-1V10l-5-5"
                />
            </svg>
        ),
    },
    {
        label: "Profil",
        href: "/user/profile",
        icon: (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4a4 4 0 110 8 4 4 0 010-8z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                />
            </svg>
        ),
    },
    {
        label: "Ustawienia",
        href: "/settings",
        icon: (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
    },
];

export default function Navbar({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
            {isSidebarOpen && (
                <button
                    aria-label="Zamknij menu"
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={closeSidebar}
                />
            )}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="h-16 px-6 py-5 border-b border-gray-200">
                    <p className="text-lg font-semibold">Frontend Labs</p>
                </div>
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    href={item.href}
                                    onClick={closeSidebar}
                                >
                                    <span className="text-gray-500">{item.icon}</span>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col md:ml-0">
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 h-16">
                    <button
                        aria-label="Otwórz menu"
                        className="md:hidden rounded-lg border border-gray-300 p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div>
                        <p className="hidden md:visible text-lg font-semibold text-gray-800">
                            Witaj
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="link" href="/user/register">
                            Rejestracja
                        </Button>
                        <Button variant="link" href="/user/signin">
                            Logowanie
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
