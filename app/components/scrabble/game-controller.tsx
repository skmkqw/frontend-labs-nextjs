export default function GameController({ bagCount, dictionarySize, turn, handleResetGame }: { bagCount: number, dictionarySize: number, turn: number, handleResetGame: () => void }) {
    return (
        <div className="flex max-w-full flex-col gap-8">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-widest text-amber-500">
                            Scrabble
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold">Kontroler partii</h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleResetGame}
                        className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
                    >
                        Rozpocznij nową grę
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-500">
                    <span>Tura: {turn}</span>
                    <span aria-hidden>•</span>
                    <span>Pozostałe płytki w worku: {bagCount}</span>
                    <span aria-hidden>•</span>
                    <span>Słownik bazowy: {dictionarySize} słów</span>
                </div>
            </div>
        </div>
    );
}