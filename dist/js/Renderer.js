"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const webgl_framework_1 = require("webgl-framework");
const KotlinLib_1 = require("./KotlinLib");
const SceneRenderer_1 = require("./SceneRenderer");
const DiffuseShader_1 = require("./shaders/DiffuseShader");
const SkyTransitionShader_1 = require("./shaders/SkyTransitionShader");
const OutlineShader_1 = require("./shaders/OutlineShader");
const PropShader_1 = require("./shaders/PropShader");
class Renderer extends SceneRenderer_1.SceneRenderer {
    constructor() {
        super();
        this.SCENE_BOUNDING_BOX = {
            minX: -5000,
            maxX: 5000,
            minY: -5000,
            maxY: 5000,
            minZ: -5000,
            maxZ: 5000
        };
        this.FREE_MOVEMENT_SPEED = 800;
        this.initCommands();
    }
    /**
     * Fills static array `commands` with the commands from the scene. Use only if scene has static commands.
     */
    initCommands() {
    }
    createScene() {
        const scene = new KotlinLib_1.cartoonplanes.CartoonPlanesScene();
        scene.changePlanes(0, 0);
        scene.randomizePropTexture();
        // FIXME
        // setTimeout(() => { scene. }, 1000);
        return scene;
    }
    createShader(name) {
        // const filters = getFilters("gl_FragColor");
        // const filter = filters[this.scene?.settings.colorMode.name!];
        if (name === "Diffuse") {
            return new DiffuseShader_1.DiffuseShader(this.gl, []);
        }
        else if (name === "SkyTransition") {
            return new SkyTransitionShader_1.SkyTransitionShader(this.gl, []);
        }
        else if (name === "Outline") {
            return new OutlineShader_1.OutlineShader(this.gl, []);
        }
        else if (name === "Prop") {
            return new PropShader_1.PropShader(this.gl, []);
        }
        throw new Error(`Unknown shader type ${name}`);
    }
    get settings() {
        return this.scene.settings;
    }
    async randomizeSky() {
        var _a;
        if (this.scene === undefined) {
            return;
        }
        const length = 7;
        const currentSky = +(this.scene.texSky.fileName.charAt(this.scene.texSky.fileName.length - 1));
        const newSkyId = (currentSky + 1 + Math.trunc(Math.random() * (length - 2))) % length;
        const timeOfDay = ["day", "night", "morning"][Math.trunc(Math.random() * 3)];
        const id = this.scene.texSky.id;
        const id1 = this.scene.texSky1.id;
        const id2 = this.scene.texSky2.id;
        const fileName1 = this.scene.texSky1.fileName;
        const fileName2 = this.scene.texSky2.fileName;
        const newSkyName = `sky/${timeOfDay}/${newSkyId + 1}`;
        this.scene.texSky2.fileName = newSkyName;
        const newSkyTexture2 = await this.loadTexture(this.scene.texSky2);
        this.scene.texSky.id = id2;
        this.scene.texSky.fileName = fileName2;
        this.scene.texSky1.id = id2;
        this.scene.texSky1.fileName = fileName2;
        this.gl.deleteTexture(this.textures[id1]);
        this.textures[id1] = newSkyTexture2;
        this.scene.texSky2.id = id1;
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.changeSky();
    }
    async randomizePlane() {
        var _a;
        if (!((_a = this.scene) === null || _a === void 0 ? void 0 : _a.canChangePlanes())) {
            return;
        }
        const { currentPlane, nextPlane } = this.scene.settings;
        const { texPlane1, texPlane2 } = this.scene;
        const texture1Index = this.scene.texPlane1.id;
        const texture2Index = this.scene.texPlane2.id;
        const model1Index = this.scene.meshPlane1.id;
        const model2Index = this.scene.meshPlane2.id;
        const length = 10;
        const newPlane = (nextPlane + 1 + Math.trunc(Math.random() * (length - 2))) % length;
        const newModel = new webgl_framework_1.FullModel();
        await newModel.load(`data/models/plane${newPlane}`, this.gl);
        this.scene.texPlane2.fileName = `plane${newPlane}`;
        const newPlaneTexture = await this.loadTexture(this.scene.texPlane2);
        // Move 2 -> 1
        this.scene.meshPlane1.id = model2Index;
        const oldTexture1 = this.textures[texture1Index];
        this.textures[texture1Index] = this.textures[texture2Index];
        this.gl.deleteTexture(oldTexture1);
        this.textures[texture2Index] = newPlaneTexture;
        this.models[model1Index] = newModel;
        this.scene.meshPlane2.id = model1Index;
        // this.scene.texPlane2.id = texture1Index;
        this.scene.changePlanes(nextPlane, newPlane);
        this.processCommands(this.commands);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=Renderer.js.map