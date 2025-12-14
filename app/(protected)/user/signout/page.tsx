import LogoutForm from "@/app/components/logout-form";

export default function SignOutPage() {
    return (
        <section className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="w-full max-w-lg">
                <LogoutForm />
            </div>
        </section>
    );
}
