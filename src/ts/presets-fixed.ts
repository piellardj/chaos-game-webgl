import { Restriction } from "./restriction";

interface IPreset {
    poles: number;
    distance: number;
    restriction: Restriction;
    scale: number;
}

const presets: IPreset[] = [];
presets[0] = {
    poles: 3,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 1,
};
presets[1] = {
    poles: 6,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 0.75,
};
presets[2] = {
    poles: 3,
    distance: 1.5,
    restriction: Restriction.NONE,
    scale: 3,
};
presets[3] = {
    poles: 5,
    distance: 0.5,
    restriction: Restriction.NONE,
    scale: 1,
};
presets[4] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
};
presets[5] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_NEIGHBOUR_AFTER_REPEAT,
    scale: 0.8,
};
presets[6] = {
    poles: 4,
    distance: 1.5,
    restriction: Restriction.NO_REPEAT,
    scale: 2.5,
};
presets[7] = {
    poles: 6,
    distance: 0.57,
    restriction: Restriction.NONE,
    scale: 1.2,
};
presets[8] = {
    poles: 6,
    distance: 1.5,
    restriction: Restriction.NO_REPEAT,
    scale: 2,
};
presets[9] = {
    poles: 4,
    distance: 0.4,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
};
presets[10] = {
    poles: 4,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 3,
};
presets[11] = {
    poles: 5,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
};
presets[12] = {
    poles: 3,
    distance: 1.618,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
};
presets[13] = {
    poles: 4,
    distance: 1.618,
    restriction: Restriction.NONE,
    scale: 4,
};
presets[14] = {
    poles: 6,
    distance: 0.667,
    restriction: Restriction.NONE,
    scale: 0.65,
};
presets[15] = {
    poles: 5,
    distance: 1.5,
    restriction: Restriction.NO_NEIGHBOUR,
    scale: 3,
};
presets[16] = {
    poles: 7,
    distance: 1.445,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 1.5,
};
presets[17] = {
    poles: 4,
    distance: 0.5,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 0.75,
};
presets[18] = {
    poles: 3,
    distance: 0.386,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 1,
};
presets[19] = {
    poles: 3,
    distance: 1.755,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
};
presets[20] = {
    poles: 3,
    distance: 1.647,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 1,
};

function getPreset(id: number): IPreset {
    return presets[id];
}

export {
    getPreset,
    IPreset,
};
