import * as Presets from "./presets";
import { Restriction } from "./restriction";

declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const Controls: any;
declare const FileControl: any;
declare const Picker: any;
declare const Range: any;
declare const Tabs: any;

function clamp(x: number, minVal: number, maxVal: number): number {
    return Math.min(maxVal, Math.max(minVal, x));
}

/* === IDs ============================================================ */
const controlId = {
    AUTORUN: "autorun-checkbox-id",
    RESET: "reset-button-id",
    SPEED: "speed-range-id",
    QUALITY: "quality-range-id",
    COLORS: "colors-checkbox-id",

    MODE: "mode",
    PRESETS: "presets-picker-id",
    POLES: "poles-range-id",
    DISTANCE: "distance-range-id",
    DISTANCE_FROM: "distance-from-range-id",
    DISTANCE_TO: "distance-to-range-id",
    FORBID_REPEAT: "forbid-repeat-checkbox-id",
    RESTRICTIONS: "restrictions-picker-id",

    RESULT_SIZE: "result-dimensions",
    DOWNLOAD: "result-download-id",
};

/* === OBSERVERS ====================================================== */
type DownloadObserver = (size: number) => void;
type GenericObserver = () => void;

function callObservers(observersList: any[]): void {
    for (const observer of observersList) {
        observer();
    }
}

const observers: {
    clear: GenericObserver[],
    download: DownloadObserver[],
    preview: GenericObserver[],
    resetView: GenericObserver[],
} = {
    clear: [],
    download: [],
    preview: [],
    resetView: [],
};

FileControl.addDownloadObserver(controlId.DOWNLOAD, () => {
    const size = +Tabs.getValues(controlId.RESULT_SIZE)[0];
    for (const observer of observers.download) {
        observer(size);
    }
});

Button.addObserver(controlId.RESET, () => callObservers(observers.clear));
Canvas.Observers.mouseDrag.push(() => callObservers(observers.clear));

Canvas.Observers.mouseDrag.push(() => callObservers(observers.preview));

/* === INTERFACE ====================================================== */
class Parameters {
    public static get scale(): number {
        return scale;
    }
    public static set scale(s: number) {
        scale = clamp(s, MIN_SCALE, MAX_SCALE);
        callObservers(observers.clear);
    }

    public static get autorun(): boolean {
        return autorun;
    }
    public static set autorun(a: boolean) {
        autorun = a;
        Checkbox.setChecked(controlId.AUTORUN, a);
    }

    public static get speed(): number {
        return speed;
    }
    public static set speed(s: number) {
        speed = s;
        Range.setValue(controlId.SPEED, speed);
    }

    public static get quality(): number {
        return quality;
    }
    public static set quality(d: number) {
        quality = d;
        Range.setValue(controlId.QUALITY, quality);
    }

    public static get colors(): boolean {
        return colors;
    }
    public static set colors(c: boolean) {
        colors = c;
        Checkbox.setChecked(controlId.COLORS, c);
    }

    public static get mode(): Mode {
        return mode;
    }
    public static get modeChangeObservers(): ModeChangeObserver[] {
        return modeChangeObservers;
    }

    public static set preset(p: number) {
        Picker.setValue(controlId.PRESETS, "" + p);
        applyPreset(p);
    }

    public static get poles(): number {
        return poles;
    }
    public static set poles(q: number) {
        poles = q;
        Range.setValue(controlId.POLES, poles);
        callObservers(observers.clear);
    }

    public static get distance(): number {
        return distance;
    }
    public static set distance(d: number) {
        distance = d;
        Range.setValue(controlId.DISTANCE, distance);
    }

    public static get distanceFrom(): number {
        return distanceFrom;
    }

    public static get distanceTo(): number {
        return distanceTo;
    }

    public static get restriction(): Restriction {
        return restriction;
    }
    public static set restriction(r: Restriction) {
        restriction = r;
        Picker.setValue(controlId.RESTRICTIONS, r);
    }

    public static get downloadObservers(): DownloadObserver[] {
        return observers.download;
    }

    public static get clearObservers(): GenericObserver[] {
        return observers.clear;
    }

    public static get previewObservers(): GenericObserver[] {
        return observers.preview;
    }

    public static get resetViewObservers(): GenericObserver[] {
        return observers.resetView;
    }

    private constructor() {}
}

/* === EVENTS BINDING ================================================= */
/* --- RENDERING ------------------------------------------------------ */
function restartRendering() {
    callObservers(observers.clear);
    Parameters.autorun = true;
}

