'use client';

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export default function Protected({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const isVerifyRoute = pathname?.startsWith("/user/verify");
    const router = useRouter();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user && !isVerifyRoute) {
            router.replace(`/user/signin?returnUrl=${encodeURIComponent(pathname ?? "/")}`);
        }
    }, [isVerifyRoute, loading, pathname, router, user]);

    if (loading || (!user && !isVerifyRoute)) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-gray-500 text-sm">
                Sprawdzanie autoryzacji...
            </div>
        );
    }

    return <>{children}</>;
}
