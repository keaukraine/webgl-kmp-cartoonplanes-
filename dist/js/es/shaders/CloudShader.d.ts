import { BaseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class CloudShader extends BaseShader implements ShaderInputs {
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    time: WebGLUniformLocation | undefined;
    rm_TexCoord0: number | undefined;
    rm_Vertex: number | undefined;
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    fillCode(): void;
    fillUniformsAttributes(): void;
}
