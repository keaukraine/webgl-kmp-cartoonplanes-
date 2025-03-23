/**
 * Perceived luminance.
 * https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
 */
export const LUMINANCE = "" +
    "float luminance(in vec4 color) {\n" +
    "  return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;\n" +
    "}\n";

/**
 * Grayscale color
 */
export const GRAYSCALE = "" +
    "vec4 grayscale(in vec4 color) {\n" +
    "  float y = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;\n" +
    "  return vec4(y, y, y, color.a);\n" +
    "}\n";

/**
 * Adjust brightness and contrast.
 */
export const BRIGHTNESS_CONTRAST = "" +
    "vec4 brightnessContrast(in vec4 inColor, in float brightness, in float contrast)\n" +
    "{\n" +
    "  return vec4((inColor.rgb - 0.5) * contrast + 0.5 + brightness, inColor.a);\n" +
    "}\n";

/**
 * 4 steps for value from 0 to 1.
 */
export const STEP4 = "" +
    "float step4(in float a)\n" +
    "{\n" +
    "  return (step(0.25, a) + step(0.5, a) + step(0.75, a)) * 0.3333;\n" +
    "}\n";

/**
 * Cross-hatch pattern.
 */
export const CROSS_HATCH = "void crosshatch(in float lum, in float gridSize, in float lineWidth, out vec4 color) {" +
    "   color = vec4(1.0, 1.0, 1.0, 1.0);\n" +
    "   if (lum < 1.00) {\n" +
    "       if (mod(gl_FragCoord.x + gl_FragCoord.y, gridSize) <= lineWidth) {\n" +
    "           color = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "       }\n" +
    "   }\n" +
    "   if (lum < 0.75) {\n" +
    "       if (mod(gl_FragCoord.x - gl_FragCoord.y, gridSize) <= lineWidth) {\n" +
    "           color = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "       }\n" +
    "   }\n" +
    "   if (lum < 0.50) {\n" +
    "       if (mod(gl_FragCoord.x + gl_FragCoord.y - gridSize / 2.0, gridSize) <= lineWidth) {\n" +
    "           color = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "       }\n" +
    "   }\n" +
    "   if (lum < 0.3) {\n" +
    "       if (mod(gl_FragCoord.x - gl_FragCoord.y - gridSize / 2.0, gridSize) <= lineWidth) {\n" +
    "           color = vec4(0.0, 0.0, 0.0, 1.0);\n" +
    "       }\n" +
    "   }" +
    "}";

/**
 * Reduce number or colors.
 */
export const REDUCE_COLORS = "" +
    "vec4 reduceColors(in vec4 color, in float colors) {\n" +
    "  return floor(color * colors + 0.5) / colors;\n" +
    "}\n";

/**
 * Random functions from The Book of Shaders.
 * `random_vec2` accepts vec2 as seed.
 * `random` accepts float as seed.
 * From https://thebookofshaders.com/10/
 */
export const RANDOM = "\n" +
    "float random_vec2 (vec2 st) {\n" +
    "    return fract(sin(dot(st.xy,vec2(12.9898, 78.233))) * 43758.5453123);\n" +
    "}\n" +
    "\n" +

    "float random (float st) {\n" +
    "    return fract(sin(st) * 43758.5453123);\n" +
    "}\n";

/**
 * Inverse random function.
 * From https://thebookofshaders.com/10/
 */
export const INVERSE_RANDOM = "\n" +
    "float random_vec2 (vec2 st) {\n" +
    "    return 1.0 - fract(sin(dot(st.xy,vec2(12.9898, 78.233))) * 43758.5453123);\n" +
    "}\n" +
    "\n" +

    "float random (float st) {\n" +
    "    return 1.0 - fract(sin(st) * 43758.5453123);\n" +
    "}\n";

/**
 * Rotation functions.
 * `rotationMatrix` rotates around arbitrary axis.
 * `rotationAroundZ` has optimized math to rotate only around Z axis.
 * https://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
 */
