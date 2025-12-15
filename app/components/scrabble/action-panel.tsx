'use client';

import {
	PendingPlacement,
	formatCoordinate,
	getPremiumAt,
} from "@/app/lib/scrabble";
import { premiumLabels } from "@/app/lib/scrabble-game";
import Button from "../button";

type ActionPanelProps = {
	currentPlayerName?: string;
	pendingPlacements: PendingPlacement[];
	isGameOver: boolean;
	canChallenge: boolean;
	onCommitMove: () => void;
	onClearMove: () => void;
	onPassTurn: () => void;
	onRemovePending: (tileId: string) => void;
};

export default function ActionPanel({
	currentPlayerName,
	pendingPlacements,
	isGameOver,
	onCommitMove,
	onClearMove,
	onPassTurn,
	onRemovePending,
}: ActionPanelProps) {
	const hasPending = Boolean(pendingPlacements.length);

	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
			<h3 className="text-lg font-semibold">Panel ruchu</h3>
			<p className="text-sm text-zinc-500">
				Kolej należy do: <strong>{currentPlayerName ?? "—"}</strong>
			</p>
			<div className="mt-4 space-y-3">
				<Button
					variant="lg"
					className="w-full"
					disabled={!hasPending || isGameOver}
					onClick={onCommitMove}
				>
					Zatwierdź ruch
				</Button>

				<Button
					variant="lg"
					className="w-full"
					disabled={!hasPending}
					onClick={onClearMove}
				>
					Wyczyść ruch
				</Button>

				<Button
					variant="lg"
					className="w-full"
					disabled={isGameOver}
					onClick={onPassTurn}
				>
					Pomiń turę
				</Button>
			</div>

			<div className="mt-4 text-sm">
				<p className="font-semibold">Przygotowane litery:</p>
				{hasPending ? (
					<ul className="mt-2 space-y-1">
						{pendingPlacements.map((placement) => (
							<li key={placement.tileId} className="flex items-center justify-between">
								<span>
									{formatCoordinate(placement)} – {placement.letter}
								</span>
								{getPremiumAt(placement.row, placement.col) && (
									<span className="text-xs text-amber-500">
										{premiumLabels[getPremiumAt(placement.row, placement.col)!]}
									</span>
								)}
								<button
									type="button"
									onClick={() => onRemovePending(placement.tileId)}
									className="text-xs font-semibold text-amber-600"
								>
									Usuń
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className="mt-2 text-zinc-500">
						Przeciągnij litery ze stojaka na wybrane pola planszy.
					</p>
				)}
			</div>
		</div>
	);
}
