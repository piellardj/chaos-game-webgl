import * as PresetsFixed from "./presets-fixed";
import * as PresetsMovement from "./presets-movement";
import { Restriction } from "./restriction";

import "./page-interface-generated";

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
type ModeChangeObserver = (newMode: Mode) => void;

function callObservers(observersList: any[]): void {
    for (const observer of observersList) {
        observer();
    }
}

const observers: {
    clear: GenericObserver[],
    download: DownloadObserver[],
    modeChange: ModeChangeObserver[],
    resetView: GenericObserver[],
} = {
    clear: [],
    download: [],
    modeChange: [],
    resetView: [],
};

enum Mode {
    FIXED = "fixed",
    MOVEMENT = "movement",
}

Page.FileControl.addDownloadObserver(controlId.DOWNLOAD, () => {
    const size = +Page.Tabs.getValues(controlId.RESULT_SIZE)[0];
    for (const observer of observers.download) {
        observer(size);
    }
});

Page.Button.addObserver(controlId.RESET, () => callObservers(observers.clear));
Page.Canvas.Observers.mouseDrag.push(() => callObservers(observers.clear));

let nbPointsNeeded: number = 0;
function recomputeNbPointsNeeded() {
    const newValue = Parameters.computeNbPointsNeeded(Page.Canvas.getSize());
    const needToRedraw = (mode === Mode.MOVEMENT) || (newValue < nbPointsNeeded);
    nbPointsNeeded = newValue;

    if (needToRedraw) {
        restartRendering();
    }
}

/* === INTERFACE ====================================================== */
class Parameters {
    public static computeNbPointsNeeded(canvasSize: number[]): number {
        const minSide = Math.min(canvasSize[0], canvasSize[1]);
        const nbUsefulPixels = minSide * minSide;
        const exactValue = 2000 * intensity * (quality + 0.1) * nbUsefulPixels / (scale * scale);
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
        Page.Range.setValue(controlId.INTENSITY, i);
        intensity = Page.Range.getValue(controlId.INTENSITY);
        recomputeNbPointsNeeded();
    }

    public static get quality(): number {
        return quality;
    }
    public static set quality(d: number) {
        quality = d;
        Page.Range.setValue(controlId.QUALITY, quality);
    }

    public static get theme(): Theme {
        return theme;
    }

    public static get colors(): boolean {
        return colors;
    }
    public static set colors(c: boolean) {
        colors = c;
        Page.Checkbox.setChecked(controlId.COLORS, c);
    }

    public static get mode(): Mode {
        return mode;
    }
    public static get modeChangeObservers(): ModeChangeObserver[] {
        return observers.modeChange;
    }

    public static set presetFixed(p: number) {
        Page.Picker.setValue(controlId.PRESETS_FIXED, "" + p);
        if (mode === Mode.FIXED) {
            applyPresetFixed(p);
        }
    }

    public static set presetMovement(p: number) {
        Page.Picker.setValue(controlId.PRESETS_MOVEMENT, "" + p);
        if (mode === Mode.MOVEMENT) {
            applyPresetMovement(p);
        }
    }

    public static get poles(): number {
        return poles;
    }
    public static set poles(q: number) {
        poles = q;
        Page.Range.setValue(controlId.POLES, poles);
        callObservers(observers.clear);
    }

    public static get distance(): number {
        return distance;
    }
    public static set distance(d: number) {
        distance = d;
        Page.Range.setValue(controlId.DISTANCE, d);
    }

    public static get distanceFrom(): number {
        return Math.min(distanceFrom, distanceTo);
    }
    public static set distanceFrom(d: number) {
        distanceFrom = d;
        Page.Range.setValue(controlId.DISTANCE_FROM, d);
    }

    public static get distanceTo(): number {
        return Math.max(distanceFrom, distanceTo);
    }
    public static set distanceTo(d: number) {
        distanceTo = d;
        Page.Range.setValue(controlId.DISTANCE_TO, d);
    }

