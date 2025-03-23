/** GLSL literals to substitute with code. */
export const Preprocessing = {
    UNIFORMS: "/*UNIFORMS*/",
    POST_FRAGMENT: "/*POST_FRAGMENT*/",
    POST_VERTEX: "/*POST_VERTEX*/"
}

/** Shader preprocessing substitution pair. */
export interface ShaderPreprocessing {
    stringToReplace: string;
    valueToReplaceWith: string;
}
