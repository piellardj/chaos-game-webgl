/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/chaos-game.ts":
/*!******************************!*\
  !*** ./src/ts/chaos-game.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts");
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var ShaderManager = __importStar(__webpack_require__(/*! ./gl-utils/shader-manager */ "./src/ts/gl-utils/shader-manager.ts"));
var vbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/vbo */ "./src/ts/gl-utils/vbo.ts"));
var colors_1 = __importDefault(__webpack_require__(/*! ./colors */ "./src/ts/colors.ts"));
var parameters_1 = __importDefault(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
var ChaosGame = (function (_super) {
    __extends(ChaosGame, _super);
    function ChaosGame() {
        var _this = _super.call(this, gl_canvas_1.gl) || this;
        var fillData = new Float32Array(2);
        _this._pointsVBO = new vbo_1.default(gl_canvas_1.gl, fillData, 2, gl_canvas_1.gl.FLOAT, false);
        _this._viewCenter = [0, 0];
        Canvas.Observers.mouseDrag.push(function (dX, dY) {
            var canvasSize = Canvas.getSize();
            var aspectRatio = canvasSize[0] / canvasSize[1];
            _this._viewCenter[0] -= 2 * dX * parameters_1.default.scale * aspectRatio;
            _this._viewCenter[1] += 2 * dY * parameters_1.default.scale;
        });
        parameters_1.default.resetViewObservers.push(function () {
            _this._viewCenter = [0, 0];
        });
        _this.recomputePolesPositions(parameters_1.default.poles);
        _this._shader = null;
        ShaderManager.buildShader({
            fragmentFilename: "points.frag",
            vertexFilename: "points.vert",
            injected: {},
        }, function (shader) {
            if (shader !== null) {
                _this._shader = shader;
            }
        });
        return _this;
    }
    ChaosGame.prototype.freeGLResources = function () {
        if (this._pointsVBO) {
            this._pointsVBO.freeGLResources();
            this._pointsVBO = null;
        }
        if (this._shader) {
            this._shader.freeGLResources();
            this._shader = null;
        }
    };
    ChaosGame.prototype.draw = function (nbPoints, distance, quality) {
        var shader = this._shader;
        if (shader) {
            var pointsSets = this.computeXPoints(nbPoints, distance);
            this._pointsVBO.setData(pointsSets.data);
            shader.a["aCoords"].VBO = this._pointsVBO;
            shader.use();
            shader.bindAttributes();
            var strength = 1 / (1 + 254 * quality);
            for (var _i = 0, _a = pointsSets.sets; _i < _a.length; _i++) {
                var pointsSet = _a[_i];
                shader.u["uColor"].value = [
                    pointsSet.color[0] * strength,
                    pointsSet.color[1] * strength,
                    pointsSet.color[2] * strength,
                    1
                ];
                shader.bindUniforms();
                gl_canvas_1.gl.drawArrays(gl_canvas_1.gl.POINTS, pointsSet.from, pointsSet.size);
            }
        }
    };
    ChaosGame.prototype.recomputePolesPositions = function (nbPoles) {
        var _this = this;
        var canvas = Canvas.getSize();
        var aspectRatio = canvas[0] / canvas[1];
        var absoluteToViewport = function (point) { return [
            ((point[0] - _this._viewCenter[0]) / (parameters_1.default.scale * aspectRatio)),
            ((point[1] - _this._viewCenter[1]) / parameters_1.default.scale),
        ]; };
        var poles = new Float32Array(2 * nbPoles);
        var dAngle = -2 * Math.PI / nbPoles;
        var startingAngle = Math.PI / 2 + ((nbPoles + 1) % 2) * dAngle / 2;
        var centerY = 0.5 * (Math.sin(startingAngle) + Math.sin(startingAngle + Math.floor(nbPoles / 2) * dAngle));
        for (var i = 0; i < nbPoles; ++i) {
            var angle = startingAngle + i * dAngle;
            var absolute = [Math.cos(angle), Math.sin(angle) - centerY];
            var relative = absoluteToViewport(absolute);
            poles[2 * i + 0] = relative[0];
            poles[2 * i + 1] = relative[1];
        }
        return poles;
    };
    ChaosGame.prototype.computeXPoints = function (N, distance) {
        var nbPoles = parameters_1.default.poles;
        var chooseAnyPole = function () {
            return Math.floor(nbPoles * Math.random());
        };
        var previousPole = -1;
        var chooseDifferentPole = function () {
            var pole;
            do {
                pole = chooseAnyPole();
            } while (pole === previousPole);
            previousPole = pole;
            return pole;
        };
        var choosePole = parameters_1.default.forbidRepeat ? chooseDifferentPole : chooseAnyPole;
        var poles = this.recomputePolesPositions(nbPoles);
        var pos = [2 * Math.random() - 1, 2 * Math.random() - 1];
        function nextPos() {
            var pole = choosePole();
            pos[0] += distance * (poles[2 * pole + 0] - pos[0]);
            pos[1] += distance * (poles[2 * pole + 1] - pos[1]);
            return pole;
        }
        for (var i = 0; i < 500; ++i) {
            nextPos();
        }
        var data = new Float32Array(2 * N);
        var result = {
            data: data,
            sets: [],
        };
        if (parameters_1.default.colors) {
            var maxSizePerPole = Math.floor(N / nbPoles);
            for (var i = 0; i < nbPoles; ++i) {
                result.sets.push({
                    color: colors_1.default(i / nbPoles),
                    from: i * maxSizePerPole,
                    size: 0,
                });
            }
            for (var iP = 0; iP < N; ++iP) {
                var pole = nextPos();
                if (result.sets[pole].size + 1 < maxSizePerPole) {
                    var index = 2 * (result.sets[pole].from + result.sets[pole].size);
                    result.data[index + 0] = pos[0];
                    result.data[index + 1] = pos[1];
                    result.sets[pole].size++;
                }
            }
        }
        else {
            result.sets.push({
                color: [1, 1, 1],
                from: 0,
                size: N,
            });
            for (var iP = 0; iP < N; ++iP) {
                nextPos();
                var curr = 2 * iP;
                result.data[curr + 0] = pos[0];
                result.data[curr + 1] = pos[1];
            }
        }
        return result;
    };
    return ChaosGame;
}(gl_resource_1.default));
exports.default = ChaosGame;


/***/ }),

