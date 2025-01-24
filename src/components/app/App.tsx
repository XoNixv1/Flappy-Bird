import Canvas from "../Background";
import Pipes from "../Pipes";
import "./App.css";

// Canvas
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// pipe
const pipeWidth = canvasWidth / 8;
const pipeHeight = 600;

// pipe speed/open size setting
const pipeSpeed = 6;
const openSize = 300;

//top pipe
const pipeX = canvasWidth;
const pipeY = -10;
const pipe: Pipe = {
  pipeWidth: pipeWidth,
  pipeHeight: pipeHeight,
  pipeX: pipeX,
  pipeY: pipeY,
};

export interface Pipe {
  pipeWidth: number;
  pipeHeight: number;
  pipeX: number;
  pipeY: number;
}

function App() {
  return (
    <div className="App">
      <Canvas>
        <Pipes pipe={pipe} pipeSpeed={pipeSpeed} openSize={openSize}></Pipes>
      </Canvas>
    </div>
  );
}

export default App;
