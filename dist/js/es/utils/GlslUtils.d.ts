/**
 * Perceived luminance.
 * https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
 */
export declare const LUMINANCE: string;
/**
 * Grayscale color
 */
export declare const GRAYSCALE: string;
/**
 * Adjust brightness and contrast.
 */
export declare const BRIGHTNESS_CONTRAST: string;
/**
 * 4 steps for value from 0 to 1.
 */
export declare const STEP4: string;
/**
 * Cross-hatch pattern.
 */
export declare const CROSS_HATCH: string;
/**
 * Reduce number or colors.
 */
export declare const REDUCE_COLORS: string;
/**
 * Random functions from The Book of Shaders.
 * `random_vec2` accepts vec2 as seed.
 * `random` accepts float as seed.
 * From https://thebookofshaders.com/10/
 */
export declare const RANDOM: string;
/**
 * Inverse random function.
 * From https://thebookofshaders.com/10/
 */
export declare const INVERSE_RANDOM: string;
/**
 * Rotation functions.
 * `rotationMatrix` rotates around arbitrary axis.
 * `rotationAroundZ` has optimized math to rotate only around Z axis.
 * https://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
 */
export declare const ROTATION: string;
/**
 * Gradient Noise by Inigo Quilez - iq/2013
 * https://www.shadertoy.com/view/XdXGW8
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org
 */
export declare const GRADIENT_NOISE: string;
/**
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export declare const VALUE_NOISE: string;
/**
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export declare const VALUE_NOISE_CHEAP: string;
/**
 * Generates 2 random values for 2 vec2 packed into single vec4.
 *
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export declare const VALUE_NOISE2: string;
/**
 * Generates 2 random values for 2 vec2 packed into single vec4.
 * Clear repetitive horizontal and vertical patterns can be seen.
 * Still good enough for low-frequency vertex stuff
 *
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export declare const VALUE_NOISE2_CHEAP: string;
/**
 * Color vibrance.
 */
export declare const VIBRANCE: string;
