import { BaseShader } from "webgl-framework";
import { lib } from "./KotlinLib";
import { SceneRenderer } from "./SceneRenderer";
import { ShaderInputs } from "./shaders/ShaderInputs";
export declare class Renderer extends SceneRenderer<lib.org.androidworks.cartoonplanes.CartoonPlanesScene> {
    protected SCENE_BOUNDING_BOX: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        minZ: number;
        maxZ: number;
    };
    protected FREE_MOVEMENT_SPEED: number;
    constructor();
    /**
     * Fills static array `commands` with the commands from the scene. Use only if scene has static commands.
     */
    protected initCommands(): void;
    createScene(): lib.org.androidworks.cartoonplanes.CartoonPlanesScene;
    createShader(name: string): (BaseShader & ShaderInputs);
    nextCamera(): void;
    get settings(): lib.org.androidworks.cartoonplanes.CartoonPlanesSettings;
    randomizeSky(): Promise<void>;
}
