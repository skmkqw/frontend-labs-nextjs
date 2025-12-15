"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import Button from "./button";

export default function LogoutForm() {
    const router = useRouter();
    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        try {
            setSubmitting(true);
            await signOut(auth);
            toast.success("Zostałeś wylogowany.");
            router.push("/user/signin");
        } catch (error: unknown) {
            toast.error("Nie udało się wylogować");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
                <p className="text-sm uppercase tracking-wide text-indigo-600">Wylogowanie</p>
                <h1 className="text-2xl font-semibold text-gray-900">Czy na pewno?</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Twoja bieżąca sesja zostanie zakończona. Będziesz musiał ponownie zalogować się, aby kontynuować.
                </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-center">
                <Button variant="link" href="/">
                    Anuluj
                </Button>
                <Button
                    variant="sm"
                    className="bg-red-600 hover:bg-red-800"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Wylogowywanie..." : "Wyloguj się"}
                </Button>
            </div>
        </div>
    );
}
