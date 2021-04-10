import * as fs from "fs";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Chaos game",
    description: "WebGL implementation of the Chaos game.",
    introduction: [
        "The Chaos Game is an iterative way of drawing fractals using a number of fixed invisible points called attractors and a single point that is repeatedly moved and drawn on the canvas. The initial position of the point is picked randomly on the canvas, and then the next position is computed as follow: a random attractor is chosen and the point is moved a fraction of the distance towards this attractor.",
        "You can discover lots of different fractals by slightly modifying the parameters: number of attractors, distance used to move the point and restriction on the choice of the attractor depending on previous choices. Moreover, the simulation can run in an additional mode where the distance slowly drifts, resulting in flower-like patterns.",
        "You can also zoom in and explore the fractals with the mouse.",
    ],
    githubProjectName: "chaos-game-webgl",
    additionalLinks: [],
    scriptFiles: [
        "script/main.min.js",
    ],
    indicators: [
        {
            id: "points-drawn",
            label: "Points drawn"
        }
    ],
    canvas: {
        "width": 512,
        "height": 512,
        "enableFullscreen": true
    },
    controlsSections: [
        {
            title: "Parameters",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Mode",
                    id: "mode",
                    unique: true,
                    options: [
                        {
                            value: "fixed",
                            label: "Fixed",
                            checked: true
                        },
                        {
                            value: "movement",
                            label: "Moving"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Picker,
                    title: "Preset",
                    id: "presets-fixed-picker-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "0",
                            label: "Sierpinski triangle"
                        },
                        {
                            value: "1",
                            label: "Cathedral"
                        },
                        {
                            value: "2",
                            label: "Wires: triangle"
                        },
                        {
                            value: "3",
                            label: "Pentagrams"
                        },
                        {
                            value: "4",
                            label: "Wires: cube"
                        },
                        {
                            value: "5",
                            label: "Hollow"
                        },
                        {
                            value: "6",
                            label: "T-Square"
                        },
                        {
                            value: "7",
                            label: "Stars"
                        },
                        {
                            value: "8",
                            label: "Infinite cubes"
                        },
                        {
                            value: "9",
                            label: "Crustaceans"
                        },
                        {
                            value: "10",
                            label: "Golden square"
                        },
                        {
                            value: "11",
                            label: "Starmap"
                        },
                        {
                            value: "12",
                            label: "Pythagoras tree"
                        },
                        {
                            value: "13",
                            label: "Monolith"
                        },
                        {
                            value: "14",
                            label: "Koch snowflake"
                        },
                        {
                            value: "15",
                            label: "Cabbage"
                        },
                        {
                            value: "16",
                            label: "Gecko"
                        },
                        {
                            value: "17",
                            label: "Hubs"
                        },
                        {
                            value: "18",
                            label: "Sierpinski carpet"
                        },
                        {
                            value: "19",
                            label: "Forest"
                        },
                        {
                            value: "20",
                            label: "Triangles"
                        },
                        {
                            value: "21",
                            label: "Spirals"
                        }
                    ]
                },
                {
                    title: "Preset",
                    type: Demopage.supportedControls.Picker,
                    id: "presets-movement-picker-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "0",
                            label: "Triangle outer"
                        },
                        {
                            value: "1",
                            label: "Pentagon inner"
                        },
                        {
                            value: "2",
                            label: "Palms"
                        },
                        {
                            value: "3",
                            label: "Triangle side"
                        },
                        {
                            value: "4",
                            label: "Star"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Attractors",
                    id: "poles-range-id",
                    min: 3,
                    max: 16,
                    value: 5,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Distance",
                    id: "distance-range-id",
                    min: 0.1,
                    max: 2,
                    value: 0.5,
                    step: 0.001
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Distance from",
                    id: "distance-from-range-id",
                    min: 0.1,
                    max: 2,
                    value: 1,
                    step: 0.001
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Distance to",
                    id: "distance-to-range-id",
                    min: 0.1,
                    max: 2,
                    value: 1.85,
                    step: 0.001
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Rotation",
                    id: "rotation-range-id",
                    min: -1,
                    max: 1,
                    value: 0,
                    step: 0.05
                },
                {
                    type: Demopage.supportedControls.Picker,
                    title: "Restrictions",
                    id: "restrictions-picker-id",
                    placeholder: "Custom",
                    options: [
                        {
                            value: "none",
                            label: "None"
                        },
                        {
                            value: "no-repeat",
                            label: "No repeat"
                        },
                        {
                            value: "no-double-repeat",
                            label: "No repeat twice"
                        },
                        {
                            value: "no-neighbour",
                            label: "No neighbour"
                        },
                        {
                            value: "no-neighbour-after-repeat",
                            label: "No neighbour if previous was repeat"
                        },
                        {
                            value: "no-right-neighbour",
                            label: "No right neighbour"
                        }
                    ]
                }
            ]
        },
        {
            title: "Rendering",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Intensity",
                    id: "intensity-range-id",
                    min: 0.01,
                    max: 1,
                    value: 0.1,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Quality",
                    id: "quality-range-id",
                    min: 0,
                    max: 1,
                    value: 0.6,
                    step: 0.1
                },
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Theme",
                    id: "theme",
                    unique: true,
                    options: [
                        {
                            value: "dark",
                            label: "Dark",
                            checked: true
                        },
                        {
                            value: "light",
                            label: "Light"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Colored",
                    id: "colors-checkbox-id",
                    checked: false
                },
                {
                    type: Demopage.supportedControls.Button,
                    id: "reset-button-id",
                    label: "Clear canvas",
                    flat: true
                }
            ]
        },
        {
            title: "Download",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Image size",
                    id: "result-dimensions",
                    unique: true,
                    options: [
                        {
                            value: "1024",
                            label: "1024",
                            checked: true
                        },
                        {
                            value: "2048",
                            label: "2048"
                        },
                        {
                            value: "4096",
                            label: "4096"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.FileDownload,
                    id: "result-download-id",
                    label: "Download image",
                    flat: true
                }
            ],
        }
    ]
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = false;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);
