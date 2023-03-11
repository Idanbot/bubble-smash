import { Dispatch, SetStateAction, useState } from 'react';
import { BubbleType } from '../types/BubbleType';
import {
    selectNeighbors,
    popSelection,
    handleGridStep,
    removeSelection,
} from '../game/gameLogic';
import { Phases } from '../types/Phases';

function useBubbleClick() {
    const [emptyColumns, setEmptyColumns] = useState<boolean[]>(
        Array.from({ length: 10 }, () => false)
    );

    const handler = (
        row: number,
        col: number,
        gamePhase: Phases,
        setGamePhase: Dispatch<SetStateAction<Phases>>,
        score: number,
        setScore: Dispatch<SetStateAction<number>>,
        bubbles: BubbleType[][],
        setBubbles: Dispatch<SetStateAction<BubbleType[][]>>
    ) => {
        if (gamePhase === Phases.Game) {
            const gameState = selectNeighbors(row, col, bubbles);
            if (gameState.groupSize <= 1) {
                return;
            }

            setBubbles(gameState.bubbleGrid);
            setGamePhase(Phases.Selected);
        }

        if (gamePhase === Phases.Selected) {
            if (bubbles[row][col].selected) {
                const gameState = popSelection(bubbles);
                handleGridStep(
                    gameState.bubbleGrid,
                    emptyColumns,
                    setEmptyColumns,
                    gameState.groupSize,
                    setBubbles,
                    score,
                    setScore,
                    setGamePhase
                );
                return;
            }
            setBubbles(removeSelection(bubbles));
            setGamePhase(Phases.Game);
        }
    };

    return handler;
}

export default useBubbleClick;
