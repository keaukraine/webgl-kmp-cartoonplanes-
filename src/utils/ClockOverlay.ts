import { FullscreenQuad } from "./FullscreenQuad";

export class ClockOverlay extends FullscreenQuad {
    protected screenRatio = 1;

    protected overlaySize = 0.5; // horizontal size
    protected overlayOffsetY = 0; // vertical offset from the center

    public initBuffer(): void {
        if (this.vertexDataBuffer !== undefined) {
            this.gl.deleteBuffer(this.vertexDataBuffer);
        }

        const { overlaySize: size, screenRatio: ratio, overlayOffsetY: offsetY } = this;
        this.quadTriangles = new Float32Array([
            // X, Y, Z, U, V
            -size, -size * ratio / 3 + offsetY, 0.0, 0.0, 0.0, // 0. left-bottom
            size, -size * ratio / 3 + offsetY, 0.0, 1.0, 0.0, // 1. right-bottom
            -size, size * ratio / 3 + offsetY, 0.0, 0.0, -1.0, // 2. left-top
            size, size * ratio / 3 + offsetY, 0.0, 1.0, -1.0, // 3. right-top
        ]);

        this.vertexDataBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.quadTriangles, this.gl.STATIC_DRAW);
    }

    public set ratio(value: number) {
        if (this.screenRatio !== value) {
            this.screenRatio = value;
            this.initBuffer();
        }
    }

    public set size(value: number) {
        if (this.overlaySize !== value) {
            this.overlaySize = value;
            this.initBuffer();
        }
    }

    public set offsetY(value: number) {
        if (this.overlayOffsetY !== value) {
            this.overlayOffsetY = value;
            this.initBuffer();
        }
    }
}
