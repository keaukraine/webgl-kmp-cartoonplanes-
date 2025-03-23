import { vec3 } from "gl-matrix";
import { FpsCameraOptions } from "./FpsCamera";
import { SceneRenderer } from "./SceneRenderer";
export declare class FreeMovement {
    private renderer;
    private options;
    private mode;
    private matCamera;
    private matInvCamera;
    private vec3Eye;
    private vec3Rotation;
    private fpsCamera;
    private enabled;
    constructor(renderer: SceneRenderer<any>, options: FpsCameraOptions);
    enable(): void;
    disable(): void;
    private setupControls;
    updatePosition(position: vec3): void;
    updateRotation(rotation: vec3): void;
}
