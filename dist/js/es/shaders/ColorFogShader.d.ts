import { ShaderInputs } from "./ShaderInputs";
import { ColorShader } from "./ColorShader";
export declare class ColorFogShader extends ColorShader implements ShaderInputs {
    fogStartDistance: WebGLUniformLocation | undefined;
    fogDistance: WebGLUniformLocation | undefined;
    fogColor: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
