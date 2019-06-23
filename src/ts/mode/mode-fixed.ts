import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import ModeBase from "./mode-base";

class ModeFixed extends ModeBase {
    private _totalPointsDrawn: number;

    public reset(): void {
        this._totalPointsDrawn = 0;
    }

    public drawStep(game: ChaosGame): void {
        const nbPointsToDraw = Parameters.nbPointsNeeded - this._totalPointsDrawn;
        const nbPoints = Math.min(ChaosGame.MAX_POINTS_PER_STEP, nbPointsToDraw);
        game.draw(nbPoints, Parameters.distance, Parameters.quality);

        this._totalPointsDrawn += nbPoints;
    }

    public get needsToKeepDrawing(): boolean {
        return this._totalPointsDrawn < Parameters.nbPointsNeeded;
    }

    public get totalPointsDrawn(): number {
        return this._totalPointsDrawn;
    }
}

export default ModeFixed;
