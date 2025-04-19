import { ShaderInputs } from "./ShaderInputs";
import { BasePreprocessingShader } from "./BasePreprocessingShader";
export declare class DiffuseShader extends BasePreprocessingShader implements ShaderInputs {
    view_proj_matrix: WebGLUniformLocation | undefined;
    sTexture: WebGLUniformLocation | undefined;
    rm_Vertex: number | undefined;
    rm_TexCoord0: number | undefined;
    attributes?: number[];
    typedAttributes?: {
        [key: number]: number;
    };
    uniforms?: WebGLUniformLocation[];
    /** @inheritdoc */
    fillCode(): void;
    /** @inheritdoc */
    fillUniformsAttributes(): void;
}
