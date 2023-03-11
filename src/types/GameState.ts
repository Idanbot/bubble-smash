import { BubbleType } from './BubbleType';

export type GameState = {
    bubbleGrid: BubbleType[][];
    groupSize: number;
};

export type GridState = {
    bubbleGrid: BubbleType[][];
    isColumnEmpty: boolean;
};
