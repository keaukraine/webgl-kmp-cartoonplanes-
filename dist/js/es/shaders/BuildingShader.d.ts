import { DiffuseShader } from "./DiffuseShader";
import { ShaderInputs } from "./ShaderInputs";
export declare class BuildingShader extends DiffuseShader implements ShaderInputs {
    /** Uniforms are of type `WebGLUniformLocation` */
    color: WebGLUniformLocation | undefined;
    reflectionColor: WebGLUniformLocation | undefined;
    sCubemap: WebGLUniformLocation | undefined;
    sEmission: WebGLUniformLocation | undefined;
    emissionStrength: WebGLUniformLocation | undefined;
    lights: WebGLUniformLocation | undefined;
    worldCameraPosition: WebGLUniformLocation | undefined;
    matModel: WebGLUniformLocation | undefined;
    lightDir: WebGLUniformLocation | undefined;
    lightParams: WebGLUniformLocation | undefined;
    rm_Normal: number | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
