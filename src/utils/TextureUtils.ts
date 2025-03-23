import { SceneRenderer } from "../SceneRenderer";
import { lib } from "../KotlinLib";
import { UncompressedTextureLoader } from "webgl-framework";
import { TEXTURE_FILTERING } from "./GlConstants";
import { fetchArrayBuffer } from "./FetchUtils";

export function loadFp32Texture(
    renderer: SceneRenderer<lib.org.androidworks.engine.Scene>,
    data: ArrayBuffer,
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    clamp = false,
    type: "fp32" | "fp16" | "snorm8" | "sbyte" = "fp16",
    numberOfComponents = 3
): WebGLTexture {
    const texture = gl.createTexture();

    if (texture === null) {
        throw new Error("Error creating WebGL texture");
    }

    let internalFormat: number = gl.RGB32F;
    let format: number = gl.RGB;
    if (numberOfComponents === 2) {
        internalFormat = gl.RG32F;
        format = gl.RG;
    } else if (numberOfComponents === 1) {
        internalFormat = gl.R32F;
        format = gl.RED;
    } else if (numberOfComponents === 4) {
        internalFormat = gl.RGBA32F;
        format = gl.RGBA;
    }

    const dataView = new Float32Array(data);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    renderer.checkGlError("loadFp32Texture 0");
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, width, height, 0, gl.RGB, gl.HALF_FLOAT, dataView);
    // gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.HALF_FLOAT, dataView);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.FLOAT, dataView);
    renderer.checkGlError("loadFp32Texture 1");
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    if (clamp === true) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    renderer.checkGlError("loadFp32Texture 2");
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

export function loadFloatingPointTexture(
    renderer: SceneRenderer<lib.org.androidworks.engine.Scene>,
    data: ArrayBuffer,
    gl: WebGL2RenderingContext,
    width: number,
    height: number,
    minFilter: number | undefined = gl.LINEAR,
    magFilter: number | undefined = gl.LINEAR,
    clamp = false,
    type: "fp32" | "fp16" | "snorm8" | "sbyte" = "fp16",
    numberOfComponents = 3
): WebGLTexture {
    const texture = gl.createTexture();

    if (texture === null) {
        throw new Error("Error creating WebGL texture");
    }

    const dataView = type === "fp16"
        ? new Uint16Array(data)
        : type === "fp32"
            ? new Float32Array(data)
            : new Int8Array(data);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    renderer.checkGlError("loadFloatingPointTexture 0");

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    let internalFormat: number = gl.RGB16F;
    let format: number = gl.RGB;
    let typeValue: number = gl.HALF_FLOAT;
    if (numberOfComponents === 2) {
        internalFormat = gl.RG16F;
        format = gl.RG;
    } else if (numberOfComponents === 1) {
        internalFormat = gl.R16F;
        format = gl.RED;
    } else if (numberOfComponents === 4) {
        internalFormat = gl.RGBA16F;
        format = gl.RGBA;
    }
    if (type === "snorm8") {
        internalFormat = gl.RGB8_SNORM;
        format = gl.RGB;
        typeValue = gl.BYTE;
        if (numberOfComponents === 2) {
            internalFormat = gl.RG8_SNORM;
            format = gl.RG;
        } else if (numberOfComponents === 1) {
            internalFormat = gl.R8_SNORM;
            format = gl.RED;
        } else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA8_SNORM;
            format = gl.RGBA;
        }
    } else if (type === "sbyte") {
        internalFormat = gl.RGB8I;
        format = gl.RGB_INTEGER;
        typeValue = gl.BYTE;
        if (numberOfComponents === 2) {
            internalFormat = gl.RG8I;
            format = gl.RG_INTEGER;
        } else if (numberOfComponents === 1) {
            internalFormat = gl.R8I;
            format = gl.RED_INTEGER;
        } else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA8I;
            format = gl.RGBA_INTEGER;
        }
    } else if (type === "fp32") {
        internalFormat = gl.RGB32F;
        format = gl.RGB;
        typeValue = gl.FLOAT;
        if (numberOfComponents === 2) {
            internalFormat = gl.RG32F;
            format = gl.RG;
        } else if (numberOfComponents === 1) {
            internalFormat = gl.R32F;
            format = gl.RED;
        } else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA32F;
            format = gl.RGBA;
        }
    }
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat, // type === "fp16" ? gl.RGB16F : gl.RGB8_SNORM,
        width,
        height,
        0,
        format, //gl.RGB,
        typeValue, // type === "fp16" ? gl.HALF_FLOAT : gl.BYTE,
        dataView
    );
    renderer.checkGlError("loadFloatingPointTexture 1");
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    if (clamp === true) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    renderer.checkGlError("loadFloatingPointTexture 2");
    gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}

export async function loadRgbTexture(texture: lib.org.androidworks.engine.Texture, gl: WebGL2RenderingContext) {
    const formatName = texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";

    const glTexture = await UncompressedTextureLoader.load(
        `data/textures/${texture.fileName}.webp`, // WEBP only, instead of ASTC too
        gl,
        texture.mipmaps > 0 ? gl.LINEAR : minFilter,
        texture.mipmaps > 0 ? gl.LINEAR : magFilter,
        clamp
    );
    if (texture.mipmaps > 0) {
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    if (texture.anisotropy !== 0) {
        const ext =
            gl.getExtension("EXT_texture_filter_anisotropic") ||
            gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        if (ext) {
            const maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(maxAnisotropy, texture.anisotropy));
        }
    }
    return glTexture;
}

export async function loadRgb16fTexture(texture: lib.org.androidworks.engine.Texture, gl: WebGL2RenderingContext, renderer: SceneRenderer<lib.org.androidworks.engine.Scene>) {
    const formatName = texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";

    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(
        renderer,
        data,
        gl,
        texture.width,
        texture.height,
        minFilter,
        magFilter,
        clamp,
        "fp16",
        3
    );

    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);

    return glTexture;
}

export async function loadRgba16fTexture(texture: lib.org.androidworks.engine.Texture, gl: WebGL2RenderingContext, renderer: SceneRenderer<lib.org.androidworks.engine.Scene>) {
    const formatName = texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";

    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(
        renderer,
        data,
        gl,
        texture.width,
        texture.height,
        minFilter,
        magFilter,
        clamp,
        "fp16",
        4
    );

    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);

    return glTexture;
}

export async function loadRgb32fTexture(texture: lib.org.androidworks.engine.Texture, gl: WebGL2RenderingContext, renderer: SceneRenderer<lib.org.androidworks.engine.Scene>) {
    const formatName = texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";

    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(
        renderer,
        data,
        gl,
        texture.width,
        texture.height,
        minFilter,
        magFilter,
        clamp,
        "fp32",
        3
    );

    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);

    return glTexture;
}

export async function loadCubemap(texture: lib.org.androidworks.engine.Texture, gl: WebGL2RenderingContext) {
    return await UncompressedTextureLoader.loadCubemap(`data/textures/${texture.fileName}`, gl, "webp");
}
