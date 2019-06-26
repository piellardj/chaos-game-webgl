import DrawingHandlerBase from "./drawing-handler-base";
import DrawingHandlerFixed from "./drawing-handler-fixed";
import DrawingModeMovement from "./drawing-handler-movement";
import DrawingModePreview from "./drawing-handler-preview";

const fixedMode = new DrawingHandlerFixed();
const movementMode = new DrawingModeMovement();
const previewMode = new DrawingModePreview();

export {
    DrawingHandlerBase as Base,
    fixedMode as fixed,
    movementMode as movement,
    previewMode as preview,
};
