import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
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
    let nbPointsDrawn = 0;

    if (Parameters.mode === Mode.FIXED) {
        const pointsPerStep = Math.pow(2, 19); // arbitrary, points per step don"t matter in fixed mode
        const distance = Parameters.distance;

        while (nbPointsDrawn < nbPointsNeeded) {
            nbPointsDrawn += pointsPerStep;
            game.draw(pointsPerStep, distance, Parameters.quality);
            // Canvas.setLoaderText(Math.floor(100 * nbPointsDrawn / nbPointsNeeded) + " %");
        }
    } else /* if (Parameters.mode === Mode.MOVEMENT) */ {
        const pointsAtOnce = Math.pow(2, 19);
        let distance = Parameters.distanceFrom;

        while (distance < Parameters.distanceTo) {
            const nbPointsNeededPerStep = nbPointsNeeded / 1000;
            let nbPointsThisStep = 0;
            while (nbPointsThisStep < nbPointsNeededPerStep) {
                const nbPoints = Math.min(pointsAtOnce, nbPointsNeededPerStep - nbPointsThisStep);
                game.draw(nbPoints, distance, Parameters.quality);
                nbPointsThisStep += nbPoints;
            }

            distance += 0.002;
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
