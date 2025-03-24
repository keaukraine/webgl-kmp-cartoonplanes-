(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib.js', './KMP-library-engine.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib.js'), require('./KMP-library-engine.js'));
  else {
    if (typeof this['kotlin-kotlin-stdlib'] === 'undefined') {
      throw new Error("Error loading module 'org.androidworks.engine:shared'. Its dependency 'kotlin-kotlin-stdlib' was not found. Please, check whether 'kotlin-kotlin-stdlib' is loaded prior to 'org.androidworks.engine:shared'.");
    }
    if (typeof this['KMP-library-engine'] === 'undefined') {
      throw new Error("Error loading module 'org.androidworks.engine:shared'. Its dependency 'KMP-library-engine' was not found. Please, check whether 'KMP-library-engine' is loaded prior to 'org.androidworks.engine:shared'.");
    }
    root['org.androidworks.engine:shared'] = factory(typeof this['org.androidworks.engine:shared'] === 'undefined' ? {} : this['org.androidworks.engine:shared'], this['kotlin-kotlin-stdlib'], this['KMP-library-engine']);
  }
}(this, function (_, kotlin_kotlin, kotlin_org_androidworks_engine_engine) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var protoOf = kotlin_kotlin.$_$.a1;
  var classMeta = kotlin_kotlin.$_$.p;
  var setMetadataFor = kotlin_kotlin.$_$.b1;
  var VOID = kotlin_kotlin.$_$.b;
  var Vec3 = kotlin_org_androidworks_engine_engine.$_$.n2;
  var TextureAnimationChunked = kotlin_org_androidworks_engine_engine.$_$.u1;
  var objectMeta = kotlin_kotlin.$_$.z;
  var CameraPosition = kotlin_org_androidworks_engine_engine.$_$.x1;
  var CameraPositionPair = kotlin_org_androidworks_engine_engine.$_$.w1;
  var getBooleanHashCode = kotlin_kotlin.$_$.t;
  var THROW_CCE = kotlin_kotlin.$_$.f1;
  var Vec4 = kotlin_org_androidworks_engine_engine.$_$.o2;
  var AttributeType_VERTEX_getInstance = kotlin_org_androidworks_engine_engine.$_$.m;
  var VertexFormat_HALF3_getInstance = kotlin_org_androidworks_engine_engine.$_$.g1;
  var MeshAttribute = kotlin_org_androidworks_engine_engine.$_$.v2;
  var AttributeType_U0_getInstance = kotlin_org_androidworks_engine_engine.$_$.k;
  var VertexFormat_HALF_getInstance = kotlin_org_androidworks_engine_engine.$_$.h1;
  var listOf = kotlin_kotlin.$_$.l;
  var MeshAttributes = kotlin_org_androidworks_engine_engine.$_$.u2;
  var VertexFormat_FLOAT3_getInstance = kotlin_org_androidworks_engine_engine.$_$.e1;
  var AttributeType_UV0_getInstance = kotlin_org_androidworks_engine_engine.$_$.l;
  var VertexFormat_HALF2_getInstance = kotlin_org_androidworks_engine_engine.$_$.f1;
  var listOf_0 = kotlin_kotlin.$_$.k;
  var VertexFormat_UBYTE_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.j1;
  var VertexFormat_FLOAT2_getInstance = kotlin_org_androidworks_engine_engine.$_$.d1;
  var MeshConstructor2 = kotlin_org_androidworks_engine_engine.$_$.p1;
  var mutableListOf = kotlin_kotlin.$_$.n;
  var setUniform = kotlin_org_androidworks_engine_engine.$_$.g3;
  var setUniform_0 = kotlin_org_androidworks_engine_engine.$_$.f3;
  var setUniform_1 = kotlin_org_androidworks_engine_engine.$_$.d3;
  var List = kotlin_kotlin.$_$.i;
  var isInterface = kotlin_kotlin.$_$.w;
  var Unit_instance = kotlin_kotlin.$_$.h;
  var setUniform_2 = kotlin_org_androidworks_engine_engine.$_$.e3;
  var ensureNotNull = kotlin_kotlin.$_$.h1;
  var Scene = kotlin_org_androidworks_engine_engine.$_$.w2;
  var TimersMap = kotlin_org_androidworks_engine_engine.$_$.p2;
  var get_HINT_VRS_4X4 = kotlin_org_androidworks_engine_engine.$_$.j2;
  var UniformTextureValue = kotlin_org_androidworks_engine_engine.$_$.a3;
  var CameraPathAnimator = kotlin_org_androidworks_engine_engine.$_$.v1;
  var ClearColorCommand = kotlin_org_androidworks_engine_engine.$_$.a2;
  var get_BLENDING_NONE = kotlin_org_androidworks_engine_engine.$_$.q2;
  var get_DEPTH_TEST_ENABLED = kotlin_org_androidworks_engine_engine.$_$.t2;
  var CullFace_BACK_getInstance = kotlin_org_androidworks_engine_engine.$_$.q;
  var VertexAttribute = kotlin_org_androidworks_engine_engine.$_$.c3;
  var VertexAttributesDescriptor = kotlin_org_androidworks_engine_engine.$_$.b3;
  var DrawMeshState = kotlin_org_androidworks_engine_engine.$_$.f2;
  var AffineTranformation = kotlin_org_androidworks_engine_engine.$_$.y1;
  var UniformFloatValueWithArray = kotlin_org_androidworks_engine_engine.$_$.q1;
  var DrawStaticMeshCommandConstructor = kotlin_org_androidworks_engine_engine.$_$.l1;
  var GroupCommand = kotlin_org_androidworks_engine_engine.$_$.h2;
  var DrawTransformedMeshCommand = kotlin_org_androidworks_engine_engine.$_$.g2;
  var UniformIntValueWithArray = kotlin_org_androidworks_engine_engine.$_$.r1;
  var GroupCommandArr = kotlin_org_androidworks_engine_engine.$_$.m1;
  var ClearCommand = kotlin_org_androidworks_engine_engine.$_$.b2;
  var ClearCommandClearType_COLOR_AND_DEPTH_getInstance = kotlin_org_androidworks_engine_engine.$_$.e;
  var VignetteCommand = kotlin_org_androidworks_engine_engine.$_$.m2;
  var MainPassCommandArr = kotlin_org_androidworks_engine_engine.$_$.n1;
  var BlurredPassCommand = kotlin_org_androidworks_engine_engine.$_$.z1;
  var BlurSize_KERNEL_4_getInstance = kotlin_org_androidworks_engine_engine.$_$.c;
  var DrawBlurredCommand = kotlin_org_androidworks_engine_engine.$_$.d2;
  var Default_getInstance = kotlin_kotlin.$_$.g;
  var Matrix_getInstance = kotlin_org_androidworks_engine_engine.$_$.t1;
  var CameraState_TRANSITIONING_getInstance = kotlin_org_androidworks_engine_engine.$_$.a;
  var Spline3D_init_$Create$ = kotlin_org_androidworks_engine_engine.$_$.k1;
  var THROW_IAE = kotlin_kotlin.$_$.g1;
  var Enum = kotlin_kotlin.$_$.e1;
  var defineProp = kotlin_kotlin.$_$.q;
  var Shader = kotlin_org_androidworks_engine_engine.$_$.x2;
  var Texture = kotlin_org_androidworks_engine_engine.$_$.y2;
  var TextureFormat_RGBA8_getInstance = kotlin_org_androidworks_engine_engine.$_$.y;
  var TextureFiltering_NEAREST_getInstance = kotlin_org_androidworks_engine_engine.$_$.v;
  var TextureWrapping_CLAMP_TO_EDGE_getInstance = kotlin_org_androidworks_engine_engine.$_$.a1;
  var TextureFiltering_LINEAR_getInstance = kotlin_org_androidworks_engine_engine.$_$.u;
  var TextureFormat_ASTC_getInstance = kotlin_org_androidworks_engine_engine.$_$.w;
  var TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance = kotlin_org_androidworks_engine_engine.$_$.t;
  var TextureFormat_RGBA16F_getInstance = kotlin_org_androidworks_engine_engine.$_$.x;
  var Command = kotlin_org_androidworks_engine_engine.$_$.c2;
  var CommandType_CUSTOM_getInstance = kotlin_org_androidworks_engine_engine.$_$.f;
  var get_HINT_VRS_NONE = kotlin_org_androidworks_engine_engine.$_$.k2;
  var ColorMode_Normal_getInstance = kotlin_org_androidworks_engine_engine.$_$.h;
  var MeshConstructor1 = kotlin_org_androidworks_engine_engine.$_$.o1;
  var BlurSize_KERNEL_5_getInstance = kotlin_org_androidworks_engine_engine.$_$.d;
  var Blending = kotlin_org_androidworks_engine_engine.$_$.r2;
  var BlendingEquation_ADD_getInstance = kotlin_org_androidworks_engine_engine.$_$.n;
  var BlendingFactor_ONE_getInstance = kotlin_org_androidworks_engine_engine.$_$.o;
  var BlurSize_KERNEL_3_getInstance = kotlin_org_androidworks_engine_engine.$_$.b;
  var get_HINT_VRS_2X2 = kotlin_org_androidworks_engine_engine.$_$.i2;
  var ColorMode_Sepia_getInstance = kotlin_org_androidworks_engine_engine.$_$.i;
  var AttributeType_NORMAL_getInstance = kotlin_org_androidworks_engine_engine.$_$.j;
  var MathUtils_instance = kotlin_org_androidworks_engine_engine.$_$.s1;
  var CullFace_FRONT_getInstance = kotlin_org_androidworks_engine_engine.$_$.s;
  var BlendingFactor_SRC_ALPHA_getInstance = kotlin_org_androidworks_engine_engine.$_$.p;
  var get_DEPTH_NO_WRITE = kotlin_org_androidworks_engine_engine.$_$.s2;
  var CullFace_DISABLED_getInstance = kotlin_org_androidworks_engine_engine.$_$.r;
  var TextureWrapping_REPEAT_getInstance = kotlin_org_androidworks_engine_engine.$_$.b1;
  var objectCreate = kotlin_kotlin.$_$.y;
  var fillArrayVal = kotlin_kotlin.$_$.s;
  var to = kotlin_kotlin.$_$.i1;
  var mapOf = kotlin_kotlin.$_$.m;
  var NoopCommand = kotlin_org_androidworks_engine_engine.$_$.l2;
  var DrawMeshCommand = kotlin_org_androidworks_engine_engine.$_$.e2;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
  var UniformFloatValue = kotlin_org_androidworks_engine_engine.$_$.z2;
  var get_PI = kotlin_kotlin.$_$.d1;
  var VertexFormat_UBYTE2_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.i1;
  var VertexFormat_BYTE2_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.c1;
  var arrayConcat = kotlin_kotlin.$_$.a;
  var PrimitiveType_POINTS_getInstance = kotlin_org_androidworks_engine_engine.$_$.g;
  var setUniform_3 = kotlin_org_androidworks_engine_engine.$_$.h3;
  var TextureType_CUBEMAP_getInstance = kotlin_org_androidworks_engine_engine.$_$.z;
  //endregion
  //region block: pre-declaration
  setMetadataFor(AnimatedObjectInfoBase, 'AnimatedObjectInfoBase', classMeta, VOID, VOID, AnimatedObjectInfoBase);
  setMetadataFor(AnimatedObjectInfo, 'AnimatedObjectInfo', classMeta, AnimatedObjectInfoBase, VOID, AnimatedObjectInfo);
  setMetadataFor(SplineAnimatedObjectInfo, 'SplineAnimatedObjectInfo', classMeta, AnimatedObjectInfoBase, VOID, SplineAnimatedObjectInfo);
  setMetadataFor(Animations, 'Animations', objectMeta);
  setMetadataFor(Cameras, 'Cameras', objectMeta);
  setMetadataFor(SceneColors, 'SceneColors', classMeta);
  setMetadataFor(Colors, 'Colors', objectMeta);
  setMetadataFor(Meshes, 'Meshes', objectMeta);
  setMetadataFor(Penguins, 'Penguins', objectMeta);
  setMetadataFor(ArcticScene, 'ArcticScene', classMeta, Scene, VOID, ArcticScene);
  setMetadataFor(Seals, 'Seals', objectMeta);
  setMetadataFor(TimeOfDay, 'TimeOfDay', classMeta, Enum);
  setMetadataFor(ArcticSettings, 'ArcticSettings', classMeta, VOID, VOID, ArcticSettings);
  setMetadataFor(Shaders, 'Shaders', objectMeta);
  setMetadataFor(ShipConfig, 'ShipConfig', classMeta);
  setMetadataFor(ShipsConfig, 'ShipsConfig', objectMeta);
  setMetadataFor(Textures, 'Textures', objectMeta);
  setMetadataFor(Companion, 'Companion', objectMeta);
  setMetadataFor(Timers, 'Timers', classMeta, Enum);
  setMetadataFor(Cameras_0, 'Cameras', objectMeta);
  setMetadataFor(DrawClockCommand, 'DrawClockCommand', classMeta, Command, VOID, DrawClockCommand);
  setMetadataFor(BrutalismScene, 'BrutalismScene', classMeta, Scene, VOID, BrutalismScene);
  setMetadataFor(BrutalismSettings, 'BrutalismSettings', classMeta, VOID, VOID, BrutalismSettings);
  setMetadataFor(Meshes_0, 'Meshes', objectMeta);
  setMetadataFor(Props, 'Props', objectMeta);
  setMetadataFor(CartoonPlanesScene, 'CartoonPlanesScene', classMeta, Scene, VOID, CartoonPlanesScene);
  setMetadataFor(CartoonPlanesSettings, 'CartoonPlanesSettings', classMeta, VOID, VOID, CartoonPlanesSettings);
  setMetadataFor(Shaders_0, 'Shaders', objectMeta);
  setMetadataFor(Textures_0, 'Textures', objectMeta);
  setMetadataFor(Companion_0, 'Companion', objectMeta);
  setMetadataFor(Timers_0, 'Timers', classMeta, Enum);
  setMetadataFor(Cameras_1, 'Cameras', objectMeta);
  setMetadataFor(InteractiveCameraPositionPair, 'InteractiveCameraPositionPair', classMeta, CameraPositionPair);
  setMetadataFor(Companion_1, 'Companion', objectMeta);
  setMetadataFor(ExampleScene, 'ExampleScene', classMeta, Scene, VOID, ExampleScene);
  setMetadataFor(Timers_1, 'Timers', classMeta, Enum);
  setMetadataFor(Cameras_2, 'Cameras', objectMeta);
  setMetadataFor(Meshes_1, 'Meshes', objectMeta);
  setMetadataFor(SkyscrapersScene, 'SkyscrapersScene', classMeta, Scene, VOID, SkyscrapersScene);
  setMetadataFor(SkyscrapersSettings, 'SkyscrapersSettings', classMeta, VOID, VOID, SkyscrapersSettings);
  setMetadataFor(Shaders_1, 'Shaders', objectMeta);
  setMetadataFor(Textures_1, 'Textures', objectMeta);
  setMetadataFor(Companion_2, 'Companion', objectMeta);
  setMetadataFor(Timers_2, 'Timers', classMeta, Enum);
  //endregion
  function AnimatedObjectInfoBase() {
    this.hi_1 = 0.0;
    this.ii_1 = 0.0;
  }
  function AnimatedObjectInfo() {
    AnimatedObjectInfoBase.call(this);
    this.li_1 = new Vec3();
    this.mi_1 = new Vec3();
  }
  function SplineAnimatedObjectInfo() {
    AnimatedObjectInfoBase.call(this);
    this.pi_1 = null;
  }
  function Animations() {
    Animations_instance = this;
    this.qi_1 = new TextureAnimationChunked(133, 133, 3);
    this.ri_1 = new TextureAnimationChunked(341, 341, 15);
    this.si_1 = new TextureAnimationChunked(238, 238, 10);
    this.ti_1 = new TextureAnimationChunked(263, 263, 9);
    this.ui_1 = new TextureAnimationChunked(263, 263, 12);
  }
  var Animations_instance;
  function Animations_getInstance() {
    if (Animations_instance == null)
      new Animations();
    return Animations_instance;
  }
  function Cameras() {
    Cameras_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.vi_1 = [new CameraPositionPair(new CameraPosition(new Vec3(-20834.791, 47426.33, 2531.646), new Vec3(-25922.844, 23601.791, 886.872)), new CameraPosition(new Vec3(10194.038, -1464.044, 886.872), new Vec3(918.405, -14209.802, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-4109.569, 11284.58, 2531.646), new Vec3(-26652.816, 1825.736, 886.872)), new CameraPosition(new Vec3(4167.435, 9801.106, 886.872), new Vec3(20338.879, -12121.901, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1316.869, -26605.557, 730.833), new Vec3(7972.117, -8640.933, 156.916)), new CameraPosition(new Vec3(5633.813, -2835.024, 590.909), new Vec3(7054.362, -11628.732, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(1058.602, -6343.349, 7252.608), new Vec3(12343.629, -9785.771, 156.916)), new CameraPosition(new Vec3(10627.578, -5523.65, 952.352), new Vec3(7975.851, -12773.571, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-15084.583, -6685.166, 1734.204), new Vec3(-7877.742, -11902.989, 156.916)), new CameraPosition(new Vec3(-5300.519, -8189.871, 2864.12), new Vec3(-14072.867, -12477.64, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-12847.906, 6333.75, 388.651), new Vec3(-9402.603, 9611.532, 156.916)), new CameraPosition(new Vec3(-7762.645, 7800.965, 3749.253), new Vec3(-11462.321, 8195.902, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-22389.021, 1075.924, 5119.1), new Vec3(-6829.5, 16726.61, 3154.788)), new CameraPosition(new Vec3(-23767.002, 14537.841, 5001.777), new Vec3(1434.719, 1224.992, 4490.559)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-35127.016, 27564.738, 886.872), new Vec3(-7923.539, 14634.557, 886.872)), new CameraPosition(new Vec3(-24081.432, -14828.664, 886.872), new Vec3(-7150.61, -5201.194, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-26917.791, 18527.285, 3173.479), new Vec3(-19059.227, 11528.038, 886.872)), new CameraPosition(new Vec3(1437.67, 4945.704, 571.601), new Vec3(6268.789, -4323.603, 886.872)), 1.0)];
  }
  var Cameras_instance;
  function Cameras_getInstance() {
    if (Cameras_instance == null)
      new Cameras();
    return Cameras_instance;
  }
  function SceneColors(isDay, isLowSun, drawBirds, birds, clouds, stars, waterColorNear, waterColorFar, distantZFogColor) {
    this.wi_1 = isDay;
    this.xi_1 = isLowSun;
    this.yi_1 = drawBirds;
    this.zi_1 = birds;
    this.aj_1 = clouds;
    this.bj_1 = stars;
    this.cj_1 = waterColorNear;
    this.dj_1 = waterColorFar;
    this.ej_1 = distantZFogColor;
  }
  protoOf(SceneColors).toString = function () {
    return 'SceneColors(isDay=' + this.wi_1 + ', isLowSun=' + this.xi_1 + ', drawBirds=' + this.yi_1 + ', birds=' + this.zi_1 + ', clouds=' + this.aj_1 + ', stars=' + this.bj_1 + ', waterColorNear=' + this.cj_1 + ', waterColorFar=' + this.dj_1 + ', distantZFogColor=' + this.ej_1 + ')';
  };
  protoOf(SceneColors).hashCode = function () {
    var result = getBooleanHashCode(this.wi_1);
    result = imul(result, 31) + getBooleanHashCode(this.xi_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.yi_1) | 0;
    result = imul(result, 31) + this.zi_1.hashCode() | 0;
    result = imul(result, 31) + this.aj_1.hashCode() | 0;
    result = imul(result, 31) + this.bj_1.hashCode() | 0;
    result = imul(result, 31) + this.cj_1.hashCode() | 0;
    result = imul(result, 31) + this.dj_1.hashCode() | 0;
    result = imul(result, 31) + this.ej_1.hashCode() | 0;
    return result;
  };
  protoOf(SceneColors).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof SceneColors))
      return false;
    var tmp0_other_with_cast = other instanceof SceneColors ? other : THROW_CCE();
    if (!(this.wi_1 === tmp0_other_with_cast.wi_1))
      return false;
    if (!(this.xi_1 === tmp0_other_with_cast.xi_1))
      return false;
    if (!(this.yi_1 === tmp0_other_with_cast.yi_1))
      return false;
    if (!this.zi_1.equals(tmp0_other_with_cast.zi_1))
      return false;
    if (!this.aj_1.equals(tmp0_other_with_cast.aj_1))
      return false;
    if (!this.bj_1.equals(tmp0_other_with_cast.bj_1))
      return false;
    if (!this.cj_1.equals(tmp0_other_with_cast.cj_1))
      return false;
    if (!this.dj_1.equals(tmp0_other_with_cast.dj_1))
      return false;
    if (!this.ej_1.equals(tmp0_other_with_cast.ej_1))
      return false;
    return true;
  };
  function Colors() {
    Colors_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.fj_1 = [new SceneColors(true, false, true, new Vec4(0.3137254901960784, 0.3137254901960784, 0.3137254901960784, 1.0), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.21568627450980393, 0.6313725490196078, 0.8274509803921568), new Vec4(0.5137254901960784, 0.8352941176470589, 0.8901960784313725), new Vec4(1.0, 1.0, 1.0, 0.75)), new SceneColors(false, false, false, new Vec4(1.0, 0.0, 0.0, 1.0), new Vec4(0.058823529411764705, 0.2627450980392157, 0.3843137254901961, 0.3), new Vec4(1.0, 1.0, 1.0, 1.0), new Vec4(0.03529411764705882, 0.17254901960784313, 0.3215686274509804), new Vec4(0.043137254901960784, 0.12156862745098039, 0.2196078431372549), new Vec4(0.2627450980392157, 0.4823529411764706, 0.611764705882353, 0.75)), new SceneColors(true, true, true, new Vec4(0.49411764705882355, 0.42745098039215684, 0.26666666666666666, 1.0), new Vec4(0.9294117647058824, 0.7490196078431373, 0.38823529411764707, 0.3), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.592156862745098, 0.6313725490196078, 0.5098039215686274), new Vec4(0.8509803921568627, 0.7333333333333333, 0.5372549019607843), new Vec4(0.8980392156862745, 0.8745098039215686, 0.7137254901960784, 0.75)), new SceneColors(true, true, false, new Vec4(0.3686274509803922, 0.17647058823529413, 0.20784313725490197, 1.0), new Vec4(0.4549019607843137, 0.2784313725490196, 0.5019607843137255, 0.3), new Vec4(1.0, 1.0, 1.0, 1.0), new Vec4(0.0784313725490196, 0.20784313725490197, 0.4549019607843137), new Vec4(0.25882352941176473, 0.24313725490196078, 0.5098039215686274), new Vec4(0.8823529411764706, 0.6745098039215687, 0.8392156862745098, 0.75))];
  }
  var Colors_instance;
  function Colors_getInstance() {
    if (Colors_instance == null)
      new Colors();
    return Colors_instance;
  }
  function Meshes() {
    Meshes_instance = this;
    this.gj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_U0_getInstance(), VertexFormat_HALF_getInstance(), 6)]), 8);
    this.hj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 12)]), 16);
    this.ij_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.jj_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0)), 8);
    this.kj_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.lj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0), new MeshAttribute(AttributeType_U0_getInstance(), VertexFormat_UBYTE_NORMALIZED_getInstance(), 12)]), 16);
    this.mj_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_FLOAT2_getInstance(), 0)), 4);
    this.nj_1 = MeshConstructor2('mountains1', this.gj_1);
    this.oj_1 = MeshConstructor2('mountains_distant1', this.gj_1);
    this.pj_1 = MeshConstructor2('sun', this.hj_1);
    this.qj_1 = MeshConstructor2('sun2', this.hj_1);
    this.rj_1 = MeshConstructor2('water_test', this.ij_1);
    this.sj_1 = MeshConstructor2('sky', this.hj_1);
    this.tj_1 = MeshConstructor2('stars', this.kj_1);
    this.uj_1 = MeshConstructor2('clouds', this.lj_1);
    this.vj_1 = MeshConstructor2('bird1');
    this.wj_1 = MeshConstructor2('ship', this.gj_1);
    this.xj_1 = MeshConstructor2('penguin-idle', this.mj_1);
    this.yj_1 = MeshConstructor2('penguin-idle2', this.mj_1);
    this.zj_1 = MeshConstructor2('seal-idle', this.mj_1);
    this.ak_1 = MeshConstructor2('animals_sleeping', this.hj_1);
    this.bk_1 = mutableListOf([this.pj_1, this.qj_1, this.nj_1, this.oj_1, this.rj_1, this.sj_1, this.tj_1, this.uj_1, this.vj_1, this.wj_1, this.xj_1, this.yj_1, this.zj_1, this.ak_1]);
  }
  var Meshes_instance;
  function Meshes_getInstance() {
    if (Meshes_instance == null)
      new Meshes();
    return Meshes_instance;
  }
  function Penguins() {
    Penguins_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.apply' call
    var this_0 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_0.li_1 = new Vec3(-10793.156, 7192.894, 37.26);
    this_0.mi_1 = new Vec3(0.0, 0.0, -160.0);
    this_0.hi_1 = 0.88;
    this_0.ii_1 = 0.5;
    var tmp_0 = this_0;
    // Inline function 'kotlin.apply' call
    var this_1 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_1.li_1 = new Vec3(-10851.307, 7243.238, 37.26);
    this_1.mi_1 = new Vec3(0.0, 0.0, 70.0);
    this_1.hi_1 = 0.75;
    this_1.ii_1 = 0.25;
    var tmp_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_2.li_1 = new Vec3(-10762.938, 7258.693, 37.26);
    this_2.mi_1 = new Vec3(0.0, 0.0, 0.0);
    this_2.hi_1 = 0.65;
    this_2.ii_1 = 0.77;
    var tmp_2 = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_3.li_1 = new Vec3(-10280.157, 8529.577, 69.556);
    this_3.mi_1 = new Vec3(0.0, 0.0, -20.0);
    this_3.hi_1 = 0.65;
    this_3.ii_1 = 0.2;
    var tmp_3 = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_4.li_1 = new Vec3(-10359.45, 8782.093, 69.556);
    this_4.mi_1 = new Vec3(0.0, 0.0, 70.0);
    this_4.hi_1 = 0.77;
    this_4.ii_1 = 0.35;
    var tmp_4 = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_5.li_1 = new Vec3(-10081.696, 8657.917, 69.556);
    this_5.mi_1 = new Vec3(0.0, 0.0, -160.0);
    this_5.hi_1 = 0.85;
    this_5.ii_1 = 0.75;
    var tmp_5 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_6.li_1 = new Vec3(-10150.821, 9009.801, 69.556);
    this_6.mi_1 = new Vec3(0.0, 0.0, 130.0);
    this_6.hi_1 = 0.7;
    this_6.ii_1 = 0.66;
    var tmp_6 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_7.li_1 = new Vec3(-10006.514, 8820.707, 69.556);
    this_7.mi_1 = new Vec3(0.0, 0.0, -90.0);
    this_7.hi_1 = 0.8;
    this_7.ii_1 = 0.8;
    var tmp_7 = this_7;
    // Inline function 'kotlin.apply' call
    var this_8 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_8.li_1 = new Vec3(-9890.24, 8932.688, 69.556);
    this_8.mi_1 = new Vec3(0.0, 0.0, 140.0);
    this_8.hi_1 = 0.85;
    this_8.ii_1 = 0.5;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.ck_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, this_8];
    var tmp_8 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.apply' call
    var this_9 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_9.li_1 = new Vec3(-12338.941, 6764.751, 33.536);
    this_9.mi_1 = new Vec3(0.0, 0.0, 180.0);
    this_9.hi_1 = 0.9;
    this_9.ii_1 = 0.2;
    var tmp_9 = this_9;
    // Inline function 'kotlin.apply' call
    var this_10 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_10.li_1 = new Vec3(-12192.411, 6887.637, 33.536);
    this_10.mi_1 = new Vec3(0.0, 0.0, -135.0);
    this_10.hi_1 = 0.8;
    this_10.ii_1 = 0.33;
    var tmp_10 = this_10;
    // Inline function 'kotlin.apply' call
    var this_11 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_11.li_1 = new Vec3(-12480.681, 6825.791, 33.536);
    this_11.mi_1 = new Vec3(0.0, 0.0, 160.0);
    this_11.hi_1 = 0.75;
    this_11.ii_1 = 0.5;
    var tmp_11 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_12.li_1 = new Vec3(-10744.105, 7007.923, 33.536);
    this_12.mi_1 = new Vec3(0.0, 0.0, -160.0);
    this_12.hi_1 = 0.75;
    this_12.ii_1 = 0.5;
    var tmp_12 = this_12;
    // Inline function 'kotlin.apply' call
    var this_13 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_13.li_1 = new Vec3(-11312.577, 8120.395, 33.536);
    this_13.mi_1 = new Vec3(0.0, 0.0, 50.0);
    this_13.hi_1 = 0.75;
    this_13.ii_1 = 0.75;
    var tmp_13 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_14.li_1 = new Vec3(-10070.444, 7941.108, 65.833);
    this_14.mi_1 = new Vec3(0.0, 0.0, 155.0);
    this_14.hi_1 = 0.75;
    this_14.ii_1 = 0.8;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_8.dk_1 = [tmp_9, tmp_10, tmp_11, tmp_12, tmp_13, this_14];
  }
  var Penguins_instance;
  function Penguins_getInstance() {
    if (Penguins_instance == null)
      new Penguins();
    return Penguins_instance;
  }
  function toggleDayNightObjects($this) {
    var isDay = Colors_getInstance().fj_1[$this.settings.timeOfDay.b4_1].wi_1;
    $this.commandStars.enabled = !isDay;
    $this.groupBirds.enabled = isDay;
    $this.groupAnimalsAnimated.enabled = isDay;
    $this.groupAnimalsSleeping.enabled = !isDay;
    $this.groupShips.enabled = isDay;
  }
  function updateColors($this) {
    var colors = Colors_getInstance().fj_1[$this.settings.timeOfDay.b4_1];
    setUniform($this.vk_1.q(2), colors.ej_1.r, colors.ej_1.g, colors.ej_1.b, colors.ej_1.a);
    setUniform_0($this.vk_1.q(3), 0.0, 1500.0);
    setUniform($this.xk_1.q(1), colors.bj_1.r, colors.bj_1.g, colors.bj_1.b, colors.bj_1.a);
    setUniform($this.yk_1.q(1), colors.aj_1.r, colors.aj_1.g, colors.aj_1.b, colors.aj_1.a);
    var tmp = $this.yk_1.q(2);
    // Inline function 'kotlin.math.sin' call
    var x = $this.timers.ei(Timers_CloudsAnimation_getInstance()) * $this.PIf * 2.0;
    var tmp$ret$0 = Math.sin(x);
    setUniform_1(tmp, tmp$ret$0);
    $this.commandClouds.transform.m9_1.z = $this.timers.ei(Timers_CloudsRotation_getInstance()) * 360.0;
  }
  function updateWater($this) {
    var colors = Colors_getInstance().fj_1[$this.settings.timeOfDay.b4_1];
    var k = 0.2;
    var timeFract = $this.timers.ei(Timers_Water_getInstance()) * 80.0 * k % 1.0;
    timeFract = timeFract / k;
    setUniform_1($this.wk_1.q(2), timeFract);
    setUniform_1($this.wk_1.q(3), $this.timers.ei(Timers_WaterLarge_getInstance()));
    setUniform_1($this.wk_1.q(4), 15.0);
    setUniform($this.wk_1.q(7), colors.cj_1.r, colors.cj_1.g, colors.cj_1.b, colors.cj_1.a);
    setUniform($this.wk_1.q(8), colors.dj_1.r, colors.dj_1.g, colors.dj_1.b, colors.dj_1.a);
    setUniform_0($this.wk_1.q(5), 10000.0, 15000.0);
    setUniform($this.wk_1.q(6), 5000.0, 2000.0, 1.0, $this.settings.blurred ? 100.0 : 20000.0);
  }
  function updateTimeOfDayTextures($this) {
    $this.uniformPaletteTexture.value = Textures_getInstance().pl_1[$this.settings.timeOfDay.b4_1];
    $this.uniformSkyTexture.value = Textures_getInstance().ql_1[$this.settings.timeOfDay.b4_1];
  }
  function updateSun($this) {
    var colors = Colors_getInstance().fj_1[$this.settings.timeOfDay.b4_1];
    $this.commandSun.enabled = !colors.xi_1;
    $this.commandSunLow.enabled = colors.xi_1;
  }
  function updateBirds($this) {
    var tmp = $this.groupBirds.commands;
    var commands = isInterface(tmp, List) ? tmp : THROW_CCE();
    var angle = $this.timers.ei(Timers_BirdsFly_getInstance()) * $this.PIf * 2.0;
    setBirdPosition($this, angle, 0.0, 0.0, commands.q(0).transform.l9_1);
    setBirdPosition($this, -angle - $this.PIf, 0.0, -4000.0, commands.q(1).transform.l9_1);
    setBirdPosition($this, -angle - $this.PIf, 0.0, 3000.0, commands.q(2).transform.l9_1);
    setBirdPosition($this, angle, 7000.0, 3000.0, commands.q(3).transform.l9_1);
    setBirdPosition($this, -angle - $this.PIf, 5000.0, 3000.0, commands.q(4).transform.l9_1);
    setBirdPosition($this, angle, -5000.0, 7000.0, commands.q(5).transform.l9_1);
    commands.q(0).transform.m9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    commands.q(1).transform.m9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(2).transform.m9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(3).transform.m9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    commands.q(4).transform.m9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(5).transform.m9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    var wingTimer1 = $this.timers.ei(Timers_BirdWings1_getInstance());
    var wingTimer2 = $this.timers.ei(Timers_BirdWings2_getInstance());
    setAnimationUniforms$default($this, wingTimer1, Animations_getInstance().qi_1, commands.q(0).uniforms);
    setAnimationUniforms$default($this, wingTimer2, Animations_getInstance().qi_1, commands.q(1).uniforms);
    setAnimationUniforms$default($this, wingTimer1 + 0.3, Animations_getInstance().qi_1, commands.q(2).uniforms);
    setAnimationUniforms$default($this, wingTimer2 + 0.5, Animations_getInstance().qi_1, commands.q(3).uniforms);
    setAnimationUniforms$default($this, wingTimer1 + 0.5, Animations_getInstance().qi_1, commands.q(4).uniforms);
    setAnimationUniforms$default($this, wingTimer2 + 0.6, Animations_getInstance().qi_1, commands.q(5).uniforms);
    var tmp0_iterator = commands.h();
    while (tmp0_iterator.o()) {
      var command = tmp0_iterator.p();
      setUniform(command.uniforms.q(1), 0.1640625, 0.1484375, 0.1171875, 1.0);
    }
  }
  function setBirdPosition($this, angle, centerX, centerY, translation) {
    // Inline function 'kotlin.math.sin' call
    translation.x = Math.sin(angle) * $this.BIRD_FLIGHT_RADIUS + centerX;
    // Inline function 'kotlin.math.cos' call
    translation.y = Math.cos(angle) * $this.BIRD_FLIGHT_RADIUS + centerY;
  }
  function setAnimationUniforms($this, timerAnim, animation, uniforms, startEndStart) {
    var timer = timerAnim % 1.0;
    setUniform_2(uniforms.q(2), animation.hb_1);
    setUniform_1(uniforms.q(3), 1.0 / animation.mb_1);
    setUniform(uniforms.q(5), animation.hb_1, animation.jb_1, startEndStart ? animation.ob(timer) : animation.pb(timer), animation.nb_1);
  }
  function setAnimationUniforms$default($this, timerAnim, animation, uniforms, startEndStart, $super) {
    startEndStart = startEndStart === VOID ? true : startEndStart;
    return setAnimationUniforms($this, timerAnim, animation, uniforms, startEndStart);
  }
  function updateShips($this) {
    var tmp = $this.groupShips.commands;
    var commandsShips = isInterface(tmp, List) ? tmp : THROW_CCE();
    var timerSpline = $this.timers.ei(Timers_Ships_getInstance());
    var inductionVariable = 0;
    var last = ShipsConfig_getInstance().rl_1.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var ship = ShipsConfig_getInstance().rl_1[i];
        var command = commandsShips.q(i);
        var position = ship.sl_1.md(timerSpline);
        var rotation = ship.sl_1.td(timerSpline).z + 180.0;
        command.transform.l9_1.x = position.x;
        command.transform.l9_1.y = position.y;
        command.transform.l9_1.z = position.z;
        command.transform.m9_1.z = rotation;
        command.transform.n9_1.x = ship.tl_1;
        command.transform.n9_1.y = ship.tl_1;
        command.transform.n9_1.z = ship.tl_1;
      }
       while (inductionVariable < last);
  }
  function updateAnimalsAnimated($this) {
    var timerPenguinIdle = $this.timers.ei(Timers_PenguinIdle_getInstance());
    var timerPenguinIdle2 = $this.timers.ei(Timers_PenguinIdle2_getInstance());
    var timerSealIdle = $this.timers.ei(Timers_SealIdleAnim_getInstance());
    var timerSealWalk = $this.timers.ei(Timers_SealWalkAnim_getInstance());
    var timerSealSpline = $this.timers.ei(Timers_SealWalkSpline_getInstance());
    var tmp = $this.groupPenguinsIdle.commands;
    var commandsPenguins1 = isInterface(tmp, List) ? tmp : THROW_CCE();
    var tmp_0 = $this.groupPenguinsIdle2.commands;
    var commandsPenguins2 = isInterface(tmp_0, List) ? tmp_0 : THROW_CCE();
    var tmp_1 = $this.groupSealIdle.commands;
    var commandsSealsIdle = isInterface(tmp_1, List) ? tmp_1 : THROW_CCE();
    var tmp_2 = $this.groupSealWalking.commands;
    var commandsSealsWalking = isInterface(tmp_2, List) ? tmp_2 : THROW_CCE();
    var inductionVariable = 0;
    var last = Penguins_getInstance().ck_1.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var command = commandsPenguins1.q(i);
        var config = Penguins_getInstance().ck_1[i];
        setAnimationUniforms$default($this, timerPenguinIdle + config.ii_1, Animations_getInstance().ri_1, command.uniforms);
      }
       while (inductionVariable < last);
    var inductionVariable_0 = 0;
    var last_0 = Penguins_getInstance().dk_1.length;
    if (inductionVariable_0 < last_0)
      do {
        var i_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        var command_0 = commandsPenguins2.q(i_0);
        var config_0 = Penguins_getInstance().dk_1[i_0];
        setAnimationUniforms$default($this, timerPenguinIdle2 + config_0.ii_1, Animations_getInstance().si_1, command_0.uniforms);
      }
       while (inductionVariable_0 < last_0);
    var inductionVariable_1 = 0;
    var last_1 = Seals_getInstance().vl_1.length;
    if (inductionVariable_1 < last_1)
      do {
        var i_1 = inductionVariable_1;
        inductionVariable_1 = inductionVariable_1 + 1 | 0;
        var command_1 = commandsSealsIdle.q(i_1);
        var config_1 = Seals_getInstance().vl_1[i_1];
        setAnimationUniforms($this, timerSealIdle + config_1.ii_1, Animations_getInstance().ti_1, command_1.uniforms, false);
      }
       while (inductionVariable_1 < last_1);
    var inductionVariable_2 = 0;
    var last_2 = Seals_getInstance().wl_1.length;
    if (inductionVariable_2 < last_2)
      $l$loop: do {
        var i_2 = inductionVariable_2;
        inductionVariable_2 = inductionVariable_2 + 1 | 0;
        var command_2 = commandsSealsWalking.q(i_2);
        var config_2 = Seals_getInstance().wl_1[i_2];
        if (config_2.pi_1 == null) {
          continue $l$loop;
        }
        var position = ensureNotNull(config_2.pi_1).md(timerSealSpline);
        var rotation = ensureNotNull(config_2.pi_1).td(timerSealSpline).z - 90.0;
        setAnimationUniforms($this, timerSealWalk + config_2.ii_1, Animations_getInstance().ui_1, command_2.uniforms, false);
        command_2.transform.l9_1.x = position.x;
        command_2.transform.l9_1.y = position.y;
        command_2.transform.l9_1.z = position.z;
        command_2.transform.m9_1.z = rotation;
        command_2.transform.n9_1.x = config_2.hi_1;
        command_2.transform.n9_1.y = config_2.hi_1;
        command_2.transform.n9_1.z = config_2.hi_1;
      }
       while (inductionVariable_2 < last_2);
  }
  function updateAnimalsSleeping($this) {
  }
  function ArcticScene() {
    Scene.call(this);
    this.timers = new TimersMap();
    this.jk_1 = 1000000.0;
    this.kk_1 = 23000.0;
    this.lk_1 = 2000.0;
    this.FOV_TRANSITION = 20.0;
    this.tk_1 = mutableListOf([get_HINT_VRS_4X4()]);
    this.uniformPaletteTexture = new UniformTextureValue(Textures_getInstance().zk_1);
    this.uniformSkyTexture = new UniformTextureValue(Textures_getInstance().dl_1);
    this.BIRD_FLIGHT_RADIUS = 19000.0;
    this.PIf = 3.1415927;
    this.meshes = Meshes_getInstance().bk_1;
    this.textures = Textures_getInstance().ol_1;
    this.shaders = Shaders_getInstance().hm_1;
    Companion_instance.im(this.timers);
    this.Z_NEAR = 20.0;
    this.Z_FAR = 115000.0;
    this.FOV_LANDSCAPE = 50.0;
    this.FOV_PORTRAIT = 75.0;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new ArcticSettings();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_0.cameraPeriod = 1.0;
    this_0.vignette = true;
    this_0.blurred = false;
    this_0.autoSwitchCameras = true;
    this_0.timeOfDay = TimeOfDay_Day_getInstance();
    tmp.settings = this_0;
    this.cameraAnimator = new CameraPathAnimator(this.jk_1, this.kk_1, this.lk_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance().vi_1);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_1.color = new Vec4(1.0, 0.0, 1.0, 1.0);
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_0.qk_1 = this_1;
    var statePaletteFp16 = new DrawMeshState(Shaders_getInstance().xl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_HALF_getInstance(), 6)]), 8));
    var stateDiffuseFp16 = new DrawMeshState(Shaders_getInstance().yl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 12)]), 16));
    var stateWater = new DrawMeshState(Shaders_getInstance().am_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var stateDiffuseZFog = new DrawMeshState(Shaders_getInstance().zl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_HALF_getInstance(), 6)]), 8));
    var txOrigin = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_2 = DrawStaticMeshCommandConstructor(Meshes_getInstance().pj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_2.hints = this.tk_1;
    tmp_1.commandSun = this_2;
    var tmp_2 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = DrawStaticMeshCommandConstructor(Meshes_getInstance().qj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_3.hints = this.tk_1;
    tmp_2.commandSunLow = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_4.name = 'sun';
    this_4.enabled = true;
    this_4.commands = mutableListOf([this.commandSun, this.commandSunLow]);
    var groupSun = this_4;
    this.uk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]);
    this.vk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(2))]);
    // Inline function 'kotlin.apply' call
    var this_5 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_5.name = 'mountains';
    this_5.enabled = true;
    var tmp_3 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = DrawStaticMeshCommandConstructor(Meshes_getInstance().nj_1, this.uk_1, statePaletteFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>.<anonymous>' call
    this_6.hints = this.tk_1;
    var tmp_4 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = DrawStaticMeshCommandConstructor(Meshes_getInstance().oj_1, this.vk_1, stateDiffuseZFog, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>.<anonymous>' call
    this_7.hints = this.tk_1;
    tmp_3.commands = mutableListOf([tmp_4, this_7]);
    var groupMountains = this_5;
    this.wk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(2)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(4))]);
    var commandWater = DrawStaticMeshCommandConstructor(Meshes_getInstance().rj_1, this.wk_1, stateWater, txOrigin);
    var stateSky = new DrawMeshState(Shaders_getInstance().bm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 12)]), 16));
    var commandSky = DrawStaticMeshCommandConstructor(Meshes_getInstance().sj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformSkyTexture, new UniformTextureValue(Textures_getInstance().hl_1)]), stateSky, txOrigin);
    var stateStars = new DrawMeshState(Shaders_getInstance().cm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0)), 12));
    this.xk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4))]);
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_8 = DrawStaticMeshCommandConstructor(Meshes_getInstance().tj_1, this.xk_1, stateStars, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_8.hints = this.tk_1;
    tmp_5.commandStars = this_8;
    var stateClouds = new DrawMeshState(Shaders_getInstance().em_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_UBYTE_NORMALIZED_getInstance(), 12)]), 16));
    this.yk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(1))]);
    var tmp_6 = this;
    // Inline function 'kotlin.apply' call
    var this_9 = new DrawTransformedMeshCommand(Meshes_getInstance().uj_1, this.yk_1, stateClouds, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_9.hints = this.tk_1;
    tmp_6.commandClouds = this_9;
    var stateBird = new DrawMeshState(Shaders_getInstance().fm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), null);
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_10 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 10000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_10.hints = this.tk_1;
    var tmp_8 = this_10;
    // Inline function 'kotlin.apply' call
    var this_11 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 11000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_11.hints = this.tk_1;
    var tmp_9 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 12000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_12.hints = this.tk_1;
    var tmp_10 = this_12;
    // Inline function 'kotlin.apply' call
    var this_13 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 13000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_13.hints = this.tk_1;
    var tmp_11 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 14000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_14.hints = this.tk_1;
    var tmp_12 = this_14;
    // Inline function 'kotlin.apply' call
    var this_15 = new DrawTransformedMeshCommand(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 15000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_15.hints = this.tk_1;
    tmp_7.groupBirds = GroupCommandArr(true, [tmp_8, tmp_9, tmp_10, tmp_11, tmp_12, this_15]);
    var tmp_13 = this;
    // Inline function 'kotlin.apply' call
    var this_16 = new DrawTransformedMeshCommand(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_16.hints = this.tk_1;
    var tmp_14 = this_16;
    // Inline function 'kotlin.apply' call
    var this_17 = new DrawTransformedMeshCommand(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_17.hints = this.tk_1;
    var tmp_15 = this_17;
    // Inline function 'kotlin.apply' call
    var this_18 = new DrawTransformedMeshCommand(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_18.hints = this.tk_1;
    tmp_13.groupShips = GroupCommandArr(true, [tmp_14, tmp_15, this_18]);
    var stateAnimatedTextured = new DrawMeshState(Shaders_getInstance().gm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_UV0_getInstance(), 0, VertexFormat_HALF2_getInstance(), 0)), 4));
    var tmp_16 = this;
    // Inline function 'kotlin.apply' call
    var this_19 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[0].li_1, Penguins_getInstance().ck_1[0].mi_1, new Vec3(Penguins_getInstance().ck_1[0].hi_1, Penguins_getInstance().ck_1[0].hi_1, Penguins_getInstance().ck_1[0].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_19.hints = this.tk_1;
    var tmp_17 = this_19;
    // Inline function 'kotlin.apply' call
    var this_20 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[1].li_1, Penguins_getInstance().ck_1[1].mi_1, new Vec3(Penguins_getInstance().ck_1[1].hi_1, Penguins_getInstance().ck_1[1].hi_1, Penguins_getInstance().ck_1[1].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_20.hints = this.tk_1;
    var tmp_18 = this_20;
    // Inline function 'kotlin.apply' call
    var this_21 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[2].li_1, Penguins_getInstance().ck_1[2].mi_1, new Vec3(Penguins_getInstance().ck_1[2].hi_1, Penguins_getInstance().ck_1[2].hi_1, Penguins_getInstance().ck_1[2].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_21.hints = this.tk_1;
    var tmp_19 = this_21;
    // Inline function 'kotlin.apply' call
    var this_22 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[3].li_1, Penguins_getInstance().ck_1[3].mi_1, new Vec3(Penguins_getInstance().ck_1[3].hi_1, Penguins_getInstance().ck_1[3].hi_1, Penguins_getInstance().ck_1[3].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_22.hints = this.tk_1;
    var tmp_20 = this_22;
    // Inline function 'kotlin.apply' call
    var this_23 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[4].li_1, Penguins_getInstance().ck_1[4].mi_1, new Vec3(Penguins_getInstance().ck_1[4].hi_1, Penguins_getInstance().ck_1[4].hi_1, Penguins_getInstance().ck_1[4].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_23.hints = this.tk_1;
    var tmp_21 = this_23;
    // Inline function 'kotlin.apply' call
    var this_24 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[5].li_1, Penguins_getInstance().ck_1[5].mi_1, new Vec3(Penguins_getInstance().ck_1[5].hi_1, Penguins_getInstance().ck_1[5].hi_1, Penguins_getInstance().ck_1[5].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_24.hints = this.tk_1;
    var tmp_22 = this_24;
    // Inline function 'kotlin.apply' call
    var this_25 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[6].li_1, Penguins_getInstance().ck_1[6].mi_1, new Vec3(Penguins_getInstance().ck_1[6].hi_1, Penguins_getInstance().ck_1[6].hi_1, Penguins_getInstance().ck_1[6].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_25.hints = this.tk_1;
    var tmp_23 = this_25;
    // Inline function 'kotlin.apply' call
    var this_26 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[7].li_1, Penguins_getInstance().ck_1[7].mi_1, new Vec3(Penguins_getInstance().ck_1[7].hi_1, Penguins_getInstance().ck_1[7].hi_1, Penguins_getInstance().ck_1[7].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_26.hints = this.tk_1;
    var tmp_24 = this_26;
    // Inline function 'kotlin.apply' call
    var this_27 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ck_1[8].li_1, Penguins_getInstance().ck_1[8].mi_1, new Vec3(Penguins_getInstance().ck_1[8].hi_1, Penguins_getInstance().ck_1[8].hi_1, Penguins_getInstance().ck_1[8].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_27.hints = this.tk_1;
    tmp_16.groupPenguinsIdle = GroupCommandArr(true, [tmp_17, tmp_18, tmp_19, tmp_20, tmp_21, tmp_22, tmp_23, tmp_24, this_27]);
    var tmp_25 = this;
    // Inline function 'kotlin.apply' call
    var this_28 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[0].li_1, Penguins_getInstance().dk_1[0].mi_1, new Vec3(Penguins_getInstance().dk_1[0].hi_1, Penguins_getInstance().dk_1[0].hi_1, Penguins_getInstance().dk_1[0].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_28.hints = this.tk_1;
    var tmp_26 = this_28;
    // Inline function 'kotlin.apply' call
    var this_29 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[1].li_1, Penguins_getInstance().dk_1[1].mi_1, new Vec3(Penguins_getInstance().dk_1[1].hi_1, Penguins_getInstance().dk_1[1].hi_1, Penguins_getInstance().dk_1[1].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_29.hints = this.tk_1;
    var tmp_27 = this_29;
    // Inline function 'kotlin.apply' call
    var this_30 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[2].li_1, Penguins_getInstance().dk_1[2].mi_1, new Vec3(Penguins_getInstance().dk_1[2].hi_1, Penguins_getInstance().dk_1[2].hi_1, Penguins_getInstance().dk_1[2].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_30.hints = this.tk_1;
    var tmp_28 = this_30;
    // Inline function 'kotlin.apply' call
    var this_31 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[3].li_1, Penguins_getInstance().dk_1[3].mi_1, new Vec3(Penguins_getInstance().dk_1[3].hi_1, Penguins_getInstance().dk_1[3].hi_1, Penguins_getInstance().dk_1[3].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_31.hints = this.tk_1;
    var tmp_29 = this_31;
    // Inline function 'kotlin.apply' call
    var this_32 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[4].li_1, Penguins_getInstance().dk_1[4].mi_1, new Vec3(Penguins_getInstance().dk_1[4].hi_1, Penguins_getInstance().dk_1[4].hi_1, Penguins_getInstance().dk_1[4].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_32.hints = this.tk_1;
    var tmp_30 = this_32;
    // Inline function 'kotlin.apply' call
    var this_33 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().dk_1[5].li_1, Penguins_getInstance().dk_1[5].mi_1, new Vec3(Penguins_getInstance().dk_1[5].hi_1, Penguins_getInstance().dk_1[5].hi_1, Penguins_getInstance().dk_1[5].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_33.hints = this.tk_1;
    tmp_25.groupPenguinsIdle2 = GroupCommandArr(true, [tmp_26, tmp_27, tmp_28, tmp_29, tmp_30, this_33]);
    var tmp_31 = this;
    // Inline function 'kotlin.apply' call
    var this_34 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[0].li_1, Seals_getInstance().vl_1[0].mi_1, new Vec3(Seals_getInstance().vl_1[0].hi_1, Seals_getInstance().vl_1[0].hi_1, Seals_getInstance().vl_1[0].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_34.hints = this.tk_1;
    var tmp_32 = this_34;
    // Inline function 'kotlin.apply' call
    var this_35 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[1].li_1, Seals_getInstance().vl_1[1].mi_1, new Vec3(Seals_getInstance().vl_1[1].hi_1, Seals_getInstance().vl_1[1].hi_1, Seals_getInstance().vl_1[1].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_35.hints = this.tk_1;
    var tmp_33 = this_35;
    // Inline function 'kotlin.apply' call
    var this_36 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[2].li_1, Seals_getInstance().vl_1[2].mi_1, new Vec3(Seals_getInstance().vl_1[2].hi_1, Seals_getInstance().vl_1[2].hi_1, Seals_getInstance().vl_1[2].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_36.hints = this.tk_1;
    var tmp_34 = this_36;
    // Inline function 'kotlin.apply' call
    var this_37 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[3].li_1, Seals_getInstance().vl_1[3].mi_1, new Vec3(Seals_getInstance().vl_1[3].hi_1, Seals_getInstance().vl_1[3].hi_1, Seals_getInstance().vl_1[3].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_37.hints = this.tk_1;
    var tmp_35 = this_37;
    // Inline function 'kotlin.apply' call
    var this_38 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[4].li_1, Seals_getInstance().vl_1[4].mi_1, new Vec3(Seals_getInstance().vl_1[4].hi_1, Seals_getInstance().vl_1[4].hi_1, Seals_getInstance().vl_1[4].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_38.hints = this.tk_1;
    var tmp_36 = this_38;
    // Inline function 'kotlin.apply' call
    var this_39 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[5].li_1, Seals_getInstance().vl_1[5].mi_1, new Vec3(Seals_getInstance().vl_1[5].hi_1, Seals_getInstance().vl_1[5].hi_1, Seals_getInstance().vl_1[5].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_39.hints = this.tk_1;
    var tmp_37 = this_39;
    // Inline function 'kotlin.apply' call
    var this_40 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[6].li_1, Seals_getInstance().vl_1[6].mi_1, new Vec3(Seals_getInstance().vl_1[6].hi_1, Seals_getInstance().vl_1[6].hi_1, Seals_getInstance().vl_1[6].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_40.hints = this.tk_1;
    var tmp_38 = this_40;
    // Inline function 'kotlin.apply' call
    var this_41 = DrawStaticMeshCommandConstructor(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ml_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().vl_1[7].li_1, Seals_getInstance().vl_1[7].mi_1, new Vec3(Seals_getInstance().vl_1[7].hi_1, Seals_getInstance().vl_1[7].hi_1, Seals_getInstance().vl_1[7].hi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_41.hints = this.tk_1;
    tmp_31.groupSealIdle = GroupCommandArr(true, [tmp_32, tmp_33, tmp_34, tmp_35, tmp_36, tmp_37, tmp_38, this_41]);
    var tmp_39 = this;
    // Inline function 'kotlin.apply' call
    var this_42 = new DrawTransformedMeshCommand(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().nl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_42.hints = this.tk_1;
    var tmp_40 = this_42;
    // Inline function 'kotlin.apply' call
    var this_43 = new DrawTransformedMeshCommand(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().nl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_43.hints = this.tk_1;
    var tmp_41 = this_43;
    // Inline function 'kotlin.apply' call
    var this_44 = new DrawTransformedMeshCommand(Meshes_getInstance().zj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().nl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_44.hints = this.tk_1;
    tmp_39.groupSealWalking = GroupCommandArr(true, [tmp_40, tmp_41, this_44]);
    this.groupAnimalsAnimated = GroupCommandArr(true, [this.groupPenguinsIdle, this.groupPenguinsIdle2, this.groupSealIdle, this.groupSealWalking]);
    var tmp_42 = this;
    // Inline function 'kotlin.apply' call
    var this_45 = DrawStaticMeshCommandConstructor(Meshes_getInstance().ak_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_45.hints = this.tk_1;
    tmp_42.groupAnimalsSleeping = GroupCommandArr(true, [this_45]);
    var tmp_43 = this;
    // Inline function 'kotlin.apply' call
    var this_46 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_46.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_43.pk_1 = GroupCommandArr(true, [this.qk_1, this_46]);
    var tmp_44 = this;
    // Inline function 'kotlin.apply' call
    var this_47 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_47.color0 = new Vec4(0.65, 0.65, 0.65, 1.0);
    this_47.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_44.rk_1 = this_47;
    this.mk_1 = GroupCommandArr(true, [MainPassCommandArr(true, [this.pk_1, this.groupBirds, this.groupShips, this.groupAnimalsAnimated, this.groupAnimalsSleeping, groupSun, groupMountains, commandWater, this.commandStars, this.commandClouds, commandSky, this.rk_1])]);
    var tmp_45 = this;
    // Inline function 'kotlin.apply' call
    var this_48 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_48.name = 'blurred-main';
    this_48.enabled = true;
    this_48.minSize = 220;
    this_48.brightness = 0.91;
    this_48.blurSize = BlurSize_KERNEL_4_getInstance();
    this_48.commands = mutableListOf([this.pk_1, this.groupShips, this.groupAnimalsAnimated, this.groupAnimalsSleeping, groupSun, groupMountains, commandWater, this.commandStars, this.commandClouds, commandSky, this.rk_1]);
    tmp_45.ok_1 = this_48;
    var tmp_46 = this;
    // Inline function 'kotlin.apply' call
    var this_49 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_49.name = 'draw blurred';
    this_49.blending = get_BLENDING_NONE();
    tmp_46.sk_1 = this_49;
    this.nk_1 = GroupCommandArr(false, [this.ok_1, MainPassCommandArr(true, [this.pk_1, this.sk_1])]);
    this.commands = mutableListOf([this.mk_1, this.nk_1]);
  }
  protoOf(ArcticScene).jm = function () {
    return this.timers;
  };
  protoOf(ArcticScene).km = function () {
    return this.cameraAnimator;
  };
  protoOf(ArcticScene).lm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(ArcticScene).mm = function () {
    return this.settings;
  };
  protoOf(ArcticScene).nm = function () {
    return this.uniformPaletteTexture;
  };
  protoOf(ArcticScene).om = function () {
    return this.uniformSkyTexture;
  };
  protoOf(ArcticScene).pm = function () {
    return this.commandClouds;
  };
  protoOf(ArcticScene).qm = function () {
    return this.commandStars;
  };
  protoOf(ArcticScene).rm = function () {
    return this.groupBirds;
  };
  protoOf(ArcticScene).sm = function () {
    return this.BIRD_FLIGHT_RADIUS;
  };
  protoOf(ArcticScene).tm = function () {
    return this.groupShips;
  };
  protoOf(ArcticScene).um = function () {
    return this.groupAnimalsAnimated;
  };
  protoOf(ArcticScene).vm = function () {
    return this.groupAnimalsSleeping;
  };
  protoOf(ArcticScene).wm = function () {
    return this.groupPenguinsIdle;
  };
  protoOf(ArcticScene).xm = function () {
    return this.groupPenguinsIdle2;
  };
  protoOf(ArcticScene).ym = function () {
    return this.groupSealIdle;
  };
  protoOf(ArcticScene).zm = function () {
    return this.groupSealWalking;
  };
  protoOf(ArcticScene).an = function () {
    return this.commandSun;
  };
  protoOf(ArcticScene).bn = function () {
    return this.commandSunLow;
  };
  protoOf(ArcticScene).cn = function () {
    return this.PIf;
  };
  protoOf(ArcticScene).updateTimers = function (time) {
    this.timers.gi(time);
    this.cameraAnimator.animate(time);
    this.animate();
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(ArcticScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(ArcticScene).initialize = function () {
  };
  protoOf(ArcticScene).applySettings = function () {
    this.mk_1.enabled = !this.settings.blurred;
    this.nk_1.enabled = this.settings.blurred;
    this.rk_1.enabled = this.settings.vignette;
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    if ((this.cameraAnimator.timer > 0.99 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().q5() < 0.5 : false) {
      this.randomCamera();
    }
  };
  protoOf(ArcticScene).animate = function () {
    this.applySettings();
    this.calculateProjection();
    var cameraPositionInterpolator = this.cameraAnimator.positionInterpolator;
    var eye = cameraPositionInterpolator.cameraPosition;
    var lookat = cameraPositionInterpolator.cameraRotation;
    if (!this.useExternalViewMatrix) {
      Matrix_getInstance().ug(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    toggleDayNightObjects(this);
    updateTimeOfDayTextures(this);
    updateSun(this);
    updateBirds(this);
    updateShips(this);
    updateAnimalsAnimated(this);
    updateAnimalsSleeping(this);
    updateWater(this);
    updateColors(this);
    this.updateMeshTransformations(this.commands);
  };
  protoOf(ArcticScene).nextCamera = function () {
    this.cameraAnimator.nextCamera();
  };
  protoOf(ArcticScene).randomCamera = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().q5() < 0.5;
    this.cameraAnimator.randomCamera();
  };
  function Seals() {
    Seals_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.apply' call
    var this_0 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_0.li_1 = new Vec3(-10197.612, -11412.881, 163.703);
    this_0.mi_1 = new Vec3(0.0, 0.0, 305.0);
    this_0.hi_1 = 21.6;
    this_0.ii_1 = 0.1;
    var tmp_0 = this_0;
    // Inline function 'kotlin.apply' call
    var this_1 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_1.li_1 = new Vec3(-11490.098, -10868.786, 163.703);
    this_1.mi_1 = new Vec3(0.0, 0.0, 180.0);
    this_1.hi_1 = 21.0;
    this_1.ii_1 = 0.2;
    var tmp_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_2.li_1 = new Vec3(-12481.07, -9990.127, 163.703);
    this_2.mi_1 = new Vec3(0.0, 0.0, 40.0);
    this_2.hi_1 = 24.0;
    this_2.ii_1 = 0.0;
    var tmp_2 = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_3.li_1 = new Vec3(-8848.467, -10551.67, 163.703);
    this_3.mi_1 = new Vec3(0.0, 0.0, 270.0);
    this_3.hi_1 = 23.0;
    this_3.ii_1 = 0.66;
    var tmp_3 = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_4.li_1 = new Vec3(-11421.474, -8197.367, 163.703);
    this_4.mi_1 = new Vec3(0.0, 0.0, 155.0);
    this_4.hi_1 = 22.0;
    this_4.ii_1 = 0.3;
    var tmp_4 = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_5.li_1 = new Vec3(-9098.065, -9784.568, 163.703);
    this_5.mi_1 = new Vec3(0.0, 0.0, 180.0);
    this_5.hi_1 = 21.0;
    this_5.ii_1 = 0.7;
    var tmp_5 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_6.li_1 = new Vec3(-8929.758, -9630.826, 163.703);
    this_6.mi_1 = new Vec3(0.0, 0.0, 260.0);
    this_6.hi_1 = 20.0;
    this_6.ii_1 = 0.2;
    var tmp_6 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_7.li_1 = new Vec3(-9159.626, -9498.492, 163.703);
    this_7.mi_1 = new Vec3(0.0, 0.0, 25.0);
    this_7.hi_1 = 22.0;
    this_7.ii_1 = 0.4;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.vl_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, this_7];
    var tmp_7 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.apply' call
    var this_8 = new SplineAnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.WALKING.<anonymous>' call
    var tmp_8 = this_8;
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_9 = new Float64Array([0.0, 0.0, -8594.068359375, -9185.310546875, -10173.7734375, -11037.0615234375, -11556.869140625, -11171.4091796875, -10388.73046875, -9319.6591796875, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_10 = new Float64Array([0.0, 0.0, -11242.3720703125, -10794.060546875, -10646.896484375, -10959.65625, -11507.3251953125, -12299.8046875, -12791.134765625, -12134.208984375, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$13 = new Float64Array([0.0, 0.0, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 0.0, 0.0]);
    tmp_8.pi_1 = Spline3D_init_$Create$(true, tmp_9, tmp_10, tmp$ret$13);
    this_8.hi_1 = 25.0;
    this_8.ii_1 = 0.4;
    var tmp_11 = this_8;
    // Inline function 'kotlin.apply' call
    var this_9 = new SplineAnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.WALKING.<anonymous>' call
    var tmp_12 = this_9;
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_13 = new Float64Array([0.0, 0.0, -11045.8798828125, -11852.0166015625, -12877.1728515625, -13320.65625, -13395.7041015625, -12947.1123046875, -12279.501953125, -11478.47265625, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_14 = new Float64Array([0.0, 0.0, -9073.04296875, -8490.494140625, -8394.025390625, -9009.2021484375, -9902.9755859375, -10920.896484375, -11452.736328125, -10402.1875, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$17 = new Float64Array([0.0, 0.0, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 0.0, 0.0]);
    tmp_12.pi_1 = Spline3D_init_$Create$(true, tmp_13, tmp_14, tmp$ret$17);
    this_9.hi_1 = 22.0;
    this_9.ii_1 = 0.6;
    var tmp_15 = this_9;
    // Inline function 'kotlin.apply' call
    var this_10 = new SplineAnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.WALKING.<anonymous>' call
    var tmp_16 = this_10;
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_17 = new Float64Array([0.0, 0.0, -10500.1298828125, -10924.8193359375, -10816.751953125, -9659.0244140625, -8474.8583984375, -8261.033203125, -8579.9658203125, -9526.828125, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_18 = new Float64Array([0.0, 0.0, -9078.6171875, -9745.982421875, -10364.9296875, -10400.5146484375, -10125.8681640625, -9503.888671875, -8930.3291015625, -8849.357421875, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$21 = new Float64Array([0.0, 0.0, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 204.815673828125, 0.0, 0.0]);
    tmp_16.pi_1 = Spline3D_init_$Create$(true, tmp_17, tmp_18, tmp$ret$21);
    this_10.hi_1 = 23.0;
    this_10.ii_1 = 0.88;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_7.wl_1 = [tmp_11, tmp_15, this_10];
  }
  var Seals_instance;
  function Seals_getInstance() {
    if (Seals_instance == null)
      new Seals();
    return Seals_instance;
  }
  var TimeOfDay_Day_instance;
  var TimeOfDay_Night_instance;
  var TimeOfDay_Sunrise_instance;
  var TimeOfDay_Sunset_instance;
  function values() {
    return [TimeOfDay_Day_getInstance(), TimeOfDay_Night_getInstance(), TimeOfDay_Sunrise_getInstance(), TimeOfDay_Sunset_getInstance()];
  }
  function valueOf(value) {
    switch (value) {
      case 'Day':
        return TimeOfDay_Day_getInstance();
      case 'Night':
        return TimeOfDay_Night_getInstance();
      case 'Sunrise':
        return TimeOfDay_Sunrise_getInstance();
      case 'Sunset':
        return TimeOfDay_Sunset_getInstance();
      default:
        TimeOfDay_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var TimeOfDay_entriesInitialized;
  function TimeOfDay_initEntries() {
    if (TimeOfDay_entriesInitialized)
      return Unit_instance;
    TimeOfDay_entriesInitialized = true;
    TimeOfDay_Day_instance = new TimeOfDay('Day', 0, 0);
    TimeOfDay_Night_instance = new TimeOfDay('Night', 1, 1);
    TimeOfDay_Sunrise_instance = new TimeOfDay('Sunrise', 2, 2);
    TimeOfDay_Sunset_instance = new TimeOfDay('Sunset', 3, 3);
  }
  function TimeOfDay(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function ArcticSettings() {
    this.cameraPeriod = 1.0;
    this.vignette = true;
    this.blurred = false;
    this.autoSwitchCameras = true;
    this.timeOfDay = TimeOfDay_Day_getInstance();
    this.clock = false;
    this.lowQuality = false;
  }
  protoOf(ArcticSettings).fn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(ArcticSettings).gn = function () {
    return this.cameraPeriod;
  };
  protoOf(ArcticSettings).hn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(ArcticSettings).in = function () {
    return this.vignette;
  };
  protoOf(ArcticSettings).jn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(ArcticSettings).kn = function () {
    return this.blurred;
  };
  protoOf(ArcticSettings).ln = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(ArcticSettings).mn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(ArcticSettings).nn = function (_set____db54di) {
    this.timeOfDay = _set____db54di;
  };
  protoOf(ArcticSettings).on = function () {
    return this.timeOfDay;
  };
  protoOf(ArcticSettings).pn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(ArcticSettings).qn = function () {
    return this.clock;
  };
  protoOf(ArcticSettings).rn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(ArcticSettings).sn = function () {
    return this.lowQuality;
  };
  function TimeOfDay_Day_getInstance() {
    TimeOfDay_initEntries();
    return TimeOfDay_Day_instance;
  }
  function TimeOfDay_Night_getInstance() {
    TimeOfDay_initEntries();
    return TimeOfDay_Night_instance;
  }
  function TimeOfDay_Sunrise_getInstance() {
    TimeOfDay_initEntries();
    return TimeOfDay_Sunrise_instance;
  }
  function TimeOfDay_Sunset_getInstance() {
    TimeOfDay_initEntries();
    return TimeOfDay_Sunset_instance;
  }
  function Shaders() {
    Shaders_instance = this;
    this.xl_1 = new Shader('Palette');
    this.yl_1 = new Shader('Diffuse');
    this.zl_1 = new Shader('DiffuseZFog');
    this.am_1 = new Shader('CausticsWater');
    this.bm_1 = new Shader('SkyDither');
    this.cm_1 = new Shader('Color');
    this.dm_1 = new Shader('ColorAnimatedTextureChunked');
    this.em_1 = new Shader('Cloud');
    this.fm_1 = new Shader('ColorAnimatedTextureChunked');
    this.gm_1 = new Shader('DiffuseAnimatedTextureChunked');
    this.hm_1 = mutableListOf([this.yl_1, this.xl_1, this.zl_1, this.am_1, this.bm_1, this.cm_1, this.dm_1, this.em_1, this.fm_1, this.gm_1]);
  }
  var Shaders_instance;
  function Shaders_getInstance() {
    if (Shaders_instance == null)
      new Shaders();
    return Shaders_instance;
  }
  function ShipConfig(spline, scale, animTimerOffset) {
    this.sl_1 = spline;
    this.tl_1 = scale;
    this.ul_1 = animTimerOffset;
  }
  function ShipsConfig() {
    ShipsConfig_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_0 = new Float64Array([0.0, 0.0, 24566.40234375, 26321.6640625, 26708.22265625, 25413.6328125, 21720.98828125, 16347.2109375, 11130.576171875, -1738.1689453125, -5963.7197265625, -10164.759765625, -14386.349609375, -19112.7109375, -23859.62109375, -27219.46875, -28770.119140625, -28933.70703125, -27569.021484375, -24096.890625, -19096.490234375, -14164.109375, -9853.759765625, -5611.431640625, -1371.3896484375, 2872.943359375, 7115.0, 11400.76953125, 16216.3984375, 21075.7578125, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_1 = new Float64Array([0.0, 0.0, -2645.7470703125, -2308.08984375, -1332.42919921875, -524.489013671875, -188.111328125, -19.454345703125, 87.28076171875, 141.75341796875, 128.7080078125, 141.283447265625, 426.818359375, 1443.571166992188, 2733.282470703125, 3168.5166015625, 1871.808227539063, -279.37744140625, -1780.083984375, -1864.28125, -1298.00048828125, -874.37158203125, -1001.830078125, -1271.9423828125, -1252.52978515625, -486.420654296875, 569.2119140625, 975.029541015625, -11.353515625, -1647.552734375, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$2 = new Float64Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    var tmp_2 = new ShipConfig(Spline3D_init_$Create$(true, tmp_0, tmp_1, tmp$ret$2), 1.1, 0.4);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_3 = new Float64Array([0.0, 0.0, 5714.380859375, 7315.091796875, 8650.72265625, 8823.93359375, 7143.5078125, 4300.67578125, 1471.7890625, -841.138671875, -3140.115234375, -5754.8447265625, -8983.2392578125, -12527.380859375, -15823.2197265625, -18887.14453125, -21702.765625, -23656.859375, -24672.4296875, -24826.474609375, -23736.755859375, -20925.265625, -16870.01171875, -12622.77734375, -8198.072265625, -3581.3828125, 219.033203125, 2683.359375, 4331.4140625, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_4 = new Float64Array([0.0, 0.0, 17442.65625, 17650.91015625, 18617.86328125, 20306.828125, 23014.0546875, 26443.2890625, 29669.087890625, 32581.82421875, 35291.12109375, 37200.40625, 37881.41015625, 37762.40625, 37531.61328125, 37789.6640625, 37935.92578125, 36856.74609375, 33521.96484375, 28961.73828125, 25152.900390625, 22777.57421875, 21153.63671875, 20211.54296875, 20346.490234375, 21163.28125, 21406.8046875, 20214.69921875, 18449.328125, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$5 = new Float64Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    var tmp_5 = new ShipConfig(Spline3D_init_$Create$(true, tmp_3, tmp_4, tmp$ret$5), 1.7, 0.6);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_6 = new Float64Array([0.0, 0.0, -16359.05859375, -14598.0546875, -13475.6875, -14188.6171875, -18206.640625, -24059.94921875, -28535.79296875, -30099.376953125, -30285.4921875, -30485.732421875, -30806.443359375, -31141.27734375, -32562.830078125, -35985.46875, -40494.81640625, -44420.37109375, -47366.64453125, -49729.125, -51023.7578125, -50949.22265625, -49806.84375, -48016.53125, -45479.21484375, -42293.97265625, -39177.921875, -36336.46875, -33564.20703125, -30962.0703125, -28666.095703125, -26540.240234375, -24277.328125, -21516.3984375, -18618.40234375, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp_7 = new Float64Array([0.0, 0.0, -28069.041015625, -26702.79296875, -23600.751953125, -20893.908203125, -19807.138671875, -19115.580078125, -17275.615234375, -13230.767578125, -8037.52099609375, -3321.68798828125, 514.55712890625, 3873.38818359375, 6335.501953125, 7855.1728515625, 8478.1279296875, 7922.24853515625, 5656.2490234375, 2211.415771484375, -1100.50830078125, -4002.49853515625, -6771.58056640625, -8927.087890625, -9960.884765625, -10381.111328125, -11231.494140625, -13150.048828125, -15498.767578125, -17407.33984375, -18208.109375, -18568.73828125, -19621.876953125, -22554.5234375, -26179.6875, 0.0, 0.0]);
    // Inline function 'kotlin.doubleArrayOf' call
    var tmp$ret$8 = new Float64Array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.rl_1 = [tmp_2, tmp_5, new ShipConfig(Spline3D_init_$Create$(true, tmp_6, tmp_7, tmp$ret$8), 1.4, 0.88)];
  }
  var ShipsConfig_instance;
  function ShipsConfig_getInstance() {
    if (ShipsConfig_instance == null)
      new ShipsConfig();
    return ShipsConfig_instance;
  }
  function Textures() {
    Textures_instance = this;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPaletteDay.<anonymous>' call
    this_0.name = 'palette-day';
    this_0.fileName = 'palette-day';
    this_0.format = TextureFormat_RGBA8_getInstance();
    this_0.minFilter = TextureFiltering_NEAREST_getInstance();
    this_0.magFilter = TextureFiltering_NEAREST_getInstance();
    this_0.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp.zk_1 = this_0;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPaletteNight.<anonymous>' call
    this_1.name = 'palette-night';
    this_1.fileName = 'palette-night';
    this_1.format = TextureFormat_RGBA8_getInstance();
    this_1.minFilter = TextureFiltering_NEAREST_getInstance();
    this_1.magFilter = TextureFiltering_NEAREST_getInstance();
    this_1.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_0.al_1 = this_1;
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_2 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPaletteSunrise.<anonymous>' call
    this_2.name = 'palette-sunrise';
    this_2.fileName = 'palette-sunrise';
    this_2.format = TextureFormat_RGBA8_getInstance();
    this_2.minFilter = TextureFiltering_NEAREST_getInstance();
    this_2.magFilter = TextureFiltering_NEAREST_getInstance();
    this_2.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_1.bl_1 = this_2;
    var tmp_2 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPaletteSunset.<anonymous>' call
    this_3.name = 'palette-sunset';
    this_3.fileName = 'palette-sunset';
    this_3.format = TextureFormat_RGBA8_getInstance();
    this_3.minFilter = TextureFiltering_NEAREST_getInstance();
    this_3.magFilter = TextureFiltering_NEAREST_getInstance();
    this_3.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_2.cl_1 = this_3;
    var tmp_3 = this;
    // Inline function 'kotlin.apply' call
    var this_4 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSkyDay.<anonymous>' call
    this_4.name = 'sky-day';
    this_4.fileName = 'sky-day';
    this_4.format = TextureFormat_RGBA8_getInstance();
    this_4.minFilter = TextureFiltering_LINEAR_getInstance();
    this_4.magFilter = TextureFiltering_LINEAR_getInstance();
    this_4.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_3.dl_1 = this_4;
    var tmp_4 = this;
    // Inline function 'kotlin.apply' call
    var this_5 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSkyNight.<anonymous>' call
    this_5.name = 'sky-night';
    this_5.fileName = 'sky-night';
    this_5.format = TextureFormat_RGBA8_getInstance();
    this_5.minFilter = TextureFiltering_LINEAR_getInstance();
    this_5.magFilter = TextureFiltering_LINEAR_getInstance();
    this_5.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_4.el_1 = this_5;
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSkySunrise.<anonymous>' call
    this_6.name = 'sky-sunrise';
    this_6.fileName = 'sky-sunrise';
    this_6.format = TextureFormat_RGBA8_getInstance();
    this_6.minFilter = TextureFiltering_LINEAR_getInstance();
    this_6.magFilter = TextureFiltering_LINEAR_getInstance();
    this_6.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_5.fl_1 = this_6;
    var tmp_6 = this;
    // Inline function 'kotlin.apply' call
    var this_7 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSkySunset.<anonymous>' call
    this_7.name = 'sky-sunset';
    this_7.fileName = 'sky-sunset';
    this_7.format = TextureFormat_RGBA8_getInstance();
    this_7.minFilter = TextureFiltering_LINEAR_getInstance();
    this_7.magFilter = TextureFiltering_LINEAR_getInstance();
    this_7.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_6.gl_1 = this_7;
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_8 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texNoise.<anonymous>' call
    this_8.name = 'blue-noise-16';
    this_8.fileName = 'blue-noise-16';
    this_8.format = TextureFormat_ASTC_getInstance();
    this_8.minFilter = TextureFiltering_NEAREST_getInstance();
    this_8.magFilter = TextureFiltering_NEAREST_getInstance();
    tmp_7.hl_1 = this_8;
    var tmp_8 = this;
    // Inline function 'kotlin.apply' call
    var this_9 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texWater.<anonymous>' call
    this_9.name = 'caustics1';
    this_9.fileName = 'caustics1';
    this_9.format = TextureFormat_ASTC_getInstance();
    this_9.minFilter = TextureFiltering_LINEAR_getInstance();
    this_9.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_9.mipmaps = 6;
    tmp_8.il_1 = this_9;
    var tmp_9 = this;
    // Inline function 'kotlin.apply' call
    var this_10 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texBird.<anonymous>' call
    this_10.name = 'bird';
    this_10.fileName = 'bird.rgba.fp16';
    this_10.format = TextureFormat_RGBA16F_getInstance();
    this_10.minFilter = TextureFiltering_NEAREST_getInstance();
    this_10.magFilter = TextureFiltering_NEAREST_getInstance();
    this_10.width = Animations_getInstance().qi_1.hb_1;
    this_10.height = Animations_getInstance().qi_1.mb_1;
    tmp_9.jl_1 = this_10;
    var tmp_10 = this;
    // Inline function 'kotlin.apply' call
    var this_11 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPenguinIdle.<anonymous>' call
    this_11.name = 'penguin-idle';
    this_11.fileName = 'penguin/idle/animal.rgba.fp16';
    this_11.format = TextureFormat_RGBA16F_getInstance();
    this_11.minFilter = TextureFiltering_NEAREST_getInstance();
    this_11.magFilter = TextureFiltering_NEAREST_getInstance();
    this_11.width = Animations_getInstance().ri_1.hb_1;
    this_11.height = Animations_getInstance().ri_1.mb_1;
    tmp_10.kl_1 = this_11;
    var tmp_11 = this;
    // Inline function 'kotlin.apply' call
    var this_12 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texPenguinIdle2.<anonymous>' call
    this_12.name = 'penguin-idle';
    this_12.fileName = 'penguin/idle2/animal.rgba.fp16';
    this_12.format = TextureFormat_RGBA16F_getInstance();
    this_12.minFilter = TextureFiltering_NEAREST_getInstance();
    this_12.magFilter = TextureFiltering_NEAREST_getInstance();
    this_12.width = Animations_getInstance().si_1.hb_1;
    this_12.height = Animations_getInstance().si_1.mb_1;
    tmp_11.ll_1 = this_12;
    var tmp_12 = this;
    // Inline function 'kotlin.apply' call
    var this_13 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSealIdle.<anonymous>' call
    this_13.name = 'seal-idle';
    this_13.fileName = 'seal/idle/animal.rgba.fp16';
    this_13.format = TextureFormat_RGBA16F_getInstance();
    this_13.minFilter = TextureFiltering_NEAREST_getInstance();
    this_13.magFilter = TextureFiltering_NEAREST_getInstance();
    this_13.width = Animations_getInstance().ti_1.hb_1;
    this_13.height = Animations_getInstance().ti_1.mb_1;
    tmp_12.ml_1 = this_13;
    var tmp_13 = this;
    // Inline function 'kotlin.apply' call
    var this_14 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Textures.texSealWalk.<anonymous>' call
    this_14.name = 'seal-walk';
    this_14.fileName = 'seal/walk/animal.rgba.fp16';
    this_14.format = TextureFormat_RGBA16F_getInstance();
    this_14.minFilter = TextureFiltering_NEAREST_getInstance();
    this_14.magFilter = TextureFiltering_NEAREST_getInstance();
    this_14.width = Animations_getInstance().ui_1.hb_1;
    this_14.height = Animations_getInstance().ui_1.mb_1;
    tmp_13.nl_1 = this_14;
    this.ol_1 = mutableListOf([this.zk_1, this.al_1, this.bl_1, this.cl_1, this.dl_1, this.el_1, this.fl_1, this.gl_1, this.hl_1, this.il_1, this.jl_1, this.kl_1, this.ll_1, this.ml_1, this.nl_1]);
    var tmp_14 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_14.pl_1 = [this.zk_1, this.al_1, this.bl_1, this.cl_1];
    var tmp_15 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_15.ql_1 = [this.dl_1, this.el_1, this.fl_1, this.gl_1];
  }
  var Textures_instance;
  function Textures_getInstance() {
    if (Textures_instance == null)
      new Textures();
    return Textures_instance;
  }
  var Timers_Camera_instance;
  var Timers_Water_instance;
  var Timers_WaterLarge_instance;
  var Timers_CloudsAnimation_instance;
  var Timers_CloudsRotation_instance;
  var Timers_BirdsFly_instance;
  var Timers_BirdWings1_instance;
  var Timers_BirdWings2_instance;
  var Timers_Ships_instance;
  var Timers_PenguinIdle_instance;
  var Timers_PenguinIdle2_instance;
  var Timers_SealIdleAnim_instance;
  var Timers_SealWalkAnim_instance;
  var Timers_SealWalkSpline_instance;
  function Companion() {
  }
  protoOf(Companion).im = function (timers) {
    timers.ci(Timers_Water_getInstance(), 720000.0);
    timers.ci(Timers_WaterLarge_getInstance(), 60000.0);
    timers.ci(Timers_CloudsRotation_getInstance(), 300000.0);
    timers.ci(Timers_CloudsAnimation_getInstance(), 15000.0);
    timers.ci(Timers_BirdWings1_getInstance(), 1000.0);
    timers.ci(Timers_BirdWings2_getInstance(), 900.0);
    timers.ci(Timers_BirdsFly_getInstance(), 75000.0);
    timers.ci(Timers_Ships_getInstance(), 200000.0);
    timers.ci(Timers_PenguinIdle_getInstance(), 5000.0);
    timers.ci(Timers_PenguinIdle2_getInstance(), 5000.0);
    timers.ci(Timers_SealIdleAnim_getInstance(), 4000.0);
    timers.ci(Timers_SealWalkAnim_getInstance(), 1900.0);
    timers.ci(Timers_SealWalkSpline_getInstance(), 114000.0);
  };
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  var Timers_entriesInitialized;
  function Timers_initEntries() {
    if (Timers_entriesInitialized)
      return Unit_instance;
    Timers_entriesInitialized = true;
    Timers_Camera_instance = new Timers('Camera', 0);
    Timers_Water_instance = new Timers('Water', 1);
    Timers_WaterLarge_instance = new Timers('WaterLarge', 2);
    Timers_CloudsAnimation_instance = new Timers('CloudsAnimation', 3);
    Timers_CloudsRotation_instance = new Timers('CloudsRotation', 4);
    Timers_BirdsFly_instance = new Timers('BirdsFly', 5);
    Timers_BirdWings1_instance = new Timers('BirdWings1', 6);
    Timers_BirdWings2_instance = new Timers('BirdWings2', 7);
    Timers_Ships_instance = new Timers('Ships', 8);
    Timers_PenguinIdle_instance = new Timers('PenguinIdle', 9);
    Timers_PenguinIdle2_instance = new Timers('PenguinIdle2', 10);
    Timers_SealIdleAnim_instance = new Timers('SealIdleAnim', 11);
    Timers_SealWalkAnim_instance = new Timers('SealWalkAnim', 12);
    Timers_SealWalkSpline_instance = new Timers('SealWalkSpline', 13);
  }
  function Timers(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function Timers_Water_getInstance() {
    Timers_initEntries();
    return Timers_Water_instance;
  }
  function Timers_WaterLarge_getInstance() {
    Timers_initEntries();
    return Timers_WaterLarge_instance;
  }
  function Timers_CloudsAnimation_getInstance() {
    Timers_initEntries();
    return Timers_CloudsAnimation_instance;
  }
  function Timers_CloudsRotation_getInstance() {
    Timers_initEntries();
    return Timers_CloudsRotation_instance;
  }
  function Timers_BirdsFly_getInstance() {
    Timers_initEntries();
    return Timers_BirdsFly_instance;
  }
  function Timers_BirdWings1_getInstance() {
    Timers_initEntries();
    return Timers_BirdWings1_instance;
  }
  function Timers_BirdWings2_getInstance() {
    Timers_initEntries();
    return Timers_BirdWings2_instance;
  }
  function Timers_Ships_getInstance() {
    Timers_initEntries();
    return Timers_Ships_instance;
  }
  function Timers_PenguinIdle_getInstance() {
    Timers_initEntries();
    return Timers_PenguinIdle_instance;
  }
  function Timers_PenguinIdle2_getInstance() {
    Timers_initEntries();
    return Timers_PenguinIdle2_instance;
  }
  function Timers_SealIdleAnim_getInstance() {
    Timers_initEntries();
    return Timers_SealIdleAnim_instance;
  }
  function Timers_SealWalkAnim_getInstance() {
    Timers_initEntries();
    return Timers_SealWalkAnim_instance;
  }
  function Timers_SealWalkSpline_getInstance() {
    Timers_initEntries();
    return Timers_SealWalkSpline_instance;
  }
  function Cameras_0() {
    Cameras_instance_0 = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_0 = [new CameraPositionPair(new CameraPosition(new Vec3(1595.2762, -1516.1268, 83.44518), new Vec3(-569.53894, -770.3358, 151.01573)), new CameraPosition(new Vec3(1957.1698, 1356.8844, 83.44518), new Vec3(-515.5615, -151.354, 151.01573)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-829.46936, -908.0382, 136.9292), new Vec3(-165.64581, 1195.0557, 251.3715)), new CameraPosition(new Vec3(1024.0853, -362.24524, 136.9292), new Vec3(1414.9342, 567.3635, 251.3715)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-243.95557, 1205.2717, 136.9292), new Vec3(362.46558, -880.0043, 251.3715)), new CameraPosition(new Vec3(-819.9841, -194.45178, 136.9292), new Vec3(991.0796, 1096.154, 251.3715)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(81.35687, -835.5989, 39.98031), new Vec3(334.3451, -294.1427, 394.6469)), new CameraPosition(new Vec3(895.4863, -925.46606, 39.98031), new Vec3(1337.5438, -802.4769, 725.81354)), 1.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.tn_1 = [tmp_0, [new CameraPositionPair(new CameraPosition(new Vec3(-842.0926, -846.5076, 129.98555), new Vec3(-674.4083, 775.07825, 47.71223)), new CameraPosition(new Vec3(-828.56775, 790.18756, 129.86708), new Vec3(940.84375, 1304.5559, 46.237785)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1442.4281, -137.39117, 400.79602), new Vec3(98.2589, -729.51196, 445.23422)), new CameraPosition(new Vec3(-165.14899, 2.8690004, 130.22337), new Vec3(1178.7565, 470.28696, 214.73752)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-451.56958, -252.30167, 587.1848), new Vec3(-898.23376, 597.8059, 38.427677)), new CameraPosition(new Vec3(1161.2458, -52.537415, 721.2996), new Vec3(1249.9236, 615.2596, 46.237785)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1809.4268, 206.302, 822.04504), new Vec3(-704.4282, -1200.5166, 570.46594)), new CameraPosition(new Vec3(485.292, 0.00439453, 654.2626), new Vec3(740.58057, 152.70099, 570.47485)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1201.3511, -321.01813, 1267.3562), new Vec3(-1091.3955, 484.66968, -120.63285)), new CameraPosition(new Vec3(348.40283, 333.19476, 531.56305), new Vec3(1243.907, 207.53552, 454.83487)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(1280.2383, 0.00817871, 765.05676), new Vec3(1020.4136, -0.0057373, 681.30115)), new CameraPosition(new Vec3(-542.4983, -0.00439453, 765.0978), new Vec3(-716.4851, 0.00195313, 656.9107)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(684.19763, -906.22656, 562.2279), new Vec3(293.5536, -235.00806, 457.9884)), new CameraPosition(new Vec3(-355.00952, 702.02734, 585.4181), new Vec3(582.56335, 400.67163, 433.59796)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(255.49573, -216.34082, 356.14874), new Vec3(621.0696, 213.13354, 377.2011)), new CameraPosition(new Vec3(-261.60974, 210.44629, 9.956253), new Vec3(444.66296, 48.16748, 614.7096)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(187.09607, -779.0669, 151.3941), new Vec3(-729.9801, -1107.8511, 366.46796)), new CameraPosition(new Vec3(181.64563, 716.58813, 151.3935), new Vec3(-921.05164, -237.90332, 366.46844)), 1.0)]];
  }
  var Cameras_instance_0;
  function Cameras_getInstance_0() {
    if (Cameras_instance_0 == null)
      new Cameras_0();
    return Cameras_instance_0;
  }
  function DrawClockCommand() {
    Command.call(this);
    this.un_1 = CommandType_CUSTOM_getInstance();
  }
  protoOf(DrawClockCommand).aa = function () {
    return this.un_1;
  };
  function BrutalismScene() {
    Scene.call(this);
    this.timers = new TimersMap();
    this.ao_1 = 1000000.0;
    this.bo_1 = 22000.0;
    this.co_1 = 3500.0;
    this.FOV_TRANSITION = 20.0;
    this.uo_1 = mutableListOf([get_HINT_VRS_NONE()]);
    this.Z_NEAR = 20.0;
    this.Z_FAR = 10000.0;
    this.FOV_LANDSCAPE = 85.0;
    this.FOV_PORTRAIT = 100.0;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new BrutalismSettings();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_0.lowQuality = false;
    this_0.cameraPeriod = 1.0;
    this_0.vignette = true;
    this_0.clock = false;
    this_0.blurred = false;
    this_0.colorMode = ColorMode_Normal_getInstance();
    this_0.autoSwitchCameras = true;
    tmp.settings = this_0;
    this.cameraAnimator = new CameraPathAnimator(this.ao_1, this.bo_1, this.co_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_0().tn_1[1]);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    this.so_1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    this.to_1 = new Vec4(0.74, 0.55, 0.3, 1.0);
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_1.color = this.so_1;
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_0.ro_1 = this_1;
    var attribs = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    // Inline function 'kotlin.apply' call
    var this_2 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_2.fileName = 'room1';
    this_2.attributes = attribs;
    var meshRoom1 = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_3.fileName = 'room2-optimized0';
    this_3.attributes = attribs;
    var meshRoom20 = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_4.fileName = 'room2-optimized1';
    this_4.attributes = attribs;
    var meshRoom21 = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_5.fileName = 'room2-optimized2';
    this_5.attributes = attribs;
    var meshRoom22 = this_5;
    this.meshes = mutableListOf([meshRoom1, meshRoom20, meshRoom21, meshRoom22]);
    // Inline function 'kotlin.apply' call
    var this_6 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_6.name = 'room1';
    this_6.fileName = 'room1';
    this_6.format = TextureFormat_ASTC_getInstance();
    this_6.mipmaps = 11;
    this_6.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.anisotropy = 3;
    var texRoom1 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_7.name = 'room20';
    this_7.fileName = 'room20';
    this_7.format = TextureFormat_ASTC_getInstance();
    this_7.mipmaps = 12;
    this_7.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_7.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_7.anisotropy = 3;
    this_7.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    var texRoom20 = this_7;
    // Inline function 'kotlin.apply' call
    var this_8 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_8.name = 'room21';
    this_8.fileName = 'room21';
    this_8.format = TextureFormat_ASTC_getInstance();
    var texRoom21 = this_8;
    // Inline function 'kotlin.apply' call
    var this_9 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_9.name = 'room22';
    this_9.fileName = 'room22';
    this_9.format = TextureFormat_ASTC_getInstance();
    var texRoom22 = this_9;
    this.textures = mutableListOf([texRoom1, texRoom20, texRoom21, texRoom22]);
    // Inline function 'kotlin.apply' call
    var this_10 = new Shader();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_10.name = 'Diffuse';
    var shaderDiffuse = this_10;
    this.shaders = mutableListOf([shaderDiffuse]);
    var stateDiffuseFp16 = new DrawMeshState(shaderDiffuse, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var txOrigin = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var txOriginRoom2 = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_11 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_11.name = 'room1';
    this_11.enabled = false;
    var tmp_2 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = new DrawTransformedMeshCommand(meshRoom1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom1)]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_12.hints = this.uo_1;
    tmp_2.commands = mutableListOf([this_12]);
    tmp_1.do_1 = this_11;
    var tmp_3 = this;
    // Inline function 'kotlin.apply' call
    var this_13 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_13.name = 'room1-blurred';
    var tmp_4 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = new DrawTransformedMeshCommand(meshRoom1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom21)]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_14.hints = mutableListOf([get_HINT_VRS_4X4()]);
    tmp_4.commands = mutableListOf([this_14]);
    tmp_3.eo_1 = this_13;
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_15 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_15.name = 'room2';
    this_15.enabled = true;
    var tmp_6 = this_15;
    // Inline function 'kotlin.apply' call
    var this_16 = new DrawTransformedMeshCommand(meshRoom20, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom20)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_16.hints = this.uo_1;
    var tmp_7 = this_16;
    // Inline function 'kotlin.apply' call
    var this_17 = new DrawTransformedMeshCommand(meshRoom21, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom21)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_17.hints = mutableListOf([get_HINT_VRS_4X4()]);
    var tmp_8 = this_17;
    // Inline function 'kotlin.apply' call
    var this_18 = new DrawTransformedMeshCommand(meshRoom22, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom22)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_18.hints = mutableListOf([get_HINT_VRS_4X4()]);
    tmp_6.commands = mutableListOf([tmp_7, tmp_8, this_18]);
    tmp_5.fo_1 = this_15;
    var tmp_9 = this;
    // Inline function 'kotlin.apply' call
    var this_19 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_19.name = 'room2-blurred';
    var tmp_10 = this_19;
    // Inline function 'kotlin.apply' call
    var this_20 = new DrawTransformedMeshCommand(meshRoom20, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom21)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_20.hints = mutableListOf([get_HINT_VRS_4X4()]);
    var tmp_11 = this_20;
    // Inline function 'kotlin.apply' call
    var this_21 = new DrawTransformedMeshCommand(meshRoom21, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom21)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_21.hints = mutableListOf([get_HINT_VRS_4X4()]);
    var tmp_12 = this_21;
    // Inline function 'kotlin.apply' call
    var this_22 = new DrawTransformedMeshCommand(meshRoom22, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(texRoom22)]), stateDiffuseFp16, txOriginRoom2);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_22.hints = mutableListOf([get_HINT_VRS_4X4()]);
    tmp_10.commands = mutableListOf([tmp_11, tmp_12, this_22]);
    tmp_9.go_1 = this_19;
    var tmp_13 = this;
    // Inline function 'kotlin.apply' call
    var this_23 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    var tmp_14 = this_23;
    // Inline function 'kotlin.apply' call
    var this_24 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_24.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_14.commands = mutableListOf([this.ro_1, this_24]);
    tmp_13.ho_1 = this_23;
    var tmp_15 = this;
    // Inline function 'kotlin.apply' call
    var this_25 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_25.name = 'bloom1';
    this_25.enabled = false;
    this_25.minSize = 170;
    this_25.brightness = 1.0;
    this_25.blurSize = BlurSize_KERNEL_5_getInstance();
    this_25.commands = mutableListOf([this.ho_1, this.eo_1]);
    this_25.id = 0;
    tmp_15.io_1 = this_25;
    var tmp_16 = this;
    // Inline function 'kotlin.apply' call
    var this_26 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_26.name = 'bloom2';
    this_26.enabled = true;
    this_26.minSize = 170;
    this_26.brightness = 1.0;
    this_26.blurSize = BlurSize_KERNEL_5_getInstance();
    this_26.commands = mutableListOf([this.ho_1, this.go_1]);
    this_26.id = 1;
    tmp_16.jo_1 = this_26;
    var tmp_17 = this;
    // Inline function 'kotlin.apply' call
    var this_27 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_27.name = 'draw bloom';
    var tmp_18 = this_27;
    // Inline function 'kotlin.apply' call
    var this_28 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>.<anonymous>' call
    this_28.enabled = true;
    this_28.equationColor = BlendingEquation_ADD_getInstance();
    this_28.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_28.destinationFactorColor = BlendingFactor_ONE_getInstance();
    tmp_18.blending = this_28;
    tmp_17.ko_1 = this_27;
    var tmp_19 = this;
    // Inline function 'kotlin.apply' call
    var this_29 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_29.name = 'draw blurred';
    this_29.blending = get_BLENDING_NONE();
    tmp_19.lo_1 = this_29;
    var tmp_20 = this;
    // Inline function 'kotlin.apply' call
    var this_30 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_30.color0 = new Vec4(0.4, 0.4, 0.4, 1.0);
    this_30.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_20.mo_1 = this_30;
    this.no_1 = new DrawClockCommand();
    this.oo_1 = GroupCommandArr(true, [this.io_1, this.jo_1, MainPassCommandArr(true, [this.ho_1, this.do_1, this.fo_1, this.ko_1, this.mo_1, this.no_1])]);
    var tmp_21 = this;
    // Inline function 'kotlin.apply' call
    var this_31 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_31.name = 'blurred-main';
    this_31.enabled = true;
    this_31.minSize = 200;
    this_31.brightness = 0.93;
    this_31.blurSize = BlurSize_KERNEL_3_getInstance();
    this_31.commands = mutableListOf([this.ho_1, this.do_1, this.fo_1, this.mo_1]);
    this_31.id = 2;
    tmp_21.qo_1 = this_31;
    this.po_1 = GroupCommandArr(true, [this.qo_1, MainPassCommandArr(true, [this.ho_1, this.lo_1])]);
    this.commands = mutableListOf([this.oo_1, this.po_1]);
  }
  protoOf(BrutalismScene).jm = function () {
    return this.timers;
  };
  protoOf(BrutalismScene).km = function () {
    return this.cameraAnimator;
  };
  protoOf(BrutalismScene).lm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(BrutalismScene).mm = function () {
    return this.settings;
  };
  protoOf(BrutalismScene).updateTimers = function (time) {
    this.timers.gi(time);
    this.cameraAnimator.animate(time);
    this.animate();
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(BrutalismScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(BrutalismScene).initialize = function () {
  };
  protoOf(BrutalismScene).applySettings = function () {
    this.oo_1.enabled = !this.settings.blurred;
    this.po_1.enabled = this.settings.blurred;
    this.io_1.blurSize = this.settings.lowQuality ? BlurSize_KERNEL_3_getInstance() : BlurSize_KERNEL_5_getInstance();
    this.jo_1.blurSize = this.settings.lowQuality ? BlurSize_KERNEL_3_getInstance() : BlurSize_KERNEL_5_getInstance();
    this.uo_1.s(0, this.settings.lowQuality ? get_HINT_VRS_2X2() : get_HINT_VRS_NONE());
    this.mo_1.enabled = this.settings.vignette;
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    this.no_1.enabled = this.settings.clock;
    if ((this.cameraAnimator.timer > 0.98 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().q5() < 0.5 : false) {
      this.randomCameraOrNextRoom();
    }
    this.ro_1.color = this.settings.colorMode.equals(ColorMode_Sepia_getInstance()) ? this.to_1 : this.so_1;
  };
  protoOf(BrutalismScene).animate = function () {
    this.applySettings();
    this.calculateProjection();
    var cameraPositionInterpolator = this.cameraAnimator.positionInterpolator;
    var eye = cameraPositionInterpolator.cameraPosition;
    var lookat = cameraPositionInterpolator.cameraRotation;
    if (!this.useExternalViewMatrix) {
      Matrix_getInstance().ug(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updateMeshTransformations(this.commands);
  };
  protoOf(BrutalismScene).nextCamera = function () {
    this.cameraAnimator.nextCamera();
  };
  protoOf(BrutalismScene).nextRoom = function () {
    if (this.do_1.enabled) {
      this.do_1.enabled = false;
      this.fo_1.enabled = true;
      this.io_1.enabled = false;
      this.jo_1.enabled = true;
      this.cameraAnimator.setCameras(Cameras_getInstance_0().tn_1[1], true);
    } else if (this.fo_1.enabled) {
      this.do_1.enabled = true;
      this.fo_1.enabled = false;
      this.io_1.enabled = true;
      this.jo_1.enabled = false;
      this.cameraAnimator.setCameras(Cameras_getInstance_0().tn_1[0], true);
    }
  };
  protoOf(BrutalismScene).nextCameraOrRoom = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    var switchRoomProbability = this.do_1.enabled ? 0.75 : 0.25;
    if (Default_getInstance().q5() < switchRoomProbability) {
      this.nextRoom();
    } else {
      this.nextCamera();
    }
  };
  protoOf(BrutalismScene).randomCameraOrNextRoom = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    var switchRoomProbability = this.do_1.enabled ? 0.75 : 0.25;
    if (Default_getInstance().q5() < switchRoomProbability) {
      this.nextRoom();
    } else {
      this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().q5() < 0.5;
      this.cameraAnimator.randomCamera();
    }
  };
  function BrutalismSettings() {
    this.lowQuality = false;
    this.cameraPeriod = 1.0;
    this.vignette = true;
    this.clock = false;
    this.blurred = false;
    this.colorMode = ColorMode_Normal_getInstance();
    this.autoSwitchCameras = true;
  }
  protoOf(BrutalismSettings).rn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(BrutalismSettings).sn = function () {
    return this.lowQuality;
  };
  protoOf(BrutalismSettings).fn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(BrutalismSettings).gn = function () {
    return this.cameraPeriod;
  };
  protoOf(BrutalismSettings).hn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(BrutalismSettings).in = function () {
    return this.vignette;
  };
  protoOf(BrutalismSettings).pn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(BrutalismSettings).qn = function () {
    return this.clock;
  };
  protoOf(BrutalismSettings).jn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(BrutalismSettings).kn = function () {
    return this.blurred;
  };
  protoOf(BrutalismSettings).vo = function (_set____db54di) {
    this.colorMode = _set____db54di;
  };
  protoOf(BrutalismSettings).wo = function () {
    return this.colorMode;
  };
  protoOf(BrutalismSettings).ln = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(BrutalismSettings).mn = function () {
    return this.autoSwitchCameras;
  };
  function Meshes_0() {
    Meshes_instance_0 = this;
    this.xo_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.yo_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6), new MeshAttribute(AttributeType_NORMAL_getInstance(), VertexFormat_HALF3_getInstance(), 10)]), 16);
    this.zo_1 = MeshConstructor2('sky', this.xo_1);
    this.ap_1 = MeshConstructor2('quad', this.xo_1);
    this.bp_1 = MeshConstructor2('plane0', this.yo_1);
    this.cp_1 = MeshConstructor2('plane1', this.yo_1);
    this.dp_1 = mutableListOf([this.zo_1, this.ap_1, this.bp_1, this.cp_1]);
  }
  var Meshes_instance_0;
  function Meshes_getInstance_0() {
    if (Meshes_instance_0 == null)
      new Meshes_0();
    return Meshes_instance_0;
  }
  function Props() {
    Props_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_0 = [new Vec3(-950.0, 0.0, 29.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_1 = [new Vec3(-1113.0, 0.0, 343.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_2 = [new Vec3(-1080.0, 0.0, 116.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_3 = [new Vec3(-1113.0, 0.0, 105.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_4 = [new Vec3(-1129.0, -986.0, 705.0), new Vec3(-1129.0, 986.0, 705.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_5 = [new Vec3(-967.0, 0.0, -196.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_6 = [new Vec3(-1422.0, -21.0, 64.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_7 = [new Vec3(-1032.0, 0.0, 46.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_8 = [new Vec3(220.0, 0.0, 116.0), new Vec3(-722.0, -368.0, 151.0), new Vec3(-722.0, 368.0, 151.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_9 = [new Vec3(-1000.0, -570.0, -58.0), new Vec3(-1000.0, 570.0, -58.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp_10 = [new Vec3(-1000.0, 0.0, 168.0)];
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.ep_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, [new Vec3(-224.0, -823.0, 515.0), new Vec3(-224.0, 823.0, 515.0)]];
    var tmp_11 = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp_11.fp_1 = new Float32Array([1.4, 1.1, 1.2, 1.5, 1.2, 1.8, 1.6, 1.1, 0.7, 1.1, 1.8, 1.2]);
  }
  var Props_instance;
  function Props_getInstance() {
    if (Props_instance == null)
      new Props();
    return Props_instance;
  }
  function applySettings($this) {
    $this.vp_1.enabled = !$this.settings.blurred;
    $this.wp_1.enabled = $this.settings.blurred;
    $this.aq_1.enabled = $this.settings.vignette;
    $this.xp_1.additionalBlur = !$this.settings.lowQuality;
  }
  function animate($this) {
    applySettings($this);
    positionCamera($this);
    $this.calculateProjection();
    calculatePlanePosition($this, $this.qq_1, 0.0);
    updatePlaneTransforms($this, true);
    updatePlaneTransforms($this, false);
    updateSky($this);
    $this.updateMeshTransformations($this.commands);
  }
  function updateSky($this) {
    var timer = $this.lp_1.ei(Timers_SwapSky_getInstance());
    if (timer > 0.1 ? timer < 0.9 : false) {
      $this.dq_1.enabled = false;
      $this.cq_1.enabled = true;
      setUniform_1($this.cq_1.uniforms.q(4), timer);
      $this.cq_1.transform.l9_1 = $this.wq_1;
    } else {
      $this.dq_1.enabled = true;
      $this.cq_1.enabled = false;
      $this.dq_1.transform.l9_1 = $this.wq_1;
    }
    if (timer > 0.5) {
      $this.texSky.id = $this.texSky2.id;
      $this.texSky.fileName = $this.texSky2.fileName;
    }
  }
  function updatePlaneTransforms($this, current) {
    var txPlane = current ? $this.lq_1 : $this.kq_1;
    var groupProps = current ? $this.jq_1 : $this.iq_1;
    var props = Props_getInstance().ep_1[current ? $this.settings.nextPlane : $this.settings.currentPlane];
    var phase = current ? 0.0 : 0.0;
    var scaleProps = Props_getInstance().fp_1[current ? $this.settings.nextPlane : $this.settings.currentPlane] * $this.qp_1;
    var timer = $this.lp_1.ei(Timers_SwapPlanes_getInstance());
    var scale = current ? MathUtils_instance.xc(0.0, 0.3, timer) : 1.0 - MathUtils_instance.xc(0.0, 1.0, timer);
    var timerOffset = MathUtils_instance.ng(0.0, 1.0, timer);
    var offsetZ = current ? 18000.0 * (1.0 - timerOffset) : timerOffset * -12000.0;
    var offsetX = current ? offsetZ * 0.25 : offsetZ * 1.3;
    txPlane.l9_1.x = $this.oq_1.x + offsetX;
    txPlane.l9_1.y = $this.oq_1.y;
    txPlane.l9_1.z = $this.oq_1.z + offsetZ;
    txPlane.m9_1.x = MathUtils_instance.og($this.pq_1);
    txPlane.n9_1.x = $this.pp_1 * scale;
    txPlane.n9_1.y = $this.pp_1 * scale;
    txPlane.n9_1.z = $this.pp_1 * scale;
    var tmp0_iterator = groupProps.commands.h();
    while (tmp0_iterator.o()) {
      var command = tmp0_iterator.p();
      command.enabled = false;
    }
    if (scale > 0.33) {
      var inductionVariable = 0;
      var last = props.length;
      while (inductionVariable < last) {
        var propIndex = inductionVariable;
        var prop = props[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        var tmp = prop.y;
        // Inline function 'kotlin.math.cos' call
        var x = $this.pq_1;
        var tmp_0 = tmp * Math.cos(x);
        var tmp_1 = prop.z;
        // Inline function 'kotlin.math.sin' call
        var x_0 = $this.pq_1;
        var propY = tmp_0 - tmp_1 * Math.sin(x_0);
        var tmp_2 = prop.z;
        // Inline function 'kotlin.math.cos' call
        var x_1 = $this.pq_1;
        var tmp_3 = tmp_2 * Math.cos(x_1);
        var tmp_4 = prop.y;
        // Inline function 'kotlin.math.sin' call
        var x_2 = $this.pq_1;
        var propZ = tmp_3 + tmp_4 * Math.sin(x_2);
        var rotation = MathUtils_instance.og($this.lp_1.ei(Timers_PropRotate_getInstance()) * $this.PIf * 2.0 + propIndex + phase);
        // Inline function 'kotlin.math.sin' call
        var x_3 = $this.lp_1.ei(Timers_PropFlicker_getInstance()) * $this.PIf * 2.0 + propIndex + phase;
        var brightness = 2.0 + Math.sin(x_3);
        var tmp_5 = groupProps.commands.q(propIndex);
        var command_0 = tmp_5 instanceof DrawTransformedMeshCommand ? tmp_5 : THROW_CCE();
        command_0.enabled = true;
        setUniform_1(command_0.uniforms.q(2), brightness);
        command_0.transform.m9_1.x = MathUtils_instance.og(rotation);
        command_0.transform.m9_1.y = 0.0;
        command_0.transform.m9_1.z = 0.0;
        command_0.transform.l9_1.x = ($this.oq_1.x + prop.x) * scale + offsetX;
        command_0.transform.l9_1.y = ($this.oq_1.y + propY) * scale;
        command_0.transform.l9_1.z = ($this.oq_1.z + propZ) * scale + offsetZ;
        command_0.transform.n9_1.x = scaleProps * scale;
        command_0.transform.n9_1.y = scaleProps * scale;
        command_0.transform.n9_1.z = scaleProps * scale;
      }
    }
  }
  function positionCamera($this) {
    if (!$this.useExternalViewMatrix) {
      var timer = $this.lp_1.ei(Timers_Camera_getInstance());
      timer = MathUtils_instance.xc(0.0, 1.0, timer);
      var angleX = $this.rq_1 + timer * ($this.tq_1 - $this.rq_1);
      var angleY = $this.sq_1 + timer * ($this.uq_1 - $this.sq_1);
      var tmp = $this.wq_1;
      // Inline function 'kotlin.math.sin' call
      tmp.x = Math.sin(angleX) * $this.vq_1;
      var tmp_0 = $this.wq_1;
      // Inline function 'kotlin.math.cos' call
      tmp_0.y = Math.cos(angleX) * $this.vq_1;
      var tmp_1 = $this.wq_1;
      // Inline function 'kotlin.math.sin' call
      tmp_1.z = Math.sin(angleY) * $this.vq_1;
      Matrix_getInstance().ug($this.matView, 0, $this.wq_1.x, $this.wq_1.y, $this.wq_1.z, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
      if (timer === 1.0) {
        $this.lp_1.fi(Timers_Camera_getInstance(), 0.0);
        randomizeCamera($this);
      }
    }
  }
  function calculatePlanePosition($this, offset, timersOffset) {
    var time1 = ($this.lp_1.ei(Timers_PlaneWonder1_getInstance()) + timersOffset) % 1.0;
    var time2 = ($this.lp_1.ei(Timers_PlaneWonder2_getInstance()) + timersOffset) % 1.0;
    var tmp = offset.x;
    // Inline function 'kotlin.math.sin' call
    var x = time1 * 3.0 * $this.PIf * 2.0;
    var tmp$ret$0 = Math.sin(x);
    $this.oq_1.x = tmp + tmp$ret$0 * $this.np_1 * 3.0;
    var tmp_0 = offset.y;
    // Inline function 'kotlin.math.cos' call
    var x_0 = time1 * 5.0 * $this.PIf * 2.0;
    var tmp$ret$1 = Math.cos(x_0);
    $this.oq_1.y = tmp_0 + tmp$ret$1 * $this.np_1;
    var tmp_1 = offset.z;
    // Inline function 'kotlin.math.cos' call
    var x_1 = time2 * $this.PIf * 2.0;
    var tmp$ret$2 = Math.cos(x_1);
    $this.oq_1.z = tmp_1 + tmp$ret$2 * $this.op_1;
    var tmp_2 = $this;
    // Inline function 'kotlin.math.sin' call
    var x_2 = $this.lp_1.ei(Timers_PlaneBanking_getInstance()) * $this.PIf * 2.0;
    tmp_2.pq_1 = Math.sin(x_2) * $this.mp_1 * 1.0;
  }
  function randomizeCamera($this) {
    $this.rq_1 = Default_getInstance().q5() * $this.PIf * 2.0;
    $this.sq_1 = (Default_getInstance().q5() - 0.3) * $this.PIf * 0.9;
    $this.tq_1 = Default_getInstance().q5() * $this.PIf * 2.0;
    $this.uq_1 = (Default_getInstance().q5() - 0.3) * $this.PIf * 0.9;
    $this.vq_1 = 2700.0 + Default_getInstance().q5() * 800.0;
  }
  function CartoonPlanesScene() {
    Scene.call(this);
    this.lp_1 = new TimersMap();
    this.mp_1 = 0.25;
    this.np_1 = 80.0;
    this.op_1 = 100.0;
    this.pp_1 = 10.0;
    this.qp_1 = 500.0;
    this.rp_1 = 1.5;
    this.sp_1 = 1000000.0;
    this.tp_1 = 29000.0;
    this.up_1 = 2600.0;
    this.kq_1 = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.pp_1, this.pp_1, this.pp_1));
    this.lq_1 = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.pp_1, this.pp_1, this.pp_1));
    this.mq_1 = mutableListOf([get_HINT_VRS_2X2()]);
    this.PIf = 3.1415927;
    var tmp = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp.nq_1 = new Float32Array([0.5]);
    this.oq_1 = new Vec3();
    this.pq_1 = 0.0;
    this.qq_1 = new Vec3(0.0, 0.0, 0.0);
    this.rq_1 = 0.0;
    this.sq_1 = 0.0;
    this.tq_1 = 0.0;
    this.uq_1 = 0.0;
    this.vq_1 = 3000.0;
    this.wq_1 = new Vec3();
    this.texSky = Textures_getInstance_0().ar_1;
    this.texSky1 = Textures_getInstance_0().yq_1;
    this.texSky2 = Textures_getInstance_0().zq_1;
    this.meshPlane1 = Meshes_getInstance_0().bp_1;
    this.meshPlane2 = Meshes_getInstance_0().cp_1;
    this.texPlane1 = Textures_getInstance_0().br_1;
    this.texPlane2 = Textures_getInstance_0().cr_1;
    this.meshes = Meshes_getInstance_0().dp_1;
    this.textures = Textures_getInstance_0().er_1;
    this.shaders = Shaders_getInstance_0().jr_1;
    Companion_instance_0.kr(this.lp_1);
    this.Z_NEAR = 30.0;
    this.Z_FAR = 30000.0;
    this.FOV_LANDSCAPE = 75.0;
    this.FOV_PORTRAIT = 120.0;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new CartoonPlanesSettings();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_0.cameraPeriod = 1.0;
    this_0.vignette = true;
    this_0.blurred = false;
    this_0.autoSwitchCameras = true;
    this_0.lowQuality = false;
    this_0.clock = false;
    tmp_0.settings = this_0;
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_1.color = new Vec4(0.0, 0.7843137254901961, 0.0, 1.0);
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_1.zp_1 = this_1;
    var txSceneObjects = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var stateSky = new DrawMeshState(Shaders_getInstance_0().gr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    this.cq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().zo_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_0().yq_1), new UniformTextureValue(Textures_getInstance_0().zq_1), new UniformTextureValue(Textures_getInstance_0().xq_1), UniformFloatValueWithArray(this.nq_1)]), stateSky, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(350.0, 350.0, 350.0)));
    var stateSkyStatic = new DrawMeshState(Shaders_getInstance_0().fr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    this.dq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().zo_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(this.texSky)]), stateSkyStatic, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(350.0, 350.0, 350.0)));
    var statePlaneDiffuse = new DrawMeshState(Shaders_getInstance_0().fr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 16));
    this.eq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().bp_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_0().br_1)]), statePlaneDiffuse, this.kq_1);
    this.gq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().cp_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_0().cr_1)]), statePlaneDiffuse, this.lq_1);
    var statePlaneOutline = new DrawMeshState(Shaders_getInstance_0().hr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_FRONT_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_NORMAL_getInstance(), 1, VertexFormat_HALF3_getInstance(), 10)]), 16));
    var tmp_2 = this;
    var tmp_3 = Meshes_getInstance_0().bp_1;
    var tmp_4 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$3 = new Float32Array([1.5]);
    var tmp_5 = UniformFloatValueWithArray(tmp$ret$3);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$4 = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    tmp_2.fq_1 = new DrawTransformedMeshCommand(tmp_3, listOf([tmp_4, tmp_5, UniformFloatValueWithArray(tmp$ret$4)]), statePlaneOutline, this.kq_1);
    var tmp_6 = this;
    var tmp_7 = Meshes_getInstance_0().cp_1;
    var tmp_8 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$5 = new Float32Array([1.5]);
    var tmp_9 = UniformFloatValueWithArray(tmp$ret$5);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$6 = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    tmp_6.hq_1 = new DrawTransformedMeshCommand(tmp_7, listOf([tmp_8, tmp_9, UniformFloatValueWithArray(tmp$ret$6)]), statePlaneOutline, this.lq_1);
    var tmp_10 = Shaders_getInstance_0().ir_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_2.enabled = true;
    this_2.equationColor = BlendingEquation_ADD_getInstance();
    this_2.sourceFactorColor = BlendingFactor_SRC_ALPHA_getInstance();
    this_2.destinationFactorColor = BlendingFactor_ONE_getInstance();
    var stateProp = new DrawMeshState(tmp_10, this_2, get_DEPTH_NO_WRITE(), CullFace_DISABLED_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var tmp_11 = this;
    var tmp_12 = Meshes_getInstance_0().ap_1;
    var tmp_13 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_14 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$8 = new Float32Array([1.5]);
    var tmp_15 = new DrawTransformedMeshCommand(tmp_12, listOf([tmp_13, tmp_14, UniformFloatValueWithArray(tmp$ret$8)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)));
    var tmp_16 = Meshes_getInstance_0().ap_1;
    var tmp_17 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_18 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$9 = new Float32Array([1.5]);
    var tmp_19 = new DrawTransformedMeshCommand(tmp_16, listOf([tmp_17, tmp_18, UniformFloatValueWithArray(tmp$ret$9)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)));
    var tmp_20 = Meshes_getInstance_0().ap_1;
    var tmp_21 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_22 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$10 = new Float32Array([1.5]);
    tmp_11.iq_1 = GroupCommandArr(true, [tmp_15, tmp_19, new DrawTransformedMeshCommand(tmp_20, listOf([tmp_21, tmp_22, UniformFloatValueWithArray(tmp$ret$10)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)))]);
    var tmp_23 = this;
    var tmp_24 = Meshes_getInstance_0().ap_1;
    var tmp_25 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_26 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$11 = new Float32Array([1.5]);
    var tmp_27 = new DrawTransformedMeshCommand(tmp_24, listOf([tmp_25, tmp_26, UniformFloatValueWithArray(tmp$ret$11)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)));
    var tmp_28 = Meshes_getInstance_0().ap_1;
    var tmp_29 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_30 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$12 = new Float32Array([1.5]);
    var tmp_31 = new DrawTransformedMeshCommand(tmp_28, listOf([tmp_29, tmp_30, UniformFloatValueWithArray(tmp$ret$12)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)));
    var tmp_32 = Meshes_getInstance_0().ap_1;
    var tmp_33 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_34 = new UniformTextureValue(Textures_getInstance_0().dr_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$13 = new Float32Array([1.5]);
    tmp_23.jq_1 = GroupCommandArr(true, [tmp_27, tmp_31, new DrawTransformedMeshCommand(tmp_32, listOf([tmp_33, tmp_34, UniformFloatValueWithArray(tmp$ret$13)]), stateProp, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.qp_1 * 3.0, this.qp_1 * 3.0, this.qp_1 * 3.0)))]);
    var tmp_35 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_3.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_35.yp_1 = GroupCommandArr(true, [this.zp_1, this_3]);
    var tmp_36 = this;
    // Inline function 'kotlin.apply' call
    var this_4 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_4.color0 = new Vec4(0.6, 0.6, 0.6, 1.0);
    this_4.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_36.aq_1 = this_4;
    this.vp_1 = GroupCommandArr(true, [MainPassCommandArr(true, [this.yp_1, this.eq_1, this.fq_1, this.gq_1, this.hq_1, this.dq_1, this.cq_1, this.iq_1, this.jq_1, this.aq_1])]);
    var tmp_37 = this;
    // Inline function 'kotlin.apply' call
    var this_5 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_5.name = 'blurred-main';
    this_5.enabled = true;
    this_5.minSize = 180;
    this_5.brightness = 0.95;
    this_5.blurSize = BlurSize_KERNEL_4_getInstance();
    this_5.commands = mutableListOf([this.yp_1, this.eq_1, this.dq_1, this.cq_1, this.aq_1]);
    tmp_37.xp_1 = this_5;
    var tmp_38 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_6.name = 'draw blurred';
    this_6.blending = get_BLENDING_NONE();
    tmp_38.bq_1 = this_6;
    this.wp_1 = GroupCommandArr(false, [this.xp_1, MainPassCommandArr(true, [this.yp_1, this.bq_1])]);
    this.commands = mutableListOf([this.vp_1, this.wp_1]);
  }
  protoOf(CartoonPlanesScene).mm = function () {
    return this.settings;
  };
  protoOf(CartoonPlanesScene).cn = function () {
    return this.PIf;
  };
  protoOf(CartoonPlanesScene).lr = function (_set____db54di) {
    this.texSky = _set____db54di;
  };
  protoOf(CartoonPlanesScene).mr = function () {
    return this.texSky;
  };
  protoOf(CartoonPlanesScene).nr = function (_set____db54di) {
    this.texSky1 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).or = function () {
    return this.texSky1;
  };
  protoOf(CartoonPlanesScene).pr = function (_set____db54di) {
    this.texSky2 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).qr = function () {
    return this.texSky2;
  };
  protoOf(CartoonPlanesScene).rr = function (_set____db54di) {
    this.meshPlane1 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).sr = function () {
    return this.meshPlane1;
  };
  protoOf(CartoonPlanesScene).tr = function (_set____db54di) {
    this.meshPlane2 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).ur = function () {
    return this.meshPlane2;
  };
  protoOf(CartoonPlanesScene).vr = function (_set____db54di) {
    this.texPlane1 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).wr = function () {
    return this.texPlane1;
  };
  protoOf(CartoonPlanesScene).xr = function (_set____db54di) {
    this.texPlane2 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).yr = function () {
    return this.texPlane2;
  };
  protoOf(CartoonPlanesScene).updateTimers = function (time) {
    this.lp_1.gi(time);
    animate(this);
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(CartoonPlanesScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(CartoonPlanesScene).initialize = function () {
    randomizeCamera(this);
  };
  protoOf(CartoonPlanesScene).changeSky = function () {
    this.lp_1.fi(Timers_SwapSky_getInstance(), 0.0);
  };
  protoOf(CartoonPlanesScene).randomizePropTexture = function () {
    var id = Default_getInstance().p5(2, 6);
    Textures_getInstance_0().dr_1.fileName = 'prop/' + id;
  };
  protoOf(CartoonPlanesScene).setPropTexture = function (id) {
    Textures_getInstance_0().dr_1.fileName = 'prop/' + id;
  };
  protoOf(CartoonPlanesScene).canChangePlanes = function () {
    return this.lp_1.ei(Timers_SwapPlanes_getInstance()) === 1.0;
  };
  protoOf(CartoonPlanesScene).changePlanes = function (plane1, plane2) {
    this.settings.currentPlane = plane1;
    this.settings.nextPlane = plane2;
    Meshes_getInstance_0().bp_1.fileName = 'plane' + plane1;
    Meshes_getInstance_0().cp_1.fileName = 'plane' + plane2;
    Textures_getInstance_0().br_1.fileName = 'plane' + plane1;
    Textures_getInstance_0().cr_1.fileName = 'plane' + plane2;
    this.lp_1.fi(Timers_SwapPlanes_getInstance(), 0.0);
    animate(this);
  };
  function CartoonPlanesSettings() {
    this.cameraPeriod = 1.0;
    this.vignette = true;
    this.blurred = false;
    this.autoSwitchCameras = true;
    this.lowQuality = false;
    this.clock = false;
    this.currentPlane = 0;
    this.nextPlane = 1;
  }
  protoOf(CartoonPlanesSettings).fn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).gn = function () {
    return this.cameraPeriod;
  };
  protoOf(CartoonPlanesSettings).hn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).in = function () {
    return this.vignette;
  };
  protoOf(CartoonPlanesSettings).jn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).kn = function () {
    return this.blurred;
  };
  protoOf(CartoonPlanesSettings).ln = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).mn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(CartoonPlanesSettings).rn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).sn = function () {
    return this.lowQuality;
  };
  protoOf(CartoonPlanesSettings).pn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).qn = function () {
    return this.clock;
  };
  protoOf(CartoonPlanesSettings).zr = function (_set____db54di) {
    this.currentPlane = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).as = function () {
    return this.currentPlane;
  };
  protoOf(CartoonPlanesSettings).bs = function (_set____db54di) {
    this.nextPlane = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).cs = function () {
    return this.nextPlane;
  };
  function Shaders_0() {
    Shaders_instance_0 = this;
    this.fr_1 = new Shader('Diffuse');
    this.gr_1 = new Shader('SkyTransition');
    this.hr_1 = new Shader('Outline');
    this.ir_1 = new Shader('Prop');
    this.jr_1 = mutableListOf([this.fr_1, this.gr_1, this.hr_1, this.ir_1]);
  }
  var Shaders_instance_0;
  function Shaders_getInstance_0() {
    if (Shaders_instance_0 == null)
      new Shaders_0();
    return Shaders_instance_0;
  }
  function Textures_0() {
    Textures_instance_0 = this;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texNoise.<anonymous>' call
    this_0.name = 'noise';
    this_0.fileName = 'noise';
    this_0.format = TextureFormat_ASTC_getInstance();
    this_0.minFilter = TextureFiltering_LINEAR_getInstance();
    this_0.magFilter = TextureFiltering_LINEAR_getInstance();
    this_0.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp.xq_1 = this_0;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texSky1.<anonymous>' call
    this_1.name = 'sky-1';
    this_1.fileName = 'sky/day/1';
    this_1.format = TextureFormat_ASTC_getInstance();
    this_1.minFilter = TextureFiltering_LINEAR_getInstance();
    this_1.magFilter = TextureFiltering_LINEAR_getInstance();
    this_1.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_0.yq_1 = this_1;
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_2 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texSky2.<anonymous>' call
    this_2.name = 'sky-2';
    this_2.fileName = 'sky/night/1';
    this_2.format = TextureFormat_ASTC_getInstance();
    this_2.minFilter = TextureFiltering_LINEAR_getInstance();
    this_2.magFilter = TextureFiltering_LINEAR_getInstance();
    this_2.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_1.zq_1 = this_2;
    var tmp_2 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texSky.<anonymous>' call
    this_3.name = 'sky';
    this_3.fileName = 'sky/night/1';
    this_3.format = TextureFormat_ASTC_getInstance();
    this_3.minFilter = TextureFiltering_LINEAR_getInstance();
    this_3.magFilter = TextureFiltering_LINEAR_getInstance();
    this_3.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp_2.ar_1 = this_3;
    var tmp_3 = this;
    // Inline function 'kotlin.apply' call
    var this_4 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texPlane1.<anonymous>' call
    this_4.name = 'plane-1';
    this_4.fileName = 'plane0';
    this_4.format = TextureFormat_ASTC_getInstance();
    this_4.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_4.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_4.wrapping = TextureWrapping_REPEAT_getInstance();
    this_4.mipmaps = 10;
    tmp_3.br_1 = this_4;
    var tmp_4 = this;
    // Inline function 'kotlin.apply' call
    var this_5 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texPlane2.<anonymous>' call
    this_5.name = 'plane-2';
    this_5.fileName = 'plane1';
    this_5.format = TextureFormat_ASTC_getInstance();
    this_5.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_5.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_5.wrapping = TextureWrapping_REPEAT_getInstance();
    this_5.mipmaps = 10;
    tmp_4.cr_1 = this_5;
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texProp.<anonymous>' call
    this_6.name = 'prop';
    this_6.fileName = 'prop/2';
    this_6.format = TextureFormat_ASTC_getInstance();
    this_6.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    this_6.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.mipmaps = 8;
    tmp_5.dr_1 = this_6;
    this.er_1 = mutableListOf([this.xq_1, this.ar_1, this.yq_1, this.zq_1, this.br_1, this.cr_1, this.dr_1]);
  }
  var Textures_instance_0;
  function Textures_getInstance_0() {
    if (Textures_instance_0 == null)
      new Textures_0();
    return Textures_instance_0;
  }
  var Timers_PropRotate_instance;
  var Timers_PropFlicker_instance;
  var Timers_PlaneWonder1_instance;
  var Timers_PlaneWonder2_instance;
  var Timers_PlaneBanking_instance;
  var Timers_Camera_instance_0;
  var Timers_SwapPlanes_instance;
  var Timers_SwapSky_instance;
  function Companion_0() {
  }
  protoOf(Companion_0).kr = function (timers) {
    timers.ci(Timers_PropRotate_getInstance(), 741000.0);
    timers.ci(Timers_PropFlicker_getInstance(), 10.0);
    timers.ci(Timers_PlaneWonder1_getInstance(), 25000.0);
    timers.ci(Timers_PlaneWonder2_getInstance(), 6000.0);
    timers.ci(Timers_PlaneBanking_getInstance(), 22800.0);
    timers.di(Timers_Camera_getInstance(), 28800.0, false);
    timers.di(Timers_SwapPlanes_getInstance(), 4000.0, false);
    timers.di(Timers_SwapSky_getInstance(), 4000.0, false);
  };
  var Companion_instance_0;
  function Companion_getInstance_0() {
    return Companion_instance_0;
  }
  var Timers_entriesInitialized_0;
  function Timers_initEntries_0() {
    if (Timers_entriesInitialized_0)
      return Unit_instance;
    Timers_entriesInitialized_0 = true;
    Timers_PropRotate_instance = new Timers_0('PropRotate', 0);
    Timers_PropFlicker_instance = new Timers_0('PropFlicker', 1);
    Timers_PlaneWonder1_instance = new Timers_0('PlaneWonder1', 2);
    Timers_PlaneWonder2_instance = new Timers_0('PlaneWonder2', 3);
    Timers_PlaneBanking_instance = new Timers_0('PlaneBanking', 4);
    Timers_Camera_instance_0 = new Timers_0('Camera', 5);
    Timers_SwapPlanes_instance = new Timers_0('SwapPlanes', 6);
    Timers_SwapSky_instance = new Timers_0('SwapSky', 7);
  }
  function Timers_0(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function Timers_PropRotate_getInstance() {
    Timers_initEntries_0();
    return Timers_PropRotate_instance;
  }
  function Timers_PropFlicker_getInstance() {
    Timers_initEntries_0();
    return Timers_PropFlicker_instance;
  }
  function Timers_PlaneWonder1_getInstance() {
    Timers_initEntries_0();
    return Timers_PlaneWonder1_instance;
  }
  function Timers_PlaneWonder2_getInstance() {
    Timers_initEntries_0();
    return Timers_PlaneWonder2_instance;
  }
  function Timers_PlaneBanking_getInstance() {
    Timers_initEntries_0();
    return Timers_PlaneBanking_instance;
  }
  function Timers_Camera_getInstance() {
    Timers_initEntries_0();
    return Timers_Camera_instance_0;
  }
  function Timers_SwapPlanes_getInstance() {
    Timers_initEntries_0();
    return Timers_SwapPlanes_instance;
  }
  function Timers_SwapSky_getInstance() {
    Timers_initEntries_0();
    return Timers_SwapSky_instance;
  }
  function Cameras_1() {
    Cameras_instance_1 = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.ds_1 = [InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(4.84, -644.785, -25.362), new Vec3(4.673, -1.741, 4.447)), new CameraPosition(new Vec3(2.56, -126.0, -8.595), new Vec3(2.533, -1.741, 3.993)), 1.0, '', false), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-137.0, -115.0, -12.0), new Vec3(3.485, -0.679, -16.321)), new CameraPosition(new Vec3(138.0, -110.0, 20.0), new Vec3(3.485, -0.679, -16.321)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(208.0, -208.0, -21.0), new Vec3(0.0, 0.0, 0.0)), new CameraPosition(new Vec3(265.0, 77.0, 22.0), new Vec3(0.0, 0.0, -35.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(347.0, 73.0, 15.0), new Vec3(161.0, -220.0, -19.0)), new CameraPosition(new Vec3(69.0, 365.0, 15.0), new Vec3(-100.0, 162.0, -18.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(147.0, 212.0, 0.0), new Vec3(20.0, -10.0, 7.0)), new CameraPosition(new Vec3(-146.0, 182.0, 30.0), new Vec3(-20.0, 4.0, -35.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-244.0, 139.0, 77.0), new Vec3(-3.0, -27.0, -37.0)), new CameraPosition(new Vec3(-151.0, -357.0, 11.0), new Vec3(20.0, -45.0, 0.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-265.0, -158.0, -20.0), new Vec3(0.0, 0.0, 32.0)), new CameraPosition(new Vec3(-95.0, -70.0, 0.0), new Vec3(9.0, -13.0, -10.0)), 1.0, '', false)];
  }
  var Cameras_instance_1;
  function Cameras_getInstance_1() {
    if (Cameras_instance_1 == null)
      new Cameras_1();
    return Cameras_instance_1;
  }
  function InteractiveCameraPositionPair_init_$Init$(start, end, speedMultiplier, name, interactive, $this) {
    CameraPositionPair.call($this, start, end, speedMultiplier);
    InteractiveCameraPositionPair.call($this);
    $this.hs_1 = name;
    $this.is_1 = interactive;
    return $this;
  }
  function InteractiveCameraPositionPair_init_$Create$(start, end, speedMultiplier, name, interactive) {
    return InteractiveCameraPositionPair_init_$Init$(start, end, speedMultiplier, name, interactive, objectCreate(protoOf(InteractiveCameraPositionPair)));
  }
  function InteractiveCameraPositionPair() {
    this.hs_1 = '';
    this.is_1 = false;
  }
  function Companion_1() {
    Companion_instance_1 = this;
    this.js_1 = new Vec4(0.55859375, 0.7578125, 0.87890625, 1.0);
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.Companion.clearColorCommand.<anonymous>' call
    this_0.color = Companion_getInstance_1().js_1;
    this_0.name = 'clear color';
    this_0.enabled = true;
    tmp.ks_1 = this_0;
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    if (Companion_instance_1 == null)
      new Companion_1();
    return Companion_instance_1;
  }
  function ExampleScene() {
    Companion_getInstance_1();
    Scene.call(this);
    this.timers = new TimersMap();
    this.qs_1 = 6.2831855;
    this.rs_1 = 1000000.0;
    this.ss_1 = 11000.0;
    this.ts_1 = 1100.0;
    this.FOV_TRANSITION = 20.0;
    this.arr1 = new Float32Array(16);
    var tmp = this;
    var tmp_0 = 0;
    // Inline function 'kotlin.arrayOfNulls' call
    var tmp_1 = fillArrayVal(Array(16), null);
    while (tmp_0 < 16) {
      tmp_1[tmp_0] = 0.0;
      tmp_0 = tmp_0 + 1 | 0;
    }
    tmp.arr2 = tmp_1;
    var tmp_2 = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp_2.arr3 = new Float32Array([0.0, 0.0, 0.0]);
    var tmp_3 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_3.arr4 = [1.0, 1.0, 1.0];
    this.map8 = mapOf([to(1, 'x'), to(2, 'y'), to(-1, 'zz')]);
    var tmp_4 = this;
    var tmp_5 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$6 = new Float32Array([0.55078125, 0.703125, 0.77734375, 1.0]);
    tmp_4.uniformsMountainsBright = listOf([tmp_5, UniformFloatValueWithArray(tmp$ret$6)]);
    var tmp_6 = this;
    var tmp_7 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$7 = new Float32Array([0.42578125, 0.62890625, 0.73828125, 1.0]);
    tmp_6.uniformsMountainsDark = listOf([tmp_7, UniformFloatValueWithArray(tmp$ret$7)]);
    var tmp_8 = this;
    var tmp_9 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$8 = new Float32Array([0.37890625, 0.375, 0.33984375, 1.0]);
    tmp_8.uniformsCenterRockBright = listOf([tmp_9, UniformFloatValueWithArray(tmp$ret$8)]);
    var tmp_10 = this;
    var tmp_11 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$9 = new Float32Array([0.26953125, 0.265625, 0.23828125, 1.0]);
    tmp_10.uniformsCenterRockDark = listOf([tmp_11, UniformFloatValueWithArray(tmp$ret$9)]);
    var tmp_12 = this;
    var tmp_13 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$10 = new Float32Array([0.08984375, 0.26953125, 0.23828125, 1.0]);
    tmp_12.uniformsHills = listOf([tmp_13, UniformFloatValueWithArray(tmp$ret$10)]);
    var tmp_14 = this;
    var tmp_15 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$11 = new Float32Array([0.15625, 0.359375, 0.25390625, 1.0]);
    tmp_14.uniformsGround1 = listOf([tmp_15, UniformFloatValueWithArray(tmp$ret$11)]);
    var tmp_16 = this;
    var tmp_17 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$12 = new Float32Array([0.33203125, 0.578125, 0.62890625, 1.0]);
    tmp_16.uniformsGround2 = listOf([tmp_17, UniformFloatValueWithArray(tmp$ret$12)]);
    var tmp_18 = this;
    var tmp_19 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$13 = new Float32Array([0.55859375, 0.7578125, 0.81640625, 1.0]);
    tmp_18.uniformsWater = listOf([tmp_19, UniformFloatValueWithArray(tmp$ret$13)]);
    var tmp_20 = this;
    var tmp_21 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$14 = new Float32Array([0.74609375, 0.85546875, 0.921875, 1.0]);
    tmp_20.uniformsWaterHighlights = listOf([tmp_21, UniformFloatValueWithArray(tmp$ret$14), UniformFloatValueWithArray(new Float32Array(1))]);
    var tmp_22 = this;
    var tmp_23 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$15 = new Float32Array([0.99609375, 0.99609375, 0.86328125, 1.0]);
    tmp_22.uniformsSkyObjects = listOf([tmp_23, UniformFloatValueWithArray(tmp$ret$15)]);
    var tmp_24 = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.texStatic.<anonymous>' call
    this_0.name = 'static';
    this_0.fileName = 'static';
    this_0.format = TextureFormat_ASTC_getInstance();
    this_0.mipmaps = 9;
    tmp_24.texStatic = this_0;
    this.uniformsDiffuseTest = listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(this.texStatic)]);
    var tmp_25 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.texFp16.<anonymous>' call
    this_1.name = 'testfp16';
    this_1.fileName = 'Alpaca/Eating/animal.rgba.fp16';
    this_1.format = TextureFormat_RGBA16F_getInstance();
    this_1.minFilter = TextureFiltering_NEAREST_getInstance();
    this_1.magFilter = TextureFiltering_NEAREST_getInstance();
    this_1.width = 362;
    this_1.height = 19;
    tmp_25.texFp16 = this_1;
    this.uniformsAnimated = listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(this.texFp16), UniformFloatValueWithArray(new Float32Array(4))]);
    this.animationAnimal = new TextureAnimationChunked(362, 362, 18);
    this.us_1 = 25000.0;
    this.vs_1 = 34000.0;
    this.ws_1 = 250000.0;
    this.xs_1 = 300000.0;
    this.ys_1 = 2500.0;
    this.zs_1 = 1000.0;
    this.at_1 = 900.0;
    this.bt_1 = 6000.0;
    this.ct_1 = 1000.0;
    this.Z_NEAR = 50.0;
    this.Z_FAR = 10000.0;
    this.FOV_LANDSCAPE = 35.0;
    this.FOV_PORTRAIT = 60.0;
    this.timers.ci(Timers_Clouds1_getInstance(), this.ws_1);
    this.timers.ci(Timers_Clouds2_getInstance(), this.xs_1);
    this.timers.ci(Timers_Water_getInstance_0(), this.ys_1);
    this.timers.ci(Timers_BirdWings1_getInstance_0(), this.zs_1);
    this.timers.ci(Timers_BirdWings2_getInstance_0(), this.at_1);
    this.timers.ci(Timers_AnimalAnimation_getInstance(), this.bt_1);
    this.timers.ci(Timers_ShootingStar_getInstance(), this.ct_1);
    this.timers.ci(Timers_BirdsFly_getInstance_0(), this.us_1);
    this.timers.ci(Timers_Camera_getInstance_0(), this.vs_1);
    this.cameraAnimator = new CameraPathAnimator(this.rs_1, this.ss_1, this.ts_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_1().ds_1);
    this.cameraAnimator.minDurationCoefficient = 2.0;
    // Inline function 'kotlin.apply' call
    var this_2 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_2.fileName = 'static';
    var meshTestDiffuse = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_3.fileName = 'Alpaca-Idle';
    var meshAnimal = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_4.fileName = 'sun';
    var meshSun = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_5.fileName = 'sun_small';
    var meshSunSmall = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_6.fileName = 'stars';
    var meshStars = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_7.fileName = 'mountains_bright';
    var tmp_26 = this_7;
    // Inline function 'kotlin.apply' call
    var this_8 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_8.fileName = 'mountains_dark';
    var tmp_27 = this_8;
    // Inline function 'kotlin.apply' call
    var this_9 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_9.fileName = 'center_rock_bright';
    var tmp_28 = this_9;
    // Inline function 'kotlin.apply' call
    var this_10 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_10.fileName = 'center_rock_dark';
    var tmp_29 = this_10;
    // Inline function 'kotlin.apply' call
    var this_11 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_11.fileName = 'ground_1';
    var tmp_30 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_12.fileName = 'ground_2';
    var tmp_31 = this_12;
    // Inline function 'kotlin.apply' call
    var this_13 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_13.fileName = 'hills';
    var tmp_32 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_14.fileName = 'water';
    var tmp_33 = this_14;
    // Inline function 'kotlin.apply' call
    var this_15 = MeshConstructor1();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_15.fileName = 'water_highlights';
    this.meshes = mutableListOf([tmp_26, tmp_27, tmp_28, tmp_29, tmp_30, tmp_31, tmp_32, tmp_33, this_15, meshTestDiffuse, meshAnimal, meshSun, meshSunSmall, meshStars]);
    this.textures = mutableListOf([this.texStatic, this.texFp16]);
    // Inline function 'kotlin.apply' call
    var this_16 = new Shader();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_16.name = 'Color';
    var shaderColor = this_16;
    // Inline function 'kotlin.apply' call
    var this_17 = new Shader();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_17.name = 'Diffuse';
    var shaderDiffuse = this_17;
    // Inline function 'kotlin.apply' call
    var this_18 = new Shader();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_18.name = 'ColorAnimatedTextureChunked';
    var shaderAnimated = this_18;
    // Inline function 'kotlin.apply' call
    var this_19 = new Shader();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_19.name = 'Water';
    var shaderWater = this_19;
    this.shaders = mutableListOf([shaderColor, shaderDiffuse, shaderAnimated, shaderWater]);
    var stateColorFp16 = new DrawMeshState(shaderColor, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    var stateColorFp16NoDepth = new DrawMeshState(shaderColor, get_BLENDING_NONE(), get_DEPTH_NO_WRITE(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    var stateDiffuseTest = new DrawMeshState(shaderDiffuse, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_FLOAT2_getInstance(), 12)]), 20));
    var stateAnimated = new DrawMeshState(shaderAnimated, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), null);
    var stateWater = new DrawMeshState(shaderWater, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    var txOrigin = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var tmp_34 = new NoopCommand();
    // Inline function 'kotlin.apply' call
    var this_20 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    var tmp_35 = this_20;
    var tmp_36 = Companion_getInstance_1().ks_1;
    // Inline function 'kotlin.apply' call
    var this_21 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>.<anonymous>' call
    this_21.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_35.commands = mutableListOf([tmp_36, this_21]);
    var tmp_37 = this_20;
    var tmp_38 = new DrawMeshCommand(meshAnimal, this.uniformsAnimated, stateAnimated);
    // Inline function 'kotlin.apply' call
    var this_22 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_22.name = 'hill';
    this_22.commands = mutableListOf([new DrawTransformedMeshCommand(this.meshes.q(2), this.uniformsCenterRockBright, stateColorFp16, txOrigin), new DrawTransformedMeshCommand(this.meshes.q(3), this.uniformsCenterRockDark, stateColorFp16, txOrigin)]);
    var tmp_39 = this_22;
    // Inline function 'kotlin.apply' call
    var this_23 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_23.name = 'grounds';
    this_23.commands = mutableListOf([new DrawTransformedMeshCommand(this.meshes.q(4), this.uniformsGround1, stateColorFp16, txOrigin), new DrawTransformedMeshCommand(this.meshes.q(6), this.uniformsHills, stateColorFp16, txOrigin), new DrawTransformedMeshCommand(this.meshes.q(5), this.uniformsGround2, stateColorFp16, txOrigin)]);
    var tmp_40 = this_23;
    // Inline function 'kotlin.apply' call
    var this_24 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_24.name = 'mountains';
    this_24.commands = mutableListOf([new DrawTransformedMeshCommand(this.meshes.q(0), this.uniformsMountainsBright, stateColorFp16, txOrigin), new DrawTransformedMeshCommand(this.meshes.q(1), this.uniformsMountainsDark, stateColorFp16, txOrigin)]);
    var tmp_41 = this_24;
    // Inline function 'kotlin.apply' call
    var this_25 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_25.name = 'water';
    this_25.commands = mutableListOf([new DrawTransformedMeshCommand(this.meshes.q(7), this.uniformsWater, stateColorFp16NoDepth, txOrigin), new DrawTransformedMeshCommand(this.meshes.q(8), this.uniformsWaterHighlights, stateWater, txOrigin)]);
    var tmp_42 = this_25;
    // Inline function 'kotlin.apply' call
    var this_26 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_26.name = 'birds';
    var tmp_43 = this_26;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_43.commands = ArrayList_init_$Create$();
    var tmp_44 = this_26;
    // Inline function 'kotlin.apply' call
    var this_27 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_27.name = 'clouds';
    var tmp_45 = this_27;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_45.commands = ArrayList_init_$Create$();
    var tmp_46 = this_27;
    // Inline function 'kotlin.apply' call
    var this_28 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_28.name = 'sky objects';
    var tmp_47 = this_28;
    // Inline function 'kotlin.apply' call
    var this_29 = new DrawTransformedMeshCommand(meshSun, this.uniformsSkyObjects, stateColorFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>.<anonymous>' call
    this_29.enabled = false;
    var tmp_48 = this_29;
    var tmp_49 = new DrawTransformedMeshCommand(meshSunSmall, this.uniformsSkyObjects, stateColorFp16, txOrigin);
    // Inline function 'kotlin.apply' call
    var this_30 = new DrawTransformedMeshCommand(meshStars, this.uniformsSkyObjects, stateColorFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>.<anonymous>' call
    this_30.enabled = false;
    tmp_47.commands = mutableListOf([tmp_48, tmp_49, this_30]);
    var tmp_50 = this_28;
    // Inline function 'kotlin.apply' call
    var this_31 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_31.name = 'shooting stars';
    var tmp_51 = this_31;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_51.commands = ArrayList_init_$Create$();
    var tmp_52 = this_31;
    var tmp_53 = new DrawMeshCommand(meshTestDiffuse, this.uniformsDiffuseTest, stateDiffuseTest);
    // Inline function 'kotlin.apply' call
    var this_32 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.ExampleScene.<anonymous>' call
    this_32.color0 = new Vec4(0.5, 0.5, 0.5, 1.0);
    this_32.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    this.commands = mutableListOf([tmp_34, tmp_37, tmp_38, tmp_39, tmp_40, tmp_41, tmp_42, tmp_44, tmp_46, tmp_50, tmp_52, tmp_53, this_32]);
  }
  protoOf(ExampleScene).jm = function () {
    return this.timers;
  };
  protoOf(ExampleScene).km = function () {
    return this.cameraAnimator;
  };
  protoOf(ExampleScene).lm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(ExampleScene).dt = function () {
    return this.arr1;
  };
  protoOf(ExampleScene).et = function () {
    return this.arr2;
  };
  protoOf(ExampleScene).ft = function () {
    return this.arr3;
  };
  protoOf(ExampleScene).gt = function (_set____db54di) {
    this.arr4 = _set____db54di;
  };
  protoOf(ExampleScene).ht = function () {
    return this.arr4;
  };
  protoOf(ExampleScene).it = function () {
    return this.map8;
  };
  protoOf(ExampleScene).jt = function () {
    return this.uniformsMountainsBright;
  };
  protoOf(ExampleScene).kt = function () {
    return this.uniformsMountainsDark;
  };
  protoOf(ExampleScene).lt = function () {
    return this.uniformsCenterRockBright;
  };
  protoOf(ExampleScene).mt = function () {
    return this.uniformsCenterRockDark;
  };
  protoOf(ExampleScene).nt = function () {
    return this.uniformsHills;
  };
  protoOf(ExampleScene).ot = function () {
    return this.uniformsGround1;
  };
  protoOf(ExampleScene).pt = function () {
    return this.uniformsGround2;
  };
  protoOf(ExampleScene).qt = function () {
    return this.uniformsWater;
  };
  protoOf(ExampleScene).rt = function () {
    return this.uniformsWaterHighlights;
  };
  protoOf(ExampleScene).st = function () {
    return this.uniformsSkyObjects;
  };
  protoOf(ExampleScene).tt = function () {
    return this.texStatic;
  };
  protoOf(ExampleScene).ut = function () {
    return this.uniformsDiffuseTest;
  };
  protoOf(ExampleScene).vt = function () {
    return this.texFp16;
  };
  protoOf(ExampleScene).wt = function () {
    return this.uniformsAnimated;
  };
  protoOf(ExampleScene).xt = function () {
    return this.animationAnimal;
  };
  protoOf(ExampleScene).updateTimers = function (time) {
    this.timers.gi(time);
    this.cameraAnimator.animate(time);
    this.animate();
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(ExampleScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(ExampleScene).initialize = function () {
  };
  protoOf(ExampleScene).animate = function () {
    this.calculateProjection();
    var cameraPositionInterpolator = this.cameraAnimator.positionInterpolator;
    var eye = cameraPositionInterpolator.cameraPosition;
    var lookat = cameraPositionInterpolator.cameraRotation;
    if (!this.useExternalViewMatrix) {
      Matrix_getInstance().ug(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updateMeshTransformations(this.commands);
    var tmp = this.uniformsDiffuseTest.q(0);
    this.setMvpUniform(tmp instanceof UniformFloatValue ? tmp : THROW_CCE(), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 8.0, 8.0, 8.0);
    // Inline function 'kotlin.math.min' call
    var a = this.timers.ei(Timers_AnimalAnimation_getInstance()) * 1.1;
    var timer = Math.min(a, 1.0);
    this.setMvpUniform(this.uniformsAnimated.q(0), 1.554, -0.796, -2.327, 0.0, 0.0, 0.0, 0.4, 0.4, 0.4);
    setUniform(this.uniformsAnimated.q(1), 0.1640625, 0.1484375, 0.1171875, 1.0);
    setUniform_2(this.uniformsAnimated.q(2), this.animationAnimal.hb_1);
    setUniform_1(this.uniformsAnimated.q(3), 1.0 / this.animationAnimal.mb_1);
    setUniform(this.uniformsAnimated.q(5), this.animationAnimal.hb_1, this.animationAnimal.jb_1, this.animationAnimal.ob(timer), this.animationAnimal.nb_1);
    setUniform_1(this.uniformsWaterHighlights.q(2), this.timers.ei(Timers_Water_getInstance_0()) * get_PI() * 2.0);
  };
  var Timers_Clouds1_instance;
  var Timers_Clouds2_instance;
  var Timers_BirdsFly_instance_0;
  var Timers_Camera_instance_1;
  var Timers_Water_instance_0;
  var Timers_BirdWings1_instance_0;
  var Timers_BirdWings2_instance_0;
  var Timers_AnimalAnimation_instance;
  var Timers_ShootingStar_instance;
  var Timers_entriesInitialized_1;
  function Timers_initEntries_1() {
    if (Timers_entriesInitialized_1)
      return Unit_instance;
    Timers_entriesInitialized_1 = true;
    Timers_Clouds1_instance = new Timers_1('Clouds1', 0);
    Timers_Clouds2_instance = new Timers_1('Clouds2', 1);
    Timers_BirdsFly_instance_0 = new Timers_1('BirdsFly', 2);
    Timers_Camera_instance_1 = new Timers_1('Camera', 3);
    Timers_Water_instance_0 = new Timers_1('Water', 4);
    Timers_BirdWings1_instance_0 = new Timers_1('BirdWings1', 5);
    Timers_BirdWings2_instance_0 = new Timers_1('BirdWings2', 6);
    Timers_AnimalAnimation_instance = new Timers_1('AnimalAnimation', 7);
    Timers_ShootingStar_instance = new Timers_1('ShootingStar', 8);
  }
  function Timers_1(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function Timers_Clouds1_getInstance() {
    Timers_initEntries_1();
    return Timers_Clouds1_instance;
  }
  function Timers_Clouds2_getInstance() {
    Timers_initEntries_1();
    return Timers_Clouds2_instance;
  }
  function Timers_BirdsFly_getInstance_0() {
    Timers_initEntries_1();
    return Timers_BirdsFly_instance_0;
  }
  function Timers_Camera_getInstance_0() {
    Timers_initEntries_1();
    return Timers_Camera_instance_1;
  }
  function Timers_Water_getInstance_0() {
    Timers_initEntries_1();
    return Timers_Water_instance_0;
  }
  function Timers_BirdWings1_getInstance_0() {
    Timers_initEntries_1();
    return Timers_BirdWings1_instance_0;
  }
  function Timers_BirdWings2_getInstance_0() {
    Timers_initEntries_1();
    return Timers_BirdWings2_instance_0;
  }
  function Timers_AnimalAnimation_getInstance() {
    Timers_initEntries_1();
    return Timers_AnimalAnimation_instance;
  }
  function Timers_ShootingStar_getInstance() {
    Timers_initEntries_1();
    return Timers_ShootingStar_instance;
  }
  function Cameras_2() {
    Cameras_instance_2 = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.yt_1 = [new CameraPositionPair(new CameraPosition(new Vec3(182.522, 451.945, 100.426994), new Vec3(95.628395, -240.9175, 179.154)), new CameraPosition(new Vec3(-343.592, 309.3397, 121.102), new Vec3(-48.3742, -284.307, 183.019)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(466.2929, -304.8695, 30.390701), new Vec3(-343.613, 27.9626, 220.6635)), new CameraPosition(new Vec3(563.2295, 19.3432, 24.534698), new Vec3(-218.45789, 183.19339, 193.65689)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-17.8381, -512.5913, 60.937397), new Vec3(-276.7568, 195.7981, 179.154)), new CameraPosition(new Vec3(502.0434, -225.924, 73.5525), new Vec3(-59.8787, 269.7749, 205.40071)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-620.36957, -208.8635, 52.049202), new Vec3(216.4319, -70.2999, 243.01979)), new CameraPosition(new Vec3(-536.29553, -347.5239, 66.9248), new Vec3(245.4221, 141.5389, 220.25499)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-405.834, 809.1909, 140.3126), new Vec3(195.42691, -167.5669, 264.4845)), new CameraPosition(new Vec3(-586.92596, -130.8418, 24.389801), new Vec3(195.42691, -167.5669, 220.6635)), 1.0)];
  }
  var Cameras_instance_2;
  function Cameras_getInstance_2() {
    if (Cameras_instance_2 == null)
      new Cameras_2();
    return Cameras_instance_2;
  }
  function Meshes_1() {
    Meshes_instance_1 = this;
    this.zt_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.au_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0)), 8);
    this.bu_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.cu_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6), new MeshAttribute(AttributeType_NORMAL_getInstance(), VertexFormat_HALF3_getInstance(), 10)]), 16);
    this.du_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_UBYTE2_NORMALIZED_getInstance(), 6)]), 8);
    this.eu_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.fu_1 = MeshConstructor2('sky', this.zt_1);
    this.gu_1 = MeshConstructor2('stars', this.bu_1);
    this.hu_1 = MeshConstructor2('building-1', this.cu_1);
    this.iu_1 = MeshConstructor2('buildings-distant', this.du_1);
    this.ju_1 = MeshConstructor2('red-lamps', this.au_1);
    this.ku_1 = MeshConstructor2('islands', this.au_1);
    this.lu_1 = MeshConstructor2('water', this.au_1);
    this.mu_1 = MeshConstructor2('neon-signs', this.du_1);
    this.nu_1 = MeshConstructor2('red-lights', this.eu_1);
    this.ou_1 = mutableListOf([this.fu_1, this.gu_1, this.hu_1, this.iu_1, this.ju_1, this.ku_1, this.lu_1, this.mu_1, this.nu_1]);
  }
  var Meshes_instance_1;
  function Meshes_getInstance_1() {
    if (Meshes_instance_1 == null)
      new Meshes_1();
    return Meshes_instance_1;
  }
  function SkyscrapersScene() {
    Scene.call(this);
    this.uu_1 = new TimersMap();
    this.vu_1 = 1000000.0;
    this.wu_1 = 29000.0;
    this.xu_1 = 2600.0;
    this.hv_1 = mutableListOf([get_HINT_VRS_2X2()]);
    this.iv_1 = 100.0;
    this.PIf = 3.1415927;
    var tmp = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp.jv_1 = new Float32Array([0.145, 0.137, 0.141, 1.0]);
    this.kv_1 = 2300.0;
    this.lv_1 = 2500.0;
    var tmp_0 = this;
    // Inline function 'kotlin.arrayOf' call
    var tmp_1 = UniformFloatValueWithArray(this.jv_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$1 = new Float32Array([this.kv_1]);
    var tmp_2 = UniformFloatValueWithArray(tmp$ret$1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$2 = new Float32Array([this.lv_1]);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_0.mv_1 = [tmp_1, tmp_2, UniformFloatValueWithArray(tmp$ret$2)];
    this.nv_1 = 990.0;
    var tmp_3 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$6 = new Float32Array([3.0]);
    var tmp_4 = UniformFloatValueWithArray(tmp$ret$6);
    var tmp_5 = new UniformTextureValue(Textures_getInstance_1().dw_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$7 = new Float32Array([1.2, 1.2, 1.2, 1.0]);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_3.uv_1 = [tmp_4, tmp_5, UniformFloatValueWithArray(tmp$ret$7)];
    this.meshes = Meshes_getInstance_1().ou_1;
    this.textures = Textures_getInstance_1().fw_1;
    this.shaders = Shaders_getInstance_1().ow_1;
    Companion_instance_2.pw(this.uu_1);
    this.Z_NEAR = 100.0;
    this.Z_FAR = 20000.0;
    this.FOV_LANDSCAPE = 25.0;
    this.FOV_PORTRAIT = 25.0;
    var tmp_6 = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new SkyscrapersSettings();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_0.cameraPeriod = 1.0;
    this_0.vignette = true;
    this_0.blurred = false;
    this_0.autoSwitchCameras = true;
    this_0.lowQuality = false;
    this_0.clock = false;
    tmp_6.settings = this_0;
    this.cameraAnimator = new CameraPathAnimator(this.vu_1, this.wu_1, this.xu_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_2().yt_1);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_1.color = new Vec4(0.0, 0.0392156862745098, 0.0784313725490196, 1.0);
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_7.dv_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_2.color = new Vec4(0.0, 0.0, 0.0, 1.0);
    this_2.name = 'clear color bloom';
    this_2.enabled = true;
    var clearColorBloomCommand = this_2;
    var txSceneObjects = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1));
    var stateSky = new DrawMeshState(Shaders_getInstance_1().hw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var commandSky = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().fu_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().vv_1), new UniformTextureValue(Textures_getInstance_1().wv_1)]), stateSky, txSceneObjects);
    var stateStars = new DrawMeshState(Shaders_getInstance_1().iw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0)), 12));
    var tmp_8 = this;
    // Inline function 'kotlin.apply' call
    var tmp_9 = Meshes_getInstance_1().gu_1;
    var tmp_10 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$14 = new Float32Array([0.35, 0.35, 0.35, 1.0]);
    var this_3 = new DrawTransformedMeshCommand(tmp_9, listOf([tmp_10, UniformFloatValueWithArray(tmp$ret$14)]), stateStars, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(0.055, 0.055, 0.055)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_3.hints = this.hv_1;
    tmp_8.commandStars = this_3;
    var stateBuilding = new DrawMeshState(Shaders_getInstance_1().jw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6), new VertexAttribute(AttributeType_NORMAL_getInstance(), 2, VertexFormat_HALF3_getInstance(), 10)]), 16));
    var tmp_11 = this;
    // Inline function 'kotlin.apply' call
    var tmp_12 = Meshes_getInstance_1().hu_1;
    var tmp_13 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_14 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$16 = new Float32Array([0.707106, 0.707106, 0.0]);
    var tmp_15 = UniformFloatValueWithArray(tmp$ret$16);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$17 = new Float32Array([0.05, 0.6]);
    var tmp_16 = UniformFloatValueWithArray(tmp$ret$17);
    var tmp_17 = UniformFloatValueWithArray(new Float32Array(3));
    var tmp_18 = new UniformTextureValue(Textures_getInstance_1().xv_1);
    var tmp_19 = new UniformTextureValue(Textures_getInstance_1().yv_1);
    var tmp_20 = new UniformTextureValue(Textures_getInstance_1().zv_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$18 = new Float32Array([0.33, 0.33, 0.33, 1.0]);
    var tmp_21 = UniformFloatValueWithArray(tmp$ret$18);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$19 = new Float32Array([0.3, 0.3, 0.3, 1.0]);
    var tmp_22 = UniformFloatValueWithArray(tmp$ret$19);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$20 = new Float32Array([1.8]);
    var tmp_23 = UniformFloatValueWithArray(tmp$ret$20);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$21 = new Float32Array([0.0]);
    var this_4 = DrawStaticMeshCommandConstructor(tmp_12, listOf([tmp_13, tmp_14, tmp_15, tmp_16, tmp_17, tmp_18, tmp_19, tmp_20, tmp_21, tmp_22, tmp_23, UniformFloatValueWithArray(tmp$ret$21)]), stateBuilding, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_4.indexUniformModel = 1;
    tmp_11.commandBuildings = this_4;
    var tmp_24 = this;
    // Inline function 'kotlin.apply' call
    var tmp_25 = Meshes_getInstance_1().hu_1;
    var tmp_26 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_27 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$23 = new Float32Array([0.707106, 0.707106, 0.0]);
    var tmp_28 = UniformFloatValueWithArray(tmp$ret$23);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$24 = new Float32Array([0.05, 0.6]);
    var tmp_29 = UniformFloatValueWithArray(tmp$ret$24);
    var tmp_30 = UniformFloatValueWithArray(new Float32Array(3));
    var tmp_31 = new UniformTextureValue(Textures_getInstance_1().xv_1);
    var tmp_32 = new UniformTextureValue(Textures_getInstance_1().yv_1);
    var tmp_33 = new UniformTextureValue(Textures_getInstance_1().zv_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$25 = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    var tmp_34 = UniformFloatValueWithArray(tmp$ret$25);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$26 = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    var tmp_35 = UniformFloatValueWithArray(tmp$ret$26);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$27 = new Float32Array([2.0]);
    var tmp_36 = UniformFloatValueWithArray(tmp$ret$27);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$28 = new Float32Array([0.0]);
    var this_5 = DrawStaticMeshCommandConstructor(tmp_25, listOf([tmp_26, tmp_27, tmp_28, tmp_29, tmp_30, tmp_31, tmp_32, tmp_33, tmp_34, tmp_35, tmp_36, UniformFloatValueWithArray(tmp$ret$28)]), stateBuilding, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_5.indexUniformModel = 1;
    tmp_24.commandBuildingsBloom = this_5;
    var stateRed = new DrawMeshState(Shaders_getInstance_1().iw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    // Inline function 'kotlin.apply' call
    var tmp_37 = Meshes_getInstance_1().ju_1;
    var tmp_38 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$30 = new Float32Array([1.0, 0.3, 0.3, 1.0]);
    var this_6 = new DrawTransformedMeshCommand(tmp_37, listOf([tmp_38, UniformFloatValueWithArray(tmp$ret$30)]), stateRed, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_6.hints = this.hv_1;
    var commandRed = this_6;
    var stateDistant = new DrawMeshState(Shaders_getInstance_1().kw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_BYTE2_NORMALIZED_getInstance(), 6)]), 8));
    var commandBuildingsDistant = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().iu_1, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().aw_1)], this.mv_1])), stateDistant, txSceneObjects);
    var commandBuildingsDistant2 = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().iu_1, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().aw_1)], this.mv_1])), stateDistant, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 180.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    var stateGround = new DrawMeshState(Shaders_getInstance_1().lw_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    var tmp_39 = Meshes_getInstance_1().ku_1;
    var tmp_40 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$32 = new Float32Array([0.1171875, 0.1171875, 0.1171875, 1.0]);
    var commandIslands1 = DrawStaticMeshCommandConstructor(tmp_39, listOf(arrayConcat([[tmp_40, UniformFloatValueWithArray(tmp$ret$32)], this.mv_1])), stateGround, txSceneObjects);
    var tmp_41 = Meshes_getInstance_1().lu_1;
    var tmp_42 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$33 = new Float32Array([0.0, 0.01953125, 0.01953125, 1.0]);
    var commandWater = DrawStaticMeshCommandConstructor(tmp_41, listOf(arrayConcat([[tmp_42, UniformFloatValueWithArray(tmp$ret$33)], this.mv_1])), stateGround, txSceneObjects);
    var tmp_43 = Shaders_getInstance_1().gw_1;
    // Inline function 'kotlin.apply' call
    var this_7 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_7.enabled = true;
    this_7.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_7.destinationFactorColor = BlendingFactor_ONE_getInstance();
    this_7.isSeparateAlpha = false;
    var stateNeon = new DrawMeshState(tmp_43, this_7, get_DEPTH_NO_WRITE(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_UBYTE2_NORMALIZED_getInstance(), 6)]), 8));
    var commandNeon = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().mu_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().bw_1)]), stateNeon, txSceneObjects);
    var commandNeonBloom = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().mu_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().ew_1)]), stateNeon, txSceneObjects);
    var tmp_44 = Shaders_getInstance_1().mw_1;
    // Inline function 'kotlin.apply' call
    var this_8 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_8.enabled = true;
    this_8.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_8.destinationFactorColor = BlendingFactor_ONE_getInstance();
    this_8.isSeparateAlpha = false;
    var stateRedSprites = new DrawMeshState(tmp_44, this_8, get_DEPTH_NO_WRITE(), CullFace_DISABLED_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0)), 12));
    // Inline function 'kotlin.apply' call
    var tmp_45 = Meshes_getInstance_1().nu_1;
    var tmp_46 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$36 = new Float32Array([4.0]);
    var tmp_47 = UniformFloatValueWithArray(tmp$ret$36);
    var tmp_48 = new UniformTextureValue(Textures_getInstance_1().cw_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$37 = new Float32Array([1.0, 0.2, 0.2, 1.0]);
    var this_9 = DrawStaticMeshCommandConstructor(tmp_45, listOf([tmp_46, tmp_47, tmp_48, UniformFloatValueWithArray(tmp$ret$37)]), stateRedSprites, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_9.primitiveType = PrimitiveType_POINTS_getInstance();
    var commandRedSprites = this_9;
    var tmp_49 = Shaders_getInstance_1().nw_1;
    // Inline function 'kotlin.apply' call
    var this_10 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_10.enabled = true;
    this_10.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_10.destinationFactorColor = BlendingFactor_ONE_getInstance();
    this_10.isSeparateAlpha = false;
    var statePlanes = new DrawMeshState(tmp_49, this_10, get_DEPTH_NO_WRITE(), CullFace_DISABLED_getInstance(), null);
    var tmp_50 = this;
    // Inline function 'kotlin.apply' call
    var this_11 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 380.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_11.primitiveType = PrimitiveType_POINTS_getInstance();
    this_11.primitiveCount = 1;
    tmp_50.ov_1 = this_11;
    var tmp_51 = this;
    // Inline function 'kotlin.apply' call
    var this_12 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 400.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_12.primitiveType = PrimitiveType_POINTS_getInstance();
    this_12.primitiveCount = 1;
    tmp_51.pv_1 = this_12;
    var tmp_52 = this;
    // Inline function 'kotlin.apply' call
    var this_13 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 350.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_13.primitiveType = PrimitiveType_POINTS_getInstance();
    this_13.primitiveCount = 1;
    tmp_52.qv_1 = this_13;
    var tmp_53 = this;
    // Inline function 'kotlin.apply' call
    var this_14 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 450.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_14.primitiveType = PrimitiveType_POINTS_getInstance();
    this_14.primitiveCount = 1;
    tmp_53.rv_1 = this_14;
    var tmp_54 = this;
    // Inline function 'kotlin.apply' call
    var this_15 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 430.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_15.primitiveType = PrimitiveType_POINTS_getInstance();
    this_15.primitiveCount = 1;
    tmp_54.sv_1 = this_15;
    var tmp_55 = this;
    // Inline function 'kotlin.apply' call
    var this_16 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.uv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 500.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.iv_1, this.iv_1, this.iv_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_16.primitiveType = PrimitiveType_POINTS_getInstance();
    this_16.primitiveCount = 1;
    tmp_55.tv_1 = this_16;
    var tmp_56 = this;
    // Inline function 'kotlin.apply' call
    var this_17 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_17.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_56.cv_1 = GroupCommandArr(true, [this.dv_1, this_17]);
    // Inline function 'kotlin.apply' call
    var this_18 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_18.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    var groupClearBloom = GroupCommandArr(true, [clearColorBloomCommand, this_18]);
    var tmp_57 = this;
    // Inline function 'kotlin.apply' call
    var this_19 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_19.color0 = new Vec4(0.45, 0.45, 0.45, 1.0);
    this_19.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_57.ev_1 = this_19;
    var groupBloomPass = GroupCommandArr(true, [this.commandBuildingsBloom, commandRedSprites, commandNeonBloom]);
    var tmp_58 = this;
    // Inline function 'kotlin.apply' call
    var this_20 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_20.name = 'bloom-objects';
    this_20.enabled = true;
    this_20.minSize = 180;
    this_20.brightness = 1.0;
    this_20.blurSize = BlurSize_KERNEL_4_getInstance();
    this_20.commands = mutableListOf([groupClearBloom, groupBloomPass]);
    this_20.id = 0;
    tmp_58.bv_1 = this_20;
    var tmp_59 = this;
    // Inline function 'kotlin.apply' call
    var this_21 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_21.name = 'draw bloom';
    var tmp_60 = this_21;
    // Inline function 'kotlin.apply' call
    var this_22 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>.<anonymous>' call
    this_22.enabled = true;
    this_22.equationColor = BlendingEquation_ADD_getInstance();
    this_22.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_22.destinationFactorColor = BlendingFactor_ONE_getInstance();
    tmp_60.blending = this_22;
    tmp_59.gv_1 = this_21;
    this.yu_1 = GroupCommandArr(true, [this.bv_1, MainPassCommandArr(true, [this.cv_1, this.commandBuildings, commandRed, commandBuildingsDistant, commandBuildingsDistant2, commandIslands1, commandWater, this.commandStars, commandSky, this.ov_1, this.pv_1, this.qv_1, this.rv_1, this.sv_1, this.tv_1, commandNeon, this.gv_1, this.ev_1])]);
    var tmp_61 = this;
    // Inline function 'kotlin.apply' call
    var this_23 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_23.name = 'blurred-main';
    this_23.enabled = true;
    this_23.minSize = 180;
    this_23.brightness = 0.95;
    this_23.blurSize = BlurSize_KERNEL_4_getInstance();
    this_23.commands = mutableListOf([groupClearBloom, this.commandBuildings, commandBuildingsDistant, commandBuildingsDistant2, commandIslands1, commandWater, commandSky, commandNeon, this.ev_1]);
    tmp_61.av_1 = this_23;
    var tmp_62 = this;
    // Inline function 'kotlin.apply' call
    var this_24 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_24.name = 'draw blurred';
    this_24.blending = get_BLENDING_NONE();
    tmp_62.fv_1 = this_24;
    this.zu_1 = GroupCommandArr(false, [this.av_1, MainPassCommandArr(true, [this.cv_1, this.fv_1])]);
    this.commands = mutableListOf([this.yu_1, this.zu_1]);
  }
  protoOf(SkyscrapersScene).km = function () {
    return this.cameraAnimator;
  };
  protoOf(SkyscrapersScene).mm = function () {
    return this.settings;
  };
  protoOf(SkyscrapersScene).qm = function () {
    return this.commandStars;
  };
  protoOf(SkyscrapersScene).qw = function () {
    return this.commandBuildings;
  };
  protoOf(SkyscrapersScene).rw = function () {
    return this.commandBuildingsBloom;
  };
  protoOf(SkyscrapersScene).cn = function () {
    return this.PIf;
  };
  protoOf(SkyscrapersScene).updateTimers = function (time) {
    this.uu_1.gi(time);
    this.cameraAnimator.animate(time);
    this.animate();
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(SkyscrapersScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(SkyscrapersScene).initialize = function () {
  };
  protoOf(SkyscrapersScene).applySettings = function () {
    this.yu_1.enabled = !this.settings.blurred;
    this.zu_1.enabled = this.settings.blurred;
    this.ev_1.enabled = this.settings.vignette;
    this.av_1.additionalBlur = !this.settings.lowQuality;
    this.bv_1.additionalBlur = !this.settings.lowQuality;
    setUniform_1(this.commandBuildings.uniforms.q(11), 1.0 - this.settings.lights);
    setUniform_1(this.commandBuildingsBloom.uniforms.q(11), 1.0 - this.settings.lights);
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    if ((this.cameraAnimator.timer > 0.99 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().q5() < 0.5 : false) {
      this.randomCamera();
    }
  };
  protoOf(SkyscrapersScene).animate = function () {
    this.applySettings();
    this.calculateProjection();
    var cameraPositionInterpolator = this.cameraAnimator.positionInterpolator;
    var eye = cameraPositionInterpolator.cameraPosition;
    var lookat = cameraPositionInterpolator.cameraRotation;
    if (!this.useExternalViewMatrix) {
      Matrix_getInstance().ug(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updatePlanes();
    this.updateMeshTransformations(this.commands);
    setUniform_3(this.commandBuildings.uniforms.q(4), eye);
    setUniform_3(this.commandBuildingsBloom.uniforms.q(4), eye);
  };
  protoOf(SkyscrapersScene).updatePlanes = function () {
    var angle1 = this.uu_1.ei(Timers_Planes1_getInstance()) * this.PIf * 2.0;
    var angle2 = this.uu_1.ei(Timers_Planes2_getInstance()) * this.PIf * 2.0;
    this.updatePlanePosition(angle1, 0.0, 0.0, this.ov_1.transform.l9_1);
    this.updatePlanePosition(-angle2 - this.PIf, 0.0, -400.0, this.pv_1.transform.l9_1);
    this.updatePlanePosition(-angle1 - this.PIf, 0.0, 300.0, this.qv_1.transform.l9_1);
    this.updatePlanePosition(angle2, 100.0, 300.0, this.rv_1.transform.l9_1);
    this.updatePlanePosition(angle1 + this.PIf / 2.0, 100.0, 300.0, this.sv_1.transform.l9_1);
    this.updatePlanePosition(angle2 + this.PIf / 1.5, 100.0, 300.0, this.tv_1.transform.l9_1);
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.min' call
    var a = this.viewportWidth;
    var b = this.viewportHeight;
    var b_0 = Math.min(a, b) / 300.0;
    var size = Math.max(2.5, b_0);
    setUniform_1(this.ov_1.uniforms.q(1), size);
  };
  protoOf(SkyscrapersScene).updatePlanePosition = function (angle, centerX, centerY, result) {
    // Inline function 'kotlin.math.sin' call
    result.x = Math.sin(angle) * this.nv_1 + centerX;
    // Inline function 'kotlin.math.cos' call
    result.y = Math.cos(angle) * this.nv_1 + centerY;
  };
  protoOf(SkyscrapersScene).nextCamera = function () {
    this.cameraAnimator.nextCamera();
  };
  protoOf(SkyscrapersScene).randomCamera = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().q5() < 0.5;
    this.cameraAnimator.randomCamera();
  };
  protoOf(SkyscrapersScene).changeSpeed = function (impulse) {
    this.cameraAnimator.changeDirection(impulse);
  };
  function SkyscrapersSettings() {
    this.cameraPeriod = 1.0;
    this.vignette = true;
    this.blurred = false;
    this.autoSwitchCameras = true;
    this.lowQuality = false;
    this.clock = false;
    this.lights = 1.0;
  }
  protoOf(SkyscrapersSettings).fn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(SkyscrapersSettings).gn = function () {
    return this.cameraPeriod;
  };
  protoOf(SkyscrapersSettings).hn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(SkyscrapersSettings).in = function () {
    return this.vignette;
  };
  protoOf(SkyscrapersSettings).jn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(SkyscrapersSettings).kn = function () {
    return this.blurred;
  };
  protoOf(SkyscrapersSettings).ln = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(SkyscrapersSettings).mn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(SkyscrapersSettings).rn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(SkyscrapersSettings).sn = function () {
    return this.lowQuality;
  };
  protoOf(SkyscrapersSettings).pn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(SkyscrapersSettings).qn = function () {
    return this.clock;
  };
  protoOf(SkyscrapersSettings).sw = function (_set____db54di) {
    this.lights = _set____db54di;
  };
  protoOf(SkyscrapersSettings).tw = function () {
    return this.lights;
  };
  function Shaders_1() {
    Shaders_instance_1 = this;
    this.gw_1 = new Shader('Diffuse');
    this.hw_1 = new Shader('SkyDither');
    this.iw_1 = new Shader('Color');
    this.jw_1 = new Shader('Building');
    this.kw_1 = new Shader('DiffuseFog');
    this.lw_1 = new Shader('ColorFog');
    this.mw_1 = new Shader('PointSpritesColored');
    this.nw_1 = new Shader('PointSpriteColored');
    this.ow_1 = mutableListOf([this.gw_1, this.hw_1, this.iw_1, this.jw_1, this.kw_1, this.lw_1, this.mw_1, this.nw_1]);
  }
  var Shaders_instance_1;
  function Shaders_getInstance_1() {
    if (Shaders_instance_1 == null)
      new Shaders_1();
    return Shaders_instance_1;
  }
  function Textures_1() {
    Textures_instance_1 = this;
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texSky.<anonymous>' call
    this_0.name = 'sky-night';
    this_0.fileName = 'sky-night';
    this_0.format = TextureFormat_ASTC_getInstance();
    this_0.minFilter = TextureFiltering_LINEAR_getInstance();
    this_0.magFilter = TextureFiltering_LINEAR_getInstance();
    this_0.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    tmp.vv_1 = this_0;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texNoise.<anonymous>' call
    this_1.name = 'blue-noise-16';
    this_1.fileName = 'blue-noise-16';
    this_1.format = TextureFormat_ASTC_getInstance();
    this_1.minFilter = TextureFiltering_NEAREST_getInstance();
    this_1.magFilter = TextureFiltering_NEAREST_getInstance();
    tmp_0.wv_1 = this_1;
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_2 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texBuildingsDiffuse.<anonymous>' call
    this_2.name = 'diffuse2';
    this_2.fileName = 'diffuse2';
    this_2.format = TextureFormat_ASTC_getInstance();
    this_2.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_2.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_2.mipmaps = 11;
    tmp_1.xv_1 = this_2;
    var tmp_2 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texBuildingsEmission.<anonymous>' call
    this_3.name = 'emission2';
    this_3.fileName = 'emission2';
    this_3.format = TextureFormat_ASTC_getInstance();
    this_3.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_3.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_3.mipmaps = 11;
    tmp_2.yv_1 = this_3;
    var tmp_3 = this;
    // Inline function 'kotlin.apply' call
    var this_4 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texBuildingsCubemap.<anonymous>' call
    this_4.type = TextureType_CUBEMAP_getInstance();
    this_4.name = 'cubemaps/1/sky';
    this_4.fileName = 'cubemaps/1/sky';
    this_4.format = TextureFormat_ASTC_getInstance();
    this_4.minFilter = TextureFiltering_LINEAR_getInstance();
    this_4.magFilter = TextureFiltering_LINEAR_getInstance();
    tmp_3.zv_1 = this_4;
    var tmp_4 = this;
    // Inline function 'kotlin.apply' call
    var this_5 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texBuildingsDistant.<anonymous>' call
    this_5.name = 'distant';
    this_5.fileName = 'distant';
    this_5.format = TextureFormat_ASTC_getInstance();
    this_5.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_5.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_5.mipmaps = 8;
    tmp_4.aw_1 = this_5;
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texNeon.<anonymous>' call
    this_6.name = 'neon';
    this_6.fileName = 'neon';
    this_6.format = TextureFormat_ASTC_getInstance();
    this_6.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.mipmaps = 9;
    tmp_5.bw_1 = this_6;
    var tmp_6 = this;
    // Inline function 'kotlin.apply' call
    var this_7 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texFlare.<anonymous>' call
    this_7.name = 'flare';
    this_7.fileName = 'flare';
    this_7.format = TextureFormat_ASTC_getInstance();
    this_7.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_7.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_7.mipmaps = 3;
    tmp_6.cw_1 = this_7;
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_8 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texDust.<anonymous>' call
    this_8.name = 'dust';
    this_8.fileName = 'dust';
    this_8.format = TextureFormat_ASTC_getInstance();
    this_8.minFilter = TextureFiltering_NEAREST_getInstance();
    this_8.magFilter = TextureFiltering_NEAREST_getInstance();
    tmp_7.dw_1 = this_8;
    var tmp_8 = this;
    // Inline function 'kotlin.apply' call
    var this_9 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.Textures.texNeon2.<anonymous>' call
    this_9.name = 'neon2';
    this_9.fileName = 'neon2';
    this_9.format = TextureFormat_ASTC_getInstance();
    this_9.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_9.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_9.mipmaps = 5;
    tmp_8.ew_1 = this_9;
    this.fw_1 = mutableListOf([this.vv_1, this.wv_1, this.xv_1, this.yv_1, this.zv_1, this.aw_1, this.bw_1, this.cw_1, this.dw_1, this.ew_1]);
  }
  var Textures_instance_1;
  function Textures_getInstance_1() {
    if (Textures_instance_1 == null)
      new Textures_1();
    return Textures_instance_1;
  }
  var Timers_Planes1_instance;
  var Timers_Planes2_instance;
  function Companion_2() {
  }
  protoOf(Companion_2).pw = function (timers) {
    timers.ci(Timers_Planes1_getInstance(), 80000.0);
    timers.ci(Timers_Planes2_getInstance(), 70000.0);
  };
  var Companion_instance_2;
  function Companion_getInstance_2() {
    return Companion_instance_2;
  }
  var Timers_entriesInitialized_2;
  function Timers_initEntries_2() {
    if (Timers_entriesInitialized_2)
      return Unit_instance;
    Timers_entriesInitialized_2 = true;
    Timers_Planes1_instance = new Timers_2('Planes1', 0);
    Timers_Planes2_instance = new Timers_2('Planes2', 1);
  }
  function Timers_2(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function Timers_Planes1_getInstance() {
    Timers_initEntries_2();
    return Timers_Planes1_instance;
  }
  function Timers_Planes2_getInstance() {
    Timers_initEntries_2();
    return Timers_Planes2_instance;
  }
  //region block: post-declaration
  defineProp(protoOf(TimeOfDay), 'name', protoOf(TimeOfDay).c4);
  defineProp(protoOf(TimeOfDay), 'ordinal', protoOf(TimeOfDay).d4);
  //endregion
  //region block: init
  Companion_instance = new Companion();
  Companion_instance_0 = new Companion_0();
  Companion_instance_2 = new Companion_2();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$arctic = $org$androidworks.arctic || ($org$androidworks.arctic = {});
    $org$androidworks$arctic.ArcticScene = ArcticScene;
    $org$androidworks$arctic.ArcticScene.setAnimationUniforms$default = setAnimationUniforms$default;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$arctic = $org$androidworks.arctic || ($org$androidworks.arctic = {});
    $org$androidworks$arctic.TimeOfDay = TimeOfDay;
    $org$androidworks$arctic.TimeOfDay.values = values;
    $org$androidworks$arctic.TimeOfDay.valueOf = valueOf;
    defineProp($org$androidworks$arctic.TimeOfDay, 'Day', TimeOfDay_Day_getInstance);
    defineProp($org$androidworks$arctic.TimeOfDay, 'Night', TimeOfDay_Night_getInstance);
    defineProp($org$androidworks$arctic.TimeOfDay, 'Sunrise', TimeOfDay_Sunrise_getInstance);
    defineProp($org$androidworks$arctic.TimeOfDay, 'Sunset', TimeOfDay_Sunset_getInstance);
    $org$androidworks$arctic.ArcticSettings = ArcticSettings;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$brutalism = $org$androidworks.brutalism || ($org$androidworks.brutalism = {});
    $org$androidworks$brutalism.DrawClockCommand = DrawClockCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$brutalism = $org$androidworks.brutalism || ($org$androidworks.brutalism = {});
    $org$androidworks$brutalism.BrutalismScene = BrutalismScene;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$brutalism = $org$androidworks.brutalism || ($org$androidworks.brutalism = {});
    $org$androidworks$brutalism.BrutalismSettings = BrutalismSettings;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$cartoonplanes = $org$androidworks.cartoonplanes || ($org$androidworks.cartoonplanes = {});
    $org$androidworks$cartoonplanes.CartoonPlanesScene = CartoonPlanesScene;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$cartoonplanes = $org$androidworks.cartoonplanes || ($org$androidworks.cartoonplanes = {});
    $org$androidworks$cartoonplanes.CartoonPlanesSettings = CartoonPlanesSettings;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$example = $org$androidworks.example || ($org$androidworks.example = {});
    $org$androidworks$example.ExampleScene = ExampleScene;
    defineProp($org$androidworks$example.ExampleScene, 'Companion', Companion_getInstance_1);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$skyscrapers = $org$androidworks.skyscrapers || ($org$androidworks.skyscrapers = {});
    $org$androidworks$skyscrapers.SkyscrapersScene = SkyscrapersScene;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$skyscrapers = $org$androidworks.skyscrapers || ($org$androidworks.skyscrapers = {});
    $org$androidworks$skyscrapers.SkyscrapersSettings = SkyscrapersSettings;
  }
  $jsExportAll$(_);
  kotlin_org_androidworks_engine_engine.$jsExportAll$(_);
  //endregion
  return _;
}));

//# sourceMappingURL=KMP-library-shared.js.map
