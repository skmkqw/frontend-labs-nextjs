"use client";

import { useEffect, useMemo, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/app/lib/auth-context";
import Button from "@/app/components/button";

export default function VerifyEmail() {
    const { user } = useAuth();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const displayedEmail = useMemo(
        () => user?.email ?? "twoim adresie e-mail",
        [user],
    );

    useEffect(() => {
        if (!user || isSigningOut) {
            return;
        }
        const auth = getAuth();
        if (!auth.currentUser) {
            return;
        }
        setIsSigningOut(true);
        signOut(auth).catch((error) => {
            toast.error("Wylogowanie po rejestracji nie powiodło się");
            setIsSigningOut(false);
        });
    }, [isSigningOut, user]);

    return (
        <section className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
                <p className="text-sm uppercase tracking-wide text-indigo-600">Wymagana weryfikacja</p>
                <h1 className="mt-2 text-2xl font-semibold text-gray-900">Potwierdź swój adres e-mail</h1>
                <p className="mt-4 text-sm text-gray-600">
                    Email nie został jeszcze potwierdzony. Kliknij link w wiadomości wysłanej na adres {displayedEmail}.
                    Po potwierdzeniu możesz ponownie się zalogować.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center items-center">
                    <Button variant="link" href="/user/signin">
                        Przejdź do logowania
                    </Button>
                </div>
            </div>
        </section>
    );
}
