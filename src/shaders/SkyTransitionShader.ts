import { ShaderInputs } from "./ShaderInputs";
import { BasePreprocessingShader } from "./BasePreprocessingShader";
import { engine } from "../KotlinLib";

export class SkyTransitionShader extends BasePreprocessingShader implements ShaderInputs {
    public attributes?: number[];
    public typedAttributes?: { [key: number]: number };
    public uniforms?: WebGLUniformLocation[];

    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
            uniform mat4 view_proj_matrix;
            attribute vec4 rm_Vertex;
            attribute vec2 rm_TexCoord0;
            varying vec2 vTextureCoord;
            /*UNIFORMS*/

            void main() {
              gl_Position = view_proj_matrix * rm_Vertex;
              vTextureCoord = rm_TexCoord0;
              /*POST_VERTEX*/;
            }`;

        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform sampler2D sTexture2;
            uniform sampler2D sNoise;
            uniform float transition;
            /*UNIFORMS*/

            void main() {
                vec4 color1 = texture2D(sTexture, vTextureCoord);
                vec4 color2 = texture2D(sTexture2, vTextureCoord);
                float r = texture2D(sNoise, vTextureCoord).r;

                r -= 0.5;
                r += transition;
                r = smoothstep(0.49, 0.51, r);
                // r = step(0.5, r);

                vec4 mixed = mix(color1, color2, r);
                mixed *= smoothstep(0.15, 0.25, abs(r - 0.5));

                gl_FragColor = mixed;
                /*POST_FRAGMENT*/;
            }`;
    }

    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_TexCoord0 = this.getAttrib("rm_TexCoord0");

        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const sTexture = this.getUniform("sTexture");
        const sTexture2 = this.getUniform("sTexture2");
        const sNoise = this.getUniform("sNoise");
        const transition = this.getUniform("transition");

        this.attributes = [rm_Vertex, rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [engine.AttributeType.UV0.ordinal]: rm_TexCoord0
        };
        this.uniforms = [view_proj_matrix, sTexture, sTexture2, sNoise, transition];
    }
}
