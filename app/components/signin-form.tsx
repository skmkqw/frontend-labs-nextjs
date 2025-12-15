"use client";

type SignInFormValues = {
    email: string;
    password: string;
};

import {
    browserSessionPersistence,
    getAuth,
    sendEmailVerification,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignInForm() {
    const auth = getAuth();
    const params = useSearchParams();
    const router = useRouter();
    const returnUrl = params.get("returnUrl");
    const redirectTo = returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<SignInFormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (formValues: SignInFormValues) => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, formValues.email, formValues.password);

            if (!userCredential.user.emailVerified) {
                try {
                    await sendEmailVerification(userCredential.user);
                    toast.info("Adres e-mail wymaga potwierdzenia", {
                        description: "Wysłaliśmy ponownie wiadomość weryfikacyjną.",
                    });
                } catch (resendError: unknown) {
                    const message =
                        resendError instanceof Error
                            ? resendError.message
                            : "Nie udało się wysłać ponownie wiadomości weryfikacyjnej.";
                    toast.error(message);
                }
                await signOut(auth);
                router.replace("/user/verify");
                return;
            }

            toast.success("Zalogowano pomyślnie");
            router.push(redirectTo);
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Nie udało się przetworzyć logowania.";
            toast.error("Nie udało się zalogować", {
                description: message,
            });
        }
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