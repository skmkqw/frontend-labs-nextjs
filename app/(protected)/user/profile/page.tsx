"use client";

import { useEffect, useMemo, useState } from "react";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import Button from "@/app/components/button";
import { useAuth } from "@/app/lib/auth-context";

type ProfileFormValues = {
    displayName: string;
    email: string;
    photoURL: string;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState<ProfileFormValues>({
        displayName: user?.displayName ?? "",
        email: user?.email ?? "",
        photoURL: user?.photoURL ?? "",
    });
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormValues({
            displayName: user?.displayName ?? "",
            email: user?.email ?? "",
            photoURL: user?.photoURL ?? "",
        });
    }, [user]);

    if (!user) {
        return (
            <section className="flex min-h-[50vh] items-center justify-center text-gray-500">
                Brak danych użytkownika.
            </section>
        );
    }

    const avatarSrc = useMemo(
        () => formValues.photoURL || user.photoURL || "",
        [formValues.photoURL, user.photoURL],
    );

    const handleChange = (field: keyof ProfileFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        updateProfile(user, {
            displayName: formValues.displayName,
            photoURL: formValues.photoURL,
        })
            .then(() => {
                toast.success("Profile updated");
            })
            .catch((updateError) => {
                setError(updateError.message);
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <section className="max-w-3xl space-y-8">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Profil użytkownika</h1>
                <p className="text-sm text-gray-500">Zaktualizuj swoje dane kontaktowe i zdjęcie profilowe.</p>
            </header>
            <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row">
                <div className="flex flex-col items-center text-center md:w-1/3">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={formValues.displayName || user.email || "Avatar"}
                            className="h-32 w-32 rounded-full object-cover shadow"
                        />
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 text-3xl font-semibold text-indigo-700">
                            {(formValues.displayName || user.email || "Użytkownik").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="mt-4">
                        <p className="text-lg font-semibold text-gray-900">
                            {formValues.displayName || "Brak nazwy"}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                <div className="flex-1 space-y-3 text-sm">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Nazwa wyświetlana</p>
                        <p className="text-base font-medium text-gray-900">
                            {formValues.displayName || "Nie ustawiono"}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Adres e-mail</p>
                        <p className="text-base font-medium text-gray-900 break-all">{user.email}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Zdjęcie profilowe</p>
                        <p className="text-base font-medium text-gray-900 break-all">
                            {formValues.photoURL || "Brak adresu zdjęcia"}
                        </p>
                    </div>
                </div>
            </div>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            <form className="space-y-5" onSubmit={onSubmit}>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="profile-display-name">
                        Nazwa wyświetlana
                    </label>
                    <input
                        id="profile-display-name"
                        type="text"
                        value={formValues.displayName}
                        onChange={handleChange("displayName")}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="profile-email">
                        Adres e-mail
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        value={formValues.email}
                        disabled
                        className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="profile-photo">
                        Adres zdjęcia profilowego
                    </label>
                    <input
                        id="profile-photo"
                        type="url"
                        value={formValues.photoURL}
                        onChange={handleChange("photoURL")}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
            </form>
        </section>
    );
}
