import { BaseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class PointSpritesColoredShader extends BaseShader implements ShaderInputs {
    uMvp: WebGLUniformLocation | undefined;
    size: WebGLUniformLocation | undefined;
    tex0: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    rm_Vertex: number | undefined;
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    fillCode(): void;
    fillUniformsAttributes(): void;
}
