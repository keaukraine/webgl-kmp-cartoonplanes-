import { ShaderInputs } from "./ShaderInputs";
import { BasePreprocessingShader } from "./BasePreprocessingShader";
export declare class PropShader extends BasePreprocessingShader implements ShaderInputs {
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
