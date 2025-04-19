"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vignette = void 0;
const webgl_framework_1 = require("webgl-framework");
const VertexVignetteShader2_1 = require("./shaders/VertexVignetteShader2");
class Vignette {
    constructor() {
        this.fmVignette = new webgl_framework_1.FullModel();
        this.color0 = [0, 0, 0, 1];
        this.color1 = [1, 1, 1, 1];
    }
    async initialize(gl) {
        this.shader = new VertexVignetteShader2_1.VertexVignetteShader2(gl);
        await this.fmVignette.load(`data/models/vignette-round-vntao`, gl);
    }
    setColor0(r, g, b, a) {
        this.color0[0] = r;
        this.color0[1] = g;
        this.color0[2] = b;
        this.color0[3] = a;
    }
    setColor1(r, g, b, a) {
        this.color1[0] = r;
        this.color1[1] = g;
        this.color1[2] = b;
        this.color1[3] = a;
    }
    draw(renderer) {
        if (this.shader === undefined) {
            return;
        }
        const gl = renderer.gl;
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
        this.shader.use();
        gl.uniform4fv(this.shader.color0, this.color0);
        gl.uniform4fv(this.shader.color1, this.color1);
        this.shader.drawVignette(renderer, this.fmVignette);
        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
    }
}
exports.Vignette = Vignette;
//# sourceMappingURL=Vignette.js.map