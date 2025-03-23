import { FullModel } from "webgl-framework";
import { VertexVignetteShader2 } from "./shaders/VertexVignetteShader2";
import { RendererWithExposedMethods } from "webgl-framework/dist/types/RendererWithExposedMethods";

export class Vignette {
    protected fmVignette = new FullModel();
    protected shader?: VertexVignetteShader2;

    protected color0: number[] = [0, 0, 0, 1];
    protected color1: number[] = [1, 1, 1, 1];

    async initialize(gl: WebGLRenderingContext): Promise<void> {
        this.shader = new VertexVignetteShader2(gl);
        await this.fmVignette.load(`data/models/vignette-round-vntao`, gl);
    }

    public setColor0(r: number, g: number, b: number, a: number) {
        this.color0[0] = r;
        this.color0[1] = g;
        this.color0[2] = b;
        this.color0[3] = a;
    }

    public setColor1(r: number, g: number, b: number, a: number) {
        this.color1[0] = r;
        this.color1[1] = g;
        this.color1[2] = b;
        this.color1[3] = a;
    }

    public draw(renderer: RendererWithExposedMethods) {
        if (this.shader === undefined) {
            return;
        }

        const gl = renderer.gl;

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);

        this.shader.use();

        gl.uniform4fv(this.shader.color0!, this.color0);
        gl.uniform4fv(this.shader.color1!, this.color1);

        this.shader.drawVignette(renderer, this.fmVignette);

        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
    }
}
