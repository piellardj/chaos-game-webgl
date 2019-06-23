import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import DownloadCanvas from "./downloader";
import { Mode, Parameters, Theme } from "./parameters";

declare const Canvas: any;

function main() {
    initGL();

    Canvas.showLoader(true);

    Parameters.quality = 0.6;
    Parameters.colors = false;
    Parameters.presetFixed = 15;
    Parameters.presetMovement = 0;

    let needToAdjustCanvasSize = true;
    let needToClearCanvas = true;
    let needToDisplayPreview = false;
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

    let distance: number;

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

            if (needToClearCanvas || isPreview) {
                clearCanvas();
                isPreview = false;
                if (Parameters.mode === Mode.MOVEMENT) {
                    distance = Parameters.distanceFrom;
                }
            }

            if (needToDisplayPreview || Canvas.isMouseDown()) {
                const nbPoints = Math.pow(2, 17);
                game.draw(nbPoints, distance, 0);
                setTotalPoints(nbPoints);
                needToDisplayPreview = false;
                isPreview = true;
            } else {
                if (Parameters.mode === Mode.MOVEMENT) {
                    if (distance < Parameters.distanceTo) {
                        const nbPointsNeededPerStep = Parameters.nbPointsNeeded / 1000;
                        let nbPointsThisStep = 0;
                        while (nbPointsThisStep < nbPointsNeededPerStep) {
                            const nbPointsLeftToDraw =  nbPointsNeededPerStep - nbPointsThisStep;
                            const nbPoints = Math.min(Game.MAX_POINTS_PER_STEP, nbPointsLeftToDraw);
                            game.draw(nbPoints, distance, Parameters.quality);
                            setTotalPoints(totalPoints + nbPoints);
                            nbPointsThisStep += nbPoints;
                        }

                        distance += 0.002;
                    }
                } else if (totalPoints < Parameters.nbPointsNeeded) {
                    distance = Parameters.distance;

                    const nbPoints = Math.min(Game.MAX_POINTS_PER_STEP, Parameters.nbPointsNeeded - totalPoints);
                    setTotalPoints(totalPoints + nbPoints);
                    game.draw(nbPoints, distance, Parameters.quality);
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
        Parameters.clearObservers.push(() => {
            needToClearCanvas = true;
            if (Parameters.mode === Mode.MOVEMENT) {
                distance = Parameters.distanceFrom;
            }
        });
        Parameters.previewObservers.push(() => needToDisplayPreview = true);
        Canvas.Observers.canvasResize.push(() => needToAdjustCanvasSize = true);

        const initDistance = (mode: string) => {
            return distance = (mode === Mode.FIXED) ? Parameters.distance : Parameters.distanceFrom;
        };
        initDistance(Parameters.mode);
        Parameters.modeChangeObservers.push(initDistance);

        Parameters.downloadObservers.push((wantedSize: number) => {
            lockedCanvas = true;
            DownloadCanvas(game, wantedSize);
            lockedCanvas = false;
            needToAdjustCanvasSize = true;
        });
    }
}

main();
