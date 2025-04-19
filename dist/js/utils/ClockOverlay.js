"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockOverlay = void 0;
const FullscreenQuad_1 = require("./FullscreenQuad");
class ClockOverlay extends FullscreenQuad_1.FullscreenQuad {
    constructor() {
        super(...arguments);
        this.screenRatio = 1;
        this.overlaySize = 0.5; // horizontal size
        this.overlayOffsetY = 0; // vertical offset from the center
    }
    initBuffer() {
        if (this.vertexDataBuffer !== undefined) {
            this.gl.deleteBuffer(this.vertexDataBuffer);
        }
        const { overlaySize: size, screenRatio: ratio, overlayOffsetY: offsetY } = this;
        this.quadTriangles = new Float32Array([
            // X, Y, Z, U, V
            -size, -size * ratio / 3 + offsetY, 0.0, 0.0, 0.0,
            size, -size * ratio / 3 + offsetY, 0.0, 1.0, 0.0,
            -size, size * ratio / 3 + offsetY, 0.0, 0.0, -1.0,
            size, size * ratio / 3 + offsetY, 0.0, 1.0, -1.0, // 3. right-top
        ]);
        this.vertexDataBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.quadTriangles, this.gl.STATIC_DRAW);
    }
    set ratio(value) {
        if (this.screenRatio !== value) {
            this.screenRatio = value;
            this.initBuffer();
        }
    }
    set size(value) {
        if (this.overlaySize !== value) {
            this.overlaySize = value;
            this.initBuffer();
        }
    }
    set offsetY(value) {
        if (this.overlayOffsetY !== value) {
            this.overlayOffsetY = value;
            this.initBuffer();
        }
    }
}
exports.ClockOverlay = ClockOverlay;
//# sourceMappingURL=ClockOverlay.js.map