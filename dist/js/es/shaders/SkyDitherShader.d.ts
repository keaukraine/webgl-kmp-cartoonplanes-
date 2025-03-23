import { DiffuseShader } from "./DiffuseShader";
import { ShaderInputs } from "./ShaderInputs";
export declare class SkyDitherShader extends DiffuseShader implements ShaderInputs {
    /** Uniforms are of type `WebGLUniformLocation` */
    sNoise: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
