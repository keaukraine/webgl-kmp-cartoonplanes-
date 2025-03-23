import { BaseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class DiffuseAnimatedTextureChunkedShader extends BaseShader implements ShaderInputs {
    uTexelHeight: WebGLUniformLocation | undefined;
    uTextureWidthInt: WebGLUniformLocation | undefined;
    sPositions: WebGLUniformLocation | undefined;
    uTexelSizes: WebGLUniformLocation | undefined;
    view_proj_matrix: WebGLUniformLocation | undefined;
    rm_TexCoord0: number | undefined;
    sTexture: WebGLUniformLocation | undefined;
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    fillCode(): void;
    fillUniformsAttributes(): void;
}
