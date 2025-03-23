import { DiffuseShader } from "webgl-framework";
import { ShaderInputs } from "./ShaderInputs";
export declare class PaletteShader extends DiffuseShader implements ShaderInputs {
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    /** @inheritdoc */
    fillCode(): void;
    /** @inheritdoc */
    fillUniformsAttributes(): void;
}
