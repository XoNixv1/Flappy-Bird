import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { Bird } from "../app/App";
import { Pipe } from "../app/App";

import "./game.css";

export default function Game({
  pipe,
  pipeSpeed,
  openSize,
  initialBird,
  canvasHeight,
  gravity,
  pipeSpawnRate,
  flayingHight,
}: {
  pipe: Pipe;
  initialBird: Bird;
  openSize: number;
  pipeSpeed: number;
  canvasHeight: number;
  gravity: number;
  pipeSpawnRate: number;
  flayingHight: number;
}): JSX.Element {
  //
  const [topPipesPositions, setTopPipesPositions] = useState<Pipe[]>([]);
  const [botPipesPositions, setBotPipesPositions] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState<Bird>(initialBird);
  const [gameOver, setGameOver] = useState(true);
  const mousePressedRef = useRef(false);
  const birdRef = useRef(birdPosition);
  const topPipesRef = useRef<Pipe[]>(topPipesPositions);
  const botPipesRef = useRef<Pipe[]>(topPipesPositions);

  useEffect(() => {
    if (!gameOver) {
      const moveInterval = setInterval(() => {
        gameUpdate();
      }, 1000 / 60);

      const newPipeInterval = setInterval(() => {
        makeNewPipe();
      }, pipeSpawnRate);

      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
        clearInterval(newPipeInterval);
        clearInterval(moveInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  useEffect(() => {
    birdRef.current = birdPosition;
    topPipesRef.current = topPipesPositions;
    botPipesRef.current = botPipesPositions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birdPosition, topPipesPositions]);

  function handleMouseDown() {
    mousePressedRef.current = true;
  }

  function handleMouseUp() {
    mousePressedRef.current = false;
  }

  // new pipe

  function makeNewPipe() {
    let randomY =
      pipe.y - pipe.height / 4 - Math.random() * (pipe.height / 1.5);
    const newTopPipe: Pipe = {
      width: pipe.width,
      height: pipe.height,
      x: pipe.x,
      y: randomY,
      passed: false,
    };

    const newBotPipe: Pipe = {
      ...newTopPipe,
      y: newTopPipe.y + openSize + newTopPipe.height,
    };
    setTopPipesPositions((pipes) => [...pipes, newTopPipe]);
    setBotPipesPositions((pipes) => [...pipes, newBotPipe]);
  }

  // method to update scrin movement

  function gameUpdate() {
    const currentBird = birdRef.current;
    const currentTopPipes = topPipesRef.current;
    const currentBotPipes = botPipesRef.current;
    const currentMousePressed = mousePressedRef.current;

    if (gameOver) return;

    /// if collided ending the game

    const isTopCollided = currentTopPipes.some((currentPipe) =>
      boxCollision(currentBird, currentPipe)
    );
    const isBotCollided = currentBotPipes.some((currentPipe) =>
      boxCollision(currentBird, currentPipe)
    );
    if (isTopCollided || isBotCollided) {
      setGameOver(true);
    }

    /// setting new score
    currentTopPipes.forEach((pipe) => {
      if (pipe.x + pipe.width < currentBird.x && !pipe.passed) {
        setScore((prevScore) => prevScore + 1);
        pipe.passed = true;
      }
    });

    /// Pipe movement
    pipeMovement(setTopPipesPositions, pipeSpeed);
    pipeMovement(setBotPipesPositions, pipeSpeed);

    /// if pressed key flaying to top
    if (currentMousePressed) {
      setBirdPosition((bird) => {
        return bird.y <= 0 ? bird : { ...bird, y: bird.y - flayingHight };
      });
    }

    ///  falling
    const initialY = initialBird.y;
    setBirdPosition((bird) => {
      const updatedBird = { ...bird, y: bird.y + gravity };

      if (updatedBird.y > canvasHeight) {
        setGameOver(true);
        return { ...bird, y: initialY };
      }
      return updatedBird;
    });
  }

  /// reseting the game
  function gameReset() {
    setBirdPosition(initialBird);
    setTopPipesPositions([]);
    setBotPipesPositions([]);
    setScore(0);
  }

  return (
    <>
      <div className="score">score {score}</div>
      <img
        id="bird"
        src="/assets/bird.png"
        alt="bird"
        style={{
          position: "absolute",
          top: `${birdPosition.y}px`,
          left: `${birdPosition.x}px`,
          width: `${birdPosition.width}px`,
          height: `${birdPosition.height}px`,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {gameOver && (
        <div
          className="start-screen"
          onClick={() => {
            gameReset();
            setGameOver(false);
          }}
        >
          Start
        </div>
      )}
      {topPipesPositions.map((currentPipe, i) => (
        <div key={i}>
          <img
            className="TopPipe"
            id={`top-pipe-${i}`}
            src="/assets/topPipe.png"
            alt={`Pipe ${i}`}
            style={{
              position: "absolute",
              top: `${currentPipe.y}px`,
              left: `${currentPipe.x}px`,
              height: `${currentPipe.height}px`,
              width: `${currentPipe.width}px`,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}
      {botPipesPositions.map((currentPipe, i) => (
        <img
          className="BotPipe"
          id={`bot-pipe-${i}`}
          src="/assets/bottomPipe.png"
          alt={`Pipe ${i}`}
          style={{
            position: "absolute",
            top: `${currentPipe.y}px`,
            left: `${currentPipe.x}px`,
            height: `${currentPipe.height}px`,
            width: `${currentPipe.width}px`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function boxCollision(boxA: Pipe | Bird, boxB: Pipe | Bird): boolean {
  if (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height - 3 &&
    boxA.y + boxA.height - 3 > boxB.y
  ) {
    return true;
  }
  return false;
}

function pipeMovement(
  setMethod: Dispatch<SetStateAction<Pipe[]>>,
  pipeSpeed: number
) {
  setMethod((prevPipes: Pipe[]) => {
    const newPipes = prevPipes
      .map((currentPipe) => {
        return { ...currentPipe, x: currentPipe.x - pipeSpeed };
      })
      .filter((currentPipe) => currentPipe.x + currentPipe.width > 0);
    return newPipes;
  });
}
