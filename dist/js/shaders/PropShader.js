"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropShader = void 0;
const BasePreprocessingShader_1 = require("./BasePreprocessingShader");
const KotlinLib_1 = require("../KotlinLib");
class PropShader extends BasePreprocessingShader_1.BasePreprocessingShader {
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
            }`;
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
            [KotlinLib_1.engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [KotlinLib_1.engine.AttributeType.UV0.ordinal]: rm_TexCoord0
        };
        this.uniforms = [view_proj_matrix, sTexture, brightness];
    }
}
exports.PropShader = PropShader;
//# sourceMappingURL=PropShader.js.map