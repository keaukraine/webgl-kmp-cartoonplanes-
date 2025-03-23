import { DiffuseShader } from "./DiffuseShader";
export declare class CausticsWaterShader extends DiffuseShader {
    /** Uniforms are of type `WebGLUniformLocation` */
    time: WebGLUniformLocation | undefined;
    largeTime: WebGLUniformLocation | undefined;
    scale1: WebGLUniformLocation | undefined;
    colorNear: WebGLUniformLocation | undefined;
    colorFar: WebGLUniformLocation | undefined;
    colorDistances: WebGLUniformLocation | undefined;
    wavesDistances: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
