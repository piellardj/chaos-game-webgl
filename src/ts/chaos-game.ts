import { gl } from "./gl-utils/gl-canvas";
import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import * as ShaderManager from "./gl-utils/shader-manager";
import VBO from "./gl-utils/vbo";

import Parameters from "./parameters";

declare const Canvas: any;

class ChaosGame extends GLResource {
    private _shader: Shader;
    private _pointsVBO: VBO;

    private _nbPoints: number;

    private _nbPoles: number;
    private _poles: number[]; // relative to view

    private _viewCenter: number[];

    public constructor() {
        super(gl);

        this._viewCenter = [0, 0];

        Canvas.Observers.mouseDrag.push((dX: number, dY: number) => {
            const canvasSize = Canvas.getSize();
            const aspectRatio = canvasSize[0] / canvasSize[1];

            this._viewCenter[0] -= 2 * dX * Parameters.scale * aspectRatio;
            this._viewCenter[1] += 2 * dY * Parameters.scale;
        });

        this.recomputePolesPositions(Parameters.poles);

        this.computeNextPoints(1);

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

    public computeNextPoints(number: number): void {
        this._nbPoints = number;

        const data = this.computeXPoints(this._nbPoints);
        if (this._pointsVBO) {
            this._pointsVBO.setData(data);
        } else {
            this._pointsVBO = new VBO(gl, data, 2, gl.FLOAT, false);
        }
    }

    public draw(): void {
        const shader = this._shader;
        if (shader) {
            /* tslint:disable:no-string-literal */
            shader.a["aCoords"].VBO = this._pointsVBO;
            shader.u["uAlpha"].value = 1 / (1 + 254 * Parameters.quality);
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.POINTS, 0, this._nbPoints);
        }
    }

    private recomputePolesPositions(nbPoles: number) {
        const canvas = Canvas.getSize();
        const aspectRatio = canvas[0] / canvas[1];
        const toNormalizedCoords = (point: number[]) => {
            return [
                ((point[0] - this._viewCenter[0]) / (Parameters.scale * aspectRatio)),
                ((point[1] - this._viewCenter[1]) / Parameters.scale),
            ];
        };

        this._nbPoles = nbPoles;
        this._poles = new Array<number>(2 * nbPoles);

        const dAngle = 2 * Math.PI / nbPoles;
        const startingAngle = (nbPoles % 2 !== 0) ? dAngle / 4 : dAngle / 2;

        let minY = 0;
        let maxY = 0;
        for (let i = 0; i < nbPoles; ++i) {
            const angle = startingAngle + i * dAngle;

            this._poles[2 * i + 0] = Math.cos(angle);
            this._poles[2 * i + 1] = Math.sin(angle);

            minY = Math.min(minY, this._poles[2 * i + 1]);
            maxY = Math.max(maxY, this._poles[2 * i + 1]);
        }
        const centerY = 0.5 * (maxY + minY);

        for (let i = 0; i < nbPoles; ++i) {
            const localCoords = toNormalizedCoords(
                [this._poles[2 * i + 0], this._poles[2 * i + 1] - centerY]);

            this._poles[2 * i + 0] = localCoords[0];
            this._poles[2 * i + 1] = localCoords[1];
        }
    }

    private computeXPoints(N: number): Float32Array {
        this.recomputePolesPositions(Parameters.poles);

        const f = Parameters.distance;
        const data = new Float32Array(2 * N);

        /* Ignore the first N points because they might not be at the right place */
        data[0] = 2 * Math.random() - 1;
        data[1] = 2 * Math.random() - 1;
        for (let i = 0; i < 500; ++i) {
            const pole = 2 * Math.floor(this._nbPoles * Math.random());
            data[0] += f * (this._poles[pole + 0] - data[0]);
            data[1] += f * (this._poles[pole + 1] - data[1]);
        }

        for (let iP = 1; iP < N; ++iP) {
            const pole = 2 * Math.floor(this._nbPoles * Math.random());
            const curr = 2 * iP;
            const prev = 2 * (iP - 1);
            data[curr + 0] = data[prev + 0] + f * (this._poles[pole + 0] - data[prev + 0]);
            data[curr + 1] = data[prev + 1] + f * (this._poles[pole + 1] - data[prev + 1]);
        }

        return data;
    }
}

export default ChaosGame;
