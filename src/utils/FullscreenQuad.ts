import { mat4 } from "gl-matrix";
import { DiffuseShader } from "../shaders/DiffuseShader";


export class FullscreenQuad {
    protected quadTriangles?: Float32Array;
    protected vertexDataBuffer?: WebGLBuffer | null;
    protected matrix: mat4;

    constructor(protected gl: WebGLRenderingContext) {
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
        this.initBuffer();
    }

    public initBuffer(): void {
        this.quadTriangles = new Float32Array([
            // X, Y, Z, U, V
            -1.0, -1.0, 0.0, 0.0, 0.0, // 0. left-bottom
            1.0, -1.0, 0.0, 1.0, 0.0, // 1. right-bottom
            -1.0, 1.0, 0.0, 0.0, 1.0, // 2. left-top
            1.0, 1.0, 0.0, 1.0, 1.0, // 3. right-top
        ]);

        this.vertexDataBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.quadTriangles, this.gl.STATIC_DRAW);
    }

    public draw(shader: DiffuseShader): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer!);

        this.gl.enableVertexAttribArray(shader.rm_Vertex!);
        this.gl.vertexAttribPointer(shader.rm_Vertex!, 3, this.gl.FLOAT, false, 5 * 4, 0);
        this.gl.enableVertexAttribArray(shader.rm_TexCoord0!);
        this.gl.vertexAttribPointer(shader.rm_TexCoord0!, 2, this.gl.FLOAT, false, 5 * 4, 4 * 3);

        this.gl.uniformMatrix4fv(shader.view_proj_matrix!, false, this.matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}
