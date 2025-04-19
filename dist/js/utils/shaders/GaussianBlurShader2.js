"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianBlurShader2 = void 0;
const GaussianBlurShader_1 = require("./GaussianBlurShader");
/**
 * Gaussian blur shader.
 * Uses blur radius of 3 pixels.
 */
class GaussianBlurShader2 extends GaussianBlurShader_1.GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 3;
const float OFFSETS[3] = float[3](
    -1.4588111840004858,
    0.48624268466894843,
    2.
);
const float WEIGHTS[3] = float[3](
    0.38883081312055,
    0.43276926113573877,
    0.17839992574371122
);`;
    }
}
exports.GaussianBlurShader2 = GaussianBlurShader2;
//# sourceMappingURL=GaussianBlurShader2.js.map