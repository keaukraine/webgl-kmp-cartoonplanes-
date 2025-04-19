import { BaseShader, FullModel } from "webgl-framework";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";
export declare class VertexVignetteShader2 extends BaseShader {
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    offset: WebGLUniformLocation | undefined;
    dimensions: WebGLUniformLocation | undefined;
    amplitudes: WebGLUniformLocation | undefined;
    frequencies: WebGLUniformLocation | undefined;
    fogDistance: WebGLUniformLocation | undefined;
    fogStartDistance: WebGLUniformLocation | undefined;
    rm_Vertex: number;
    rm_AO: number;
    color0: WebGLUniformLocation | undefined;
    color1: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
    drawVignette(renderer: RendererWithExposedMethods, model: FullModel): void;
}
