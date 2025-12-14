"use client";

import { useForm } from "react-hook-form";

type SignInFormValues = {
    email: string;
    password: string;
    remember: boolean;
};

export default function SignInPage() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (formValues: SignInFormValues) => {
        console.log("Sign in form submitted:", formValues);
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <header className="mb-6 text-center">
                    <p className="text-sm uppercase tracking-wide text-indigo-600">
                        Witaj ponownie
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Zaloguj się
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Podaj dane konta, aby kontynuować pracę w panelu Frontend Labs.
                    </p>
                </header>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                            Adres e-mail
                        </label>
                        <input
                            id="signin-email"
                            type="email"
                            placeholder="nazwa@domena.com"
                            {...register("email")}
                            autoComplete="email"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                            Hasło
                        </label>
                        <input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            autoComplete="current-password"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:underline">
                            Nie pamiętasz hasła?
                        </a>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Logowanie..." : "Zaloguj się"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                    Nie masz konta?{" "}
                    <a href="/user/register" className="font-medium text-indigo-600 hover:underline">
                        Zarejestruj się
                    </a>
                </p>
            </div>
        </section>
    );
}
