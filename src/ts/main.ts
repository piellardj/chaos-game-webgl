import * as GlCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import Parameters from "./parameters";

declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const FileControl: any;
declare const Range: any;
declare const Tabs: any;

function main() {
    const glParams = {
        alpha: false,
        depth: false,
        preserveDrawingBuffer: true,
    };
    if (!GlCanvas.initGL(glParams)) {
        return;
    }

    Canvas.showLoader(true);

    gl.enable(gl.BLEND);
    gl.clearColor(0, 0, 0, 1);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);

    Parameters.scale = 1;

    let needToAdjustSize = true;
    Canvas.Observers.canvasResize.push(() => needToAdjustSize = true);

    let autorun: boolean = Checkbox.isChecked("autorun-checkbox-id");
    Checkbox.addObserver("autorun-checkbox-id", (checked: boolean) => autorun = checked);

    let needToReset: boolean;
    Button.addObserver("reset-button-id", () => needToReset = true);
    Range.addObserver("poles-range-id", () => needToReset = true);
    Range.addObserver("distance-range-id", () => needToReset = true);
    Range.addObserver("quality-range-id", () => needToReset = true);
    Parameters.scaleObservers.push(() => needToReset = true);
    Canvas.Observers.mouseDrag.push(() => needToReset = true);

    let forceUpdate: boolean = false;
    Button.addObserver("next-button-id", () => forceUpdate = true);

    const game = new Game();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("Total points", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    FileControl.addDownloadObserver("result-download-id", () => {
        const canvas = Canvas.getCanvas() as HTMLCanvasElement;

        Canvas.showLoader(true);

        const size = +Tabs.getValues("result-dimensions")[0];
        const nbPointsNeeded = totalPoints * Math.pow(size / canvas.height, 2);

        /* Update CSS to allow the canvas to have the correct size */
        canvas.style.position = "absolute";
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.width = size;
        canvas.height = size;

        GlCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        gl.clear(gl.COLOR_BUFFER_BIT);
        let nbPoints = 0;
        const step = 524288;
        while (nbPoints < nbPointsNeeded) {
            nbPoints += step;
            game.computeNextPoints(step);
            game.draw();
            Canvas.setLoaderText(Math.floor(100 * nbPoints / nbPointsNeeded) + " %");
        }

        function restoreCanvas() {
            canvas.style.position = "";
            canvas.style.width = "";
            canvas.style.height = "";
            needToAdjustSize = true;
            Canvas.showLoader(false);
            Canvas.setLoaderText("");
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
    });

    let firstDraw = true;
    function mainLoop() {
        if (needToAdjustSize) {
            GlCanvas.adjustSize(true);
            Viewport.setFullCanvas(gl);
            needToAdjustSize = false;
            needToReset = true;
        }

        if (needToReset) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            setTotalPoints(0);
            needToReset = false;
        }

        if (autorun || forceUpdate) {
            const speed = Range.getValue("speed-range-id");
            const nbPoints = Math.pow(2, speed - 1);
            game.computeNextPoints(nbPoints);
            setTotalPoints(totalPoints + nbPoints);
            game.draw();

            forceUpdate = false;

            if (firstDraw) {
                firstDraw = false;
                Canvas.showLoader(false);
            }
        }

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

main();
