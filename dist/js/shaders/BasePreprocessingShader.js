"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePreprocessingShader = void 0;
const webgl_framework_1 = require("webgl-framework");
class BasePreprocessingShader extends webgl_framework_1.BaseShader {
    constructor(gl, preprocessingVertex = [], preprocessingFragment = []) {
        super(gl);
        this.preprocessingVertex = preprocessingVertex;
        this.preprocessingFragment = preprocessingFragment;
        this.initShader();
    }
    initShader() {
        // Prevent super from compiling shader without preprocessing replacements initialized
        if (this.preprocessingVertex === undefined || this.preprocessingFragment === undefined) {
            return;
        }
        this.preprocessCode();
        super.initShader();
    }
    preprocessCode() {
        var _a, _b;
        for (const item of (_a = this.preprocessingVertex) !== null && _a !== void 0 ? _a : []) {
            this.vertexShaderCode = this.vertexShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
        for (const item of (_b = this.preprocessingFragment) !== null && _b !== void 0 ? _b : []) {
            this.fragmentShaderCode = this.fragmentShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
    }
}
exports.BasePreprocessingShader = BasePreprocessingShader;
//# sourceMappingURL=BasePreprocessingShader.js.map