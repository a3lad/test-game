import p5 from 'p5';
import { GameState } from './types';
import { drawStartScreen } from './startScreen';
import { drawGameScreen, initGame, setBackgrounds } from './gameScreen';
import { drawWinScreen } from './winScreen';
import { drawLoseScreen } from './loseScreen';

export const createSketch = (p: p5) => {
  let currentScreen: GameState = 'start';
  let loseReason = "";

  p.setup = () => {
    p.createCanvas(800, 600);
    (p as any).mouseWasPressed = false;
    p.textFont('Patrick Hand');
  };

  p.draw = () => {
    const mouseJustPressed = p.mouseIsPressed && !(p as any).mouseWasPressed;

    switch (currentScreen) {
      case 'start':
        drawStartScreen(p, () => {
          currentScreen = 'playing';
          initGame(p, 0);
        }, mouseJustPressed);
        break;
      case 'playing':
        drawGameScreen(
          p,
          () => {
            currentScreen = 'win';
          },
          (reason) => {
            loseReason = reason;
            currentScreen = 'lose';
          },
          mouseJustPressed
        );
        break;
      case 'win':
        drawWinScreen(p, 0, () => {
          currentScreen = 'start';
        }, mouseJustPressed);
        break;
      case 'lose':
        drawLoseScreen(p, loseReason, () => {
          currentScreen = 'start';
        }, mouseJustPressed);
        break;
    }

    (p as any).mouseWasPressed = p.mouseIsPressed;
  };
};