export const ROTATION = "\n" +
    "mat4 rotationMatrix(vec3 axis, float angle)\n" +
    "{\n" +
    "    float s = sin(angle);\n" +
    "    float c = cos(angle);\n" +
    "    float oc = 1.0 - c;\n" +
    "    \n" +
    "    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n" +
    "                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n" +
    "                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n" +
    "                0.0,                                0.0,                                0.0,                                1.0);\n" +
    "}  \n" +
    "\n" +

    "/** Optimized version to rotate only around X axis */\n" +
    "mat4 rotationAroundX(float angle)\n" +
    "{\n" +
    "    float s = sin(angle);\n" +
    "    float c = cos(angle);\n" +
    "\n" +
    "    return mat4(1.0, 0.0, 0.0, 0.0,\n" +
    "                0.0, c,   -s,  0.0,\n" +
    "                0.0, s,   c,   0.0,\n" +
    "                0.0, 0.0, 0.0, 1.0);\n" +
    "}\n" +

    "/** Optimized version to rotate only around Y axis */\n" +
    "mat4 rotationAroundY(float angle)\n" +
    "{\n" +
    "    float s = sin(angle);\n" +
    "    float c = cos(angle);\n" +
    "\n" +
    "    return mat4(c,   0.0, s,   0.0,\n" +
    "                0.0, 1.0, 0.0, 0.0,\n" +
    "                -s,  0.0, c,   0.0,\n" +
    "                0.0, 0.0, 0.0, 1.0);\n" +
    "}\n" +

    "mat4 rotationAroundZ(float angle)\n" +
    "{\n" +
    "    float s = sin(angle);\n" +
    "    float c = cos(angle);\n" +
    "    \n" +
    "    return mat4(c,  -s,   0.0, 0.0,\n" +
    "                s,   c,   0.0, 0.0,\n" +
    "                0.0, 0.0, 1.0, 0.0,\n" +
    "                0.0, 0.0, 0.0, 1.0);\n" +
    "}\n";

/**
 * Gradient Noise by Inigo Quilez - iq/2013
 * https://www.shadertoy.com/view/XdXGW8
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org
 */
export const GRADIENT_NOISE = "\n" +
    "vec2 random2(vec2 st){\n" +
    "    st = vec2( dot(st,vec2(127.1,311.7)),\n" +
    "              dot(st,vec2(269.5,183.3)) );\n" +
    "    return -1.0 + 2.0*fract(sin(st)*43758.5453123);\n" +
    "}\n" +
    "\n" +
    "float noise(vec2 st) {\n" +
    "    vec2 i = floor(st);\n" +
    "    vec2 f = fract(st);\n" +
    "\n" +
    "    vec2 u = f*f*(3.0-2.0*f);\n" +
    "\n" +
    "    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),\n" +
    "                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),\n" +
    "                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),\n" +
    "                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);\n" +
    "}    \n" +
    "";

/**
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export const VALUE_NOISE = "\n" +
    "float hash(vec2 p)  // replace this by something better\n" +
    "{\n" +
    "    p = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));\n" +
    "    return -1.0+2.0*fract( p.x*p.y*(p.x+p.y) );\n" +
    "}\n" +
    "\n" +
    "float noise( in vec2 p )\n" +
    "{\n" +
    "    vec2 i = floor( p );\n" +
    "    vec2 f = fract( p );\n" +
    "\n" +
    "    // vec2 u = f*f*(3.0-2.0*f); // original\n" +
    "    vec2 u = f; // less contrast, faster\n" +
    "\n" +
    "    return mix( mix( hash( i + vec2(0.0,0.0) ),\n" +
    "                     hash( i + vec2(1.0,0.0) ), u.x),\n" +
    "                mix( hash( i + vec2(0.0,1.0) ),\n" +
    "                     hash( i + vec2(1.0,1.0) ), u.x), u.y);\n" +
    "}\n";

/**
 * https://www.shadertoy.com/view/lsf3WH
 * The MIT License
 * Copyright © 2013 Inigo Quilez
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * https://www.youtube.com/c/InigoQuilez
 * https://iquilezles.org/
 */