/***/ "./src/ts/colors.ts":
/*!**************************!*\
  !*** ./src/ts/colors.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function ColorFromHue(hue) {
    var r = 0;
    var g = 0;
    var b = 0;
    hue = (hue % 1) * 6;
    if (hue < 1) {
        r = 1;
        g = hue;
    }
    else if (hue < 2) {
        r = 2 - hue;
        g = 1;
    }
    else if (hue < 3) {
        g = 1;
        b = hue - 2;
    }
    else if (hue < 4) {
        g = 4 - hue;
        b = 1;
    }
    else if (hue < 5) {
        r = hue - 4;
        b = 1;
    }
    else if (hue < 6) {
        r = 1;
        b = 6 - hue;
    }
    return [r, g, b];
}
exports.default = ColorFromHue;


/***/ }),

/***/ "./src/ts/downloader.ts":
/*!******************************!*\
  !*** ./src/ts/downloader.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GLCanvas = __importStar(__webpack_require__(/*! ./gl-utils/gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts"));
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts");
var viewport_1 = __importDefault(__webpack_require__(/*! ./gl-utils/viewport */ "./src/ts/gl-utils/viewport.ts"));
var parameters_1 = __importDefault(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
function downloadCanvas(game, size, nbPointsForCurrentSize) {
    var canvas = Canvas.getCanvas();
    var canvasHeight = Canvas.getSize()[1];
    function adjustNbPointsForWantedSize(nbPoints) {
        return nbPoints * Math.pow(size / canvasHeight, 2);
    }
    function isolateCanvas() {
        Canvas.showLoader(true);
        canvas.style.position = "absolute";
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";
        canvas.width = size;
        canvas.height = size;
        GLCanvas.adjustSize();
        viewport_1.default.setFullCanvas(gl_canvas_1.gl);
    }
    function restoreCanvas() {
        canvas.style.position = "";
        canvas.style.width = "";
        canvas.style.height = "";
        Canvas.showLoader(false);
        Canvas.setLoaderText("");
    }
    isolateCanvas();
    gl_canvas_1.gl.clear(gl_canvas_1.gl.COLOR_BUFFER_BIT);
    var nbPointsNeeded = adjustNbPointsForWantedSize(nbPointsForCurrentSize);
    var nbPointsDrawn = 0;
    if (parameters_1.default.mode === "fixed") {
        var pointsPerStep = 524288;
        var distance = parameters_1.default.distance;
        while (nbPointsDrawn < nbPointsNeeded) {
            nbPointsDrawn += pointsPerStep;
            game.draw(pointsPerStep, distance, parameters_1.default.quality);
        }
    }
    else {
        var pointsPerStep = adjustNbPointsForWantedSize(Math.pow(2, parameters_1.default.speed - 1));
        var distance = parameters_1.default.distanceFrom;
        while (nbPointsDrawn < nbPointsNeeded) {
            distance += 0.002;
            if (distance > parameters_1.default.distanceTo) {
                distance = parameters_1.default.distanceFrom;
            }
            nbPointsDrawn += pointsPerStep;
            game.draw(pointsPerStep, distance, parameters_1.default.quality);
        }
    }
    var downloadedName = "chaos-game.png";
    if (canvas.msToBlob) {
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, downloadedName);
        restoreCanvas();
    }
    else {
        canvas.toBlob(function (blob) {
            var link = document.createElement("a");
            link.download = downloadedName;
            link.href = URL.createObjectURL(blob);
            link.click();
            restoreCanvas();
        });
    }
}
exports.default = downloadCanvas;


/***/ }),

