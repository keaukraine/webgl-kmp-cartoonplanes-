export const BLENDING_FACTORS = {
    "ZERO": WebGL2RenderingContext.ZERO,
    "ONE": WebGL2RenderingContext.ONE,
    "SRC_COLOR": WebGL2RenderingContext.SRC_COLOR,
    "ONE_MINUS_SRC_COLOR": WebGL2RenderingContext.ONE_MINUS_SRC_COLOR,
    "DST_COLOR": WebGL2RenderingContext.DST_COLOR,
    "ONE_MINUS_DST_COLOR": WebGL2RenderingContext.ONE_MINUS_DST_COLOR,
    "SRC_ALPHA": WebGL2RenderingContext.SRC_ALPHA,
    "ONE_MINUS_SRC_ALPHA": WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA,
    "DST_ALPHA": WebGL2RenderingContext.DST_ALPHA,
    "ONE_MINUS_DST_ALPHA": WebGL2RenderingContext.ONE_MINUS_DST_ALPHA,
    "CONSTANT_COLOR": WebGL2RenderingContext.CONSTANT_COLOR,
    "ONE_MINUS_CONSTANT_COLOR": WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR,
    "CONSTANT_ALPHA": WebGL2RenderingContext.CONSTANT_ALPHA,
    "ONE_MINUS_CONSTANT_ALPHA": WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA,
    "SRC_ALPHA_SATURATE": WebGL2RenderingContext.SRC_ALPHA_SATURATE
}

export const BLENDING_EQUATIONS = {
    "ADD": WebGL2RenderingContext.FUNC_ADD, // Default value for GLES
    "SUBTRACT": WebGL2RenderingContext.FUNC_SUBTRACT,
    "REVERSE_SUBTRACT": WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT
}

export const CULLING = {
    "BACK": WebGL2RenderingContext.BACK,
    "FRONT": WebGL2RenderingContext.FRONT,
    "FRONT_AND_BACK": WebGL2RenderingContext.FRONT_AND_BACK
}

export const VERTEX_FORMATS = {
    "UBYTE": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 1, normalized: false },
    "UBYTE2": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 2, normalized: false },
    "UBYTE3": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 3, normalized: false },
    "UBYTE4": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 4, normalized: false },
    "BYTE": { type: WebGL2RenderingContext.BYTE, size: 1, normalized: false },
    "BYTE2": { type: WebGL2RenderingContext.BYTE, size: 2, normalized: false },
    "BYTE3": { type: WebGL2RenderingContext.BYTE, size: 3, normalized: false },
    "BYTE4": { type: WebGL2RenderingContext.BYTE, size: 4, normalized: false },
    "UBYTE_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 1, normalized: true },
    "UBYTE2_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 2, normalized: true },
    "UBYTE3_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 3, normalized: true },
    "UBYTE4_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 4, normalized: true },
    "BYTE_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 1, normalized: true },
    "BYTE2_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 2, normalized: true },
    "BYTE3_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 3, normalized: true },
    "BYTE4_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 4, normalized: true },
    "USHORT": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 1, normalized: false },
    "USHORT2": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 2, normalized: false },
    "USHORT3": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 3, normalized: false },
    "USHORT4": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 4, normalized: false },
    "SHORT": { type: WebGL2RenderingContext.SHORT, size: 1, normalized: false },
    "SHORT2": { type: WebGL2RenderingContext.SHORT, size: 2, normalized: false },
    "SHORT3": { type: WebGL2RenderingContext.SHORT, size: 3, normalized: false },
    "SHORT4": { type: WebGL2RenderingContext.SHORT, size: 4, normalized: false },
    "USHORT_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 1, normalized: true },
    "USHORT2_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 2, normalized: true },
    "USHORT3_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 3, normalized: true },
    "USHORT4_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 4, normalized: true },
    "SHORT_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 1, normalized: true },
    "SHORT2_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 2, normalized: true },
    "SHORT3_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 3, normalized: true },
    "SHORT4_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 4, normalized: true },
    "HALF": { type: WebGL2RenderingContext.HALF_FLOAT, size: 1, normalized: false },
    "HALF2": { type: WebGL2RenderingContext.HALF_FLOAT, size: 2, normalized: false },
    "HALF3": { type: WebGL2RenderingContext.HALF_FLOAT, size: 3, normalized: false },
    "HALF4": { type: WebGL2RenderingContext.HALF_FLOAT, size: 4, normalized: false },
    "FLOAT": { type: WebGL2RenderingContext.FLOAT, size: 1, normalized: false },
    "FLOAT2": { type: WebGL2RenderingContext.FLOAT, size: 2, normalized: false },
    "FLOAT3": { type: WebGL2RenderingContext.FLOAT, size: 3, normalized: false },
    "FLOAT4": { type: WebGL2RenderingContext.FLOAT, size: 4, normalized: false },
    "UINT": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 1, normalized: false },
    "UINT2": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 2, normalized: false },
    "UINT3": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 3, normalized: false },
    "UINT4": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 4, normalized: false },
    "INT": { type: WebGL2RenderingContext.INT, size: 1, normalized: false },
    "INT2": { type: WebGL2RenderingContext.INT, size: 2, normalized: false },
    "INT3": { type: WebGL2RenderingContext.INT, size: 3, normalized: false },
    "INT4": { type: WebGL2RenderingContext.INT, size: 4, normalized: false },
    "INT_1010102_NORMALIZED": { type: WebGL2RenderingContext.INT_2_10_10_10_REV, size: 1, normalized: true },
    "UINT_1010102_NORMALIZED": { type: WebGL2RenderingContext.INT_2_10_10_10_REV, size: 1, normalized: true }
}

export const TEXTURE_FILTERING = {
    "NEAREST": WebGL2RenderingContext.NEAREST,
    "LINEAR": WebGL2RenderingContext.LINEAR,
    "NEAREST_MIPMAP_NEAREST": WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST,
    "LINEAR_MIPMAP_NEAREST": WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
    "NEAREST_MIPMAP_LINEAR": WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR,
    "LINEAR_MIPMAP_LINEAR": WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR
}

export const TEXTURE_WRAPPING = {
    "CLAMP_TO_EDGE": WebGL2RenderingContext.CLAMP_TO_EDGE,
    "MIRRORED_REPEAT": WebGL2RenderingContext.MIRRORED_REPEAT,
    "REPEAT": WebGL2RenderingContext.REPEAT
}
