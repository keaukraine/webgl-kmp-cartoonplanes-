"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexVignetteShader2 = void 0;
const webgl_framework_1 = require("webgl-framework");
class VertexVignetteShader2 extends webgl_framework_1.BaseShader {
    constructor() {
        super(...arguments);
        // Attributes are numbers.
        this.rm_Vertex = 0;
        this.rm_AO = 1;
    }
    fillCode() {
        this.vertexShaderCode = `#version 300 es
            precision highp float;
            layout(location = 0) in vec2 rm_Vertex;
            layout(location = 1) in mediump float aAO;

            uniform mediump vec4 color0;
            uniform mediump vec4 color1;
            out mediump vec4 vAO;
            void main() {
              gl_Position.xy = rm_Vertex;
              gl_Position.z = 0.5;
              gl_Position.w = 1.0;
              vAO = mix(color0, color1, aAO);
            }`;
        this.fragmentShaderCode = `#version 300 es
            precision mediump float;
            out vec4 fragColor;
            in mediump vec4 vAO;

            const float MIN = 0.0;
            const float MAX = 1.0;

            void main() {
              fragColor = smoothstep(MIN, MAX, vAO);
            }`;
    }
    fillUniformsAttributes() {
        this.color0 = this.getUniform("color0");
        this.color1 = this.getUniform("color1");
    }
    drawVignette(renderer, model) {
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_AO);
        gl.vertexAttribPointer(this.rm_Vertex, 2, gl.HALF_FLOAT, false, 8, 0);
        gl.vertexAttribPointer(this.rm_AO, 1, gl.UNSIGNED_BYTE, true, 8, 6);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("VertexVignetteShader2 drawVignette");
    }
}
exports.VertexVignetteShader2 = VertexVignetteShader2;
//# sourceMappingURL=VertexVignetteShader2.js.map