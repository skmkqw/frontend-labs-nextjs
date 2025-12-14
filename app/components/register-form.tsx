"use client";

import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../lib/auth-context";

type RegisterFormValues = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { user } = useAuth();

    if (user) {
        return null;
    }

    const auth = getAuth();

    const onSubmit = (formValues: RegisterFormValues) => {
        createUserWithEmailAndPassword(auth, formValues.email, formValues.password)
            .then((userCredential) => {
                console.log("User registered!");
                sendEmailVerification(auth.currentUser!)
                    .then(() => {
                        toast.success("Email verification send!");
                        redirect("/user/verify");
                    });

            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                    Imię i nazwisko
                </label>
                <input
                    id="register-name"
                    type="text"
                    placeholder="Jan Kowalski"
                    {...register("fullName")}
                    autoComplete="name"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <div>
                <label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                    Adres e-mail
                </label>
                <input
                    id="register-email"
                    type="email"
                    placeholder="nazwa@domena.com"
                    {...register("email")}
                    autoComplete="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <div>
                <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    Hasło
                </label>
                <input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <div>
                <label htmlFor="register-confirm" className="text-sm font-medium text-gray-700">
                    Potwierdź hasło
                </label>
                <input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting ? "Trwa wysyłanie..." : "Utwórz konto"}
            </button>
        </form>
    );
}