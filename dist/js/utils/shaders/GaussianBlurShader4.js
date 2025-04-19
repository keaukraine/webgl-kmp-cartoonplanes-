"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianBlurShader4 = void 0;
const GaussianBlurShader_1 = require("./GaussianBlurShader");
/**
 * Gaussian blur shader.
 * Uses blur radius of 4 pixels.
 */
class GaussianBlurShader4 extends GaussianBlurShader_1.GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 5;
const float OFFSETS[5] = float[5](
    -3.4048471718931532,
    -1.4588111840004858,
    0.48624268466894843,
    2.431625915613778,
    4.
);
const float WEIGHTS[5] = float[5](
    0.15642123799829394,
    0.26718801880015064,
    0.29738065394682034,
    0.21568339342709997,
    0.06332669582763516
);`;
    }
}
exports.GaussianBlurShader4 = GaussianBlurShader4;
//# sourceMappingURL=GaussianBlurShader4.js.map