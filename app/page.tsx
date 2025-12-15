'use client';

import ScrabbleBoard from "./components/scrabble-board";
import ActionPanel from "./components/scrabble/action-panel";
import DictionaryForm from "./components/scrabble/dictionary-form";
import GameController from "./components/scrabble/game-controller";
import Rack from "./components/scrabble/rack";
import ScoreTable from "./components/scrabble/score-table";
import { useScrabbleGame } from "./hooks/use-scrabble-game";
import { getDictionarySize } from "./lib/dictionary";

export default function Home() {
	const {
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
	} = useScrabbleGame();

	const bagCount = gameState.bag.length;
	const dictionarySize = getDictionarySize();

	return (
		<main className="min-h-screen bg-white text-zinc-900">
			<div className="flex w-full flex-col gap-8">
				<GameController
					bagCount={bagCount}
					dictionarySize={dictionarySize}
					turn={gameState.turn}
					handleResetGame={handleResetGame}
				/>

				<section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
					<div className="space-y-6">
						<ScoreTable gameState={gameState} />
						<ScrabbleBoard
							placements={gameState.placements}
							pendingPlacements={pendingPlacements}
							highlightedMoveKeys={highlightedMoveKeys}
							onDropTile={handleDropTile}
							onRemovePending={handleRemovePending}
						/>
					</div>

					<aside className="space-y-6">
						<Rack
							ownerName={currentPlayer?.name}
							rack={currentPlayer?.rack}
							pendingPlacements={pendingPlacements}
							selectedTiles={selectedExchangeTiles}
							isGameOver={gameState.isGameOver}
							onTileDragStart={handleTileDragStart}
							onToggleSelection={toggleExchangeSelection}
						/>

						<div className="grid gap-4 md:grid-cols-2">
							<ActionPanel
								currentPlayerName={currentPlayer?.name}
								pendingPlacements={pendingPlacements}
								isGameOver={gameState.isGameOver}
								canChallenge={Boolean(gameState.lastMove?.canBeChallenged)}
								onCommitMove={handleCommitMove}
								onClearMove={handleClearPending}
								onPassTurn={handlePassTurn}
								onRemovePending={handleRemovePending}
							/>

							<DictionaryForm customWords={customWords} onAddWord={addCustomWord} />
						</div>
					</aside>
				</section>
			</div>
		</main>
	);
}
