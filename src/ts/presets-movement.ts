import { Restriction } from "./restriction";

interface IPreset {
    poles: number;
    distanceFrom: number;
    distanceTo: number;
    rotation: number;
    restriction: Restriction;
    scale: number;
    intensity: number;
}

const presets: IPreset[] = [];
presets[0] = { // Triangle outer
    poles: 3,
    distanceFrom: 1,
    distanceTo: 1.6,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 3,
    intensity: 0.1,
};
presets[1] = { // Pentagon inner
    poles: 5,
    distanceFrom: 0.5,
    distanceTo: 1,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.1,
};
presets[2] = { // Palms
    poles: 6,
    distanceFrom: 1,
    distanceTo: 1.5,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 2.5,
    intensity: 0.1,
};
presets[3] = { // Triangle side
    poles: 3,
    distanceFrom: 1,
    distanceTo: 1.7,
    rotation: 0,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 3,
    intensity: 0.175,
};
presets[4] = { // Star
    poles: 5,
    distanceFrom: 0.265,
    distanceTo: 1.65,
    rotation: 0,
    restriction: Restriction.NO_NEIGHBOUR,
    scale: 3,
    intensity: 0.25,
};

function getPreset(id: number): IPreset {
    return presets[id];
}

export {
    getPreset,
    IPreset,
};
