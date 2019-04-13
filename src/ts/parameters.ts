declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const FileControl: any;
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

const POLES_CONTROL_ID = "poles-range-id";
let poles: number = Range.getValue(POLES_CONTROL_ID);
Range.addObserver(POLES_CONTROL_ID, (p: number) => {
    poles = p;
});

const DISTANCE_CONTROL_ID = "distance-range-id";
let distance: number = Range.getValue(DISTANCE_CONTROL_ID);
Range.addObserver(DISTANCE_CONTROL_ID, (d: number) => {
    distance = d;
});

const QUALITY_CONTROL_ID = "quality-range-id";
let quality: number = Range.getValue(QUALITY_CONTROL_ID);
Range.addObserver(QUALITY_CONTROL_ID, (q: number) => {
    quality = q;
});

const SPEED_CONTROL_ID = "speed-range-id";
let speed: number = Range.getValue(SPEED_CONTROL_ID);
Range.addObserver(SPEED_CONTROL_ID, (s: number) => {
    speed = s;
});

const AUTORUN_CONTROL_ID = "autorun-checkbox-id";
let autorun: boolean = Checkbox.isChecked(AUTORUN_CONTROL_ID);
Checkbox.addObserver(AUTORUN_CONTROL_ID, (checked: boolean) => autorun = checked);

type DownloadObserver = (size: number) => void;
const downloadObservers: DownloadObserver[] = [];
FileControl.addDownloadObserver("result-download-id", () => {
    const size = +Tabs.getValues("result-dimensions")[0];
    for (const observer of downloadObservers) {
        observer(size);
    }
});

const RESET_CONTROL_ID = "reset-button-id";
type ClearObserver = () => void;
const clearObservers: ClearObserver[] = [];
function callClearObservers() {
    for (const observer of clearObservers) {
        observer();
    }
}
Range.addObserver(POLES_CONTROL_ID, callClearObservers);
Range.addObserver(DISTANCE_CONTROL_ID, callClearObservers);
Range.addObserver(QUALITY_CONTROL_ID, callClearObservers);
Button.addObserver(RESET_CONTROL_ID, callClearObservers);
scaleObservers.push(callClearObservers);
Canvas.Observers.mouseDrag.push(callClearObservers);

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

    public static get poles(): number {
        return poles;
    }
    public static set poles(q: number) {
        poles = q;
        Range.setValue(POLES_CONTROL_ID, poles);
    }

    public static get distance(): number {
        return distance;
    }
    public static set distance(d: number) {
        distance = d;
        Range.setValue(DISTANCE_CONTROL_ID, distance);
    }

    public static get quality(): number {
        return quality;
    }
    public static set quality(d: number) {
        quality = d;
        Range.setValue(QUALITY_CONTROL_ID, quality);
    }

    public static get speed(): number {
        return speed;
    }
    public static set speed(s: number) {
        speed = s;
        Range.setValue(SPEED_CONTROL_ID, speed);
    }

    public static get autorun(): boolean {
        return autorun;
    }
    public static set autorun(a: boolean) {
        autorun = a;
        Checkbox.setChecked(AUTORUN_CONTROL_ID, a);
    }

    public static get downloadObservers(): DownloadObserver[] {
        return downloadObservers;
    }

    public static get clearObservers(): ClearObserver[] {
        return clearObservers;
    }

    private constructor() {}
}

export default Parameters;
