"use client";

import { useEffect, useState } from "react";
import { Timestamp, collection, doc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/app/lib/auth-context";
import { db } from "@/app/lib/firebase";
import { toast } from "sonner";

type Article = {
    id: string;
    title: string;
    content: string;
    date?: Timestamp | string;
};

export default function ArticlesPage() {
    const { user } = useAuth();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const ownerRef = doc(db, "users", user.uid);
                const q = query(collection(db, "articles"), where("user", "==", ownerRef));

                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    toast.info("No matching articles found.");
                    return [];
                }

                const parsed: Article[] = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<Article, "id">),
                }));
                setArticles(parsed);
            } catch (fetchError) {
                console.error(fetchError);
                setError("Nie udało się pobrać artykułów.");
                toast.error("Nie udało się pobrać artykułów.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [user]);

    if (!user) {
        return (
            <section className="flex min-h-[50vh] items-center justify-center text-gray-500">
                Zaloguj się, aby zobaczyć swoje artykuły.
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">Twoje artykuły</h1>
                <p className="text-sm text-gray-500">
                    Lista artykułów przypisanych do użytkownika {user.email}.
                </p>
            </header>
            {isLoading ? (
                <p className="text-sm text-gray-500">Ładowanie danych...</p>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : articles.length === 0 ? (
                <p className="text-sm text-gray-500">Nie dodano jeszcze żadnych artykułów.</p>
            ) : (
                <ul className="space-y-4">
                    {articles.map((article) => {
                        const createdAt =
                            article.date instanceof Timestamp
                                ? article.date.toDate().toLocaleString()
                                : article.date;
                        return (
                            <li key={article.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                <p className="text-xs uppercase tracking-wide text-gray-400">ID: {article.id}</p>
                                <h2 className="text-lg font-semibold text-gray-900">{article.title || "Bez tytułu"}</h2>
                                <p className="text-sm text-gray-600">
                                    {article.content || "Brak krótkiego opisu."}
                                </p>
                                {createdAt && (
                                    <p className="text-xs text-gray-400 mt-2">Utworzono: {createdAt}</p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
