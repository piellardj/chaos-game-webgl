import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import DrawingHandlerBase from "./drawing-handler-base";

const quality = 0;
const nbPointsNeeded = Math.pow(2, 17);

class DrawingHandlerPreview extends DrawingHandlerBase {
    /* tslint:disable:no-empty */
    public reset(): void {}
    /* tslint:enable:no-empty */

    public drawStep(game: ChaosGame): void {
        game.draw(nbPointsNeeded, Parameters.distance, quality);
    }

    public get needsToKeepDrawing(): boolean {
        return true;
    }

    public get totalPointsDrawn(): number {
        return nbPointsNeeded;
    }

    public computeTotalPointsNeeded(canvasSize: number[]): number {
        return nbPointsNeeded;
    }
}

export default DrawingHandlerPreview;
