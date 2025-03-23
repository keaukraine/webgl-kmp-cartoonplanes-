import { BaseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class ColorShader extends BaseShader implements ShaderInputs {
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    rm_Vertex: number | undefined;
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    fillCode(): void;
    fillUniformsAttributes(): void;
}
