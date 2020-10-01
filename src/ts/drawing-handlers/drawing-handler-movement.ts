import ChaosGame from "../chaos-game";
import { Parameters } from "../parameters";
import DrawingHandlerBase from "./drawing-handler-base";

class DrawingModeMovement extends DrawingHandlerBase {
    private _totalPointsDrawn: number;
    private _distance: number;

    private _pointsNeededPerDistanceUnit: number;
    private _distanceGap: number;
    private _distancePerStep: number;

    public reset(): void {
        this._totalPointsDrawn = 0;
        this._distance = Parameters.distanceFrom;
        this._pointsNeededPerDistanceUnit = DrawingModeMovement.computePointsPerDistanceUnit(Parameters.sizeFactor);
        this._distanceGap = 0.4 / Parameters.sizeFactor;

        const minTotalSteps = 180;
        const totalDistance = Parameters.distanceTo - Parameters.distanceFrom;
        const maxDistancePerStep = totalDistance / minTotalSteps;
        const potentialMaxPointsPerStep = maxDistancePerStep * this._pointsNeededPerDistanceUnit;

        this._distancePerStep = maxDistancePerStep;
        if (potentialMaxPointsPerStep > ChaosGame.MAX_POINTS_PER_STEP) {
            this._distancePerStep *= ChaosGame.MAX_POINTS_PER_STEP / potentialMaxPointsPerStep;
        }
    }

    public drawStep(game: ChaosGame): void {
        const finalDistanceAfterThisStep = Math.min(this._distance + this._distancePerStep, Parameters.distanceTo);

        while (this._distance + this._distanceGap < finalDistanceAfterThisStep) {
            this.drawDistanceGap(game, this._distanceGap);
        }

        if (this._distance < finalDistanceAfterThisStep) {
            this.drawDistanceGap(game, finalDistanceAfterThisStep - this._distance);
        }
    }

    public get needsToKeepDrawing(): boolean {
        return this._distance < Parameters.distanceTo;
    }

    public get totalPointsDrawn(): number {
        return this._totalPointsDrawn;
    }

    public computeTotalPointsNeeded(canvasSize: number[]): number {
        const sizeFactor = Parameters.computeSizeFactor(canvasSize);
        const pointsPerDistanceUnit = DrawingModeMovement.computePointsPerDistanceUnit(sizeFactor);
        const totalDistance = Parameters.distanceTo - Parameters.distanceFrom;
        return pointsPerDistanceUnit * totalDistance;
    }

    private static computePointsPerDistanceUnit(sizeFactor: number): number {
        return Math.ceil(500 * Parameters.nbPointsNeeded * sizeFactor * sizeFactor);
    }

    private drawDistanceGap(game: ChaosGame, distanceGap: number): void {
        const nbPoints = Math.ceil(distanceGap * this._pointsNeededPerDistanceUnit);
        game.draw(nbPoints, this._distance, Parameters.quality);
        this._totalPointsDrawn += nbPoints;
        this._distance += distanceGap;
    }
}

export default DrawingModeMovement;
