import { Restriction } from "./restriction";

interface IPreset {
    poles: number;
    distanceFrom: number;
    distanceTo: number;
    restriction: Restriction;
    scale: number;
    intensity: number;
}

const presets: IPreset[] = [];
presets[0] = {
    poles: 3,
    distanceFrom: 1,
    distanceTo: 1.6,
    restriction: Restriction.NONE,
    scale: 3,
    intensity: 0.4,
};
presets[1] = {
    poles: 5,
    distanceFrom: 0.5,
    distanceTo: 1,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.4,
};
presets[2] = {
    poles: 6,
    distanceFrom: 1,
    distanceTo: 1.5,
    restriction: Restriction.NO_REPEAT,
    scale: 2.5,
    intensity: 0.4,
};
presets[3] = {
    poles: 3,
    distanceFrom: 1,
    distanceTo: 1.7,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 3,
    intensity: 0.7,
};
presets[4] = {
    poles: 5,
    distanceFrom: 0.265,
    distanceTo: 1.65,
    restriction: Restriction.NO_NEIGHBOUR,
    scale: 3,
    intensity: 1,
};

function getPreset(id: number): IPreset {
    return presets[id];
}

export {
    getPreset,
    IPreset,
};
