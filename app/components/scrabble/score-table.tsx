import { GameState } from "@/app/lib/scrabble";
import cn from "@/app/lib/utils";

export default function ScoreTable({ gameState }: { gameState: GameState }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">Tabela wyników</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {gameState.players.map((player) => (
                    <div
                        key={player.id}
                        className={cn(
                            "rounded-xl border px-4 py-3",
                            player.id === gameState.currentPlayerId
                                ? "border-amber-300 bg-amber-50"
                                : "border-zinc-200 bg-zinc-50",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{player.name}</span>
                            <span className="text-lg font-bold">{player.score}</span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-500">
                            Litery na stojaku: {player.rack.length}
                        </p>
                        {gameState.isGameOver && gameState.winnerId === player.id && (
                            <p className="text-xs font-semibold text-emerald-600">Zwycięzca</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}