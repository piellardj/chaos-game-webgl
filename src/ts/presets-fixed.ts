import { Restriction } from "./restriction";

interface IPreset {
    poles: number;
    distance: number;
    restriction: Restriction;
    scale: number;
    intensity: number;
}

const presets: IPreset[] = [];
presets[0] = {
    poles: 3,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.01,
};
presets[1] = {
    poles: 6,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 0.75,
    intensity: 0.03,
};
presets[2] = {
    poles: 3,
    distance: 1.5,
    restriction: Restriction.NONE,
    scale: 3,
    intensity: 0.08,
};
presets[3] = {
    poles: 5,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.03,
};
presets[4] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
    intensity: 0.01,
};
presets[5] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_NEIGHBOUR_AFTER_REPEAT,
    scale: 0.8,
    intensity: 0.02,
};
presets[6] = {
    poles: 4,
    distance: 1.5,
    restriction: Restriction.NO_REPEAT,
    scale: 2.5,
    intensity: 0.07,
};
presets[7] = {
    poles: 6,
    distance: 0.57,
    restriction: Restriction.NONE,
    scale: 1.2,
    intensity: 0.03,
};
presets[8] = {
    poles: 6,
    distance: 1.5,
    restriction: Restriction.NO_REPEAT,
    scale: 2,
    intensity: 0.2,
};
presets[9] = {
    poles: 4,
    distance: 0.4,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
    intensity: 0.01,
};
presets[10] = {
    poles: 4,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 3,
    intensity: 0.4,
};
presets[11] = {
    poles: 5,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 0.3,
};
presets[12] = {
    poles: 3,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 0.15,
};
presets[13] = {
    poles: 4,
    distance: 1.618,
    restriction: Restriction.NONE,
    scale: 4,
    intensity: 0.4,
};
presets[14] = {
    poles: 6,
    distance: 0.667,
    restriction: Restriction.NONE,
    scale: 0.65,
    intensity: 0.02,
};
presets[15] = {
    poles: 5,
    distance: 1.5,
    restriction: Restriction.NO_NEIGHBOUR_AFTER_REPEAT,
    scale: 3,
    intensity: 0.16,
};
presets[16] = {
    poles: 5,
    distance: 1.5,
    restriction: Restriction.NO_NEIGHBOUR,
    scale: 3,
    intensity: 0.07,
};
presets[17] = {
    poles: 7,
    distance: 1.445,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 1.5,
    intensity: 0.2,
};
presets[18] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 0.75,
    intensity: 0.03,
};
presets[19] = {
    poles: 3,
    distance: 0.386,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 1,
    intensity: 0.03,
};
presets[20] = {
    poles: 3,
    distance: 1.755,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 1,
};
presets[21] = {
    poles: 3,
    distance: 1.647,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 1,
    intensity: 0.05,
};

function getPreset(id: number): IPreset {
    return presets[id];
}

export {
    getPreset,
    IPreset,
};
