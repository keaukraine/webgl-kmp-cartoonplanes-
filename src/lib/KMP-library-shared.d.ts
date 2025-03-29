type Nullable<T> = T | null | undefined
export declare namespace org.androidworks.engine {
    abstract class BackendMode {
        private constructor();
        static get OPENGL(): org.androidworks.engine.BackendMode & {
            get name(): "OPENGL";
            get ordinal(): 0;
        };
        static get METAL(): org.androidworks.engine.BackendMode & {
            get name(): "METAL";
            get ordinal(): 1;
        };
        static values(): Array<org.androidworks.engine.BackendMode>;
        static valueOf(value: string): org.androidworks.engine.BackendMode;
        get name(): "OPENGL" | "METAL";
        get ordinal(): 0 | 1;
    }
}
export declare namespace org.androidworks.engine {
    abstract class BlendingEquation {
        private constructor();
        static get ADD(): org.androidworks.engine.BlendingEquation & {
            get name(): "ADD";
            get ordinal(): 0;
        };
        static get SUBTRACT(): org.androidworks.engine.BlendingEquation & {
            get name(): "SUBTRACT";
            get ordinal(): 1;
        };
        static get REVERSE_SUBTRACT(): org.androidworks.engine.BlendingEquation & {
            get name(): "REVERSE_SUBTRACT";
            get ordinal(): 2;
        };
        static values(): Array<org.androidworks.engine.BlendingEquation>;
        static valueOf(value: string): org.androidworks.engine.BlendingEquation;
        get name(): "ADD" | "SUBTRACT" | "REVERSE_SUBTRACT";
        get ordinal(): 0 | 1 | 2;
    }
    abstract class BlendingFactor {
        private constructor();
        static get ZERO(): org.androidworks.engine.BlendingFactor & {
            get name(): "ZERO";
            get ordinal(): 0;
        };
        static get ONE(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE";
            get ordinal(): 1;
        };
        static get SRC_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "SRC_COLOR";
            get ordinal(): 2;
        };
        static get ONE_MINUS_SRC_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_SRC_COLOR";
            get ordinal(): 3;
        };
        static get DST_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "DST_COLOR";
            get ordinal(): 4;
        };
        static get ONE_MINUS_DST_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_DST_COLOR";
            get ordinal(): 5;
        };
        static get SRC_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "SRC_ALPHA";
            get ordinal(): 6;
        };
        static get ONE_MINUS_SRC_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_SRC_ALPHA";
            get ordinal(): 7;
        };
        static get DST_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "DST_ALPHA";
            get ordinal(): 8;
        };
        static get ONE_MINUS_DST_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_DST_ALPHA";
            get ordinal(): 9;
        };
        static get CONSTANT_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "CONSTANT_COLOR";
            get ordinal(): 10;
        };
        static get ONE_MINUS_CONSTANT_COLOR(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_CONSTANT_COLOR";
            get ordinal(): 11;
        };
        static get CONSTANT_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "CONSTANT_ALPHA";
            get ordinal(): 12;
        };
        static get ONE_MINUS_CONSTANT_ALPHA(): org.androidworks.engine.BlendingFactor & {
            get name(): "ONE_MINUS_CONSTANT_ALPHA";
            get ordinal(): 13;
        };
        static get SRC_ALPHA_SATURATE(): org.androidworks.engine.BlendingFactor & {
            get name(): "SRC_ALPHA_SATURATE";
            get ordinal(): 14;
        };
        static values(): Array<org.androidworks.engine.BlendingFactor>;
        static valueOf(value: string): org.androidworks.engine.BlendingFactor;
        get name(): "ZERO" | "ONE" | "SRC_COLOR" | "ONE_MINUS_SRC_COLOR" | "DST_COLOR" | "ONE_MINUS_DST_COLOR" | "SRC_ALPHA" | "ONE_MINUS_SRC_ALPHA" | "DST_ALPHA" | "ONE_MINUS_DST_ALPHA" | "CONSTANT_COLOR" | "ONE_MINUS_CONSTANT_COLOR" | "CONSTANT_ALPHA" | "ONE_MINUS_CONSTANT_ALPHA" | "SRC_ALPHA_SATURATE";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    }
    class Blending {
        constructor();
        get enabled(): boolean;
        set enabled(value: boolean);
        get isSeparateAlpha(): boolean;
        set isSeparateAlpha(value: boolean);
        get equationAlpha(): org.androidworks.engine.BlendingEquation;
        set equationAlpha(value: org.androidworks.engine.BlendingEquation);
        get equationColor(): org.androidworks.engine.BlendingEquation;
        set equationColor(value: org.androidworks.engine.BlendingEquation);
        get sourceFactorAlpha(): org.androidworks.engine.BlendingFactor;
        set sourceFactorAlpha(value: org.androidworks.engine.BlendingFactor);
        get destinationFactorAlpha(): org.androidworks.engine.BlendingFactor;
        set destinationFactorAlpha(value: org.androidworks.engine.BlendingFactor);
        get sourceFactorColor(): org.androidworks.engine.BlendingFactor;
        set sourceFactorColor(value: org.androidworks.engine.BlendingFactor);
        get destinationFactorColor(): org.androidworks.engine.BlendingFactor;
        set destinationFactorColor(value: org.androidworks.engine.BlendingFactor);
    }
}
export declare namespace org.androidworks.engine {
    abstract class CullFace {
        private constructor();
        static get FRONT(): org.androidworks.engine.CullFace & {
            get name(): "FRONT";
            get ordinal(): 0;
        };
        static get BACK(): org.androidworks.engine.CullFace & {
            get name(): "BACK";
            get ordinal(): 1;
        };
        static get FRONT_AND_BACK(): org.androidworks.engine.CullFace & {
            get name(): "FRONT_AND_BACK";
            get ordinal(): 2;
        };
        static get DISABLED(): org.androidworks.engine.CullFace & {
            get name(): "DISABLED";
            get ordinal(): 3;
        };
        static values(): Array<org.androidworks.engine.CullFace>;
        static valueOf(value: string): org.androidworks.engine.CullFace;
        get name(): "FRONT" | "BACK" | "FRONT_AND_BACK" | "DISABLED";
        get ordinal(): 0 | 1 | 2 | 3;
    }
}
export declare namespace org.androidworks.engine {
    class DepthMode {
        constructor(depthTest?: boolean, depthWrite?: boolean);
        get depthTest(): boolean;
        set depthTest(value: boolean);
        get depthWrite(): boolean;
        set depthWrite(value: boolean);
    }
}
export declare namespace org.androidworks.engine {
    class Mesh {
        private constructor();
        get name(): string;
        set name(value: string);
        get id(): number;
        set id(value: number);
        get fileName(): string;
        set fileName(value: string);
        get loaded(): boolean;
        set loaded(value: boolean);
        get attributes(): Nullable<org.androidworks.engine.MeshAttributes>;
        set attributes(value: Nullable<org.androidworks.engine.MeshAttributes>);
        static MeshConstructor1(): org.androidworks.engine.Mesh;
        static MeshConstructor2(name: string, attrs?: Nullable<org.androidworks.engine.MeshAttributes>): org.androidworks.engine.Mesh;
    }
}
export declare namespace org.androidworks.engine {
    abstract class Scene {
        constructor();
        protected get lastFrameTime(): number;
        protected set lastFrameTime(value: number);
        protected get viewportWidth(): number;
        protected set viewportWidth(value: number);
        protected get viewportHeight(): number;
        protected set viewportHeight(value: number);
        get matView(): Float32Array;
        get useExternalViewMatrix(): boolean;
        set useExternalViewMatrix(value: boolean);
        get matProjection(): Float32Array;
        protected get matModel(): Float32Array;
        protected get matMVP(): Float32Array;
        get zoom(): number;
        set zoom(value: number);
        protected get ZOOM_FOV(): number;
        protected set ZOOM_FOV(value: number);
        protected get FOV_LANDSCAPE(): number;
        protected set FOV_LANDSCAPE(value: number);
        protected get FOV_PORTRAIT(): number;
        protected set FOV_PORTRAIT(value: number);
        protected get Z_NEAR(): number;
        protected set Z_NEAR(value: number);
        protected get Z_FAR(): number;
        protected set Z_FAR(value: number);
        get backendMode(): org.androidworks.engine.BackendMode;
        set backendMode(value: org.androidworks.engine.BackendMode);
        get loaded(): boolean;
        set loaded(value: boolean);
        get commands(): any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Command> */;
        set commands(value: any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Command> */);
        get meshes(): any/* kotlin.collections.MutableList<org.androidworks.engine.Mesh> */;
        set meshes(value: any/* kotlin.collections.MutableList<org.androidworks.engine.Mesh> */);
        get textures(): any/* kotlin.collections.MutableList<org.androidworks.engine.Texture> */;
        set textures(value: any/* kotlin.collections.MutableList<org.androidworks.engine.Texture> */);
        get shaders(): any/* kotlin.collections.MutableList<org.androidworks.engine.Shader> */;
        set shaders(value: any/* kotlin.collections.MutableList<org.androidworks.engine.Shader> */);
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        calculateProjection(multiplier?: number, width?: number, height?: number): void;
        abstract initialize(): void;
        calculateMVPMatrix(tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void;
        calculateMVPMatrixFromModelMatrix(modelMatrix: Float32Array): void;
        setMvpUniform(uniform: org.androidworks.engine.UniformValue, tx: number, ty: number, tz: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number): void;
        updateMeshTransformations(commands: any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Command> */): void;
    }
}
export declare namespace org.androidworks.engine {
    class Shader {
        constructor(name?: string);
        get name(): string;
        set name(value: string);
        get id(): number;
        set id(value: number);
    }
}
export declare namespace org.androidworks.engine {
    abstract class TextureFiltering {
        private constructor();
        static get NEAREST(): org.androidworks.engine.TextureFiltering & {
            get name(): "NEAREST";
            get ordinal(): 0;
        };
        static get LINEAR(): org.androidworks.engine.TextureFiltering & {
            get name(): "LINEAR";
            get ordinal(): 1;
        };
        static get NEAREST_MIPMAP_NEAREST(): org.androidworks.engine.TextureFiltering & {
            get name(): "NEAREST_MIPMAP_NEAREST";
            get ordinal(): 2;
        };
        static get LINEAR_MIPMAP_NEAREST(): org.androidworks.engine.TextureFiltering & {
            get name(): "LINEAR_MIPMAP_NEAREST";
            get ordinal(): 3;
        };
        static get NEAREST_MIPMAP_LINEAR(): org.androidworks.engine.TextureFiltering & {
            get name(): "NEAREST_MIPMAP_LINEAR";
            get ordinal(): 4;
        };
        static get LINEAR_MIPMAP_LINEAR(): org.androidworks.engine.TextureFiltering & {
            get name(): "LINEAR_MIPMAP_LINEAR";
            get ordinal(): 5;
        };
        static values(): Array<org.androidworks.engine.TextureFiltering>;
        static valueOf(value: string): org.androidworks.engine.TextureFiltering;
        get name(): "NEAREST" | "LINEAR" | "NEAREST_MIPMAP_NEAREST" | "LINEAR_MIPMAP_NEAREST" | "NEAREST_MIPMAP_LINEAR" | "LINEAR_MIPMAP_LINEAR";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5;
    }
    abstract class TextureWrapping {
        private constructor();
        static get CLAMP_TO_EDGE(): org.androidworks.engine.TextureWrapping & {
            get name(): "CLAMP_TO_EDGE";
            get ordinal(): 0;
        };
        static get MIRRORED_REPEAT(): org.androidworks.engine.TextureWrapping & {
            get name(): "MIRRORED_REPEAT";
            get ordinal(): 1;
        };
        static get REPEAT(): org.androidworks.engine.TextureWrapping & {
            get name(): "REPEAT";
            get ordinal(): 2;
        };
        static values(): Array<org.androidworks.engine.TextureWrapping>;
        static valueOf(value: string): org.androidworks.engine.TextureWrapping;
        get name(): "CLAMP_TO_EDGE" | "MIRRORED_REPEAT" | "REPEAT";
        get ordinal(): 0 | 1 | 2;
    }
    abstract class TextureFormat {
        private constructor();
        static get RGBA8(): org.androidworks.engine.TextureFormat & {
            get name(): "RGBA8";
            get ordinal(): 0;
        };
        static get RGB8(): org.androidworks.engine.TextureFormat & {
            get name(): "RGB8";
            get ordinal(): 1;
        };
        static get RGB16F(): org.androidworks.engine.TextureFormat & {
            get name(): "RGB16F";
            get ordinal(): 2;
        };
        static get RGB32F(): org.androidworks.engine.TextureFormat & {
            get name(): "RGB32F";
            get ordinal(): 3;
        };
        static get RGBA16F(): org.androidworks.engine.TextureFormat & {
            get name(): "RGBA16F";
            get ordinal(): 4;
        };
        static get RGBA32F(): org.androidworks.engine.TextureFormat & {
            get name(): "RGBA32F";
            get ordinal(): 5;
        };
        static get ASTC(): org.androidworks.engine.TextureFormat & {
            get name(): "ASTC";
            get ordinal(): 6;
        };
        static values(): Array<org.androidworks.engine.TextureFormat>;
        static valueOf(value: string): org.androidworks.engine.TextureFormat;
        get name(): "RGBA8" | "RGB8" | "RGB16F" | "RGB32F" | "RGBA16F" | "RGBA32F" | "ASTC";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }
    abstract class TextureType {
        private constructor();
        static get TEX_1D(): org.androidworks.engine.TextureType & {
            get name(): "TEX_1D";
            get ordinal(): 0;
        };
        static get TEX_2D(): org.androidworks.engine.TextureType & {
            get name(): "TEX_2D";
            get ordinal(): 1;
        };
        static get TEX_3D(): org.androidworks.engine.TextureType & {
            get name(): "TEX_3D";
            get ordinal(): 2;
        };
        static get CUBEMAP(): org.androidworks.engine.TextureType & {
            get name(): "CUBEMAP";
            get ordinal(): 3;
        };
        static values(): Array<org.androidworks.engine.TextureType>;
        static valueOf(value: string): org.androidworks.engine.TextureType;
        get name(): "TEX_1D" | "TEX_2D" | "TEX_3D" | "CUBEMAP";
        get ordinal(): 0 | 1 | 2 | 3;
    }
    class Texture {
        constructor();
        get type(): org.androidworks.engine.TextureType;
        set type(value: org.androidworks.engine.TextureType);
        get name(): string;
        set name(value: string);
        get fileName(): string;
        set fileName(value: string);
        get id(): number;
        set id(value: number);
        get loaded(): boolean;
        set loaded(value: boolean);
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        get minFilter(): org.androidworks.engine.TextureFiltering;
        set minFilter(value: org.androidworks.engine.TextureFiltering);
        get magFilter(): org.androidworks.engine.TextureFiltering;
        set magFilter(value: org.androidworks.engine.TextureFiltering);
        get wrapping(): org.androidworks.engine.TextureWrapping;
        set wrapping(value: org.androidworks.engine.TextureWrapping);
        get mipmaps(): number;
        set mipmaps(value: number);
        get format(): org.androidworks.engine.TextureFormat;
        set format(value: org.androidworks.engine.TextureFormat);
        get anisotropy(): number;
        set anisotropy(value: number);
    }
}
export declare namespace org.androidworks.engine {
    class UniformValue {
        constructor();
    }
    class UniformFloatValue extends org.androidworks.engine.UniformValue {
        private constructor();
        get value(): Float32Array;
        set value(value: Float32Array);
        static UniformFloatValueWithArray(value: Float32Array): org.androidworks.engine.UniformFloatValue;
    }
    class UniformIntValue extends org.androidworks.engine.UniformValue {
        private constructor();
        get value(): Int32Array;
        set value(value: Int32Array);
        static UniformIntValueWithArray(value: Int32Array): org.androidworks.engine.UniformIntValue;
    }
    class UniformTextureValue extends org.androidworks.engine.UniformValue {
        constructor(value: org.androidworks.engine.Texture);
        get value(): org.androidworks.engine.Texture;
        set value(value: org.androidworks.engine.Texture);
    }
}
export declare namespace org.androidworks.engine {
    abstract class VertexFormat {
        private constructor();
        static get UBYTE(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE";
            get ordinal(): 0;
        };
        static get UBYTE2(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE2";
            get ordinal(): 1;
        };
        static get UBYTE3(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE3";
            get ordinal(): 2;
        };
        static get UBYTE4(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE4";
            get ordinal(): 3;
        };
        static get BYTE(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE";
            get ordinal(): 4;
        };
        static get BYTE2(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE2";
            get ordinal(): 5;
        };
        static get BYTE3(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE3";
            get ordinal(): 6;
        };
        static get BYTE4(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE4";
            get ordinal(): 7;
        };
        static get UBYTE_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE_NORMALIZED";
            get ordinal(): 8;
        };
        static get UBYTE2_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE2_NORMALIZED";
            get ordinal(): 9;
        };
        static get UBYTE3_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE3_NORMALIZED";
            get ordinal(): 10;
        };
        static get UBYTE4_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "UBYTE4_NORMALIZED";
            get ordinal(): 11;
        };
        static get BYTE_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE_NORMALIZED";
            get ordinal(): 12;
        };
        static get BYTE2_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE2_NORMALIZED";
            get ordinal(): 13;
        };
        static get BYTE3_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE3_NORMALIZED";
            get ordinal(): 14;
        };
        static get BYTE4_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "BYTE4_NORMALIZED";
            get ordinal(): 15;
        };
        static get USHORT(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT";
            get ordinal(): 16;
        };
        static get USHORT2(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT2";
            get ordinal(): 17;
        };
        static get USHORT3(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT3";
            get ordinal(): 18;
        };
        static get USHORT4(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT4";
            get ordinal(): 19;
        };
        static get SHORT(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT";
            get ordinal(): 20;
        };
        static get SHORT2(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT2";
            get ordinal(): 21;
        };
        static get SHORT3(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT3";
            get ordinal(): 22;
        };
        static get SHORT4(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT4";
            get ordinal(): 23;
        };
        static get USHORT_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT_NORMALIZED";
            get ordinal(): 24;
        };
        static get USHORT2_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT2_NORMALIZED";
            get ordinal(): 25;
        };
        static get USHORT3_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT3_NORMALIZED";
            get ordinal(): 26;
        };
        static get USHORT4_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "USHORT4_NORMALIZED";
            get ordinal(): 27;
        };
        static get SHORT_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT_NORMALIZED";
            get ordinal(): 28;
        };
        static get SHORT2_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT2_NORMALIZED";
            get ordinal(): 29;
        };
        static get SHORT3_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT3_NORMALIZED";
            get ordinal(): 30;
        };
        static get SHORT4_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "SHORT4_NORMALIZED";
            get ordinal(): 31;
        };
        static get HALF(): org.androidworks.engine.VertexFormat & {
            get name(): "HALF";
            get ordinal(): 32;
        };
        static get HALF2(): org.androidworks.engine.VertexFormat & {
            get name(): "HALF2";
            get ordinal(): 33;
        };
        static get HALF3(): org.androidworks.engine.VertexFormat & {
            get name(): "HALF3";
            get ordinal(): 34;
        };
        static get HALF4(): org.androidworks.engine.VertexFormat & {
            get name(): "HALF4";
            get ordinal(): 35;
        };
        static get FLOAT(): org.androidworks.engine.VertexFormat & {
            get name(): "FLOAT";
            get ordinal(): 36;
        };
        static get FLOAT2(): org.androidworks.engine.VertexFormat & {
            get name(): "FLOAT2";
            get ordinal(): 37;
        };
        static get FLOAT3(): org.androidworks.engine.VertexFormat & {
            get name(): "FLOAT3";
            get ordinal(): 38;
        };
        static get FLOAT4(): org.androidworks.engine.VertexFormat & {
            get name(): "FLOAT4";
            get ordinal(): 39;
        };
        static get UINT(): org.androidworks.engine.VertexFormat & {
            get name(): "UINT";
            get ordinal(): 40;
        };
        static get UINT2(): org.androidworks.engine.VertexFormat & {
            get name(): "UINT2";
            get ordinal(): 41;
        };
        static get UINT3(): org.androidworks.engine.VertexFormat & {
            get name(): "UINT3";
            get ordinal(): 42;
        };
        static get UINT4(): org.androidworks.engine.VertexFormat & {
            get name(): "UINT4";
            get ordinal(): 43;
        };
        static get INT(): org.androidworks.engine.VertexFormat & {
            get name(): "INT";
            get ordinal(): 44;
        };
        static get INT2(): org.androidworks.engine.VertexFormat & {
            get name(): "INT2";
            get ordinal(): 45;
        };
        static get INT3(): org.androidworks.engine.VertexFormat & {
            get name(): "INT3";
            get ordinal(): 46;
        };
        static get INT4(): org.androidworks.engine.VertexFormat & {
            get name(): "INT4";
            get ordinal(): 47;
        };
        static get INT_1010102_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "INT_1010102_NORMALIZED";
            get ordinal(): 48;
        };
        static get UINT_1010102_NORMALIZED(): org.androidworks.engine.VertexFormat & {
            get name(): "UINT_1010102_NORMALIZED";
            get ordinal(): 49;
        };
        static values(): Array<org.androidworks.engine.VertexFormat>;
        static valueOf(value: string): org.androidworks.engine.VertexFormat;
        get name(): "UBYTE" | "UBYTE2" | "UBYTE3" | "UBYTE4" | "BYTE" | "BYTE2" | "BYTE3" | "BYTE4" | "UBYTE_NORMALIZED" | "UBYTE2_NORMALIZED" | "UBYTE3_NORMALIZED" | "UBYTE4_NORMALIZED" | "BYTE_NORMALIZED" | "BYTE2_NORMALIZED" | "BYTE3_NORMALIZED" | "BYTE4_NORMALIZED" | "USHORT" | "USHORT2" | "USHORT3" | "USHORT4" | "SHORT" | "SHORT2" | "SHORT3" | "SHORT4" | "USHORT_NORMALIZED" | "USHORT2_NORMALIZED" | "USHORT3_NORMALIZED" | "USHORT4_NORMALIZED" | "SHORT_NORMALIZED" | "SHORT2_NORMALIZED" | "SHORT3_NORMALIZED" | "SHORT4_NORMALIZED" | "HALF" | "HALF2" | "HALF3" | "HALF4" | "FLOAT" | "FLOAT2" | "FLOAT3" | "FLOAT4" | "UINT" | "UINT2" | "UINT3" | "UINT4" | "INT" | "INT2" | "INT3" | "INT4" | "INT_1010102_NORMALIZED" | "UINT_1010102_NORMALIZED";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49;
    }
    class VertexAttribute {
        constructor(type: org.androidworks.engine.AttributeType, index: number, format: org.androidworks.engine.VertexFormat, offset: number);
        get type(): org.androidworks.engine.AttributeType;
        get index(): number;
        get format(): org.androidworks.engine.VertexFormat;
        get offset(): number;
        copy(type?: org.androidworks.engine.AttributeType, index?: number, format?: org.androidworks.engine.VertexFormat, offset?: number): org.androidworks.engine.VertexAttribute;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
    class VertexAttributesDescriptor {
        constructor(attributes: any/* kotlin.collections.List<org.androidworks.engine.VertexAttribute> */, stride: number);
        get attributes(): any/* kotlin.collections.List<org.androidworks.engine.VertexAttribute> */;
        get stride(): number;
        copy(attributes?: any/* kotlin.collections.List<org.androidworks.engine.VertexAttribute> */, stride?: number): org.androidworks.engine.VertexAttributesDescriptor;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
    abstract class AttributeType {
        private constructor();
        static get VERTEX(): org.androidworks.engine.AttributeType & {
            get name(): "VERTEX";
            get ordinal(): 0;
        };
        static get NORMAL(): org.androidworks.engine.AttributeType & {
            get name(): "NORMAL";
            get ordinal(): 1;
        };
        static get COLOR(): org.androidworks.engine.AttributeType & {
            get name(): "COLOR";
            get ordinal(): 2;
        };
        static get UV0(): org.androidworks.engine.AttributeType & {
            get name(): "UV0";
            get ordinal(): 3;
        };
        static get UV1(): org.androidworks.engine.AttributeType & {
            get name(): "UV1";
            get ordinal(): 4;
        };
        static get UV2(): org.androidworks.engine.AttributeType & {
            get name(): "UV2";
            get ordinal(): 5;
        };
        static get AO(): org.androidworks.engine.AttributeType & {
            get name(): "AO";
            get ordinal(): 6;
        };
        static get CUSTOM0(): org.androidworks.engine.AttributeType & {
            get name(): "CUSTOM0";
            get ordinal(): 7;
        };
        static get CUSTOM1(): org.androidworks.engine.AttributeType & {
            get name(): "CUSTOM1";
            get ordinal(): 8;
        };
        static get CUSTOM2(): org.androidworks.engine.AttributeType & {
            get name(): "CUSTOM2";
            get ordinal(): 9;
        };
        static get CUSTOM3(): org.androidworks.engine.AttributeType & {
            get name(): "CUSTOM3";
            get ordinal(): 10;
        };
        static get U0(): org.androidworks.engine.AttributeType & {
            get name(): "U0";
            get ordinal(): 11;
        };
        static get V0(): org.androidworks.engine.AttributeType & {
            get name(): "V0";
            get ordinal(): 12;
        };
        static get U1(): org.androidworks.engine.AttributeType & {
            get name(): "U1";
            get ordinal(): 13;
        };
        static get V1(): org.androidworks.engine.AttributeType & {
            get name(): "V1";
            get ordinal(): 14;
        };
        static get U2(): org.androidworks.engine.AttributeType & {
            get name(): "U2";
            get ordinal(): 15;
        };
        static get V2(): org.androidworks.engine.AttributeType & {
            get name(): "V2";
            get ordinal(): 16;
        };
        static values(): Array<org.androidworks.engine.AttributeType>;
        static valueOf(value: string): org.androidworks.engine.AttributeType;
        get name(): "VERTEX" | "NORMAL" | "COLOR" | "UV0" | "UV1" | "UV2" | "AO" | "CUSTOM0" | "CUSTOM1" | "CUSTOM2" | "CUSTOM3" | "U0" | "V0" | "U1" | "V1" | "U2" | "V2";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
    }
    class MeshAttribute {
        constructor(type: org.androidworks.engine.AttributeType, format: org.androidworks.engine.VertexFormat, offset: number);
        get type(): org.androidworks.engine.AttributeType;
        get format(): org.androidworks.engine.VertexFormat;
        get offset(): number;
        copy(type?: org.androidworks.engine.AttributeType, format?: org.androidworks.engine.VertexFormat, offset?: number): org.androidworks.engine.MeshAttribute;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
    class MeshAttributes {
        constructor(attributes: any/* kotlin.collections.List<org.androidworks.engine.MeshAttribute> */, stride: number);
        get attributes(): any/* kotlin.collections.List<org.androidworks.engine.MeshAttribute> */;
        get stride(): number;
        copy(attributes?: any/* kotlin.collections.List<org.androidworks.engine.MeshAttribute> */, stride?: number): org.androidworks.engine.MeshAttributes;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
}
export declare namespace org.androidworks.engine.camera {
    class CameraPathAnimator {
        constructor(speed: number, minDuration: number, transitionDuration: number, isSmooth?: boolean);
        protected get speed(): number;
        protected set speed(value: number);
        protected get minDuration(): number;
        protected set minDuration(value: number);
        protected get transitionDuration(): number;
        protected set transitionDuration(value: number);
        protected get enabled(): boolean;
        protected set enabled(value: boolean);
        get minDurationCoefficient(): number;
        set minDurationCoefficient(value: number);
        enable(): void;
        disable(): void;
        get positionInterpolator(): org.androidworks.engine.camera.CameraPositionInterpolator;
        get timer(): number;
        get state(): org.androidworks.engine.camera.CameraState;
        setCameras(value: Array<any/* org.androidworks.engine.camera.CameraPositionPair */>, randomizeCamera?: boolean): void;
        get currentCameraPair(): any/* org.androidworks.engine.camera.CameraPositionPair */;
        nextCamera(): void;
        randomCamera(): void;
        protected setCameraState(state: org.androidworks.engine.camera.CameraState): void;
        animate(timeNow: number): void;
        changeDirection(impulse: number): void;
    }
}
export declare namespace org.androidworks.engine.camera {
    class CameraPositionInterpolator {
        constructor(isSmooth?: boolean);
        protected get isSmooth(): boolean;
        protected set isSmooth(value: boolean);
        get speed(): number;
        set speed(value: number);
        get timer(): number;
        set timer(value: number);
        get reverse(): boolean;
        set reverse(value: boolean);
        get matrix(): Float32Array;
        get cameraPosition(): org.androidworks.engine.math.Vec3;
        get cameraRotation(): org.androidworks.engine.math.Vec3;
        setMinDuration(value: number): void;
        setPosition(value: any/* org.androidworks.engine.camera.CameraPositionPair */): void;
        setTimer(value: number): void;
        iterate(timeNow: number): void;
        reset(): void;
        static get Companion(): {
        };
    }
}
export declare namespace org.androidworks.engine.camera {
    abstract class CameraState {
        private constructor();
        get value(): number;
        static get ANIMATING(): org.androidworks.engine.camera.CameraState & {
            get name(): "ANIMATING";
            get ordinal(): 0;
        };
        static get TRANSITIONING(): org.androidworks.engine.camera.CameraState & {
            get name(): "TRANSITIONING";
            get ordinal(): 1;
        };
        static values(): Array<org.androidworks.engine.camera.CameraState>;
        static valueOf(value: string): org.androidworks.engine.camera.CameraState;
        get name(): "ANIMATING" | "TRANSITIONING";
        get ordinal(): 0 | 1;
    }
}
export declare namespace org.androidworks.engine.commands {
    abstract class BlurSize {
        private constructor();
        static get KERNEL_5(): org.androidworks.engine.commands.BlurSize & {
            get name(): "KERNEL_5";
            get ordinal(): 0;
        };
        static get KERNEL_4(): org.androidworks.engine.commands.BlurSize & {
            get name(): "KERNEL_4";
            get ordinal(): 1;
        };
        static get KERNEL_3(): org.androidworks.engine.commands.BlurSize & {
            get name(): "KERNEL_3";
            get ordinal(): 2;
        };
        static get KERNEL_2(): org.androidworks.engine.commands.BlurSize & {
            get name(): "KERNEL_2";
            get ordinal(): 3;
        };
        static values(): Array<org.androidworks.engine.commands.BlurSize>;
        static valueOf(value: string): org.androidworks.engine.commands.BlurSize;
        get name(): "KERNEL_5" | "KERNEL_4" | "KERNEL_3" | "KERNEL_2";
        get ordinal(): 0 | 1 | 2 | 3;
    }
    /* @ts-ignore: extends class with private primary constructor */
    class BlurredPassCommand extends org.androidworks.engine.commands.RenderPassCommand {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get minSize(): number;
        set minSize(value: number);
        get brightness(): number;
        set brightness(value: number);
        get blurSize(): org.androidworks.engine.commands.BlurSize;
        set blurSize(value: org.androidworks.engine.commands.BlurSize);
        get additionalBlur(): boolean;
        set additionalBlur(value: boolean);
        get id(): number;
        set id(value: number);
    }
    class DrawBlurredCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get blending(): org.androidworks.engine.Blending;
        set blending(value: org.androidworks.engine.Blending);
        get id(): number;
        set id(value: number);
    }
}
export declare namespace org.androidworks.engine.commands {
    class ClearColorCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get color(): org.androidworks.engine.math.Vec4;
        set color(value: org.androidworks.engine.math.Vec4);
    }
}
export declare namespace org.androidworks.engine.commands {
    abstract class ClearCommandClearType {
        private constructor();
        static get COLOR(): org.androidworks.engine.commands.ClearCommandClearType & {
            get name(): "COLOR";
            get ordinal(): 0;
        };
        static get DEPTH(): org.androidworks.engine.commands.ClearCommandClearType & {
            get name(): "DEPTH";
            get ordinal(): 1;
        };
        static get COLOR_AND_DEPTH(): org.androidworks.engine.commands.ClearCommandClearType & {
            get name(): "COLOR_AND_DEPTH";
            get ordinal(): 2;
        };
        static values(): Array<org.androidworks.engine.commands.ClearCommandClearType>;
        static valueOf(value: string): org.androidworks.engine.commands.ClearCommandClearType;
        get name(): "COLOR" | "DEPTH" | "COLOR_AND_DEPTH";
        get ordinal(): 0 | 1 | 2;
    }
    class ClearCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get clearType(): org.androidworks.engine.commands.ClearCommandClearType;
        set clearType(value: org.androidworks.engine.commands.ClearCommandClearType);
    }
}
export declare namespace org.androidworks.engine.commands {
    abstract class Command {
        constructor();
        abstract get type(): org.androidworks.engine.commands.CommandType;
        get enabled(): boolean;
        set enabled(value: boolean);
        get name(): string;
        set name(value: string);
    }
}
export declare namespace org.androidworks.engine.commands {
    abstract class CommandType {
        private constructor();
        get value(): number;
        static get NOOP(): org.androidworks.engine.commands.CommandType & {
            get name(): "NOOP";
            get ordinal(): 0;
        };
        static get GROUP(): org.androidworks.engine.commands.CommandType & {
            get name(): "GROUP";
            get ordinal(): 1;
        };
        static get CLEAR_COLOR(): org.androidworks.engine.commands.CommandType & {
            get name(): "CLEAR_COLOR";
            get ordinal(): 2;
        };
        static get CLEAR(): org.androidworks.engine.commands.CommandType & {
            get name(): "CLEAR";
            get ordinal(): 3;
        };
        static get VIGNETTE(): org.androidworks.engine.commands.CommandType & {
            get name(): "VIGNETTE";
            get ordinal(): 4;
        };
        static get DRAW_MESH(): org.androidworks.engine.commands.CommandType & {
            get name(): "DRAW_MESH";
            get ordinal(): 5;
        };
        static get BLURRED_PASS(): org.androidworks.engine.commands.CommandType & {
            get name(): "BLURRED_PASS";
            get ordinal(): 6;
        };
        static get DRAW_BLURRED(): org.androidworks.engine.commands.CommandType & {
            get name(): "DRAW_BLURRED";
            get ordinal(): 7;
        };
        static get RENDER_PASS(): org.androidworks.engine.commands.CommandType & {
            get name(): "RENDER_PASS";
            get ordinal(): 8;
        };
        static get MAIN_PASS(): org.androidworks.engine.commands.CommandType & {
            get name(): "MAIN_PASS";
            get ordinal(): 9;
        };
        static get CUSTOM(): org.androidworks.engine.commands.CommandType & {
            get name(): "CUSTOM";
            get ordinal(): 10;
        };
        static values(): Array<org.androidworks.engine.commands.CommandType>;
        static valueOf(value: string): org.androidworks.engine.commands.CommandType;
        get name(): "NOOP" | "GROUP" | "CLEAR_COLOR" | "CLEAR" | "VIGNETTE" | "DRAW_MESH" | "BLURRED_PASS" | "DRAW_BLURRED" | "RENDER_PASS" | "MAIN_PASS" | "CUSTOM";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    }
}
export declare namespace org.androidworks.engine.commands {
    class DrawMeshState {
        constructor(shader: org.androidworks.engine.Shader, blending: org.androidworks.engine.Blending, depthMode: org.androidworks.engine.DepthMode, culling: org.androidworks.engine.CullFace, vertexAttributes: Nullable<org.androidworks.engine.VertexAttributesDescriptor>);
        get shader(): org.androidworks.engine.Shader;
        set shader(value: org.androidworks.engine.Shader);
        get blending(): org.androidworks.engine.Blending;
        set blending(value: org.androidworks.engine.Blending);
        get depthMode(): org.androidworks.engine.DepthMode;
        set depthMode(value: org.androidworks.engine.DepthMode);
        get culling(): org.androidworks.engine.CullFace;
        set culling(value: org.androidworks.engine.CullFace);
        get vertexAttributes(): Nullable<org.androidworks.engine.VertexAttributesDescriptor>;
        set vertexAttributes(value: Nullable<org.androidworks.engine.VertexAttributesDescriptor>);
    }
    abstract class PrimitiveType {
        private constructor();
        static get TRIANGLES(): org.androidworks.engine.commands.PrimitiveType & {
            get name(): "TRIANGLES";
            get ordinal(): 0;
        };
        static get TRIANGLE_STRIP(): org.androidworks.engine.commands.PrimitiveType & {
            get name(): "TRIANGLE_STRIP";
            get ordinal(): 1;
        };
        static get POINTS(): org.androidworks.engine.commands.PrimitiveType & {
            get name(): "POINTS";
            get ordinal(): 2;
        };
        static values(): Array<org.androidworks.engine.commands.PrimitiveType>;
        static valueOf(value: string): org.androidworks.engine.commands.PrimitiveType;
        get name(): "TRIANGLES" | "TRIANGLE_STRIP" | "POINTS";
        get ordinal(): 0 | 1 | 2;
    }
    class DrawMeshCommand extends org.androidworks.engine.commands.Command {
        constructor(mesh: Nullable<org.androidworks.engine.Mesh>, uniforms: any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */, state: org.androidworks.engine.commands.DrawMeshState, primitiveType?: org.androidworks.engine.commands.PrimitiveType, primitiveCount?: number);
        get mesh(): Nullable<org.androidworks.engine.Mesh>;
        set mesh(value: Nullable<org.androidworks.engine.Mesh>);
        get uniforms(): any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */;
        set uniforms(value: any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */);
        get state(): org.androidworks.engine.commands.DrawMeshState;
        set state(value: org.androidworks.engine.commands.DrawMeshState);
        get primitiveType(): org.androidworks.engine.commands.PrimitiveType;
        set primitiveType(value: org.androidworks.engine.commands.PrimitiveType);
        get primitiveCount(): number;
        set primitiveCount(value: number);
        get type(): org.androidworks.engine.commands.CommandType;
        get hints(): any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Hint> */;
        set hints(value: any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Hint> */);
    }
}
export declare namespace org.androidworks.engine.commands {
    class DrawTransformedMeshCommand extends org.androidworks.engine.commands.DrawMeshCommand {
        constructor(mesh: Nullable<org.androidworks.engine.Mesh>, uniforms: any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */, state: org.androidworks.engine.commands.DrawMeshState, transform: any/* org.androidworks.engine.commands.AffineTranformation */, indexUniformMvp?: number, indexUniformModel?: number, indexUniformView?: number, indexUniformProjection?: number, primitiveType?: org.androidworks.engine.commands.PrimitiveType);
        get transform(): any/* org.androidworks.engine.commands.AffineTranformation */;
        set transform(value: any/* org.androidworks.engine.commands.AffineTranformation */);
        get indexUniformMvp(): number;
        set indexUniformMvp(value: number);
        get indexUniformModel(): number;
        set indexUniformModel(value: number);
        get indexUniformView(): number;
        set indexUniformView(value: number);
        get indexUniformProjection(): number;
        set indexUniformProjection(value: number);
    }
    class DrawStaticMeshCommand extends org.androidworks.engine.commands.DrawTransformedMeshCommand {
        private constructor();
        get modelMatrix(): Float32Array;
        static DrawStaticMeshCommandConstructor(mesh: org.androidworks.engine.Mesh, uniforms: any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */, state: org.androidworks.engine.commands.DrawMeshState, transform: any/* org.androidworks.engine.commands.AffineTranformation */, indexUniformMvp?: number, indexUniformModel?: number, indexUniformView?: number, indexUniformProjection?: number, primitiveType?: org.androidworks.engine.commands.PrimitiveType): org.androidworks.engine.commands.DrawStaticMeshCommand;
    }
}
export declare namespace org.androidworks.engine.commands {
    class GroupCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get commands(): any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Command> */;
        set commands(value: any/* kotlin.collections.MutableList<org.androidworks.engine.commands.Command> */);
        static GroupCommandArr(enabled: boolean, commands: Array<org.androidworks.engine.commands.Command>): org.androidworks.engine.commands.GroupCommand;
    }
}
export declare namespace org.androidworks.engine.commands {
    abstract class Hint {
        constructor();
    }
    abstract class ShadingRate {
        private constructor();
        get value(): number;
        static get SHADING_RATE_1X1(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_1X1";
            get ordinal(): 0;
        };
        static get SHADING_RATE_1X2(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_1X2";
            get ordinal(): 1;
        };
        static get SHADING_RATE_2X1(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_2X1";
            get ordinal(): 2;
        };
        static get SHADING_RATE_2X2(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_2X2";
            get ordinal(): 3;
        };
        static get SHADING_RATE_4X2(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_4X2";
            get ordinal(): 4;
        };
        static get SHADING_RATE_4X4(): org.androidworks.engine.commands.ShadingRate & {
            get name(): "SHADING_RATE_4X4";
            get ordinal(): 5;
        };
        static values(): Array<org.androidworks.engine.commands.ShadingRate>;
        static valueOf(value: string): org.androidworks.engine.commands.ShadingRate;
        get name(): "SHADING_RATE_1X1" | "SHADING_RATE_1X2" | "SHADING_RATE_2X1" | "SHADING_RATE_2X2" | "SHADING_RATE_4X2" | "SHADING_RATE_4X4";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5;
    }
    class VrsHint extends org.androidworks.engine.commands.Hint {
        constructor(shadingRate: org.androidworks.engine.commands.ShadingRate);
        get shadingRate(): org.androidworks.engine.commands.ShadingRate;
    }
}
export declare namespace org.androidworks.engine.commands {
    /* @ts-ignore: extends class with private primary constructor */
    class MainPassCommand extends org.androidworks.engine.commands.RenderPassCommand {
        private constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        static MainPassCommandConstructor(): org.androidworks.engine.commands.MainPassCommand;
        static MainPassCommandArr(enabled: boolean, commands: Array<org.androidworks.engine.commands.Command>): org.androidworks.engine.commands.MainPassCommand;
    }
}
export declare namespace org.androidworks.engine.commands {
    class NoopCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
    }
}
export declare namespace org.androidworks.engine.commands {
    class RenderPassCommand extends org.androidworks.engine.commands.GroupCommand {
        private constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        static RenderPassCommandConstructor(): org.androidworks.engine.commands.RenderPassCommand;
        static RenderPassCommandArr(enabled: boolean, commands: Array<org.androidworks.engine.commands.Command>): org.androidworks.engine.commands.RenderPassCommand;
    }
}
export declare namespace org.androidworks.engine.commands {
    class VignetteCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
        get color0(): org.androidworks.engine.math.Vec4;
        set color0(value: org.androidworks.engine.math.Vec4);
        get color1(): org.androidworks.engine.math.Vec4;
        set color1(value: org.androidworks.engine.math.Vec4);
    }
}
export declare namespace org.androidworks.engine.common {
    abstract class ColorMode {
        private constructor();
        static get Normal(): org.androidworks.engine.common.ColorMode & {
            get name(): "Normal";
            get ordinal(): 0;
        };
        static get Grayscale(): org.androidworks.engine.common.ColorMode & {
            get name(): "Grayscale";
            get ordinal(): 1;
        };
        static get Sepia(): org.androidworks.engine.common.ColorMode & {
            get name(): "Sepia";
            get ordinal(): 2;
        };
        static get HighContrast(): org.androidworks.engine.common.ColorMode & {
            get name(): "HighContrast";
            get ordinal(): 3;
        };
        static get LowContrast(): org.androidworks.engine.common.ColorMode & {
            get name(): "LowContrast";
            get ordinal(): 4;
        };
        static get BlackAndWhite(): org.androidworks.engine.common.ColorMode & {
            get name(): "BlackAndWhite";
            get ordinal(): 5;
        };
        static get IsolatedColor(): org.androidworks.engine.common.ColorMode & {
            get name(): "IsolatedColor";
            get ordinal(): 6;
        };
        static get Crosshatch(): org.androidworks.engine.common.ColorMode & {
            get name(): "Crosshatch";
            get ordinal(): 7;
        };
        static get LimitedColors(): org.androidworks.engine.common.ColorMode & {
            get name(): "LimitedColors";
            get ordinal(): 8;
        };
        static values(): Array<org.androidworks.engine.common.ColorMode>;
        static valueOf(value: string): org.androidworks.engine.common.ColorMode;
        get name(): "Normal" | "Grayscale" | "Sepia" | "HighContrast" | "LowContrast" | "BlackAndWhite" | "IsolatedColor" | "Crosshatch" | "LimitedColors";
        get ordinal(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    }
}
export declare namespace org.androidworks.engine.math {
    class Vec2 {
        constructor(_x?: number, _y?: number);
        get x(): number;
        set x(value: number);
        get r(): number;
        set r(value: number);
        get y(): number;
        set y(value: number);
        get g(): number;
        set g(value: number);
        copy(_x?: number, _y?: number): org.androidworks.engine.math.Vec2;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
}
export declare namespace org.androidworks.engine.math {
    class Vec3 {
        constructor(_x?: number, _y?: number, _z?: number);
        get x(): number;
        set x(value: number);
        get r(): number;
        set r(value: number);
        get y(): number;
        set y(value: number);
        get g(): number;
        set g(value: number);
        get z(): number;
        set z(value: number);
        get b(): number;
        set b(value: number);
        copy(_x?: number, _y?: number, _z?: number): org.androidworks.engine.math.Vec3;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
}
export declare namespace org.androidworks.engine.math {
    class Vec4 {
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        get x(): number;
        set x(value: number);
        get r(): number;
        set r(value: number);
        get y(): number;
        set y(value: number);
        get g(): number;
        set g(value: number);
        get z(): number;
        set z(value: number);
        get b(): number;
        set b(value: number);
        get w(): number;
        set w(value: number);
        get a(): number;
        set a(value: number);
        copy(_x?: number, _y?: number, _z?: number, _w?: number): org.androidworks.engine.math.Vec4;
        toString(): string;
        hashCode(): number;
        equals(other: Nullable<any>): boolean;
    }
}
export declare namespace org.androidworks.arctic {
    class ArcticScene extends org.androidworks.engine.Scene {
        constructor();
        protected get timers(): any/* org.androidworks.engine.timers.TimersMap<org.androidworks.arctic.Timers> */;
        get cameraAnimator(): org.androidworks.engine.camera.CameraPathAnimator;
        protected get FOV_TRANSITION(): number;
        get settings(): org.androidworks.arctic.ArcticSettings;
        get uniformPaletteTexture(): org.androidworks.engine.UniformTextureValue;
        get uniformSkyTexture(): org.androidworks.engine.UniformTextureValue;
        get commandClouds(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get commandStars(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get groupBirds(): org.androidworks.engine.commands.GroupCommand;
        get BIRD_FLIGHT_RADIUS(): number;
        get groupShips(): org.androidworks.engine.commands.GroupCommand;
        get groupAnimalsAnimated(): org.androidworks.engine.commands.GroupCommand;
        get groupAnimalsSleeping(): org.androidworks.engine.commands.GroupCommand;
        get groupPenguinsIdle(): org.androidworks.engine.commands.GroupCommand;
        get groupPenguinsIdle2(): org.androidworks.engine.commands.GroupCommand;
        get groupSealIdle(): org.androidworks.engine.commands.GroupCommand;
        get groupSealWalking(): org.androidworks.engine.commands.GroupCommand;
        get commandSun(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get commandSunLow(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get PIf(): number;
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        initialize(): void;
        protected applySettings(): void;
        protected animate(): void;
        static setAnimationUniforms$default($this: org.androidworks.arctic.ArcticScene, timerAnim: number, animation: any/* org.androidworks.engine.animation.TextureAnimationChunked */, uniforms: any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */, startEndStart?: boolean): void;
        nextCamera(): void;
        randomCamera(): void;
    }
}
export declare namespace org.androidworks.arctic {
    abstract class TimeOfDay {
        private constructor();
        static get Day(): org.androidworks.arctic.TimeOfDay & {
            get name(): "Day";
            get ordinal(): 0;
        };
        static get Night(): org.androidworks.arctic.TimeOfDay & {
            get name(): "Night";
            get ordinal(): 1;
        };
        static get Sunrise(): org.androidworks.arctic.TimeOfDay & {
            get name(): "Sunrise";
            get ordinal(): 2;
        };
        static get Sunset(): org.androidworks.arctic.TimeOfDay & {
            get name(): "Sunset";
            get ordinal(): 3;
        };
        static values(): Array<org.androidworks.arctic.TimeOfDay>;
        static valueOf(value: string): org.androidworks.arctic.TimeOfDay;
        get name(): "Day" | "Night" | "Sunrise" | "Sunset";
        get ordinal(): 0 | 1 | 2 | 3;
    }
    class ArcticSettings {
        constructor();
        get cameraPeriod(): number;
        set cameraPeriod(value: number);
        get vignette(): boolean;
        set vignette(value: boolean);
        get blurred(): boolean;
        set blurred(value: boolean);
        get autoSwitchCameras(): boolean;
        set autoSwitchCameras(value: boolean);
        get timeOfDay(): org.androidworks.arctic.TimeOfDay;
        set timeOfDay(value: org.androidworks.arctic.TimeOfDay);
        get clock(): boolean;
        set clock(value: boolean);
        get lowQuality(): boolean;
        set lowQuality(value: boolean);
    }
}
export declare namespace org.androidworks.brutalism {
    class DrawClockCommand extends org.androidworks.engine.commands.Command {
        constructor();
        get type(): org.androidworks.engine.commands.CommandType;
    }
}
export declare namespace org.androidworks.brutalism {
    class BrutalismScene extends org.androidworks.engine.Scene {
        constructor();
        protected get timers(): any/* org.androidworks.engine.timers.TimersMap<org.androidworks.brutalism.Timers> */;
        get cameraAnimator(): org.androidworks.engine.camera.CameraPathAnimator;
        protected get FOV_TRANSITION(): number;
        get settings(): org.androidworks.brutalism.BrutalismSettings;
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        initialize(): void;
        protected applySettings(): void;
        protected animate(): void;
        nextCamera(): void;
        nextRoom(): void;
        nextCameraOrRoom(): void;
        randomCameraOrNextRoom(): void;
    }
}
export declare namespace org.androidworks.brutalism {
    class BrutalismSettings {
        constructor();
        get lowQuality(): boolean;
        set lowQuality(value: boolean);
        get cameraPeriod(): number;
        set cameraPeriod(value: number);
        get vignette(): boolean;
        set vignette(value: boolean);
        get clock(): boolean;
        set clock(value: boolean);
        get blurred(): boolean;
        set blurred(value: boolean);
        get colorMode(): org.androidworks.engine.common.ColorMode;
        set colorMode(value: org.androidworks.engine.common.ColorMode);
        get autoSwitchCameras(): boolean;
        set autoSwitchCameras(value: boolean);
    }
}
export declare namespace org.androidworks.cartoonplanes {
    class CartoonPlanesScene extends org.androidworks.engine.Scene {
        constructor();
        get settings(): org.androidworks.cartoonplanes.CartoonPlanesSettings;
        get PIf(): number;
        get texSky(): org.androidworks.engine.Texture;
        set texSky(value: org.androidworks.engine.Texture);
        get texSky1(): org.androidworks.engine.Texture;
        set texSky1(value: org.androidworks.engine.Texture);
        get texSky2(): org.androidworks.engine.Texture;
        set texSky2(value: org.androidworks.engine.Texture);
        get meshPlane1(): org.androidworks.engine.Mesh;
        set meshPlane1(value: org.androidworks.engine.Mesh);
        get meshPlane2(): org.androidworks.engine.Mesh;
        set meshPlane2(value: org.androidworks.engine.Mesh);
        get texPlane1(): org.androidworks.engine.Texture;
        set texPlane1(value: org.androidworks.engine.Texture);
        get texPlane2(): org.androidworks.engine.Texture;
        set texPlane2(value: org.androidworks.engine.Texture);
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        initialize(): void;
        changeSky(): void;
        preventChangeSky(): void;
        randomizePropTexture(): void;
        setPropTexture(id: number): void;
        canChangePlanes(): boolean;
        canChangeSky(): boolean;
        changePlanes(plane1: number, plane2: number): void;
    }
}
export declare namespace org.androidworks.cartoonplanes {
    abstract class TimeOfDay {
        private constructor();
        static get Day(): org.androidworks.cartoonplanes.TimeOfDay & {
            get name(): "Day";
            get ordinal(): 0;
        };
        static get Night(): org.androidworks.cartoonplanes.TimeOfDay & {
            get name(): "Night";
            get ordinal(): 1;
        };
        static get Sunrise(): org.androidworks.cartoonplanes.TimeOfDay & {
            get name(): "Sunrise";
            get ordinal(): 2;
        };
        static values(): Array<org.androidworks.cartoonplanes.TimeOfDay>;
        static valueOf(value: string): org.androidworks.cartoonplanes.TimeOfDay;
        get name(): "Day" | "Night" | "Sunrise";
        get ordinal(): 0 | 1 | 2;
    }
    class CartoonPlanesSettings {
        constructor();
        get cameraPeriod(): number;
        set cameraPeriod(value: number);
        get vignette(): boolean;
        set vignette(value: boolean);
        get blurred(): boolean;
        set blurred(value: boolean);
        get autoSwitchCameras(): boolean;
        set autoSwitchCameras(value: boolean);
        get lowQuality(): boolean;
        set lowQuality(value: boolean);
        get clock(): boolean;
        set clock(value: boolean);
        get currentPlane(): number;
        set currentPlane(value: number);
        get nextPlane(): number;
        set nextPlane(value: number);
        get timeOfDay(): org.androidworks.cartoonplanes.TimeOfDay;
        set timeOfDay(value: org.androidworks.cartoonplanes.TimeOfDay);
    }
}
export declare namespace org.androidworks.example {
    class ExampleScene extends org.androidworks.engine.Scene {
        constructor();
        protected get timers(): any/* org.androidworks.engine.timers.TimersMap<org.androidworks.example.Timers> */;
        get cameraAnimator(): org.androidworks.engine.camera.CameraPathAnimator;
        protected get FOV_TRANSITION(): number;
        get arr1(): Float32Array;
        get arr2(): Array<number>;
        get arr3(): Float32Array;
        get arr4(): Array<number>;
        set arr4(value: Array<number>);
        get map8(): any/* kotlin.collections.Map<number, string> */;
        get uniformsMountainsBright(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsMountainsDark(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsCenterRockBright(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsCenterRockDark(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsHills(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsGround1(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsGround2(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsWater(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsWaterHighlights(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get uniformsSkyObjects(): any/* kotlin.collections.List<org.androidworks.engine.UniformFloatValue> */;
        get texStatic(): org.androidworks.engine.Texture;
        get uniformsDiffuseTest(): any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */;
        get texFp16(): org.androidworks.engine.Texture;
        get uniformsAnimated(): any/* kotlin.collections.List<org.androidworks.engine.UniformValue> */;
        get animationAnimal(): any/* org.androidworks.engine.animation.TextureAnimationChunked */;
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        initialize(): void;
        protected animate(): void;
        static get Companion(): {
        };
    }
}
export declare namespace org.androidworks.skyscrapers {
    class SkyscrapersScene extends org.androidworks.engine.Scene {
        constructor();
        get cameraAnimator(): org.androidworks.engine.camera.CameraPathAnimator;
        get settings(): org.androidworks.skyscrapers.SkyscrapersSettings;
        get commandStars(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get commandBuildings(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get commandBuildingsBloom(): org.androidworks.engine.commands.DrawTransformedMeshCommand;
        get PIf(): number;
        updateTimers(time: number): void;
        updateViewportSize(width: number, height: number): void;
        initialize(): void;
        protected applySettings(): void;
        protected animate(): void;
        protected updatePlanes(): void;
        protected updatePlanePosition(angle: number, centerX: number, centerY: number, result: org.androidworks.engine.math.Vec3): void;
        nextCamera(): void;
        randomCamera(): void;
        changeSpeed(impulse: number): void;
    }
}
export declare namespace org.androidworks.skyscrapers {
    class SkyscrapersSettings {
        constructor();
        get cameraPeriod(): number;
        set cameraPeriod(value: number);
        get vignette(): boolean;
        set vignette(value: boolean);
        get blurred(): boolean;
        set blurred(value: boolean);
        get autoSwitchCameras(): boolean;
        set autoSwitchCameras(value: boolean);
        get lowQuality(): boolean;
        set lowQuality(value: boolean);
        get clock(): boolean;
        set clock(value: boolean);
        get lights(): number;
        set lights(value: number);
    }
}
export as namespace org_androidworks_engine_shared;