let scale = 1.0;
const MIN_SCALE = 0.05;
const MAX_SCALE = 4.0;
Canvas.Observers.mouseWheel.push((delta: number, zoomCenter: number[]) => {
    const newScale = clamp(scale * (1 + 0.2 * delta), MIN_SCALE, MAX_SCALE);

    if (newScale !== scale) {
        scale = newScale;
        restartRendering();
    }
});

let autorun: boolean = Checkbox.isChecked(controlId.AUTORUN);
Checkbox.addObserver(controlId.AUTORUN, (checked: boolean) => {
    autorun = checked;
});

let speed: number = Range.getValue(controlId.SPEED);
Range.addObserver(controlId.SPEED, (s: number) => {
    speed = s;
});

let quality: number = Range.getValue(controlId.QUALITY);
Range.addObserver(controlId.QUALITY, (q: number) => {
    quality = q;
    restartRendering();
});

let colors: boolean = Checkbox.isChecked(controlId.COLORS);
Checkbox.addObserver(controlId.COLORS, (checked: boolean) => {
    colors = checked;
    restartRendering();
});

/* --- PARAMETERS ----------------------------------------------------- */
let presetId: number = -1;
function clearPreset() {
    if (presetId >= 0) {
        presetId = -1;
        Picker.setValue(controlId.PRESETS, null);
    }
}
function applyPreset(newPresetId: number) {
    if (newPresetId >= 0) {
        presetId = newPresetId;
        const preset = Presets.getPreset(newPresetId);

        Parameters.poles = preset.poles;
        Parameters.distance = preset.distance;
        Parameters.restriction = preset.restriction;
        Parameters.scale = preset.scale;
        restartRendering();
        callObservers(observers.resetView);
    }
}
Picker.addObserver(controlId.PRESETS, (v: string) => {
    if (v === null) {
        presetId = -1;
    } else {
        applyPreset(+v);
    }
});
applyPreset(+Picker.getValue(controlId.PRESETS));

let poles: number = Range.getValue(controlId.POLES);
Range.addObserver(controlId.POLES, (p: number) => {
    poles = p;
    clearPreset();
    restartRendering();
    callObservers(observers.resetView);
});

let distance: number = Range.getValue(controlId.DISTANCE);
Range.addObserver(controlId.DISTANCE, (d: number) => {
    distance = d;
    clearPreset();
    restartRendering();
});

let distanceFrom: number = Range.getValue(controlId.DISTANCE_FROM);
Range.addObserver(controlId.DISTANCE_FROM, (df: number) => {
    distanceFrom = df;
    callObservers(observers.preview);
    restartRendering();
});

let distanceTo: number = Range.getValue(controlId.DISTANCE_TO);
Range.addObserver(controlId.DISTANCE_TO, (dt: number) => {
    distanceTo = dt;
    callObservers(observers.preview);
    restartRendering();
});

let forbidRepeat: boolean = Checkbox.isChecked(controlId.FORBID_REPEAT);
Checkbox.addObserver(controlId.FORBID_REPEAT, (checked: boolean) => {
    forbidRepeat = checked;
    clearPreset();
    restartRendering();
});

enum Mode {
    FIXED = "fixed",
    MOVEMENT = "movement",
}
type ModeChangeObserver = (newMode: Mode) => void;
const modeChangeObservers: ModeChangeObserver[] = [];

let mode: Mode;
function applyMode(newMode: Mode): void {
    if (newMode !== mode) {
        mode = newMode;

        Controls.toggleVisibility(controlId.PRESETS, mode === Mode.FIXED);
        Controls.toggleVisibility(controlId.DISTANCE, mode === Mode.FIXED);

        Controls.toggleVisibility(controlId.DISTANCE_FROM, mode === Mode.MOVEMENT);
        Controls.toggleVisibility(controlId.DISTANCE_TO, mode === Mode.MOVEMENT);

        for (const observer of modeChangeObservers) {
            observer(newMode);
        }
        restartRendering();
    }
}
applyMode(Tabs.getValues(controlId.MODE)[0] as Mode);
Tabs.addObserver(controlId.MODE, (v: string[]) => applyMode(v[0] as Mode));

let restriction: Restriction = Picker.getValue(controlId.RESTRICTIONS) as Restriction;
Picker.addObserver(controlId.RESTRICTIONS, (v: string) => {
    restriction = v as Restriction;
    restartRendering();
});

export default Parameters;
