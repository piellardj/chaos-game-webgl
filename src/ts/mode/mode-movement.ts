import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import ModeBase from "./mode-base";

class ModeMovement extends ModeBase {
    private _totalPointsDrawn: number;
    private _distance: number;
    private _pointsNeededPerStep: number;

    public reset(): void {
        this._totalPointsDrawn = 0;
        this._distance = Parameters.distanceFrom;
        this._pointsNeededPerStep = Math.ceil(Parameters.nbPointsNeeded / 2000);
    }

    public drawStep(game: ChaosGame): void {
        let nbPointsDrawnInThisStep = 0;
        while (nbPointsDrawnInThisStep < this._pointsNeededPerStep) {
            const nbPointsToDraw = this._pointsNeededPerStep - nbPointsDrawnInThisStep;
            const nbPoints = Math.min(ChaosGame.MAX_POINTS_PER_STEP, nbPointsToDraw);
            game.draw(nbPoints, this._distance, Parameters.quality);
            nbPointsDrawnInThisStep += nbPoints;
        }

        this._totalPointsDrawn += nbPointsDrawnInThisStep;
        this._distance += 0.002;
    }

    public get needsToKeepDrawing(): boolean {
        return this._distance < Parameters.distanceTo;
    }

    public get totalPointsDrawn(): number {
        return this._totalPointsDrawn;
    }
}

export default ModeMovement;
