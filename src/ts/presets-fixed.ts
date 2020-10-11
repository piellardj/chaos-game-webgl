import { Restriction } from "./restriction";

interface IPreset {
    poles: number;
    distance: number;
    rotation: number;
    restriction: Restriction;
    scale: number;
    intensity: number;
}

const presets: IPreset[] = [];
presets[0] = { // Sierpinski triangle
    poles: 3,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.01,
};
presets[1] = { // Cathedral
    poles: 6,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 0.75,
    intensity: 0.03,
};
presets[2] = { // Wires: triangle
    poles: 3,
    distance: 1.5,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 3,
    intensity: 0.08,
};
presets[3] = { // Pentagrams
    poles: 5,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 1,
    intensity: 0.03,
};
presets[4] = { // Wires: cube
    poles: 4,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
    intensity: 0.01,
};
presets[5] = { // Hollow
    poles: 4,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NO_NEIGHBOUR_AFTER_REPEAT,
    scale: 0.8,
    intensity: 0.02,
};
presets[6] = { // T-Square
    poles: 4,
    distance: 1.5,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 2.5,
    intensity: 0.07,
};
presets[7] = { // Stars
    poles: 6,
    distance: 0.57,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 1.2,
    intensity: 0.03,
};
presets[8] = { // Infinite cubes
    poles: 6,
    distance: 1.5,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 2,
    intensity: 0.2,
};
presets[9] = { // Crustaceans
    poles: 4,
    distance: 0.4,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 0.8,
    intensity: 0.01,
};
presets[10] = { // Golden square
    poles: 4,
    distance: 1.618,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 3,
    intensity: 0.4,
};
presets[11] = { // Starmap
    poles: 5,
    distance: 1.618,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 0.3,
};
presets[12] = { // Pythagoras tree
    poles: 3,
    distance: 1.618,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 0.15,
};
presets[13] = { // Monolith
    poles: 4,
    distance: 1.618,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 4,
    intensity: 0.4,
};
presets[14] = { // Koch snowflake
    poles: 6,
    distance: 0.667,
    rotation: 0,
    restriction: Restriction.NONE,
    scale: 0.65,
    intensity: 0.02,
};
presets[15] = { // Cabbage
    poles: 5,
    distance: 1.5,
    rotation: 0,
    restriction: Restriction.NO_NEIGHBOUR_AFTER_REPEAT,
    scale: 3,
    intensity: 0.16,
};
presets[16] = { // Gecko
    poles: 5,
    distance: 1.5,
    rotation: 0,
    restriction: Restriction.NO_NEIGHBOUR,
    scale: 3,
    intensity: 0.07,
};
presets[17] = { // Hubs
    poles: 7,
    distance: 1.445,
    rotation: 0,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 1.5,
    intensity: 0.2,
};
presets[18] = { // Sierpinski carpet
    poles: 4,
    distance: 0.5,
    rotation: 0,
    restriction: Restriction.NO_DOUBLE_REPEAT,
    scale: 0.75,
    intensity: 0.03,
};
presets[19] = { // Forest
    poles: 3,
    distance: 0.386,
    rotation: 0,
    restriction: Restriction.NO_RIGHT_NEIGHBOUR,
    scale: 1,
    intensity: 0.03,
};
presets[20] = { // Triangles
    poles: 3,
    distance: 1.755,
    rotation: 0,
    restriction: Restriction.NO_REPEAT,
    scale: 4,
    intensity: 1,
};
presets[21] = { // Spirals
    poles: 3,
    distance: 1.647,
    rotation: 0,
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
