import { useEffect, useState } from "react";

import { Pipe } from "./app/App";

export default function Pipes({
  pipe,
  pipeSpeed,
  openSize,
}: {
  pipe: Pipe;
  openSize: number;
  pipeSpeed: number;
}): JSX.Element {
  const [pipes, setPipes] = useState<Pipe[]>([pipe]);
  const [gameOver, setGameOver] = useState(true);

  useEffect(() => {
    if (!gameOver) {
      const moveInterval = setInterval(() => {
        movePipe();
      }, 1000 / 60);

      const newPipeInterval = setInterval(() => {
        let randomPipeY =
          pipe.pipeY -
          pipe.pipeHeight / 4 -
          Math.random() * (pipe.pipeHeight / 2);
        const newPipe: Pipe = {
          pipeWidth: pipe.pipeWidth,
          pipeHeight: pipe.pipeHeight,
          pipeX: pipe.pipeX,
          pipeY: randomPipeY,
        };
        setPipes((pipes) => [...pipes, newPipe]);
      }, 1500);

      return () => {
        clearInterval(newPipeInterval);
        clearInterval(moveInterval);
      };
    }
  }, [gameOver]);

  function movePipe() {
    setPipes((prevPipes) => {
      const newPipes = prevPipes
        .map((currentPipe) => ({
          ...currentPipe,
          pipeX: currentPipe.pipeX - pipeSpeed,
        }))
        .filter((currentPipe) => currentPipe.pipeX + currentPipe.pipeWidth > 0);

      return newPipes;
    });
  }

  return (
    <>
      {gameOver && (
        <div
          onClick={() => {
            setGameOver(false);
          }}
          style={{
            cursor: "pointer",
            fontSize: `${48}px`,
            position: "absolute",
            top: `${30}%`,
            left: `${50}%`,
            fontWeight: "bold",
          }}
        >
          Start
        </div>
      )}
      {pipes.map((currentPipe, i) => (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              top: `${currentPipe.pipeY}px`,
              left: `${currentPipe.pipeX}px`,
              height: `${currentPipe.pipeHeight}px`,
              width: `${currentPipe.pipeWidth}px`,
            }}
          >
            <img
              src="/assets/topPipe.png"
              alt={`Pipe ${i}`}
              style={{
                height: `${currentPipe.pipeHeight}px`,
                width: `${currentPipe.pipeWidth}px`,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: `${currentPipe.pipeY + openSize + currentPipe.pipeHeight}px`,
              left: `${currentPipe.pipeX}px`,
              height: `${currentPipe.pipeHeight}px`,
              width: `${currentPipe.pipeWidth}px`,
            }}
          >
            <img
              src="/assets/bottomPipe.png"
              alt={`Pipe ${i}`}
              style={{
                height: `${currentPipe.pipeHeight}px`,
                width: `${currentPipe.pipeWidth}px`,
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
