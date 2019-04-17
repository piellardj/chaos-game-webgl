import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import Parameters from "./parameters";

declare const Canvas: any;

function downloadCanvas(game: Game, size: number, nbPointsNeeded: number): void {
    const canvas = Canvas.getCanvas() as HTMLCanvasElement;

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
    let nbPoints = 0;
    const pointsPerStep = 524288;
    while (nbPoints < nbPointsNeeded) {
        nbPoints += pointsPerStep;
        game.draw(pointsPerStep, Parameters.quality);
        Canvas.setLoaderText(Math.floor(100 * nbPoints / nbPointsNeeded) + " %");
    }

    if ((canvas as any).msToBlob) { // for IE
        const blob = (canvas as any).msToBlob();
        window.navigator.msSaveBlob(blob, "chaos-game.png");

        restoreCanvas();
    } else {
        canvas.toBlob((blob) => {
            const link = document.createElement("a");
            link.download = "chaos-game.png";
            link.href = URL.createObjectURL(blob);
            link.click();

            restoreCanvas();
        });
    }
}

export default downloadCanvas;