/***/ "./src/ts/gl-utils/gl-canvas.ts":
/*!**************************************!*\
  !*** ./src/ts/gl-utils/gl-canvas.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gl = null;
exports.gl = gl;
function initGL(flags) {
    function setError(message) {
        Demopage.setErrorMessage("webgl-support", message);
    }
    var canvas = Canvas.getCanvas();
    exports.gl = gl = canvas.getContext("webgl", flags);
    if (gl == null) {
        exports.gl = gl = canvas.getContext("experimental-webgl", flags);
        if (gl == null) {
            setError("Your browser or device does not seem to support WebGL.");
            return false;
        }
        setError("Your browser or device only supports experimental WebGL.\n" +
            "The simulation may not run as expected.");
    }
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 1);
    return true;
}
exports.initGL = initGL;
function adjustSize(hidpi) {
    if (hidpi === void 0) { hidpi = false; }
    var cssPixel = (hidpi) ? window.devicePixelRatio : 1;
    var width = Math.floor(gl.canvas.clientWidth * cssPixel);
    var height = Math.floor(gl.canvas.clientHeight * cssPixel);
    if (gl.canvas.width !== width || gl.canvas.height !== height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}
exports.adjustSize = adjustSize;


/***/ }),

/***/ "./src/ts/gl-utils/gl-resource.ts":
/*!****************************************!*\
  !*** ./src/ts/gl-utils/gl-resource.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GLResource = (function () {
    function GLResource(gl) {
        this._gl = gl;
    }
    GLResource.prototype.gl = function () {
        return this._gl;
    };
    return GLResource;
}());
exports.default = GLResource;


/***/ }),

/***/ "./src/ts/gl-utils/shader-manager.ts":
/*!*******************************************!*\
  !*** ./src/ts/gl-utils/shader-manager.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_canvas_1 = __webpack_require__(/*! ./gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts");
var shader_1 = __importDefault(__webpack_require__(/*! ./shader */ "./src/ts/gl-utils/shader.ts"));
var ShaderSources = __importStar(__webpack_require__(/*! ./shader-sources */ "./src/ts/gl-utils/shader-sources.ts"));
var cachedShaders = {};
function getShader(name) {
    return cachedShaders[name].shader;
}
exports.getShader = getShader;
function buildShader(infos, callback) {
    var sourcesPending = 2;
    var sourcesFailed = 0;
    function loadedSource(success) {
        function processSource(source) {
            return source.replace(/#INJECT\((.*)\)/mg, function (match, name) {
                if (infos.injected[name]) {
                    return infos.injected[name];
                }
                return match;
            });
        }
        sourcesPending--;
        if (!success) {
            sourcesFailed++;
        }
        if (sourcesPending === 0) {
            var shader = null;
            if (sourcesFailed === 0) {
                var vert = ShaderSources.getSource(infos.vertexFilename);
                var frag = ShaderSources.getSource(infos.fragmentFilename);
                var processedVert = processSource(vert);
                var processedFrag = processSource(frag);
                shader = new shader_1.default(gl_canvas_1.gl, processedVert, processedFrag);
            }
            callback(shader);
        }
    }
    ShaderSources.loadSource(infos.vertexFilename, loadedSource);
    ShaderSources.loadSource(infos.fragmentFilename, loadedSource);
}
exports.buildShader = buildShader;
function registerShader(name, infos, callback) {
    function callAndClearCallbacks(cached) {
        for (var _i = 0, _a = cached.callbacks; _i < _a.length; _i++) {
            var cachedCallback = _a[_i];
            cachedCallback(!cached.failed, cached.shader);
        }
        cached.callbacks = [];
    }
    if (typeof cachedShaders[name] === "undefined") {
        cachedShaders[name] = {
            callbacks: [callback],
            failed: false,
            infos: infos,
            pending: true,
            shader: null,
        };
        var cached_1 = cachedShaders[name];
        buildShader(infos, function (builtShader) {
            cached_1.pending = false;
            cached_1.failed = builtShader === null;
            cached_1.shader = builtShader;
            callAndClearCallbacks(cached_1);
        });
    }
    else {
        var cached = cachedShaders[name];
        if (cached.pending === true) {
            cached.callbacks.push(callback);
        }
        else {
            callAndClearCallbacks(cached);
        }
    }
}
exports.registerShader = registerShader;
function deleteShader(name) {
    if (cachedShaders[name]) {
        if (cachedShaders[name].shader) {
            cachedShaders[name].shader.freeGLResources();
        }
        delete cachedShaders[name];
    }
}
exports.deleteShader = deleteShader;


/***/ }),

