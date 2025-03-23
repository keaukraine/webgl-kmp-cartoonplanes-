import { ShaderInputs } from "./ShaderInputs";
import { DiffuseShader } from "./DiffuseShader";
export declare class DiffuseFogShader extends DiffuseShader implements ShaderInputs {
    /** Uniforms are of type `WebGLUniformLocation` */
    fogStartDistance: WebGLUniformLocation | undefined;
    fogDistance: WebGLUniformLocation | undefined;
    fogColor: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
