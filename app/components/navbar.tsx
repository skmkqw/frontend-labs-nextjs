"use client";

import { ReactNode, useMemo, useState } from "react";
import Button from "./button";
import { useAuth } from "../lib/auth-context";

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
        label: "Artykuły",
        href: "/user/articles",
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
                    d="M19.5 14.25v-9a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h8.689c.597 0 1.171-.237 1.593-.659l3.998-3.998a2.25 2.25 0 00.659-1.593z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5h7.5M8.25 12h7.5M8.25 16.5h3.75"
                />
            </svg>
        ),
    },
    {
        label: "O projekcie",
        href: "/about",
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
                    d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25s-3.694-8.25-8.25-8.25S3.75 7.444 3.75 12 7.444 20.25 12 20.25z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.75v.008M12 9v6"
                />
            </svg>
        ),
    },
];

export default function Navbar({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading } = useAuth();

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);

    const authLabel = useMemo(() => {
        if (loading) return "Sprawdzanie sesji...";
        if (user?.email) return `Zalogowany jako ${user.email}`;
        return "Nie jesteś zalogowany";
    }, [loading, user]);

    const avatarPlaceholder = useMemo(() => {
        const source = user?.displayName || user?.email || "Użytkownik";
        return source.charAt(0).toUpperCase();
    }, [user]);

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
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 text-sm font-semibold text-gray-600 flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || user.email || "Profil"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                avatarPlaceholder
                            )}
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs uppercase tracking-wide text-gray-400">Stan konta</p>
                            <p className="text-sm font-medium text-gray-800">
                                {authLabel}
                            </p>
                        </div>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Button variant="link" href="/user/profile">
                                Profil
                            </Button>
                            <Button variant="link" href="/user/signout">
                                Wyloguj
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="link" href="/user/register">
                                Rejestracja
                            </Button>
                            <Button variant="link" href="/user/signin">
                                Logowanie
                            </Button>
                        </div>
                    )}
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
