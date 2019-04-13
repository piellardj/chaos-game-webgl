declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const Range: any;
declare const Tabs: any;

let scale: number;
const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;
type ScaleObserver = (newScale: number, zoomCenter: number[]) => void;
const scaleObservers: ScaleObserver[] = [];
Canvas.Observers.mouseWheel.push((delta: number, zoomCenter: number[]) => {
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE,  scale * (1 + 0.2 * delta)));

    if (newScale !== scale) {
        scale = newScale;

        if (!zoomCenter) {
            zoomCenter = Canvas.getMousePosition();
        }

        for (const observer of scaleObservers) {
            observer(scale, zoomCenter);
        }
    }
});
scale = 1.0;

class Parameters {
    public static get scale(): number {
        return scale;
    }
    public static set scale(s: number) {
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
    }
    public static get scaleObservers(): ScaleObserver[] {
        return scaleObservers;
    }

    private constructor() {}
}

export default Parameters;
