import { isWordValid } from "./dictionary";

export const BOARD_SIZE = 15;
export const HAND_SIZE = 7;
export const CENTER_COORDINATE = { row: 7, col: 7 };

export type PremiumSquare = "DL" | "TL" | "DW" | "TW";

export type Coordinates = {
	row: number;
	col: number;
};

export type RackTile = {
	id: string;
	letter: string;
	value: number;
};

export type Player = {
	id: string;
	name: string;
	color: string;
	score: number;
	rack: RackTile[];
};

export type TilePlacement = Coordinates & {
	letter: string;
	playerId: string;
	moveId: number;
};

export type GameState = {
	players: Player[];
	placements: TilePlacement[];
	bag: string[];
	currentPlayerId: string;
	turn: number;
	consecutivePasses: number;
	isGameOver: boolean;
	winnerId?: string;
	lastMove?: LastMoveSummary | null;
};

export type PendingPlacement = Coordinates & {
	tileId: string;
	letter: string;
	value: number;
};

export type MoveDirection = "horizontal" | "vertical";

export type MoveEvaluationOptions = {
	extraValidWords?: string[];
};

export type MoveEvaluationResult = {
	valid: boolean;
	error?: string;
	words?: string[];
	totalScore?: number;
};

export type LastMoveSummary = {
	playerId: string;
	moveId: number;
	words: string[];
	score: number;
	placements: TilePlacement[];
	playedTiles: RackTile[];
	drawnTiles: RackTile[];
	canBeChallenged: boolean;
	status: "pending" | "overturned" | "upheld";
};

export const LETTER_DISTRIBUTION: Array<{
	letter: string;
	count: number;
	value: number;
}> = [
		{ letter: "A", count: 9, value: 1 },
		{ letter: "B", count: 2, value: 3 },
		{ letter: "C", count: 2, value: 3 },
		{ letter: "D", count: 4, value: 2 },
		{ letter: "E", count: 12, value: 1 },
		{ letter: "F", count: 2, value: 4 },
		{ letter: "G", count: 3, value: 2 },
		{ letter: "H", count: 2, value: 4 },
		{ letter: "I", count: 9, value: 1 },
		{ letter: "J", count: 1, value: 8 },
		{ letter: "K", count: 1, value: 5 },
		{ letter: "L", count: 4, value: 1 },
		{ letter: "M", count: 2, value: 3 },
		{ letter: "N", count: 6, value: 1 },
		{ letter: "O", count: 8, value: 1 },
		{ letter: "P", count: 2, value: 3 },
		{ letter: "Q", count: 1, value: 10 },
		{ letter: "R", count: 6, value: 1 },
		{ letter: "S", count: 4, value: 1 },
		{ letter: "T", count: 6, value: 1 },
		{ letter: "U", count: 4, value: 1 },
		{ letter: "V", count: 2, value: 4 },
		{ letter: "W", count: 2, value: 4 },
		{ letter: "X", count: 1, value: 8 },
		{ letter: "Y", count: 2, value: 4 },
		{ letter: "Z", count: 1, value: 10 },
	];

const PREMIUM_LAYOUT = [
	"T..d...T...d..T",
	".D...t...t...D.",
	"..D...d.d...D..",
	"d..D...d...D..d",
	"....D.....D....",
	".t...t...t...t.",
	"..d...d.d...d..",
	"T..d...D...d..T",
	"..d...d.d...d..",
	".t...t...t...t.",
	"....D.....D....",
	"d..D...d...D..d",
	"..D...d.d...D..",
	".D...t...t...D.",
	"T..d...T...d..T",
];

const PREMIUM_MAP = new Map<string, PremiumSquare>();

PREMIUM_LAYOUT.forEach((rowPattern, row) => {
	[...rowPattern].forEach((cell, col) => {
		if (cell === "T") {
			PREMIUM_MAP.set(`${row}-${col}`, "TW");
		} else if (cell === "D") {
			PREMIUM_MAP.set(`${row}-${col}`, "DW");
		} else if (cell === "t") {
			PREMIUM_MAP.set(`${row}-${col}`, "TL");
		} else if (cell === "d") {
			PREMIUM_MAP.set(`${row}-${col}`, "DL");
		}
	});
});

let tileSeed = 0;