/***/ "./src/ts/gl-utils/shader-sources.ts":
/*!*******************************************!*\
  !*** ./src/ts/gl-utils/shader-sources.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cachedSources = {};
function loadSource(filename, callback) {
    function callAndClearCallbacks(cached) {
        for (var _i = 0, _a = cached.callbacks; _i < _a.length; _i++) {
            var cachedCallback = _a[_i];
            cachedCallback(!cached.failed);
        }
        cached.callbacks = [];
    }
    if (typeof cachedSources[filename] === "undefined") {
        cachedSources[filename] = {
            callbacks: [callback],
            failed: false,
            pending: true,
            text: null,
        };
        var cached_1 = cachedSources[filename];
        var xhr_1 = new XMLHttpRequest();
        xhr_1.open("GET", "./shaders/" + filename, true);
        xhr_1.onload = function () {
            if (xhr_1.readyState === 4) {
                cached_1.pending = false;
                if (xhr_1.status === 200) {
                    cached_1.text = xhr_1.responseText;
                    cached_1.failed = false;
                }
                else {
                    console.error("Cannot load '" + filename + "' shader source: " + xhr_1.statusText);
                    cached_1.failed = true;
                }
                callAndClearCallbacks(cached_1);
            }
        };
        xhr_1.onerror = function () {
            console.error("Cannot load '" + filename + "' shader source: " + xhr_1.statusText);
            cached_1.pending = false;
            cached_1.failed = true;
            callAndClearCallbacks(cached_1);
        };
        xhr_1.send(null);
    }
    else {
        var cached = cachedSources[filename];
        if (cached.pending === true) {
            cached.callbacks.push(callback);
        }
        else {
            cached.callbacks = [callback];
            callAndClearCallbacks(cached);
        }
    }
}
exports.loadSource = loadSource;
function getSource(filename) {
    return cachedSources[filename].text;
}
exports.getSource = getSource;


/***/ }),

/***/ "./src/ts/gl-utils/shader.ts":
/*!***********************************!*\
  !*** ./src/ts/gl-utils/shader.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
function notImplemented(gl, location, value) {
    alert("NOT IMPLEMENTED YET");
}
function bindUniformFloat(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1fv(location, value);
    }
    else {
        gl.uniform1f(location, value);
    }
}
function bindUniformFloat2v(gl, location, value) {
    gl.uniform2fv(location, value);
}
function bindUniformFloat3v(gl, location, value) {
    gl.uniform3fv(location, value);
}
function bindUniformFloat4v(gl, location, value) {
    gl.uniform4fv(location, value);
}
function bindUniformInt(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1iv(location, value);
    }
    else {
        gl.uniform1iv(location, value);
    }
}
function bindUniformInt2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformInt3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformInt4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformBool(gl, location, value) {
    gl.uniform1i(location, +value);
}
function bindUniformBool2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformBool3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformBool4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformFloatMat2(gl, location, value) {
    gl.uniformMatrix2fv(location, false, value);
}
function bindUniformFloatMat3(gl, location, value) {
    gl.uniformMatrix3fv(location, false, value);
}
function bindUniformFloatMat4(gl, location, value) {
    gl.uniformMatrix4fv(location, false, value);
}
function bindSampler2D(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl["TEXTURE" + unitNb]);
    gl.bindTexture(gl.TEXTURE_2D, value);
}
function bindSamplerCube(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl["TEXTURE" + unitNb]);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, value);
}
var types = {
    0x8B50: { str: "FLOAT_VEC2", binder: bindUniformFloat2v },
    0x8B51: { str: "FLOAT_VEC3", binder: bindUniformFloat3v },
    0x8B52: { str: "FLOAT_VEC4", binder: bindUniformFloat4v },
    0x8B53: { str: "INT_VEC2", binder: bindUniformInt2v },
    0x8B54: { str: "INT_VEC3", binder: bindUniformInt3v },
    0x8B55: { str: "INT_VEC4", binder: bindUniformInt4v },
    0x8B56: { str: "BOOL", binder: bindUniformBool },
    0x8B57: { str: "BOOL_VEC2", binder: bindUniformBool2v },
    0x8B58: { str: "BOOL_VEC3", binder: bindUniformBool3v },
    0x8B59: { str: "BOOL_VEC4", binder: bindUniformBool4v },
    0x8B5A: { str: "FLOAT_MAT2", binder: bindUniformFloatMat2 },
    0x8B5B: { str: "FLOAT_MAT3", binder: bindUniformFloatMat3 },
    0x8B5C: { str: "FLOAT_MAT4", binder: bindUniformFloatMat4 },
    0x8B5E: { str: "SAMPLER_2D", binder: bindSampler2D },
    0x8B60: { str: "SAMPLER_CUBE", binder: bindSamplerCube },
    0x1400: { str: "BYTE", binder: notImplemented },
    0x1401: { str: "UNSIGNED_BYTE", binder: notImplemented },
    0x1402: { str: "SHORT", binder: notImplemented },
    0x1403: { str: "UNSIGNED_SHORT", binder: notImplemented },
    0x1404: { str: "INT", binder: bindUniformInt },
    0x1405: { str: "UNSIGNED_INT", binder: notImplemented },
    0x1406: { str: "FLOAT", binder: bindUniformFloat },
};
var ShaderProgram = (function (_super) {
    __extends(ShaderProgram, _super);
    function ShaderProgram(gl, vertexSource, fragmentSource) {
        var _this = this;
        function createShader(type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compileSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compileSuccess) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        _this = _super.call(this, gl) || this;
        _this.id = null;
        _this.uCount = 0;
        _this.aCount = 0;
        var vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
        var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
        var id = gl.createProgram();
        gl.attachShader(id, vertexShader);
        gl.attachShader(id, fragmentShader);
        gl.linkProgram(id);
        var linkSuccess = gl.getProgramParameter(id, gl.LINK_STATUS);
        if (!linkSuccess) {
            console.error(gl.getProgramInfoLog(id));
            gl.deleteProgram(id);
        }
        else {
            _this.id = id;
            _this.introspection();
        }
        return _this;
    }
    ShaderProgram.prototype.freeGLResources = function () {
        _super.prototype.gl.call(this).deleteProgram(this.id);
        this.id = null;
    };
    ShaderProgram.prototype.use = function () {
        _super.prototype.gl.call(this).useProgram(this.id);
    };
    ShaderProgram.prototype.bindUniforms = function () {
        var _this = this;
        var gl = _super.prototype.gl.call(this);
        var currTextureUnitNb = 0;
        Object.keys(this.u).forEach(function (uName) {
            var uniform = _this.u[uName];
            if (uniform.value !== null) {
                if (uniform.type === 0x8B5E || uniform.type === 0x8B60) {
                    var unitNb = currTextureUnitNb;
                    types[uniform.type].binder(gl, uniform.loc, unitNb, uniform.value);
                    currTextureUnitNb++;
                }
                else {
                    types[uniform.type].binder(gl, uniform.loc, uniform.value);
                }
            }
        });
    };
    ShaderProgram.prototype.bindAttributes = function () {
        var _this = this;
        Object.keys(this.a).forEach(function (aName) {
            var attribute = _this.a[aName];
            if (attribute.VBO !== null) {
                attribute.VBO.bind(attribute.loc);
            }
        });
    };
    ShaderProgram.prototype.bindUniformsAndAttributes = function () {
        this.bindUniforms();
        this.bindAttributes();
    };
    ShaderProgram.prototype.introspection = function () {
        var gl = _super.prototype.gl.call(this);
        this.uCount = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
        this.u = [];
        for (var i = 0; i < this.uCount; ++i) {
            var uniform = gl.getActiveUniform(this.id, i);
            var name_1 = uniform.name;
            this.u[name_1] = {
                loc: gl.getUniformLocation(this.id, name_1),
                size: uniform.size,
                type: uniform.type,
                value: null,
            };
        }
        this.aCount = gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
        this.a = [];
        for (var i = 0; i < this.aCount; ++i) {
            var attribute = gl.getActiveAttrib(this.id, i);
            var name_2 = attribute.name;
            this.a[name_2] = {
                VBO: null,
                loc: gl.getAttribLocation(this.id, name_2),
                size: attribute.size,
                type: attribute.type,
            };
        }
    };
    return ShaderProgram;
}(gl_resource_1.default));
exports.default = ShaderProgram;


/***/ }),

