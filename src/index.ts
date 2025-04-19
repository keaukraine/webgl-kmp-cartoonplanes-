import { FullScreenUtils } from "webgl-framework";
import { Renderer } from "./Renderer";
import GUI from "lil-gui";
import { CameraMode } from "./CameraMode";


function ready(fn: () => void) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}


let renderer: Renderer;

ready(() => {
    renderer = new Renderer();
    renderer.ready = () => {
        initUI();
    };
    renderer.init("canvasGL", true);
});

function initUI(): void {
    document.getElementById("message")?.classList.add("hidden");
    document.getElementById("canvasGL")?.classList.remove("transparent");

    const gui = new GUI();
    const dummyConfig = {
        github: () => window.open("https://github.com/keaukraine/webgl-kmp-cartoonplanes-"),
        android: () => window.open("https://play.google.com/store/apps/details?id=org.androidworks.livewallpaper.cartoonairplanes")
    };

    const fullScreenUtils = new FullScreenUtils();
    const fullscreen = {
        toggleFullscreen: () => {
            if (fullScreenUtils.isFullScreen()) {
                fullScreenUtils.exitFullScreen();
            } else {
                fullScreenUtils.enterFullScreen();
            }
        }
    };

    gui.add(
        renderer,
        "currentCameraMode",
        {
            "FrontEnd": CameraMode.FrontEnd,
            "FPS": CameraMode.FPS
        }
    ).name("Camera");

    gui.add(renderer.settings, "cameraPeriod", 0.1, 2, 0.1);
    gui.add(renderer.settings, "lowQuality");

    gui.add(renderer, "randomizeSky");
    gui.add(renderer, "randomizePlane");
    gui.add(fullscreen, "toggleFullscreen");
    gui.add(dummyConfig, "github");
    gui.add(dummyConfig, "android");

    initDebugUI();
}

function initDebugUI(): void {
    const canvas = document.getElementById("canvasGL");
    if (!canvas) {
        return;
    }

    document.addEventListener("keypress", event => {
        if (event.key === "f") {
            renderer.currentCameraMode = renderer.currentCameraMode === CameraMode.FPS ? CameraMode.FrontEnd : CameraMode.FPS;
        }
    });
}
