"use client";

import SignInForm from "@/app/components/signin-form";
import { Suspense } from "react";


export default function SignInPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center text-sm text-gray-500">Ładowanie formularza...</div>}>
            <SignInForm />
        </Suspense>
    );
}
