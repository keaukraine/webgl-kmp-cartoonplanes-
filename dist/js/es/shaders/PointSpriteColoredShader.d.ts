import { BaseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class PointSpriteColoredShader extends BaseShader implements ShaderInputs {
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    uMvp: WebGLUniformLocation | undefined;
    size: WebGLUniformLocation | undefined;
    tex0: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
