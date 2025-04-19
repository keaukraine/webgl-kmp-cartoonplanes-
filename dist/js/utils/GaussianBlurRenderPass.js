"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaussianBlurRenderPass = exports.BlurSize = void 0;
const webgl_framework_1 = require("webgl-framework");
const GaussianBlurShader_1 = require("./shaders/GaussianBlurShader");
const GaussianBlurShader4_1 = require("./shaders/GaussianBlurShader4");
const GaussianBlurShader3_1 = require("./shaders/GaussianBlurShader3");
const GaussianBlurShader2_1 = require("./shaders/GaussianBlurShader2");
/**
 * Gaussian blur kernel size.
 */
var BlurSize;
(function (BlurSize) {
    BlurSize[BlurSize["KERNEL_5"] = 0] = "KERNEL_5";
    BlurSize[BlurSize["KERNEL_4"] = 1] = "KERNEL_4";
    BlurSize[BlurSize["KERNEL_3"] = 2] = "KERNEL_3";
    BlurSize[BlurSize["KERNEL_2"] = 3] = "KERNEL_2";
})(BlurSize = exports.BlurSize || (exports.BlurSize = {}));
/**
 * Helper class to render and blur off-screen targets.
 */
class GaussianBlurRenderPass {
    constructor(gl, minSize, ratio) {
        this.gl = gl;
        this.width = 0;
        this.height = 0;
        this.width = ratio > 1 ? Math.round(minSize * ratio) : minSize;
        this.height = ratio > 1 ? minSize : Math.round(minSize / ratio);
        this.blurShader5 = new GaussianBlurShader_1.GaussianBlurShader(gl);
        this.blurShader4 = new GaussianBlurShader4_1.GaussianBlurShader4(gl);
        this.blurShader3 = new GaussianBlurShader3_1.GaussianBlurShader3(gl);
        this.blurShader2 = new GaussianBlurShader2_1.GaussianBlurShader2(gl);
        this.textureOffscreen = webgl_framework_1.TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreen = new webgl_framework_1.FrameBuffer(gl);
        this.fboOffscreen.textureHandle = this.textureOffscreen;
        this.fboOffscreen.width = this.width;
        this.fboOffscreen.height = this.height;
        this.fboOffscreen.createGLData(this.width, this.height);
        this.textureOffscreenMsaa = webgl_framework_1.TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenMsaa = new webgl_framework_1.MsaaFrameBuffer(gl);
        this.fboOffscreenMsaa.textureHandle = this.textureOffscreenMsaa;
        this.fboOffscreenMsaa.width = this.width;
        this.fboOffscreenMsaa.height = this.height;
        this.fboOffscreenMsaa.createGLData(this.width, this.height);
        this.textureOffscreenVert = webgl_framework_1.TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenVert = new webgl_framework_1.FrameBuffer(gl);
        this.fboOffscreenVert.textureHandle = this.textureOffscreenVert;
        this.fboOffscreenVert.width = this.width;
        this.fboOffscreenVert.height = this.height;
        this.fboOffscreenVert.createGLData(this.width, this.height);
        this.textureOffscreenVertMsaa = webgl_framework_1.TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenVertMsaa = new webgl_framework_1.FrameBuffer(gl);
        this.fboOffscreenVertMsaa.textureHandle = this.textureOffscreenVertMsaa;
        this.fboOffscreenVertMsaa.width = this.width;
        this.fboOffscreenVertMsaa.height = this.height;
        this.fboOffscreenVertMsaa.createGLData(this.width, this.height);
        console.log(`Created GaussianBlurRenderPass with dimensions ${this.width}x${this.height}`);
    }
    switchToOffscreenFBO() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboOffscreen.framebufferHandle);
        this.gl.viewport(0, 0, this.width, this.height);
    }
    switchToOffscreenFBOMsaa() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboOffscreenMsaa.framebufferMsaaHandle);
        this.gl.viewport(0, 0, this.width, this.height);
    }
    blitToTexture() {
        // Blit framebuffers, no Multisample texture 2d in WebGL 2
        this.gl.bindFramebuffer(this.gl.READ_FRAMEBUFFER, this.fboOffscreenMsaa.framebufferMsaaHandle);
        this.gl.bindFramebuffer(this.gl.DRAW_FRAMEBUFFER, this.fboOffscreen.framebufferHandle);
        this.gl.clearBufferfv(this.gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
        this.gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, this.gl.COLOR_BUFFER_BIT, this.gl.NEAREST);
    }
    get texture() {
        return this.textureOffscreen;
    }
    getShader(size) {
        switch (size) {
            case BlurSize.KERNEL_2:
                return this.blurShader2;
            case BlurSize.KERNEL_3:
                return this.blurShader3;
            default:
            case BlurSize.KERNEL_4:
                return this.blurShader4;
            case BlurSize.KERNEL_5:
                return this.blurShader5;
        }
    }
    /**
     * Binds 2D texture.
     *
     * @param textureUnit A texture unit to use
     * @param texture A texture to be used
     * @param uniform Shader's uniform ID
     */
    setTexture2D(textureUnit, texture, uniform) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(uniform, textureUnit);
    }
    blur(brightness, size) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.disable(this.gl.BLEND);
        let shader = this.getShader(size);
        shader.use();
        this.gl.uniform1f(shader.brightness, brightness);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboOffscreenVert.framebufferHandle);
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.uniform2f(shader.direction, 0.0, 1.0);
        this.setTexture2D(0, this.textureOffscreen, shader.sTexture);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboOffscreen.framebufferHandle);
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.uniform2f(shader.direction, 1.0, 0.0);
        this.setTexture2D(0, this.textureOffscreenVert, shader.sTexture);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    /**
     * Logs GL error to console.
     *
     * @param operation Operation name.
     */
    checkGlError(operation) {
        let error;
        while ((error = this.gl.getError()) !== this.gl.NO_ERROR) {
            console.error(`${operation}: glError ${error}`);
        }
    }
}
exports.GaussianBlurRenderPass = GaussianBlurRenderPass;
//# sourceMappingURL=GaussianBlurRenderPass.js.map