"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullscreenQuad = void 0;
const gl_matrix_1 = require("gl-matrix");
class FullscreenQuad {
    constructor(gl) {
        this.gl = gl;
        this.matrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.identity(this.matrix);
        this.initBuffer();
    }
    initBuffer() {
        this.quadTriangles = new Float32Array([
            // X, Y, Z, U, V
            -1.0, -1.0, 0.0, 0.0, 0.0,
            1.0, -1.0, 0.0, 1.0, 0.0,
            -1.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0, 1.0, // 3. right-top
        ]);
        this.vertexDataBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.quadTriangles, this.gl.STATIC_DRAW);
    }
    draw(shader) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.enableVertexAttribArray(shader.rm_Vertex);
        this.gl.vertexAttribPointer(shader.rm_Vertex, 3, this.gl.FLOAT, false, 5 * 4, 0);
        this.gl.enableVertexAttribArray(shader.rm_TexCoord0);
        this.gl.vertexAttribPointer(shader.rm_TexCoord0, 2, this.gl.FLOAT, false, 5 * 4, 4 * 3);
        this.gl.uniformMatrix4fv(shader.view_proj_matrix, false, this.matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
exports.FullscreenQuad = FullscreenQuad;
//# sourceMappingURL=FullscreenQuad.js.map