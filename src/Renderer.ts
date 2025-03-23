import { BaseShader } from "webgl-framework";
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
        scene.nextCamera();
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

    public nextCamera(): void {
        this.scene?.nextCamera();
    }

    public get settings() {
        return this.scene!.settings;
    }

    public async randomizeSky(): Promise<void> {
        // const length = this.config.animals[this.config.currentAnimal].animations.length;
        // this.config.currentAnimalAnimation = (this.config.currentAnimalAnimation + 1 + Math.trunc(Math.random() * (length - 2))) % length;

        if (this.scene === undefined) {
            return;
        }

        // TODO: Use a separate texture for static sky and pair for transition,
        // then update only the transition textures and draw transition only after timer is > 0.05 or smth
        // This should prevent 1-frame flickering when changing sky

        const id = this.scene.texSky.id;
        const id1 = this.scene.texSky1.id;
        const id2 = this.scene.texSky2.id;
        const fileName1 = this.scene.texSky1.fileName;
        const fileName2 = this.scene.texSky2.fileName;

        const newSkyName = `sky/day/${Math.trunc(Math.random() * 7) + 1}`;
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
        this.processCommands(this.commands);
    }
}
