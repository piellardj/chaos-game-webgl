import { gl } from "./gl-utils/gl-canvas";
import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import VBO from "./gl-utils/vbo";

import ColorFromHue from "./colors";
import { Parameters } from "./parameters";

import * as Attractors from "./restriction";

import "./page-interface-generated";

interface IPointsSet {
    color: number[];
    from: number;
    size: number;
}

interface IPointsSets {
    data: Float32Array;
    sets: IPointsSet[];
}

class ChaosGame extends GLResource {
    public static MAX_POINTS_PER_STEP = Math.pow(2, 18);
    private _shader: Shader;
    private _pointsVBO: VBO;

    private _viewCenter: number[];

    public constructor() {
        super(gl);

        const fillData = new Float32Array(2);
        this._pointsVBO = new VBO(gl, fillData, 2, gl.FLOAT, false);

        this._viewCenter = [0, 0];

        Page.Canvas.Observers.mouseDrag.push((dX: number, dY: number) => {
            const aspectRatio = Page.Canvas.getAspectRatio();
            this._viewCenter[0] -= 2 * dX * Parameters.scale * aspectRatio;
            this._viewCenter[1] += 2 * dY * Parameters.scale;
        });

        Parameters.resetViewObservers.push(() => {
            this._viewCenter = [0, 0];
        });

        this.recomputePolesPositions(Parameters.poles);

        this._shader = null;
        ShaderManager.buildShader(
            {
                fragmentFilename: "points.frag",
                vertexFilename: "points.vert",
                injected: {},
            },
            (shader) => {
                if (shader !== null) {
                    this._shader = shader;
                }
            },
        );
    }

    public freeGLResources(): void {
        if (this._pointsVBO) {
            this._pointsVBO.freeGLResources();
            this._pointsVBO = null;
        }

        if (this._shader) {
            this._shader.freeGLResources();
            this._shader = null;
        }
    }

    public get isReadyToDraw(): boolean {
        return this._shader != null;
    }

    public draw(nbPoints: number, distance: number, quality: number): void {
        if (this.isReadyToDraw) {
            const pointsSets = this.computeXPoints(nbPoints, distance);
            this._pointsVBO.setData(pointsSets.data);

            /* tslint:disable:no-string-literal */
            this._shader.a["aCoords"].VBO = this._pointsVBO;

            this._shader.use();
            this._shader.bindAttributes();

            const strength = 1 / (1 + 254 * quality);
            for (const pointsSet of pointsSets.sets) {
                this._shader.u["uColor"].value = [
                    pointsSet.color[0] * strength,
                    pointsSet.color[1] * strength,
                    pointsSet.color[2] * strength,
                    1];
                this._shader.bindUniforms();
                gl.drawArrays(gl.POINTS, pointsSet.from, pointsSet.size);
            }
            /* tslint:enable:no-string-literal */
        }
    }

    private recomputePolesPositions(nbPoles: number): Float32Array {
        const aspectRatio = Page.Canvas.getAspectRatio();
        const absoluteToViewport = (point: number[]) => [
            ((point[0] - this._viewCenter[0]) / (Parameters.scale * aspectRatio)),
            ((point[1] - this._viewCenter[1]) / Parameters.scale),
        ];

        const poles = new Float32Array(2 * nbPoles);

        const dAngle = -2 * Math.PI / nbPoles;
        const startingAngle = Math.PI / 2 + ((nbPoles + 1) % 2) * dAngle / 2;

        /* May need to shift vertically in order to center the figure. */
        const centerY = 0.5 * (Math.sin(startingAngle) + Math.sin(startingAngle + Math.floor(nbPoles / 2) * dAngle));

        for (let i = 0; i < nbPoles; ++i) {
            const angle = startingAngle + i * dAngle;

            const absolute = [Math.cos(angle), Math.sin(angle) - centerY];
            const relative = absoluteToViewport(absolute);
            poles[2 * i + 0] = relative[0];
            poles[2 * i + 1] = relative[1];
        }

        return poles;
    }

    private computeXPoints(N: number, distance: number): IPointsSets {
        const nbPoles = Parameters.poles;

        Attractors.clearHistory();
        const choosePole = Attractors.getChooseFunction();

        const poles: Float32Array = this.recomputePolesPositions(nbPoles);

        /* Ignore the first N points because they might not be at the right place */
        const pos = [2 * Math.random() - 1, 2 * Math.random() - 1];

        function nextPosWithoutRotation(): number {
            const pole = choosePole(nbPoles);
            pos[0] += distance * (poles[2 * pole + 0] - pos[0]);
            pos[1] += distance * (poles[2 * pole + 1] - pos[1]);
            return pole;
        }

        const aspectRatio = Page.Canvas.getAspectRatio();
        const rotationTheta = Parameters.rotation * 0.125 * Math.PI;
        const rotationMatrix00 = Math.cos(rotationTheta) / aspectRatio;
        const rotationMatrix10 = -Math.sin(rotationTheta) / aspectRatio;
        const rotationMatrix01 = Math.sin(rotationTheta);
        const rotationMatrix11 = Math.cos(rotationTheta);
        function nextPosWithRotation(): number {
            const pole = choosePole(nbPoles);
            const dX = distance * (poles[2 * pole + 0] - pos[0]) * aspectRatio;
            const dY = distance * (poles[2 * pole + 1] - pos[1]);
            pos[0] += (dX * rotationMatrix00 + dY * rotationMatrix10);
            pos[1] += dX * rotationMatrix01 + dY * rotationMatrix11;
            return pole;
        }

        let nextPos: () => number;
        if (Parameters.rotation !== 0) {
            nextPos = nextPosWithRotation;
        } else {
            nextPos = nextPosWithoutRotation;
        }

        for (let i = 0; i < 500; ++i) {
            nextPos();
        }

        const data = new Float32Array(2 * N);
        const result = {
            data,
            sets: [],
        };

        if (Parameters.colors) {
            const maxSizePerPole = Math.floor(N / nbPoles);

            for (let i = 0; i < nbPoles; ++i) {
                result.sets.push({
                    color: ColorFromHue(i / nbPoles),
                    from: i * maxSizePerPole,
                    size: 0,
                });
            }

            for (let iP = 0; iP < N; ++iP) {
                const pole = nextPos();
                if (result.sets[pole].size + 1 < maxSizePerPole) {
                    const index = 2 * (result.sets[pole].from + result.sets[pole].size);
                    result.data[index + 0] = pos[0];
                    result.data[index + 1] = pos[1];
                    result.sets[pole].size++;
                }
            }
        } else {
            result.sets.push({
                color: [1, 1, 1],
                from: 0,
                size: N,
            });

            for (let iP = 0; iP < N; ++iP) {
                nextPos();
                const curr = 2 * iP;
                result.data[curr + 0] = pos[0];
                result.data[curr + 1] = pos[1];
            }
        }

        return result;
    }
}

export default ChaosGame;
