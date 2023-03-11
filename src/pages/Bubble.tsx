import { BubbleType } from '../types/BubbleType';

type Props = {
    bubble: BubbleType;
    onClick: () => void;
};

function Bubble({ bubble, onClick }: Props) {
    return (
        <div
            className={`ball bubble ${bubble.isPopped ? 'popped' : ''} 
            ${bubble.color} ${bubble.selected ? 'selected' : ''}`}
            onClick={onClick}
            aria-hidden="true"
        />
    );
}

export default Bubble;
