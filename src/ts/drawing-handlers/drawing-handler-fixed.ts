import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import DrawingHandlerBase from "./drawing-handler-base";

class DrawingHandlerFixed extends DrawingHandlerBase {
    private _totalPointsDrawn: number;

    public reset(): void {
        this._totalPointsDrawn = 0;
    }

    public drawStep(game: ChaosGame): void {
        const nbPointsToDraw = this.nbPointsNeeded - this._totalPointsDrawn;
        const nbPoints = Math.min(ChaosGame.MAX_POINTS_PER_STEP, nbPointsToDraw);
        game.draw(nbPoints, Parameters.distance, Parameters.quality);

        this._totalPointsDrawn += nbPoints;
    }

    public get needsToKeepDrawing(): boolean {
        return this._totalPointsDrawn < this.nbPointsNeeded;
    }

    public get totalPointsDrawn(): number {
        return this._totalPointsDrawn;
    }

    public computeTotalPointsNeeded(canvasSize: number[]): number {
        const sizeFactor = Parameters.computeSizeFactor(canvasSize);
        return DrawingHandlerFixed.computeTotalPointsNeededInternal(sizeFactor);
    }

    private  static computeTotalPointsNeededInternal(sizeFactor: number): number {
        const exactValue = 2000 * Parameters.nbPointsNeeded * sizeFactor * sizeFactor;
        return Math.ceil(exactValue);
    }

    private get nbPointsNeeded(): number {
        const sizeFactor = Parameters.sizeFactor;
        return DrawingHandlerFixed.computeTotalPointsNeededInternal(sizeFactor);
    }
}

export default DrawingHandlerFixed;
