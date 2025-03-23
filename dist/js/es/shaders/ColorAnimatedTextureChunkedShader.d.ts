import { ColorShader } from "./ColorShader";
export declare class ColorAnimatedTextureChunkedShader extends ColorShader {
    uTexelHeight: WebGLUniformLocation | undefined;
    uTextureWidthInt: WebGLUniformLocation | undefined;
    sPositions: WebGLUniformLocation | undefined;
    uTexelSizes: WebGLUniformLocation | undefined;
    fillCode(): void;
    fillUniformsAttributes(): void;
}
