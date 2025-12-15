'use client';

export default function AboutPage() {
  const features = [
    {
      title: "Uwierzytelnianie",
      description:
        "Rejestracja, logowanie oraz weryfikacja konta (na podstawie Firebase Auth).",
    },
    {
      title: "Artykuły i treści",
      description:
        "Sekcja artykułów (pobieranie z Firestore).",
    },
    {
      title: "Profil użytkownika",
      description:
        "Panel profilu - odświeżanie i wyświetlanie (Firebase).",
    },
    {
      title: "Gra Scrabble",
      description:
        "Lokalny tryb gry Scrabble z planszą 15×15, stojakami, punktacją oraz obsługą podstawiwych zasad.",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-zinc-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500">About</p>
          <h1 className="text-4xl font-semibold">Frontend Labs – projekt semestralny</h1>
          <h2 className="text-2xl font-semibold">Autor - Timofei Korsakov (nr albumu 15180)</h2>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-amber-600">{feature.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
