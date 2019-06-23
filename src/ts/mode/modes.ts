import ModeFixed from "./mode-fixed";
import ModeMovement from "./mode-movement";
import ModePreview from "./mode-preview";

const fixedMode = new ModeFixed();
const movementMode = new ModeMovement();
const previewMode = new ModePreview();

export {
    fixedMode as fixed,
    movementMode as movement,
    previewMode as preview,
};
