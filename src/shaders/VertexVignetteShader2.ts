import { BaseShader, FullModel } from "webgl-framework";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";

export class VertexVignetteShader2 extends BaseShader {
    view_proj_matrix: WebGLUniformLocation | undefined;
    color: WebGLUniformLocation | undefined;
    offset: WebGLUniformLocation | undefined;
    dimensions: WebGLUniformLocation | undefined;
    amplitudes: WebGLUniformLocation | undefined;
    frequencies: WebGLUniformLocation | undefined;
    fogDistance: WebGLUniformLocation | undefined;
    fogStartDistance: WebGLUniformLocation | undefined;

    // Attributes are numbers.
    public rm_Vertex = 0;
    public rm_AO = 1;

    // Uniforms are of type `WebGLUniformLocation`
    public color0: WebGLUniformLocation | undefined;
    public color1: WebGLUniformLocation | undefined;

    fillCode() {
        this.vertexShaderCode = `#version 300 es
            precision highp float;
            layout(location = 0) in vec2 rm_Vertex;
            layout(location = 1) in mediump float aAO;

            uniform mediump vec4 color0;
            uniform mediump vec4 color1;
            out mediump vec4 vAO;
            void main() {
              gl_Position.xy = rm_Vertex;
              gl_Position.z = 0.5;
              gl_Position.w = 1.0;
              vAO = mix(color0, color1, aAO);
            }`;

        this.fragmentShaderCode = `#version 300 es
            precision mediump float;
            out vec4 fragColor;
            in mediump vec4 vAO;

            const float MIN = 0.0;
            const float MAX = 1.0;

            void main() {
              fragColor = smoothstep(MIN, MAX, vAO);
            }`;
    }

    fillUniformsAttributes() {
        this.color0 = this.getUniform("color0");
        this.color1 = this.getUniform("color1");
    }

    drawVignette(
        renderer: RendererWithExposedMethods,
        model: FullModel
    ): void {
        const gl = renderer.gl as WebGL2RenderingContext;

        model.bindBuffers(gl);

        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_AO);

        gl.vertexAttribPointer(this.rm_Vertex, 2, gl.HALF_FLOAT, false, 8, 0);
        gl.vertexAttribPointer(this.rm_AO, 1, gl.UNSIGNED_BYTE, true, 8, 6);

        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);

        renderer.checkGlError("VertexVignetteShader2 drawVignette");
    }
}
