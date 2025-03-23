import { BaseRenderer, BaseShader, FullModel, UncompressedTextureLoader } from "webgl-framework";
import { engine, lib } from "./KotlinLib";
import { Vignette } from "./Vignette";
import { BLENDING_EQUATIONS, BLENDING_FACTORS, CULLING, TEXTURE_FILTERING, TEXTURE_WRAPPING, VERTEX_FORMATS } from "./utils/GlConstants";
import { ShaderInputs } from "./shaders/ShaderInputs";
import { fetchArrayBuffer } from "./utils/FetchUtils";
import { loadCubemap, loadFloatingPointTexture, loadRgb16fTexture, loadRgb32fTexture, loadRgba16fTexture, loadRgbTexture } from "./utils/TextureUtils";
import { FreeMovement } from "./FreeMovement";
import { mat4, vec3 } from "gl-matrix";
import { CameraMode } from "./CameraMode";
import { BlurSize, GaussianBlurRenderPass } from "./utils/GaussianBlurRenderPass";
import { FullscreenQuad } from "./utils/FullscreenQuad";
import { BLUR_SIZES } from "./utils/BlurConstants";
import { DiffuseShader } from "./shaders/DiffuseShader";

/**
 * Base class to render and interact with `Scene`.
 */
export abstract class SceneRenderer<S extends lib.org.androidworks.engine.Scene> extends BaseRenderer {
    // private loaded = false;
    private readyCallback: (() => void) | undefined;
    private framesCount = 0;
    private vignette: Vignette | undefined; // FIXME move vignette away

    protected models: FullModel[] = [];
    protected textures: WebGLTexture[] = [];
    protected shaders: (BaseShader & ShaderInputs)[] = [];

    private cameraMode = CameraMode.FrontEnd;
    protected freeMovement?: FreeMovement;
    public cameraPosition = vec3.create();
    public cameraRotation = vec3.create();
    protected customCamera: mat4 | undefined;
    protected SCENE_BOUNDING_BOX = {
        minX: -25000,
        maxX: 25000,
        minY: -25000,
        maxY: 25000,
        minZ: -11000,
        maxZ: 23000
    };
    protected FREE_MOVEMENT_SPEED = 1000;

    protected blurredPass?: GaussianBlurRenderPass;
    protected shaderDiffuse?: DiffuseShader;

    /**
     * Scene object.
     */
    protected scene: S | undefined;

    protected fullscreenQuad?: FullscreenQuad;

    constructor() {
        super();

        this.scene = this.createScene();
    }

    /**
     * Creates an instance of `Scene`.
     */
    abstract createScene(): S;

    onBeforeInit(): void {
    }

    onAfterInit(): void {
        this.freeMovement = new FreeMovement(
            this,
            {
                canvas: this.canvas!,
                movementSpeed: this.FREE_MOVEMENT_SPEED,
                rotationSpeed: 0.006,
                boundingBox: this.SCENE_BOUNDING_BOX
            }
        );
    }

    onInitError(): void {
        document.getElementById("canvasGL")?.classList.add("hidden");
        document.getElementById("alertError")?.classList.remove("hidden");
    }

    initShaders(): void {
        if (this.scene === undefined) {
            return;
        }

        const gl = this.gl as WebGL2RenderingContext;

        const shaders = this.scene.shaders.toArray() as lib.org.androidworks.engine.Shader[];
        this.shaders.length = 0;
        for (const shader of shaders) {
            shader.id = this.shaders.length;
            this.shaders.push(this.createShader(shader.name));
        }

        console.log("Created scene shaders.");
    }

    abstract createShader(name: string): BaseShader & ShaderInputs;

    protected async loadSceneModels(): Promise<void> {
        if (this.scene === undefined) {
            return;
        }

        const meshes = this.scene.meshes.toArray() as lib.org.androidworks.engine.Mesh[];
        this.models.length = 0;
        for (const mesh of meshes) {
            mesh.id = this.models.length;
            const model = new FullModel();
            await model.load(`data/models/${mesh.fileName}`, this.gl);
            this.models.push(model);
        }
    }

    protected async loadSceneTextures(): Promise<void> {
        if (this.scene === undefined) {
            return;
        }

        for (const texture of this.textures) {
            this.gl.deleteTexture(texture);
        }
        this.textures.length = 0;

        const promises: Promise<WebGLTexture>[] = [];
        const textures = this.scene.textures.toArray() as lib.org.androidworks.engine.Texture[];
        for (const texture of textures) {
            promises.push(this.loadTexture(texture));
        }
        this.textures = await Promise.all(promises);
        for (let i = 0; i < this.textures.length; i++) {
            textures[i].id = i;
        }
    }

