"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilters = void 0;
const ShaderPreprocessing_1 = require("./ShaderPreprocessing");
const GlslUtils = require("./utils/GlslUtils");
const getFilters = (fragColor) => ({
    "Grayscale": [
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.GRAYSCALE + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = grayscale(brightnessContrast(" + fragColor + ", 0.15, 1.4));"
        }
    ],
    "Sepia": [
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.GRAYSCALE + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = vec4(0.74, 0.55, 0.3, 1.0) * grayscale(brightnessContrast(" + fragColor + ", 0.2, 0.9));"
        }
    ],
    "HighContrast": [
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.VIBRANCE
        },
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = vibrance(" + fragColor + ", 2.2);"
        }
    ],
    "LowContrast": [
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = brightnessContrast(" + fragColor + ", 0.0, 0.9);"
        }
    ],
    "LimitedColors": [
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.REDUCE_COLORS + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: ShaderPreprocessing_1.Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = reduceColors(brightnessContrast(" + fragColor + ", 0.25, 1.9), 6.0);"
        }
    ],
    "Normal": []
});
exports.getFilters = getFilters;
//# sourceMappingURL=Filters.js.map