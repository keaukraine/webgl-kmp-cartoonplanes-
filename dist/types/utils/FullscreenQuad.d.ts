import { mat4 } from "gl-matrix";
import { DiffuseShader } from "../shaders/DiffuseShader";
export declare class FullscreenQuad {
    protected gl: WebGLRenderingContext;
    protected quadTriangles?: Float32Array;
    protected vertexDataBuffer?: WebGLBuffer | null;
    protected matrix: mat4;
    constructor(gl: WebGLRenderingContext);
    initBuffer(): void;
    draw(shader: DiffuseShader): void;
}