    public static get restriction(): Restriction {
        return restriction;
    }
    public static set restriction(r: Restriction) {
        restriction = r;
        Page.Picker.setValue(controlId.RESTRICTIONS, r);
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
Page.Canvas.Observers.mouseWheel.push((delta: number, zoomCenter: number[]) => {
    const newScale = clamp(scale * (1 + 0.2 * delta), MIN_SCALE, MAX_SCALE);

    if (newScale !== scale) {
        scale = newScale;
        recomputeNbPointsNeeded();
        restartRendering();
    }
});

let intensity: number = Page.Range.getValue(controlId.INTENSITY);
Page.Range.addObserver(controlId.INTENSITY, (i: number) => {
    intensity = i;
    recomputeNbPointsNeeded();
});

let quality: number = Page.Range.getValue(controlId.QUALITY);
Page.Range.addObserver(controlId.QUALITY, (q: number) => {
    quality = q;
    recomputeNbPointsNeeded();
    restartRendering();
});

let theme: Theme;
function setTheme(t: Theme) {
    theme = t;
    restartRendering();
}
setTheme(Page.Tabs.getValues(controlId.THEME)[0] as Theme);
Page.Tabs.addObserver(controlId.THEME, (v: string[]) => setTheme(v[0] as Theme));

let colors: boolean = Page.Checkbox.isChecked(controlId.COLORS);
Page.Checkbox.addObserver(controlId.COLORS, (checked: boolean) => {
    colors = checked;
    restartRendering();
});

/* --- PARAMETERS ----------------------------------------------------- */
let presetFixedId: number = -1;
function clearPresetFixed() {
    if (presetFixedId >= 0) {
        presetFixedId = -1;
        Page.Picker.setValue(controlId.PRESETS_FIXED, null);
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
        Parameters.intensity = preset.intensity;
        restartRendering();
        callObservers(observers.resetView);
    }
}
Page.Picker.addObserver(controlId.PRESETS_FIXED, (v: string) => {
    if (v === null) {
        presetFixedId = -1;
    } else {
        applyPresetFixed(+v);
    }
});
applyPresetFixed(+Page.Picker.getValue(controlId.PRESETS_FIXED));

let presetMovementId: number = -1;
function clearPresetMovement() {
    if (presetMovementId >= 0) {
        presetMovementId = -1;
        Page.Picker.setValue(controlId.PRESETS_MOVEMENT, null);
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
        Parameters.intensity = preset.intensity;
        restartRendering();
        callObservers(observers.resetView);
    }
}
Page.Picker.addObserver(controlId.PRESETS_MOVEMENT, (v: string) => {
    if (v === null) {
        presetMovementId = -1;
    } else {
        applyPresetMovement(+v);
    }
});
applyPresetMovement(+Page.Picker.getValue(controlId.PRESETS_MOVEMENT));

let poles: number = Page.Range.getValue(controlId.POLES);
Page.Range.addObserver(controlId.POLES, (p: number) => {
    poles = p;
    clearPresetFixed();
    clearPresetMovement();
    restartRendering();
    callObservers(observers.resetView);
});

let distance: number = Page.Range.getValue(controlId.DISTANCE);
Page.Range.addObserver(controlId.DISTANCE, (d: number) => {
    distance = d;
    clearPresetFixed();
    restartRendering();
});

let distanceFrom: number = Page.Range.getValue(controlId.DISTANCE_FROM);
Page.Range.addObserver(controlId.DISTANCE_FROM, (df: number) => {
    distanceFrom = df;
    clearPresetMovement();
    restartRendering();
});

let distanceTo: number = Page.Range.getValue(controlId.DISTANCE_TO);
Page.Range.addObserver(controlId.DISTANCE_TO, (dt: number) => {
    distanceTo = dt;
    clearPresetMovement();
    restartRendering();
});

let mode: Mode;
function applyMode(newMode: Mode): void {
    if (newMode !== mode) {
        mode = newMode;

        const isFixed: boolean = mode === Mode.FIXED;
        if (isFixed) {
            const presetId = Page.Picker.getValue(controlId.PRESETS_FIXED);
            if (presetId) {
                applyPresetFixed(+presetId);
            }
        } else {
            const presetId = Page.Picker.getValue(controlId.PRESETS_MOVEMENT);
            if (presetId) {
                applyPresetMovement(+presetId);
            }
        }

        Page.Controls.setVisibility(controlId.PRESETS_FIXED, isFixed);
        Page.Controls.setVisibility(controlId.DISTANCE, isFixed);

        Page.Controls.setVisibility(controlId.PRESETS_MOVEMENT, !isFixed!);
        Page.Controls.setVisibility(controlId.DISTANCE_FROM, !isFixed);
        Page.Controls.setVisibility(controlId.DISTANCE_TO, !isFixed);

        for (const observer of observers.modeChange) {
            observer(newMode);
        }
        restartRendering();
    }
}
applyMode(Page.Tabs.getValues(controlId.MODE)[0] as Mode);
Page.Tabs.addObserver(controlId.MODE, (v: string[]) => applyMode(v[0] as Mode));

let restriction: Restriction = Page.Picker.getValue(controlId.RESTRICTIONS) as Restriction;
Page.Picker.addObserver(controlId.RESTRICTIONS, (v: string) => {
    restriction = v as Restriction;
    clearPresetFixed();
    clearPresetMovement();
    restartRendering();
});

Page.Canvas.Observers.canvasResize.push(() => {
    recomputeNbPointsNeeded();
    restartRendering();
});
recomputeNbPointsNeeded();

export {
    Mode,
    Parameters,
    Theme,
};
