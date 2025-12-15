"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import Button from "@/app/components/button";
import { useAuth } from "@/app/lib/auth-context";
import { db } from "@/app/lib/firebase";

type ProfileFormValues = {
    displayName: string;
    email: string;
    photoURL: string;
    street: string;
    city: string;
    zipCode: string;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddressLoading, setAddressLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm<ProfileFormValues>({
        defaultValues: {
            displayName: user?.displayName ?? "",
            email: user?.email ?? "",
            photoURL: user?.photoURL ?? "",
            street: "",
            city: "",
            zipCode: "",
        },
    });

    useEffect(() => {
        setValue("displayName", user?.displayName ?? "");
        setValue("email", user?.email ?? "");
        setValue("photoURL", user?.photoURL ?? "");
    }, [setValue, user]);

    useEffect(() => {
        const fetchAddress = async () => {
            if (!user) {
                setAddressLoading(false);
                return;
            }
            try {
                const snapshot = await getDoc(doc(db, "users", user.uid));
                const address = snapshot.data()?.address;
                if (address) {
                    setValue("street", address.street ?? "");
                    setValue("city", address.city ?? "");
                    setValue("zipCode", address.zipCode ?? "");
                }
            } catch (fetchError) {
                console.error("Nie udało się pobrać adresu:", fetchError);
            } finally {
                setAddressLoading(false);
            }
        };
        fetchAddress();
    }, [setValue, user]);

    if (!user) {
        return (
            <section className="flex min-h-[50vh] items-center justify-center text-gray-500">
                Brak danych użytkownika.
            </section>
        );
    }

    const watchedValues = watch();
    const avatarSrc = useMemo(
        () => watchedValues.photoURL || user.photoURL || "",
        [watchedValues.photoURL, user.photoURL],
    );

    const onSubmit = async (formValues: ProfileFormValues) => {
        setSubmitting(true);
        setError(null);

        try {
            await updateProfile(user, {
                displayName: formValues.displayName,
                photoURL: formValues.photoURL,
            });

            await setDoc(
                doc(db, "users", user.uid),
                {
                    address: {
                        street: formValues.street,
                        city: formValues.city,
                        zipCode: formValues.zipCode,
                    },
                },
                { merge: true },
            );

            toast.success("Profil został zaktualizowany.");
        } catch (updateError: unknown) {
            const message =
                updateError instanceof Error
                    ? updateError.message
                    : "Brak uprawnień do zapisania danych profilu.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
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
                            alt={watchedValues.displayName || watchedValues.email || "Avatar"}
                            className="h-32 w-32 rounded-full object-cover shadow"
                        />
                    ) : (
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-indigo-100 text-3xl font-semibold text-indigo-700">
                            {(watchedValues.displayName || watchedValues.email || "Użytkownik")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    )}
                    <div className="mt-4">
                        <p className="text-lg font-semibold text-gray-900">
                            {watchedValues.displayName || "Brak nazwy"}
                        </p>
                        <p className="text-sm text-gray-500">{watchedValues.email}</p>
                    </div>
                </div>
                <div className="flex-1 space-y-3 text-sm">
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Nazwa wyświetlana</p>
                        <p className="text-base font-medium text-gray-900">
                            {watchedValues.displayName || "Nie ustawiono"}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Adres e-mail</p>
                        <p className="text-base font-medium text-gray-900 break-all">{watchedValues.email}</p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Zdjęcie profilowe</p>
                        <p className="text-base font-medium text-gray-900 break-all">
                            {watchedValues.photoURL || "Brak adresu zdjęcia"}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-400">Adres do korespondencji</p>
                        <p className="text-base font-medium text-gray-900">
                            {watchedValues.street ? `${watchedValues.street}` : "Brak ulicy"}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {watchedValues.city || "Brak miasta"}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {watchedValues.zipCode || "Brak kodu pocztowego"}
                        </p>
                    </div>
                </div>
            </div>
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="profile-display-name">
                        Nazwa wyświetlana
                    </label>
                    <input
                        id="profile-display-name"
                        type="text"
                        disabled={isAddressLoading}
                        {...register("displayName")}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700" htmlFor="profile-email">
                        Adres e-mail
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        disabled
                        {...register("email")}
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
                        disabled={isAddressLoading}
                        {...register("photoURL")}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70"
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-3">
                        <label className="text-sm font-medium text-gray-700" htmlFor="profile-street">
                            Ulica i numer
                        </label>
                        <input
                            id="profile-street"
                            type="text"
                            disabled={isAddressLoading}
                            {...register("street")}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="profile-city">
                            Miasto
                        </label>
                        <input
                            id="profile-city"
                            type="text"
                            disabled={isAddressLoading}
                            {...register("city")}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700" htmlFor="profile-zip">
                            Kod pocztowy
                        </label>
                        <input
                            id="profile-zip"
                            type="text"
                            disabled={isAddressLoading}
                            {...register("zipCode")}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70"
                        />
                    </div>
                </div>
                <Button type="submit" disabled={isSubmitting || isAddressLoading}>
                    {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
            </form>
        </section>
    );
}
