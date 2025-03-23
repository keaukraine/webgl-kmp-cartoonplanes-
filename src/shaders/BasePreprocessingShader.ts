import { BaseShader } from "webgl-framework";
import { ShaderPreprocessing } from "../ShaderPreprocessing";

export abstract class BasePreprocessingShader extends BaseShader {
    constructor(
        gl: WebGLRenderingContext | WebGL2RenderingContext,
        protected preprocessingVertex: ShaderPreprocessing[] = [],
        protected preprocessingFragment: ShaderPreprocessing[] = []
    ) {
        super(gl);
        this.initShader();
    }

    protected initShader(): void {
        // Prevent super from compiling shader without preprocessing replacements initialized
        if (this.preprocessingVertex === undefined || this.preprocessingFragment === undefined) {
            return;
        }

        this.preprocessCode();
        super.initShader();
    }

    protected preprocessCode(): void {
        for (const item of this.preprocessingVertex ?? []) {
            this.vertexShaderCode = this.vertexShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
        for (const item of this.preprocessingFragment ?? []) {
            this.fragmentShaderCode = this.fragmentShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
    }
}
