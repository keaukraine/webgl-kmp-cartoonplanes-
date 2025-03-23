/** GLSL literals to substitute with code. */
export declare const Preprocessing: {
    UNIFORMS: string;
    POST_FRAGMENT: string;
    POST_VERTEX: string;
};
/** Shader preprocessing substitution pair. */
export interface ShaderPreprocessing {
    stringToReplace: string;
    valueToReplaceWith: string;
}