export const generateTileId = () => {
	tileSeed += 1;
	return `tile-${Date.now().toString(36)}-${tileSeed.toString(36)}`;
};

export const getLetterValue = (letter: string) => {
	const distribution = LETTER_DISTRIBUTION.find(
		(entry) => entry.letter === letter.toUpperCase(),
	);
	return distribution?.value ?? 1;
};

export const formatCoordinate = ({ row, col }: Coordinates) =>
	`${String.fromCharCode(65 + row)}${col + 1}`;

export const getPremiumAt = (row: number, col: number) =>
	PREMIUM_MAP.get(`${row}-${col}`) ?? null;

export const shuffleArray = <T,>(array: T[]) => {
	const reference = [...array];
	for (let index = reference.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[reference[index], reference[randomIndex]] = [
			reference[randomIndex],
			reference[index],
		];
	}
	return reference;
};

export const createTileBag = () => {
	const tiles: string[] = [];
	LETTER_DISTRIBUTION.forEach((entry) => {
		for (let count = 0; count < entry.count; count += 1) {
			tiles.push(entry.letter);
		}
	});
	return shuffleArray(tiles);
};

export const createRackTile = (letter: string): RackTile => ({
	id: generateTileId(),
	letter,
	value: getLetterValue(letter),
});

export const drawTiles = (bag: string[], amount: number) => {
	const updatedBag = [...bag];
	const letters: string[] = [];
	for (let index = 0; index < amount; index += 1) {
		const letter = updatedBag.pop();
		if (!letter) {
			break;
		}
		letters.push(letter);
	}
	return { letters, bag: updatedBag };
};

export const refillRack = (
	rack: RackTile[],
	bag: string[],
	limit = HAND_SIZE,
) => {
	const workingBag = [...bag];
	const updatedRack = [...rack];
	const drawnTiles: RackTile[] = [];
	while (updatedRack.length < limit && workingBag.length) {
		const letter = workingBag.pop();
		if (!letter) {
			break;
		}
		const tile = createRackTile(letter);
		updatedRack.push(tile);
		drawnTiles.push(tile);
	}
	return { rack: updatedRack, bag: workingBag, drawnTiles };
};

export const removeTilesFromRack = (
	rack: RackTile[],
	tileIds: string[],
) => {
	const remainingRack: RackTile[] = [];
	const removedTiles: RackTile[] = [];
	rack.forEach((tile) => {
		if (tileIds.includes(tile.id)) {
			removedTiles.push(tile);
		} else {
			remainingRack.push(tile);
		}
	});
	return { remainingRack, removedTiles };
};

export const returnTilesToBag = (bag: string[], tiles: RackTile[]) =>
	shuffleArray([...bag, ...tiles.map((tile) => tile.letter)]);

export const exchangeRackTiles = (
	rack: RackTile[],
	bag: string[],
	tileIds: string[],
) => {
	const { remainingRack, removedTiles } = removeTilesFromRack(rack, tileIds);
	const bagWithReturns = returnTilesToBag(bag, removedTiles);
	const { rack: refilledRack, bag: updatedBag } = refillRack(
		remainingRack,
		bagWithReturns,
	);
	return {
		rack: refilledRack,
		bag: updatedBag,
		returnedTiles: removedTiles,
	};
};

export const createInitialPlayers = (): Player[] => [
	{
		id: "player-1",
		name: "Gracz 1",
		score: 0,
		color: "#2563eb",
		rack: [],
	},
	{
		id: "player-2",
		name: "Gracz 2",
		score: 0,
		color: "#16a34a",
		rack: [],
	},
];

export const createInitialGameState = (): GameState => {
	let bag = createTileBag();
	const players = createInitialPlayers().map((player) => {
		const { rack, bag: nextBag } = refillRack([], bag);
		bag = nextBag;
		return { ...player, rack };
	});

	return {
		players,
		placements: [],
		bag,
		currentPlayerId: players[0]?.id ?? "player-1",
		turn: 1,
		consecutivePasses: 0,
		isGameOver: false,
		lastMove: null,
	};
};

export const isSameCoordinate = (a: Coordinates, b: Coordinates) =>
	a.row === b.row && a.col === b.col;

