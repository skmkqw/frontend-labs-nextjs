'use client';

import React, { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from "../lib/auth-context";

export default function Protected({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!user) {
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, []);

    return (
        <>
            {children}
        </>
    );
}