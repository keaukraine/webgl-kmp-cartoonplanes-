import { FullModel } from "webgl-framework";
import { VertexVignetteShader2 } from "./shaders/VertexVignetteShader2";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";
export declare class Vignette {
    protected fmVignette: FullModel;
    protected shader?: VertexVignetteShader2;
    protected color0: number[];
    protected color1: number[];
    initialize(gl: WebGLRenderingContext): Promise<void>;
    setColor0(r: number, g: number, b: number, a: number): void;
    setColor1(r: number, g: number, b: number, a: number): void;
    draw(renderer: RendererWithExposedMethods): void;
}