export const getNextPlayerId = (state: GameState, startFromId?: string) => {
	const currentId = startFromId ?? state.currentPlayerId;
	const currentIdx = state.players.findIndex(
		(player) => player.id === currentId,
	);
	if (currentIdx === -1) {
		return state.currentPlayerId;
	}
	const nextIdx = (currentIdx + 1) % state.players.length;
	return state.players[nextIdx]?.id ?? state.currentPlayerId;
};

const isWithinBoard = (row: number, col: number) =>
	row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

const buildPlacementMap = (
	placements: TilePlacement[],
): Map<string, TilePlacement> => {
	const map = new Map<string, TilePlacement>();
	placements.forEach((placement) => {
		map.set(`${placement.row}-${placement.col}`, placement);
	});
	return map;
};

const collectWord = (
	startRow: number,
	startCol: number,
	deltaRow: number,
	deltaCol: number,
	placementMap: Map<string, TilePlacement>,
	newTiles: Map<string, PendingPlacement>,
) => {
	const hasTile = (row: number, col: number) =>
		newTiles.has(`${row}-${col}`) ||
		placementMap.has(`${row}-${col}`);

	let row = startRow;
	let col = startCol;

	while (isWithinBoard(row - deltaRow, col - deltaCol) &&
		hasTile(row - deltaRow, col - deltaCol)
	) {
		row -= deltaRow;
		col -= deltaCol;
	}

	const letters: string[] = [];
	let rawScore = 0;
	let wordMultiplier = 1;

	while (isWithinBoard(row, col) && hasTile(row, col)) {
		const key = `${row}-${col}`;
		const pendingTile = newTiles.get(key);
		const boardTile = placementMap.get(key);
		const letter = pendingTile?.letter ?? boardTile?.letter ?? "";
		const baseValue = getLetterValue(letter);
		let letterScore = baseValue;

		if (pendingTile) {
			const premium = getPremiumAt(row, col);
			if (premium === "DL") {
				letterScore *= 2;
			} else if (premium === "TL") {
				letterScore *= 3;
			} else if (premium === "DW") {
				wordMultiplier *= 2;
			} else if (premium === "TW") {
				wordMultiplier *= 3;
			}
		}

		rawScore += letterScore;
		letters.push(letter);

		row += deltaRow;
		col += deltaCol;
	}

	return {
		word: letters.join(""),
		score: rawScore * wordMultiplier,
		lettersCount: letters.length,
	};
};

const hasAdjacentTile = (
	row: number,
	col: number,
	placementMap: Map<string, TilePlacement>,
) => {
	const neighbors: Coordinates[] = [
		{ row: row - 1, col },
		{ row: row + 1, col },
		{ row, col: col - 1 },
		{ row, col: col + 1 },
	];
	return neighbors.some(({ row: r, col: c }) =>
		isWithinBoard(r, c) && placementMap.has(`${r}-${c}`),
	);
};

const isWordPermitted = (
	word: string,
	options?: MoveEvaluationOptions,
) => {
	if (word.length < 2) {
		return false;
	}
	if (isWordValid(word)) {
		return true;
	}
	const extraWords = options?.extraValidWords ?? [];
	return extraWords.includes(word.toUpperCase());
};

