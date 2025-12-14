import RegisterForm from "@/app/components/register-form";

export default function RegisterPage() {
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
                <RegisterForm />
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
