import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import DrawingHandlerBase from "./drawing-handler-base";

const quality = 0;
const nbPoints = Math.pow(2, 17);

class DrawingHandlerPreview extends DrawingHandlerBase {
    /* tslint:disable:no-empty */
    public reset(): void {}
    /* tslint:enable:no-empty */

    public drawStep(game: ChaosGame): void {
        game.draw(nbPoints, Parameters.distance, quality);
    }

    public get needsToKeepDrawing(): boolean {
        return true;
    }

    public get totalPointsDrawn(): number {
        return nbPoints;
    }
}

export default DrawingHandlerPreview;
