import ChaosGame from "../chaos-game";

abstract class DrawingHandlerBase {
    public abstract reset(): void;
    public abstract drawStep(game: ChaosGame): void;

    public abstract get needsToKeepDrawing(): boolean;
    public abstract get totalPointsDrawn(): number;
    public abstract computeTotalPointsNeeded(canvasSize: number[]): number;
}

export default DrawingHandlerBase;