/***/ "./src/ts/gl-utils/vbo.ts":
/*!********************************!*\
  !*** ./src/ts/gl-utils/vbo.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var Usage;
(function (Usage) {
    Usage[Usage["DYNAMIC"] = 0] = "DYNAMIC";
    Usage[Usage["STATIC"] = 1] = "STATIC";
})(Usage || (Usage = {}));
var VBO = (function (_super) {
    __extends(VBO, _super);
    function VBO(gl, array, size, type, staticUsage) {
        if (staticUsage === void 0) { staticUsage = true; }
        var _this = _super.call(this, gl) || this;
        _this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.id);
        if (staticUsage) {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        }
        else {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        _this.size = size;
        _this.type = type;
        _this.normalize = false;
        _this.stride = 0;
        _this.offset = 0;
        _this.usage = (staticUsage) ? Usage.STATIC : Usage.DYNAMIC;
        return _this;
    }
    VBO.createQuad = function (gl, minX, minY, maxX, maxY) {
        var vert = [
            minX, minY,
            maxX, minY,
            minX, maxY,
            maxX, maxY,
        ];
        return new VBO(gl, new Float32Array(vert), 2, gl.FLOAT, true);
    };
    VBO.prototype.freeGLResources = function () {
        this.gl().deleteBuffer(this.id);
        this.id = null;
    };
    VBO.prototype.bind = function (location) {
        var gl = _super.prototype.gl.call(this);
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.vertexAttribPointer(location, this.size, this.type, this.normalize, this.stride, this.offset);
    };
    VBO.prototype.setData = function (array) {
        var gl = _super.prototype.gl.call(this);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        if (this.usage === Usage.STATIC) {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        }
        else {
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    return VBO;
}(gl_resource_1.default));
exports.default = VBO;


/***/ }),