export const VALUE_NOISE_CHEAP = "\n" +
    "float hash(vec2 p)  // replace this by something better\n" +
    "{\n" +
    "    p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));\n" +
    "    return -1.0+2.0*fract( p.x*p.y ); // repetitive horizontal and vertical patterns can be seen\n" +
    "}\n" +
    "\n" +
    "float noise( in vec2 p )\n" +
    "{\n" +
    "    vec2 i = floor( p );\n" +
    "    vec2 f = fract( p );\n" +
    "\n" +
    "    // vec2 u = f*f*(3.0-2.0*f); // original\n" +
    "    vec2 u = f; // less contrast, faster\n" +
    "\n" +
    "    return mix( mix( hash( i + vec2(0.0,0.0) ),\n" +
    "                     hash( i + vec2(1.0,0.0) ), u.x),\n" +
    "                mix( hash( i + vec2(0.0,1.0) ),\n" +
    "                     hash( i + vec2(1.0,1.0) ), u.x), u.y);\n" +
    "}\n";


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
export const VALUE_NOISE2 = "\n" +
    "const vec4 VALUE_NOISE_VEC2_COEFFS = vec4(0.71,0.113, 0.77,0.111);\n" +
    "\n" +
    "vec2 hash2(vec4 p)  // replace this by something better\n" +
    "{\n" +
    "    p  = 50.0*fract( p*0.3183099 + VALUE_NOISE_VEC2_COEFFS);\n" +
    "    return -1.0 + 2.0 * fract( vec2(\n" +
    "        ( p.x*p.y*(p.x+p.y) ),\n" +
    "        ( p.z*p.w*(p.z+p.w) )\n" +
    "    ));\n" +
    "}\n" +
    "\n" +
    "vec2 noise2( in vec4 p )\n" +
    "{\n" +
    "    vec4 i = floor( p );\n" +
    "    vec4 f = fract( p );\n" +
    "    // vec2 u = f*f*(3.0-2.0*f); // original\n" +
    "    vec4 u = f; // less contrast, faster\n" +
    "    return mix( mix( hash2( i ),\n" +
    "                     hash2( i + vec4(1.0,0.0,1.0,0.0) ), u.x),\n" +
    "                mix( hash2( i + vec4(0.0,1.0,0.0,1.0) ),\n" +
    "                     hash2( i + vec4(1.0,1.0,1.0,1.0) ), u.x), u.y);\n" +
    "}\n";

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
export const VALUE_NOISE2_CHEAP = "\n" +
    "const vec4 VALUE_NOISE_VEC2_COEFFS = vec4(0.71,0.113, 0.77,0.111);\n" +
    "\n" +
    "vec2 hash2(vec4 p)  // replace this by something better\n" +
    "{\n" +
    "    p  = 50.0*fract( p*0.3183099 + VALUE_NOISE_VEC2_COEFFS);\n" +
    "    return -1.0 + 2.0 * fract( vec2(\n" +
    "        ( p.x*p.y ), // repetitive horizontal and vertical patterns can be seen\n" +
    "        ( p.z*p.w )\n" +
    "    ));\n" +
    "}\n" +
    "\n" +
    "vec2 noise2( in vec4 p )\n" +
    "{\n" +
    "    vec4 i = floor( p );\n" +
    "    vec4 f = fract( p );\n" +
    "    // vec2 u = f*f*(3.0-2.0*f); // original\n" +
    "    vec4 u = f; // less contrast, faster\n" +
    "    return mix( mix( hash2( i ),\n" +
    "                     hash2( i + vec4(1.0,0.0,1.0,0.0) ), u.x),\n" +
    "                mix( hash2( i + vec4(0.0,1.0,0.0,1.0) ),\n" +
    "                     hash2( i + vec4(1.0,1.0,1.0,1.0) ), u.x), u.y);\n" +
    "}\n";

/**
 * Color vibrance.
 */
export const VIBRANCE = "" +
    "const mat3 rgb_to_yuv = mat3(\n" +
    "  vec3(0.2126, -0.099991, 0.615),\n" +
    "  vec3(0.7152, -0.33609, -0.55861),\n" +
    "  vec3(0.0722, 0.436, -0.05639)\n" +
    ");\n" +
    "const mat3 yuv_to_rgb = mat3(\n" +
    "  vec3(1.0, 1.0, 1.0),\n" +
    "  vec3(0.0, -0.21482, 2.12798),\n" +
    "  vec3(1.28033, -0.38059, 0.0)\n" +
    ");\n" +
    "vec4 vibrance(in vec4 color, in float v) {\n" +
    "  vec3 yuv = rgb_to_yuv * color.rgb;\n" +
    "  yuv.gb *= v;\n" +
    "  return vec4(yuv_to_rgb * yuv, color.a);\n" +
    "}\n";
