import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import Parameters from "./parameters";

declare const Button: any;
declare const Canvas: any;

function main() {
    initGL();

    Canvas.showLoader(true);

    Parameters.quality = 0.6;
    Parameters.speed = 17;
    Parameters.autorun = true;
    Parameters.colors = false;
    Parameters.preset = 7;

    let needToAdjustCanvasSize = true;
    let needToClearCanvas = true;
    let needToDisplayPreview = false;
    let lockedCanvas = false;
    bindEvents();

    const game = new Game();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("Total points", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    function clearCanvas() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        setTotalPoints(0);
        needToClearCanvas = false;
    }

    let isPreview = false;
    let firstDraw = true;
    function mainLoop() {
        if (!lockedCanvas) {
            if (needToAdjustCanvasSize) {
                GLCanvas.adjustSize();
                Viewport.setFullCanvas(gl);
                needToAdjustCanvasSize = false;
                needToClearCanvas = true;
            }

            needToClearCanvas = needToClearCanvas || (isPreview && Parameters.autorun);
            if (needToClearCanvas) {
                clearCanvas();
                isPreview = false;
            }

            if (needToDisplayPreview) {
                const nbPoints = Math.pow(2, 17);
                game.draw(nbPoints, 0);
                setTotalPoints(nbPoints);
                needToDisplayPreview = false;
                isPreview = true;
            }

            if (Parameters.autorun) {
                const nbPoints = Math.pow(2, Parameters.speed - 1);
                setTotalPoints(totalPoints + nbPoints);
                game.draw(nbPoints, Parameters.quality);

                if (firstDraw) {
                    firstDraw = false;
                    Canvas.showLoader(false);
                }
            }
        }

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);

    function initGL() {
        const glParams = {
            alpha: false,
            antialias: false,
            depth: false,
            preserveDrawingBuffer: true,
        };
        if (!GLCanvas.initGL(glParams)) {
            return;
        }

        gl.enable(gl.BLEND);
        gl.clearColor(0, 0, 0, 1);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);
    }

    function bindEvents() {
        Parameters.clearObservers.push(() => needToClearCanvas = true);
        Parameters.previewObservers.push(() => needToDisplayPreview = true);
        Canvas.Observers.canvasResize.push(() => needToAdjustCanvasSize = true);

        Parameters.downloadObservers.push(drawAndDownloadResult);
    }

    function drawAndDownloadResult(size: number): void {
        const canvas = Canvas.getCanvas() as HTMLCanvasElement;
        const nbPointsNeeded = totalPoints * Math.pow(size / canvas.height, 2);
        lockedCanvas = true;

        Canvas.showLoader(true);

        /* Update CSS to allow the canvas to have the correct size */
        canvas.style.position = "absolute";
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.width = size;
        canvas.height = size;

        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        gl.clear(gl.COLOR_BUFFER_BIT);
        let nbPoints = 0;
        const pointsPerStep = 524288;
        while (nbPoints < nbPointsNeeded) {
            nbPoints += pointsPerStep;
            game.draw(pointsPerStep, Parameters.quality);
            Canvas.setLoaderText(Math.floor(100 * nbPoints / nbPointsNeeded) + " %");
        }

        function restoreCanvas() {
            canvas.style.position = "";
            canvas.style.width = "";
            canvas.style.height = "";
            Canvas.showLoader(false);
            Canvas.setLoaderText("");
            needToAdjustCanvasSize = true;
            lockedCanvas = false;
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
}

main();
