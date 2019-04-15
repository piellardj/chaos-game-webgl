interface IPreset {
    poles: number;
    distance: number;
    forbidRepeat: boolean;
    scale: number;
}

const presets: IPreset[] = [
    {
        poles: 3,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 6,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 5,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 3,
        distance: 1.5,
        forbidRepeat: false,
        scale: 3,
    },
    {
        poles: 4,
        distance: 0.5,
        forbidRepeat: true,
        scale: 0.8,
    },
    {
        poles: 4,
        distance: 1.5,
        forbidRepeat: true,
        scale: 2.5,
    },
    {
        poles: 6,
        distance: 0.57,
        forbidRepeat: false,
        scale: 1.2,
    },
    {
        poles: 6,
        distance: 1.5,
        forbidRepeat: true,
        scale: 2,
    },
    {
        poles: 4,
        distance: 0.4,
        forbidRepeat: true,
        scale: 0.8,
    },
    {
        poles: 4,
        distance: 1.618,
        forbidRepeat: true,
        scale: 3,
    },
    {
        poles: 5,
        distance: 1.618,
        forbidRepeat: true,
        scale: 4,
    },
    {
        poles: 3,
        distance: 1.618,
        forbidRepeat: true,
        scale: 4,
    },
    {
        poles: 4,
        distance: 1.618,
        forbidRepeat: false,
        scale: 4,
    },
    {
        poles: 6,
        distance: 0.667,
        forbidRepeat: false,
        scale: 0.65,
    },
];

function getPreset(id: number): IPreset {
    return presets[id];
}

export {
    getPreset,
    IPreset,
};
