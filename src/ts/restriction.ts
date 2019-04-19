import Parameters from "./parameters";

enum Restriction {
    NONE = "none", // no restriction
    NO_REPEAT = "no-repeat", // not the same twice in a row
    NO_DOUBLE_REPEAT = "no-double-repeat", // not the same 3 times in a row,
    NO_NEIGHBOUR = "no-neighbour", // not a neighbour of previous
    NO_NEIGHBOUR_AFTER_REPEAT = "no-neighbour-after-repeat", // no neighbour of previous if last 2 were the same
    NO_RIGHT_NEIGHBOUR = "no-right-neighbour", // not the right neighbour of previous
}

type ChooseFunction = (nbPoles: number) => number;

function getChooseFunction(): ChooseFunction {
    switch (Parameters.restriction) {
        case Restriction.NONE:
            return chooseAny;
        case Restriction.NO_REPEAT:
            return chooseNoRepeat;
        case Restriction.NO_DOUBLE_REPEAT:
            return chooseNoDoubleRepeat;
        case Restriction.NO_NEIGHBOUR:
            return chooseNoNeighbour;
        case Restriction.NO_NEIGHBOUR_AFTER_REPEAT:
            return chooseNoNeighbourAfterRepeat;
        case Restriction.NO_RIGHT_NEIGHBOUR:
            return chooseNoRightNeighbour;
        default:
            return null;
    }
}

let lastChoice: number = -1;
let lastChoices: number[] = [-1, -1];
let lastIndex: number = 0;

function clearHistory() {
    lastChoice = -1;
    lastChoices = [-1, -1];
    lastIndex = 0;
}

function chooseAny(nbPoles: number): number {
    return Math.floor(nbPoles * Math.random());
}

function chooseNoRepeat(nbPoles: number): number {
    let pole: number;

    do {
        pole = chooseAny(nbPoles);
    } while (pole === lastChoice);

    lastChoice = pole;
    return pole;
}

function chooseNoDoubleRepeat(nbPoles: number): number {
    let pole: number;

    const oneRepeatAlready = (lastChoices[0] === lastChoices[1]);
    do {
        pole = chooseAny(nbPoles);
    } while (oneRepeatAlready && lastChoices[0] === pole);

    lastIndex = (lastIndex + 1) % 2;
    lastChoices[lastIndex] = pole;

    return pole;
}

function chooseNoNeighbour(nbPoles: number): number {
    let pole: number;

    do {
        pole = chooseAny(nbPoles);
    } while (((pole + 1) % nbPoles) === lastChoice || ((pole + nbPoles - 1) % nbPoles) === lastChoice);

    lastChoice = pole;
    return pole;
}

function chooseNoNeighbourAfterRepeat(nbPoles: number): number {
    let pole: number;

    const oneRepeatAlready = (lastChoices[0] === lastChoices[1]);
    do {
        pole = chooseAny(nbPoles);
    } while (oneRepeatAlready &&
        (((pole + 1) % nbPoles) === lastChoices[0] || ((pole + nbPoles - 1) % nbPoles) === lastChoices[0]));

    lastIndex = (lastIndex + 1) % 2;
    lastChoices[lastIndex] = pole;

    return pole;
}

function chooseNoRightNeighbour(nbPoles: number): number {
    let pole: number;

    do {
        pole = chooseAny(nbPoles);
    } while (((pole + 1) % nbPoles) === lastChoice);

    lastChoice = pole;
    return pole;
}

export {
    clearHistory,
    getChooseFunction,

    Restriction,
};