    protected async loadTexture(texture: lib.org.androidworks.engine.Texture): Promise<WebGLTexture> {
        const gl = this.gl as WebGL2RenderingContext;

        const formatName = texture.format.name;
        if (texture.type.name === "TEX_2D") {
            if (formatName === "RGBA8" || formatName === "RGB8" || formatName === "ASTC") {
                return loadRgbTexture(texture, gl);
            } else if (formatName === "RGB16F") {
                return loadRgb16fTexture(texture, gl, this);
            } else if (formatName === "RGBA16F") {
                return loadRgba16fTexture(texture, gl, this);
            } else if (formatName === "RGB32F") {
                return loadRgb32fTexture(texture, gl, this);
            }
        } else if (texture.type.name === "CUBEMAP") {
            return loadCubemap(texture, gl);
        }

        throw new Error(`Unsupported texture type ${texture.type.name}`);
    }

    async loadData(): Promise<void> {
        if (this.scene === undefined) {
            return;
        }

        this.vignette = new Vignette();
        await this.vignette.initialize(this.gl);

        await Promise.all([this.loadSceneModels(), this.loadSceneTextures()]);

        console.log("Loaded scene data.");

        if (this.canvas) {
            this.scene?.updateViewportSize(this.canvas.width, this.canvas.height);
            this.scene?.initialize();
        }

        this.fullscreenQuad = new FullscreenQuad(this.gl);
        this.shaderDiffuse = new DiffuseShader(this.gl);

        this.scene.loaded = true;
        this.readyCallback?.();
    }

    resizeCanvas(): void {
        if (this.canvas === undefined) {
            return;
        }

        this.scene?.updateViewportSize(this.canvas.width, this.canvas.height);
        const prevWidth = this.canvas.width;
        const prevHeight = this.canvas.height;

        super.resizeCanvas(); // update canvas dimensions

        if (prevWidth !== this.canvas.width || prevHeight !== this.canvas.height) {
            this.blurredPass = undefined; // FIXME clean up GL resources
        }
    }

    animate(): void {
        const timeNow = new Date().getTime();
        this.scene?.updateTimers(timeNow);
    }

