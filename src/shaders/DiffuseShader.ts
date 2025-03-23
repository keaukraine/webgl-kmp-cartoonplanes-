import { ShaderInputs } from "./ShaderInputs";
import { BasePreprocessingShader } from "./BasePreprocessingShader";
import { engine } from "../KotlinLib";

export class DiffuseShader extends BasePreprocessingShader implements ShaderInputs {
    view_proj_matrix: WebGLUniformLocation | undefined;
    sTexture: WebGLUniformLocation | undefined;
    rm_Vertex: number | undefined;
    rm_TexCoord0: number | undefined;

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
            /*UNIFORMS*/

            void main() {
              gl_FragColor = texture2D(sTexture, vTextureCoord);
              /*POST_FRAGMENT*/;
            }`;
    }

    /** @inheritdoc */
    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib('rm_Vertex');
        this.rm_TexCoord0 = this.getAttrib('rm_TexCoord0');

        this.view_proj_matrix = this.getUniform('view_proj_matrix');
        this.sTexture = this.getUniform('sTexture');

        this.attributes = [this.rm_Vertex, this.rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: this.rm_Vertex!,
            [engine.AttributeType.UV0.ordinal]: this.rm_TexCoord0!
        };
        this.uniforms = [this.view_proj_matrix, this.sTexture];
    }
}
