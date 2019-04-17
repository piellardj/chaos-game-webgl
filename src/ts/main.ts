import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import DownloadCanvas from "./downloader";
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

        Parameters.downloadObservers.push((wantedSize: number) => {
            lockedCanvas = true;
            const canvasHeight = Canvas.getSize()[1];
            const nbPointsNeeded = totalPoints * Math.pow(wantedSize / canvasHeight, 2);
            DownloadCanvas(game, wantedSize, nbPointsNeeded);
            lockedCanvas = false;
            needToAdjustCanvasSize = true;
        });
    }
}

main();
