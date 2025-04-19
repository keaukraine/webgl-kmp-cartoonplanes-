"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define(['exports', './kotlin-kotlin-stdlib.js'], factory);
    else if (typeof exports === 'object')
        factory(module.exports, require('./kotlin-kotlin-stdlib.js'));
    else {
        if (typeof this['kotlin-kotlin-stdlib'] === 'undefined') {
            throw new Error("Error loading module 'KMP-library-engine'. Its dependency 'kotlin-kotlin-stdlib' was not found. Please, check whether 'kotlin-kotlin-stdlib' is loaded prior to 'KMP-library-engine'.");
        }
        root['KMP-library-engine'] = factory(typeof this['KMP-library-engine'] === 'undefined' ? {} : this['KMP-library-engine'], this['kotlin-kotlin-stdlib']);
    }
}(this, function (_, kotlin_kotlin) {
    'use strict';
    //region block: imports
    var imul = Math.imul;
    var THROW_IAE = kotlin_kotlin.$_$.g1;
    var Unit_instance = kotlin_kotlin.$_$.h;
    var Enum = kotlin_kotlin.$_$.e1;
    var protoOf = kotlin_kotlin.$_$.a1;
    var defineProp = kotlin_kotlin.$_$.q;
    var classMeta = kotlin_kotlin.$_$.p;
    var setMetadataFor = kotlin_kotlin.$_$.b1;
    var VOID = kotlin_kotlin.$_$.b;
    var objectCreate = kotlin_kotlin.$_$.y;
    var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
    var arrayCopy = kotlin_kotlin.$_$.j;
    var THROW_CCE = kotlin_kotlin.$_$.f1;
    var hashCode = kotlin_kotlin.$_$.v;
    var equals = kotlin_kotlin.$_$.r;
    var numberToInt = kotlin_kotlin.$_$.x;
    var Exception_init_$Create$ = kotlin_kotlin.$_$.e;
    var ensureNotNull = kotlin_kotlin.$_$.h1;
    var objectMeta = kotlin_kotlin.$_$.z;
    var get_PI = kotlin_kotlin.$_$.d1;
    var toMutableList = kotlin_kotlin.$_$.o;
    var Default_getInstance = kotlin_kotlin.$_$.g;
    var toString = kotlin_kotlin.$_$.c1;
    var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.f;
    var getNumberHashCode = kotlin_kotlin.$_$.u;
    var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.d;
    //endregion
    //region block: pre-declaration
    setMetadataFor(BackendMode, 'BackendMode', classMeta, Enum);
    setMetadataFor(BlendingEquation, 'BlendingEquation', classMeta, Enum);
    setMetadataFor(BlendingFactor, 'BlendingFactor', classMeta, Enum);
    setMetadataFor(Blending, 'Blending', classMeta, VOID, VOID, Blending);
    setMetadataFor(CullFace, 'CullFace', classMeta, Enum);
    setMetadataFor(DepthMode, 'DepthMode', classMeta, VOID, VOID, DepthMode);
    setMetadataFor(Mesh, 'Mesh', classMeta, VOID, VOID, MeshConstructor1);
    setMetadataFor(Scene, 'Scene', classMeta);
    setMetadataFor(Shader, 'Shader', classMeta, VOID, VOID, Shader);
    setMetadataFor(TextureFiltering, 'TextureFiltering', classMeta, Enum);
    setMetadataFor(TextureWrapping, 'TextureWrapping', classMeta, Enum);
    setMetadataFor(TextureFormat, 'TextureFormat', classMeta, Enum);
    setMetadataFor(TextureType, 'TextureType', classMeta, Enum);
    setMetadataFor(Texture, 'Texture', classMeta, VOID, VOID, Texture);
    setMetadataFor(UniformValue, 'UniformValue', classMeta, VOID, VOID, UniformValue);
    setMetadataFor(UniformFloatValue, 'UniformFloatValue', classMeta, UniformValue);
    setMetadataFor(UniformIntValue, 'UniformIntValue', classMeta, UniformValue);
    setMetadataFor(UniformTextureValue, 'UniformTextureValue', classMeta, UniformValue);
    setMetadataFor(VertexFormat, 'VertexFormat', classMeta, Enum);
    setMetadataFor(VertexAttribute, 'VertexAttribute', classMeta);
    setMetadataFor(VertexAttributesDescriptor, 'VertexAttributesDescriptor', classMeta);
    setMetadataFor(AttributeType, 'AttributeType', classMeta, Enum);
    setMetadataFor(MeshAttribute, 'MeshAttribute', classMeta);
    setMetadataFor(MeshAttributes, 'MeshAttributes', classMeta);
    setMetadataFor(TextureAnimationChunked, 'TextureAnimationChunked', classMeta);
    setMetadataFor(CameraPathAnimator, 'CameraPathAnimator', classMeta);
    setMetadataFor(CameraPosition, 'CameraPosition', classMeta);
    setMetadataFor(Companion, 'Companion', objectMeta);
    setMetadataFor(CameraPositionInterpolator, 'CameraPositionInterpolator', classMeta, VOID, VOID, CameraPositionInterpolator);
    setMetadataFor(CameraPositionPair, 'CameraPositionPair', classMeta);
    setMetadataFor(CameraState, 'CameraState', classMeta, Enum);
    setMetadataFor(Spline, 'Spline', classMeta);
    setMetadataFor(Spline3D, 'Spline3D', classMeta);
    setMetadataFor(BlurSize, 'BlurSize', classMeta, Enum);
    setMetadataFor(Command, 'Command', classMeta);
    setMetadataFor(GroupCommand, 'GroupCommand', classMeta, Command, VOID, GroupCommand);
    setMetadataFor(RenderPassCommand, 'RenderPassCommand', classMeta, GroupCommand, VOID, RenderPassCommandConstructor);
    setMetadataFor(BlurredPassCommand, 'BlurredPassCommand', classMeta, RenderPassCommand, VOID, BlurredPassCommand);
    setMetadataFor(DrawBlurredCommand, 'DrawBlurredCommand', classMeta, Command, VOID, DrawBlurredCommand);
    setMetadataFor(ClearColorCommand, 'ClearColorCommand', classMeta, Command, VOID, ClearColorCommand);
    setMetadataFor(ClearCommandClearType, 'ClearCommandClearType', classMeta, Enum);
    setMetadataFor(ClearCommand, 'ClearCommand', classMeta, Command, VOID, ClearCommand);
    setMetadataFor(CommandType, 'CommandType', classMeta, Enum);
    setMetadataFor(DrawMeshState, 'DrawMeshState', classMeta);
    setMetadataFor(PrimitiveType, 'PrimitiveType', classMeta, Enum);
    setMetadataFor(DrawMeshCommand, 'DrawMeshCommand', classMeta, Command);
    setMetadataFor(DrawTransformedMeshCommand, 'DrawTransformedMeshCommand', classMeta, DrawMeshCommand);
    setMetadataFor(DrawStaticMeshCommand, 'DrawStaticMeshCommand', classMeta, DrawTransformedMeshCommand);
    setMetadataFor(AffineTranformation, 'AffineTranformation', classMeta, VOID, VOID, AffineTranformation);
    setMetadataFor(Hint, 'Hint', classMeta);
    setMetadataFor(ShadingRate, 'ShadingRate', classMeta, Enum);
    setMetadataFor(VrsHint, 'VrsHint', classMeta, Hint);
    setMetadataFor(MainPassCommand, 'MainPassCommand', classMeta, RenderPassCommand, VOID, MainPassCommandConstructor);
    setMetadataFor(NoopCommand, 'NoopCommand', classMeta, Command, VOID, NoopCommand);
    setMetadataFor(VignetteCommand, 'VignetteCommand', classMeta, Command, VOID, VignetteCommand);
    setMetadataFor(ColorMode, 'ColorMode', classMeta, Enum);
    setMetadataFor(MathUtils, 'MathUtils', objectMeta);
    setMetadataFor(Matrix, 'Matrix', objectMeta);
    setMetadataFor(Vec2, 'Vec2', classMeta, VOID, VOID, Vec2);
    setMetadataFor(Vec3, 'Vec3', classMeta, VOID, VOID, Vec3);
    setMetadataFor(Vec4, 'Vec4', classMeta, VOID, VOID, Vec4);
    setMetadataFor(TimerParams, 'TimerParams', classMeta);
    setMetadataFor(TimersMap, 'TimersMap', classMeta, VOID, VOID, TimersMap);
    //endregion
    var BackendMode_OPENGL_instance;
    var BackendMode_METAL_instance;
    function values() {
        return [BackendMode_OPENGL_getInstance(), BackendMode_METAL_getInstance()];
    }
    function valueOf(value) {
        switch (value) {
            case 'OPENGL':
                return BackendMode_OPENGL_getInstance();
            case 'METAL':
                return BackendMode_METAL_getInstance();
            default:
                BackendMode_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var BackendMode_entriesInitialized;
    function BackendMode_initEntries() {
        if (BackendMode_entriesInitialized)
            return Unit_instance;
        BackendMode_entriesInitialized = true;
        BackendMode_OPENGL_instance = new BackendMode('OPENGL', 0, 0);
        BackendMode_METAL_instance = new BackendMode('METAL', 1, 1);
    }
    function BackendMode(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function BackendMode_OPENGL_getInstance() {
        BackendMode_initEntries();
        return BackendMode_OPENGL_instance;
    }
    function BackendMode_METAL_getInstance() {
        BackendMode_initEntries();
        return BackendMode_METAL_instance;
    }
    function get_BLENDING_NONE() {
        _init_properties_Blending_kt__efsar3();
        return BLENDING_NONE;
    }
    var BLENDING_NONE;
    var BlendingEquation_ADD_instance;
    var BlendingEquation_SUBTRACT_instance;
    var BlendingEquation_REVERSE_SUBTRACT_instance;
    function values_0() {
        return [BlendingEquation_ADD_getInstance(), BlendingEquation_SUBTRACT_getInstance(), BlendingEquation_REVERSE_SUBTRACT_getInstance()];
    }
    function valueOf_0(value) {
        switch (value) {
            case 'ADD':
                return BlendingEquation_ADD_getInstance();
            case 'SUBTRACT':
                return BlendingEquation_SUBTRACT_getInstance();
            case 'REVERSE_SUBTRACT':
                return BlendingEquation_REVERSE_SUBTRACT_getInstance();
            default:
                BlendingEquation_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var BlendingEquation_entriesInitialized;
    function BlendingEquation_initEntries() {
        if (BlendingEquation_entriesInitialized)
            return Unit_instance;
        BlendingEquation_entriesInitialized = true;
        BlendingEquation_ADD_instance = new BlendingEquation('ADD', 0, 0);
        BlendingEquation_SUBTRACT_instance = new BlendingEquation('SUBTRACT', 1, 1);
        BlendingEquation_REVERSE_SUBTRACT_instance = new BlendingEquation('REVERSE_SUBTRACT', 2, 2);
    }
    function BlendingEquation(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    var BlendingFactor_ZERO_instance;
    var BlendingFactor_ONE_instance;
    var BlendingFactor_SRC_COLOR_instance;
    var BlendingFactor_ONE_MINUS_SRC_COLOR_instance;
    var BlendingFactor_DST_COLOR_instance;
    var BlendingFactor_ONE_MINUS_DST_COLOR_instance;
    var BlendingFactor_SRC_ALPHA_instance;
    var BlendingFactor_ONE_MINUS_SRC_ALPHA_instance;
    var BlendingFactor_DST_ALPHA_instance;
    var BlendingFactor_ONE_MINUS_DST_ALPHA_instance;
    var BlendingFactor_CONSTANT_COLOR_instance;
    var BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance;
    var BlendingFactor_CONSTANT_ALPHA_instance;
    var BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance;
    var BlendingFactor_SRC_ALPHA_SATURATE_instance;
    function values_1() {
        return [BlendingFactor_ZERO_getInstance(), BlendingFactor_ONE_getInstance(), BlendingFactor_SRC_COLOR_getInstance(), BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance(), BlendingFactor_DST_COLOR_getInstance(), BlendingFactor_ONE_MINUS_DST_COLOR_getInstance(), BlendingFactor_SRC_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance(), BlendingFactor_DST_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance(), BlendingFactor_CONSTANT_COLOR_getInstance(), BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance(), BlendingFactor_CONSTANT_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance(), BlendingFactor_SRC_ALPHA_SATURATE_getInstance()];
    }
    function valueOf_1(value) {
        switch (value) {
            case 'ZERO':
                return BlendingFactor_ZERO_getInstance();
            case 'ONE':
                return BlendingFactor_ONE_getInstance();
            case 'SRC_COLOR':
                return BlendingFactor_SRC_COLOR_getInstance();
            case 'ONE_MINUS_SRC_COLOR':
                return BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance();
            case 'DST_COLOR':
                return BlendingFactor_DST_COLOR_getInstance();
            case 'ONE_MINUS_DST_COLOR':
                return BlendingFactor_ONE_MINUS_DST_COLOR_getInstance();
            case 'SRC_ALPHA':
                return BlendingFactor_SRC_ALPHA_getInstance();
            case 'ONE_MINUS_SRC_ALPHA':
                return BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance();
            case 'DST_ALPHA':
                return BlendingFactor_DST_ALPHA_getInstance();
            case 'ONE_MINUS_DST_ALPHA':
                return BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance();
            case 'CONSTANT_COLOR':
                return BlendingFactor_CONSTANT_COLOR_getInstance();
            case 'ONE_MINUS_CONSTANT_COLOR':
                return BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance();
            case 'CONSTANT_ALPHA':
                return BlendingFactor_CONSTANT_ALPHA_getInstance();
            case 'ONE_MINUS_CONSTANT_ALPHA':
                return BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance();
            case 'SRC_ALPHA_SATURATE':
                return BlendingFactor_SRC_ALPHA_SATURATE_getInstance();
            default:
                BlendingFactor_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var BlendingFactor_entriesInitialized;
    function BlendingFactor_initEntries() {
        if (BlendingFactor_entriesInitialized)
            return Unit_instance;
        BlendingFactor_entriesInitialized = true;
        BlendingFactor_ZERO_instance = new BlendingFactor('ZERO', 0, 0);
        BlendingFactor_ONE_instance = new BlendingFactor('ONE', 1, 1);
        BlendingFactor_SRC_COLOR_instance = new BlendingFactor('SRC_COLOR', 2, 2);
        BlendingFactor_ONE_MINUS_SRC_COLOR_instance = new BlendingFactor('ONE_MINUS_SRC_COLOR', 3, 3);
        BlendingFactor_DST_COLOR_instance = new BlendingFactor('DST_COLOR', 4, 4);
        BlendingFactor_ONE_MINUS_DST_COLOR_instance = new BlendingFactor('ONE_MINUS_DST_COLOR', 5, 5);
        BlendingFactor_SRC_ALPHA_instance = new BlendingFactor('SRC_ALPHA', 6, 6);
        BlendingFactor_ONE_MINUS_SRC_ALPHA_instance = new BlendingFactor('ONE_MINUS_SRC_ALPHA', 7, 7);
        BlendingFactor_DST_ALPHA_instance = new BlendingFactor('DST_ALPHA', 8, 8);
        BlendingFactor_ONE_MINUS_DST_ALPHA_instance = new BlendingFactor('ONE_MINUS_DST_ALPHA', 9, 9);
        BlendingFactor_CONSTANT_COLOR_instance = new BlendingFactor('CONSTANT_COLOR', 10, 10);
        BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance = new BlendingFactor('ONE_MINUS_CONSTANT_COLOR', 11, 11);
        BlendingFactor_CONSTANT_ALPHA_instance = new BlendingFactor('CONSTANT_ALPHA', 12, 12);
        BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance = new BlendingFactor('ONE_MINUS_CONSTANT_ALPHA', 13, 13);
        BlendingFactor_SRC_ALPHA_SATURATE_instance = new BlendingFactor('SRC_ALPHA_SATURATE', 14, 14);
    }
    function BlendingFactor(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function Blending() {
        this.enabled = false;
        this.isSeparateAlpha = false;
        this.equationAlpha = BlendingEquation_ADD_getInstance();
        this.equationColor = BlendingEquation_ADD_getInstance();
        this.sourceFactorAlpha = BlendingFactor_ZERO_getInstance();
        this.destinationFactorAlpha = BlendingFactor_ZERO_getInstance();
        this.sourceFactorColor = BlendingFactor_ZERO_getInstance();
        this.destinationFactorColor = BlendingFactor_ZERO_getInstance();
    }
    protoOf(Blending).f6 = function (_set____db54di) {
        this.enabled = _set____db54di;
    };
    protoOf(Blending).g6 = function () {
        return this.enabled;
    };
    protoOf(Blending).h6 = function (_set____db54di) {
        this.isSeparateAlpha = _set____db54di;
    };
    protoOf(Blending).i6 = function () {
        return this.isSeparateAlpha;
    };
    protoOf(Blending).j6 = function (_set____db54di) {
        this.equationAlpha = _set____db54di;
    };
    protoOf(Blending).k6 = function () {
        return this.equationAlpha;
    };
    protoOf(Blending).l6 = function (_set____db54di) {
        this.equationColor = _set____db54di;
    };
    protoOf(Blending).m6 = function () {
        return this.equationColor;
    };
    protoOf(Blending).n6 = function (_set____db54di) {
        this.sourceFactorAlpha = _set____db54di;
    };
    protoOf(Blending).o6 = function () {
        return this.sourceFactorAlpha;
    };
    protoOf(Blending).p6 = function (_set____db54di) {
        this.destinationFactorAlpha = _set____db54di;
    };
    protoOf(Blending).q6 = function () {
        return this.destinationFactorAlpha;
    };
    protoOf(Blending).r6 = function (_set____db54di) {
        this.sourceFactorColor = _set____db54di;
    };
    protoOf(Blending).s6 = function () {
        return this.sourceFactorColor;
    };
    protoOf(Blending).t6 = function (_set____db54di) {
        this.destinationFactorColor = _set____db54di;
    };
    protoOf(Blending).u6 = function () {
        return this.destinationFactorColor;
    };
    function BlendingEquation_ADD_getInstance() {
        BlendingEquation_initEntries();
        return BlendingEquation_ADD_instance;
    }
    function BlendingEquation_SUBTRACT_getInstance() {
        BlendingEquation_initEntries();
        return BlendingEquation_SUBTRACT_instance;
    }
    function BlendingEquation_REVERSE_SUBTRACT_getInstance() {
        BlendingEquation_initEntries();
        return BlendingEquation_REVERSE_SUBTRACT_instance;
    }
    function BlendingFactor_ZERO_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ZERO_instance;
    }
    function BlendingFactor_ONE_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_instance;
    }
    function BlendingFactor_SRC_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_SRC_COLOR_instance;
    }
    function BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_SRC_COLOR_instance;
    }
    function BlendingFactor_DST_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_DST_COLOR_instance;
    }
    function BlendingFactor_ONE_MINUS_DST_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_DST_COLOR_instance;
    }
    function BlendingFactor_SRC_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_SRC_ALPHA_instance;
    }
    function BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_SRC_ALPHA_instance;
    }
    function BlendingFactor_DST_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_DST_ALPHA_instance;
    }
    function BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_DST_ALPHA_instance;
    }
    function BlendingFactor_CONSTANT_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_CONSTANT_COLOR_instance;
    }
    function BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance;
    }
    function BlendingFactor_CONSTANT_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_CONSTANT_ALPHA_instance;
    }
    function BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance;
    }
    function BlendingFactor_SRC_ALPHA_SATURATE_getInstance() {
        BlendingFactor_initEntries();
        return BlendingFactor_SRC_ALPHA_SATURATE_instance;
    }
    var properties_initialized_Blending_kt_oef843;
    function _init_properties_Blending_kt__efsar3() {
        if (!properties_initialized_Blending_kt_oef843) {
            properties_initialized_Blending_kt_oef843 = true;
            // Inline function 'kotlin.apply' call
            var this_0 = new Blending();
            // Inline function 'kotlin.contracts.contract' call
            // Inline function 'org.androidworks.engine.BLENDING_NONE.<anonymous>' call
            this_0.enabled = false;
            BLENDING_NONE = this_0;
        }
    }
    var CullFace_FRONT_instance;
    var CullFace_BACK_instance;
    var CullFace_FRONT_AND_BACK_instance;
    var CullFace_DISABLED_instance;
    function values_2() {
        return [CullFace_FRONT_getInstance(), CullFace_BACK_getInstance(), CullFace_FRONT_AND_BACK_getInstance(), CullFace_DISABLED_getInstance()];
    }
    function valueOf_2(value) {
        switch (value) {
            case 'FRONT':
                return CullFace_FRONT_getInstance();
            case 'BACK':
                return CullFace_BACK_getInstance();
            case 'FRONT_AND_BACK':
                return CullFace_FRONT_AND_BACK_getInstance();
            case 'DISABLED':
                return CullFace_DISABLED_getInstance();
            default:
                CullFace_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var CullFace_entriesInitialized;
    function CullFace_initEntries() {
        if (CullFace_entriesInitialized)
            return Unit_instance;
        CullFace_entriesInitialized = true;
        CullFace_FRONT_instance = new CullFace('FRONT', 0, 0);
        CullFace_BACK_instance = new CullFace('BACK', 1, 1);
        CullFace_FRONT_AND_BACK_instance = new CullFace('FRONT_AND_BACK', 2, 2);
        CullFace_DISABLED_instance = new CullFace('DISABLED', 3, 3);
    }
    function CullFace(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function CullFace_FRONT_getInstance() {
        CullFace_initEntries();
        return CullFace_FRONT_instance;
    }
    function CullFace_BACK_getInstance() {
        CullFace_initEntries();
        return CullFace_BACK_instance;
    }
    function CullFace_FRONT_AND_BACK_getInstance() {
        CullFace_initEntries();
        return CullFace_FRONT_AND_BACK_instance;
    }
    function CullFace_DISABLED_getInstance() {
        CullFace_initEntries();
        return CullFace_DISABLED_instance;
    }
    var DEPTH_NONE;
    function get_DEPTH_TEST_ENABLED() {
        _init_properties_DepthMode_kt__qfy5t8();
        return DEPTH_TEST_ENABLED;
    }
    var DEPTH_TEST_ENABLED;
    function get_DEPTH_NO_WRITE() {
        _init_properties_DepthMode_kt__qfy5t8();
        return DEPTH_NO_WRITE;
    }
    var DEPTH_NO_WRITE;
    var DEPTH_NO_READ;
    function DepthMode(depthTest, depthWrite) {
        depthTest = depthTest === VOID ? false : depthTest;
        depthWrite = depthWrite === VOID ? false : depthWrite;
        this.depthTest = depthTest;
        this.depthWrite = depthWrite;
    }
    protoOf(DepthMode).x6 = function (_set____db54di) {
        this.depthTest = _set____db54di;
    };
    protoOf(DepthMode).y6 = function () {
        return this.depthTest;
    };
    protoOf(DepthMode).z6 = function (_set____db54di) {
        this.depthWrite = _set____db54di;
    };
    protoOf(DepthMode).a7 = function () {
        return this.depthWrite;
    };
    var properties_initialized_DepthMode_kt_b0ctqi;
    function _init_properties_DepthMode_kt__qfy5t8() {
        if (!properties_initialized_DepthMode_kt_b0ctqi) {
            properties_initialized_DepthMode_kt_b0ctqi = true;
            DEPTH_NONE = new DepthMode(false, false);
            DEPTH_TEST_ENABLED = new DepthMode(true, true);
            DEPTH_NO_WRITE = new DepthMode(true, false);
            DEPTH_NO_READ = new DepthMode(false, true);
        }
    }
    function Mesh_init_$Init$($this) {
        Mesh.call($this);
        return $this;
    }
    function MeshConstructor1() {
        return Mesh_init_$Init$(objectCreate(protoOf(Mesh)));
    }
    function Mesh_init_$Init$_0(name, attrs, $this) {
        attrs = attrs === VOID ? null : attrs;
        Mesh_init_$Init$($this);
        $this.name = name;
        $this.fileName = name;
        $this.attributes = attrs;
        return $this;
    }
    function MeshConstructor2(name, attrs) {
        return Mesh_init_$Init$_0(name, attrs, objectCreate(protoOf(Mesh)));
    }
    protoOf(Mesh).b7 = function (_set____db54di) {
        this.name = _set____db54di;
    };
    protoOf(Mesh).c4 = function () {
        return this.name;
    };
    protoOf(Mesh).c7 = function (_set____db54di) {
        this.id = _set____db54di;
    };
    protoOf(Mesh).d7 = function () {
        return this.id;
    };
    protoOf(Mesh).e7 = function (_set____db54di) {
        this.fileName = _set____db54di;
    };
    protoOf(Mesh).f7 = function () {
        return this.fileName;
    };
    protoOf(Mesh).g7 = function (_set____db54di) {
        this.loaded = _set____db54di;
    };
    protoOf(Mesh).h7 = function () {
        return this.loaded;
    };
    protoOf(Mesh).i7 = function (_set____db54di) {
        this.attributes = _set____db54di;
    };
    protoOf(Mesh).j7 = function () {
        return this.attributes;
    };
    function Mesh() {
        this.name = '';
        this.id = 0;
        this.fileName = '';
        this.loaded = false;
        this.attributes = null;
    }
    function setFOV($this, matrix, fovY, aspect, zNear, zFar) {
        var fW;
        // Inline function 'kotlin.math.tan' call
        var x = fovY / 360.0 * 3.1415925;
        var fH = Math.tan(x) * zNear;
        fW = fH * aspect;
        Matrix_getInstance().r7(matrix, 0, -fW, fW, -fH, fH, zNear, zFar);
    }
    function Scene() {
        this.lastFrameTime = 0.0;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        this.matView = new Float32Array(16);
        this.useExternalViewMatrix = false;
        this.matProjection = new Float32Array(16);
        this.matModel = new Float32Array(16);
        this.matMVP = new Float32Array(16);
        this.zoom = 0.0;
        this.ZOOM_FOV = 10.0;
        this.FOV_LANDSCAPE = 0.0;
        this.FOV_PORTRAIT = 0.0;
        this.Z_NEAR = 0.0;
        this.Z_FAR = 0.0;
        this.backendMode = BackendMode_OPENGL_getInstance();
        this.s7_1 = false;
        var tmp = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp.t7_1 = ArrayList_init_$Create$();
        var tmp_0 = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp_0.u7_1 = ArrayList_init_$Create$();
        var tmp_1 = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp_1.v7_1 = ArrayList_init_$Create$();
        var tmp_2 = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp_2.w7_1 = ArrayList_init_$Create$();
    }
    protoOf(Scene).x7 = function (_set____db54di) {
        this.lastFrameTime = _set____db54di;
    };
    protoOf(Scene).y7 = function () {
        return this.lastFrameTime;
    };
    protoOf(Scene).z7 = function (_set____db54di) {
        this.viewportWidth = _set____db54di;
    };
    protoOf(Scene).a8 = function () {
        return this.viewportWidth;
    };
    protoOf(Scene).b8 = function (_set____db54di) {
        this.viewportHeight = _set____db54di;
    };
    protoOf(Scene).c8 = function () {
        return this.viewportHeight;
    };
    protoOf(Scene).d8 = function () {
        return this.matView;
    };
    protoOf(Scene).e8 = function (_set____db54di) {
        this.useExternalViewMatrix = _set____db54di;
    };
    protoOf(Scene).f8 = function () {
        return this.useExternalViewMatrix;
    };
    protoOf(Scene).g8 = function () {
        return this.matProjection;
    };
    protoOf(Scene).h8 = function () {
        return this.matModel;
    };
    protoOf(Scene).i8 = function () {
        return this.matMVP;
    };
    protoOf(Scene).j8 = function (_set____db54di) {
        this.zoom = _set____db54di;
    };
    protoOf(Scene).k8 = function () {
        return this.zoom;
    };
    protoOf(Scene).l8 = function (_set____db54di) {
        this.ZOOM_FOV = _set____db54di;
    };
    protoOf(Scene).m8 = function () {
        return this.ZOOM_FOV;
    };
    protoOf(Scene).n8 = function (_set____db54di) {
        this.FOV_LANDSCAPE = _set____db54di;
    };
    protoOf(Scene).o8 = function () {
        return this.FOV_LANDSCAPE;
    };
    protoOf(Scene).p8 = function (_set____db54di) {
        this.FOV_PORTRAIT = _set____db54di;
    };
    protoOf(Scene).q8 = function () {
        return this.FOV_PORTRAIT;
    };
    protoOf(Scene).r8 = function (_set____db54di) {
        this.Z_NEAR = _set____db54di;
    };
    protoOf(Scene).s8 = function () {
        return this.Z_NEAR;
    };
    protoOf(Scene).t8 = function (_set____db54di) {
        this.Z_FAR = _set____db54di;
    };
    protoOf(Scene).u8 = function () {
        return this.Z_FAR;
    };
    protoOf(Scene).v8 = function (_set____db54di) {
        this.backendMode = _set____db54di;
    };
    protoOf(Scene).w8 = function () {
        return this.backendMode;
    };
    protoOf(Scene).g7 = function (value) {
        this.s7_1 = value;
    };
    protoOf(Scene).h7 = function () {
        return this.s7_1;
    };
    protoOf(Scene).x8 = function (_set____db54di) {
        this.t7_1 = _set____db54di;
    };
    protoOf(Scene).y8 = function () {
        return this.t7_1;
    };
    protoOf(Scene).z8 = function (_set____db54di) {
        this.u7_1 = _set____db54di;
    };
    protoOf(Scene).a9 = function () {
        return this.u7_1;
    };
    protoOf(Scene).b9 = function (_set____db54di) {
        this.v7_1 = _set____db54di;
    };
    protoOf(Scene).c9 = function () {
        return this.v7_1;
    };
    protoOf(Scene).d9 = function (_set____db54di) {
        this.w7_1 = _set____db54di;
    };
    protoOf(Scene).e9 = function () {
        return this.w7_1;
    };
    protoOf(Scene).updateTimers = function (time) {
        this.lastFrameTime = time;
    };
    protoOf(Scene).updateViewportSize = function (width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    };
    protoOf(Scene).f9 = function (multiplier, width, height) {
        var tmp;
        if (height > 0) {
            tmp = width / height;
        }
        else {
            tmp = 1.0;
        }
        var ratio = tmp;
        var tmp_0;
        if (width >= height) {
            tmp_0 = this.FOV_LANDSCAPE * multiplier;
        }
        else {
            tmp_0 = this.FOV_PORTRAIT * multiplier;
        }
        var fov = tmp_0;
        fov = fov + this.zoom * this.ZOOM_FOV;
        setFOV(this, this.matProjection, fov, ratio, this.Z_NEAR, this.Z_FAR);
        if (this.backendMode.equals(BackendMode_METAL_getInstance())) {
            var zs = this.Z_FAR / (this.Z_NEAR - this.Z_FAR);
            this.matProjection[10] = zs;
            this.matProjection[14] = zs * this.Z_NEAR;
        }
    };
    protoOf(Scene).calculateProjection = function (multiplier, width, height, $super) {
        multiplier = multiplier === VOID ? 1.0 : multiplier;
        width = width === VOID ? this.viewportWidth : width;
        height = height === VOID ? this.viewportHeight : height;
        return this.f9(multiplier, width, height);
    };
    protoOf(Scene).calculateMVPMatrix = function (tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        Matrix_getInstance().g9(this.matModel, 0);
        Matrix_getInstance().h9(this.matModel, 0, tx, ty, tz);
        Matrix_getInstance().i9(this.matModel, 0, rx, 1.0, 0.0, 0.0);
        Matrix_getInstance().i9(this.matModel, 0, ry, 0.0, 1.0, 0.0);
        Matrix_getInstance().i9(this.matModel, 0, rz, 0.0, 0.0, 1.0);
        Matrix_getInstance().j9(this.matModel, 0, sx, sy, sz);
        Matrix_getInstance().k9(this.matMVP, 0, this.matView, 0, this.matModel, 0);
        Matrix_getInstance().k9(this.matMVP, 0, this.matProjection, 0, this.matMVP, 0);
    };
    protoOf(Scene).calculateMVPMatrixFromModelMatrix = function (modelMatrix) {
        Matrix_getInstance().k9(this.matMVP, 0, this.matView, 0, modelMatrix, 0);
        Matrix_getInstance().k9(this.matMVP, 0, this.matProjection, 0, this.matMVP, 0);
    };
    protoOf(Scene).setMvpUniform = function (uniform, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        this.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);
        setUniform(uniform, this.matMVP);
    };
    protoOf(Scene).updateMeshTransformations = function (commands) {
        var tmp0_iterator = commands.h();
        $l$loop: while (tmp0_iterator.o()) {
            var command = tmp0_iterator.p();
            if (!command.enabled) {
                continue $l$loop;
            }
            if (command instanceof GroupCommand) {
                this.updateMeshTransformations(command.commands);
            }
            if (command instanceof DrawTransformedMeshCommand) {
                if (command instanceof DrawStaticMeshCommand) {
                    this.calculateMVPMatrixFromModelMatrix(command.modelMatrix);
                    // Inline function 'kotlin.collections.copyInto' call
                    var this_0 = command.modelMatrix;
                    var destination = this.matModel;
                    var endIndex = this_0.length;
                    // Inline function 'kotlin.js.unsafeCast' call
                    // Inline function 'kotlin.js.asDynamic' call
                    var tmp = this_0;
                    // Inline function 'kotlin.js.unsafeCast' call
                    // Inline function 'kotlin.js.asDynamic' call
                    arrayCopy(tmp, destination, 0, 0, endIndex);
                }
                else {
                    this.calculateMVPMatrix(command.transform.l9_1.x, command.transform.l9_1.y, command.transform.l9_1.z, command.transform.m9_1.x, command.transform.m9_1.y, command.transform.m9_1.z, command.transform.n9_1.x, command.transform.n9_1.y, command.transform.n9_1.z);
                }
                if (command.indexUniformMvp >= 0) {
                    setUniform(command.uniforms.q(command.indexUniformMvp), this.matMVP);
                }
                if (command.indexUniformModel >= 0) {
                    setUniform(command.uniforms.q(command.indexUniformModel), this.matModel);
                }
                if (command.indexUniformView >= 0) {
                    setUniform(command.uniforms.q(command.indexUniformView), this.matView);
                }
                if (command.indexUniformProjection >= 0) {
                    setUniform(command.uniforms.q(command.indexUniformProjection), this.matProjection);
                }
            }
        }
    };
    function Shader(name) {
        name = name === VOID ? '' : name;
        this.name = name;
        this.id = -1;
    }
    protoOf(Shader).b7 = function (_set____db54di) {
        this.name = _set____db54di;
    };
    protoOf(Shader).c4 = function () {
        return this.name;
    };
    protoOf(Shader).c7 = function (_set____db54di) {
        this.id = _set____db54di;
    };
    protoOf(Shader).d7 = function () {
        return this.id;
    };
    var TextureFiltering_NEAREST_instance;
    var TextureFiltering_LINEAR_instance;
    var TextureFiltering_NEAREST_MIPMAP_NEAREST_instance;
    var TextureFiltering_LINEAR_MIPMAP_NEAREST_instance;
    var TextureFiltering_NEAREST_MIPMAP_LINEAR_instance;
    var TextureFiltering_LINEAR_MIPMAP_LINEAR_instance;
    function values_3() {
        return [TextureFiltering_NEAREST_getInstance(), TextureFiltering_LINEAR_getInstance(), TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance(), TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance(), TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance(), TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance()];
    }
    function valueOf_3(value) {
        switch (value) {
            case 'NEAREST':
                return TextureFiltering_NEAREST_getInstance();
            case 'LINEAR':
                return TextureFiltering_LINEAR_getInstance();
            case 'NEAREST_MIPMAP_NEAREST':
                return TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance();
            case 'LINEAR_MIPMAP_NEAREST':
                return TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance();
            case 'NEAREST_MIPMAP_LINEAR':
                return TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance();
            case 'LINEAR_MIPMAP_LINEAR':
                return TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
            default:
                TextureFiltering_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var TextureFiltering_entriesInitialized;
    function TextureFiltering_initEntries() {
        if (TextureFiltering_entriesInitialized)
            return Unit_instance;
        TextureFiltering_entriesInitialized = true;
        TextureFiltering_NEAREST_instance = new TextureFiltering('NEAREST', 0, 0);
        TextureFiltering_LINEAR_instance = new TextureFiltering('LINEAR', 1, 1);
        TextureFiltering_NEAREST_MIPMAP_NEAREST_instance = new TextureFiltering('NEAREST_MIPMAP_NEAREST', 2, 2);
        TextureFiltering_LINEAR_MIPMAP_NEAREST_instance = new TextureFiltering('LINEAR_MIPMAP_NEAREST', 3, 3);
        TextureFiltering_NEAREST_MIPMAP_LINEAR_instance = new TextureFiltering('NEAREST_MIPMAP_LINEAR', 4, 4);
        TextureFiltering_LINEAR_MIPMAP_LINEAR_instance = new TextureFiltering('LINEAR_MIPMAP_LINEAR', 5, 5);
    }
    function TextureFiltering(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    var TextureWrapping_CLAMP_TO_EDGE_instance;
    var TextureWrapping_MIRRORED_REPEAT_instance;
    var TextureWrapping_REPEAT_instance;
    function values_4() {
        return [TextureWrapping_CLAMP_TO_EDGE_getInstance(), TextureWrapping_MIRRORED_REPEAT_getInstance(), TextureWrapping_REPEAT_getInstance()];
    }
    function valueOf_4(value) {
        switch (value) {
            case 'CLAMP_TO_EDGE':
                return TextureWrapping_CLAMP_TO_EDGE_getInstance();
            case 'MIRRORED_REPEAT':
                return TextureWrapping_MIRRORED_REPEAT_getInstance();
            case 'REPEAT':
                return TextureWrapping_REPEAT_getInstance();
            default:
                TextureWrapping_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var TextureWrapping_entriesInitialized;
    function TextureWrapping_initEntries() {
        if (TextureWrapping_entriesInitialized)
            return Unit_instance;
        TextureWrapping_entriesInitialized = true;
        TextureWrapping_CLAMP_TO_EDGE_instance = new TextureWrapping('CLAMP_TO_EDGE', 0, 0);
        TextureWrapping_MIRRORED_REPEAT_instance = new TextureWrapping('MIRRORED_REPEAT', 1, 1);
        TextureWrapping_REPEAT_instance = new TextureWrapping('REPEAT', 2, 2);
    }
    function TextureWrapping(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    var TextureFormat_RGBA8_instance;
    var TextureFormat_RGB8_instance;
    var TextureFormat_RGB16F_instance;
    var TextureFormat_RGB32F_instance;
    var TextureFormat_RGBA16F_instance;
    var TextureFormat_RGBA32F_instance;
    var TextureFormat_ASTC_instance;
    function values_5() {
        return [TextureFormat_RGBA8_getInstance(), TextureFormat_RGB8_getInstance(), TextureFormat_RGB16F_getInstance(), TextureFormat_RGB32F_getInstance(), TextureFormat_RGBA16F_getInstance(), TextureFormat_RGBA32F_getInstance(), TextureFormat_ASTC_getInstance()];
    }
    function valueOf_5(value) {
        switch (value) {
            case 'RGBA8':
                return TextureFormat_RGBA8_getInstance();
            case 'RGB8':
                return TextureFormat_RGB8_getInstance();
            case 'RGB16F':
                return TextureFormat_RGB16F_getInstance();
            case 'RGB32F':
                return TextureFormat_RGB32F_getInstance();
            case 'RGBA16F':
                return TextureFormat_RGBA16F_getInstance();
            case 'RGBA32F':
                return TextureFormat_RGBA32F_getInstance();
            case 'ASTC':
                return TextureFormat_ASTC_getInstance();
            default:
                TextureFormat_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var TextureFormat_entriesInitialized;
    function TextureFormat_initEntries() {
        if (TextureFormat_entriesInitialized)
            return Unit_instance;
        TextureFormat_entriesInitialized = true;
        TextureFormat_RGBA8_instance = new TextureFormat('RGBA8', 0, 0);
        TextureFormat_RGB8_instance = new TextureFormat('RGB8', 1, 1);
        TextureFormat_RGB16F_instance = new TextureFormat('RGB16F', 2, 2);
        TextureFormat_RGB32F_instance = new TextureFormat('RGB32F', 3, 3);
        TextureFormat_RGBA16F_instance = new TextureFormat('RGBA16F', 4, 4);
        TextureFormat_RGBA32F_instance = new TextureFormat('RGBA32F', 5, 5);
        TextureFormat_ASTC_instance = new TextureFormat('ASTC', 6, 6);
    }
    function TextureFormat(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    var TextureType_TEX_1D_instance;
    var TextureType_TEX_2D_instance;
    var TextureType_TEX_3D_instance;
    var TextureType_CUBEMAP_instance;
    function values_6() {
        return [TextureType_TEX_1D_getInstance(), TextureType_TEX_2D_getInstance(), TextureType_TEX_3D_getInstance(), TextureType_CUBEMAP_getInstance()];
    }
    function valueOf_6(value) {
        switch (value) {
            case 'TEX_1D':
                return TextureType_TEX_1D_getInstance();
            case 'TEX_2D':
                return TextureType_TEX_2D_getInstance();
            case 'TEX_3D':
                return TextureType_TEX_3D_getInstance();
            case 'CUBEMAP':
                return TextureType_CUBEMAP_getInstance();
            default:
                TextureType_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var TextureType_entriesInitialized;
    function TextureType_initEntries() {
        if (TextureType_entriesInitialized)
            return Unit_instance;
        TextureType_entriesInitialized = true;
        TextureType_TEX_1D_instance = new TextureType('TEX_1D', 0, 0);
        TextureType_TEX_2D_instance = new TextureType('TEX_2D', 1, 1);
        TextureType_TEX_3D_instance = new TextureType('TEX_3D', 2, 2);
        TextureType_CUBEMAP_instance = new TextureType('CUBEMAP', 3, 3);
    }
    function TextureType(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function Texture() {
        this.type = TextureType_TEX_2D_getInstance();
        this.name = '';
        this.fileName = '';
        this.id = 0;
        this.loaded = false;
        this.width = 0;
        this.height = 0;
        this.minFilter = TextureFiltering_LINEAR_getInstance();
        this.magFilter = TextureFiltering_LINEAR_getInstance();
        this.wrapping = TextureWrapping_REPEAT_getInstance();
        this.mipmaps = 0;
        this.format = TextureFormat_RGBA8_getInstance();
        this.anisotropy = 0;
    }
    protoOf(Texture).z9 = function (_set____db54di) {
        this.type = _set____db54di;
    };
    protoOf(Texture).aa = function () {
        return this.type;
    };
    protoOf(Texture).b7 = function (_set____db54di) {
        this.name = _set____db54di;
    };
    protoOf(Texture).c4 = function () {
        return this.name;
    };
    protoOf(Texture).e7 = function (_set____db54di) {
        this.fileName = _set____db54di;
    };
    protoOf(Texture).f7 = function () {
        return this.fileName;
    };
    protoOf(Texture).c7 = function (_set____db54di) {
        this.id = _set____db54di;
    };
    protoOf(Texture).d7 = function () {
        return this.id;
    };
    protoOf(Texture).g7 = function (_set____db54di) {
        this.loaded = _set____db54di;
    };
    protoOf(Texture).h7 = function () {
        return this.loaded;
    };
    protoOf(Texture).ba = function (_set____db54di) {
        this.width = _set____db54di;
    };
    protoOf(Texture).ca = function () {
        return this.width;
    };
    protoOf(Texture).da = function (_set____db54di) {
        this.height = _set____db54di;
    };
    protoOf(Texture).ea = function () {
        return this.height;
    };
    protoOf(Texture).fa = function (_set____db54di) {
        this.minFilter = _set____db54di;
    };
    protoOf(Texture).ga = function () {
        return this.minFilter;
    };
    protoOf(Texture).ha = function (_set____db54di) {
        this.magFilter = _set____db54di;
    };
    protoOf(Texture).ia = function () {
        return this.magFilter;
    };
    protoOf(Texture).ja = function (_set____db54di) {
        this.wrapping = _set____db54di;
    };
    protoOf(Texture).ka = function () {
        return this.wrapping;
    };
    protoOf(Texture).la = function (_set____db54di) {
        this.mipmaps = _set____db54di;
    };
    protoOf(Texture).ma = function () {
        return this.mipmaps;
    };
    protoOf(Texture).na = function (_set____db54di) {
        this.format = _set____db54di;
    };
    protoOf(Texture).oa = function () {
        return this.format;
    };
    protoOf(Texture).pa = function (_set____db54di) {
        this.anisotropy = _set____db54di;
    };
    protoOf(Texture).qa = function () {
        return this.anisotropy;
    };
    function TextureFiltering_NEAREST_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_NEAREST_instance;
    }
    function TextureFiltering_LINEAR_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_LINEAR_instance;
    }
    function TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_NEAREST_MIPMAP_NEAREST_instance;
    }
    function TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_LINEAR_MIPMAP_NEAREST_instance;
    }
    function TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_NEAREST_MIPMAP_LINEAR_instance;
    }
    function TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance() {
        TextureFiltering_initEntries();
        return TextureFiltering_LINEAR_MIPMAP_LINEAR_instance;
    }
    function TextureWrapping_CLAMP_TO_EDGE_getInstance() {
        TextureWrapping_initEntries();
        return TextureWrapping_CLAMP_TO_EDGE_instance;
    }
    function TextureWrapping_MIRRORED_REPEAT_getInstance() {
        TextureWrapping_initEntries();
        return TextureWrapping_MIRRORED_REPEAT_instance;
    }
    function TextureWrapping_REPEAT_getInstance() {
        TextureWrapping_initEntries();
        return TextureWrapping_REPEAT_instance;
    }
    function TextureFormat_RGBA8_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGBA8_instance;
    }
    function TextureFormat_RGB8_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGB8_instance;
    }
    function TextureFormat_RGB16F_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGB16F_instance;
    }
    function TextureFormat_RGB32F_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGB32F_instance;
    }
    function TextureFormat_RGBA16F_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGBA16F_instance;
    }
    function TextureFormat_RGBA32F_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_RGBA32F_instance;
    }
    function TextureFormat_ASTC_getInstance() {
        TextureFormat_initEntries();
        return TextureFormat_ASTC_instance;
    }
    function TextureType_TEX_1D_getInstance() {
        TextureType_initEntries();
        return TextureType_TEX_1D_instance;
    }
    function TextureType_TEX_2D_getInstance() {
        TextureType_initEntries();
        return TextureType_TEX_2D_instance;
    }
    function TextureType_TEX_3D_getInstance() {
        TextureType_initEntries();
        return TextureType_TEX_3D_instance;
    }
    function TextureType_CUBEMAP_getInstance() {
        TextureType_initEntries();
        return TextureType_CUBEMAP_instance;
    }
    function UniformValue() {
    }
    function UniformFloatValue_init_$Init$(value, $this) {
        UniformValue.call($this);
        UniformFloatValue.call($this);
        $this.value = value;
        return $this;
    }
    function UniformFloatValueWithArray(value) {
        return UniformFloatValue_init_$Init$(value, objectCreate(protoOf(UniformFloatValue)));
    }
    protoOf(UniformFloatValue).ra = function (_set____db54di) {
        this.value = _set____db54di;
    };
    protoOf(UniformFloatValue).k2 = function () {
        return this.value;
    };
    function UniformFloatValue() {
    }
    function UniformIntValue_init_$Init$(value, $this) {
        UniformValue.call($this);
        UniformIntValue.call($this);
        $this.value = value;
        return $this;
    }
    function UniformIntValueWithArray(value) {
        return UniformIntValue_init_$Init$(value, objectCreate(protoOf(UniformIntValue)));
    }
    protoOf(UniformIntValue).sa = function (_set____db54di) {
        this.value = _set____db54di;
    };
    protoOf(UniformIntValue).k2 = function () {
        return this.value;
    };
    function UniformIntValue() {
    }
    function UniformTextureValue(value) {
        UniformValue.call(this);
        this.value = value;
    }
    protoOf(UniformTextureValue).ta = function (_set____db54di) {
        this.value = _set____db54di;
    };
    protoOf(UniformTextureValue).k2 = function () {
        return this.value;
    };
    function setUniform(uniform, values) {
        // Inline function 'kotlin.collections.copyInto' call
        var destination = (uniform instanceof UniformFloatValue ? uniform : THROW_CCE()).value;
        var endIndex = values.length;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp = values;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        arrayCopy(tmp, destination, 0, 0, endIndex);
    }
    function setUniform_0(uniform, x, y, z, w) {
        var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
        uniformFloat.value[0] = x;
        uniformFloat.value[1] = y;
        uniformFloat.value[2] = z;
        uniformFloat.value[3] = w;
    }
    function setUniform_1(uniform, x, y) {
        var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
        uniformFloat.value[0] = x;
        uniformFloat.value[1] = y;
    }
    function setUniform_2(uniform, x) {
        var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
        uniformFloat.value[0] = x;
    }
    function setUniform_3(uniform, x) {
        var uniformInt = uniform instanceof UniformIntValue ? uniform : THROW_CCE();
        uniformInt.value[0] = x;
    }
    function setUniform_4(uniform, value) {
        var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
        uniformFloat.value[0] = value.x;
        uniformFloat.value[1] = value.y;
        uniformFloat.value[2] = value.z;
    }
    var VertexFormat_UBYTE_instance;
    var VertexFormat_UBYTE2_instance;
    var VertexFormat_UBYTE3_instance;
    var VertexFormat_UBYTE4_instance;
    var VertexFormat_BYTE_instance;
    var VertexFormat_BYTE2_instance;
    var VertexFormat_BYTE3_instance;
    var VertexFormat_BYTE4_instance;
    var VertexFormat_UBYTE_NORMALIZED_instance;
    var VertexFormat_UBYTE2_NORMALIZED_instance;
    var VertexFormat_UBYTE3_NORMALIZED_instance;
    var VertexFormat_UBYTE4_NORMALIZED_instance;
    var VertexFormat_BYTE_NORMALIZED_instance;
    var VertexFormat_BYTE2_NORMALIZED_instance;
    var VertexFormat_BYTE3_NORMALIZED_instance;
    var VertexFormat_BYTE4_NORMALIZED_instance;
    var VertexFormat_USHORT_instance;
    var VertexFormat_USHORT2_instance;
    var VertexFormat_USHORT3_instance;
    var VertexFormat_USHORT4_instance;
    var VertexFormat_SHORT_instance;
    var VertexFormat_SHORT2_instance;
    var VertexFormat_SHORT3_instance;
    var VertexFormat_SHORT4_instance;
    var VertexFormat_USHORT_NORMALIZED_instance;
    var VertexFormat_USHORT2_NORMALIZED_instance;
    var VertexFormat_USHORT3_NORMALIZED_instance;
    var VertexFormat_USHORT4_NORMALIZED_instance;
    var VertexFormat_SHORT_NORMALIZED_instance;
    var VertexFormat_SHORT2_NORMALIZED_instance;
    var VertexFormat_SHORT3_NORMALIZED_instance;
    var VertexFormat_SHORT4_NORMALIZED_instance;
    var VertexFormat_HALF_instance;
    var VertexFormat_HALF2_instance;
    var VertexFormat_HALF3_instance;
    var VertexFormat_HALF4_instance;
    var VertexFormat_FLOAT_instance;
    var VertexFormat_FLOAT2_instance;
    var VertexFormat_FLOAT3_instance;
    var VertexFormat_FLOAT4_instance;
    var VertexFormat_UINT_instance;
    var VertexFormat_UINT2_instance;
    var VertexFormat_UINT3_instance;
    var VertexFormat_UINT4_instance;
    var VertexFormat_INT_instance;
    var VertexFormat_INT2_instance;
    var VertexFormat_INT3_instance;
    var VertexFormat_INT4_instance;
    var VertexFormat_INT_1010102_NORMALIZED_instance;
    var VertexFormat_UINT_1010102_NORMALIZED_instance;
    function values_7() {
        return [VertexFormat_UBYTE_getInstance(), VertexFormat_UBYTE2_getInstance(), VertexFormat_UBYTE3_getInstance(), VertexFormat_UBYTE4_getInstance(), VertexFormat_BYTE_getInstance(), VertexFormat_BYTE2_getInstance(), VertexFormat_BYTE3_getInstance(), VertexFormat_BYTE4_getInstance(), VertexFormat_UBYTE_NORMALIZED_getInstance(), VertexFormat_UBYTE2_NORMALIZED_getInstance(), VertexFormat_UBYTE3_NORMALIZED_getInstance(), VertexFormat_UBYTE4_NORMALIZED_getInstance(), VertexFormat_BYTE_NORMALIZED_getInstance(), VertexFormat_BYTE2_NORMALIZED_getInstance(), VertexFormat_BYTE3_NORMALIZED_getInstance(), VertexFormat_BYTE4_NORMALIZED_getInstance(), VertexFormat_USHORT_getInstance(), VertexFormat_USHORT2_getInstance(), VertexFormat_USHORT3_getInstance(), VertexFormat_USHORT4_getInstance(), VertexFormat_SHORT_getInstance(), VertexFormat_SHORT2_getInstance(), VertexFormat_SHORT3_getInstance(), VertexFormat_SHORT4_getInstance(), VertexFormat_USHORT_NORMALIZED_getInstance(), VertexFormat_USHORT2_NORMALIZED_getInstance(), VertexFormat_USHORT3_NORMALIZED_getInstance(), VertexFormat_USHORT4_NORMALIZED_getInstance(), VertexFormat_SHORT_NORMALIZED_getInstance(), VertexFormat_SHORT2_NORMALIZED_getInstance(), VertexFormat_SHORT3_NORMALIZED_getInstance(), VertexFormat_SHORT4_NORMALIZED_getInstance(), VertexFormat_HALF_getInstance(), VertexFormat_HALF2_getInstance(), VertexFormat_HALF3_getInstance(), VertexFormat_HALF4_getInstance(), VertexFormat_FLOAT_getInstance(), VertexFormat_FLOAT2_getInstance(), VertexFormat_FLOAT3_getInstance(), VertexFormat_FLOAT4_getInstance(), VertexFormat_UINT_getInstance(), VertexFormat_UINT2_getInstance(), VertexFormat_UINT3_getInstance(), VertexFormat_UINT4_getInstance(), VertexFormat_INT_getInstance(), VertexFormat_INT2_getInstance(), VertexFormat_INT3_getInstance(), VertexFormat_INT4_getInstance(), VertexFormat_INT_1010102_NORMALIZED_getInstance(), VertexFormat_UINT_1010102_NORMALIZED_getInstance()];
    }
    function valueOf_7(value) {
        switch (value) {
            case 'UBYTE':
                return VertexFormat_UBYTE_getInstance();
            case 'UBYTE2':
                return VertexFormat_UBYTE2_getInstance();
            case 'UBYTE3':
                return VertexFormat_UBYTE3_getInstance();
            case 'UBYTE4':
                return VertexFormat_UBYTE4_getInstance();
            case 'BYTE':
                return VertexFormat_BYTE_getInstance();
            case 'BYTE2':
                return VertexFormat_BYTE2_getInstance();
            case 'BYTE3':
                return VertexFormat_BYTE3_getInstance();
            case 'BYTE4':
                return VertexFormat_BYTE4_getInstance();
            case 'UBYTE_NORMALIZED':
                return VertexFormat_UBYTE_NORMALIZED_getInstance();
            case 'UBYTE2_NORMALIZED':
                return VertexFormat_UBYTE2_NORMALIZED_getInstance();
            case 'UBYTE3_NORMALIZED':
                return VertexFormat_UBYTE3_NORMALIZED_getInstance();
            case 'UBYTE4_NORMALIZED':
                return VertexFormat_UBYTE4_NORMALIZED_getInstance();
            case 'BYTE_NORMALIZED':
                return VertexFormat_BYTE_NORMALIZED_getInstance();
            case 'BYTE2_NORMALIZED':
                return VertexFormat_BYTE2_NORMALIZED_getInstance();
            case 'BYTE3_NORMALIZED':
                return VertexFormat_BYTE3_NORMALIZED_getInstance();
            case 'BYTE4_NORMALIZED':
                return VertexFormat_BYTE4_NORMALIZED_getInstance();
            case 'USHORT':
                return VertexFormat_USHORT_getInstance();
            case 'USHORT2':
                return VertexFormat_USHORT2_getInstance();
            case 'USHORT3':
                return VertexFormat_USHORT3_getInstance();
            case 'USHORT4':
                return VertexFormat_USHORT4_getInstance();
            case 'SHORT':
                return VertexFormat_SHORT_getInstance();
            case 'SHORT2':
                return VertexFormat_SHORT2_getInstance();
            case 'SHORT3':
                return VertexFormat_SHORT3_getInstance();
            case 'SHORT4':
                return VertexFormat_SHORT4_getInstance();
            case 'USHORT_NORMALIZED':
                return VertexFormat_USHORT_NORMALIZED_getInstance();
            case 'USHORT2_NORMALIZED':
                return VertexFormat_USHORT2_NORMALIZED_getInstance();
            case 'USHORT3_NORMALIZED':
                return VertexFormat_USHORT3_NORMALIZED_getInstance();
            case 'USHORT4_NORMALIZED':
                return VertexFormat_USHORT4_NORMALIZED_getInstance();
            case 'SHORT_NORMALIZED':
                return VertexFormat_SHORT_NORMALIZED_getInstance();
            case 'SHORT2_NORMALIZED':
                return VertexFormat_SHORT2_NORMALIZED_getInstance();
            case 'SHORT3_NORMALIZED':
                return VertexFormat_SHORT3_NORMALIZED_getInstance();
            case 'SHORT4_NORMALIZED':
                return VertexFormat_SHORT4_NORMALIZED_getInstance();
            case 'HALF':
                return VertexFormat_HALF_getInstance();
            case 'HALF2':
                return VertexFormat_HALF2_getInstance();
            case 'HALF3':
                return VertexFormat_HALF3_getInstance();
            case 'HALF4':
                return VertexFormat_HALF4_getInstance();
            case 'FLOAT':
                return VertexFormat_FLOAT_getInstance();
            case 'FLOAT2':
                return VertexFormat_FLOAT2_getInstance();
            case 'FLOAT3':
                return VertexFormat_FLOAT3_getInstance();
            case 'FLOAT4':
                return VertexFormat_FLOAT4_getInstance();
            case 'UINT':
                return VertexFormat_UINT_getInstance();
            case 'UINT2':
                return VertexFormat_UINT2_getInstance();
            case 'UINT3':
                return VertexFormat_UINT3_getInstance();
            case 'UINT4':
                return VertexFormat_UINT4_getInstance();
            case 'INT':
                return VertexFormat_INT_getInstance();
            case 'INT2':
                return VertexFormat_INT2_getInstance();
            case 'INT3':
                return VertexFormat_INT3_getInstance();
            case 'INT4':
                return VertexFormat_INT4_getInstance();
            case 'INT_1010102_NORMALIZED':
                return VertexFormat_INT_1010102_NORMALIZED_getInstance();
            case 'UINT_1010102_NORMALIZED':
                return VertexFormat_UINT_1010102_NORMALIZED_getInstance();
            default:
                VertexFormat_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var VertexFormat_entriesInitialized;
    function VertexFormat_initEntries() {
        if (VertexFormat_entriesInitialized)
            return Unit_instance;
        VertexFormat_entriesInitialized = true;
        VertexFormat_UBYTE_instance = new VertexFormat('UBYTE', 0, 0);
        VertexFormat_UBYTE2_instance = new VertexFormat('UBYTE2', 1, 1);
        VertexFormat_UBYTE3_instance = new VertexFormat('UBYTE3', 2, 2);
        VertexFormat_UBYTE4_instance = new VertexFormat('UBYTE4', 3, 3);
        VertexFormat_BYTE_instance = new VertexFormat('BYTE', 4, 4);
        VertexFormat_BYTE2_instance = new VertexFormat('BYTE2', 5, 5);
        VertexFormat_BYTE3_instance = new VertexFormat('BYTE3', 6, 6);
        VertexFormat_BYTE4_instance = new VertexFormat('BYTE4', 7, 7);
        VertexFormat_UBYTE_NORMALIZED_instance = new VertexFormat('UBYTE_NORMALIZED', 8, 8);
        VertexFormat_UBYTE2_NORMALIZED_instance = new VertexFormat('UBYTE2_NORMALIZED', 9, 9);
        VertexFormat_UBYTE3_NORMALIZED_instance = new VertexFormat('UBYTE3_NORMALIZED', 10, 10);
        VertexFormat_UBYTE4_NORMALIZED_instance = new VertexFormat('UBYTE4_NORMALIZED', 11, 11);
        VertexFormat_BYTE_NORMALIZED_instance = new VertexFormat('BYTE_NORMALIZED', 12, 12);
        VertexFormat_BYTE2_NORMALIZED_instance = new VertexFormat('BYTE2_NORMALIZED', 13, 13);
        VertexFormat_BYTE3_NORMALIZED_instance = new VertexFormat('BYTE3_NORMALIZED', 14, 14);
        VertexFormat_BYTE4_NORMALIZED_instance = new VertexFormat('BYTE4_NORMALIZED', 15, 15);
        VertexFormat_USHORT_instance = new VertexFormat('USHORT', 16, 16);
        VertexFormat_USHORT2_instance = new VertexFormat('USHORT2', 17, 17);
        VertexFormat_USHORT3_instance = new VertexFormat('USHORT3', 18, 18);
        VertexFormat_USHORT4_instance = new VertexFormat('USHORT4', 19, 19);
        VertexFormat_SHORT_instance = new VertexFormat('SHORT', 20, 20);
        VertexFormat_SHORT2_instance = new VertexFormat('SHORT2', 21, 21);
        VertexFormat_SHORT3_instance = new VertexFormat('SHORT3', 22, 22);
        VertexFormat_SHORT4_instance = new VertexFormat('SHORT4', 23, 23);
        VertexFormat_USHORT_NORMALIZED_instance = new VertexFormat('USHORT_NORMALIZED', 24, 24);
        VertexFormat_USHORT2_NORMALIZED_instance = new VertexFormat('USHORT2_NORMALIZED', 25, 25);
        VertexFormat_USHORT3_NORMALIZED_instance = new VertexFormat('USHORT3_NORMALIZED', 26, 26);
        VertexFormat_USHORT4_NORMALIZED_instance = new VertexFormat('USHORT4_NORMALIZED', 27, 27);
        VertexFormat_SHORT_NORMALIZED_instance = new VertexFormat('SHORT_NORMALIZED', 28, 28);
        VertexFormat_SHORT2_NORMALIZED_instance = new VertexFormat('SHORT2_NORMALIZED', 29, 29);
        VertexFormat_SHORT3_NORMALIZED_instance = new VertexFormat('SHORT3_NORMALIZED', 30, 30);
        VertexFormat_SHORT4_NORMALIZED_instance = new VertexFormat('SHORT4_NORMALIZED', 31, 31);
        VertexFormat_HALF_instance = new VertexFormat('HALF', 32, 32);
        VertexFormat_HALF2_instance = new VertexFormat('HALF2', 33, 33);
        VertexFormat_HALF3_instance = new VertexFormat('HALF3', 34, 34);
        VertexFormat_HALF4_instance = new VertexFormat('HALF4', 35, 35);
        VertexFormat_FLOAT_instance = new VertexFormat('FLOAT', 36, 36);
        VertexFormat_FLOAT2_instance = new VertexFormat('FLOAT2', 37, 37);
        VertexFormat_FLOAT3_instance = new VertexFormat('FLOAT3', 38, 38);
        VertexFormat_FLOAT4_instance = new VertexFormat('FLOAT4', 39, 39);
        VertexFormat_UINT_instance = new VertexFormat('UINT', 40, 40);
        VertexFormat_UINT2_instance = new VertexFormat('UINT2', 41, 41);
        VertexFormat_UINT3_instance = new VertexFormat('UINT3', 42, 42);
        VertexFormat_UINT4_instance = new VertexFormat('UINT4', 43, 43);
        VertexFormat_INT_instance = new VertexFormat('INT', 44, 44);
        VertexFormat_INT2_instance = new VertexFormat('INT2', 45, 45);
        VertexFormat_INT3_instance = new VertexFormat('INT3', 46, 46);
        VertexFormat_INT4_instance = new VertexFormat('INT4', 47, 47);
        VertexFormat_INT_1010102_NORMALIZED_instance = new VertexFormat('INT_1010102_NORMALIZED', 48, 48);
        VertexFormat_UINT_1010102_NORMALIZED_instance = new VertexFormat('UINT_1010102_NORMALIZED', 49, 49);
    }
    function VertexFormat(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function VertexAttribute(type, index, format, offset) {
        this.type = type;
        this.index = index;
        this.format = format;
        this.offset = offset;
    }
    protoOf(VertexAttribute).aa = function () {
        return this.type;
    };
    protoOf(VertexAttribute).wa = function () {
        return this.index;
    };
    protoOf(VertexAttribute).oa = function () {
        return this.format;
    };
    protoOf(VertexAttribute).xa = function () {
        return this.offset;
    };
    protoOf(VertexAttribute).j5 = function () {
        return this.type;
    };
    protoOf(VertexAttribute).k5 = function () {
        return this.index;
    };
    protoOf(VertexAttribute).ya = function () {
        return this.format;
    };
    protoOf(VertexAttribute).za = function () {
        return this.offset;
    };
    protoOf(VertexAttribute).ab = function (type, index, format, offset) {
        return new VertexAttribute(type, index, format, offset);
    };
    protoOf(VertexAttribute).copy = function (type, index, format, offset, $super) {
        type = type === VOID ? this.type : type;
        index = index === VOID ? this.index : index;
        format = format === VOID ? this.format : format;
        offset = offset === VOID ? this.offset : offset;
        return this.ab(type, index, format, offset);
    };
    protoOf(VertexAttribute).toString = function () {
        return 'VertexAttribute(type=' + this.type + ', index=' + this.index + ', format=' + this.format + ', offset=' + this.offset + ')';
    };
    protoOf(VertexAttribute).hashCode = function () {
        var result = this.type.hashCode();
        result = imul(result, 31) + this.index | 0;
        result = imul(result, 31) + this.format.hashCode() | 0;
        result = imul(result, 31) + this.offset | 0;
        return result;
    };
    protoOf(VertexAttribute).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof VertexAttribute))
            return false;
        var tmp0_other_with_cast = other instanceof VertexAttribute ? other : THROW_CCE();
        if (!this.type.equals(tmp0_other_with_cast.type))
            return false;
        if (!(this.index === tmp0_other_with_cast.index))
            return false;
        if (!this.format.equals(tmp0_other_with_cast.format))
            return false;
        if (!(this.offset === tmp0_other_with_cast.offset))
            return false;
        return true;
    };
    function VertexAttributesDescriptor(attributes, stride) {
        this.attributes = attributes;
        this.stride = stride;
    }
    protoOf(VertexAttributesDescriptor).j7 = function () {
        return this.attributes;
    };
    protoOf(VertexAttributesDescriptor).bb = function () {
        return this.stride;
    };
    protoOf(VertexAttributesDescriptor).j5 = function () {
        return this.attributes;
    };
    protoOf(VertexAttributesDescriptor).k5 = function () {
        return this.stride;
    };
    protoOf(VertexAttributesDescriptor).cb = function (attributes, stride) {
        return new VertexAttributesDescriptor(attributes, stride);
    };
    protoOf(VertexAttributesDescriptor).copy = function (attributes, stride, $super) {
        attributes = attributes === VOID ? this.attributes : attributes;
        stride = stride === VOID ? this.stride : stride;
        return this.cb(attributes, stride);
    };
    protoOf(VertexAttributesDescriptor).toString = function () {
        return 'VertexAttributesDescriptor(attributes=' + this.attributes + ', stride=' + this.stride + ')';
    };
    protoOf(VertexAttributesDescriptor).hashCode = function () {
        var result = hashCode(this.attributes);
        result = imul(result, 31) + this.stride | 0;
        return result;
    };
    protoOf(VertexAttributesDescriptor).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof VertexAttributesDescriptor))
            return false;
        var tmp0_other_with_cast = other instanceof VertexAttributesDescriptor ? other : THROW_CCE();
        if (!equals(this.attributes, tmp0_other_with_cast.attributes))
            return false;
        if (!(this.stride === tmp0_other_with_cast.stride))
            return false;
        return true;
    };
    var AttributeType_VERTEX_instance;
    var AttributeType_NORMAL_instance;
    var AttributeType_COLOR_instance;
    var AttributeType_UV0_instance;
    var AttributeType_UV1_instance;
    var AttributeType_UV2_instance;
    var AttributeType_AO_instance;
    var AttributeType_CUSTOM0_instance;
    var AttributeType_CUSTOM1_instance;
    var AttributeType_CUSTOM2_instance;
    var AttributeType_CUSTOM3_instance;
    var AttributeType_U0_instance;
    var AttributeType_V0_instance;
    var AttributeType_U1_instance;
    var AttributeType_V1_instance;
    var AttributeType_U2_instance;
    var AttributeType_V2_instance;
    function values_8() {
        return [AttributeType_VERTEX_getInstance(), AttributeType_NORMAL_getInstance(), AttributeType_COLOR_getInstance(), AttributeType_UV0_getInstance(), AttributeType_UV1_getInstance(), AttributeType_UV2_getInstance(), AttributeType_AO_getInstance(), AttributeType_CUSTOM0_getInstance(), AttributeType_CUSTOM1_getInstance(), AttributeType_CUSTOM2_getInstance(), AttributeType_CUSTOM3_getInstance(), AttributeType_U0_getInstance(), AttributeType_V0_getInstance(), AttributeType_U1_getInstance(), AttributeType_V1_getInstance(), AttributeType_U2_getInstance(), AttributeType_V2_getInstance()];
    }
    function valueOf_8(value) {
        switch (value) {
            case 'VERTEX':
                return AttributeType_VERTEX_getInstance();
            case 'NORMAL':
                return AttributeType_NORMAL_getInstance();
            case 'COLOR':
                return AttributeType_COLOR_getInstance();
            case 'UV0':
                return AttributeType_UV0_getInstance();
            case 'UV1':
                return AttributeType_UV1_getInstance();
            case 'UV2':
                return AttributeType_UV2_getInstance();
            case 'AO':
                return AttributeType_AO_getInstance();
            case 'CUSTOM0':
                return AttributeType_CUSTOM0_getInstance();
            case 'CUSTOM1':
                return AttributeType_CUSTOM1_getInstance();
            case 'CUSTOM2':
                return AttributeType_CUSTOM2_getInstance();
            case 'CUSTOM3':
                return AttributeType_CUSTOM3_getInstance();
            case 'U0':
                return AttributeType_U0_getInstance();
            case 'V0':
                return AttributeType_V0_getInstance();
            case 'U1':
                return AttributeType_U1_getInstance();
            case 'V1':
                return AttributeType_V1_getInstance();
            case 'U2':
                return AttributeType_U2_getInstance();
            case 'V2':
                return AttributeType_V2_getInstance();
            default:
                AttributeType_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var AttributeType_entriesInitialized;
    function AttributeType_initEntries() {
        if (AttributeType_entriesInitialized)
            return Unit_instance;
        AttributeType_entriesInitialized = true;
        AttributeType_VERTEX_instance = new AttributeType('VERTEX', 0, 0);
        AttributeType_NORMAL_instance = new AttributeType('NORMAL', 1, 1);
        AttributeType_COLOR_instance = new AttributeType('COLOR', 2, 2);
        AttributeType_UV0_instance = new AttributeType('UV0', 3, 3);
        AttributeType_UV1_instance = new AttributeType('UV1', 4, 4);
        AttributeType_UV2_instance = new AttributeType('UV2', 5, 5);
        AttributeType_AO_instance = new AttributeType('AO', 6, 6);
        AttributeType_CUSTOM0_instance = new AttributeType('CUSTOM0', 7, 7);
        AttributeType_CUSTOM1_instance = new AttributeType('CUSTOM1', 8, 8);
        AttributeType_CUSTOM2_instance = new AttributeType('CUSTOM2', 9, 9);
        AttributeType_CUSTOM3_instance = new AttributeType('CUSTOM3', 10, 10);
        AttributeType_U0_instance = new AttributeType('U0', 11, 11);
        AttributeType_V0_instance = new AttributeType('V0', 12, 12);
        AttributeType_U1_instance = new AttributeType('U1', 13, 13);
        AttributeType_V1_instance = new AttributeType('V1', 14, 14);
        AttributeType_U2_instance = new AttributeType('U2', 15, 15);
        AttributeType_V2_instance = new AttributeType('V2', 16, 16);
    }
    function AttributeType(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function MeshAttribute(type, format, offset) {
        this.type = type;
        this.format = format;
        this.offset = offset;
    }
    protoOf(MeshAttribute).aa = function () {
        return this.type;
    };
    protoOf(MeshAttribute).oa = function () {
        return this.format;
    };
    protoOf(MeshAttribute).xa = function () {
        return this.offset;
    };
    protoOf(MeshAttribute).j5 = function () {
        return this.type;
    };
    protoOf(MeshAttribute).k5 = function () {
        return this.format;
    };
    protoOf(MeshAttribute).ya = function () {
        return this.offset;
    };
    protoOf(MeshAttribute).fb = function (type, format, offset) {
        return new MeshAttribute(type, format, offset);
    };
    protoOf(MeshAttribute).copy = function (type, format, offset, $super) {
        type = type === VOID ? this.type : type;
        format = format === VOID ? this.format : format;
        offset = offset === VOID ? this.offset : offset;
        return this.fb(type, format, offset);
    };
    protoOf(MeshAttribute).toString = function () {
        return 'MeshAttribute(type=' + this.type + ', format=' + this.format + ', offset=' + this.offset + ')';
    };
    protoOf(MeshAttribute).hashCode = function () {
        var result = this.type.hashCode();
        result = imul(result, 31) + this.format.hashCode() | 0;
        result = imul(result, 31) + this.offset | 0;
        return result;
    };
    protoOf(MeshAttribute).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof MeshAttribute))
            return false;
        var tmp0_other_with_cast = other instanceof MeshAttribute ? other : THROW_CCE();
        if (!this.type.equals(tmp0_other_with_cast.type))
            return false;
        if (!this.format.equals(tmp0_other_with_cast.format))
            return false;
        if (!(this.offset === tmp0_other_with_cast.offset))
            return false;
        return true;
    };
    function MeshAttributes(attributes, stride) {
        this.attributes = attributes;
        this.stride = stride;
    }
    protoOf(MeshAttributes).j7 = function () {
        return this.attributes;
    };
    protoOf(MeshAttributes).bb = function () {
        return this.stride;
    };
    protoOf(MeshAttributes).j5 = function () {
        return this.attributes;
    };
    protoOf(MeshAttributes).k5 = function () {
        return this.stride;
    };
    protoOf(MeshAttributes).gb = function (attributes, stride) {
        return new MeshAttributes(attributes, stride);
    };
    protoOf(MeshAttributes).copy = function (attributes, stride, $super) {
        attributes = attributes === VOID ? this.attributes : attributes;
        stride = stride === VOID ? this.stride : stride;
        return this.gb(attributes, stride);
    };
    protoOf(MeshAttributes).toString = function () {
        return 'MeshAttributes(attributes=' + this.attributes + ', stride=' + this.stride + ')';
    };
    protoOf(MeshAttributes).hashCode = function () {
        var result = hashCode(this.attributes);
        result = imul(result, 31) + this.stride | 0;
        return result;
    };
    protoOf(MeshAttributes).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof MeshAttributes))
            return false;
        var tmp0_other_with_cast = other instanceof MeshAttributes ? other : THROW_CCE();
        if (!equals(this.attributes, tmp0_other_with_cast.attributes))
            return false;
        if (!(this.stride === tmp0_other_with_cast.stride))
            return false;
        return true;
    };
    function VertexFormat_UBYTE_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE_instance;
    }
    function VertexFormat_UBYTE2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE2_instance;
    }
    function VertexFormat_UBYTE3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE3_instance;
    }
    function VertexFormat_UBYTE4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE4_instance;
    }
    function VertexFormat_BYTE_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE_instance;
    }
    function VertexFormat_BYTE2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE2_instance;
    }
    function VertexFormat_BYTE3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE3_instance;
    }
    function VertexFormat_BYTE4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE4_instance;
    }
    function VertexFormat_UBYTE_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE_NORMALIZED_instance;
    }
    function VertexFormat_UBYTE2_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE2_NORMALIZED_instance;
    }
    function VertexFormat_UBYTE3_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE3_NORMALIZED_instance;
    }
    function VertexFormat_UBYTE4_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UBYTE4_NORMALIZED_instance;
    }
    function VertexFormat_BYTE_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE_NORMALIZED_instance;
    }
    function VertexFormat_BYTE2_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE2_NORMALIZED_instance;
    }
    function VertexFormat_BYTE3_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE3_NORMALIZED_instance;
    }
    function VertexFormat_BYTE4_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_BYTE4_NORMALIZED_instance;
    }
    function VertexFormat_USHORT_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT_instance;
    }
    function VertexFormat_USHORT2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT2_instance;
    }
    function VertexFormat_USHORT3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT3_instance;
    }
    function VertexFormat_USHORT4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT4_instance;
    }
    function VertexFormat_SHORT_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT_instance;
    }
    function VertexFormat_SHORT2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT2_instance;
    }
    function VertexFormat_SHORT3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT3_instance;
    }
    function VertexFormat_SHORT4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT4_instance;
    }
    function VertexFormat_USHORT_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT_NORMALIZED_instance;
    }
    function VertexFormat_USHORT2_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT2_NORMALIZED_instance;
    }
    function VertexFormat_USHORT3_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT3_NORMALIZED_instance;
    }
    function VertexFormat_USHORT4_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_USHORT4_NORMALIZED_instance;
    }
    function VertexFormat_SHORT_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT_NORMALIZED_instance;
    }
    function VertexFormat_SHORT2_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT2_NORMALIZED_instance;
    }
    function VertexFormat_SHORT3_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT3_NORMALIZED_instance;
    }
    function VertexFormat_SHORT4_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_SHORT4_NORMALIZED_instance;
    }
    function VertexFormat_HALF_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_HALF_instance;
    }
    function VertexFormat_HALF2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_HALF2_instance;
    }
    function VertexFormat_HALF3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_HALF3_instance;
    }
    function VertexFormat_HALF4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_HALF4_instance;
    }
    function VertexFormat_FLOAT_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_FLOAT_instance;
    }
    function VertexFormat_FLOAT2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_FLOAT2_instance;
    }
    function VertexFormat_FLOAT3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_FLOAT3_instance;
    }
    function VertexFormat_FLOAT4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_FLOAT4_instance;
    }
    function VertexFormat_UINT_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UINT_instance;
    }
    function VertexFormat_UINT2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UINT2_instance;
    }
    function VertexFormat_UINT3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UINT3_instance;
    }
    function VertexFormat_UINT4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UINT4_instance;
    }
    function VertexFormat_INT_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_INT_instance;
    }
    function VertexFormat_INT2_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_INT2_instance;
    }
    function VertexFormat_INT3_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_INT3_instance;
    }
    function VertexFormat_INT4_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_INT4_instance;
    }
    function VertexFormat_INT_1010102_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_INT_1010102_NORMALIZED_instance;
    }
    function VertexFormat_UINT_1010102_NORMALIZED_getInstance() {
        VertexFormat_initEntries();
        return VertexFormat_UINT_1010102_NORMALIZED_instance;
    }
    function AttributeType_VERTEX_getInstance() {
        AttributeType_initEntries();
        return AttributeType_VERTEX_instance;
    }
    function AttributeType_NORMAL_getInstance() {
        AttributeType_initEntries();
        return AttributeType_NORMAL_instance;
    }
    function AttributeType_COLOR_getInstance() {
        AttributeType_initEntries();
        return AttributeType_COLOR_instance;
    }
    function AttributeType_UV0_getInstance() {
        AttributeType_initEntries();
        return AttributeType_UV0_instance;
    }
    function AttributeType_UV1_getInstance() {
        AttributeType_initEntries();
        return AttributeType_UV1_instance;
    }
    function AttributeType_UV2_getInstance() {
        AttributeType_initEntries();
        return AttributeType_UV2_instance;
    }
    function AttributeType_AO_getInstance() {
        AttributeType_initEntries();
        return AttributeType_AO_instance;
    }
    function AttributeType_CUSTOM0_getInstance() {
        AttributeType_initEntries();
        return AttributeType_CUSTOM0_instance;
    }
    function AttributeType_CUSTOM1_getInstance() {
        AttributeType_initEntries();
        return AttributeType_CUSTOM1_instance;
    }
    function AttributeType_CUSTOM2_getInstance() {
        AttributeType_initEntries();
        return AttributeType_CUSTOM2_instance;
    }
    function AttributeType_CUSTOM3_getInstance() {
        AttributeType_initEntries();
        return AttributeType_CUSTOM3_instance;
    }
    function AttributeType_U0_getInstance() {
        AttributeType_initEntries();
        return AttributeType_U0_instance;
    }
    function AttributeType_V0_getInstance() {
        AttributeType_initEntries();
        return AttributeType_V0_instance;
    }
    function AttributeType_U1_getInstance() {
        AttributeType_initEntries();
        return AttributeType_U1_instance;
    }
    function AttributeType_V1_getInstance() {
        AttributeType_initEntries();
        return AttributeType_V1_instance;
    }
    function AttributeType_U2_getInstance() {
        AttributeType_initEntries();
        return AttributeType_U2_instance;
    }
    function AttributeType_V2_getInstance() {
        AttributeType_initEntries();
        return AttributeType_V2_instance;
    }
    function TextureAnimationChunked(textureWidth, vertices, frames) {
        this.hb_1 = textureWidth;
        this.ib_1 = frames;
        this.jb_1 = 1.0 / this.hb_1 * 0.5;
        var tmp = this;
        // Inline function 'kotlin.math.ceil' call
        var x = vertices / this.hb_1;
        var tmp$ret$0 = Math.ceil(x);
        tmp.mb_1 = imul(numberToInt(tmp$ret$0), this.ib_1 + 1 | 0);
        this.kb_1 = 1.0 / this.mb_1 * 0.5;
        this.lb_1 = 1.0 / this.mb_1;
        var tmp_0 = this;
        // Inline function 'kotlin.math.ceil' call
        var x_0 = vertices / this.hb_1;
        tmp_0.nb_1 = 1.0 / Math.ceil(x_0);
    }
    protoOf(TextureAnimationChunked).ob = function (timer) {
        var coeff = timer < 0.5 ? timer * 2 : (1 - timer) * 2;
        var y = this.lb_1 * coeff * (this.ib_1 - 1 | 0) + this.kb_1;
        return y;
    };
    protoOf(TextureAnimationChunked).pb = function (timer) {
        return this.lb_1 * timer * (this.ib_1 - 1 | 0) + this.kb_1;
    };
    function updateCameraInterpolator($this) {
        var camera = $this.ub_1[$this.sb_1];
        $this.qb_1.setMinDuration($this.minDuration * $this.vb_1);
        $this.qb_1.setPosition(camera);
        $this.qb_1.reset();
    }
    function CameraPathAnimator(speed, minDuration, transitionDuration, isSmooth) {
        isSmooth = isSmooth === VOID ? false : isSmooth;
        this.speed = speed;
        this.minDuration = minDuration;
        this.transitionDuration = transitionDuration;
        this.enabled = true;
        this.qb_1 = new CameraPositionInterpolator(isSmooth);
        this.rb_1 = false;
        this.sb_1 = 0;
        this.tb_1 = CameraState_ANIMATING_getInstance();
        var tmp = this;
        // Inline function 'kotlin.arrayOf' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        tmp.ub_1 = [];
        this.vb_1 = 1.0;
        this.wb_1 = 0.0;
        this.qb_1.speed = this.speed;
        this.qb_1.setMinDuration(this.minDuration * this.vb_1);
    }
    protoOf(CameraPathAnimator).ec = function (_set____db54di) {
        this.speed = _set____db54di;
    };
    protoOf(CameraPathAnimator).fc = function () {
        return this.speed;
    };
    protoOf(CameraPathAnimator).gc = function (_set____db54di) {
        this.minDuration = _set____db54di;
    };
    protoOf(CameraPathAnimator).hc = function () {
        return this.minDuration;
    };
    protoOf(CameraPathAnimator).ic = function (_set____db54di) {
        this.transitionDuration = _set____db54di;
    };
    protoOf(CameraPathAnimator).jc = function () {
        return this.transitionDuration;
    };
    protoOf(CameraPathAnimator).f6 = function (_set____db54di) {
        this.enabled = _set____db54di;
    };
    protoOf(CameraPathAnimator).g6 = function () {
        return this.enabled;
    };
    protoOf(CameraPathAnimator).kc = function (value) {
        this.vb_1 = value;
        updateCameraInterpolator(this);
    };
    protoOf(CameraPathAnimator).lc = function () {
        return this.vb_1;
    };
    protoOf(CameraPathAnimator).enable = function () {
        this.enabled = true;
    };
    protoOf(CameraPathAnimator).disable = function () {
        this.enabled = false;
    };
    protoOf(CameraPathAnimator).mc = function () {
        return this.qb_1;
    };
    protoOf(CameraPathAnimator).nc = function () {
        return this.qb_1.timer;
    };
    protoOf(CameraPathAnimator).oc = function () {
        return this.tb_1;
    };
    protoOf(CameraPathAnimator).pc = function (value, randomizeCamera) {
        this.ub_1 = value;
        this.sb_1 = 0;
        updateCameraInterpolator(this);
        if (randomizeCamera) {
            this.randomCamera();
        }
    };
    protoOf(CameraPathAnimator).setCameras = function (value, randomizeCamera, $super) {
        randomizeCamera = randomizeCamera === VOID ? false : randomizeCamera;
        return this.pc(value, randomizeCamera);
    };
    protoOf(CameraPathAnimator).qc = function () {
        return this.ub_1[this.sb_1];
    };
    protoOf(CameraPathAnimator).nextCamera = function () {
        if (!this.enabled) {
            return Unit_instance;
        }
        this.setCameraState(CameraState_TRANSITIONING_getInstance());
    };
    protoOf(CameraPathAnimator).randomCamera = function () {
        this.sb_1 = MathUtils_instance.rc(this.ub_1.length, this.sb_1);
        updateCameraInterpolator(this);
    };
    protoOf(CameraPathAnimator).setCameraState = function (state) {
        if (this.tb_1.equals(state)) {
            return Unit_instance;
        }
        if (this.tb_1 === CameraState_ANIMATING_getInstance() ? state === CameraState_TRANSITIONING_getInstance() : false) {
            this.sb_1 = this.sb_1 + 1 | 0;
            this.sb_1 = this.sb_1 % this.ub_1.length | 0;
            var camera = this.ub_1[this.sb_1];
            this.qb_1.setMinDuration(this.transitionDuration);
            this.qb_1.setPosition(new CameraPositionPair(new CameraPosition(new Vec3(this.qb_1.cameraPosition.x, this.qb_1.cameraPosition.y, this.qb_1.cameraPosition.z), new Vec3(this.qb_1.cameraRotation.x, this.qb_1.cameraRotation.y, this.qb_1.cameraRotation.z)), new CameraPosition(new Vec3((camera.vc_1.sc_1.x - camera.uc_1.sc_1.x) / 2.0 + camera.uc_1.sc_1.x, (camera.vc_1.sc_1.y - camera.uc_1.sc_1.y) / 2.0 + camera.uc_1.sc_1.y, (camera.vc_1.sc_1.z - camera.uc_1.sc_1.z) / 2.0 + camera.uc_1.sc_1.z), new Vec3((camera.vc_1.tc_1.x - camera.uc_1.tc_1.x) / 2.0 + camera.uc_1.tc_1.x, (camera.vc_1.tc_1.y - camera.uc_1.tc_1.y) / 2.0 + camera.uc_1.tc_1.y, (camera.vc_1.tc_1.z - camera.uc_1.tc_1.z) / 2.0 + camera.uc_1.tc_1.z))));
            this.rb_1 = this.qb_1.reverse;
            this.qb_1.reverse = false;
            this.qb_1.reset();
        }
        else if (this.tb_1 === CameraState_TRANSITIONING_getInstance() ? state === CameraState_ANIMATING_getInstance() : false) {
            updateCameraInterpolator(this);
            this.qb_1.reverse = this.rb_1;
            this.qb_1.setTimer(0.5);
        }
        this.tb_1 = state;
    };
    protoOf(CameraPathAnimator).animate = function (timeNow) {
        if (!(this.wb_1 === 0.0)) {
            this.qb_1.iterate(timeNow);
            if (this.qb_1.timer === 1.0) {
                if (this.tb_1 === CameraState_ANIMATING_getInstance()) {
                    this.qb_1.reverse = !this.qb_1.reverse;
                    this.qb_1.reset();
                }
                else {
                    this.setCameraState(CameraState_ANIMATING_getInstance());
                }
            }
        }
        this.wb_1 = timeNow;
    };
    protoOf(CameraPathAnimator).changeDirection = function (impulse) {
        if (this.tb_1 === CameraState_TRANSITIONING_getInstance()) {
            return Unit_instance;
        }
        var prevReverse = this.qb_1.reverse;
        if (impulse < 0.0) {
            if (prevReverse) {
                this.qb_1.reverse = false;
                this.qb_1.setTimer(1.0 - this.qb_1.timer);
            }
        }
        else {
            if (!prevReverse) {
                this.qb_1.reverse = true;
                this.qb_1.setTimer(1.0 - this.qb_1.timer);
            }
        }
    };
    function CameraPosition(position, rotation) {
        this.sc_1 = position;
        this.tc_1 = rotation;
    }
    protoOf(CameraPosition).toString = function () {
        return 'CameraPosition(position=' + this.sc_1 + ', rotation=' + this.tc_1 + ')';
    };
    protoOf(CameraPosition).hashCode = function () {
        var result = this.sc_1.hashCode();
        result = imul(result, 31) + this.tc_1.hashCode() | 0;
        return result;
    };
    protoOf(CameraPosition).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof CameraPosition))
            return false;
        var tmp0_other_with_cast = other instanceof CameraPosition ? other : THROW_CCE();
        if (!this.sc_1.equals(tmp0_other_with_cast.sc_1))
            return false;
        if (!this.tc_1.equals(tmp0_other_with_cast.tc_1))
            return false;
        return true;
    };
    function _get_length__w7ahp7($this) {
        if ($this.xb_1 == null) {
            throw Exception_init_$Create$('position is not set');
        }
        var start = ensureNotNull($this.xb_1).uc_1.sc_1;
        var end = ensureNotNull($this.xb_1).vc_1.sc_1;
        // Inline function 'kotlin.math.sqrt' call
        // Inline function 'kotlin.math.pow' call
        var this_0 = end.x - start.x;
        var tmp = Math.pow(this_0, 2.0);
        // Inline function 'kotlin.math.pow' call
        var this_1 = end.y - start.y;
        var tmp_0 = tmp + Math.pow(this_1, 2.0);
        // Inline function 'kotlin.math.pow' call
        var this_2 = end.z - start.z;
        var x = tmp_0 + Math.pow(this_2, 2.0);
        return Math.sqrt(x);
    }
    function updateMatrix($this) {
        if ($this.xb_1 == null) {
            throw Exception_init_$Create$('position is not set');
        }
        var t = $this.timer;
        if ($this.isSmooth) {
            t = MathUtils_instance.xc(0.0, 1.0, $this.timer);
        }
        var start = $this.reverse ? ensureNotNull($this.xb_1).vc_1 : ensureNotNull($this.xb_1).uc_1;
        var end = $this.reverse ? ensureNotNull($this.xb_1).uc_1 : ensureNotNull($this.xb_1).vc_1;
        $this.cc_1.x = start.sc_1.x + t * (end.sc_1.x - start.sc_1.x);
        $this.cc_1.y = start.sc_1.y + t * (end.sc_1.y - start.sc_1.y);
        $this.cc_1.z = start.sc_1.z + t * (end.sc_1.z - start.sc_1.z);
        $this.dc_1.x = start.tc_1.x + t * (end.tc_1.x - start.tc_1.x);
        $this.dc_1.y = start.tc_1.y + t * (end.tc_1.y - start.tc_1.y);
        $this.dc_1.z = start.tc_1.z + t * (end.tc_1.z - start.tc_1.z);
        Matrix_getInstance().g9($this.matrix, 0);
        Matrix_getInstance().i9($this.matrix, 0, ($this.dc_1.x - 1.5707964) * 57.2958, 1.0, 0.0, 0.0);
        Matrix_getInstance().i9($this.matrix, 0, $this.dc_1.y * 57.2958, 0.0, 0.0, 1.0);
        Matrix_getInstance().i9($this.matrix, 0, $this.dc_1.z * 57.2958, 0.0, 1.0, 0.0);
        Matrix_getInstance().h9($this.matrix, 0, -$this.cc_1.x, -$this.cc_1.y, -$this.cc_1.z);
    }
    function Companion() {
        this.yc_1 = 1.5707964;
    }
    var Companion_instance;
    function Companion_getInstance() {
        return Companion_instance;
    }
    function CameraPositionInterpolator(isSmooth) {
        isSmooth = isSmooth === VOID ? false : isSmooth;
        this.isSmooth = isSmooth;
        this.xb_1 = null;
        this.speed = 0.0;
        this.yb_1 = 0.0;
        this.zb_1 = 3000.0;
        this.ac_1 = 0.0;
        this.timer = 0.0;
        this.bc_1 = 0.0;
        this.reverse = false;
        this.cc_1 = new Vec3(0.0, 0.0, 0.0);
        this.dc_1 = new Vec3(0.0, 0.0, 0.0);
        this.matrix = new Float32Array(16);
    }
    protoOf(CameraPositionInterpolator).zc = function (_set____db54di) {
        this.isSmooth = _set____db54di;
    };
    protoOf(CameraPositionInterpolator).ad = function () {
        return this.isSmooth;
    };
    protoOf(CameraPositionInterpolator).ec = function (_set____db54di) {
        this.speed = _set____db54di;
    };
    protoOf(CameraPositionInterpolator).fc = function () {
        return this.speed;
    };
    protoOf(CameraPositionInterpolator).nc = function () {
        return this.timer;
    };
    protoOf(CameraPositionInterpolator).bd = function (_set____db54di) {
        this.reverse = _set____db54di;
    };
    protoOf(CameraPositionInterpolator).cd = function () {
        return this.reverse;
    };
    protoOf(CameraPositionInterpolator).dd = function () {
        return this.matrix;
    };
    protoOf(CameraPositionInterpolator).ed = function () {
        return this.cc_1;
    };
    protoOf(CameraPositionInterpolator).fd = function () {
        return this.dc_1;
    };
    protoOf(CameraPositionInterpolator).setMinDuration = function (value) {
        this.zb_1 = value;
    };
    protoOf(CameraPositionInterpolator).setPosition = function (value) {
        this.xb_1 = value;
        var tmp = this;
        // Inline function 'kotlin.math.max' call
        var a = _get_length__w7ahp7(this) / this.speed;
        var b = this.zb_1;
        tmp.yb_1 = Math.max(a, b);
    };
    protoOf(CameraPositionInterpolator).setTimer = function (value) {
        this.ac_1 = value;
        this.timer = value;
        updateMatrix(this);
    };
    protoOf(CameraPositionInterpolator).iterate = function (timeNow) {
        if (!(this.bc_1 === 0.0)) {
            var elapsed = timeNow - this.bc_1;
            this.ac_1 = this.ac_1 + elapsed / this.yb_1;
            if (this.ac_1 > 1.0) {
                this.ac_1 = 1.0;
            }
        }
        this.timer = this.ac_1;
        this.bc_1 = timeNow;
        updateMatrix(this);
    };
    protoOf(CameraPositionInterpolator).reset = function () {
        this.bc_1 = 0.0;
        this.ac_1 = 0.0;
        this.timer = 0.0;
        updateMatrix(this);
    };
    function CameraPositionPair(start, end, speedMultiplier) {
        speedMultiplier = speedMultiplier === VOID ? 1.0 : speedMultiplier;
        this.uc_1 = start;
        this.vc_1 = end;
        this.wc_1 = speedMultiplier;
    }
    var CameraState_ANIMATING_instance;
    var CameraState_TRANSITIONING_instance;
    function values_9() {
        return [CameraState_ANIMATING_getInstance(), CameraState_TRANSITIONING_getInstance()];
    }
    function valueOf_9(value) {
        switch (value) {
            case 'ANIMATING':
                return CameraState_ANIMATING_getInstance();
            case 'TRANSITIONING':
                return CameraState_TRANSITIONING_getInstance();
            default:
                CameraState_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var CameraState_entriesInitialized;
    function CameraState_initEntries() {
        if (CameraState_entriesInitialized)
            return Unit_instance;
        CameraState_entriesInitialized = true;
        CameraState_ANIMATING_instance = new CameraState('ANIMATING', 0, 0);
        CameraState_TRANSITIONING_instance = new CameraState('TRANSITIONING', 1, 1);
    }
    function CameraState(name, ordinal, value) {
        Enum.call(this, name, ordinal);
        this.value = value;
    }
    protoOf(CameraState).k2 = function () {
        return this.value;
    };
    function CameraState_ANIMATING_getInstance() {
        CameraState_initEntries();
        return CameraState_ANIMATING_instance;
    }
    function CameraState_TRANSITIONING_getInstance() {
        CameraState_initEntries();
        return CameraState_TRANSITIONING_instance;
    }
    function Spline_init_$Init$(y, bPrepareEnds, $this) {
        Spline.call($this);
        if (bPrepareEnds) {
            $this.jd_1 = prepareSplineCoords($this, y);
        }
        else {
            $this.jd_1 = y;
        }
        var n = y.length;
        $this.kd_1 = new Float64Array(n);
        var u = new Float64Array(n);
        var inductionVariable = 1;
        var last = n - 1 | 0;
        if (inductionVariable < last)
            do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                $this.kd_1[i] = -1.0 / (4.0 + $this.kd_1[i - 1 | 0]);
                u[i] = (6.0 * (y[i + 1 | 0] - 2.0 * y[i] + y[i - 1 | 0]) - u[i - 1 | 0]) / (4.0 + $this.kd_1[i - 1 | 0]);
            } while (inductionVariable < last);
        var inductionVariable_0 = n - 2 | 0;
        if (0 <= inductionVariable_0)
            do {
                var i_0 = inductionVariable_0;
                inductionVariable_0 = inductionVariable_0 + -1 | 0;
                $this.kd_1[i_0] = $this.kd_1[i_0] * $this.kd_1[i_0 + 1 | 0] + u[i_0];
            } while (0 <= inductionVariable_0);
        return $this;
    }
    function Spline_init_$Create$(y, bPrepareEnds) {
        return Spline_init_$Init$(y, bPrepareEnds, objectCreate(protoOf(Spline)));
    }
    function prepareSplineCoords($this, array) {
        array[0] = array[array.length - 4 | 0];
        array[1] = array[array.length - 3 | 0];
        array[array.length - 2 | 0] = array[2];
        array[array.length - 1 | 0] = array[3];
        return array;
    }
    protoOf(Spline).ld = function (i, low, high) {
        // Inline function 'kotlin.math.max' call
        // Inline function 'kotlin.math.min' call
        var a = Math.min(i, high);
        return Math.max(a, low);
    };
    protoOf(Spline).md = function (m) {
        var clampedM = this.ld(m, 0.0, 1.0);
        if (clampedM === 0.0)
            return this.jd_1[2];
        if (clampedM === 1.0)
            return this.jd_1[this.jd_1.length - 2 | 0];
        // Inline function 'kotlin.math.floor' call
        var x = clampedM * (this.jd_1.length - 4 | 0) + 2;
        var tmp$ret$0 = Math.floor(x);
        var n = numberToInt(tmp$ret$0);
        var t = clampedM * (this.jd_1.length - 4 | 0) + 2 - n;
        return this.nd(n, t);
    };
    protoOf(Spline).nd = function (n, t) {
        return t * this.jd_1[n + 1 | 0] - (t - 1.0) * t * ((t - 2.0) * this.kd_1[n] - (t + 1.0) * this.kd_1[n + 1 | 0]) / 6.0 + this.jd_1[n] - t * this.jd_1[n];
    };
    function Spline() {
    }
    function Spline3D_init_$Init$(bPrepareEnds, x, y, z, $this) {
        Spline3D.call($this);
        $this.od_1 = Spline_init_$Create$(x, bPrepareEnds);
        $this.pd_1 = Spline_init_$Create$(y, bPrepareEnds);
        $this.qd_1 = Spline_init_$Create$(z, bPrepareEnds);
        $this.rd_1 = new Vec3();
        $this.sd_1 = new Vec3();
        return $this;
    }
    function Spline3D_init_$Create$(bPrepareEnds, x, y, z) {
        return Spline3D_init_$Init$(bPrepareEnds, x, y, z, objectCreate(protoOf(Spline3D)));
    }
    protoOf(Spline3D).md = function (m) {
        this.rd_1.x = this.od_1.md(m);
        this.rd_1.y = this.pd_1.md(m);
        this.rd_1.z = this.qd_1.md(m);
        return this.rd_1;
    };
    protoOf(Spline3D).td = function (a) {
        this.md(a);
        var headingA = a + 1.0E-4;
        if (headingA > 1.0) {
            headingA = 1 - headingA;
        }
        var tempPointX = this.od_1.md(headingA);
        var tempPointY = this.pd_1.md(headingA);
        var tempPointZ = this.qd_1.md(headingA);
        var tmp = ensureNotNull(this.sd_1);
        // Inline function 'kotlin.math.atan2' call
        var y = this.rd_1.z - tempPointZ;
        var x = this.rd_1.y - tempPointY;
        tmp.x = Math.atan2(y, x) * 180.0 / get_PI();
        var tmp_0 = ensureNotNull(this.sd_1);
        // Inline function 'kotlin.math.atan2' call
        var y_0 = this.rd_1.z - tempPointZ;
        var x_0 = this.rd_1.x - tempPointX;
        tmp_0.y = Math.atan2(y_0, x_0) * 180.0 / get_PI();
        var tmp_1 = ensureNotNull(this.sd_1);
        // Inline function 'kotlin.math.atan2' call
        var y_1 = this.rd_1.y - tempPointY;
        var x_1 = this.rd_1.x - tempPointX;
        tmp_1.z = Math.atan2(y_1, x_1) * 180.0 / get_PI();
        return this.sd_1;
    };
    function Spline3D() {
    }
    var BlurSize_KERNEL_5_instance;
    var BlurSize_KERNEL_4_instance;
    var BlurSize_KERNEL_3_instance;
    var BlurSize_KERNEL_2_instance;
    function values_10() {
        return [BlurSize_KERNEL_5_getInstance(), BlurSize_KERNEL_4_getInstance(), BlurSize_KERNEL_3_getInstance(), BlurSize_KERNEL_2_getInstance()];
    }
    function valueOf_10(value) {
        switch (value) {
            case 'KERNEL_5':
                return BlurSize_KERNEL_5_getInstance();
            case 'KERNEL_4':
                return BlurSize_KERNEL_4_getInstance();
            case 'KERNEL_3':
                return BlurSize_KERNEL_3_getInstance();
            case 'KERNEL_2':
                return BlurSize_KERNEL_2_getInstance();
            default:
                BlurSize_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var BlurSize_entriesInitialized;
    function BlurSize_initEntries() {
        if (BlurSize_entriesInitialized)
            return Unit_instance;
        BlurSize_entriesInitialized = true;
        BlurSize_KERNEL_5_instance = new BlurSize('KERNEL_5', 0);
        BlurSize_KERNEL_4_instance = new BlurSize('KERNEL_4', 1);
        BlurSize_KERNEL_3_instance = new BlurSize('KERNEL_3', 2);
        BlurSize_KERNEL_2_instance = new BlurSize('KERNEL_2', 3);
    }
    function BlurSize(name, ordinal) {
        Enum.call(this, name, ordinal);
    }
    function BlurredPassCommand() {
        RenderPassCommand_init_$Init$(this);
        this.xd_1 = CommandType_BLURRED_PASS_getInstance();
        this.minSize = 200;
        this.brightness = 1.0;
        this.blurSize = BlurSize_KERNEL_4_getInstance();
        this.additionalBlur = false;
        this.id = 0;
    }
    protoOf(BlurredPassCommand).aa = function () {
        return this.xd_1;
    };
    protoOf(BlurredPassCommand).yd = function (_set____db54di) {
        this.minSize = _set____db54di;
    };
    protoOf(BlurredPassCommand).zd = function () {
        return this.minSize;
    };
    protoOf(BlurredPassCommand).ae = function (_set____db54di) {
        this.brightness = _set____db54di;
    };
    protoOf(BlurredPassCommand).be = function () {
        return this.brightness;
    };
    protoOf(BlurredPassCommand).ce = function (_set____db54di) {
        this.blurSize = _set____db54di;
    };
    protoOf(BlurredPassCommand).de = function () {
        return this.blurSize;
    };
    protoOf(BlurredPassCommand).ee = function (_set____db54di) {
        this.additionalBlur = _set____db54di;
    };
    protoOf(BlurredPassCommand).fe = function () {
        return this.additionalBlur;
    };
    protoOf(BlurredPassCommand).c7 = function (_set____db54di) {
        this.id = _set____db54di;
    };
    protoOf(BlurredPassCommand).d7 = function () {
        return this.id;
    };
    function DrawBlurredCommand() {
        Command.call(this);
        this.ge_1 = CommandType_DRAW_BLURRED_getInstance();
        this.blending = get_BLENDING_NONE();
        this.id = 0;
    }
    protoOf(DrawBlurredCommand).aa = function () {
        return this.ge_1;
    };
    protoOf(DrawBlurredCommand).he = function (_set____db54di) {
        this.blending = _set____db54di;
    };
    protoOf(DrawBlurredCommand).ie = function () {
        return this.blending;
    };
    protoOf(DrawBlurredCommand).c7 = function (_set____db54di) {
        this.id = _set____db54di;
    };
    protoOf(DrawBlurredCommand).d7 = function () {
        return this.id;
    };
    function BlurSize_KERNEL_5_getInstance() {
        BlurSize_initEntries();
        return BlurSize_KERNEL_5_instance;
    }
    function BlurSize_KERNEL_4_getInstance() {
        BlurSize_initEntries();
        return BlurSize_KERNEL_4_instance;
    }
    function BlurSize_KERNEL_3_getInstance() {
        BlurSize_initEntries();
        return BlurSize_KERNEL_3_instance;
    }
    function BlurSize_KERNEL_2_getInstance() {
        BlurSize_initEntries();
        return BlurSize_KERNEL_2_instance;
    }
    function ClearColorCommand() {
        Command.call(this);
        this.je_1 = CommandType_CLEAR_COLOR_getInstance();
        this.color = new Vec4(0.0, 0.0, 0.0, 0.0);
    }
    protoOf(ClearColorCommand).aa = function () {
        return this.je_1;
    };
    protoOf(ClearColorCommand).ke = function (_set____db54di) {
        this.color = _set____db54di;
    };
    protoOf(ClearColorCommand).le = function () {
        return this.color;
    };
    var ClearCommandClearType_COLOR_instance;
    var ClearCommandClearType_DEPTH_instance;
    var ClearCommandClearType_COLOR_AND_DEPTH_instance;
    function values_11() {
        return [ClearCommandClearType_COLOR_getInstance(), ClearCommandClearType_DEPTH_getInstance(), ClearCommandClearType_COLOR_AND_DEPTH_getInstance()];
    }
    function valueOf_11(value) {
        switch (value) {
            case 'COLOR':
                return ClearCommandClearType_COLOR_getInstance();
            case 'DEPTH':
                return ClearCommandClearType_DEPTH_getInstance();
            case 'COLOR_AND_DEPTH':
                return ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
            default:
                ClearCommandClearType_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var ClearCommandClearType_entriesInitialized;
    function ClearCommandClearType_initEntries() {
        if (ClearCommandClearType_entriesInitialized)
            return Unit_instance;
        ClearCommandClearType_entriesInitialized = true;
        ClearCommandClearType_COLOR_instance = new ClearCommandClearType('COLOR', 0, 0);
        ClearCommandClearType_DEPTH_instance = new ClearCommandClearType('DEPTH', 1, 1);
        ClearCommandClearType_COLOR_AND_DEPTH_instance = new ClearCommandClearType('COLOR_AND_DEPTH', 2, 2);
    }
    function ClearCommandClearType(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function ClearCommand() {
        Command.call(this);
        this.oe_1 = CommandType_CLEAR_getInstance();
        this.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    }
    protoOf(ClearCommand).aa = function () {
        return this.oe_1;
    };
    protoOf(ClearCommand).pe = function (_set____db54di) {
        this.clearType = _set____db54di;
    };
    protoOf(ClearCommand).qe = function () {
        return this.clearType;
    };
    function ClearCommandClearType_COLOR_getInstance() {
        ClearCommandClearType_initEntries();
        return ClearCommandClearType_COLOR_instance;
    }
    function ClearCommandClearType_DEPTH_getInstance() {
        ClearCommandClearType_initEntries();
        return ClearCommandClearType_DEPTH_instance;
    }
    function ClearCommandClearType_COLOR_AND_DEPTH_getInstance() {
        ClearCommandClearType_initEntries();
        return ClearCommandClearType_COLOR_AND_DEPTH_instance;
    }
    function Command() {
        this.enabled = true;
        this.name = '';
    }
    protoOf(Command).f6 = function (_set____db54di) {
        this.enabled = _set____db54di;
    };
    protoOf(Command).g6 = function () {
        return this.enabled;
    };
    protoOf(Command).b7 = function (_set____db54di) {
        this.name = _set____db54di;
    };
    protoOf(Command).c4 = function () {
        return this.name;
    };
    var CommandType_NOOP_instance;
    var CommandType_GROUP_instance;
    var CommandType_CLEAR_COLOR_instance;
    var CommandType_CLEAR_instance;
    var CommandType_VIGNETTE_instance;
    var CommandType_DRAW_MESH_instance;
    var CommandType_BLURRED_PASS_instance;
    var CommandType_DRAW_BLURRED_instance;
    var CommandType_RENDER_PASS_instance;
    var CommandType_MAIN_PASS_instance;
    var CommandType_CUSTOM_instance;
    function values_12() {
        return [CommandType_NOOP_getInstance(), CommandType_GROUP_getInstance(), CommandType_CLEAR_COLOR_getInstance(), CommandType_CLEAR_getInstance(), CommandType_VIGNETTE_getInstance(), CommandType_DRAW_MESH_getInstance(), CommandType_BLURRED_PASS_getInstance(), CommandType_DRAW_BLURRED_getInstance(), CommandType_RENDER_PASS_getInstance(), CommandType_MAIN_PASS_getInstance(), CommandType_CUSTOM_getInstance()];
    }
    function valueOf_12(value) {
        switch (value) {
            case 'NOOP':
                return CommandType_NOOP_getInstance();
            case 'GROUP':
                return CommandType_GROUP_getInstance();
            case 'CLEAR_COLOR':
                return CommandType_CLEAR_COLOR_getInstance();
            case 'CLEAR':
                return CommandType_CLEAR_getInstance();
            case 'VIGNETTE':
                return CommandType_VIGNETTE_getInstance();
            case 'DRAW_MESH':
                return CommandType_DRAW_MESH_getInstance();
            case 'BLURRED_PASS':
                return CommandType_BLURRED_PASS_getInstance();
            case 'DRAW_BLURRED':
                return CommandType_DRAW_BLURRED_getInstance();
            case 'RENDER_PASS':
                return CommandType_RENDER_PASS_getInstance();
            case 'MAIN_PASS':
                return CommandType_MAIN_PASS_getInstance();
            case 'CUSTOM':
                return CommandType_CUSTOM_getInstance();
            default:
                CommandType_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var CommandType_entriesInitialized;
    function CommandType_initEntries() {
        if (CommandType_entriesInitialized)
            return Unit_instance;
        CommandType_entriesInitialized = true;
        CommandType_NOOP_instance = new CommandType('NOOP', 0, 0);
        CommandType_GROUP_instance = new CommandType('GROUP', 1, 1);
        CommandType_CLEAR_COLOR_instance = new CommandType('CLEAR_COLOR', 2, 2);
        CommandType_CLEAR_instance = new CommandType('CLEAR', 3, 3);
        CommandType_VIGNETTE_instance = new CommandType('VIGNETTE', 4, 4);
        CommandType_DRAW_MESH_instance = new CommandType('DRAW_MESH', 5, 5);
        CommandType_BLURRED_PASS_instance = new CommandType('BLURRED_PASS', 6, 6);
        CommandType_DRAW_BLURRED_instance = new CommandType('DRAW_BLURRED', 7, 7);
        CommandType_RENDER_PASS_instance = new CommandType('RENDER_PASS', 8, 8);
        CommandType_MAIN_PASS_instance = new CommandType('MAIN_PASS', 9, 9);
        CommandType_CUSTOM_instance = new CommandType('CUSTOM', 10, 10);
    }
    function CommandType(name, ordinal, value) {
        Enum.call(this, name, ordinal);
        this.value = value;
    }
    protoOf(CommandType).k2 = function () {
        return this.value;
    };
    function CommandType_NOOP_getInstance() {
        CommandType_initEntries();
        return CommandType_NOOP_instance;
    }
    function CommandType_GROUP_getInstance() {
        CommandType_initEntries();
        return CommandType_GROUP_instance;
    }
    function CommandType_CLEAR_COLOR_getInstance() {
        CommandType_initEntries();
        return CommandType_CLEAR_COLOR_instance;
    }
    function CommandType_CLEAR_getInstance() {
        CommandType_initEntries();
        return CommandType_CLEAR_instance;
    }
    function CommandType_VIGNETTE_getInstance() {
        CommandType_initEntries();
        return CommandType_VIGNETTE_instance;
    }
    function CommandType_DRAW_MESH_getInstance() {
        CommandType_initEntries();
        return CommandType_DRAW_MESH_instance;
    }
    function CommandType_BLURRED_PASS_getInstance() {
        CommandType_initEntries();
        return CommandType_BLURRED_PASS_instance;
    }
    function CommandType_DRAW_BLURRED_getInstance() {
        CommandType_initEntries();
        return CommandType_DRAW_BLURRED_instance;
    }
    function CommandType_RENDER_PASS_getInstance() {
        CommandType_initEntries();
        return CommandType_RENDER_PASS_instance;
    }
    function CommandType_MAIN_PASS_getInstance() {
        CommandType_initEntries();
        return CommandType_MAIN_PASS_instance;
    }
    function CommandType_CUSTOM_getInstance() {
        CommandType_initEntries();
        return CommandType_CUSTOM_instance;
    }
    function DrawMeshState(shader, blending, depthMode, culling, vertexAttributes) {
        this.shader = shader;
        this.blending = blending;
        this.depthMode = depthMode;
        this.culling = culling;
        this.vertexAttributes = vertexAttributes;
    }
    protoOf(DrawMeshState).te = function (_set____db54di) {
        this.shader = _set____db54di;
    };
    protoOf(DrawMeshState).ue = function () {
        return this.shader;
    };
    protoOf(DrawMeshState).he = function (_set____db54di) {
        this.blending = _set____db54di;
    };
    protoOf(DrawMeshState).ie = function () {
        return this.blending;
    };
    protoOf(DrawMeshState).ve = function (_set____db54di) {
        this.depthMode = _set____db54di;
    };
    protoOf(DrawMeshState).we = function () {
        return this.depthMode;
    };
    protoOf(DrawMeshState).xe = function (_set____db54di) {
        this.culling = _set____db54di;
    };
    protoOf(DrawMeshState).ye = function () {
        return this.culling;
    };
    protoOf(DrawMeshState).ze = function (_set____db54di) {
        this.vertexAttributes = _set____db54di;
    };
    protoOf(DrawMeshState).af = function () {
        return this.vertexAttributes;
    };
    var PrimitiveType_TRIANGLES_instance;
    var PrimitiveType_TRIANGLE_STRIP_instance;
    var PrimitiveType_POINTS_instance;
    function values_13() {
        return [PrimitiveType_TRIANGLES_getInstance(), PrimitiveType_TRIANGLE_STRIP_getInstance(), PrimitiveType_POINTS_getInstance()];
    }
    function valueOf_13(value) {
        switch (value) {
            case 'TRIANGLES':
                return PrimitiveType_TRIANGLES_getInstance();
            case 'TRIANGLE_STRIP':
                return PrimitiveType_TRIANGLE_STRIP_getInstance();
            case 'POINTS':
                return PrimitiveType_POINTS_getInstance();
            default:
                PrimitiveType_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var PrimitiveType_entriesInitialized;
    function PrimitiveType_initEntries() {
        if (PrimitiveType_entriesInitialized)
            return Unit_instance;
        PrimitiveType_entriesInitialized = true;
        PrimitiveType_TRIANGLES_instance = new PrimitiveType('TRIANGLES', 0, 0);
        PrimitiveType_TRIANGLE_STRIP_instance = new PrimitiveType('TRIANGLE_STRIP', 1, 1);
        PrimitiveType_POINTS_instance = new PrimitiveType('POINTS', 2, 2);
    }
    function PrimitiveType(name, ordinal, value) {
        Enum.call(this, name, ordinal);
    }
    function DrawMeshCommand(mesh, uniforms, state, primitiveType, primitiveCount) {
        primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
        primitiveCount = primitiveCount === VOID ? -1 : primitiveCount;
        Command.call(this);
        this.mesh = mesh;
        this.uniforms = uniforms;
        this.state = state;
        this.primitiveType = primitiveType;
        this.primitiveCount = primitiveCount;
        this.q9_1 = CommandType_DRAW_MESH_getInstance();
        var tmp = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp.hints = ArrayList_init_$Create$();
    }
    protoOf(DrawMeshCommand).df = function (_set____db54di) {
        this.mesh = _set____db54di;
    };
    protoOf(DrawMeshCommand).ef = function () {
        return this.mesh;
    };
    protoOf(DrawMeshCommand).ff = function (_set____db54di) {
        this.uniforms = _set____db54di;
    };
    protoOf(DrawMeshCommand).gf = function () {
        return this.uniforms;
    };
    protoOf(DrawMeshCommand).hf = function (_set____db54di) {
        this.state = _set____db54di;
    };
    protoOf(DrawMeshCommand).oc = function () {
        return this.state;
    };
    protoOf(DrawMeshCommand).if = function (_set____db54di) {
        this.primitiveType = _set____db54di;
    };
    protoOf(DrawMeshCommand).jf = function () {
        return this.primitiveType;
    };
    protoOf(DrawMeshCommand).kf = function (_set____db54di) {
        this.primitiveCount = _set____db54di;
    };
    protoOf(DrawMeshCommand).lf = function () {
        return this.primitiveCount;
    };
    protoOf(DrawMeshCommand).aa = function () {
        return this.q9_1;
    };
    protoOf(DrawMeshCommand).mf = function (_set____db54di) {
        this.hints = _set____db54di;
    };
    protoOf(DrawMeshCommand).nf = function () {
        return this.hints;
    };
    function PrimitiveType_TRIANGLES_getInstance() {
        PrimitiveType_initEntries();
        return PrimitiveType_TRIANGLES_instance;
    }
    function PrimitiveType_TRIANGLE_STRIP_getInstance() {
        PrimitiveType_initEntries();
        return PrimitiveType_TRIANGLE_STRIP_instance;
    }
    function PrimitiveType_POINTS_getInstance() {
        PrimitiveType_initEntries();
        return PrimitiveType_POINTS_instance;
    }
    function DrawTransformedMeshCommand(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType) {
        indexUniformMvp = indexUniformMvp === VOID ? 0 : indexUniformMvp;
        indexUniformModel = indexUniformModel === VOID ? -1 : indexUniformModel;
        indexUniformView = indexUniformView === VOID ? -1 : indexUniformView;
        indexUniformProjection = indexUniformProjection === VOID ? -1 : indexUniformProjection;
        primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
        DrawMeshCommand.call(this, mesh, uniforms, state, primitiveType);
        this.transform = transform;
        this.indexUniformMvp = indexUniformMvp;
        this.indexUniformModel = indexUniformModel;
        this.indexUniformView = indexUniformView;
        this.indexUniformProjection = indexUniformProjection;
    }
    protoOf(DrawTransformedMeshCommand).of = function (_set____db54di) {
        this.transform = _set____db54di;
    };
    protoOf(DrawTransformedMeshCommand).pf = function () {
        return this.transform;
    };
    protoOf(DrawTransformedMeshCommand).qf = function (_set____db54di) {
        this.indexUniformMvp = _set____db54di;
    };
    protoOf(DrawTransformedMeshCommand).rf = function () {
        return this.indexUniformMvp;
    };
    protoOf(DrawTransformedMeshCommand).sf = function (_set____db54di) {
        this.indexUniformModel = _set____db54di;
    };
    protoOf(DrawTransformedMeshCommand).tf = function () {
        return this.indexUniformModel;
    };
    protoOf(DrawTransformedMeshCommand).uf = function (_set____db54di) {
        this.indexUniformView = _set____db54di;
    };
    protoOf(DrawTransformedMeshCommand).vf = function () {
        return this.indexUniformView;
    };
    protoOf(DrawTransformedMeshCommand).wf = function (_set____db54di) {
        this.indexUniformProjection = _set____db54di;
    };
    protoOf(DrawTransformedMeshCommand).xf = function () {
        return this.indexUniformProjection;
    };
    function DrawStaticMeshCommand_init_$Init$(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType, $this) {
        indexUniformMvp = indexUniformMvp === VOID ? 0 : indexUniformMvp;
        indexUniformModel = indexUniformModel === VOID ? -1 : indexUniformModel;
        indexUniformView = indexUniformView === VOID ? -1 : indexUniformView;
        indexUniformProjection = indexUniformProjection === VOID ? -1 : indexUniformProjection;
        primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
        DrawTransformedMeshCommand.call($this, mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType);
        DrawStaticMeshCommand.call($this);
        Matrix_getInstance().g9($this.modelMatrix, 0);
        Matrix_getInstance().h9($this.modelMatrix, 0, transform.l9_1.x, transform.l9_1.y, transform.l9_1.z);
        Matrix_getInstance().i9($this.modelMatrix, 0, transform.m9_1.x, 1.0, 0.0, 0.0);
        Matrix_getInstance().i9($this.modelMatrix, 0, transform.m9_1.y, 0.0, 1.0, 0.0);
        Matrix_getInstance().i9($this.modelMatrix, 0, transform.m9_1.z, 0.0, 0.0, 1.0);
        Matrix_getInstance().j9($this.modelMatrix, 0, transform.n9_1.x, transform.n9_1.y, transform.n9_1.z);
        return $this;
    }
    function DrawStaticMeshCommandConstructor(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType) {
        return DrawStaticMeshCommand_init_$Init$(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType, objectCreate(protoOf(DrawStaticMeshCommand)));
    }
    protoOf(DrawStaticMeshCommand).yf = function () {
        return this.modelMatrix;
    };
    function DrawStaticMeshCommand() {
        this.modelMatrix = new Float32Array(16);
    }
    function AffineTranformation(translation, rotation, scale) {
        translation = translation === VOID ? new Vec3(0.0, 0.0, 0.0) : translation;
        rotation = rotation === VOID ? new Vec3(0.0, 0.0, 0.0) : rotation;
        scale = scale === VOID ? new Vec3(1.0, 1.0, 1.0) : scale;
        this.l9_1 = translation;
        this.m9_1 = rotation;
        this.n9_1 = scale;
    }
    protoOf(AffineTranformation).toString = function () {
        return 'AffineTranformation(translation=' + this.l9_1 + ', rotation=' + this.m9_1 + ', scale=' + this.n9_1 + ')';
    };
    protoOf(AffineTranformation).hashCode = function () {
        var result = this.l9_1.hashCode();
        result = imul(result, 31) + this.m9_1.hashCode() | 0;
        result = imul(result, 31) + this.n9_1.hashCode() | 0;
        return result;
    };
    protoOf(AffineTranformation).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof AffineTranformation))
            return false;
        var tmp0_other_with_cast = other instanceof AffineTranformation ? other : THROW_CCE();
        if (!this.l9_1.equals(tmp0_other_with_cast.l9_1))
            return false;
        if (!this.m9_1.equals(tmp0_other_with_cast.m9_1))
            return false;
        if (!this.n9_1.equals(tmp0_other_with_cast.n9_1))
            return false;
        return true;
    };
    function GroupCommand_init_$Init$(enabled, commands, $this) {
        GroupCommand.call($this);
        $this.enabled = enabled;
        $this.commands = toMutableList(commands);
        return $this;
    }
    function GroupCommandArr(enabled, commands) {
        return GroupCommand_init_$Init$(enabled, commands, objectCreate(protoOf(GroupCommand)));
    }
    function GroupCommand() {
        Command.call(this);
        var tmp = this;
        // Inline function 'kotlin.collections.mutableListOf' call
        tmp.commands = ArrayList_init_$Create$();
    }
    protoOf(GroupCommand).aa = function () {
        return CommandType_GROUP_getInstance();
    };
    protoOf(GroupCommand).x8 = function (_set____db54di) {
        this.commands = _set____db54di;
    };
    protoOf(GroupCommand).y8 = function () {
        return this.commands;
    };
    function get_HINT_VRS_NONE() {
        _init_properties_Hints_kt__d0aug6();
        return HINT_VRS_NONE;
    }
    var HINT_VRS_NONE;
    var HINT_VRS_1X2;
    var HINT_VRS_2X1;
    function get_HINT_VRS_2X2() {
        _init_properties_Hints_kt__d0aug6();
        return HINT_VRS_2X2;
    }
    var HINT_VRS_2X2;
    var HINT_VRS_4X2;
    function get_HINT_VRS_4X4() {
        _init_properties_Hints_kt__d0aug6();
        return HINT_VRS_4X4;
    }
    var HINT_VRS_4X4;
    function Hint() {
    }
    var ShadingRate_SHADING_RATE_1X1_instance;
    var ShadingRate_SHADING_RATE_1X2_instance;
    var ShadingRate_SHADING_RATE_2X1_instance;
    var ShadingRate_SHADING_RATE_2X2_instance;
    var ShadingRate_SHADING_RATE_4X2_instance;
    var ShadingRate_SHADING_RATE_4X4_instance;
    function values_14() {
        return [ShadingRate_SHADING_RATE_1X1_getInstance(), ShadingRate_SHADING_RATE_1X2_getInstance(), ShadingRate_SHADING_RATE_2X1_getInstance(), ShadingRate_SHADING_RATE_2X2_getInstance(), ShadingRate_SHADING_RATE_4X2_getInstance(), ShadingRate_SHADING_RATE_4X4_getInstance()];
    }
    function valueOf_14(value) {
        switch (value) {
            case 'SHADING_RATE_1X1':
                return ShadingRate_SHADING_RATE_1X1_getInstance();
            case 'SHADING_RATE_1X2':
                return ShadingRate_SHADING_RATE_1X2_getInstance();
            case 'SHADING_RATE_2X1':
                return ShadingRate_SHADING_RATE_2X1_getInstance();
            case 'SHADING_RATE_2X2':
                return ShadingRate_SHADING_RATE_2X2_getInstance();
            case 'SHADING_RATE_4X2':
                return ShadingRate_SHADING_RATE_4X2_getInstance();
            case 'SHADING_RATE_4X4':
                return ShadingRate_SHADING_RATE_4X4_getInstance();
            default:
                ShadingRate_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var ShadingRate_entriesInitialized;
    function ShadingRate_initEntries() {
        if (ShadingRate_entriesInitialized)
            return Unit_instance;
        ShadingRate_entriesInitialized = true;
        ShadingRate_SHADING_RATE_1X1_instance = new ShadingRate('SHADING_RATE_1X1', 0, 38566);
        ShadingRate_SHADING_RATE_1X2_instance = new ShadingRate('SHADING_RATE_1X2', 1, 38567);
        ShadingRate_SHADING_RATE_2X1_instance = new ShadingRate('SHADING_RATE_2X1', 2, 38568);
        ShadingRate_SHADING_RATE_2X2_instance = new ShadingRate('SHADING_RATE_2X2', 3, 38569);
        ShadingRate_SHADING_RATE_4X2_instance = new ShadingRate('SHADING_RATE_4X2', 4, 38572);
        ShadingRate_SHADING_RATE_4X4_instance = new ShadingRate('SHADING_RATE_4X4', 5, 38574);
    }
    function ShadingRate(name, ordinal, value) {
        Enum.call(this, name, ordinal);
        this.value = value;
    }
    protoOf(ShadingRate).k2 = function () {
        return this.value;
    };
    function VrsHint(shadingRate) {
        Hint.call(this);
        this.shadingRate = shadingRate;
    }
    protoOf(VrsHint).bg = function () {
        return this.shadingRate;
    };
    function ShadingRate_SHADING_RATE_1X1_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_1X1_instance;
    }
    function ShadingRate_SHADING_RATE_1X2_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_1X2_instance;
    }
    function ShadingRate_SHADING_RATE_2X1_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_2X1_instance;
    }
    function ShadingRate_SHADING_RATE_2X2_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_2X2_instance;
    }
    function ShadingRate_SHADING_RATE_4X2_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_4X2_instance;
    }
    function ShadingRate_SHADING_RATE_4X4_getInstance() {
        ShadingRate_initEntries();
        return ShadingRate_SHADING_RATE_4X4_instance;
    }
    var properties_initialized_Hints_kt_2kk7lo;
    function _init_properties_Hints_kt__d0aug6() {
        if (!properties_initialized_Hints_kt_2kk7lo) {
            properties_initialized_Hints_kt_2kk7lo = true;
            HINT_VRS_NONE = new VrsHint(ShadingRate_SHADING_RATE_1X1_getInstance());
            HINT_VRS_1X2 = new VrsHint(ShadingRate_SHADING_RATE_1X2_getInstance());
            HINT_VRS_2X1 = new VrsHint(ShadingRate_SHADING_RATE_2X1_getInstance());
            HINT_VRS_2X2 = new VrsHint(ShadingRate_SHADING_RATE_2X2_getInstance());
            HINT_VRS_4X2 = new VrsHint(ShadingRate_SHADING_RATE_4X2_getInstance());
            HINT_VRS_4X4 = new VrsHint(ShadingRate_SHADING_RATE_4X4_getInstance());
        }
    }
    function MainPassCommand_init_$Init$($this) {
        RenderPassCommand_init_$Init$($this);
        MainPassCommand.call($this);
        return $this;
    }
    function MainPassCommandConstructor() {
        return MainPassCommand_init_$Init$(objectCreate(protoOf(MainPassCommand)));
    }
    function MainPassCommand_init_$Init$_0(enabled, commands, $this) {
        RenderPassCommand_init_$Init$_0(enabled, commands.slice(), $this);
        MainPassCommand.call($this);
        return $this;
    }
    function MainPassCommandArr(enabled, commands) {
        return MainPassCommand_init_$Init$_0(enabled, commands, objectCreate(protoOf(MainPassCommand)));
    }
    protoOf(MainPassCommand).aa = function () {
        return this.dg_1;
    };
    function MainPassCommand() {
        this.dg_1 = CommandType_MAIN_PASS_getInstance();
    }
    function NoopCommand() {
        Command.call(this);
    }
    protoOf(NoopCommand).aa = function () {
        return CommandType_NOOP_getInstance();
    };
    function RenderPassCommand_init_$Init$($this) {
        GroupCommand.call($this);
        RenderPassCommand.call($this);
        return $this;
    }
    function RenderPassCommandConstructor() {
        return RenderPassCommand_init_$Init$(objectCreate(protoOf(RenderPassCommand)));
    }
    function RenderPassCommand_init_$Init$_0(enabled, commands, $this) {
        GroupCommand_init_$Init$(enabled, commands.slice(), $this);
        RenderPassCommand.call($this);
        return $this;
    }
    function RenderPassCommandArr(enabled, commands) {
        return RenderPassCommand_init_$Init$_0(enabled, commands, objectCreate(protoOf(RenderPassCommand)));
    }
    protoOf(RenderPassCommand).aa = function () {
        return this.eg_1;
    };
    function RenderPassCommand() {
        this.eg_1 = CommandType_RENDER_PASS_getInstance();
    }
    function VignetteCommand() {
        Command.call(this);
        this.fg_1 = CommandType_VIGNETTE_getInstance();
        this.color0 = new Vec4(0.0, 0.0, 0.0, 1.0);
        this.color1 = new Vec4(0.0, 0.0, 0.0, 1.0);
    }
    protoOf(VignetteCommand).aa = function () {
        return this.fg_1;
    };
    protoOf(VignetteCommand).gg = function (_set____db54di) {
        this.color0 = _set____db54di;
    };
    protoOf(VignetteCommand).hg = function () {
        return this.color0;
    };
    protoOf(VignetteCommand).ig = function (_set____db54di) {
        this.color1 = _set____db54di;
    };
    protoOf(VignetteCommand).jg = function () {
        return this.color1;
    };
    var ColorMode_Normal_instance;
    var ColorMode_Grayscale_instance;
    var ColorMode_Sepia_instance;
    var ColorMode_HighContrast_instance;
    var ColorMode_LowContrast_instance;
    var ColorMode_BlackAndWhite_instance;
    var ColorMode_IsolatedColor_instance;
    var ColorMode_Crosshatch_instance;
    var ColorMode_LimitedColors_instance;
    function values_15() {
        return [ColorMode_Normal_getInstance(), ColorMode_Grayscale_getInstance(), ColorMode_Sepia_getInstance(), ColorMode_HighContrast_getInstance(), ColorMode_LowContrast_getInstance(), ColorMode_BlackAndWhite_getInstance(), ColorMode_IsolatedColor_getInstance(), ColorMode_Crosshatch_getInstance(), ColorMode_LimitedColors_getInstance()];
    }
    function valueOf_15(value) {
        switch (value) {
            case 'Normal':
                return ColorMode_Normal_getInstance();
            case 'Grayscale':
                return ColorMode_Grayscale_getInstance();
            case 'Sepia':
                return ColorMode_Sepia_getInstance();
            case 'HighContrast':
                return ColorMode_HighContrast_getInstance();
            case 'LowContrast':
                return ColorMode_LowContrast_getInstance();
            case 'BlackAndWhite':
                return ColorMode_BlackAndWhite_getInstance();
            case 'IsolatedColor':
                return ColorMode_IsolatedColor_getInstance();
            case 'Crosshatch':
                return ColorMode_Crosshatch_getInstance();
            case 'LimitedColors':
                return ColorMode_LimitedColors_getInstance();
            default:
                ColorMode_initEntries();
                THROW_IAE('No enum constant value.');
                break;
        }
    }
    var ColorMode_entriesInitialized;
    function ColorMode_initEntries() {
        if (ColorMode_entriesInitialized)
            return Unit_instance;
        ColorMode_entriesInitialized = true;
        ColorMode_Normal_instance = new ColorMode('Normal', 0);
        ColorMode_Grayscale_instance = new ColorMode('Grayscale', 1);
        ColorMode_Sepia_instance = new ColorMode('Sepia', 2);
        ColorMode_HighContrast_instance = new ColorMode('HighContrast', 3);
        ColorMode_LowContrast_instance = new ColorMode('LowContrast', 4);
        ColorMode_BlackAndWhite_instance = new ColorMode('BlackAndWhite', 5);
        ColorMode_IsolatedColor_instance = new ColorMode('IsolatedColor', 6);
        ColorMode_Crosshatch_instance = new ColorMode('Crosshatch', 7);
        ColorMode_LimitedColors_instance = new ColorMode('LimitedColors', 8);
    }
    function ColorMode(name, ordinal) {
        Enum.call(this, name, ordinal);
    }
    function ColorMode_Normal_getInstance() {
        ColorMode_initEntries();
        return ColorMode_Normal_instance;
    }
    function ColorMode_Grayscale_getInstance() {
        ColorMode_initEntries();
        return ColorMode_Grayscale_instance;
    }
    function ColorMode_Sepia_getInstance() {
        ColorMode_initEntries();
        return ColorMode_Sepia_instance;
    }
    function ColorMode_HighContrast_getInstance() {
        ColorMode_initEntries();
        return ColorMode_HighContrast_instance;
    }
    function ColorMode_LowContrast_getInstance() {
        ColorMode_initEntries();
        return ColorMode_LowContrast_instance;
    }
    function ColorMode_BlackAndWhite_getInstance() {
        ColorMode_initEntries();
        return ColorMode_BlackAndWhite_instance;
    }
    function ColorMode_IsolatedColor_getInstance() {
        ColorMode_initEntries();
        return ColorMode_IsolatedColor_instance;
    }
    function ColorMode_Crosshatch_getInstance() {
        ColorMode_initEntries();
        return ColorMode_Crosshatch_instance;
    }
    function ColorMode_LimitedColors_getInstance() {
        ColorMode_initEntries();
        return ColorMode_LimitedColors_instance;
    }
    function MathUtils() {
    }
    protoOf(MathUtils).mg = function (i, low, high) {
        // Inline function 'kotlin.math.max' call
        // Inline function 'kotlin.math.min' call
        var a = Math.min(i, high);
        return Math.max(a, low);
    };
    protoOf(MathUtils).xc = function (edge0, edge1, x) {
        var t = this.mg((x - edge0) / (edge1 - edge0), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    };
    protoOf(MathUtils).ng = function (edge0, edge1, x) {
        var x_0 = x;
        x_0 = this.mg((x_0 - edge0) / (edge1 - edge0), 0.0, 1.0);
        return x_0 * x_0 * x_0 * (x_0 * (x_0 * 6 - 15) + 10);
    };
    protoOf(MathUtils).rc = function (length, current) {
        return ((current + 1 | 0) + numberToInt(Default_getInstance().q5() * (length - 2 | 0)) | 0) % length | 0;
    };
    protoOf(MathUtils).og = function (rad) {
        return rad * 57.29578;
    };
    var MathUtils_instance;
    function MathUtils_getInstance() {
        return MathUtils_instance;
    }
    function Matrix() {
        Matrix_instance = this;
        this.k7_1 = new Float32Array(32);
        this.l7_1 = new Float32Array(16);
        this.m7_1 = new Float32Array(16);
        this.n7_1 = new Float32Array(16);
        this.o7_1 = new Float32Array(4);
        this.p7_1 = new Float32Array(16);
        this.q7_1 = new Float32Array(4);
    }
    protoOf(Matrix).k9 = function (result, resultOffset, lhs, lhsOffset, rhs, rhsOffset) {
        this.pg(result, resultOffset, this.l7_1, 0, 16);
        this.pg(lhs, lhsOffset, this.m7_1, 0, 16);
        this.pg(rhs, rhsOffset, this.n7_1, 0, 16);
        this.qg(this.l7_1, this.m7_1, this.n7_1);
        this.pg(this.l7_1, 0, result, resultOffset, 16);
    };
    protoOf(Matrix).pg = function (src, srcPos, dest, destPos, length) {
        // Inline function 'kotlin.collections.copyInto' call
        var endIndex = srcPos + length | 0;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var tmp = src;
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        arrayCopy(tmp, dest, destPos, srcPos, endIndex);
    };
    protoOf(Matrix).rg = function (_i, _j) {
        return _j + imul(4, _i) | 0;
    };
    protoOf(Matrix).qg = function (r, lhs, rhs) {
        var inductionVariable = 0;
        if (inductionVariable <= 3)
            do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                var rhs_i0 = rhs[this.rg(i, 0)];
                var ri0 = lhs[0] * rhs_i0;
                var ri1 = lhs[1] * rhs_i0;
                var ri2 = lhs[2] * rhs_i0;
                var ri3 = lhs[3] * rhs_i0;
                var inductionVariable_0 = 1;
                if (inductionVariable_0 <= 3)
                    do {
                        var j = inductionVariable_0;
                        inductionVariable_0 = inductionVariable_0 + 1 | 0;
                        var rhs_ij = rhs[this.rg(i, j)];
                        ri0 = ri0 + lhs[this.rg(j, 0)] * rhs_ij;
                        ri1 = ri1 + lhs[this.rg(j, 1)] * rhs_ij;
                        ri2 = ri2 + lhs[this.rg(j, 2)] * rhs_ij;
                        ri3 = ri3 + lhs[this.rg(j, 3)] * rhs_ij;
                    } while (inductionVariable_0 <= 3);
                r[this.rg(i, 0)] = ri0;
                r[this.rg(i, 1)] = ri1;
                r[this.rg(i, 2)] = ri2;
                r[this.rg(i, 3)] = ri3;
            } while (inductionVariable <= 3);
    };
    protoOf(Matrix).r7 = function (m, offset, left, right, bottom, top, near, far) {
        // Inline function 'kotlin.require' call
        // Inline function 'kotlin.contracts.contract' call
        if (!!(left === right)) {
            // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
            var message = 'left == right';
            throw IllegalArgumentException_init_$Create$(toString(message));
        }
        // Inline function 'kotlin.require' call
        // Inline function 'kotlin.contracts.contract' call
        if (!!(top === bottom)) {
            // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
            var message_0 = 'top == bottom';
            throw IllegalArgumentException_init_$Create$(toString(message_0));
        }
        // Inline function 'kotlin.require' call
        // Inline function 'kotlin.contracts.contract' call
        if (!!(near === far)) {
            // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
            var message_1 = 'near == far';
            throw IllegalArgumentException_init_$Create$(toString(message_1));
        }
        // Inline function 'kotlin.require' call
        // Inline function 'kotlin.contracts.contract' call
        if (!!(near <= 0.0)) {
            // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
            var message_2 = 'near <= 0.0f';
            throw IllegalArgumentException_init_$Create$(toString(message_2));
        }
        // Inline function 'kotlin.require' call
        // Inline function 'kotlin.contracts.contract' call
        if (!!(far <= 0.0)) {
            // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
            var message_3 = 'far <= 0.0f';
            throw IllegalArgumentException_init_$Create$(toString(message_3));
        }
        var r_width = 1.0 / (right - left);
        var r_height = 1.0 / (top - bottom);
        var r_depth = 1.0 / (near - far);
        var x = 2.0 * (near * r_width);
        var y = 2.0 * (near * r_height);
        var A = (right + left) * r_width;
        var B = (top + bottom) * r_height;
        var C = (far + near) * r_depth;
        var D = 2.0 * (far * near * r_depth);
        m[offset + 0 | 0] = x;
        m[offset + 5 | 0] = y;
        m[offset + 8 | 0] = A;
        m[offset + 9 | 0] = B;
        m[offset + 10 | 0] = C;
        m[offset + 14 | 0] = D;
        m[offset + 11 | 0] = -1.0;
        m[offset + 1 | 0] = 0.0;
        m[offset + 2 | 0] = 0.0;
        m[offset + 3 | 0] = 0.0;
        m[offset + 4 | 0] = 0.0;
        m[offset + 6 | 0] = 0.0;
        m[offset + 7 | 0] = 0.0;
        m[offset + 12 | 0] = 0.0;
        m[offset + 13 | 0] = 0.0;
        m[offset + 15 | 0] = 0.0;
    };
    protoOf(Matrix).sg = function (x, y, z) {
        // Inline function 'kotlin.math.sqrt' call
        var x_0 = x * x + y * y + z * z;
        return Math.sqrt(x_0);
    };
    protoOf(Matrix).g9 = function (sm, smOffset) {
        var inductionVariable = 0;
        if (inductionVariable <= 15)
            do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                sm[smOffset + i | 0] = 0.0;
            } while (inductionVariable <= 15);
        var i_0 = 0;
        while (i_0 < 16) {
            sm[smOffset + i_0 | 0] = 1.0;
            i_0 = i_0 + 5 | 0;
        }
    };
    protoOf(Matrix).j9 = function (m, mOffset, x, y, z) {
        var inductionVariable = 0;
        if (inductionVariable <= 3)
            do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                var mi = mOffset + i | 0;
                m[mi] = m[mi] * x;
                var tmp4_index0 = 4 + mi | 0;
                m[tmp4_index0] = m[tmp4_index0] * y;
                var tmp6_index0 = 8 + mi | 0;
                m[tmp6_index0] = m[tmp6_index0] * z;
            } while (inductionVariable <= 3);
    };
    protoOf(Matrix).h9 = function (m, mOffset, x, y, z) {
        var inductionVariable = 0;
        if (inductionVariable <= 3)
            do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                var mi = mOffset + i | 0;
                var tmp2_index0 = 12 + mi | 0;
                m[tmp2_index0] = m[tmp2_index0] + (m[mi] * x + m[4 + mi | 0] * y + m[8 + mi | 0] * z);
            } while (inductionVariable <= 3);
    };
    protoOf(Matrix).i9 = function (m, mOffset, a, x, y, z) {
        this.tg(this.k7_1, 0, a, x, y, z);
        this.k9(this.k7_1, 16, m, mOffset, this.k7_1, 0);
        this.pg(this.k7_1, 16, m, mOffset, 16);
    };
    protoOf(Matrix).tg = function (rm, rmOffset, a, x, y, z) {
        var a_0 = a;
        var x_0 = x;
        var y_0 = y;
        var z_0 = z;
        rm[rmOffset + 3 | 0] = 0.0;
        rm[rmOffset + 7 | 0] = 0.0;
        rm[rmOffset + 11 | 0] = 0.0;
        rm[rmOffset + 12 | 0] = 0.0;
        rm[rmOffset + 13 | 0] = 0.0;
        rm[rmOffset + 14 | 0] = 0.0;
        rm[rmOffset + 15 | 0] = 1.0;
        a_0 = a_0 * (get_PI() / 180.0);
        // Inline function 'kotlin.math.sin' call
        var x_1 = a_0;
        var s = Math.sin(x_1);
        // Inline function 'kotlin.math.cos' call
        var x_2 = a_0;
        var c = Math.cos(x_2);
        if ((1.0 === x_0 ? 0.0 === y_0 : false) ? 0.0 === z_0 : false) {
            rm[rmOffset + 5 | 0] = c;
            rm[rmOffset + 10 | 0] = c;
            rm[rmOffset + 6 | 0] = s;
            rm[rmOffset + 9 | 0] = -s;
            rm[rmOffset + 1 | 0] = 0.0;
            rm[rmOffset + 2 | 0] = 0.0;
            rm[rmOffset + 4 | 0] = 0.0;
            rm[rmOffset + 8 | 0] = 0.0;
            rm[rmOffset + 0 | 0] = 1.0;
        }
        else if ((0.0 === x_0 ? 1.0 === y_0 : false) ? 0.0 === z_0 : false) {
            rm[rmOffset + 0 | 0] = c;
            rm[rmOffset + 10 | 0] = c;
            rm[rmOffset + 8 | 0] = s;
            rm[rmOffset + 2 | 0] = -s;
            rm[rmOffset + 1 | 0] = 0.0;
            rm[rmOffset + 4 | 0] = 0.0;
            rm[rmOffset + 6 | 0] = 0.0;
            rm[rmOffset + 9 | 0] = 0.0;
            rm[rmOffset + 5 | 0] = 1.0;
        }
        else if ((0.0 === x_0 ? 0.0 === y_0 : false) ? 1.0 === z_0 : false) {
            rm[rmOffset + 0 | 0] = c;
            rm[rmOffset + 5 | 0] = c;
            rm[rmOffset + 1 | 0] = s;
            rm[rmOffset + 4 | 0] = -s;
            rm[rmOffset + 2 | 0] = 0.0;
            rm[rmOffset + 6 | 0] = 0.0;
            rm[rmOffset + 8 | 0] = 0.0;
            rm[rmOffset + 9 | 0] = 0.0;
            rm[rmOffset + 10 | 0] = 1.0;
        }
        else {
            var len = this.sg(x_0, y_0, z_0);
            if (!(1.0 === len)) {
                var recipLen = 1.0 / len;
                x_0 = x_0 * recipLen;
                y_0 = y_0 * recipLen;
                z_0 = z_0 * recipLen;
            }
            var nc = 1.0 - c;
            var xy = x_0 * y_0;
            var yz = y_0 * z_0;
            var zx = z_0 * x_0;
            var xs = x_0 * s;
            var ys = y_0 * s;
            var zs = z_0 * s;
            rm[rmOffset + 0 | 0] = x_0 * x_0 * nc + c;
            rm[rmOffset + 4 | 0] = xy * nc - zs;
            rm[rmOffset + 8 | 0] = zx * nc + ys;
            rm[rmOffset + 1 | 0] = xy * nc + zs;
            rm[rmOffset + 5 | 0] = y_0 * y_0 * nc + c;
            rm[rmOffset + 9 | 0] = yz * nc - xs;
            rm[rmOffset + 2 | 0] = zx * nc - ys;
            rm[rmOffset + 6 | 0] = yz * nc + xs;
            rm[rmOffset + 10 | 0] = z_0 * z_0 * nc + c;
        }
    };
    protoOf(Matrix).ug = function (rm, rmOffset, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        var fx = centerX - eyeX;
        var fy = centerY - eyeY;
        var fz = centerZ - eyeZ;
        var rlf = 1.0 / this.sg(fx, fy, fz);
        fx = fx * rlf;
        fy = fy * rlf;
        fz = fz * rlf;
        var sx = fy * upZ - fz * upY;
        var sy = fz * upX - fx * upZ;
        var sz = fx * upY - fy * upX;
        var rls = 1.0 / this.sg(sx, sy, sz);
        sx = sx * rls;
        sy = sy * rls;
        sz = sz * rls;
        var ux = sy * fz - sz * fy;
        var uy = sz * fx - sx * fz;
        var uz = sx * fy - sy * fx;
        rm[rmOffset + 0 | 0] = sx;
        rm[rmOffset + 1 | 0] = ux;
        rm[rmOffset + 2 | 0] = -fx;
        rm[rmOffset + 3 | 0] = 0.0;
        rm[rmOffset + 4 | 0] = sy;
        rm[rmOffset + 5 | 0] = uy;
        rm[rmOffset + 6 | 0] = -fy;
        rm[rmOffset + 7 | 0] = 0.0;
        rm[rmOffset + 8 | 0] = sz;
        rm[rmOffset + 9 | 0] = uz;
        rm[rmOffset + 10 | 0] = -fz;
        rm[rmOffset + 11 | 0] = 0.0;
        rm[rmOffset + 12 | 0] = 0.0;
        rm[rmOffset + 13 | 0] = 0.0;
        rm[rmOffset + 14 | 0] = 0.0;
        rm[rmOffset + 15 | 0] = 1.0;
        this.h9(rm, rmOffset, -eyeX, -eyeY, -eyeZ);
    };
    var Matrix_instance;
    function Matrix_getInstance() {
        if (Matrix_instance == null)
            new Matrix();
        return Matrix_instance;
    }
    function Vec2(_x, _y) {
        _x = _x === VOID ? 0.0 : _x;
        _y = _y === VOID ? 0.0 : _y;
        this.vg_1 = _x;
        this.wg_1 = _y;
    }
    protoOf(Vec2).xg = function (value) {
        this.vg_1 = value;
    };
    protoOf(Vec2).yg = function () {
        return this.vg_1;
    };
    protoOf(Vec2).zg = function (value) {
        this.vg_1 = value;
    };
    protoOf(Vec2).ah = function () {
        return this.vg_1;
    };
    protoOf(Vec2).bh = function (value) {
        this.wg_1 = value;
    };
    protoOf(Vec2).ch = function () {
        return this.wg_1;
    };
    protoOf(Vec2).dh = function (value) {
        this.wg_1 = value;
    };
    protoOf(Vec2).eh = function () {
        return this.wg_1;
    };
    protoOf(Vec2).fh = function (_x, _y) {
        return new Vec2(_x, _y);
    };
    protoOf(Vec2).copy = function (_x, _y, $super) {
        _x = _x === VOID ? this.vg_1 : _x;
        _y = _y === VOID ? this.wg_1 : _y;
        return this.fh(_x, _y);
    };
    protoOf(Vec2).toString = function () {
        return 'Vec2(_x=' + this.vg_1 + ', _y=' + this.wg_1 + ')';
    };
    protoOf(Vec2).hashCode = function () {
        var result = getNumberHashCode(this.vg_1);
        result = imul(result, 31) + getNumberHashCode(this.wg_1) | 0;
        return result;
    };
    protoOf(Vec2).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof Vec2))
            return false;
        var tmp0_other_with_cast = other instanceof Vec2 ? other : THROW_CCE();
        if (!equals(this.vg_1, tmp0_other_with_cast.vg_1))
            return false;
        if (!equals(this.wg_1, tmp0_other_with_cast.wg_1))
            return false;
        return true;
    };
    function Vec3(_x, _y, _z) {
        _x = _x === VOID ? 0.0 : _x;
        _y = _y === VOID ? 0.0 : _y;
        _z = _z === VOID ? 0.0 : _z;
        this.gh_1 = _x;
        this.hh_1 = _y;
        this.ih_1 = _z;
    }
    protoOf(Vec3).xg = function (value) {
        this.gh_1 = value;
    };
    protoOf(Vec3).yg = function () {
        return this.gh_1;
    };
    protoOf(Vec3).zg = function (value) {
        this.gh_1 = value;
    };
    protoOf(Vec3).ah = function () {
        return this.gh_1;
    };
    protoOf(Vec3).bh = function (value) {
        this.hh_1 = value;
    };
    protoOf(Vec3).ch = function () {
        return this.hh_1;
    };
    protoOf(Vec3).dh = function (value) {
        this.hh_1 = value;
    };
    protoOf(Vec3).eh = function () {
        return this.hh_1;
    };
    protoOf(Vec3).jh = function (value) {
        this.ih_1 = value;
    };
    protoOf(Vec3).kh = function () {
        return this.ih_1;
    };
    protoOf(Vec3).lh = function (value) {
        this.ih_1 = value;
    };
    protoOf(Vec3).mh = function () {
        return this.ih_1;
    };
    protoOf(Vec3).nh = function (_x, _y, _z) {
        return new Vec3(_x, _y, _z);
    };
    protoOf(Vec3).copy = function (_x, _y, _z, $super) {
        _x = _x === VOID ? this.gh_1 : _x;
        _y = _y === VOID ? this.hh_1 : _y;
        _z = _z === VOID ? this.ih_1 : _z;
        return this.nh(_x, _y, _z);
    };
    protoOf(Vec3).toString = function () {
        return 'Vec3(_x=' + this.gh_1 + ', _y=' + this.hh_1 + ', _z=' + this.ih_1 + ')';
    };
    protoOf(Vec3).hashCode = function () {
        var result = getNumberHashCode(this.gh_1);
        result = imul(result, 31) + getNumberHashCode(this.hh_1) | 0;
        result = imul(result, 31) + getNumberHashCode(this.ih_1) | 0;
        return result;
    };
    protoOf(Vec3).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof Vec3))
            return false;
        var tmp0_other_with_cast = other instanceof Vec3 ? other : THROW_CCE();
        if (!equals(this.gh_1, tmp0_other_with_cast.gh_1))
            return false;
        if (!equals(this.hh_1, tmp0_other_with_cast.hh_1))
            return false;
        if (!equals(this.ih_1, tmp0_other_with_cast.ih_1))
            return false;
        return true;
    };
    function Vec4(_x, _y, _z, _w) {
        _x = _x === VOID ? 0.0 : _x;
        _y = _y === VOID ? 0.0 : _y;
        _z = _z === VOID ? 0.0 : _z;
        _w = _w === VOID ? 0.0 : _w;
        this.oh_1 = _x;
        this.ph_1 = _y;
        this.qh_1 = _z;
        this.rh_1 = _w;
    }
    protoOf(Vec4).xg = function (value) {
        this.oh_1 = value;
    };
    protoOf(Vec4).yg = function () {
        return this.oh_1;
    };
    protoOf(Vec4).zg = function (value) {
        this.oh_1 = value;
    };
    protoOf(Vec4).ah = function () {
        return this.oh_1;
    };
    protoOf(Vec4).bh = function (value) {
        this.ph_1 = value;
    };
    protoOf(Vec4).ch = function () {
        return this.ph_1;
    };
    protoOf(Vec4).dh = function (value) {
        this.ph_1 = value;
    };
    protoOf(Vec4).eh = function () {
        return this.ph_1;
    };
    protoOf(Vec4).jh = function (value) {
        this.qh_1 = value;
    };
    protoOf(Vec4).kh = function () {
        return this.qh_1;
    };
    protoOf(Vec4).lh = function (value) {
        this.qh_1 = value;
    };
    protoOf(Vec4).mh = function () {
        return this.qh_1;
    };
    protoOf(Vec4).sh = function (value) {
        this.rh_1 = value;
    };
    protoOf(Vec4).th = function () {
        return this.rh_1;
    };
    protoOf(Vec4).uh = function (value) {
        this.rh_1 = value;
    };
    protoOf(Vec4).vh = function () {
        return this.rh_1;
    };
    protoOf(Vec4).wh = function (_x, _y, _z, _w) {
        return new Vec4(_x, _y, _z, _w);
    };
    protoOf(Vec4).copy = function (_x, _y, _z, _w, $super) {
        _x = _x === VOID ? this.oh_1 : _x;
        _y = _y === VOID ? this.ph_1 : _y;
        _z = _z === VOID ? this.qh_1 : _z;
        _w = _w === VOID ? this.rh_1 : _w;
        return this.wh(_x, _y, _z, _w);
    };
    protoOf(Vec4).toString = function () {
        return 'Vec4(_x=' + this.oh_1 + ', _y=' + this.ph_1 + ', _z=' + this.qh_1 + ', _w=' + this.rh_1 + ')';
    };
    protoOf(Vec4).hashCode = function () {
        var result = getNumberHashCode(this.oh_1);
        result = imul(result, 31) + getNumberHashCode(this.ph_1) | 0;
        result = imul(result, 31) + getNumberHashCode(this.qh_1) | 0;
        result = imul(result, 31) + getNumberHashCode(this.rh_1) | 0;
        return result;
    };
    protoOf(Vec4).equals = function (other) {
        if (this === other)
            return true;
        if (!(other instanceof Vec4))
            return false;
        var tmp0_other_with_cast = other instanceof Vec4 ? other : THROW_CCE();
        if (!equals(this.oh_1, tmp0_other_with_cast.oh_1))
            return false;
        if (!equals(this.ph_1, tmp0_other_with_cast.ph_1))
            return false;
        if (!equals(this.qh_1, tmp0_other_with_cast.qh_1))
            return false;
        if (!equals(this.rh_1, tmp0_other_with_cast.rh_1))
            return false;
        return true;
    };
    function TimerParams(timer, period, rotating) {
        this.xh_1 = timer;
        this.yh_1 = period;
        this.zh_1 = rotating;
    }
    function TimersMap() {
        var tmp = this;
        // Inline function 'kotlin.collections.mutableMapOf' call
        tmp.ai_1 = LinkedHashMap_init_$Create$();
        this.bi_1 = 0.0;
    }
    protoOf(TimersMap).ci = function (key, period) {
        this.ai_1.c1(key, new TimerParams(0.0, period, true));
    };
    protoOf(TimersMap).di = function (key, period, rotating) {
        this.ai_1.c1(key, new TimerParams(0.0, period, rotating));
    };
    protoOf(TimersMap).ei = function (index) {
        var tmp0_elvis_lhs = this.ai_1.i1(index);
        var tmp;
        if (tmp0_elvis_lhs == null) {
            throw Exception_init_$Create$('Timer not found');
        }
        else {
            tmp = tmp0_elvis_lhs;
        }
        var timer = tmp;
        return timer.xh_1;
    };
    protoOf(TimersMap).fi = function (index, value) {
        var tmp0_elvis_lhs = this.ai_1.i1(index);
        var tmp;
        if (tmp0_elvis_lhs == null) {
            throw Exception_init_$Create$('Timer not found');
        }
        else {
            tmp = tmp0_elvis_lhs;
        }
        var timer = tmp;
        timer.xh_1 = value;
    };
    protoOf(TimersMap).gi = function (index) {
        var tmp0_elvis_lhs = this.ai_1.i1(index);
        var tmp;
        if (tmp0_elvis_lhs == null) {
            throw Exception_init_$Create$('Timer not found');
        }
        else {
            tmp = tmp0_elvis_lhs;
        }
        var timer = tmp;
        return timer;
    };
    protoOf(TimersMap).hi = function (timeNow) {
        // Inline function 'kotlin.collections.iterator' call
        var tmp0_iterator = this.ai_1.b1().h();
        while (tmp0_iterator.o()) {
            var timer = tmp0_iterator.p();
            var delta = (timeNow - this.bi_1) / timer.yh_1;
            timer.xh_1 = timer.xh_1 + delta;
            if (timer.zh_1) {
                timer.xh_1 = timer.xh_1 % 1.0;
            }
            else {
                if (timer.xh_1 > 1.0) {
                    timer.xh_1 = 1.0;
                }
            }
        }
        this.bi_1 = timeNow;
    };
    //region block: post-declaration
    defineProp(protoOf(BackendMode), 'name', protoOf(BackendMode).c4);
    defineProp(protoOf(BackendMode), 'ordinal', protoOf(BackendMode).d4);
    defineProp(protoOf(BlendingEquation), 'name', protoOf(BlendingEquation).c4);
    defineProp(protoOf(BlendingEquation), 'ordinal', protoOf(BlendingEquation).d4);
    defineProp(protoOf(BlendingFactor), 'name', protoOf(BlendingFactor).c4);
    defineProp(protoOf(BlendingFactor), 'ordinal', protoOf(BlendingFactor).d4);
    defineProp(protoOf(CullFace), 'name', protoOf(CullFace).c4);
    defineProp(protoOf(CullFace), 'ordinal', protoOf(CullFace).d4);
    defineProp(protoOf(Scene), 'loaded', protoOf(Scene).h7, protoOf(Scene).g7);
    defineProp(protoOf(Scene), 'commands', function () {
        return this.y8();
    }, function (value) {
        this.x8(value);
    });
    defineProp(protoOf(Scene), 'meshes', function () {
        return this.a9();
    }, function (value) {
        this.z8(value);
    });
    defineProp(protoOf(Scene), 'textures', function () {
        return this.c9();
    }, function (value) {
        this.b9(value);
    });
    defineProp(protoOf(Scene), 'shaders', function () {
        return this.e9();
    }, function (value) {
        this.d9(value);
    });
    defineProp(protoOf(TextureFiltering), 'name', protoOf(TextureFiltering).c4);
    defineProp(protoOf(TextureFiltering), 'ordinal', protoOf(TextureFiltering).d4);
    defineProp(protoOf(TextureWrapping), 'name', protoOf(TextureWrapping).c4);
    defineProp(protoOf(TextureWrapping), 'ordinal', protoOf(TextureWrapping).d4);
    defineProp(protoOf(TextureFormat), 'name', protoOf(TextureFormat).c4);
    defineProp(protoOf(TextureFormat), 'ordinal', protoOf(TextureFormat).d4);
    defineProp(protoOf(TextureType), 'name', protoOf(TextureType).c4);
    defineProp(protoOf(TextureType), 'ordinal', protoOf(TextureType).d4);
    defineProp(protoOf(VertexFormat), 'name', protoOf(VertexFormat).c4);
    defineProp(protoOf(VertexFormat), 'ordinal', protoOf(VertexFormat).d4);
    defineProp(protoOf(AttributeType), 'name', protoOf(AttributeType).c4);
    defineProp(protoOf(AttributeType), 'ordinal', protoOf(AttributeType).d4);
    defineProp(protoOf(CameraPathAnimator), 'minDurationCoefficient', protoOf(CameraPathAnimator).lc, protoOf(CameraPathAnimator).kc);
    defineProp(protoOf(CameraPathAnimator), 'positionInterpolator', protoOf(CameraPathAnimator).mc);
    defineProp(protoOf(CameraPathAnimator), 'timer', protoOf(CameraPathAnimator).nc);
    defineProp(protoOf(CameraPathAnimator), 'state', protoOf(CameraPathAnimator).oc);
    defineProp(protoOf(CameraPathAnimator), 'currentCameraPair', protoOf(CameraPathAnimator).qc);
    defineProp(protoOf(CameraPositionInterpolator), 'cameraPosition', protoOf(CameraPositionInterpolator).ed);
    defineProp(protoOf(CameraPositionInterpolator), 'cameraRotation', protoOf(CameraPositionInterpolator).fd);
    defineProp(protoOf(CameraState), 'name', protoOf(CameraState).c4);
    defineProp(protoOf(CameraState), 'ordinal', protoOf(CameraState).d4);
    defineProp(protoOf(BlurSize), 'name', protoOf(BlurSize).c4);
    defineProp(protoOf(BlurSize), 'ordinal', protoOf(BlurSize).d4);
    defineProp(protoOf(Command), 'type', function () {
        return this.aa();
    });
    defineProp(protoOf(ClearCommandClearType), 'name', protoOf(ClearCommandClearType).c4);
    defineProp(protoOf(ClearCommandClearType), 'ordinal', protoOf(ClearCommandClearType).d4);
    defineProp(protoOf(CommandType), 'name', protoOf(CommandType).c4);
    defineProp(protoOf(CommandType), 'ordinal', protoOf(CommandType).d4);
    defineProp(protoOf(PrimitiveType), 'name', protoOf(PrimitiveType).c4);
    defineProp(protoOf(PrimitiveType), 'ordinal', protoOf(PrimitiveType).d4);
    defineProp(protoOf(ShadingRate), 'name', protoOf(ShadingRate).c4);
    defineProp(protoOf(ShadingRate), 'ordinal', protoOf(ShadingRate).d4);
    defineProp(protoOf(ColorMode), 'name', protoOf(ColorMode).c4);
    defineProp(protoOf(ColorMode), 'ordinal', protoOf(ColorMode).d4);
    defineProp(protoOf(Vec2), 'x', protoOf(Vec2).yg, protoOf(Vec2).xg);
    defineProp(protoOf(Vec2), 'r', protoOf(Vec2).ah, protoOf(Vec2).zg);
    defineProp(protoOf(Vec2), 'y', protoOf(Vec2).ch, protoOf(Vec2).bh);
    defineProp(protoOf(Vec2), 'g', protoOf(Vec2).eh, protoOf(Vec2).dh);
    defineProp(protoOf(Vec3), 'x', protoOf(Vec3).yg, protoOf(Vec3).xg);
    defineProp(protoOf(Vec3), 'r', protoOf(Vec3).ah, protoOf(Vec3).zg);
    defineProp(protoOf(Vec3), 'y', protoOf(Vec3).ch, protoOf(Vec3).bh);
    defineProp(protoOf(Vec3), 'g', protoOf(Vec3).eh, protoOf(Vec3).dh);
    defineProp(protoOf(Vec3), 'z', protoOf(Vec3).kh, protoOf(Vec3).jh);
    defineProp(protoOf(Vec3), 'b', protoOf(Vec3).mh, protoOf(Vec3).lh);
    defineProp(protoOf(Vec4), 'x', protoOf(Vec4).yg, protoOf(Vec4).xg);
    defineProp(protoOf(Vec4), 'r', protoOf(Vec4).ah, protoOf(Vec4).zg);
    defineProp(protoOf(Vec4), 'y', protoOf(Vec4).ch, protoOf(Vec4).bh);
    defineProp(protoOf(Vec4), 'g', protoOf(Vec4).eh, protoOf(Vec4).dh);
    defineProp(protoOf(Vec4), 'z', protoOf(Vec4).kh, protoOf(Vec4).jh);
    defineProp(protoOf(Vec4), 'b', protoOf(Vec4).mh, protoOf(Vec4).lh);
    defineProp(protoOf(Vec4), 'w', protoOf(Vec4).th, protoOf(Vec4).sh);
    defineProp(protoOf(Vec4), 'a', protoOf(Vec4).vh, protoOf(Vec4).uh);
    //endregion
    //region block: init
    Companion_instance = new Companion();
    MathUtils_instance = new MathUtils();
    //endregion
    //region block: exports
    function $jsExportAll$(_) {
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.BackendMode = BackendMode;
        $org$androidworks$engine.BackendMode.values = values;
        $org$androidworks$engine.BackendMode.valueOf = valueOf;
        defineProp($org$androidworks$engine.BackendMode, 'OPENGL', BackendMode_OPENGL_getInstance);
        defineProp($org$androidworks$engine.BackendMode, 'METAL', BackendMode_METAL_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.BlendingEquation = BlendingEquation;
        $org$androidworks$engine.BlendingEquation.values = values_0;
        $org$androidworks$engine.BlendingEquation.valueOf = valueOf_0;
        defineProp($org$androidworks$engine.BlendingEquation, 'ADD', BlendingEquation_ADD_getInstance);
        defineProp($org$androidworks$engine.BlendingEquation, 'SUBTRACT', BlendingEquation_SUBTRACT_getInstance);
        defineProp($org$androidworks$engine.BlendingEquation, 'REVERSE_SUBTRACT', BlendingEquation_REVERSE_SUBTRACT_getInstance);
        $org$androidworks$engine.BlendingFactor = BlendingFactor;
        $org$androidworks$engine.BlendingFactor.values = values_1;
        $org$androidworks$engine.BlendingFactor.valueOf = valueOf_1;
        defineProp($org$androidworks$engine.BlendingFactor, 'ZERO', BlendingFactor_ZERO_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE', BlendingFactor_ONE_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'SRC_COLOR', BlendingFactor_SRC_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_SRC_COLOR', BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'DST_COLOR', BlendingFactor_DST_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_DST_COLOR', BlendingFactor_ONE_MINUS_DST_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'SRC_ALPHA', BlendingFactor_SRC_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_SRC_ALPHA', BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'DST_ALPHA', BlendingFactor_DST_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_DST_ALPHA', BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'CONSTANT_COLOR', BlendingFactor_CONSTANT_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_CONSTANT_COLOR', BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'CONSTANT_ALPHA', BlendingFactor_CONSTANT_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_CONSTANT_ALPHA', BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance);
        defineProp($org$androidworks$engine.BlendingFactor, 'SRC_ALPHA_SATURATE', BlendingFactor_SRC_ALPHA_SATURATE_getInstance);
        $org$androidworks$engine.Blending = Blending;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.CullFace = CullFace;
        $org$androidworks$engine.CullFace.values = values_2;
        $org$androidworks$engine.CullFace.valueOf = valueOf_2;
        defineProp($org$androidworks$engine.CullFace, 'FRONT', CullFace_FRONT_getInstance);
        defineProp($org$androidworks$engine.CullFace, 'BACK', CullFace_BACK_getInstance);
        defineProp($org$androidworks$engine.CullFace, 'FRONT_AND_BACK', CullFace_FRONT_AND_BACK_getInstance);
        defineProp($org$androidworks$engine.CullFace, 'DISABLED', CullFace_DISABLED_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.DepthMode = DepthMode;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.Mesh = Mesh;
        $org$androidworks$engine.Mesh.MeshConstructor1 = MeshConstructor1;
        $org$androidworks$engine.Mesh.MeshConstructor2 = MeshConstructor2;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.Scene = Scene;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.Shader = Shader;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.TextureFiltering = TextureFiltering;
        $org$androidworks$engine.TextureFiltering.values = values_3;
        $org$androidworks$engine.TextureFiltering.valueOf = valueOf_3;
        defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST', TextureFiltering_NEAREST_getInstance);
        defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR', TextureFiltering_LINEAR_getInstance);
        defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST_MIPMAP_NEAREST', TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance);
        defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR_MIPMAP_NEAREST', TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance);
        defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST_MIPMAP_LINEAR', TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance);
        defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR_MIPMAP_LINEAR', TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance);
        $org$androidworks$engine.TextureWrapping = TextureWrapping;
        $org$androidworks$engine.TextureWrapping.values = values_4;
        $org$androidworks$engine.TextureWrapping.valueOf = valueOf_4;
        defineProp($org$androidworks$engine.TextureWrapping, 'CLAMP_TO_EDGE', TextureWrapping_CLAMP_TO_EDGE_getInstance);
        defineProp($org$androidworks$engine.TextureWrapping, 'MIRRORED_REPEAT', TextureWrapping_MIRRORED_REPEAT_getInstance);
        defineProp($org$androidworks$engine.TextureWrapping, 'REPEAT', TextureWrapping_REPEAT_getInstance);
        $org$androidworks$engine.TextureFormat = TextureFormat;
        $org$androidworks$engine.TextureFormat.values = values_5;
        $org$androidworks$engine.TextureFormat.valueOf = valueOf_5;
        defineProp($org$androidworks$engine.TextureFormat, 'RGBA8', TextureFormat_RGBA8_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'RGB8', TextureFormat_RGB8_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'RGB16F', TextureFormat_RGB16F_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'RGB32F', TextureFormat_RGB32F_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'RGBA16F', TextureFormat_RGBA16F_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'RGBA32F', TextureFormat_RGBA32F_getInstance);
        defineProp($org$androidworks$engine.TextureFormat, 'ASTC', TextureFormat_ASTC_getInstance);
        $org$androidworks$engine.TextureType = TextureType;
        $org$androidworks$engine.TextureType.values = values_6;
        $org$androidworks$engine.TextureType.valueOf = valueOf_6;
        defineProp($org$androidworks$engine.TextureType, 'TEX_1D', TextureType_TEX_1D_getInstance);
        defineProp($org$androidworks$engine.TextureType, 'TEX_2D', TextureType_TEX_2D_getInstance);
        defineProp($org$androidworks$engine.TextureType, 'TEX_3D', TextureType_TEX_3D_getInstance);
        defineProp($org$androidworks$engine.TextureType, 'CUBEMAP', TextureType_CUBEMAP_getInstance);
        $org$androidworks$engine.Texture = Texture;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.UniformValue = UniformValue;
        $org$androidworks$engine.UniformFloatValue = UniformFloatValue;
        $org$androidworks$engine.UniformFloatValue.UniformFloatValueWithArray = UniformFloatValueWithArray;
        $org$androidworks$engine.UniformIntValue = UniformIntValue;
        $org$androidworks$engine.UniformIntValue.UniformIntValueWithArray = UniformIntValueWithArray;
        $org$androidworks$engine.UniformTextureValue = UniformTextureValue;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        $org$androidworks$engine.VertexFormat = VertexFormat;
        $org$androidworks$engine.VertexFormat.values = values_7;
        $org$androidworks$engine.VertexFormat.valueOf = valueOf_7;
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE', VertexFormat_UBYTE_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE2', VertexFormat_UBYTE2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE3', VertexFormat_UBYTE3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE4', VertexFormat_UBYTE4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE', VertexFormat_BYTE_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE2', VertexFormat_BYTE2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE3', VertexFormat_BYTE3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE4', VertexFormat_BYTE4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE_NORMALIZED', VertexFormat_UBYTE_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE2_NORMALIZED', VertexFormat_UBYTE2_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE3_NORMALIZED', VertexFormat_UBYTE3_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UBYTE4_NORMALIZED', VertexFormat_UBYTE4_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE_NORMALIZED', VertexFormat_BYTE_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE2_NORMALIZED', VertexFormat_BYTE2_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE3_NORMALIZED', VertexFormat_BYTE3_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'BYTE4_NORMALIZED', VertexFormat_BYTE4_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT', VertexFormat_USHORT_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT2', VertexFormat_USHORT2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT3', VertexFormat_USHORT3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT4', VertexFormat_USHORT4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT', VertexFormat_SHORT_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT2', VertexFormat_SHORT2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT3', VertexFormat_SHORT3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT4', VertexFormat_SHORT4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT_NORMALIZED', VertexFormat_USHORT_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT2_NORMALIZED', VertexFormat_USHORT2_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT3_NORMALIZED', VertexFormat_USHORT3_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'USHORT4_NORMALIZED', VertexFormat_USHORT4_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT_NORMALIZED', VertexFormat_SHORT_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT2_NORMALIZED', VertexFormat_SHORT2_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT3_NORMALIZED', VertexFormat_SHORT3_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'SHORT4_NORMALIZED', VertexFormat_SHORT4_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'HALF', VertexFormat_HALF_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'HALF2', VertexFormat_HALF2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'HALF3', VertexFormat_HALF3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'HALF4', VertexFormat_HALF4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'FLOAT', VertexFormat_FLOAT_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'FLOAT2', VertexFormat_FLOAT2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'FLOAT3', VertexFormat_FLOAT3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'FLOAT4', VertexFormat_FLOAT4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UINT', VertexFormat_UINT_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UINT2', VertexFormat_UINT2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UINT3', VertexFormat_UINT3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UINT4', VertexFormat_UINT4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'INT', VertexFormat_INT_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'INT2', VertexFormat_INT2_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'INT3', VertexFormat_INT3_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'INT4', VertexFormat_INT4_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'INT_1010102_NORMALIZED', VertexFormat_INT_1010102_NORMALIZED_getInstance);
        defineProp($org$androidworks$engine.VertexFormat, 'UINT_1010102_NORMALIZED', VertexFormat_UINT_1010102_NORMALIZED_getInstance);
        $org$androidworks$engine.VertexAttribute = VertexAttribute;
        $org$androidworks$engine.VertexAttributesDescriptor = VertexAttributesDescriptor;
        $org$androidworks$engine.AttributeType = AttributeType;
        $org$androidworks$engine.AttributeType.values = values_8;
        $org$androidworks$engine.AttributeType.valueOf = valueOf_8;
        defineProp($org$androidworks$engine.AttributeType, 'VERTEX', AttributeType_VERTEX_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'NORMAL', AttributeType_NORMAL_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'COLOR', AttributeType_COLOR_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'UV0', AttributeType_UV0_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'UV1', AttributeType_UV1_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'UV2', AttributeType_UV2_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'AO', AttributeType_AO_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'CUSTOM0', AttributeType_CUSTOM0_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'CUSTOM1', AttributeType_CUSTOM1_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'CUSTOM2', AttributeType_CUSTOM2_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'CUSTOM3', AttributeType_CUSTOM3_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'U0', AttributeType_U0_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'V0', AttributeType_V0_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'U1', AttributeType_U1_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'V1', AttributeType_V1_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'U2', AttributeType_U2_getInstance);
        defineProp($org$androidworks$engine.AttributeType, 'V2', AttributeType_V2_getInstance);
        $org$androidworks$engine.MeshAttribute = MeshAttribute;
        $org$androidworks$engine.MeshAttributes = MeshAttributes;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
        $org$androidworks$engine$camera.CameraPathAnimator = CameraPathAnimator;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
        $org$androidworks$engine$camera.CameraPositionInterpolator = CameraPositionInterpolator;
        defineProp($org$androidworks$engine$camera.CameraPositionInterpolator, 'Companion', Companion_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
        $org$androidworks$engine$camera.CameraState = CameraState;
        $org$androidworks$engine$camera.CameraState.values = values_9;
        $org$androidworks$engine$camera.CameraState.valueOf = valueOf_9;
        defineProp($org$androidworks$engine$camera.CameraState, 'ANIMATING', CameraState_ANIMATING_getInstance);
        defineProp($org$androidworks$engine$camera.CameraState, 'TRANSITIONING', CameraState_TRANSITIONING_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.BlurSize = BlurSize;
        $org$androidworks$engine$commands.BlurSize.values = values_10;
        $org$androidworks$engine$commands.BlurSize.valueOf = valueOf_10;
        defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_5', BlurSize_KERNEL_5_getInstance);
        defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_4', BlurSize_KERNEL_4_getInstance);
        defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_3', BlurSize_KERNEL_3_getInstance);
        defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_2', BlurSize_KERNEL_2_getInstance);
        $org$androidworks$engine$commands.BlurredPassCommand = BlurredPassCommand;
        $org$androidworks$engine$commands.DrawBlurredCommand = DrawBlurredCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.ClearColorCommand = ClearColorCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.ClearCommandClearType = ClearCommandClearType;
        $org$androidworks$engine$commands.ClearCommandClearType.values = values_11;
        $org$androidworks$engine$commands.ClearCommandClearType.valueOf = valueOf_11;
        defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'COLOR', ClearCommandClearType_COLOR_getInstance);
        defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'DEPTH', ClearCommandClearType_DEPTH_getInstance);
        defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'COLOR_AND_DEPTH', ClearCommandClearType_COLOR_AND_DEPTH_getInstance);
        $org$androidworks$engine$commands.ClearCommand = ClearCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.Command = Command;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.CommandType = CommandType;
        $org$androidworks$engine$commands.CommandType.values = values_12;
        $org$androidworks$engine$commands.CommandType.valueOf = valueOf_12;
        defineProp($org$androidworks$engine$commands.CommandType, 'NOOP', CommandType_NOOP_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'GROUP', CommandType_GROUP_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'CLEAR_COLOR', CommandType_CLEAR_COLOR_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'CLEAR', CommandType_CLEAR_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'VIGNETTE', CommandType_VIGNETTE_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'DRAW_MESH', CommandType_DRAW_MESH_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'BLURRED_PASS', CommandType_BLURRED_PASS_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'DRAW_BLURRED', CommandType_DRAW_BLURRED_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'RENDER_PASS', CommandType_RENDER_PASS_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'MAIN_PASS', CommandType_MAIN_PASS_getInstance);
        defineProp($org$androidworks$engine$commands.CommandType, 'CUSTOM', CommandType_CUSTOM_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.DrawMeshState = DrawMeshState;
        $org$androidworks$engine$commands.PrimitiveType = PrimitiveType;
        $org$androidworks$engine$commands.PrimitiveType.values = values_13;
        $org$androidworks$engine$commands.PrimitiveType.valueOf = valueOf_13;
        defineProp($org$androidworks$engine$commands.PrimitiveType, 'TRIANGLES', PrimitiveType_TRIANGLES_getInstance);
        defineProp($org$androidworks$engine$commands.PrimitiveType, 'TRIANGLE_STRIP', PrimitiveType_TRIANGLE_STRIP_getInstance);
        defineProp($org$androidworks$engine$commands.PrimitiveType, 'POINTS', PrimitiveType_POINTS_getInstance);
        $org$androidworks$engine$commands.DrawMeshCommand = DrawMeshCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.DrawTransformedMeshCommand = DrawTransformedMeshCommand;
        $org$androidworks$engine$commands.DrawStaticMeshCommand = DrawStaticMeshCommand;
        $org$androidworks$engine$commands.DrawStaticMeshCommand.DrawStaticMeshCommandConstructor = DrawStaticMeshCommandConstructor;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.GroupCommand = GroupCommand;
        $org$androidworks$engine$commands.GroupCommand.GroupCommandArr = GroupCommandArr;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.Hint = Hint;
        $org$androidworks$engine$commands.ShadingRate = ShadingRate;
        $org$androidworks$engine$commands.ShadingRate.values = values_14;
        $org$androidworks$engine$commands.ShadingRate.valueOf = valueOf_14;
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_1X1', ShadingRate_SHADING_RATE_1X1_getInstance);
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_1X2', ShadingRate_SHADING_RATE_1X2_getInstance);
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_2X1', ShadingRate_SHADING_RATE_2X1_getInstance);
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_2X2', ShadingRate_SHADING_RATE_2X2_getInstance);
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_4X2', ShadingRate_SHADING_RATE_4X2_getInstance);
        defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_4X4', ShadingRate_SHADING_RATE_4X4_getInstance);
        $org$androidworks$engine$commands.VrsHint = VrsHint;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.MainPassCommand = MainPassCommand;
        $org$androidworks$engine$commands.MainPassCommand.MainPassCommandConstructor = MainPassCommandConstructor;
        $org$androidworks$engine$commands.MainPassCommand.MainPassCommandArr = MainPassCommandArr;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.NoopCommand = NoopCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.RenderPassCommand = RenderPassCommand;
        $org$androidworks$engine$commands.RenderPassCommand.RenderPassCommandConstructor = RenderPassCommandConstructor;
        $org$androidworks$engine$commands.RenderPassCommand.RenderPassCommandArr = RenderPassCommandArr;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
        $org$androidworks$engine$commands.VignetteCommand = VignetteCommand;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$common = $org$androidworks$engine.common || ($org$androidworks$engine.common = {});
        $org$androidworks$engine$common.ColorMode = ColorMode;
        $org$androidworks$engine$common.ColorMode.values = values_15;
        $org$androidworks$engine$common.ColorMode.valueOf = valueOf_15;
        defineProp($org$androidworks$engine$common.ColorMode, 'Normal', ColorMode_Normal_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'Grayscale', ColorMode_Grayscale_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'Sepia', ColorMode_Sepia_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'HighContrast', ColorMode_HighContrast_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'LowContrast', ColorMode_LowContrast_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'BlackAndWhite', ColorMode_BlackAndWhite_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'IsolatedColor', ColorMode_IsolatedColor_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'Crosshatch', ColorMode_Crosshatch_getInstance);
        defineProp($org$androidworks$engine$common.ColorMode, 'LimitedColors', ColorMode_LimitedColors_getInstance);
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
        $org$androidworks$engine$math.Vec2 = Vec2;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
        $org$androidworks$engine$math.Vec3 = Vec3;
        var $org = _.org || (_.org = {});
        var $org$androidworks = $org.androidworks || ($org.androidworks = {});
        var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
        var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
        $org$androidworks$engine$math.Vec4 = Vec4;
    }
    $jsExportAll$(_);
    _.$jsExportAll$ = $jsExportAll$;
    _.$_$ = _.$_$ || {};
    _.$_$.a = CameraState_TRANSITIONING_getInstance;
    _.$_$.b = BlurSize_KERNEL_3_getInstance;
    _.$_$.c = BlurSize_KERNEL_4_getInstance;
    _.$_$.d = BlurSize_KERNEL_5_getInstance;
    _.$_$.e = ClearCommandClearType_COLOR_AND_DEPTH_getInstance;
    _.$_$.f = CommandType_CUSTOM_getInstance;
    _.$_$.g = PrimitiveType_POINTS_getInstance;
    _.$_$.h = ColorMode_Normal_getInstance;
    _.$_$.i = ColorMode_Sepia_getInstance;
    _.$_$.j = AttributeType_NORMAL_getInstance;
    _.$_$.k = AttributeType_U0_getInstance;
    _.$_$.l = AttributeType_UV0_getInstance;
    _.$_$.m = AttributeType_VERTEX_getInstance;
    _.$_$.n = BlendingEquation_ADD_getInstance;
    _.$_$.o = BlendingFactor_ONE_getInstance;
    _.$_$.p = BlendingFactor_SRC_ALPHA_getInstance;
    _.$_$.q = CullFace_BACK_getInstance;
    _.$_$.r = CullFace_DISABLED_getInstance;
    _.$_$.s = CullFace_FRONT_getInstance;
    _.$_$.t = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance;
    _.$_$.u = TextureFiltering_LINEAR_getInstance;
    _.$_$.v = TextureFiltering_NEAREST_getInstance;
    _.$_$.w = TextureFormat_ASTC_getInstance;
    _.$_$.x = TextureFormat_RGBA16F_getInstance;
    _.$_$.y = TextureFormat_RGBA8_getInstance;
    _.$_$.z = TextureType_CUBEMAP_getInstance;
    _.$_$.a1 = TextureWrapping_CLAMP_TO_EDGE_getInstance;
    _.$_$.b1 = TextureWrapping_REPEAT_getInstance;
    _.$_$.c1 = VertexFormat_BYTE2_NORMALIZED_getInstance;
    _.$_$.d1 = VertexFormat_FLOAT2_getInstance;
    _.$_$.e1 = VertexFormat_FLOAT3_getInstance;
    _.$_$.f1 = VertexFormat_HALF2_getInstance;
    _.$_$.g1 = VertexFormat_HALF3_getInstance;
    _.$_$.h1 = VertexFormat_HALF_getInstance;
    _.$_$.i1 = VertexFormat_UBYTE2_NORMALIZED_getInstance;
    _.$_$.j1 = VertexFormat_UBYTE_NORMALIZED_getInstance;
    _.$_$.k1 = Spline3D_init_$Create$;
    _.$_$.l1 = DrawStaticMeshCommandConstructor;
    _.$_$.m1 = GroupCommandArr;
    _.$_$.n1 = MainPassCommandArr;
    _.$_$.o1 = MeshConstructor1;
    _.$_$.p1 = MeshConstructor2;
    _.$_$.q1 = UniformFloatValueWithArray;
    _.$_$.r1 = UniformIntValueWithArray;
    _.$_$.s1 = MathUtils_instance;
    _.$_$.t1 = Matrix_getInstance;
    _.$_$.u1 = TextureAnimationChunked;
    _.$_$.v1 = CameraPathAnimator;
    _.$_$.w1 = CameraPositionPair;
    _.$_$.x1 = CameraPosition;
    _.$_$.y1 = AffineTranformation;
    _.$_$.z1 = BlurredPassCommand;
    _.$_$.a2 = ClearColorCommand;
    _.$_$.b2 = ClearCommand;
    _.$_$.c2 = Command;
    _.$_$.d2 = DrawBlurredCommand;
    _.$_$.e2 = DrawMeshCommand;
    _.$_$.f2 = DrawMeshState;
    _.$_$.g2 = DrawTransformedMeshCommand;
    _.$_$.h2 = GroupCommand;
    _.$_$.i2 = get_HINT_VRS_2X2;
    _.$_$.j2 = get_HINT_VRS_4X4;
    _.$_$.k2 = get_HINT_VRS_NONE;
    _.$_$.l2 = NoopCommand;
    _.$_$.m2 = VignetteCommand;
    _.$_$.n2 = Vec3;
    _.$_$.o2 = Vec4;
    _.$_$.p2 = TimersMap;
    _.$_$.q2 = get_BLENDING_NONE;
    _.$_$.r2 = Blending;
    _.$_$.s2 = get_DEPTH_NO_WRITE;
    _.$_$.t2 = get_DEPTH_TEST_ENABLED;
    _.$_$.u2 = MeshAttributes;
    _.$_$.v2 = MeshAttribute;
    _.$_$.w2 = Scene;
    _.$_$.x2 = Shader;
    _.$_$.y2 = Texture;
    _.$_$.z2 = UniformFloatValue;
    _.$_$.a3 = UniformTextureValue;
    _.$_$.b3 = VertexAttributesDescriptor;
    _.$_$.c3 = VertexAttribute;
    _.$_$.d3 = setUniform_2;
    _.$_$.e3 = setUniform_3;
    _.$_$.f3 = setUniform_1;
    _.$_$.g3 = setUniform_0;
    _.$_$.h3 = setUniform_4;
    //endregion
    return _;
}));
//# sourceMappingURL=KMP-library-engine.js.map
//# sourceMappingURL=KMP-library-engine.js.map