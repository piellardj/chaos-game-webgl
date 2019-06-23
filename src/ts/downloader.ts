import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import * as Modes from "./mode/modes";
import { Mode, Parameters } from "./parameters";

declare const Canvas: any;

function downloadCanvas(game: Game, size: number): void {
    const canvas = Canvas.getCanvas() as HTMLCanvasElement;

    const nbPointsNeeded = Parameters.computeNbPointsNeeded([size, size]);
    if (nbPointsNeeded > 50000000) {
        const message = "Rendering your image might take a while " +
            "because it requires to draw " + nbPointsNeeded.toLocaleString() + " points. " +
            "Do you want to proceed?";
        if (!confirm(message)) {
            return;
        }
    }

    function isolateCanvas() {
        Canvas.showLoader(true);

        canvas.style.position = "absolute";
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.width = size;
        canvas.height = size;

        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);
    }

    function restoreCanvas() {
        canvas.style.position = "";
        canvas.style.width = "";
        canvas.style.height = "";
        Canvas.showLoader(false);
        Canvas.setLoaderText("");
    }

    isolateCanvas();

    gl.clear(gl.COLOR_BUFFER_BIT);

    const mode = (Parameters.mode === Mode.FIXED) ? Modes.fixed : Modes.movement;
    mode.reset();
    while (mode.needsToKeepDrawing) {
        mode.drawStep(game);
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
