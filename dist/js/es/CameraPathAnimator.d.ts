import { CameraPositionInterpolator, CameraPositionPair } from "./CameraPositionInterpolator";
import { CameraState } from "./CameraState";
export declare class CameraPathAnimator {
    protected canvas: HTMLCanvasElement;
    protected speed: number;
    protected minDuration: number;
    protected transitionDuration: number;
    protected enabled: boolean;
    private cameraPositionInterpolator;
    private previousCameraReverse;
    private currentCamera;
    private stateCamera;
    private cameras;
    private lastTime;
    constructor(canvas: HTMLCanvasElement, speed: number, minDuration: number, transitionDuration: number);
    enable(): void;
    disable(): void;
    get positionInterpolator(): CameraPositionInterpolator;
    get state(): CameraState;
    setCameras(value: CameraPositionPair[]): void;
    protected initialize(): void;
    private nextCamera;
    private updateCameraInterpolator;
    protected setCameraState(state: CameraState): void;
    animate(timeNow: number): void;
}
