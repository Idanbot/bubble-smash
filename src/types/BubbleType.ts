export type BubbleType = {
    id: number;
    isPopped: boolean;
    selected: boolean;
    color: Color;
};

export function createBubble(id: number, color: Color): BubbleType {
    return {
        id,
        isPopped: false,
        selected: false,
        color,
    };
}

export enum Color {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Yellow = 'yellow',
    Purple = 'purple',
}

export const colors = Object.values(Color);

export const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};
