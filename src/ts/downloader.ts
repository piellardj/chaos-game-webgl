import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import { Mode, Parameters } from "./parameters";

declare const Canvas: any;

function downloadCanvas(game: Game, size: number, nbPointsForCurrentSize: number): void {
    const canvas = Canvas.getCanvas() as HTMLCanvasElement;
    const canvasHeight = Canvas.getSize()[1];

    /**
     * The downloaded image is usually bigger than the canvas.
     * To replicate a 512x512 canvas on a 1024x1024 image, we need to draw 4 times more points.
     */
    function adjustNbPointsForWantedSize(nbPoints: number): number {
        return nbPoints * Math.pow(size / canvasHeight, 2);
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
    const nbPointsNeeded = adjustNbPointsForWantedSize(nbPointsForCurrentSize);
    let nbPointsDrawn = 0;

    if (Parameters.mode === Mode.FIXED) {
        const pointsPerStep = 524288; // arbitrary, points per step don"t matter in fixed mode
        const distance = Parameters.distance;

        while (nbPointsDrawn < nbPointsNeeded) {
            nbPointsDrawn += pointsPerStep;
            game.draw(pointsPerStep, distance, Parameters.quality);
            // Canvas.setLoaderText(Math.floor(100 * nbPointsDrawn / nbPointsNeeded) + " %");
        }
    } else {
        const pointsPerStep = adjustNbPointsForWantedSize(Math.pow(2, Parameters.speed - 1));
        let distance = Parameters.distanceFrom;

        while (nbPointsDrawn < nbPointsNeeded) {
            distance += 0.002;
            if (distance > Parameters.distanceTo) {
                distance = Parameters.distanceFrom;
            }

            nbPointsDrawn += pointsPerStep;
            game.draw(pointsPerStep, distance, Parameters.quality);
            // Canvas.setLoaderText(Math.floor(100 * nbPointsDrawn / nbPointsNeeded) + " %");
        }
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