export const evaluateMove = (
	moveTiles: PendingPlacement[],
	placements: TilePlacement[],
	options?: MoveEvaluationOptions,
): MoveEvaluationResult => {
	if (!moveTiles.length) {
		return { valid: false, error: "Dodaj litery do ruchu, zanim go zatwierdzisz." };
	}

	const coordinateSet = new Set(moveTiles.map((tile) => `${tile.row}-${tile.col}`));
	if (coordinateSet.size !== moveTiles.length) {
		return { valid: false, error: "Każda płytka w ruchu musi mieć unikalne pole." };
	}

	const placementMap = buildPlacementMap(placements);
	const newTileMap = new Map<string, PendingPlacement>();
	for (const tile of moveTiles) {
		const key = `${tile.row}-${tile.col}`;
		if (placementMap.has(key)) {
			return { valid: false, error: "Wybrane pole jest już zajęte." };
		}
		newTileMap.set(key, tile);
	}

	const rows = new Set(moveTiles.map((tile) => tile.row));
	const cols = new Set(moveTiles.map((tile) => tile.col));
	const isSingleTileMove = moveTiles.length === 1;
	const isHorizontal = rows.size === 1;
	const isVertical = cols.size === 1;

	if (!isSingleTileMove && !isHorizontal && !isVertical) {
		return {
			valid: false,
			error: "W jednym ruchu układamy słowo tylko w jednym wierszu lub kolumnie.",
		};
	}

	const isFirstMove = placements.length === 0;
	const coversCenter = moveTiles.some((tile) =>
		tile.row === CENTER_COORDINATE.row && tile.col === CENTER_COORDINATE.col,
	);

	if (isFirstMove && !coversCenter) {
		return {
			valid: false,
			error: "Pierwsze słowo musi przechodzić przez środkowe pole.",
		};
	}

	if (!isFirstMove) {
		const touchesExisting = moveTiles.some((tile) =>
			hasAdjacentTile(tile.row, tile.col, placementMap),
		);
		if (!touchesExisting) {
			return {
				valid: false,
				error: "Każdy ruch musi łączyć się z istniejącym słowem.",
			};
		}
	}

	if (isHorizontal) {
		const row = moveTiles[0]?.row ?? 0;
		const minCol = Math.min(...moveTiles.map((tile) => tile.col));
		const maxCol = Math.max(...moveTiles.map((tile) => tile.col));
		for (let col = minCol; col <= maxCol; col += 1) {
			const key = `${row}-${col}`;
			if (!newTileMap.has(key) && !placementMap.has(key)) {
				return {
					valid: false,
					error: "Nowe słowo musi być ciągłe – między literami nie może być pustych pól.",
				};
			}
		}
	}

	if (isVertical) {
		const col = moveTiles[0]?.col ?? 0;
		const minRow = Math.min(...moveTiles.map((tile) => tile.row));
		const maxRow = Math.max(...moveTiles.map((tile) => tile.row));
		for (let row = minRow; row <= maxRow; row += 1) {
			const key = `${row}-${col}`;
			if (!newTileMap.has(key) && !placementMap.has(key)) {
				return {
					valid: false,
					error: "Nowe słowo musi być ciągłe – między literami nie może być pustych pól.",
				};
			}
		}
	}

	const words: string[] = [];
	let totalScore = 0;

	if (isHorizontal || isSingleTileMove) {
		const anchor = moveTiles[0]!;
		const horizontalWord = collectWord(
			anchor.row,
			anchor.col,
			0,
			1,
			placementMap,
			newTileMap,
		);
		if (horizontalWord.lettersCount > 1) {
			const word = horizontalWord.word.toUpperCase();
			if (!isWordPermitted(word, options)) {
				return {
					valid: false,
					error: `Słowo "${word}" nie znajduje się w słowniku.`,
				};
			}
			words.push(word);
			totalScore += horizontalWord.score;
		}
	}

	if (isVertical || isSingleTileMove) {
		const anchor = moveTiles[0]!;
		const verticalWord = collectWord(
			anchor.row,
			anchor.col,
			1,
			0,
			placementMap,
			newTileMap,
		);
		if (verticalWord.lettersCount > 1) {
			const word = verticalWord.word.toUpperCase();
			if (!isWordPermitted(word, options)) {
				return {
					valid: false,
					error: `Słowo "${word}" nie znajduje się w słowniku.`,
				};
			}
			words.push(word);
			totalScore += verticalWord.score;
		}
	}

	if (!isSingleTileMove) {
		for (const tile of moveTiles) {
			const perpendicularWord = collectWord(
				tile.row,
				tile.col,
				isHorizontal ? 1 : 0,
				isHorizontal ? 0 : 1,
				placementMap,
				newTileMap,
			);
			if (perpendicularWord.lettersCount > 1) {
				const word = perpendicularWord.word.toUpperCase();
				if (!isWordPermitted(word, options)) {
					return {
						valid: false,
						error: `Słowo "${word}" nie znajduje się w słowniku.`,
					};
				}
				if (!words.includes(word)) {
					words.push(word);
					totalScore += perpendicularWord.score;
				}
			}
		}
	}

	if (!words.length) {
		return {
			valid: false,
			error: "Ruch musi tworzyć przynajmniej jedno poprawne słowo.",
		};
	}

	if (moveTiles.length === HAND_SIZE) {
		totalScore += 50;
	}

	return {
		valid: true,
		words,
		totalScore,
	};
};
