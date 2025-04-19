"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneRenderer = void 0;
const webgl_framework_1 = require("webgl-framework");
const KotlinLib_1 = require("./KotlinLib");
const Vignette_1 = require("./Vignette");
const GlConstants_1 = require("./utils/GlConstants");
const TextureUtils_1 = require("./utils/TextureUtils");
const FreeMovement_1 = require("./FreeMovement");
const gl_matrix_1 = require("gl-matrix");
const CameraMode_1 = require("./CameraMode");
const GaussianBlurRenderPass_1 = require("./utils/GaussianBlurRenderPass");
const FullscreenQuad_1 = require("./utils/FullscreenQuad");
const BlurConstants_1 = require("./utils/BlurConstants");
const DiffuseShader_1 = require("./shaders/DiffuseShader");
/**
 * Base class to render and interact with `Scene`.
 */
class SceneRenderer extends webgl_framework_1.BaseRenderer {
    constructor() {
        super();
        this.framesCount = 0;
        this.models = [];
        this.textures = [];
        this.shaders = [];
        this.cameraMode = CameraMode_1.CameraMode.FrontEnd;
        this.cameraPosition = gl_matrix_1.vec3.create();
        this.cameraRotation = gl_matrix_1.vec3.create();
        this.SCENE_BOUNDING_BOX = {
            minX: -25000,
            maxX: 25000,
            minY: -25000,
            maxY: 25000,
            minZ: -11000,
            maxZ: 23000
        };
        this.FREE_MOVEMENT_SPEED = 1000;
        this.scene = this.createScene();
    }
    onBeforeInit() {
    }
    onAfterInit() {
        this.freeMovement = new FreeMovement_1.FreeMovement(this, {
            canvas: this.canvas,
            movementSpeed: this.FREE_MOVEMENT_SPEED,
            rotationSpeed: 0.006,
            boundingBox: this.SCENE_BOUNDING_BOX
        });
    }
    onInitError() {
        var _a, _b;
        (_a = document.getElementById("canvasGL")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        (_b = document.getElementById("alertError")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
    }
    initShaders() {
        if (this.scene === undefined) {
            return;
        }
        const gl = this.gl;
        const shaders = this.scene.shaders.toArray();
        this.shaders.length = 0;
        for (const shader of shaders) {
            shader.id = this.shaders.length;
            this.shaders.push(this.createShader(shader.name));
        }
        console.log("Created scene shaders.");
    }
    async loadSceneModels() {
        if (this.scene === undefined) {
            return;
        }
        const meshes = this.scene.meshes.toArray();
        this.models.length = 0;
        for (const mesh of meshes) {
            mesh.id = this.models.length;
            const model = new webgl_framework_1.FullModel();
            await model.load(`data/models/${mesh.fileName}`, this.gl);
            this.models.push(model);
        }
    }
    async loadSceneTextures() {
        if (this.scene === undefined) {
            return;
        }
        for (const texture of this.textures) {
            this.gl.deleteTexture(texture);
        }
        this.textures.length = 0;
        const promises = [];
        const textures = this.scene.textures.toArray();
        for (const texture of textures) {
            promises.push(this.loadTexture(texture));
        }
        this.textures = await Promise.all(promises);
        for (let i = 0; i < this.textures.length; i++) {
            textures[i].id = i;
        }
    }
    async loadTexture(texture) {
        const gl = this.gl;
        const formatName = texture.format.name;
        if (texture.type.name === "TEX_2D") {
            if (formatName === "RGBA8" || formatName === "RGB8" || formatName === "ASTC") {
                return (0, TextureUtils_1.loadRgbTexture)(texture, gl);
            }
            else if (formatName === "RGB16F") {
                return (0, TextureUtils_1.loadRgb16fTexture)(texture, gl, this);
            }
            else if (formatName === "RGBA16F") {
                return (0, TextureUtils_1.loadRgba16fTexture)(texture, gl, this);
            }
            else if (formatName === "RGB32F") {
                return (0, TextureUtils_1.loadRgb32fTexture)(texture, gl, this);
            }
        }
        else if (texture.type.name === "CUBEMAP") {
            return (0, TextureUtils_1.loadCubemap)(texture, gl);
        }
        throw new Error(`Unsupported texture type ${texture.type.name}`);
    }
    async loadData() {
        var _a, _b, _c;
        if (this.scene === undefined) {
            return;
        }
        this.vignette = new Vignette_1.Vignette();
        await this.vignette.initialize(this.gl);
        await Promise.all([this.loadSceneModels(), this.loadSceneTextures()]);
        console.log("Loaded scene data.");
        if (this.canvas) {
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.updateViewportSize(this.canvas.width, this.canvas.height);
            (_b = this.scene) === null || _b === void 0 ? void 0 : _b.initialize();
        }
        this.fullscreenQuad = new FullscreenQuad_1.FullscreenQuad(this.gl);
        this.shaderDiffuse = new DiffuseShader_1.DiffuseShader(this.gl);
        this.scene.loaded = true;
        (_c = this.readyCallback) === null || _c === void 0 ? void 0 : _c.call(this);
    }
    resizeCanvas() {
        var _a;
        if (this.canvas === undefined) {
            return;
        }
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.updateViewportSize(this.canvas.width, this.canvas.height);
        const prevWidth = this.canvas.width;
        const prevHeight = this.canvas.height;
        super.resizeCanvas(); // update canvas dimensions
        if (prevWidth !== this.canvas.width || prevHeight !== this.canvas.height) {
            this.blurredPass = undefined; // FIXME clean up GL resources
        }
    }
    animate() {
        var _a;
        const timeNow = new Date().getTime();
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.updateTimers(timeNow);
    }
    /** Issues actual draw calls */
    drawScene() {
        var _a;
        if (!((_a = this.scene) === null || _a === void 0 ? void 0 : _a.loaded)) {
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
    get commands() {
        return this.scene.commands.toArray();
    }
    /**
     * Processes all commands. Typically called from `renderCommands` with an array of static or dynamic commands.
     * @param commands
     */
    processCommands(commands) {
        for (const command of commands) {
            if (!command.enabled) {
                continue;
            }
            if (command instanceof KotlinLib_1.engine.commands.BlurredPassCommand) {
                this.processBlurredPassCommands(command);
            }
            else if (command instanceof KotlinLib_1.engine.commands.GroupCommand) {
                this.processCommands(command.commands.toArray());
            }
            else if (command instanceof KotlinLib_1.engine.commands.ClearColorCommand) {
                const { color } = command;
                this.gl.clearColor(color.r, color.g, color.b, color.a);
            }
            else if (command instanceof KotlinLib_1.engine.commands.ClearCommand) {
                switch (command.clearType) {
                    case KotlinLib_1.engine.commands.ClearCommandClearType.COLOR:
                        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                        break;
                    case KotlinLib_1.engine.commands.ClearCommandClearType.DEPTH:
                        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
                        break;
                    case KotlinLib_1.engine.commands.ClearCommandClearType.COLOR_AND_DEPTH:
                        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                        break;
                }
            }
            else if (command instanceof KotlinLib_1.engine.commands.VignetteCommand) {
                this.drawVignette(command);
            }
            else if (command instanceof KotlinLib_1.engine.commands.DrawMeshCommand) {
                this.drawMesh(command);
            }
            else if (command instanceof KotlinLib_1.engine.commands.DrawBlurredCommand) {
                this.processDrawBlurred(command);
            }
            else {
                this.processCustomCommand(command);
            }
        }
    }
    processBlurredPassCommands(command) {
        var _a, _b, _c, _d;
        (_a = this.blurredPass) !== null && _a !== void 0 ? _a : (this.blurredPass = new GaussianBlurRenderPass_1.GaussianBlurRenderPass(this.gl, command.minSize, this.canvas.width / this.canvas.height));
        (_b = this.blurredPass) === null || _b === void 0 ? void 0 : _b.switchToOffscreenFBOMsaa();
        this.processCommands(command.commands.toArray());
        this.blurredPass.blitToTexture();
        (_c = this.blurredPass) === null || _c === void 0 ? void 0 : _c.blur(command.brightness, BlurConstants_1.BLUR_SIZES[command.blurSize.name]);
        if (command.additionalBlur) {
            (_d = this.blurredPass) === null || _d === void 0 ? void 0 : _d.blur(1.0, BlurConstants_1.BLUR_SIZES.KERNEL_2);
        }
        // reset FB to on-screen
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); // This differs from OpenGL ES
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    processDrawBlurred(command) {
        var _a;
        this.updateBlending(command.blending);
        // draw FS quad
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.depthMask(false);
        this.unbindBuffers();
        this.shaderDiffuse.use();
        this.setTexture2D(0, this.blurredPass.texture, this.shaderDiffuse.sTexture);
        (_a = this.fullscreenQuad) === null || _a === void 0 ? void 0 : _a.draw(this.shaderDiffuse);
    }
    /**
     * Draws vignette.
     *
     * @param command Command with vignette parameters.
     */
    drawVignette(command) {
        var _a, _b, _c;
        const { color0, color1 } = command;
        (_a = this.vignette) === null || _a === void 0 ? void 0 : _a.setColor0(color0.r, color0.g, color0.b, color0.a);
        (_b = this.vignette) === null || _b === void 0 ? void 0 : _b.setColor1(color1.r, color1.g, color1.b, color1.a);
        (_c = this.vignette) === null || _c === void 0 ? void 0 : _c.draw(this);
    }
    /**
     * Draws mesh.
     *
     * @param command Command with mesh parameters.
     */
    drawMesh(command) {
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
        }
        else {
            this.updateBlending(command.state.blending);
            this.updateDepthMode(command.state.depthMode);
            this.updateCulling(command.state.culling);
            shader.use();
            this.setUniforms(shader, command.uniforms.toArray());
            this.gl.drawElements(this.gl[command.primitiveType.name], command.primitiveCount, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    setAttributes(shader, attributesDescriptor) {
        var _a, _b, _c;
        if (attributesDescriptor === null) {
            return;
        }
        const attributes = attributesDescriptor.attributes.toArray();
        for (const attrib of attributes) {
            const attr = (_b = (_a = shader.typedAttributes) === null || _a === void 0 ? void 0 : _a[attrib.type.ordinal]) !== null && _b !== void 0 ? _b : (_c = shader.attributes) === null || _c === void 0 ? void 0 : _c[attrib.index];
            if (attr === undefined) {
                continue;
            }
            const { type, size, normalized } = GlConstants_1.VERTEX_FORMATS[attrib.format.name];
            this.gl.enableVertexAttribArray(attr);
            this.gl.vertexAttribPointer(attr, size, type, normalized, attributesDescriptor.stride, attrib.offset);
        }
    }
    setUniforms(shader, uniforms) {
        if (shader.uniforms === undefined) {
            return;
        }
        let currentTextureUnit = 0;
        const gl = this.gl;
        for (let i = 0; i < uniforms.length; i++) {
            const uniform = uniforms[i];
            const binding = shader.uniforms[i];
            if (uniform instanceof KotlinLib_1.engine.UniformFloatValue) {
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
            }
            else if (uniform instanceof KotlinLib_1.engine.UniformTextureValue) {
                if (uniform.value.type.name === "TEX_2D") {
                    this.setTexture2D(currentTextureUnit++, this.textures[uniform.value.id], binding);
                }
                else if (uniform.value.type.name === "CUBEMAP") {
                    this.setTextureCubemap(currentTextureUnit++, this.textures[uniform.value.id], binding);
                }
            }
            else if (uniform instanceof KotlinLib_1.engine.UniformIntValue) {
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
    updateBlending(blending) {
        const gl = this.gl;
        if (blending.enabled) {
            gl.enable(gl.BLEND);
            if (!blending.isSeparateAlpha) {
                gl.blendEquation(GlConstants_1.BLENDING_EQUATIONS[blending.equationColor.name]);
                gl.blendFunc(GlConstants_1.BLENDING_FACTORS[blending.sourceFactorColor.name], GlConstants_1.BLENDING_FACTORS[blending.destinationFactorColor.name]);
            }
            else {
                gl.blendEquationSeparate(GlConstants_1.BLENDING_EQUATIONS[blending.equationColor.name], GlConstants_1.BLENDING_EQUATIONS[blending.equationAlpha.name]);
                gl.blendFuncSeparate(GlConstants_1.BLENDING_FACTORS[blending.sourceFactorColor.name], GlConstants_1.BLENDING_FACTORS[blending.destinationFactorColor.name], GlConstants_1.BLENDING_FACTORS[blending.sourceFactorAlpha.name], GlConstants_1.BLENDING_FACTORS[blending.destinationFactorAlpha.name]);
            }
        }
        else {
            gl.disable(gl.BLEND);
        }
    }
    updateCulling(culling) {
        const gl = this.gl;
        if (culling.name === "DISABLED") {
            gl.disable(gl.CULL_FACE);
        }
        else {
            gl.enable(gl.CULL_FACE);
            gl.cullFace(GlConstants_1.CULLING[culling.name]);
        }
    }
    updateDepthMode(depthMode) {
        const gl = this.gl;
        if (depthMode.depthTest) {
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clearDepth(1.0);
        }
        else {
            gl.disable(gl.DEPTH_TEST);
        }
        if (depthMode.depthWrite) {
            gl.depthMask(true);
        }
        else {
            gl.depthMask(false);
        }
    }
    /**
     * Render custom command.
     *
     * @param command Command to render.
     */
    processCustomCommand(command) {
    }
    checkGlError(_operation) {
        // Do nothing in production build.
    }
    set ready(callback) {
        this.readyCallback = callback;
    }
    // public getCanvas() {
    //     return this.canvas;
    // }
    setCustomCamera(camera, position, rotation) {
        if (this.scene === undefined) {
            return;
        }
        this.customCamera = camera;
        this.cameraPosition = position !== null && position !== void 0 ? position : this.cameraPosition;
        this.cameraRotation = rotation !== null && rotation !== void 0 ? rotation : this.cameraRotation;
        if (this.customCamera !== undefined) {
            this.scene.useExternalViewMatrix = true;
            for (let i = 0; i < 16; i++) {
                this.scene.matView[i] = this.customCamera[i];
            }
        }
        else {
            this.scene.useExternalViewMatrix = false;
        }
    }
    setCameraMode(mode) {
        var _a, _b, _c, _d;
        if (mode === CameraMode_1.CameraMode.FPS) {
            (_a = this.freeMovement) === null || _a === void 0 ? void 0 : _a.updatePosition([0, 0, 0]);
            (_b = this.freeMovement) === null || _b === void 0 ? void 0 : _b.updateRotation([0, 0, 0]);
            (_c = this.freeMovement) === null || _c === void 0 ? void 0 : _c.enable();
        }
        else if (mode === CameraMode_1.CameraMode.FrontEnd) {
            (_d = this.freeMovement) === null || _d === void 0 ? void 0 : _d.disable();
        }
        this.cameraMode = mode;
    }
    get currentCameraMode() {
        return this.cameraMode;
    }
    set currentCameraMode(mode) {
        this.setCameraMode(mode);
    }
}
exports.SceneRenderer = SceneRenderer;
//# sourceMappingURL=SceneRenderer.js.map