/***/ "./src/ts/gl-utils/viewport.ts":
/*!*************************************!*\
  !*** ./src/ts/gl-utils/viewport.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Viewport = (function () {
    function Viewport(left, lower, width, height) {
        this.left = left;
        this.lower = lower;
        this.width = width;
        this.height = height;
    }
    Viewport.setFullCanvas = function (gl) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    Viewport.prototype.set = function (gl) {
        gl.viewport(this.lower, this.left, this.width, this.height);
    };
    return Viewport;
}());
exports.default = Viewport;


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GLCanvas = __importStar(__webpack_require__(/*! ./gl-utils/gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts"));
var gl_canvas_1 = __webpack_require__(/*! ./gl-utils/gl-canvas */ "./src/ts/gl-utils/gl-canvas.ts");
var viewport_1 = __importDefault(__webpack_require__(/*! ./gl-utils/viewport */ "./src/ts/gl-utils/viewport.ts"));
var downloader_1 = __importDefault(__webpack_require__(/*! ./downloader */ "./src/ts/downloader.ts"));
var chaos_game_1 = __importDefault(__webpack_require__(/*! ./chaos-game */ "./src/ts/chaos-game.ts"));
var parameters_1 = __importDefault(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
function main() {
    initGL();
    Canvas.showLoader(true);
    parameters_1.default.quality = 0.6;
    parameters_1.default.speed = 17;
    parameters_1.default.autorun = true;
    parameters_1.default.colors = false;
    parameters_1.default.preset = 7;
    var needToAdjustCanvasSize = true;
    var needToClearCanvas = true;
    var needToDisplayPreview = false;
    var lockedCanvas = false;
    bindEvents();
    var game = new chaos_game_1.default();
    var totalPoints;
    function setTotalPoints(total) {
        totalPoints = total;
        Canvas.setIndicatorText("Total points", totalPoints.toLocaleString());
    }
    setTotalPoints(0);
    function clearCanvas() {
        gl_canvas_1.gl.clear(gl_canvas_1.gl.COLOR_BUFFER_BIT);
        setTotalPoints(0);
        needToClearCanvas = false;
    }
    var distance;
    var isPreview = false;
    var firstDraw = true;
    function mainLoop() {
        if (!lockedCanvas) {
            if (needToAdjustCanvasSize) {
                GLCanvas.adjustSize();
                viewport_1.default.setFullCanvas(gl_canvas_1.gl);
                needToAdjustCanvasSize = false;
                needToClearCanvas = true;
            }
            needToClearCanvas = needToClearCanvas || (isPreview && parameters_1.default.autorun);
            if (needToClearCanvas) {
                clearCanvas();
                isPreview = false;
            }
            if (needToDisplayPreview) {
                var nbPoints = Math.pow(2, 17);
                game.draw(nbPoints, distance, 0);
                setTotalPoints(nbPoints);
                needToDisplayPreview = false;
                isPreview = true;
            }
            if (parameters_1.default.autorun) {
                if (parameters_1.default.mode === "movement") {
                    distance += 0.002;
                    if (distance > parameters_1.default.distanceTo) {
                        distance = parameters_1.default.distanceFrom;
                    }
                }
                else {
                    distance = parameters_1.default.distance;
                }
                var nbPoints = Math.pow(2, parameters_1.default.speed - 1);
                setTotalPoints(totalPoints + nbPoints);
                game.draw(nbPoints, distance, parameters_1.default.quality);
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
        var glParams = {
            alpha: false,
            antialias: false,
            depth: false,
            preserveDrawingBuffer: true,
        };
        if (!GLCanvas.initGL(glParams)) {
            return;
        }
        gl_canvas_1.gl.enable(gl_canvas_1.gl.BLEND);
        gl_canvas_1.gl.clearColor(0, 0, 0, 1);
        gl_canvas_1.gl.blendEquation(gl_canvas_1.gl.FUNC_ADD);
        gl_canvas_1.gl.blendFunc(gl_canvas_1.gl.ONE, gl_canvas_1.gl.ONE);
    }
    function bindEvents() {
        parameters_1.default.clearObservers.push(function () {
            needToClearCanvas = true;
            if (parameters_1.default.mode === "movement") {
                distance = parameters_1.default.distanceFrom;
            }
        });
        parameters_1.default.previewObservers.push(function () { return needToDisplayPreview = true; });
        Canvas.Observers.canvasResize.push(function () { return needToAdjustCanvasSize = true; });
        var initDistance = function (mode) {
            return distance = (mode === "fixed") ? parameters_1.default.distance : parameters_1.default.distanceFrom;
        };
        initDistance(parameters_1.default.mode);
        parameters_1.default.modeChangeObservers.push(initDistance);
        parameters_1.default.downloadObservers.push(function (wantedSize) {
            lockedCanvas = true;
            downloader_1.default(game, wantedSize, totalPoints);
            lockedCanvas = false;
            needToAdjustCanvasSize = true;
        });
    }
}
main();


/***/ }),

/***/ "./src/ts/parameters.ts":
/*!******************************!*\
  !*** ./src/ts/parameters.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Presets = __importStar(__webpack_require__(/*! ./presets */ "./src/ts/presets.ts"));
