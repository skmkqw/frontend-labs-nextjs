import { GameState, PremiumSquare, RackTile } from "./scrabble";
import { getDictionaryWords } from "./dictionary";

export const coordinateKey = (row: number, col: number) => `${row}-${col}`;

const rackValue = (rack: RackTile[]) => rack.reduce((sum, tile) => sum + tile.value, 0);

export const determineWinner = (players: GameState["players"]) => {
	if (!players.length) {
		return undefined;
	}
	const sorted = [...players].sort((a, b) => b.score - a.score);
	return sorted[0]?.id;
};

export const applyRackAdjustments = (
	players: GameState["players"],
	finishingPlayerId?: string,
) => {
	const penaltyTotals = players.map((player) => ({
		id: player.id,
		penalty: rackValue(player.rack),
	}));
	const bonus = finishingPlayerId
		? penaltyTotals
			.filter((entry) => entry.id !== finishingPlayerId)
			.reduce((sum, entry) => sum + entry.penalty, 0)
		: 0;

	return players.map((player) => {
		const penalty = penaltyTotals.find((entry) => entry.id === player.id)?.penalty ?? 0;
		if (finishingPlayerId && player.id === finishingPlayerId) {
			return { ...player, score: player.score + bonus };
		}
		return { ...player, score: player.score - penalty };
	});
};

export const premiumLabels: Record<PremiumSquare, string> = {
  DL: "Podwójna litera",
  TL: "Potrójna litera",
  DW: "Podwójne słowo",
  TW: "Potrójne słowo",
};

const defaultDictionary = getDictionaryWords();

const canSpellWord = (rack: RackTile[], word: string) => {
  if (word.length < 2) {
    return false;
  }
  const counts: Record<string, number> = {};
  rack.forEach((tile) => {
    const letter = tile.letter.toUpperCase();
    counts[letter] = (counts[letter] ?? 0) + 1;
  });
  for (const char of word.toUpperCase()) {
    if (!counts[char]) {
      return false;
    }
    counts[char] -= 1;
  }
  return true;
};

export const canRackFormAnyWord = (
  rack: RackTile[],
  dictionary: string[] = defaultDictionary,
) => dictionary.some((word) => canSpellWord(rack, word));
