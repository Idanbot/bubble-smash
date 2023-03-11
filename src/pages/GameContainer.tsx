import { useEffect, useState } from 'react';
import { checkGameOver, newRandomGame } from '../game/gameLogic';
import useBubbleClick from '../hooks/useBubbleClick';
import { BubbleType } from '../types/BubbleType';
import { Phases } from '../types/Phases';
import Bubble from './Bubble';

function GameContainer() {
    const [bubbles, setBubbles] = useState<BubbleType[][]>([]);
    const [gamePhase, setGamePhase] = useState<Phases>(Phases.Start);
    const [score, setScore] = useState<number>(0);

    function newGame(): void {
        setGamePhase(Phases.Game);
        setScore(0);
        setBubbles(newRandomGame());
    }

    useEffect(() => {
        // TODO: fix endgame logic
        let state;
        if (gamePhase !== Phases.Start && gamePhase !== Phases.GameOver) {
            state = checkGameOver(bubbles);
        }
        if (state === Phases.GameOver) {
            setGamePhase(Phases.GameOver);
            // TODO: to add overlay with game over message and button to start new game
            // TODO: maybe add form with name to save score to a leaderboard route
        }
    }, [bubbles, gamePhase]);

    const clickHandler = useBubbleClick();

    return (
        <div className="game-container">
            <div className="GameOver">
                {gamePhase === Phases.GameOver ? <h1>GameOver</h1> : null}
            </div>
            <div className="gameScoreboard">
                <p>Score: {score}</p>
            </div>
            {bubbles.map((row, rowIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="row" key={rowIndex}>
                    {row.map((bubble, colIndex) => (
                        <Bubble
                            key={`${bubble.id}${bubble.selected}`}
                            bubble={bubble}
                            onClick={() =>
                                clickHandler(
                                    rowIndex,
                                    colIndex,
                                    gamePhase,
                                    setGamePhase,
                                    score,
                                    setScore,
                                    bubbles,
                                    setBubbles
                                )
                            }
                        />
                    ))}
                </div>
            ))}
            <div className="newGameBtn">
                <button type="button" onClick={newGame}>
                    New Game
                </button>
            </div>
        </div>
    );
}

export default GameContainer;
