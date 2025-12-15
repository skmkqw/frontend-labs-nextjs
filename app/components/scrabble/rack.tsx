'use client';

import { PendingPlacement, RackTile } from "@/app/lib/scrabble";
import clsx from "clsx";
import { DragEvent } from "react";

type RackProps = {
	ownerName?: string;
	rack: RackTile[] | undefined;
	pendingPlacements: PendingPlacement[];
	selectedTiles: string[];
	isGameOver: boolean;
	onTileDragStart: (tileId: string) => (event: DragEvent<HTMLButtonElement>) => void;
	onToggleSelection: (tileId: string) => void;
};

export default function Rack({
	ownerName,
	rack,
	pendingPlacements,
	selectedTiles,
	isGameOver,
	onTileDragStart,
	onToggleSelection,
}: RackProps) {
	return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
			<h3 className="text-lg font-semibold">Stojak {ownerName}</h3>
			<p className="text-sm text-zinc-500">
				Kliknij literę, aby zaznaczyć do wymiany. Przeciągnij, aby ułożyć słowo.
			</p>
			<div className="mt-4 flex flex-wrap gap-3">
				{rack?.map((tile) => {
					const isUsed = pendingPlacements.some(
						(placement) => placement.tileId === tile.id,
					);
					const isSelected = selectedTiles.includes(tile.id);
					return (
						<button
							key={tile.id}
							type="button"
							draggable={!isUsed && !isGameOver}
							onDragStart={onTileDragStart(tile.id)}
							onClick={() => onToggleSelection(tile.id)}
							className={clsx(
								"relative flex h-14 w-12 items-center justify-center rounded-xl border text-xl font-semibold uppercase transition",
								isUsed
									? "border-zinc-200 bg-zinc-100 text-zinc-400"
									: "border-zinc-300 bg-zinc-50 text-zinc-900 hover:border-amber-300",
								isSelected && "border-amber-400 bg-amber-50",
							)}
							disabled={isUsed || isGameOver}
						>
							{tile.letter}
							<span className="absolute bottom-1 right-2 text-xs font-bold text-zinc-500">
								{tile.value}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
