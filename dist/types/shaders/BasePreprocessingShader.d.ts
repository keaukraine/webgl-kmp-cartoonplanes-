import { BaseShader } from "webgl-framework";
import { ShaderPreprocessing } from "../ShaderPreprocessing";
export declare abstract class BasePreprocessingShader extends BaseShader {
    protected preprocessingVertex: ShaderPreprocessing[];
    protected preprocessingFragment: ShaderPreprocessing[];
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, preprocessingVertex?: ShaderPreprocessing[], preprocessingFragment?: ShaderPreprocessing[]);
    protected initShader(): void;
    protected preprocessCode(): void;
}
