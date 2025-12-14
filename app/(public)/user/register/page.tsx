"use client";

import { useForm } from "react-hook-form";

type RegisterFormValues = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
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

    const onSubmit = async (formValues: RegisterFormValues) => {
        console.log("Register form submitted:", formValues);
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <header className="mb-6 text-center">
                    <p className="text-sm uppercase tracking-wide text-indigo-600">
                        Nowe konto
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Zarejestruj się
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Wypełnij pola poniżej, aby utworzyć konto w aplikacji.
                    </p>
                </header>
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
                <p className="mt-4 text-center text-sm text-gray-500">
                    Masz już konto?{" "}
                    <a href="/user/signin" className="font-medium text-indigo-600 hover:underline">
                        Zaloguj się
                    </a>
                </p>
            </div>
        </section>
    );
}
