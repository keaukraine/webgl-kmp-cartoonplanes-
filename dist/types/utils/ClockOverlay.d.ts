import { FullscreenQuad } from "./FullscreenQuad";
export declare class ClockOverlay extends FullscreenQuad {
    protected screenRatio: number;
    protected overlaySize: number;
    protected overlayOffsetY: number;
    initBuffer(): void;
    set ratio(value: number);
    set size(value: number);
    set offsetY(value: number);
}
