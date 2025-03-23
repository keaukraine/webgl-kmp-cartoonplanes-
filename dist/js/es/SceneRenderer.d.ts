import { BaseRenderer, BaseShader, FullModel } from "webgl-framework";
import { lib } from "./KotlinLib";
import { ShaderInputs } from "./shaders/ShaderInputs";
import { FreeMovement } from "./FreeMovement";
import { mat4, vec3 } from "gl-matrix";
import { CameraMode } from "./CameraMode";
import { GaussianBlurRenderPass } from "./utils/GaussianBlurRenderPass";
import { FullscreenQuad } from "./utils/FullscreenQuad";
import { DiffuseShader } from "./shaders/DiffuseShader";
/**
 * Base class to render and interact with `Scene`.
 */
export declare abstract class SceneRenderer<S extends lib.org.androidworks.engine.Scene> extends BaseRenderer {
    private readyCallback;
    private framesCount;
    private vignette;
    protected models: FullModel[];
    protected textures: WebGLTexture[];
    protected shaders: (BaseShader & ShaderInputs)[];
    private cameraMode;
    protected freeMovement?: FreeMovement;
    cameraPosition: vec3;
    cameraRotation: vec3;
    protected customCamera: mat4 | undefined;
    protected SCENE_BOUNDING_BOX: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        minZ: number;
        maxZ: number;
    };
    protected FREE_MOVEMENT_SPEED: number;
    protected blurredPass?: GaussianBlurRenderPass;
    protected shaderDiffuse?: DiffuseShader;
    /**
     * Scene object.
     */
    protected scene: S | undefined;
    protected fullscreenQuad?: FullscreenQuad;
    constructor();
    /**
     * Creates an instance of `Scene`.
     */
    abstract createScene(): S;
    onBeforeInit(): void;
    onAfterInit(): void;
    onInitError(): void;
    initShaders(): void;
    abstract createShader(name: string): BaseShader & ShaderInputs;
    protected loadSceneModels(): Promise<void>;
    protected loadSceneTextures(): Promise<void>;
    protected loadTexture(texture: lib.org.androidworks.engine.Texture): Promise<WebGLTexture>;
    loadData(): Promise<void>;
    resizeCanvas(): void;
    animate(): void;
    /** Issues actual draw calls */
    drawScene(): void;
    protected get commands(): lib.org.androidworks.engine.commands.Command[];
    /**
     * Processes all commands. Typically called from `renderCommands` with an array of static or dynamic commands.
     * @param commands
     */
    protected processCommands(commands: Iterable<lib.org.androidworks.engine.commands.Command>): void;
    protected processBlurredPassCommands(command: lib.org.androidworks.engine.commands.BlurredPassCommand): void;
    protected processDrawBlurred(command: lib.org.androidworks.engine.commands.DrawBlurredCommand): void;
    /**
     * Draws vignette.
     *
     * @param command Command with vignette parameters.
     */
    protected drawVignette(command: lib.org.androidworks.engine.commands.VignetteCommand): void;
    /**
     * Draws mesh.
     *
     * @param command Command with mesh parameters.
     */
    protected drawMesh(command: lib.org.androidworks.engine.commands.DrawMeshCommand): void;
    protected setAttributes(shader: ShaderInputs, attributesDescriptor: lib.Nullable<lib.org.androidworks.engine.VertexAttributesDescriptor>): void;
    protected setUniforms(shader: ShaderInputs, uniforms: lib.org.androidworks.engine.UniformValue[]): void;
    protected updateBlending(blending: lib.org.androidworks.engine.Blending): void;
    protected updateCulling(culling: lib.org.androidworks.engine.CullFace): void;
    protected updateDepthMode(depthMode: lib.org.androidworks.engine.DepthMode): void;
    /**
     * Render custom command.
     *
     * @param command Command to render.
     */
    protected processCustomCommand(command: lib.org.androidworks.engine.commands.Command): void;
    checkGlError(_operation: string): void;
    set ready(callback: () => void);
    setCustomCamera(camera: mat4 | undefined, position?: vec3, rotation?: vec3): void;
    protected setCameraMode(mode: CameraMode): void;
    get currentCameraMode(): CameraMode;
    set currentCameraMode(mode: CameraMode);
}