var Parameters = (function () {
    function Parameters() {
    }
    Object.defineProperty(Parameters, "scale", {
        get: function () {
            return scale;
        },
        set: function (s) {
            scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
            callGenericObservers(clearObservers);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "poles", {
        get: function () {
            return poles;
        },
        set: function (q) {
            poles = q;
            Range.setValue(POLES_CONTROL_ID, poles);
            callGenericObservers(clearObservers);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "forbidRepeat", {
        get: function () {
            return forbidRepeat;
        },
        set: function (f) {
            forbidRepeat = f;
            Checkbox.setChecked(FORBID_REPEAT_CONTROL_ID, forbidRepeat);
            callGenericObservers(clearObservers);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "distance", {
        get: function () {
            return distance;
        },
        set: function (d) {
            distance = d;
            Range.setValue(DISTANCE_CONTROL_ID, distance);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "distanceTo", {
        get: function () {
            return distanceTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "distanceFrom", {
        get: function () {
            return distanceFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "quality", {
        get: function () {
            return quality;
        },
        set: function (d) {
            quality = d;
            Range.setValue(QUALITY_CONTROL_ID, quality);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "colors", {
        get: function () {
            return colors;
        },
        set: function (c) {
            colors = c;
            Checkbox.setChecked(COLORS_CONTROL_ID, c);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "speed", {
        get: function () {
            return speed;
        },
        set: function (s) {
            speed = s;
            Range.setValue(SPEED_CONTROL_ID, speed);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "autorun", {
        get: function () {
            return autorun;
        },
        set: function (a) {
            autorun = a;
            Checkbox.setChecked(AUTORUN_CONTROL_ID, a);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "downloadObservers", {
        get: function () {
            return downloadObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "clearObservers", {
        get: function () {
            return clearObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "previewObservers", {
        get: function () {
            return previewObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "resetViewObservers", {
        get: function () {
            return resetViewObservers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "preset", {
        set: function (p) {
            Picker.setValue(PRESETS_CONTROL_ID, "" + p);
            applyPreset(p);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "mode", {
        get: function () {
            return mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parameters, "modeChangeObservers", {
        get: function () {
            return modeChangeObservers;
        },
        enumerable: true,
        configurable: true
    });
    return Parameters;
}());
var downloadObservers = [];
FileControl.addDownloadObserver("result-download-id", function () {
    var size = +Tabs.getValues("result-dimensions")[0];
    for (var _i = 0, downloadObservers_1 = downloadObservers; _i < downloadObservers_1.length; _i++) {
        var observer = downloadObservers_1[_i];
        observer(size);
    }
});
function callGenericObservers(list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var observer = list_1[_i];
        observer();
    }
}
var clearObservers = [];
var RESET_CONTROL_ID = "reset-button-id";
Button.addObserver(RESET_CONTROL_ID, function () { return callGenericObservers(clearObservers); });
Canvas.Observers.mouseDrag.push(function () { return callGenericObservers(clearObservers); });
var previewObservers = [];
Canvas.Observers.mouseDrag.push(function () { return callGenericObservers(previewObservers); });
var resetViewObservers = [];
function restartRendering() {
    callGenericObservers(clearObservers);
    Parameters.autorun = true;
}
var scale = 1.0;
var MIN_SCALE = 0.05;
var MAX_SCALE = 4.0;
Canvas.Observers.mouseWheel.push(function (delta, zoomCenter) {
    var newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (1 + 0.2 * delta)));
    if (newScale !== scale) {
        scale = newScale;
        restartRendering();
    }
});
var POLES_CONTROL_ID = "poles-range-id";
var poles = Range.getValue(POLES_CONTROL_ID);
Range.addObserver(POLES_CONTROL_ID, function (p) {
    poles = p;
    clearPreset();
    restartRendering();
    callGenericObservers(resetViewObservers);
});
var DISTANCE_CONTROL_ID = "distance-range-id";
var distance = Range.getValue(DISTANCE_CONTROL_ID);
Range.addObserver(DISTANCE_CONTROL_ID, function (d) {
    distance = d;
    clearPreset();
    restartRendering();
});
var QUALITY_CONTROL_ID = "quality-range-id";
var quality = Range.getValue(QUALITY_CONTROL_ID);
Range.addObserver(QUALITY_CONTROL_ID, function (q) {
    quality = q;
    restartRendering();
});
var SPEED_CONTROL_ID = "speed-range-id";
var speed = Range.getValue(SPEED_CONTROL_ID);
Range.addObserver(SPEED_CONTROL_ID, function (s) {
    speed = s;
    restartRendering();
});
var AUTORUN_CONTROL_ID = "autorun-checkbox-id";
var autorun = Checkbox.isChecked(AUTORUN_CONTROL_ID);
Checkbox.addObserver(AUTORUN_CONTROL_ID, function (checked) {
    autorun = checked;
});
var COLORS_CONTROL_ID = "colors-checkbox-id";
var colors = Checkbox.isChecked(COLORS_CONTROL_ID);
Checkbox.addObserver(COLORS_CONTROL_ID, function (checked) {
    colors = checked;
    restartRendering();
});
var FORBID_REPEAT_CONTROL_ID = "forbid-repeat-checkbox-id";
var forbidRepeat = Checkbox.isChecked(FORBID_REPEAT_CONTROL_ID);
Checkbox.addObserver(FORBID_REPEAT_CONTROL_ID, function (checked) {
    forbidRepeat = checked;
    clearPreset();
    restartRendering();
});
var isPreset = true;
var PRESETS_CONTROL_ID = "presets-picker-id";
function clearPreset() {
    if (isPreset) {
        isPreset = false;
        Picker.setValue(PRESETS_CONTROL_ID, null);
    }
}
function applyPreset(presetId) {
    if (presetId !== null) {
        isPreset = true;
        var preset = Presets.getPreset(presetId);
        Parameters.poles = preset.poles;
        Parameters.distance = preset.distance;
        Parameters.forbidRepeat = preset.forbidRepeat;
        Parameters.scale = preset.scale;
        restartRendering();
        callGenericObservers(resetViewObservers);
    }
}
Picker.addObserver(PRESETS_CONTROL_ID, applyPreset);
applyPreset(Picker.getValue(PRESETS_CONTROL_ID));
var DISTANCE_FROM_CONTROL_ID = "distance-from-range-id";
var distanceFrom = Range.getValue(DISTANCE_FROM_CONTROL_ID);
Range.addObserver(DISTANCE_FROM_CONTROL_ID, function (df) {
    distanceFrom = df;
    callGenericObservers(previewObservers);
    restartRendering();
});
var DISTANCE_TO_CONTROL_ID = "distance-to-range-id";
var distanceTo = Range.getValue(DISTANCE_TO_CONTROL_ID);
Range.addObserver(DISTANCE_TO_CONTROL_ID, function (dt) {
    distanceTo = dt;
    callGenericObservers(previewObservers);
    restartRendering();
});
var Mode;
(function (Mode) {
    Mode["FIXED"] = "fixed";
    Mode["MOVEMENT"] = "movement";
})(Mode || (Mode = {}));
var modeChangeObservers = [];
var MODE_CONTROL_ID = "mode";
var mode;
function applyMode(newMode) {
    if (newMode !== mode) {
        mode = newMode;
        Controls.toggleVisibility(PRESETS_CONTROL_ID, mode === Mode.FIXED);
        Controls.toggleVisibility(DISTANCE_CONTROL_ID, mode === Mode.FIXED);
        Controls.toggleVisibility(DISTANCE_FROM_CONTROL_ID, mode === Mode.MOVEMENT);
        Controls.toggleVisibility(DISTANCE_TO_CONTROL_ID, mode === Mode.MOVEMENT);
        for (var _i = 0, modeChangeObservers_1 = modeChangeObservers; _i < modeChangeObservers_1.length; _i++) {
            var observer = modeChangeObservers_1[_i];
            observer(newMode);
        }
        restartRendering();
    }
}
applyMode(Tabs.getValues(MODE_CONTROL_ID)[0]);
Tabs.addObserver(MODE_CONTROL_ID, function (v) { return applyMode(v[0]); });
exports.default = Parameters;


/***/ }),

/***/ "./src/ts/presets.ts":
/*!***************************!*\
  !*** ./src/ts/presets.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var presets = [
    {
        poles: 3,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 6,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 5,
        distance: 0.5,
        forbidRepeat: false,
        scale: 1,
    },
    {
        poles: 3,
        distance: 1.5,
        forbidRepeat: false,
        scale: 3,
    },
    {
        poles: 4,
        distance: 0.5,
        forbidRepeat: true,
        scale: 0.8,
    },
    {
        poles: 4,
        distance: 1.5,
        forbidRepeat: true,
        scale: 2.5,
    },
    {
        poles: 6,
        distance: 0.57,
        forbidRepeat: false,
        scale: 1.2,
    },
    {
        poles: 6,
        distance: 1.5,
        forbidRepeat: true,
        scale: 2,
    },
    {
        poles: 4,
        distance: 0.4,
        forbidRepeat: true,
        scale: 0.8,
    },
    {
        poles: 4,
        distance: 1.618,
        forbidRepeat: true,
        scale: 3,
    },
    {
        poles: 5,
        distance: 1.618,
        forbidRepeat: true,
        scale: 4,
    },
    {
        poles: 3,
        distance: 1.618,
        forbidRepeat: true,
        scale: 4,
    },
    {
        poles: 4,
        distance: 1.618,
        forbidRepeat: false,
        scale: 4,
    },
    {
        poles: 6,
        distance: 0.667,
        forbidRepeat: false,
        scale: 0.65,
    },
];
function getPreset(id) {
    return presets[id];
}
exports.getPreset = getPreset;


/***/ })

/******/ });