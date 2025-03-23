import { Preprocessing, ShaderPreprocessing } from "./ShaderPreprocessing";
import *  as GlslUtils from "./utils/GlslUtils";

export const getFilters = (fragColor: string): { [key: string]: ShaderPreprocessing[] } => ({
    "Grayscale": [
        {
            stringToReplace: Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.GRAYSCALE + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = grayscale(brightnessContrast(" + fragColor + ", 0.15, 1.4));"
        }
    ],
    "Sepia": [
        {
            stringToReplace: Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.GRAYSCALE + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = vec4(0.74, 0.55, 0.3, 1.0) * grayscale(brightnessContrast(" + fragColor + ", 0.2, 0.9));"
        }
    ],
    "HighContrast": [
        {
            stringToReplace: Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.VIBRANCE
        },
        {
            stringToReplace: Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = vibrance(" + fragColor + ", 2.2);"
        }
    ],
    "LowContrast": [
        {
            stringToReplace: Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = brightnessContrast(" + fragColor + ", 0.0, 0.9);"
        }
    ],
    "LimitedColors": [
        {
            stringToReplace: Preprocessing.UNIFORMS,
            valueToReplaceWith: GlslUtils.REDUCE_COLORS + GlslUtils.BRIGHTNESS_CONTRAST
        },
        {
            stringToReplace: Preprocessing.POST_FRAGMENT,
            valueToReplaceWith: fragColor + " = reduceColors(brightnessContrast(" + fragColor + ", 0.25, 1.9), 6.0);"
        }
    ],
    "Normal": []
});
