'use client';

import { DragEvent } from "react";
import clsx from "clsx";
import {
	BOARD_SIZE,
	Coordinates,
	PendingPlacement,
	PremiumSquare,
	TilePlacement,
	getPremiumAt,
	getLetterValue,
} from "../lib/scrabble";

type ScrabbleBoardProps = {
	placements: TilePlacement[];
	pendingPlacements: PendingPlacement[];
	highlightedMoveKeys?: Set<string>;
	onDropTile: (tileId: string, coordinates: Coordinates) => void;
	onRemovePending: (tileId: string) => void;
};

const columnHeaders = Array.from({ length: BOARD_SIZE }, (_, idx) => idx + 1);
const rowHeaders = Array.from({ length: BOARD_SIZE }, (_, idx) =>
	String.fromCharCode(65 + idx),
);

const premiumLabels: Record<PremiumSquare, string> = {
	DL: "DL",
	TL: "TL",
	DW: "DW",
	TW: "TW",
};

const premiumColors: Record<PremiumSquare, string> = {
	DL: "bg-sky-100 text-sky-600 border-sky-200",
	TL: "bg-indigo-100 text-indigo-600 border-indigo-200",
	DW: "bg-rose-100 text-rose-600 border-rose-200",
	TW: "bg-amber-100 text-amber-600 border-amber-200",
};

const getCellKey = (row: number, col: number) => `${row}-${col}`;

export default function ScrabbleBoard({
	placements,
	pendingPlacements,
	highlightedMoveKeys,
	onDropTile,
	onRemovePending,
}: ScrabbleBoardProps) {
	const placementMap = new Map(
		placements.map((placement) => [getCellKey(placement.row, placement.col), placement]),
	);

	const pendingMap = new Map(
		pendingPlacements.map((placement) => [getCellKey(placement.row, placement.col), placement]),
	);

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop =
		(row: number, col: number) => (event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();
			const payload = event.dataTransfer.getData("text/plain");
			if (!payload) {
				return;
			}
			onDropTile(payload, { row, col });
		};

	const handleDoubleClick = (row: number, col: number) => {
		const key = getCellKey(row, col);
		const pendingTile = pendingMap.get(key);
		if (pendingTile) {
			onRemovePending(pendingTile.tileId);
		}
	};

	return (
		<div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
			<div
				className="grid gap-1"
				style={{
					gridTemplateColumns: `40px repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
				}}
			>
				<div />
				{columnHeaders.map((column) => (
					<div
						key={`col-${column}`}
						className="flex h-8 items-center justify-center text-[10px] font-semibold uppercase text-zinc-400"
					>
						{column}
					</div>
				))}

				{rowHeaders.map((rowLabel, rowIndex) => (
					<div key={`row-${rowLabel}`} className="contents">
						<div className="flex h-8 items-center justify-center text-[10px] font-semibold uppercase text-zinc-400">
							{rowLabel}
						</div>
						{columnHeaders.map((column, colIndex) => {
							const key = getCellKey(rowIndex, colIndex);
							const pendingTile = pendingMap.get(key);
							const existingTile = placementMap.get(key);
							const tileLetter = pendingTile?.letter ?? existingTile?.letter;
							const tileValue =
								pendingTile?.value ??
								(existingTile ? getLetterValue(existingTile.letter) : undefined);
							const premium = getPremiumAt(rowIndex, colIndex);
							const isPending = Boolean(pendingTile);
							const isHighlighted = highlightedMoveKeys?.has(key);

							return (
								<div
									key={key}
									draggable={false}
									onDragOver={handleDragOver}
									onDrop={handleDrop(rowIndex, colIndex)}
									onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
									className={clsx(
										"relative flex aspect-square items-center justify-center rounded-md border text-lg font-semibold uppercase transition",
										tileLetter
											? "bg-white text-zinc-900"
											: premium
												? premiumColors[premium]
												: "border-zinc-200 bg-zinc-50 text-zinc-300",
										isPending && "border-amber-400 ring-2 ring-amber-300",
										!tileLetter && premium && "border-transparent",
										isHighlighted && "ring-2 ring-sky-400",
									)}
								>
									{premium && !tileLetter && (
										<span className="text-[10px] font-bold uppercase text-current">
											{premiumLabels[premium]}
										</span>
									)}
									{tileLetter && (
										<span className="pointer-events-none select-none">
											{tileLetter}
											{typeof tileValue === "number" && (
												<span className="absolute bottom-1 right-1 text-[10px] font-semibold text-zinc-500">
													{tileValue}
												</span>
											)}
										</span>
									)}
									{!tileLetter && !premium && (
										<span className="text-[8px] text-transparent">.</span>
									)}
									{premium === "DW" && !tileLetter && rowIndex === 7 && colIndex === 7 && (
										<span className="absolute inset-0 flex items-center justify-center text-xs text-rose-500">
											★
										</span>
									)}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
