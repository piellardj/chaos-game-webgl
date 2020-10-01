import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import * as DrawingHandlers from "./drawing-handlers/drawing-handlers";
import { Mode, Parameters } from "./parameters";

import "./page-interface-generated";

function downloadCanvas(game: Game, size: number): void {
    const canvas = Page.Canvas.getCanvas() as HTMLCanvasElement;
    const handler = (Parameters.mode === Mode.FIXED) ? DrawingHandlers.fixed : DrawingHandlers.movement;

    const nbPointsNeeded = handler.computeTotalPointsNeeded([size, size]);
    if (nbPointsNeeded > 50000000) {
        const message = "Rendering your image might take a while " +
            "because it requires to draw " + nbPointsNeeded.toLocaleString() + " points. " +
            "Do you want to proceed?";
        if (!confirm(message)) {
            return;
        }
    }

    function manuallyTriggerCanvasResizeEvent() {
        const canvasSize = Page.Canvas.getSize();
        for (const func of Page.Canvas.Observers.canvasResize) {
            func(canvasSize[0], canvasSize[1]);
        }
    }

    function isolateCanvas() {
        Page.Canvas.showLoader(true);

        canvas.style.position = "absolute";
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.width = size;
        canvas.height = size;

        manuallyTriggerCanvasResizeEvent();
        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);
    }

    function restoreCanvas() {
        canvas.style.position = "";
        canvas.style.width = "";
        canvas.style.height = "";
        Page.Canvas.showLoader(false);
        Page.Canvas.setLoaderText("");
        manuallyTriggerCanvasResizeEvent();
    }

    isolateCanvas();

    gl.clear(gl.COLOR_BUFFER_BIT);

    handler.reset();
    while (handler.needsToKeepDrawing) {
        handler.drawStep(game);
    }

    const downloadedName = "chaos-game.png";
    if ((canvas as any).msToBlob) { // for IE
        const blob = (canvas as any).msToBlob();
        window.navigator.msSaveBlob(blob, downloadedName);

        restoreCanvas();
    } else {
        canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.download = downloadedName;
            link.href = URL.createObjectURL(blob);
            link.click();

            restoreCanvas();
        });
    }
}

export default downloadCanvas;
