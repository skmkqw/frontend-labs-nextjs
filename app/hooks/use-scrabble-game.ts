'use client';

import { DragEvent, useEffect, useMemo, useState } from "react";
import {
	GameState,
	PendingPlacement,
	createInitialGameState,
	evaluateMove,
	exchangeRackTiles,
	getNextPlayerId,
	refillRack,
	removeTilesFromRack,
	returnTilesToBag,
} from "../lib/scrabble";
import {
	applyRackAdjustments,
	canRackFormAnyWord,
	coordinateKey,
	determineWinner,
} from "../lib/scrabble-game";
import { getDictionaryWords, isWordValid } from "../lib/dictionary";
import { toast } from "sonner";

export const useScrabbleGame = () => {
	const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
	const [pendingPlacements, setPendingPlacements] = useState<PendingPlacement[]>([]);
	const [selectedExchangeTiles, setSelectedExchangeTiles] = useState<string[]>([]);
	const [customWords, setCustomWords] = useState<string[]>([]);
	const [autoSwapKey, setAutoSwapKey] = useState<string | null>(null);

	const dictionaryWords = useMemo(() => getDictionaryWords(), []);

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

	const handleExchangeTiles = () => {
		if (gameState.isGameOver || !currentPlayer) {
			return;
		}
		if (!selectedExchangeTiles.length) {
			toast.error("Zaznacz litery, które chcesz wymienić.");
			return;
		}
		if (gameState.bag.length < selectedExchangeTiles.length) {
			toast.error("W worku jest zbyt mało płytek, aby dokonać wymiany.");
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
			const { rack, bag: bagAfterExchange } = exchangeRackTiles(
				player.rack,
				previous.bag,
				selectedExchangeTiles,
			);

			const updatedPlayers = [...previous.players];
			updatedPlayers[playerIndex] = {
				...player,
				rack,
			};

			return {
				...previous,
				players: updatedPlayers,
				bag: bagAfterExchange,
				currentPlayerId: getNextPlayerId(previous),
				turn: previous.turn + 1,
				consecutivePasses: 0,
				lastMove: previous.lastMove
					? { ...previous.lastMove, canBeChallenged: false }
					: previous.lastMove,
			};
		});

		setSelectedExchangeTiles([]);
		setPendingPlacements([]);
		toast.info("Wybrane litery zostały wymienione.");
	};

	const handleChallengeLastMove = () => {
		if (!gameState.lastMove || !gameState.lastMove.canBeChallenged) {
			toast.error("Brak ruchu do zakwestionowania.");
			return;
		}

		const invalidWords =
			gameState.lastMove.words.filter((word) => !isWordValid(word)) ?? [];

		if (invalidWords.length === 0) {
			setGameState((previous) => ({
				...previous,
				currentPlayerId: getNextPlayerId(previous),
				turn: previous.turn + 1,
				lastMove: previous.lastMove
					? { ...previous.lastMove, canBeChallenged: false, status: "upheld" }
					: previous.lastMove,
			}));
			toast.info("Słowa są poprawne. Kwestionujący traci kolejkę.");
			setPendingPlacements([]);
			return;
		}

		setGameState((previous) => {
			if (!previous.lastMove) {
				return previous;
			}
			const targetMoveId = previous.lastMove.moveId;
			const placements = previous.placements.filter(
				(placement) => placement.moveId !== targetMoveId,
			);

			const playerIndex = previous.players.findIndex(
				(player) => player.id === previous.lastMove?.playerId,
			);
			if (playerIndex === -1) {
				return previous;
			}

			const player = previous.players[playerIndex];
			const drawnTileIds = previous.lastMove.drawnTiles.map((tile) => tile.id);
			const rackWithoutDrawn = player.rack.filter(
				(tile) => !drawnTileIds.includes(tile.id),
			);
			const bagWithReturns = returnTilesToBag(previous.bag, previous.lastMove.drawnTiles);
			const restoredRack = [...rackWithoutDrawn, ...previous.lastMove.playedTiles];

			const updatedPlayers = [...previous.players];
			updatedPlayers[playerIndex] = {
				...player,
				rack: restoredRack,
				score: Math.max(0, player.score - previous.lastMove.score),
			};

			return {
				...previous,
				players: updatedPlayers,
				placements,
				bag: bagWithReturns,
				turn: Math.max(1, previous.turn - 1),
				lastMove: null,
			};
		});

		toast.info(
			`Kwestionowanie przyjęte. Usunięto słowa: ${invalidWords.join(", ")}.`,
		);
		setPendingPlacements([]);
	};

	const handleResetGame = () => {
		setGameState(createInitialGameState());
		setPendingPlacements([]);
		setSelectedExchangeTiles([]);
		setCustomWords([]);
		toast.info("Rozpoczęto nową partię.");
		toast.error(null);
		setAutoSwapKey(null);
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

	/* eslint-disable react-hooks/set-state-in-effect */
	useEffect(() => {
		if (!currentPlayer || !currentPlayer.rack.length) {
			return;
		}
		const key = `${currentPlayer.id}-${gameState.turn}`;
		if (autoSwapKey === key) {
			return;
		}

		const canFormWord = canRackFormAnyWord(currentPlayer.rack, dictionaryWords);
		if (canFormWord) {
			return;
		}

		if (!gameState.bag.length) {
			toast.info("Brak możliwych słów i worek jest pusty.");
			setAutoSwapKey(key);
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
			const tileIds = player.rack.map((tile) => tile.id);
			const { rack, bag: bagAfterExchange } = exchangeRackTiles(
				player.rack,
				previous.bag,
				tileIds,
			);

			const updatedPlayers = [...previous.players];
			updatedPlayers[playerIndex] = {
				...player,
				rack,
			};

			return {
				...previous,
				players: updatedPlayers,
				bag: bagAfterExchange,
			};
		});

		toast.info("Brak możliwych słów – przydzielono nowy zestaw liter.");
		setAutoSwapKey(key);
	}, [
		currentPlayer,
		gameState.turn,
		gameState.bag.length,
		dictionaryWords,
		autoSwapKey,
	]);

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
		handleExchangeTiles,
		handleChallengeLastMove,
		handleResetGame,
		toggleExchangeSelection,
		handleTileDragStart,
		addCustomWord,
	};
};
