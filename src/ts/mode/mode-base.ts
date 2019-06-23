import ChaosGame from "../chaos-game";

abstract class ModeBase {
    public abstract reset(): void;
    public abstract drawStep(game: ChaosGame): void;

    public abstract get needsToKeepDrawing(): boolean;
    public abstract get totalPointsDrawn(): number;
}

export default ModeBase;
