import * as GlCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Game from "./chaos-game";
import Parameters from "./parameters";

declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const Range: any;

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
