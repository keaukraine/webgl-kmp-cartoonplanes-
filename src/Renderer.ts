import { BaseShader, FullModel } from "webgl-framework";
import { cartoonplanes, lib } from "./KotlinLib";
import { SceneRenderer } from "./SceneRenderer";
import { ShaderInputs } from "./shaders/ShaderInputs";
import { DiffuseShader } from "./shaders/DiffuseShader";
import { getFilters } from "./Filters";
import { SkyTransitionShader } from "./shaders/SkyTransitionShader";
import { OutlineShader } from "./shaders/OutlineShader";
import { PropShader } from "./shaders/PropShader";

export class Renderer extends SceneRenderer<lib.org.androidworks.cartoonplanes.CartoonPlanesScene> {
    protected SCENE_BOUNDING_BOX = {
        minX: -5000,
        maxX: 5000,
        minY: -5000,
        maxY: 5000,
        minZ: -5000,
        maxZ: 5000
    };
    protected FREE_MOVEMENT_SPEED = 800;

    constructor() {
        super();
        this.initCommands();
    }

    /**
     * Fills static array `commands` with the commands from the scene. Use only if scene has static commands.
     */
    protected initCommands(): void {
    }

    createScene(): lib.org.androidworks.cartoonplanes.CartoonPlanesScene {
        const scene = new cartoonplanes.CartoonPlanesScene();
        scene.changePlanes(0, 1);
        scene.randomizePropTexture();

        // FIXME
        // setTimeout(() => { scene. }, 1000);

        return scene;
    }

    createShader(name: string): (BaseShader & ShaderInputs) {
        // const filters = getFilters("gl_FragColor");
        // const filter = filters[this.scene?.settings.colorMode.name!];

        if (name === "Diffuse") {
            return new DiffuseShader(this.gl, []);
        } else if (name === "SkyTransition") {
            return new SkyTransitionShader(this.gl, []);
        } else if (name === "Outline") {
            return new OutlineShader(this.gl, []);
        } else if (name === "Prop") {
            return new PropShader(this.gl, []);
        }

        throw new Error(`Unknown shader type ${name}`);
    }

    public get settings() {
        return this.scene!.settings;
    }

    public async randomizeSky(): Promise<void> {
        if (this.scene === undefined) {
            return;
        }

        const length = 7;
        const currentSky = +(this.scene.texSky.fileName.charAt(this.scene.texSky.fileName.length - 1));
        const newSkyId = (currentSky + 1 + Math.trunc(Math.random() * (length - 2))) % length;
        const timeOfDay = "day";

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

        this.scene?.changeSky();

        // Update draw commands after changing sky
        // this.processCommands(this.commands);
    }

    public async randomizePlane(): Promise<void> {
        if (!this.scene?.canChangePlanes()) {
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

        const newModel = new FullModel();
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