    /** Issues actual draw calls */
    drawScene() {
        if (!this.scene?.loaded) {
            return;
        }

        this.gl.colorMask(true, true, true, true);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); // This differs from OpenGL ES
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);

        this.processCommands(this.commands);

        this.framesCount++;
    }

    protected get commands(): lib.org.androidworks.engine.commands.Command[] {
        return this.scene!.commands.toArray() as lib.org.androidworks.engine.commands.Command[];
    }

    /**
     * Processes all commands. Typically called from `renderCommands` with an array of static or dynamic commands.
     * @param commands
     */
    protected processCommands(commands: Iterable<lib.org.androidworks.engine.commands.Command>): void {
        for (const command of commands) {
            if (!command.enabled) {
                continue;
            }

            if (command instanceof engine.commands.BlurredPassCommand) {
                this.processBlurredPassCommands(command);
            } else if (command instanceof engine.commands.GroupCommand) {
                this.processCommands(command.commands.toArray());
            } else if (command instanceof engine.commands.ClearColorCommand) {
                const { color } = command;
                this.gl.clearColor(color.r, color.g, color.b, color.a);
            } else if (command instanceof engine.commands.ClearCommand) {
                switch (command.clearType) {
                    case engine.commands.ClearCommandClearType.COLOR:
                        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                        break;
                    case engine.commands.ClearCommandClearType.DEPTH:
                        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
                        break;
                    case engine.commands.ClearCommandClearType.COLOR_AND_DEPTH:
                        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                        break;
                }
            } else if (command instanceof engine.commands.VignetteCommand) {
                this.drawVignette(command);
            } else if (command instanceof engine.commands.DrawMeshCommand) {
                this.drawMesh(command);
            } else if (command instanceof engine.commands.DrawBlurredCommand) {
                this.processDrawBlurred(command);
            } else {
                this.processCustomCommand(command);
            }
        }
    }

    protected processBlurredPassCommands(command: lib.org.androidworks.engine.commands.BlurredPassCommand): void {
        this.blurredPass ??= new GaussianBlurRenderPass(this.gl as WebGL2RenderingContext, command.minSize, this.canvas!.width / this.canvas!.height);

        this.blurredPass?.switchToOffscreenFBOMsaa();

        this.processCommands(command.commands.toArray());

        this.blurredPass.blitToTexture();

        this.blurredPass?.blur(command.brightness, BLUR_SIZES[command.blurSize.name]);
        if (command.additionalBlur) {
            this.blurredPass?.blur(1.0, BLUR_SIZES.KERNEL_2);
        }

        // reset FB to on-screen
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); // This differs from OpenGL ES
        this.gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    }

    protected processDrawBlurred(command: lib.org.androidworks.engine.commands.DrawBlurredCommand): void {
        this.updateBlending(command.blending);

        // draw FS quad
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.depthMask(false);
        this.unbindBuffers();
        this.shaderDiffuse!.use();
        this.setTexture2D(0, this.blurredPass!.texture!, this.shaderDiffuse!.sTexture!);
        this.fullscreenQuad?.draw(this.shaderDiffuse!);
    }

    /**
     * Draws vignette.
     *
     * @param command Command with vignette parameters.
     */
    protected drawVignette(command: lib.org.androidworks.engine.commands.VignetteCommand): void {
        const { color0, color1 } = command;
        this.vignette?.setColor0(color0.r, color0.g, color0.b, color0.a);
        this.vignette?.setColor1(color1.r, color1.g, color1.b, color1.a);
        this.vignette?.draw(this);
    }

    /**
     * Draws mesh.
     *
     * @param command Command with mesh parameters.
     */
    protected drawMesh(command: lib.org.androidworks.engine.commands.DrawMeshCommand): void {
        const shader = this.shaders[command.state.shader.id];
        if (shader === undefined) {
            return;
        }
        if (command.mesh) {
            const model = this.models[command.mesh.id];
            if (model !== undefined) {
                this.updateBlending(command.state.blending);
                this.updateDepthMode(command.state.depthMode);
                this.updateCulling(command.state.culling);
                shader.use();
                model.bindBuffers(this.gl);
                this.setAttributes(shader, command.state.vertexAttributes);
                this.setUniforms(shader, command.uniforms.toArray());
                this.gl.drawElements(this.gl[command.primitiveType.name], model.getNumIndices() * 3, this.gl.UNSIGNED_SHORT, 0);
            }
        } else {
            this.updateBlending(command.state.blending);
            this.updateDepthMode(command.state.depthMode);
            this.updateCulling(command.state.culling);
            shader.use();
            this.setUniforms(shader, command.uniforms.toArray());
            this.gl.drawElements(
                this.gl[command.primitiveType.name],
                command.primitiveCount,
                this.gl.UNSIGNED_SHORT,
                0
            );
        }
    }

    protected setAttributes(shader: ShaderInputs, attributesDescriptor: lib.Nullable<lib.org.androidworks.engine.VertexAttributesDescriptor>): void {
        if (attributesDescriptor === null) {
            return;
        }

        const attributes = attributesDescriptor!.attributes.toArray() as lib.org.androidworks.engine.VertexAttribute[];
        for (const attrib of attributes) {
            const attr = shader.typedAttributes?.[attrib.type.ordinal] ?? shader.attributes?.[attrib.index];
            if (attr === undefined) {
                continue;
            }
            const { type, size, normalized } = VERTEX_FORMATS[attrib.format.name];
            this.gl.enableVertexAttribArray(attr);
            this.gl.vertexAttribPointer(attr, size, type, normalized, attributesDescriptor!.stride, attrib.offset);
        }
    }

    protected setUniforms(shader: ShaderInputs, uniforms: lib.org.androidworks.engine.UniformValue[]): void {
        if (shader.uniforms === undefined) {
            return;
        }

        let currentTextureUnit = 0;

        const gl = this.gl as WebGL2RenderingContext;
        for (let i = 0; i < uniforms.length; i++) {
            const uniform = uniforms[i];
            const binding = shader.uniforms[i];
            if (uniform instanceof engine.UniformFloatValue) {
                switch (uniform.value.length) {
                    case 1:
                        gl.uniform1fv(binding, uniform.value);
                        break;
                    case 2:
                        gl.uniform2fv(binding, uniform.value);
                        break;
                    case 3:
                        gl.uniform3fv(binding, uniform.value);
                        break;
                    case 4:
                        gl.uniform4fv(binding, uniform.value);
                        break;
                    case 16:
                        gl.uniformMatrix4fv(binding, false, uniform.value);
                        break;
                }
            } else if (uniform instanceof engine.UniformTextureValue) {
                if (uniform.value.type.name === "TEX_2D") {
                    this.setTexture2D(currentTextureUnit++, this.textures[uniform.value.id], binding);
                } else if (uniform.value.type.name === "CUBEMAP") {
                    this.setTextureCubemap(currentTextureUnit++, this.textures[uniform.value.id], binding);
                }
            } else if (uniform instanceof engine.UniformIntValue) {
                switch (uniform.value.length) {
                    case 1:
                        gl.uniform1iv(binding, uniform.value);
                        break;
                    case 2:
                        gl.uniform2iv(binding, uniform.value);
                        break;
                    case 3:
                        gl.uniform3iv(binding, uniform.value);
                        break;
                    case 4:
                        gl.uniform4iv(binding, uniform.value);
                        break;
                }
            }
        }
    }

    protected updateBlending(blending: lib.org.androidworks.engine.Blending): void {
        const gl = this.gl as WebGL2RenderingContext;
        if (blending.enabled) {
            gl.enable(gl.BLEND);
            if (!blending.isSeparateAlpha) {
                gl.blendEquation(BLENDING_EQUATIONS[blending.equationColor.name]);
                gl.blendFunc(BLENDING_FACTORS[blending.sourceFactorColor.name], BLENDING_FACTORS[blending.destinationFactorColor.name]);
            } else {
                gl.blendEquationSeparate(BLENDING_EQUATIONS[blending.equationColor.name], BLENDING_EQUATIONS[blending.equationAlpha.name]);
                gl.blendFuncSeparate(
                    BLENDING_FACTORS[blending.sourceFactorColor.name], BLENDING_FACTORS[blending.destinationFactorColor.name],
                    BLENDING_FACTORS[blending.sourceFactorAlpha.name], BLENDING_FACTORS[blending.destinationFactorAlpha.name]
                );
            }
        } else {
            gl.disable(gl.BLEND);
        }
    }

    protected updateCulling(culling: lib.org.androidworks.engine.CullFace): void {
        const gl = this.gl as WebGL2RenderingContext;

        if (culling.name === "DISABLED") {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(CULLING[culling.name]);
        }
    }

    protected updateDepthMode(depthMode: lib.org.androidworks.engine.DepthMode): void {
        const gl = this.gl as WebGL2RenderingContext;
        if (depthMode.depthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        } else {
            gl.disable(gl.DEPTH_TEST);
        }
        if (depthMode.depthWrite) {
            gl.depthMask(true);
        } else {
            gl.depthMask(false);
        }
    }

    /**
     * Render custom command.
     *
     * @param command Command to render.
     */
    protected processCustomCommand(command: lib.org.androidworks.engine.commands.Command) {
    }

    public checkGlError(_operation: string): void {
        // Do nothing in production build.
    }

    public set ready(callback: () => void) {
        this.readyCallback = callback;
    }

    // public getCanvas() {
    //     return this.canvas;
    // }

    setCustomCamera(camera: mat4 | undefined, position?: vec3, rotation?: vec3) {
        if (this.scene === undefined) {
            return;
        }

        this.customCamera = camera;
        this.cameraPosition = position ?? this.cameraPosition;
        this.cameraRotation = rotation ?? this.cameraRotation;

        if (this.customCamera !== undefined) {
            this.scene.useExternalViewMatrix = true;
            for (let i = 0; i < 16; i++) {
                this.scene.matView[i] = this.customCamera[i];
            }
        } else {
            this.scene.useExternalViewMatrix = false;
        }
    }

    protected setCameraMode(mode: CameraMode): void {
        if (mode === CameraMode.FPS) {
            this.freeMovement?.updatePosition([0, 0, 0]);
            this.freeMovement?.updateRotation([0, 0, 0]);
            this.freeMovement?.enable();
        } else if (mode === CameraMode.FrontEnd) {
            this.freeMovement?.disable();
        }
        this.cameraMode = mode;
    }

    public get currentCameraMode() {
        return this.cameraMode;
    }

    public set currentCameraMode(mode: CameraMode) {
        this.setCameraMode(mode);
    }
}
