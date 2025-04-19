"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffuseShader = void 0;
const BasePreprocessingShader_1 = require("./BasePreprocessingShader");
const KotlinLib_1 = require("../KotlinLib");
class DiffuseShader extends BasePreprocessingShader_1.BasePreprocessingShader {
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
            [KotlinLib_1.engine.AttributeType.VERTEX.ordinal]: this.rm_Vertex,
            [KotlinLib_1.engine.AttributeType.UV0.ordinal]: this.rm_TexCoord0
        };
        this.uniforms = [this.view_proj_matrix, this.sTexture];
    }
}
exports.DiffuseShader = DiffuseShader;
//# sourceMappingURL=DiffuseShader.js.map