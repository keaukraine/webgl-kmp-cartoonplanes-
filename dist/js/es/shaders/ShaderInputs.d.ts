export interface ShaderInputs {
    attributes?: number[];
    uniforms?: WebGLUniformLocation[];
    typedAttributes?: {
        [key: number]: number;
    };
}
