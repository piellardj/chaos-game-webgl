import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import DownloadCanvas from "./downloader";
import { Mode, Parameters, Theme } from "./parameters";

import ModeBase from "./mode/mode-base";
import * as Modes from "./mode/modes";

declare const Canvas: any;

function main() {
    initGL();

    Canvas.showLoader(true);

    Parameters.quality = 0.6;
    Parameters.colors = false;
    Parameters.presetFixed = 15;
    Parameters.presetMovement = 0;

    let needToClearCanvas = true;
    let lockedCanvas = false;
    bindEvents();

    const game = new Game();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("points-drawn", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    function clearCanvas() {
        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);

        if (Parameters.theme === Theme.LIGHT) {
            gl.clearColor(1, 1, 1, 1);
            gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
        } else {
            gl.clearColor(0, 0, 0, 1);
            gl.blendEquation(gl.FUNC_ADD);
        }

        gl.clear(gl.COLOR_BUFFER_BIT);
        setTotalPoints(0);
        needToClearCanvas = false;
    }

    let mode: ModeBase;

    let firstDraw = true;
    function mainLoop() {
        if (!lockedCanvas) {
            if (needToClearCanvas) {
                clearCanvas();
                mode = (Parameters.mode ===  Mode.FIXED) ? Modes.fixed : Modes.movement;
                mode.reset();
            }

            if (Canvas.isMouseDown()) {
                Modes.preview.drawStep(game);
                setTotalPoints(Modes.preview.totalPointsDrawn);
                needToClearCanvas = true;
            } else {
                if (mode.needsToKeepDrawing) {
                    mode.drawStep(game);
                    setTotalPoints(mode.totalPointsDrawn);
                }

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
        gl.blendFunc(gl.ONE, gl.ONE);
    }

    function bindEvents() {
        Parameters.clearObservers.push(() => needToClearCanvas = true);

        Parameters.downloadObservers.push((wantedSize: number) => {
            lockedCanvas = true;
            DownloadCanvas(game, wantedSize);
            lockedCanvas = false;
            needToClearCanvas = true;
        });
    }
}

main();
