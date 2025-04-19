"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianBlurShader3 = void 0;
const GaussianBlurShader_1 = require("./GaussianBlurShader");
/**
 * Gaussian blur shader.
 * Uses blur radius of 3 pixels.
 */
class GaussianBlurShader3 extends GaussianBlurShader_1.GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 4;
const float OFFSETS[4] = float[4](
    -2.431625915613778,
    -0.4862426846689484,
    1.4588111840004858,
    3.
);
const float WEIGHTS[4] = float[4](
    0.24696196374528634,
    0.34050702333458593,
    0.30593582919679174,
    0.10659518372333592
);`;
    }
}
exports.GaussianBlurShader3 = GaussianBlurShader3;
//# sourceMappingURL=GaussianBlurShader3.js.map