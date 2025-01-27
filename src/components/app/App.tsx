import Canvas from "../Background";
import Game from "../gameModule/Game";
import "./App.css";

// Canvas
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// pipe
const width = canvasWidth / 8;
const height = 600;

//top pipe
const x = canvasWidth;
const y = -10;
const pipe: Pipe = {
  width: width,
  height: height,
  x: x,
  y: y,
  passed: false,
};

//bird
const birdX = canvasWidth / 8;
const birdY = canvasHeight / 2.5;
const bird: Bird = {
  width: 127,
  height: 84,
  velocity: 0,
  x: birdX,
  y: birdY,
};

// width: 110,
// height: 89,

// settings
const pipeSpeed = 16;
const openSize = 300;
const gravity = 1;
const pipeSpawnRate = 1000;
const jumpForce = -10;

function App() {
  return (
    <div className="App">
      <Canvas>
        <Game
          pipe={pipe}
          pipeSpeed={pipeSpeed}
          openSize={openSize}
          initialBird={bird}
          canvasHeight={canvasHeight}
          gravity={gravity}
          pipeSpawnRate={pipeSpawnRate}
          jumpForce={jumpForce}
        ></Game>
      </Canvas>
    </div>
  );
}

export default App;

export interface Pipe extends Omit<Bird, "velocity"> {
  passed: boolean;
}

export interface Bird {
  velocity: number;
  width: number;
  height: number;
  x: number;
  y: number;
}
