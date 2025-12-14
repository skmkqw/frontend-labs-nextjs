'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export default function Protected({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) {
            router.replace(`/user/signin?returnUrl=${encodeURIComponent(returnUrl ?? "/")}`);
        }
    }, [loading, returnUrl, router, user]);

    if (loading || !user) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-gray-500 text-sm">
                Sprawdzanie autoryzacji...
            </div>
        );
    }

    return <>{children}</>;
}
