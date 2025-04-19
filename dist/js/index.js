"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webgl_framework_1 = require("webgl-framework");
const Renderer_1 = require("./Renderer");
const lil_gui_1 = require("lil-gui");
const CameraMode_1 = require("./CameraMode");
function ready(fn) {
    if (document.readyState !== "loading") {
        fn();
    }
    else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
let renderer;
ready(() => {
    renderer = new Renderer_1.Renderer();
    renderer.ready = () => {
        initUI();
    };
    renderer.init("canvasGL", true);
});
function initUI() {
    var _a, _b;
    (_a = document.getElementById("message")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    (_b = document.getElementById("canvasGL")) === null || _b === void 0 ? void 0 : _b.classList.remove("transparent");
    const gui = new lil_gui_1.default();
    const dummyConfig = {
        github: () => window.open("https://github.com/keaukraine/webgl-kmp-cartoonplanes-"),
        android: () => window.open("https://play.google.com/store/apps/details?id=org.androidworks.livewallpaper.cartoonairplanes")
    };
    const fullScreenUtils = new webgl_framework_1.FullScreenUtils();
    const fullscreen = {
        toggleFullscreen: () => {
            if (fullScreenUtils.isFullScreen()) {
                fullScreenUtils.exitFullScreen();
            }
            else {
                fullScreenUtils.enterFullScreen();
            }
        }
    };
    gui.add(renderer, "currentCameraMode", {
        "FrontEnd": CameraMode_1.CameraMode.FrontEnd,
        "FPS": CameraMode_1.CameraMode.FPS
    }).name("Camera");
    gui.add(renderer.settings, "cameraPeriod", 0.1, 2, 0.1);
    gui.add(renderer.settings, "lowQuality");
    gui.add(renderer, "randomizeSky");
    gui.add(renderer, "randomizePlane");
    gui.add(fullscreen, "toggleFullscreen");
    gui.add(dummyConfig, "github");
    gui.add(dummyConfig, "android");
    initDebugUI();
}
function initDebugUI() {
    const canvas = document.getElementById("canvasGL");
    if (!canvas) {
        return;
    }
    document.addEventListener("keypress", event => {
        if (event.key === "f") {
            renderer.currentCameraMode = renderer.currentCameraMode === CameraMode_1.CameraMode.FPS ? CameraMode_1.CameraMode.FrontEnd : CameraMode_1.CameraMode.FPS;
        }
    });
}
//# sourceMappingURL=index.js.map