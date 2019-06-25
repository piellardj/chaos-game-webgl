import * as PresetsFixed from "./presets-fixed";
import * as PresetsMovement from "./presets-movement";
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

enum Theme {
    DARK = "dark",
    LIGHT = "light",
}

/* === IDs ============================================================ */
const controlId = {
    MODE: "mode",
    PRESETS_FIXED: "presets-fixed-picker-id",
    PRESETS_MOVEMENT: "presets-movement-picker-id",
    POLES: "poles-range-id",
    DISTANCE: "distance-range-id",
    DISTANCE_FROM: "distance-from-range-id",
    DISTANCE_TO: "distance-to-range-id",
    FORBID_REPEAT: "forbid-repeat-checkbox-id",
    RESTRICTIONS: "restrictions-picker-id",

    INTENSITY: "intensity-range-id",
    QUALITY: "quality-range-id",
    THEME: "theme",
    COLORS: "colors-checkbox-id",
    RESET: "reset-button-id",

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
    resetView: GenericObserver[],
} = {
    clear: [],
    download: [],
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

let nbPointsNeeded: number = 0;
function recomputeNbPointsNeeded() {
    const newValue = Parameters.computeNbPointsNeeded(Canvas.getSize());
    const needToRedraw = (mode === Mode.MOVEMENT) || (newValue < nbPointsNeeded);
    nbPointsNeeded = newValue;

    if (needToRedraw) {
        restartRendering();
    }
}

/* === INTERFACE ====================================================== */
class Parameters {
    public static computeNbPointsNeeded(canvasSize: number[]): number {
        const exactValue = 10000 * intensity * (quality + 0.1) * canvasSize[0] * canvasSize[1] / (scale * scale);
        return Math.ceil(exactValue);
    }

    public static get scale(): number {
        return scale;
    }
    public static set scale(s: number) {
        scale = clamp(s, MIN_SCALE, MAX_SCALE);
        callObservers(observers.clear);
    }

    public static get nbPointsNeeded(): number {
        return nbPointsNeeded;
    }
    public static set intensity(i: number) {
        Range.setValue(controlId.INTENSITY, i);
        intensity = Range.getValue(controlId.INTENSITY);
    }

    public static get quality(): number {
        return quality;
    }
    public static set quality(d: number) {
        quality = d;
        Range.setValue(controlId.QUALITY, quality);
    }

    public static get theme(): Theme {
        return theme;
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

    public static set presetFixed(p: number) {
        Picker.setValue(controlId.PRESETS_FIXED, "" + p);
        if (mode === Mode.FIXED) {
            applyPresetFixed(p);
        }
    }

    public static set presetMovement(p: number) {
        Picker.setValue(controlId.PRESETS_MOVEMENT, "" + p);
        if (mode === Mode.MOVEMENT) {
            applyPresetMovement(p);
        }
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
        Range.setValue(controlId.DISTANCE, d);
    }

    public static get distanceFrom(): number {
        return Math.min(distanceFrom, distanceTo);
    }
    public static set distanceFrom(d: number) {
        distanceFrom = d;
        Range.setValue(controlId.DISTANCE_FROM, d);
    }

    public static get distanceTo(): number {
        return Math.max(distanceFrom, distanceTo);
    }
    public static set distanceTo(d: number) {
        distanceTo = d;
        Range.setValue(controlId.DISTANCE_TO, d);
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

    public static get resetViewObservers(): GenericObserver[] {
        return observers.resetView;
    }

    private constructor() {}
}

/* === EVENTS BINDING ================================================= */
/* --- RENDERING ------------------------------------------------------ */
function restartRendering() {
    callObservers(observers.clear);
}

let scale = 1.0;
const MIN_SCALE = 0.05; // should be > 0
const MAX_SCALE = 4.0;
Canvas.Observers.mouseWheel.push((delta: number, zoomCenter: number[]) => {
    const newScale = clamp(scale * (1 + 0.2 * delta), MIN_SCALE, MAX_SCALE);

    if (newScale !== scale) {
        scale = newScale;
        recomputeNbPointsNeeded();
        restartRendering();
    }
});

let intensity: number = Range.getValue(controlId.INTENSITY);
Range.addObserver(controlId.INTENSITY, (i: number) => {
    intensity = i;
    recomputeNbPointsNeeded();
});

let quality: number = Range.getValue(controlId.QUALITY);
Range.addObserver(controlId.QUALITY, (q: number) => {
    quality = q;
    recomputeNbPointsNeeded();
    restartRendering();
});

let theme: Theme;
function setTheme(t: Theme) {
    theme = t;
    restartRendering();
}
setTheme(Tabs.getValues(controlId.THEME)[0] as Theme);
Tabs.addObserver(controlId.THEME, (v: string[]) => setTheme(v[0] as Theme));

let colors: boolean = Checkbox.isChecked(controlId.COLORS);
Checkbox.addObserver(controlId.COLORS, (checked: boolean) => {
    colors = checked;
    restartRendering();
});

/* --- PARAMETERS ----------------------------------------------------- */
let presetFixedId: number = -1;
function clearPresetFixed() {
    if (presetFixedId >= 0) {
        presetFixedId = -1;
        Picker.setValue(controlId.PRESETS_FIXED, null);
    }
}
function applyPresetFixed(newPresetId: number) {
    if (newPresetId >= 0) {
        presetFixedId = newPresetId;
        const preset = PresetsFixed.getPreset(newPresetId);

        Parameters.poles = preset.poles;
        Parameters.distance = preset.distance;
        Parameters.restriction = preset.restriction;
        Parameters.scale = preset.scale;
        restartRendering();
        callObservers(observers.resetView);
    }
}
Picker.addObserver(controlId.PRESETS_FIXED, (v: string) => {
    if (v === null) {
        presetFixedId = -1;
    } else {
        applyPresetFixed(+v);
    }
});
applyPresetFixed(+Picker.getValue(controlId.PRESETS_FIXED));

let presetMovementId: number = -1;
function clearPresetMovement() {
    if (presetMovementId >= 0) {
        presetMovementId = -1;
        Picker.setValue(controlId.PRESETS_MOVEMENT, null);
    }
}
function applyPresetMovement(newPresetId: number) {
    if (newPresetId >= 0) {
        presetMovementId = newPresetId;
        const preset = PresetsMovement.getPreset(newPresetId);

        Parameters.poles = preset.poles;
        Parameters.distanceFrom = preset.distanceFrom;
        Parameters.distanceTo = preset.distanceTo;
        Parameters.restriction = preset.restriction;
        Parameters.scale = preset.scale;
        restartRendering();
        callObservers(observers.resetView);
    }
}
Picker.addObserver(controlId.PRESETS_MOVEMENT, (v: string) => {
    if (v === null) {
        presetMovementId = -1;
    } else {
        applyPresetMovement(+v);
    }
});
applyPresetMovement(+Picker.getValue(controlId.PRESETS_MOVEMENT));

let poles: number = Range.getValue(controlId.POLES);
Range.addObserver(controlId.POLES, (p: number) => {
    poles = p;
    clearPresetFixed();
    clearPresetMovement();
    restartRendering();
    callObservers(observers.resetView);
});

let distance: number = Range.getValue(controlId.DISTANCE);
Range.addObserver(controlId.DISTANCE, (d: number) => {
    distance = d;
    clearPresetFixed();
    restartRendering();
});

let distanceFrom: number = Range.getValue(controlId.DISTANCE_FROM);
Range.addObserver(controlId.DISTANCE_FROM, (df: number) => {
    distanceFrom = df;
    clearPresetMovement();
    restartRendering();
});

let distanceTo: number = Range.getValue(controlId.DISTANCE_TO);
Range.addObserver(controlId.DISTANCE_TO, (dt: number) => {
    distanceTo = dt;
    clearPresetMovement();
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

        const isFixed: boolean = mode === Mode.FIXED;
        if (isFixed) {
            const presetId = Picker.getValue(controlId.PRESETS_FIXED);
            if (presetId) {
                applyPresetFixed(+presetId);
            }
        } else {
            const presetId = Picker.getValue(controlId.PRESETS_MOVEMENT);
            if (presetId) {
                applyPresetMovement(+presetId);
            }
        }

        Controls.setVisibility(controlId.PRESETS_FIXED, isFixed);
        Controls.setVisibility(controlId.DISTANCE, isFixed);

        Controls.setVisibility(controlId.PRESETS_MOVEMENT, !isFixed!);
        Controls.setVisibility(controlId.DISTANCE_FROM, !isFixed);
        Controls.setVisibility(controlId.DISTANCE_TO, !isFixed);

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
    clearPresetFixed();
    clearPresetMovement();
    restartRendering();
});

Canvas.Observers.canvasResize.push(() => {
    recomputeNbPointsNeeded();
    restartRendering();
});
recomputeNbPointsNeeded();

export {
    Mode,
    Parameters,
    Theme,
};
