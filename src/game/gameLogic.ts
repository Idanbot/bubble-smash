import { Dispatch, SetStateAction } from 'react';
import { Phases } from '../types/Phases';
import { GameState, GridState } from '../types/GameState';
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import {
    BubbleType,
    Color,
    createBubble,
    getRandomColor,
} from '../types/BubbleType';

export function selectNeighbors(
    r: number,
    c: number,
    bubbles: BubbleType[][]
): GameState {
    const targetColor = bubbles[r][c].color;
    const newBubbles = bubbles;
    let groupSize = 1;

    function checkNeighbors(row: number, col: number) {
        if (
            bubbles[row][col] === undefined ||
            bubbles[row][col].isPopped ||
            bubbles[row][col].color !== targetColor
        ) {
            return;
        }

        // Check bubble to the left
        if (
            col > 0 &&
            bubbles[row][col - 1].color === targetColor &&
            !bubbles[row][col - 1].selected &&
            !bubbles[row][col - 1].isPopped
        ) {
            newBubbles[row][col - 1].selected = true;
            groupSize++;
            checkNeighbors(row, col - 1);
        }

        // Check bubble to the right
        if (
            col < bubbles[row].length - 1 &&
            bubbles[row][col + 1].color === targetColor &&
            !bubbles[row][col + 1].selected &&
            !bubbles[row][col + 1].isPopped
        ) {
            newBubbles[row][col + 1].selected = true;
            groupSize++;
            checkNeighbors(row, col + 1);
        }

        // Check bubble above
        if (
            row > 0 &&
            bubbles[row - 1][col].color === targetColor &&
            !bubbles[row - 1][col].selected &&
            !bubbles[row - 1][col].isPopped
        ) {
            newBubbles[row - 1][col].selected = true;
            groupSize++;
            checkNeighbors(row - 1, col);
        }

        // Check bubble below
        if (
            row < bubbles.length - 1 &&
            bubbles[row + 1][col].color === targetColor &&
            !bubbles[row + 1][col].selected &&
            !bubbles[row + 1][col].isPopped
        ) {
            newBubbles[row + 1][col].selected = true;
            groupSize++;
            checkNeighbors(row + 1, col);
        }
    }

    checkNeighbors(r, c);

    if (groupSize > 1) {
        newBubbles[r][c].selected = true;
    }
    return { bubbleGrid: newBubbles, groupSize };
}

export function checkGameOver(bubbles: BubbleType[][]): Phases {
    const checkGameOverHelper = (
        row: number,
        col: number,
        targetColor: Color
    ): boolean => {
        if (
            row < 0 ||
            row >= bubbles.length ||
            col < 0 ||
            col >= bubbles[row].length
        ) {
            return false;
        }
        if (
            !bubbles[row][col].isPopped &&
            bubbles[row][col].color === targetColor
        ) {
            return true;
        }
        return false;
    };

    let isGameOver = true;

    for (let i = 0; i < bubbles.length; i++) {
        if (!isGameOver) {
            break;
        }
        for (let j = 0; j < bubbles[i].length; j++) {
            if (
                checkGameOverHelper(i, j - 1, bubbles[i][j].color) ||
                checkGameOverHelper(i, j + 1, bubbles[i][j].color) ||
                checkGameOverHelper(i - 1, j, bubbles[i][j].color) ||
                checkGameOverHelper(i + 1, j, bubbles[i][j].color)
            ) {
                isGameOver = false;
                break;
            }
        }
    }
    return isGameOver ? Phases.GameOver : Phases.Game;
}

export function removeSelection(bubbles: BubbleType[][]): BubbleType[][] {
    return bubbles.map((row) =>
        row.map((bubble) => {
            bubble.selected = false;
            return bubble;
        })
    );
}

export function popSelection(bubbles: BubbleType[][]): GameState {
    let groupSize = 0;
    return {
        bubbleGrid: bubbles.map((row) =>
            row.map((bubble) => {
                if (bubble.selected) {
                    bubble.isPopped = true;
                    bubble.selected = false;
                    groupSize++;
                }
                return bubble;
            })
        ),
        groupSize,
    };
}

function fixColumn(bubbles: BubbleType[][], colIndex: number): GridState {
    let isColumnEmpty = false;
    const newBubbles = [...bubbles];
    const column = newBubbles.map((row) => row[colIndex]);
    const poppedBubbles = column.filter((bubble) => bubble.isPopped);

    if (poppedBubbles.length === 0) {
        return { bubbleGrid: newBubbles, isColumnEmpty };
    }

    const nonPoppedBubbles = column.filter((bubble) => !bubble.isPopped);
    const shiftedColumn = poppedBubbles.concat(nonPoppedBubbles);

    shiftedColumn.forEach((bubble, rowIndex) => {
        newBubbles[rowIndex][colIndex] = bubble;
    });

    if (nonPoppedBubbles.length === 0) {
        isColumnEmpty = true;
    }

    return { bubbleGrid: newBubbles, isColumnEmpty };
}

function shiftColumns(
    columnIndex: number,
    bubbles: BubbleType[][]
): BubbleType[][] {
    const newBubbles = [...bubbles];
    const column = newBubbles.map((row) => row[columnIndex]);

    for (let i = columnIndex; i >= 0; i--) {
        newBubbles.forEach((row) => {
            row[i] = row[i - 1];

            if (i === 0) {
                row[i] = column[i];
            }
        });
    }

    return newBubbles;
}

export function handleGridStep(
    bubbles: BubbleType[][],
    emptyColumns: boolean[],
    setEmptyColumns: Dispatch<SetStateAction<boolean[]>>,
    popSize: number,
    setBubbles: Dispatch<SetStateAction<BubbleType[][]>>,
    score: number,
    setScore: Dispatch<SetStateAction<number>>,
    setPhase: Dispatch<SetStateAction<Phases>>
): BubbleType[][] {
    const newBubbles = [...bubbles];
    for (let i = 0; i < newBubbles.length; i++) {
        if (fixColumn(newBubbles, i).isColumnEmpty) {
            emptyColumns[i] = true;
            shiftColumns(i, newBubbles);
        }
    }

    setBubbles(newBubbles);
    setEmptyColumns(emptyColumns);
    setScore(score + popSize * (popSize - 1));
    setPhase(checkGameOver(newBubbles));
    return newBubbles;
}

export function newRandomGame() {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, (_, i) => createBubble(i, getRandomColor()))
    );
}

export function newTestGameColumn() {
    const bubs = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, (_, i) => createBubble(i, getRandomColor()))
    );

    for (let i = 0; i < bubs.length; i++) {
        bubs[i][1].color = Color.Blue;
        bubs[i][2].color = Color.Blue;
        bubs[i][3].color = Color.Red;
        bubs[i][4].color = Color.Red;
        bubs[i][5].color = Color.Blue;
        bubs[i][6].color = Color.Blue;
        bubs[i][7].color = Color.Yellow;
        bubs[i][8].color = Color.Yellow;
    }

    return bubs;
}
