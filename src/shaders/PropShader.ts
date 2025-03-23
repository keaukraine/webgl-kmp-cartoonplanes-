import { ShaderInputs } from "./ShaderInputs";
import { BasePreprocessingShader } from "./BasePreprocessingShader";
import { engine } from "../KotlinLib";

export class PropShader extends BasePreprocessingShader implements ShaderInputs {
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
            uniform float brightness;

            void main() {
              vec4 color = texture2D(sTexture, vTextureCoord);
              gl_FragColor = vec4(color.rgb * brightness, 1. - color.r);
            }`
    }

    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_TexCoord0 = this.getAttrib("rm_TexCoord0");

        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const sTexture = this.getUniform("sTexture");
        const brightness = this.getUniform("brightness");

        this.attributes = [rm_Vertex, rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [engine.AttributeType.UV0.ordinal]: rm_TexCoord0
        };
        this.uniforms = [view_proj_matrix, sTexture, brightness];
    }
}
