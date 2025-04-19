"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutlineShader = void 0;
const BasePreprocessingShader_1 = require("./BasePreprocessingShader");
const KotlinLib_1 = require("../KotlinLib");
class OutlineShader extends BasePreprocessingShader_1.BasePreprocessingShader {
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
        attribute vec4 rm_Vertex;
        attribute vec4 rm_Normal;

        uniform mat4 view_proj_matrix;
        uniform float uThickness1; // 0.002

        void main() {
            vec4 pos = vec4(rm_Vertex.xyz, 1.0);
            float dist = (view_proj_matrix * pos).w / 3000.;
            pos += rm_Normal * uThickness1 * dist;
            // pos += rm_Normal * uThickness1;
            pos.w = 1.0;

            gl_Position = view_proj_matrix * pos;
        }`;
        this.fragmentShaderCode = `precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_Normal = this.getAttrib("rm_Normal");
        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const uThickness1 = this.getUniform("uThickness1");
        const color = this.getUniform("color");
        this.attributes = [rm_Vertex, rm_Normal];
        this.typedAttributes = {
            [KotlinLib_1.engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [KotlinLib_1.engine.AttributeType.NORMAL.ordinal]: rm_Normal
        };
        this.uniforms = [view_proj_matrix, uThickness1, color];
    }
}
exports.OutlineShader = OutlineShader;
//# sourceMappingURL=OutlineShader.js.map