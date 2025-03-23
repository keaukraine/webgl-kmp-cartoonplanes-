import { DiffuseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class DiffuseZFogShader extends DiffuseShader implements ShaderInputs {
    /** Uniforms are of type `WebGLUniformLocation` */
    fogColor: WebGLUniformLocation | undefined;
    fogDistances: WebGLUniformLocation | undefined;
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    fillCode(): void;
    fillUniformsAttributes(): void;
}
