'use client';

import { DragEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	GameState,
	PendingPlacement,
	createInitialGameState,
	evaluateMove,
	getNextPlayerId,
	refillRack,
	removeTilesFromRack
} from "../lib/scrabble";
import {
	applyRackAdjustments,
	coordinateKey,
	determineWinner,
} from "../lib/scrabble-game";

export const useScrabbleGame = () => {
	const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
	const [pendingPlacements, setPendingPlacements] = useState<PendingPlacement[]>([]);
	const [selectedExchangeTiles, setSelectedExchangeTiles] = useState<string[]>([]);
	const [customWords, setCustomWords] = useState<string[]>([]);

	const currentPlayer = useMemo(
		() => gameState.players.find((player) => player.id === gameState.currentPlayerId),
		[gameState.players, gameState.currentPlayerId],
	);

	const highlightedMoveKeys = useMemo(() => {
		if (!gameState.lastMove?.placements?.length) {
			return undefined;
		}
		return new Set(
			gameState.lastMove.placements.map((placement) =>
				coordinateKey(placement.row, placement.col),
			),
		);
	}, [gameState.lastMove]);

	const extraValidWords = useMemo(
		() => customWords.map((word) => word.toUpperCase()),
		[customWords],
	);

	const handleDropTile = (tileId: string, coordinates: { row: number; col: number }) => {
		if (!currentPlayer || gameState.isGameOver) {
			return;
		}

		const key = coordinateKey(coordinates.row, coordinates.col);
		const occupied = gameState.placements.some((placement) =>
			coordinateKey(placement.row, placement.col) === key,
		);
		if (occupied) {
			toast.error("To pole jest już zajęte.");
			return;
		}

		const sourceTile =
			currentPlayer.rack.find((tile) => tile.id === tileId) ??
			pendingPlacements.find((tile) => tile.tileId === tileId);
		if (!sourceTile) {
			return;
		}

		setPendingPlacements((previous) => {
			const withoutTile = previous.filter(
				(placement) => placement.tileId !== tileId && coordinateKey(placement.row, placement.col) !== key,
			);
			return [
				...withoutTile,
				{
					tileId,
					row: coordinates.row,
					col: coordinates.col,
					letter: sourceTile.letter,
					value: sourceTile.value,
				},
			];
		});
	};

	const handleRemovePending = (tileId: string) => {
		setPendingPlacements((previous) =>
			previous.filter((placement) => placement.tileId !== tileId),
		);
	};

	const handleClearPending = () => {
		setPendingPlacements([]);
		toast.info("Bieżące litery zostały cofnięte na stojak.");
	};

	const handleCommitMove = () => {
		if (gameState.isGameOver || !currentPlayer) {
			return;
		}
		if (!pendingPlacements.length) {
			toast.error("Najpierw przeciągnij litery na planszę.");
			return;
		}

		const evaluation = evaluateMove(
			pendingPlacements,
			gameState.placements,
			{ extraValidWords },
		);

		if (!evaluation.valid) {
			toast.error(evaluation.error ?? "Ruch jest niepoprawny.");
			toast.error(evaluation.error ?? "Ruch jest niepoprawny.");
			return;
		}

		setGameState((previous) => {
			const playerIndex = previous.players.findIndex(
				(player) => player.id === previous.currentPlayerId,
			);
			if (playerIndex === -1) {
				return previous;
			}

			const player = previous.players[playerIndex];
			const usedTileIds = pendingPlacements.map((placement) => placement.tileId);
			const { remainingRack, removedTiles } = removeTilesFromRack(player.rack, usedTileIds);
			const { rack, bag: bagAfterDraw, drawnTiles } = refillRack(
				remainingRack,
				previous.bag,
			);

			const placementsToAdd = pendingPlacements.map((placement) => ({
				row: placement.row,
				col: placement.col,
				letter: placement.letter,
				playerId: player.id,
				moveId: previous.turn,
			}));

			const updatedPlayers = [...previous.players];
			updatedPlayers[playerIndex] = {
				...player,
				score: player.score + (evaluation.totalScore ?? 0),
				rack,
			};

			const updatedPlacements = [...previous.placements, ...placementsToAdd];
			const nextPlayerId = getNextPlayerId(previous);
			const rackIsEmpty = rack.length === 0;
			const bagIsEmpty = bagAfterDraw.length === 0;

			let finalPlayers = updatedPlayers;
			let isGameOver = previous.isGameOver;
			let winnerId = previous.winnerId;

			if (!isGameOver && bagIsEmpty && rackIsEmpty) {
				finalPlayers = applyRackAdjustments(updatedPlayers, player.id);
				isGameOver = true;
				winnerId = determineWinner(finalPlayers);
			}

			const lastMove = {
				playerId: player.id,
				moveId: previous.turn,
				words: evaluation.words ?? [],
				score: evaluation.totalScore ?? 0,
				placements: placementsToAdd,
				playedTiles: removedTiles,
				drawnTiles,
				canBeChallenged: true,
				status: "pending" as const,
			};

			return {
				...previous,
				players: finalPlayers,
				placements: updatedPlacements,
				bag: bagAfterDraw,
				currentPlayerId: isGameOver ? previous.currentPlayerId : nextPlayerId,
				turn: previous.turn + 1,
				consecutivePasses: 0,
				isGameOver,
				winnerId,
				lastMove: isGameOver ? null : lastMove,
			};
		});

		setPendingPlacements([]);
		setSelectedExchangeTiles([]);
		toast.info(
			`Słowa zaakceptowane: ${(evaluation.words ?? []).join(", ")} (+${evaluation.totalScore ?? 0} pkt)`,
		);
	};

	const handlePassTurn = () => {
		if (gameState.isGameOver) {
			return;
		}

		setGameState((previous) => {
			const nextPasses = previous.consecutivePasses + 1;
			let players = previous.players;
			let isGameOver = previous.isGameOver;
			let winnerId = previous.winnerId;

			if (!isGameOver && nextPasses >= previous.players.length * 2) {
				players = applyRackAdjustments(previous.players);
				isGameOver = true;
				winnerId = determineWinner(players);
			}

			return {
				...previous,
				players,
				currentPlayerId: getNextPlayerId(previous),
				consecutivePasses: isGameOver ? previous.consecutivePasses : nextPasses,
				turn: previous.turn + 1,
				isGameOver,
				winnerId,
				lastMove: previous.lastMove
					? { ...previous.lastMove, canBeChallenged: false }
					: previous.lastMove,
			};
		});

		setPendingPlacements([]);
		toast.info("Gracz pasuje – kolej przechodzi dalej.");
	};

	const handleResetGame = () => {
		setGameState(createInitialGameState());
		setPendingPlacements([]);
		setSelectedExchangeTiles([]);
		setCustomWords([]);
		toast.info("Rozpoczęto nową partię.");
	};

	const toggleExchangeSelection = (tileId: string) => {
		setSelectedExchangeTiles((previous) =>
			previous.includes(tileId)
				? previous.filter((id) => id !== tileId)
				: [...previous, tileId],
		);
	};

	const handleTileDragStart = (tileId: string) => (event: DragEvent<HTMLButtonElement>) => {
		event.dataTransfer.setData("text/plain", tileId);
		event.dataTransfer.effectAllowed = "move";
	};

	const addCustomWord = (word: string) => {
		setCustomWords((previous) =>
			previous.includes(word) ? previous : [...previous, word],
		);
	};

	return {
		gameState,
		currentPlayer,
		pendingPlacements,
		selectedExchangeTiles,
		customWords,
		highlightedMoveKeys,
		handleDropTile,
		handleRemovePending,
		handleClearPending,
		handleCommitMove,
		handlePassTurn,
		handleResetGame,
		toggleExchangeSelection,
		handleTileDragStart,
		addCustomWord,
	};
};
