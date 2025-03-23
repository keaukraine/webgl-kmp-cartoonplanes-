
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
class FullScreenUtils {
    /** Enters fullscreen. */
    enterFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen({ navigationUI: "hide" });
        }
    }
    /** Exits fullscreen */
    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    /**
     * Adds cross-browser fullscreenchange event
     *
     * @param exitHandler Function to be called on fullscreenchange event
     */
    addFullScreenListener(exitHandler) {
        document.addEventListener("fullscreenchange", exitHandler, false);
    }
    /**
     * Checks fullscreen state.
     *
     * @return `true` if fullscreen is active, `false` if not
     */
    isFullScreen() {
        return !!document.fullscreenElement;
    }
}

class BinaryDataLoader {
    static async load(url) {
        const response = await fetch(url);
        return response.arrayBuffer();
    }
}

class UncompressedTextureLoader {
    static load(url, gl, minFilter = gl.LINEAR, magFilter = gl.LINEAR, clamp = false) {
        return new Promise((resolve, reject) => {
            const texture = gl.createTexture();
            if (texture === null) {
                reject("Error creating WebGL texture");
                return;
            }
            const image = new Image();
            image.src = url;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
                if (clamp === true) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (image && image.src) {
                    console.log(`Loaded texture ${url} [${image.width}x${image.height}]`);
                }
                resolve(texture);
            };
            image.onerror = () => reject("Cannot load image");
        });
    }
    static async loadCubemap(url, gl, extension = "png") {
        const texture = gl.createTexture();
        if (texture === null) {
            throw new Error("Error creating WebGL texture");
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        const promises = [
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_X, suffix: `-posx.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, suffix: `-negx.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, suffix: `-posy.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, suffix: `-negy.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, suffix: `-posz.${extension}` },
            { type: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, suffix: `-negz.${extension}` }
        ].map(face => new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url + face.suffix;
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                // gl.texImage2D(face.type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texImage2D(face.type, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
                if (image && image.src) {
                    console.log(`Loaded texture ${url}${face.suffix} [${image.width}x${image.height}]`);
                }
                resolve();
            };
            image.onerror = () => reject("Cannot load image");
        }));
        await Promise.all(promises);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
}

class FullModel {
    /** Default constructor. */
    constructor() {
        /** Number of model indices. */
        this.numIndices = 0;
    }
    loadBuffer(gl, buffer, target, arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength);
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, byteArray, gl.STATIC_DRAW);
    }
    /**
     * Loads model.
     *
     * @param url Base URL to model indices and strides files.
     * @param gl WebGL context.
     * @returns Promise which resolves when model is loaded.
     */
    async load(url, gl) {
        const [dataIndices, dataStrides] = await Promise.all([
            BinaryDataLoader.load(`${url}-indices.bin`),
            BinaryDataLoader.load(`${url}-strides.bin`)
        ]);
        console.log(`Loaded ${url}-indices.bin (${dataIndices.byteLength} bytes)`);
        console.log(`Loaded ${url}-strides.bin (${dataStrides.byteLength} bytes)`);
        this.bufferIndices = gl.createBuffer();
        this.loadBuffer(gl, this.bufferIndices, gl.ELEMENT_ARRAY_BUFFER, dataIndices);
        this.numIndices = dataIndices.byteLength / 2 / 3;
        this.bufferStrides = gl.createBuffer();
        this.loadBuffer(gl, this.bufferStrides, gl.ARRAY_BUFFER, dataStrides);
    }
    /**
     * Binds buffers for a `glDrawElements()` call.
     *
     * @param gl WebGL context.
     */
    bindBuffers(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferStrides);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
    }
    /**
     * Returns number of indices in model.
     *
     * @return Number of indices
     */
    getNumIndices() {
        return this.numIndices;
    }
}

class BaseShader {
    /**
     * Constructor. Compiles shader.
     *
     * @param gl WebGL context.
     */
    constructor(gl) {
        this.gl = gl;
        this.vertexShaderCode = "";
        this.fragmentShaderCode = "";
        this.fillCode();
        this.initShader();
    }
    /**
     * Creates WebGL shader from code.
     *
     * @param type Shader type.
     * @param code GLSL code.
     * @returns Shader or `undefined` if there were errors during shader compilation.
     */
    getShader(type, code) {
        const shader = this.gl.createShader(type);
        if (!shader) {
            console.warn('Error creating shader.');
            return undefined;
        }
        this.gl.shaderSource(shader, code);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.warn(this.gl.getShaderInfoLog(shader));
            return undefined;
        }
        return shader;
    }
    /**
     * Get shader unform location.
     *
     * @param uniform Uniform name.
     * @return Uniform location.
     */
    getUniform(uniform) {
        if (this.program === undefined) {
            throw new Error('No program for shader.');
        }
        const result = this.gl.getUniformLocation(this.program, uniform);
        if (result !== null) {
            return result;
        }
        else {
            throw new Error(`Cannot get uniform "${uniform}".`);
        }
    }
    /**
     * Get shader attribute location.
     *
     * @param attrib Attribute name.
     * @return Attribute location.
     */
    getAttrib(attrib) {
        if (this.program === undefined) {
            throw new Error("No program for shader.");
        }
        return this.gl.getAttribLocation(this.program, attrib);
    }
    /** Initializes shader. */
    initShader() {
        const fragmentShader = this.getShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderCode);
        const vertexShader = this.getShader(this.gl.VERTEX_SHADER, this.vertexShaderCode);
        const shaderProgram = this.gl.createProgram();
        if (fragmentShader === undefined || vertexShader === undefined || shaderProgram === null) {
            return;
        }
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.warn(this.constructor.name + ": Could not initialise shader");
        }
        else {
            console.log(this.constructor.name + ": Initialised shader");
        }
        this.gl.useProgram(shaderProgram);
        this.program = shaderProgram;
        this.fillUniformsAttributes();
    }
    /** Activates shader. */
    use() {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }
    /** Deletes shader. */
    deleteProgram() {
        if (this.program) {
            this.gl.deleteProgram(this.program);
        }
    }
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE$1 = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$2() {
  var out = new ARRAY_TYPE$1(9);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$3() {
  var out = new ARRAY_TYPE$1(16);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity$3(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */

function multiply$3(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate$2(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$3(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate$3(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ$1(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$4() {
  var out = new ARRAY_TYPE$1(3);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$4(x, y, z) {
  var out = new ARRAY_TYPE$1(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$4();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$5() {
  var out = new ARRAY_TYPE$1(4);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$5();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$6() {
  var out = new ARRAY_TYPE$1(4);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$2 = normalize$1$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$4();
  var xUnitVec3 = fromValues$4(1, 0, 0);
  var yUnitVec3 = fromValues$4(0, 1, 0);
  return function (out, a, b) {
    var dot$$1 = dot(a, b);

    if (dot$$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize$1(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$$1;
      return normalize$2(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

(function () {
  var temp1 = create$6();
  var temp2 = create$6();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

(function () {
  var matr = create$2();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
})();

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$8() {
  var out = new ARRAY_TYPE$1(2);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$8();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

class BaseRenderer {
    constructor() {
        this.mMMatrix = create$3();
        this.mVMatrix = create$3();
        this.mMVPMatrix = create$3();
        this.mProjMatrix = create$3();
        this.matOrtho = create$3();
        this.m_boundTick = this.tick.bind(this);
        this.isWebGL2 = false;
        this.viewportWidth = 0;
        this.viewportHeight = 0;
    }
    /** Getter for current WebGL context. */
    get gl() {
        if (this.m_gl === undefined) {
            throw new Error("No WebGL context");
        }
        return this.m_gl;
    }
    /** Logs last GL error to console */
    logGLError() {
        var err = this.gl.getError();
        if (err !== this.gl.NO_ERROR) {
            console.warn(`WebGL error # + ${err}`);
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
    /**
     * Binds cubemap texture.
     *
     * @param textureUnit A texture unit to use
     * @param texture A texture to be used
     * @param uniform Shader's uniform ID
     */
    setTextureCubemap(textureUnit, texture, uniform) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);
        this.gl.uniform1i(uniform, textureUnit);
    }
    /**
     * Calculates FOV for matrix.
     *
     * @param matrix Output matrix
     * @param fovY Vertical FOV in degrees
     * @param aspect Aspect ratio of viewport
     * @param zNear Near clipping plane distance
     * @param zFar Far clipping plane distance
     */
    setFOV(matrix, fovY, aspect, zNear, zFar) {
        const fH = Math.tan(fovY / 360.0 * Math.PI) * zNear;
        const fW = fH * aspect;
        frustum(matrix, -fW, fW, -fH, fH, zNear, zFar);
    }
    /**
     * Calculates MVP matrix. Saved in this.mMVPMatrix
     */
    calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz) {
        identity$3(this.mMMatrix);
        rotate$3(this.mMMatrix, this.mMMatrix, 0, [1, 0, 0]);
        translate$2(this.mMMatrix, this.mMMatrix, [tx, ty, tz]);
        scale$3(this.mMMatrix, this.mMMatrix, [sx, sy, sz]);
        rotateX$1(this.mMMatrix, this.mMMatrix, rx);
        rotateY$1(this.mMMatrix, this.mMMatrix, ry);
        rotateZ$1(this.mMMatrix, this.mMMatrix, rz);
        multiply$3(this.mMVPMatrix, this.mVMatrix, this.mMMatrix);
        multiply$3(this.mMVPMatrix, this.mProjMatrix, this.mMVPMatrix);
    }
    /** Perform each frame's draw calls here. */
    drawScene() {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    /** Called on each frame. */
    tick() {
        requestAnimationFrame(this.m_boundTick);
        this.resizeCanvas();
        this.drawScene();
        this.animate();
    }
    /**
     * Initializes WebGL context.
     *
     * @param canvas Canvas to initialize WebGL.
     */
    initGL(canvas) {
        const gl = canvas.getContext("webgl", { alpha: false });
        if (gl === null) {
            throw new Error("Cannot initialize WebGL context");
        }
        // this.isETC1Supported = !!gl.getExtension('WEBGL_compressed_texture_etc1');
        return gl;
    }
    ;
    /**
     * Initializes WebGL 2 context
     *
     * @param canvas Canvas to initialize WebGL 2.
     */
    initGL2(canvas) {
        let gl = canvas.getContext("webgl2", { alpha: false });
        if (gl === null) {
            console.warn('Could not initialise WebGL 2, falling back to WebGL 1');
            return this.initGL(canvas);
        }
        return gl;
    }
    ;
    /**
     * Generates mipmasp for textures.
     *
     * @param textures Textures to generate mipmaps for.
     */
    generateMipmaps(...textures) {
        for (const texture of textures) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        }
    }
    /**
     * Initializes WebGL and calls all callbacks.
     *
     * @param canvasID ID of canvas element to initialize WebGL.
     * @param requestWebGL2 Set to `true` to initialize WebGL 2 context.
     */
    init(canvasID, requestWebGL2 = false) {
        this.onBeforeInit();
        this.canvas = document.getElementById(canvasID);
        if (this.canvas === null) {
            throw new Error("Cannot find canvas element");
        }
        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;
        this.m_gl = !!requestWebGL2 ? this.initGL2(this.canvas) : this.initGL(this.canvas);
        if (this.m_gl) {
            this.resizeCanvas();
            this.onAfterInit();
            this.initShaders();
            this.loadData();
            this.m_boundTick();
        }
        else {
            this.onInitError();
        }
    }
    /** Adjusts viewport according to resizing of canvas. */
    resizeCanvas() {
        if (this.canvas === undefined) {
            return;
        }
        const cssToRealPixels = window.devicePixelRatio || 1;
        const displayWidth = Math.floor(this.canvas.clientWidth * cssToRealPixels);
        const displayHeight = Math.floor(this.canvas.clientHeight * cssToRealPixels);
        if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
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
    /** @inheritdoc */
    unbindBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
    /** @inheritdoc */
    getMVPMatrix() {
        return this.mMVPMatrix;
    }
    /** @inheritdoc */
    getOrthoMatrix() {
        return this.matOrtho;
    }
    /** @inheritdoc */
    getModelMatrix() {
        return this.mMMatrix;
    }
    /** @inheritdoc */
    getViewMatrix() {
        return this.mVMatrix;
    }
    /** @inheritdoc */
    getProjectionMatrix() {
        return this.mProjMatrix;
    }
}

class FrameBuffer {
    /** Constructor. */
    constructor(gl) {
        this.gl = gl;
        this.m_textureHandle = null;
        this.m_depthTextureHandle = null;
        this.m_framebufferHandle = null;
        this.m_depthbufferHandle = null;
    }
    /** Creates OpenGL objects */
    createGLData(width, height) {
        this.m_width = width;
        this.m_height = height;
        if (this.m_textureHandle !== null && this.m_width > 0 && this.m_height > 0) {
            this.m_framebufferHandle = this.gl.createFramebuffer(); // alternative to GLES20.glGenFramebuffers()
            if (this.m_textureHandle !== null) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_textureHandle);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.m_textureHandle, 0);
                this.checkGlError("FB");
            }
            if (this.m_depthTextureHandle === null) {
                this.m_depthbufferHandle = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.m_depthbufferHandle);
                this.checkGlError("FB - glBindRenderbuffer");
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
                this.checkGlError("FB - glRenderbufferStorage");
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.m_depthbufferHandle);
                this.checkGlError("FB - glFramebufferRenderbuffer");
            }
            else {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_depthTextureHandle);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.m_depthTextureHandle, 0);
                this.checkGlError("FB depth");
            }
            const result = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
            if (result != this.gl.FRAMEBUFFER_COMPLETE) {
                console.error(`Error creating framebufer: ${result}`);
            }
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            // this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    }
    checkGlError(op) {
        let error;
        while ((error = this.gl.getError()) !== this.gl.NO_ERROR) {
            console.error(`${op}: glError ${error}`);
        }
    }
    get width() {
        return this.m_width;
    }
    set width(value) {
        this.m_width = value;
    }
    get height() {
        return this.m_height;
    }
    set height(value) {
        this.m_height = value;
    }
    get textureHandle() {
        return this.m_textureHandle;
    }
    set textureHandle(value) {
        this.m_textureHandle = value;
    }
    get depthbufferHandle() {
        return this.m_depthbufferHandle;
    }
    set depthbufferHandle(value) {
        this.m_depthbufferHandle = value;
    }
    get framebufferHandle() {
        return this.m_framebufferHandle;
    }
    set framebufferHandle(value) {
        this.m_framebufferHandle = value;
    }
    get depthTextureHandle() {
        return this.m_depthTextureHandle;
    }
    set depthTextureHandle(value) {
        this.m_depthTextureHandle = value;
    }
}

class MsaaFrameBuffer {
    /** Constructor. */
    constructor(gl) {
        this.gl = gl;
        this.m_textureHandle = null;
        this.m_depthTextureHandle = null;
        this.m_framebufferHandle = null;
        this.m_framebufferMsaaHandle = null;
        this.m_depthBufferHandle = null;
        this.m_depthBufferMsaaHandle = null;
        this.m_colorBufferHandle = null;
    }
    /** Creates OpenGL objects */
    createGLData(width, height) {
        this.m_width = width;
        this.m_height = height;
        if (this.m_textureHandle !== null && this.m_width > 0 && this.m_height > 0) {
            this.m_framebufferHandle = this.gl.createFramebuffer(); // alternative to GLES20.glGenFramebuffers()
            if (this.m_textureHandle !== null) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_textureHandle);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.m_textureHandle, 0);
                this.checkGlError("FB");
            }
            if (this.m_depthTextureHandle === null) {
                this.m_depthBufferHandle = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.m_depthBufferHandle);
                this.checkGlError("FB - glBindRenderbuffer");
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
                // this.gl.renderbufferStorageMultisample(this.gl.RENDERBUFFER, 4, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
                this.checkGlError("FB - glRenderbufferStorage");
                // this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.m_depthbufferHandle);
                this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.m_depthBufferHandle);
                this.checkGlError("FB - glFramebufferRenderbuffer");
            }
            else {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.m_depthTextureHandle);
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferHandle);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.m_depthTextureHandle, 0);
                this.checkGlError("FB depth");
            }
            const result = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
            if (result != this.gl.FRAMEBUFFER_COMPLETE) {
                console.error(`Error creating framebufer: ${result}`);
            }
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            // this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.m_depthBufferMsaaHandle = this.gl.createRenderbuffer();
            this.m_framebufferMsaaHandle = this.gl.createFramebuffer(); // alternative to GLES20.glGenFramebuffers()
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.m_framebufferMsaaHandle);
            this.m_colorBufferHandle = this.gl.createRenderbuffer();
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.m_colorBufferHandle);
            this.gl.renderbufferStorageMultisample(this.gl.RENDERBUFFER, 4, this.gl.RGB8, this.m_width, this.m_height);
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.RENDERBUFFER, this.m_colorBufferHandle);
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.m_depthBufferMsaaHandle);
            // this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
            this.gl.renderbufferStorageMultisample(this.gl.RENDERBUFFER, 4, this.gl.DEPTH_COMPONENT16, this.m_width, this.m_height);
            this.checkGlError("FB - glRenderbufferStorage");
            this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.m_depthBufferMsaaHandle);
            const result2 = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER);
            if (result2 != this.gl.FRAMEBUFFER_COMPLETE) {
                console.error(`Error creating MSAA framebufer: ${result2}`);
            }
            this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
            // this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        }
    }
    checkGlError(op) {
        let error;
        while ((error = this.gl.getError()) !== this.gl.NO_ERROR) {
            console.error(`${op}: glError ${error}`);
        }
    }
    get width() {
        return this.m_width;
    }
    set width(value) {
        this.m_width = value;
    }
    get height() {
        return this.m_height;
    }
    set height(value) {
        this.m_height = value;
    }
    get textureHandle() {
        return this.m_textureHandle;
    }
    set textureHandle(value) {
        this.m_textureHandle = value;
    }
    get depthbufferHandle() {
        return this.m_depthBufferHandle;
    }
    set depthbufferHandle(value) {
        this.m_depthBufferHandle = value;
    }
    get framebufferHandle() {
        return this.m_framebufferHandle;
    }
    set framebufferHandle(value) {
        this.m_framebufferHandle = value;
    }
    get depthTextureHandle() {
        return this.m_depthTextureHandle;
    }
    set depthTextureHandle(value) {
        this.m_depthTextureHandle = value;
    }
    get colorBufferHandle() {
        return this.m_colorBufferHandle;
    }
    get framebufferMsaaHandle() {
        return this.m_framebufferMsaaHandle;
    }
}

/** Utilities to create various textures. */
class TextureUtils {
    /**
     * Creates non-power-of-two (NPOT) texture.
     *
     * @param gl WebGL context.
     * @param texWidth Texture width.
     * @param texHeight Texture height.
     * @param hasAlpha Set to `true` to create texture with alpha channel.
     */
    static createNpotTexture(gl, texWidth, texHeight, hasAlpha = false) {
        const textureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        let glFormat = null, glInternalFormat = null;
        if (hasAlpha) {
            glFormat = gl.RGBA;
            glInternalFormat = gl.RGBA;
        }
        else {
            glFormat = gl.RGB;
            glInternalFormat = gl.RGB;
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, gl.UNSIGNED_BYTE, null);
        return textureID;
    }
    /**
     * Creates depth texture.
     *
     * @param gl WebGL context.
     * @param texWidth Texture width.
     * @param texHeight Texture height.
     */
    static createDepthTexture(gl, texWidth, texHeight) {
        const textureID = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureID);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const version = gl.getParameter(gl.VERSION) || "";
        const glFormat = gl.DEPTH_COMPONENT;
        const glInternalFormat = version.includes("WebGL 2")
            ? gl.DEPTH_COMPONENT16
            : gl.DEPTH_COMPONENT;
        const type = gl.UNSIGNED_SHORT;
        // In WebGL, we cannot pass array to depth texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, glInternalFormat, texWidth, texHeight, 0, glFormat, type, null);
        return textureID;
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var kotlinKotlinStdlib = createCommonjsModule(function (module, exports) {
//region block: polyfills
if (typeof ArrayBuffer.isView === 'undefined') {
  ArrayBuffer.isView = function (a) {
    return a != null && a.__proto__ != null && a.__proto__.__proto__ === Int8Array.prototype.__proto__;
  };
}
if (typeof Array.prototype.fill === 'undefined') {
  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
  Object.defineProperty(Array.prototype, 'fill', {value: function (value) {
    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this); // Steps 3-5.
    var len = O.length >>> 0; // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0; // Step 8.
    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len); // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0; // Step 11.
    var finalValue = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len); // Step 12.
    while (k < finalValue) {
      O[k] = value;
      k++;
    }
    return O;
  }});
}
[Int8Array, Int16Array, Uint16Array, Int32Array, Float32Array, Float64Array].forEach(function (TypedArray) {
  if (typeof TypedArray.prototype.fill === 'undefined') {
    Object.defineProperty(TypedArray.prototype, 'fill', {value: Array.prototype.fill});
  }
});
if (typeof Math.clz32 === 'undefined') {
  Math.clz32 = function (log, LN2) {
    return function (x) {
      var asUint = x >>> 0;
      if (asUint === 0) {
        return 32;
      }
      return 31 - (log(asUint) / LN2 | 0) | 0; // the "| 0" acts like math.floor
    };
  }(Math.log, Math.LN2);
}
if (typeof Math.imul === 'undefined') {
  Math.imul = function imul(a, b) {
    return (a & 4.29490176E9) * (b & 65535) + (a & 65535) * (b | 0) | 0;
  };
}
//endregion
(function (root, factory) {
  factory(module.exports);
}(commonjsGlobal, function (_) {
  //region block: imports
  var clz32 = Math.clz32;
  var isView = ArrayBuffer.isView;
  var imul = Math.imul;
  //endregion
  //region block: pre-declaration
  setMetadataFor(CharSequence, 'CharSequence', interfaceMeta);
  setMetadataFor(Number_0, 'Number', classMeta);
  setMetadataFor(Unit, 'Unit', objectMeta);
  setMetadataFor(IntCompanionObject, 'IntCompanionObject', objectMeta);
  setMetadataFor(Collection, 'Collection', interfaceMeta);
  setMetadataFor(AbstractCollection, 'AbstractCollection', classMeta, VOID, [Collection]);
  setMetadataFor(AbstractMutableCollection, 'AbstractMutableCollection', classMeta, AbstractCollection, [AbstractCollection, Collection]);
  setMetadataFor(IteratorImpl, 'IteratorImpl', classMeta);
  setMetadataFor(List, 'List', interfaceMeta, VOID, [Collection]);
  setMetadataFor(AbstractMutableList, 'AbstractMutableList', classMeta, AbstractMutableCollection, [AbstractMutableCollection, List, Collection]);
  setMetadataFor(Map_0, 'Map', interfaceMeta);
  setMetadataFor(AbstractMap, 'AbstractMap', classMeta, VOID, [Map_0]);
  setMetadataFor(AbstractMutableMap, 'AbstractMutableMap', classMeta, AbstractMap, [AbstractMap, Map_0]);
  setMetadataFor(Set, 'Set', interfaceMeta, VOID, [Collection]);
  setMetadataFor(AbstractMutableSet, 'AbstractMutableSet', classMeta, AbstractMutableCollection, [AbstractMutableCollection, Collection, Set]);
  setMetadataFor(Companion, 'Companion', objectMeta);
  setMetadataFor(ArrayList, 'ArrayList', classMeta, AbstractMutableList, [AbstractMutableList, List, Collection], ArrayList_init_$Create$);
  setMetadataFor(HashMap, 'HashMap', classMeta, AbstractMutableMap, [AbstractMutableMap, Map_0], HashMap_init_$Create$);
  setMetadataFor(HashMapValues, 'HashMapValues', classMeta, AbstractMutableCollection, [Collection, AbstractMutableCollection]);
  setMetadataFor(HashMapEntrySetBase, 'HashMapEntrySetBase', classMeta, AbstractMutableSet, [Collection, Set, AbstractMutableSet]);
  setMetadataFor(HashMapEntrySet, 'HashMapEntrySet', classMeta, HashMapEntrySetBase);
  setMetadataFor(HashMapValuesDefault$iterator$1, VOID, classMeta);
  setMetadataFor(HashMapValuesDefault, 'HashMapValuesDefault', classMeta, AbstractMutableCollection);
  setMetadataFor(Companion_0, 'Companion', objectMeta);
  setMetadataFor(Itr, 'Itr', classMeta);
  setMetadataFor(ValuesItr, 'ValuesItr', classMeta, Itr);
  setMetadataFor(EntriesItr, 'EntriesItr', classMeta, Itr);
  setMetadataFor(Entry, 'Entry', interfaceMeta);
  setMetadataFor(EntryRef, 'EntryRef', classMeta, VOID, [Entry]);
  function containsAllEntries(m) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(m, Collection)) {
        tmp = m.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = m.h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.InternalMap.containsAllEntries.<anonymous>' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var entry = element;
        var tmp_0;
        if (!(entry == null) ? isInterface(entry, Entry) : false) {
          tmp_0 = this.y3(entry);
        } else {
          tmp_0 = false;
        }
        if (!tmp_0) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  }
  setMetadataFor(InternalMap, 'InternalMap', interfaceMeta);
  setMetadataFor(InternalHashMap, 'InternalHashMap', classMeta, VOID, [InternalMap], InternalHashMap_init_$Create$);
  setMetadataFor(LinkedHashMap, 'LinkedHashMap', classMeta, HashMap, [HashMap, Map_0], LinkedHashMap_init_$Create$);
  setMetadataFor(StringBuilder, 'StringBuilder', classMeta, VOID, [CharSequence], StringBuilder_init_$Create$_0);
  setMetadataFor(Char, 'Char', classMeta);
  setMetadataFor(Companion_1, 'Companion', objectMeta);
  setMetadataFor(Enum, 'Enum', classMeta);
  setMetadataFor(arrayIterator$1, VOID, classMeta);
  setMetadataFor(Companion_2, 'Companion', objectMeta);
  setMetadataFor(Long, 'Long', classMeta, Number_0);
  setMetadataFor(Exception, 'Exception', classMeta, Error, VOID, Exception_init_$Create$);
  setMetadataFor(RuntimeException, 'RuntimeException', classMeta, Exception, VOID, RuntimeException_init_$Create$);
  setMetadataFor(IllegalArgumentException, 'IllegalArgumentException', classMeta, RuntimeException, VOID, IllegalArgumentException_init_$Create$);
  setMetadataFor(IndexOutOfBoundsException, 'IndexOutOfBoundsException', classMeta, RuntimeException, VOID, IndexOutOfBoundsException_init_$Create$);
  setMetadataFor(IllegalStateException, 'IllegalStateException', classMeta, RuntimeException, VOID, IllegalStateException_init_$Create$);
  setMetadataFor(UnsupportedOperationException, 'UnsupportedOperationException', classMeta, RuntimeException, VOID, UnsupportedOperationException_init_$Create$);
  setMetadataFor(NoSuchElementException, 'NoSuchElementException', classMeta, RuntimeException, VOID, NoSuchElementException_init_$Create$);
  setMetadataFor(ConcurrentModificationException, 'ConcurrentModificationException', classMeta, RuntimeException, VOID, ConcurrentModificationException_init_$Create$);
  setMetadataFor(NullPointerException, 'NullPointerException', classMeta, RuntimeException, VOID, NullPointerException_init_$Create$);
  setMetadataFor(ClassCastException, 'ClassCastException', classMeta, RuntimeException, VOID, ClassCastException_init_$Create$);
  setMetadataFor(Companion_3, 'Companion', objectMeta);
  setMetadataFor(Companion_4, 'Companion', objectMeta);
  setMetadataFor(Companion_5, 'Companion', objectMeta);
  setMetadataFor(EmptyList, 'EmptyList', objectMeta, VOID, [List]);
  setMetadataFor(ArrayAsCollection, 'ArrayAsCollection', classMeta, VOID, [Collection]);
  setMetadataFor(EmptyIterator, 'EmptyIterator', objectMeta);
  setMetadataFor(EmptyMap, 'EmptyMap', objectMeta, VOID, [Map_0]);
  setMetadataFor(EmptySet, 'EmptySet', objectMeta, VOID, [Set]);
  setMetadataFor(Random, 'Random', classMeta);
  setMetadataFor(Default, 'Default', objectMeta, Random);
  setMetadataFor(Companion_6, 'Companion', objectMeta);
  setMetadataFor(XorWowRandom, 'XorWowRandom', classMeta, Random);
  setMetadataFor(Pair, 'Pair', classMeta);
  //endregion
  function CharSequence() {
  }
  function Number_0() {
  }
  function Unit() {
  }
  protoOf(Unit).toString = function () {
    return 'kotlin.Unit';
  };
  var Unit_instance;
  function IntCompanionObject() {
    this.MIN_VALUE = -2147483648;
    this.MAX_VALUE = 2147483647;
    this.SIZE_BYTES = 4;
    this.SIZE_BITS = 32;
  }
  protoOf(IntCompanionObject).a = function () {
    return this.MIN_VALUE;
  };
  protoOf(IntCompanionObject).b = function () {
    return this.MAX_VALUE;
  };
  protoOf(IntCompanionObject).c = function () {
    return this.SIZE_BYTES;
  };
  protoOf(IntCompanionObject).d = function () {
    return this.SIZE_BITS;
  };
  var IntCompanionObject_instance;
  function isNaN_0(_this__u8e3s4) {
    return !(_this__u8e3s4 === _this__u8e3s4);
  }
  function takeHighestOneBit(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4 === 0) {
      tmp = 0;
    } else {
      var tmp_0 = 32 - 1 | 0;
      // Inline function 'kotlin.countLeadingZeroBits' call
      tmp = 1 << (tmp_0 - clz32(_this__u8e3s4) | 0);
    }
    return tmp;
  }
  function collectionToArray(collection) {
    return collectionToArrayCommonImpl(collection);
  }
  function listOf(element) {
    return arrayListOf([element]);
  }
  function mapCapacity(expectedSize) {
    return expectedSize;
  }
  function copyToArray(collection) {
    var tmp;
    // Inline function 'kotlin.js.asDynamic' call
    if (collection.toArray !== undefined) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = collection.toArray();
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = collectionToArray(collection);
    }
    return tmp;
  }
  function arrayCopy(source, destination, destinationOffset, startIndex, endIndex) {
    Companion_instance_3.f(startIndex, endIndex, source.length);
    var rangeSize = endIndex - startIndex | 0;
    Companion_instance_3.f(destinationOffset, destinationOffset + rangeSize | 0, destination.length);
    if (isView(destination) ? isView(source) : false) {
      // Inline function 'kotlin.js.asDynamic' call
      var subrange = source.subarray(startIndex, endIndex);
      // Inline function 'kotlin.js.asDynamic' call
      destination.set(subrange, destinationOffset);
    } else {
      if (!(source === destination) ? true : destinationOffset <= startIndex) {
        var inductionVariable = 0;
        if (inductionVariable < rangeSize)
          do {
            var index = inductionVariable;
            inductionVariable = inductionVariable + 1 | 0;
            destination[destinationOffset + index | 0] = source[startIndex + index | 0];
          }
           while (inductionVariable < rangeSize);
      } else {
        var inductionVariable_0 = rangeSize - 1 | 0;
        if (0 <= inductionVariable_0)
          do {
            var index_0 = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + -1 | 0;
            destination[destinationOffset + index_0 | 0] = source[startIndex + index_0 | 0];
          }
           while (0 <= inductionVariable_0);
      }
    }
  }
  function AbstractMutableCollection() {
    AbstractCollection.call(this);
  }
  protoOf(AbstractMutableCollection).toJSON = function () {
    return this.toArray();
  };
  function IteratorImpl($outer) {
    this.n_1 = $outer;
    this.l_1 = 0;
    this.m_1 = -1;
  }
  protoOf(IteratorImpl).o = function () {
    return this.l_1 < this.n_1.g();
  };
  protoOf(IteratorImpl).p = function () {
    if (!this.o())
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.l_1;
    this.l_1 = tmp1 + 1 | 0;
    tmp.m_1 = tmp1;
    return this.n_1.q(this.m_1);
  };
  function AbstractMutableList() {
    AbstractMutableCollection.call(this);
    this.r_1 = 0;
  }
  protoOf(AbstractMutableList).h = function () {
    return new IteratorImpl(this);
  };
  protoOf(AbstractMutableList).i = function (element) {
    return this.t(element) >= 0;
  };
  protoOf(AbstractMutableList).t = function (element) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.indexOfFirst' call
      var index = 0;
      var tmp0_iterator = this.h();
      while (tmp0_iterator.o()) {
        var item = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractMutableList.indexOf.<anonymous>' call
        if (equals(item, element)) {
          tmp$ret$1 = index;
          break $l$block;
        }
        index = index + 1 | 0;
      }
      tmp$ret$1 = -1;
    }
    return tmp$ret$1;
  };
  protoOf(AbstractMutableList).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, List) : false))
      return false;
    return Companion_instance_3.u(this, other);
  };
  protoOf(AbstractMutableList).hashCode = function () {
    return Companion_instance_3.v(this);
  };
  function AbstractMutableMap() {
    AbstractMap.call(this);
    this.y_1 = null;
    this.z_1 = null;
  }
  protoOf(AbstractMutableMap).a1 = function () {
    return new HashMapValuesDefault(this);
  };
  protoOf(AbstractMutableMap).b1 = function () {
    var tmp0_elvis_lhs = this.z_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = this.a1();
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.collections.AbstractMutableMap.<get-values>.<anonymous>' call
      this.z_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  function AbstractMutableSet() {
    AbstractMutableCollection.call(this);
  }
  protoOf(AbstractMutableSet).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, Set) : false))
      return false;
    return Companion_instance_5.k1(this, other);
  };
  protoOf(AbstractMutableSet).hashCode = function () {
    return Companion_instance_5.l1(this);
  };
  function arrayOfUninitializedElements(capacity) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(capacity >= 0)) {
      // Inline function 'kotlin.collections.arrayOfUninitializedElements.<anonymous>' call
      var message = 'capacity must be non-negative.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.arrayOfNulls' call
    // Inline function 'kotlin.js.asDynamic' call
    return fillArrayVal(Array(capacity), null);
  }
  function resetRange(_this__u8e3s4, fromIndex, toIndex) {
    // Inline function 'kotlin.js.nativeFill' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.fill(null, fromIndex, toIndex);
  }
  function copyOfUninitializedElements(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return copyOf_0(_this__u8e3s4, newSize);
  }
  function Companion() {
    Companion_instance = this;
    var tmp = this;
    // Inline function 'kotlin.also' call
    var this_0 = ArrayList_init_$Create$_0(0);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.Companion.Empty.<anonymous>' call
    this_0.o1_1 = true;
    tmp.p1_1 = this_0;
  }
  var Companion_instance;
  function Companion_getInstance() {
    if (Companion_instance == null)
      new Companion();
    return Companion_instance;
  }
  function ArrayList_init_$Init$($this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$() {
    return ArrayList_init_$Init$(objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_0(initialCapacity, $this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(initialCapacity >= 0)) {
      // Inline function 'kotlin.collections.ArrayList.<init>.<anonymous>' call
      var message = 'Negative initial capacity: ' + initialCapacity;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function ArrayList_init_$Create$_0(initialCapacity) {
    return ArrayList_init_$Init$_0(initialCapacity, objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_1(elements, $this) {
    // Inline function 'kotlin.collections.toTypedArray' call
    var tmp$ret$0 = copyToArray(elements);
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$_1(elements) {
    return ArrayList_init_$Init$_1(elements, objectCreate(protoOf(ArrayList)));
  }
  function rangeCheck($this, index) {
    // Inline function 'kotlin.apply' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.ArrayList.rangeCheck.<anonymous>' call
    Companion_instance_3.q1(index, $this.g());
    return index;
  }
  function ArrayList(array) {
    Companion_getInstance();
    AbstractMutableList.call(this);
    this.n1_1 = array;
    this.o1_1 = false;
  }
  protoOf(ArrayList).g = function () {
    return this.n1_1.length;
  };
  protoOf(ArrayList).q = function (index) {
    var tmp = this.n1_1[rangeCheck(this, index)];
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).s = function (index, element) {
    this.r1();
    rangeCheck(this, index);
    // Inline function 'kotlin.apply' call
    var this_0 = this.n1_1[index];
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.ArrayList.set.<anonymous>' call
    this.n1_1[index] = element;
    var tmp = this_0;
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).t = function (element) {
    return indexOf(this.n1_1, element);
  };
  protoOf(ArrayList).toString = function () {
    return arrayToString(this.n1_1);
  };
  protoOf(ArrayList).s1 = function () {
    return [].slice.call(this.n1_1);
  };
  protoOf(ArrayList).toArray = function () {
    return this.s1();
  };
  protoOf(ArrayList).r1 = function () {
    if (this.o1_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  function HashMap_init_$Init$(internalMap, $this) {
    AbstractMutableMap.call($this);
    HashMap.call($this);
    $this.x1_1 = internalMap;
    return $this;
  }
  function HashMap_init_$Init$_0($this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$(), $this);
    return $this;
  }
  function HashMap_init_$Create$() {
    return HashMap_init_$Init$_0(objectCreate(protoOf(HashMap)));
  }
  function HashMap_init_$Init$_1(initialCapacity, loadFactor, $this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$_0(initialCapacity, loadFactor), $this);
    return $this;
  }
  function HashMap_init_$Init$_2(initialCapacity, $this) {
    HashMap_init_$Init$_1(initialCapacity, 1.0, $this);
    return $this;
  }
  protoOf(HashMap).f1 = function (key) {
    return this.x1_1.z1(key);
  };
  protoOf(HashMap).g1 = function (value) {
    return this.x1_1.g1(value);
  };
  protoOf(HashMap).a1 = function () {
    return new HashMapValues(this.x1_1);
  };
  protoOf(HashMap).j1 = function () {
    var tmp0_elvis_lhs = this.y1_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = new HashMapEntrySet(this.x1_1);
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.collections.HashMap.<get-entries>.<anonymous>' call
      this.y1_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(HashMap).i1 = function (key) {
    return this.x1_1.i1(key);
  };
  protoOf(HashMap).c1 = function (key, value) {
    return this.x1_1.c1(key, value);
  };
  protoOf(HashMap).g = function () {
    return this.x1_1.g();
  };
  function HashMap() {
    this.y1_1 = null;
  }
  function HashMapValues(backing) {
    AbstractMutableCollection.call(this);
    this.a2_1 = backing;
  }
  protoOf(HashMapValues).g = function () {
    return this.a2_1.g();
  };
  protoOf(HashMapValues).k = function () {
    return this.a2_1.g() === 0;
  };
  protoOf(HashMapValues).b2 = function (element) {
    return this.a2_1.g1(element);
  };
  protoOf(HashMapValues).i = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.b2((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValues).h = function () {
    return this.a2_1.c2();
  };
  function HashMapEntrySet(backing) {
    HashMapEntrySetBase.call(this, backing);
  }
  protoOf(HashMapEntrySet).h = function () {
    return this.e2_1.f2();
  };
  function HashMapEntrySetBase(backing) {
    AbstractMutableSet.call(this);
    this.e2_1 = backing;
  }
  protoOf(HashMapEntrySetBase).g = function () {
    return this.e2_1.g();
  };
  protoOf(HashMapEntrySetBase).k = function () {
    return this.e2_1.g() === 0;
  };
  protoOf(HashMapEntrySetBase).g2 = function (element) {
    return this.e2_1.h2(element);
  };
  protoOf(HashMapEntrySetBase).i = function (element) {
    if (!(!(element == null) ? isInterface(element, Entry) : false))
      return false;
    return this.g2((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).j = function (elements) {
    return this.e2_1.i2(elements);
  };
  function HashMapValuesDefault$iterator$1($entryIterator) {
    this.j2_1 = $entryIterator;
  }
  protoOf(HashMapValuesDefault$iterator$1).o = function () {
    return this.j2_1.o();
  };
  protoOf(HashMapValuesDefault$iterator$1).p = function () {
    return this.j2_1.p().k2();
  };
  function HashMapValuesDefault(backingMap) {
    AbstractMutableCollection.call(this);
    this.l2_1 = backingMap;
  }
  protoOf(HashMapValuesDefault).b2 = function (element) {
    return this.l2_1.g1(element);
  };
  protoOf(HashMapValuesDefault).i = function (element) {
    if (!(element == null ? true : !(element == null)))
      return false;
    return this.b2((element == null ? true : !(element == null)) ? element : THROW_CCE());
  };
  protoOf(HashMapValuesDefault).h = function () {
    var entryIterator = this.l2_1.j1().h();
    return new HashMapValuesDefault$iterator$1(entryIterator);
  };
  protoOf(HashMapValuesDefault).g = function () {
    return this.l2_1.g();
  };
  function computeHashSize($this, capacity) {
    return takeHighestOneBit(imul(coerceAtLeast(capacity, 1), 3));
  }
  function computeShift($this, hashSize) {
    // Inline function 'kotlin.countLeadingZeroBits' call
    return clz32(hashSize) + 1 | 0;
  }
  function InternalHashMap_init_$Init$($this) {
    InternalHashMap_init_$Init$_0(8, $this);
    return $this;
  }
  function InternalHashMap_init_$Create$() {
    return InternalHashMap_init_$Init$(objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_0(initialCapacity, $this) {
    InternalHashMap.call($this, arrayOfUninitializedElements(initialCapacity), null, new Int32Array(initialCapacity), new Int32Array(computeHashSize(Companion_instance_0, initialCapacity)), 2, 0);
    return $this;
  }
  function InternalHashMap_init_$Init$_1(initialCapacity, loadFactor, $this) {
    InternalHashMap_init_$Init$_0(initialCapacity, $this);
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(loadFactor > 0.0)) {
      // Inline function 'kotlin.collections.InternalHashMap.<init>.<anonymous>' call
      var message = 'Non-positive load factor: ' + loadFactor;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function InternalHashMap_init_$Create$_0(initialCapacity, loadFactor) {
    return InternalHashMap_init_$Init$_1(initialCapacity, loadFactor, objectCreate(protoOf(InternalHashMap)));
  }
  function _get_capacity__a9k9f3($this) {
    return $this.m2_1.length;
  }
  function _get_hashSize__tftcho($this) {
    return $this.p2_1.length;
  }
  function registerModification($this) {
    $this.t2_1 = $this.t2_1 + 1 | 0;
  }
  function ensureExtraCapacity($this, n) {
    if (shouldCompact($this, n)) {
      rehash($this, _get_hashSize__tftcho($this));
    } else {
      ensureCapacity($this, $this.r2_1 + n | 0);
    }
  }
  function shouldCompact($this, extraCapacity) {
    var spareCapacity = _get_capacity__a9k9f3($this) - $this.r2_1 | 0;
    var gaps = $this.r2_1 - $this.g() | 0;
    return (spareCapacity < extraCapacity ? (gaps + spareCapacity | 0) >= extraCapacity : false) ? gaps >= (_get_capacity__a9k9f3($this) / 4 | 0) : false;
  }
  function ensureCapacity($this, minCapacity) {
    if (minCapacity < 0)
      throw RuntimeException_init_$Create$_0('too many elements');
    if (minCapacity > _get_capacity__a9k9f3($this)) {
      var newSize = Companion_instance_3.w2(_get_capacity__a9k9f3($this), minCapacity);
      $this.m2_1 = copyOfUninitializedElements($this.m2_1, newSize);
      var tmp = $this;
      var tmp0_safe_receiver = $this.n2_1;
      tmp.n2_1 = tmp0_safe_receiver == null ? null : copyOfUninitializedElements(tmp0_safe_receiver, newSize);
      $this.o2_1 = copyOf($this.o2_1, newSize);
      var newHashSize = computeHashSize(Companion_instance_0, newSize);
      if (newHashSize > _get_hashSize__tftcho($this)) {
        rehash($this, newHashSize);
      }
    }
  }
  function allocateValuesArray($this) {
    var curValuesArray = $this.n2_1;
    if (!(curValuesArray == null))
      return curValuesArray;
    var newValuesArray = arrayOfUninitializedElements(_get_capacity__a9k9f3($this));
    $this.n2_1 = newValuesArray;
    return newValuesArray;
  }
  function hash($this, key) {
    return key == null ? 0 : imul(hashCode(key), -1640531527) >>> $this.s2_1 | 0;
  }
  function compact($this) {
    var i = 0;
    var j = 0;
    var valuesArray = $this.n2_1;
    while (i < $this.r2_1) {
      if ($this.o2_1[i] >= 0) {
        $this.m2_1[j] = $this.m2_1[i];
        if (!(valuesArray == null)) {
          valuesArray[j] = valuesArray[i];
        }
        j = j + 1 | 0;
      }
      i = i + 1 | 0;
    }
    resetRange($this.m2_1, j, $this.r2_1);
    if (valuesArray == null)
      ;
    else {
      resetRange(valuesArray, j, $this.r2_1);
    }
    $this.r2_1 = j;
  }
  function rehash($this, newHashSize) {
    registerModification($this);
    if ($this.r2_1 > $this.u2_1) {
      compact($this);
    }
    if (!(newHashSize === _get_hashSize__tftcho($this))) {
      $this.p2_1 = new Int32Array(newHashSize);
      $this.s2_1 = computeShift(Companion_instance_0, newHashSize);
    } else {
      fill($this.p2_1, 0, 0, _get_hashSize__tftcho($this));
    }
    var i = 0;
    while (i < $this.r2_1) {
      var tmp0 = i;
      i = tmp0 + 1 | 0;
      if (!putRehash($this, tmp0)) {
        throw IllegalStateException_init_$Create$_0('This cannot happen with fixed magic multiplier and grow-only hash array. Have object hashCodes changed?');
      }
    }
  }
  function putRehash($this, i) {
    var hash_0 = hash($this, $this.m2_1[i]);
    var probesLeft = $this.q2_1;
    while (true) {
      var index = $this.p2_1[hash_0];
      if (index === 0) {
        $this.p2_1[hash_0] = i + 1 | 0;
        $this.o2_1[i] = hash_0;
        return true;
      }
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return false;
      var tmp0 = hash_0;
      hash_0 = tmp0 - 1 | 0;
      if (tmp0 === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function findKey($this, key) {
    var hash_0 = hash($this, key);
    var probesLeft = $this.q2_1;
    while (true) {
      var index = $this.p2_1[hash_0];
      if (index === 0)
        return -1;
      if (index > 0 ? equals($this.m2_1[index - 1 | 0], key) : false)
        return index - 1 | 0;
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return -1;
      var tmp0 = hash_0;
      hash_0 = tmp0 - 1 | 0;
      if (tmp0 === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function findValue($this, value) {
    var i = $this.r2_1;
    $l$loop: while (true) {
      i = i - 1 | 0;
      if (!(i >= 0)) {
        break $l$loop;
      }
      if ($this.o2_1[i] >= 0 ? equals(ensureNotNull($this.n2_1)[i], value) : false)
        return i;
    }
    return -1;
  }
  function addKey($this, key) {
    $this.r1();
    retry: while (true) {
      var hash_0 = hash($this, key);
      var tentativeMaxProbeDistance = coerceAtMost(imul($this.q2_1, 2), _get_hashSize__tftcho($this) / 2 | 0);
      var probeDistance = 0;
      while (true) {
        var index = $this.p2_1[hash_0];
        if (index <= 0) {
          if ($this.r2_1 >= _get_capacity__a9k9f3($this)) {
            ensureExtraCapacity($this, 1);
            continue retry;
          }
          var tmp1 = $this.r2_1;
          $this.r2_1 = tmp1 + 1 | 0;
          var putIndex = tmp1;
          $this.m2_1[putIndex] = key;
          $this.o2_1[putIndex] = hash_0;
          $this.p2_1[hash_0] = putIndex + 1 | 0;
          $this.u2_1 = $this.u2_1 + 1 | 0;
          registerModification($this);
          if (probeDistance > $this.q2_1)
            $this.q2_1 = probeDistance;
          return putIndex;
        }
        if (equals($this.m2_1[index - 1 | 0], key)) {
          return -index | 0;
        }
        probeDistance = probeDistance + 1 | 0;
        if (probeDistance > tentativeMaxProbeDistance) {
          rehash($this, imul(_get_hashSize__tftcho($this), 2));
          continue retry;
        }
        var tmp4 = hash_0;
        hash_0 = tmp4 - 1 | 0;
        if (tmp4 === 0)
          hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
      }
    }
  }
  function contentEquals($this, other) {
    return $this.u2_1 === other.g() ? $this.i2(other.j1()) : false;
  }
  function Companion_0() {
    this.x2_1 = -1640531527;
    this.y2_1 = 8;
    this.z2_1 = 2;
    this.a3_1 = -1;
  }
  var Companion_instance_0;
  function Itr(map) {
    this.b3_1 = map;
    this.c3_1 = 0;
    this.d3_1 = -1;
    this.e3_1 = this.b3_1.t2_1;
    this.f3();
  }
  protoOf(Itr).f3 = function () {
    while (this.c3_1 < this.b3_1.r2_1 ? this.b3_1.o2_1[this.c3_1] < 0 : false) {
      this.c3_1 = this.c3_1 + 1 | 0;
    }
  };
  protoOf(Itr).o = function () {
    return this.c3_1 < this.b3_1.r2_1;
  };
  protoOf(Itr).g3 = function () {
    if (!(this.b3_1.t2_1 === this.e3_1))
      throw ConcurrentModificationException_init_$Create$();
  };
  function ValuesItr(map) {
    Itr.call(this, map);
  }
  protoOf(ValuesItr).p = function () {
    this.g3();
    if (this.c3_1 >= this.b3_1.r2_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.c3_1;
    this.c3_1 = tmp1 + 1 | 0;
    tmp.d3_1 = tmp1;
    var result = ensureNotNull(this.b3_1.n2_1)[this.d3_1];
    this.f3();
    return result;
  };
  function EntriesItr(map) {
    Itr.call(this, map);
  }
  protoOf(EntriesItr).p = function () {
    this.g3();
    if (this.c3_1 >= this.b3_1.r2_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.c3_1;
    this.c3_1 = tmp1 + 1 | 0;
    tmp.d3_1 = tmp1;
    var result = new EntryRef(this.b3_1, this.d3_1);
    this.f3();
    return result;
  };
  protoOf(EntriesItr).p3 = function () {
    if (this.c3_1 >= this.b3_1.r2_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.c3_1;
    this.c3_1 = tmp1 + 1 | 0;
    tmp.d3_1 = tmp1;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.b3_1.m2_1[this.d3_1];
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp_0 = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = ensureNotNull(this.b3_1.n2_1)[this.d3_1];
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    var result = tmp_0 ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
    this.f3();
    return result;
  };
  protoOf(EntriesItr).q3 = function (sb) {
    if (this.c3_1 >= this.b3_1.r2_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.c3_1;
    this.c3_1 = tmp1 + 1 | 0;
    tmp.d3_1 = tmp1;
    var key = this.b3_1.m2_1[this.d3_1];
    if (equals(key, this.b3_1)) {
      sb.t3('(this Map)');
    } else {
      sb.s3(key);
    }
    sb.u3(_Char___init__impl__6a9atx(61));
    var value = ensureNotNull(this.b3_1.n2_1)[this.d3_1];
    if (equals(value, this.b3_1)) {
      sb.t3('(this Map)');
    } else {
      sb.s3(value);
    }
    this.f3();
  };
  function EntryRef(map, index) {
    this.v3_1 = map;
    this.w3_1 = index;
  }
  protoOf(EntryRef).x3 = function () {
    return this.v3_1.m2_1[this.w3_1];
  };
  protoOf(EntryRef).k2 = function () {
    return ensureNotNull(this.v3_1.n2_1)[this.w3_1];
  };
  protoOf(EntryRef).equals = function (other) {
    var tmp;
    var tmp_0;
    if (!(other == null) ? isInterface(other, Entry) : false) {
      tmp_0 = equals(other.x3(), this.x3());
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = equals(other.k2(), this.k2());
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EntryRef).hashCode = function () {
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.x3();
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = this.k2();
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    return tmp ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
  };
  protoOf(EntryRef).toString = function () {
    return '' + this.x3() + '=' + this.k2();
  };
  function InternalHashMap(keysArray, valuesArray, presenceArray, hashArray, maxProbeDistance, length) {
    this.m2_1 = keysArray;
    this.n2_1 = valuesArray;
    this.o2_1 = presenceArray;
    this.p2_1 = hashArray;
    this.q2_1 = maxProbeDistance;
    this.r2_1 = length;
    this.s2_1 = computeShift(Companion_instance_0, _get_hashSize__tftcho(this));
    this.t2_1 = 0;
    this.u2_1 = 0;
    this.v2_1 = false;
  }
  protoOf(InternalHashMap).g = function () {
    return this.u2_1;
  };
  protoOf(InternalHashMap).g1 = function (value) {
    return findValue(this, value) >= 0;
  };
  protoOf(InternalHashMap).i1 = function (key) {
    var index = findKey(this, key);
    if (index < 0)
      return null;
    return ensureNotNull(this.n2_1)[index];
  };
  protoOf(InternalHashMap).z1 = function (key) {
    return findKey(this, key) >= 0;
  };
  protoOf(InternalHashMap).c1 = function (key, value) {
    var index = addKey(this, key);
    var valuesArray = allocateValuesArray(this);
    if (index < 0) {
      var oldValue = valuesArray[(-index | 0) - 1 | 0];
      valuesArray[(-index | 0) - 1 | 0] = value;
      return oldValue;
    } else {
      valuesArray[index] = value;
      return null;
    }
  };
  protoOf(InternalHashMap).equals = function (other) {
    var tmp;
    if (other === this) {
      tmp = true;
    } else {
      var tmp_0;
      if (!(other == null) ? isInterface(other, Map_0) : false) {
        tmp_0 = contentEquals(this, other);
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  protoOf(InternalHashMap).hashCode = function () {
    var result = 0;
    var it = this.f2();
    while (it.o()) {
      result = result + it.p3() | 0;
    }
    return result;
  };
  protoOf(InternalHashMap).toString = function () {
    var sb = StringBuilder_init_$Create$(2 + imul(this.u2_1, 3) | 0);
    sb.t3('{');
    var i = 0;
    var it = this.f2();
    while (it.o()) {
      if (i > 0) {
        sb.t3(', ');
      }
      it.q3(sb);
      i = i + 1 | 0;
    }
    sb.t3('}');
    return sb.toString();
  };
  protoOf(InternalHashMap).r1 = function () {
    if (this.v2_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(InternalHashMap).h2 = function (entry) {
    var index = findKey(this, entry.x3());
    if (index < 0)
      return false;
    return equals(ensureNotNull(this.n2_1)[index], entry.k2());
  };
  protoOf(InternalHashMap).y3 = function (entry) {
    return this.h2(isInterface(entry, Entry) ? entry : THROW_CCE());
  };
  protoOf(InternalHashMap).c2 = function () {
    return new ValuesItr(this);
  };
  protoOf(InternalHashMap).f2 = function () {
    return new EntriesItr(this);
  };
  function InternalMap() {
  }
  function LinkedHashMap_init_$Init$($this) {
    HashMap_init_$Init$_0($this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$() {
    return LinkedHashMap_init_$Init$(objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_0(initialCapacity, $this) {
    HashMap_init_$Init$_2(initialCapacity, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_0(initialCapacity) {
    return LinkedHashMap_init_$Init$_0(initialCapacity, objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap() {
  }
  function defaultPlatformRandom() {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp$ret$0 = Math.random() * Math.pow(2, 32) | 0;
    return Random_0(tmp$ret$0);
  }
  function StringBuilder_init_$Init$(capacity, $this) {
    StringBuilder_init_$Init$_0($this);
    return $this;
  }
  function StringBuilder_init_$Create$(capacity) {
    return StringBuilder_init_$Init$(capacity, objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder_init_$Init$_0($this) {
    StringBuilder.call($this, '');
    return $this;
  }
  function StringBuilder_init_$Create$_0() {
    return StringBuilder_init_$Init$_0(objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder(content) {
    this.r3_1 = !(content === undefined) ? content : '';
  }
  protoOf(StringBuilder).u3 = function (value) {
    this.r3_1 = this.r3_1 + toString(value);
    return this;
  };
  protoOf(StringBuilder).z3 = function (value) {
    this.r3_1 = this.r3_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).s3 = function (value) {
    this.r3_1 = this.r3_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).t3 = function (value) {
    var tmp = this;
    var tmp_0 = this.r3_1;
    tmp.r3_1 = tmp_0 + (value == null ? 'null' : value);
    return this;
  };
  protoOf(StringBuilder).toString = function () {
    return this.r3_1;
  };
  function toMutableList(_this__u8e3s4) {
    return ArrayList_init_$Create$_1(asCollection(_this__u8e3s4));
  }
  function contains(_this__u8e3s4, element) {
    return indexOf(_this__u8e3s4, element) >= 0;
  }
  function indexOf(_this__u8e3s4, element) {
    if (element == null) {
      var inductionVariable = 0;
      var last = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable <= last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (_this__u8e3s4[index] == null) {
            return index;
          }
        }
         while (inductionVariable <= last);
    } else {
      var inductionVariable_0 = 0;
      var last_0 = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable_0 <= last_0)
        do {
          var index_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          if (equals(element, _this__u8e3s4[index_0])) {
            return index_0;
          }
        }
         while (inductionVariable_0 <= last_0);
    }
    return -1;
  }
  function joinToString(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function joinTo(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.z3(prefix);
    var count = 0;
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    $l$loop: while (inductionVariable < last) {
      var element = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      count = count + 1 | 0;
      if (count > 1) {
        buffer.z3(separator);
      }
      if (limit < 0 ? true : count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 ? count > limit : false) {
      buffer.z3(truncated);
    }
    buffer.z3(postfix);
    return buffer;
  }
  function joinToString_0(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo_0(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function joinTo_0(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.z3(prefix);
    var count = 0;
    var tmp0_iterator = _this__u8e3s4.h();
    $l$loop: while (tmp0_iterator.o()) {
      var element = tmp0_iterator.p();
      count = count + 1 | 0;
      if (count > 1) {
        buffer.z3(separator);
      }
      if (limit < 0 ? true : count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 ? count > limit : false) {
      buffer.z3(truncated);
    }
    buffer.z3(postfix);
    return buffer;
  }
  function coerceAtLeast(_this__u8e3s4, minimumValue) {
    return _this__u8e3s4 < minimumValue ? minimumValue : _this__u8e3s4;
  }
  function coerceAtMost(_this__u8e3s4, maximumValue) {
    return _this__u8e3s4 > maximumValue ? maximumValue : _this__u8e3s4;
  }
  function get_PI() {
    return PI;
  }
  var PI;
  function _Char___init__impl__6a9atx(value) {
    return value;
  }
  function _get_value__a43j40($this) {
    return $this;
  }
  function toString($this) {
    // Inline function 'kotlin.js.unsafeCast' call
    return String.fromCharCode(_get_value__a43j40($this));
  }
  function Char() {
  }
  function List() {
  }
  function Collection() {
  }
  function Set() {
  }
  function Entry() {
  }
  function Map_0() {
  }
  function Companion_1() {
  }
  function Enum(name, ordinal) {
    this.a4_1 = name;
    this.b4_1 = ordinal;
  }
  protoOf(Enum).c4 = function () {
    return this.a4_1;
  };
  protoOf(Enum).d4 = function () {
    return this.b4_1;
  };
  protoOf(Enum).e4 = function (other) {
    return compareTo(this.b4_1, other.b4_1);
  };
  protoOf(Enum).f4 = function (other) {
    return this.e4(other instanceof Enum ? other : THROW_CCE());
  };
  protoOf(Enum).equals = function (other) {
    return this === other;
  };
  protoOf(Enum).hashCode = function () {
    return identityHashCode(this);
  };
  protoOf(Enum).toString = function () {
    return this.a4_1;
  };
  function toString_0(_this__u8e3s4) {
    var tmp1_elvis_lhs = _this__u8e3s4 == null ? null : toString_1(_this__u8e3s4);
    return tmp1_elvis_lhs == null ? 'null' : tmp1_elvis_lhs;
  }
  function implement(interfaces) {
    var maxSize = 1;
    var masks = [];
    var inductionVariable = 0;
    var last = interfaces.length;
    while (inductionVariable < last) {
      var i = interfaces[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var currentSize = maxSize;
      var tmp1_elvis_lhs = i.prototype.$imask$;
      var imask = tmp1_elvis_lhs == null ? i.$imask$ : tmp1_elvis_lhs;
      if (!(imask == null)) {
        masks.push(imask);
        currentSize = imask.length;
      }
      var iid = i.$metadata$.iid;
      var tmp;
      if (iid == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.let' call
        // Inline function 'kotlin.contracts.contract' call
        // Inline function 'kotlin.js.implement.<anonymous>' call
        tmp = bitMaskWith(iid);
      }
      var iidImask = tmp;
      if (!(iidImask == null)) {
        masks.push(iidImask);
        currentSize = Math.max(currentSize, iidImask.length);
      }
      if (currentSize > maxSize) {
        maxSize = currentSize;
      }
    }
    return compositeBitMask(maxSize, masks);
  }
  function bitMaskWith(activeBit) {
    var numberIndex = activeBit >> 5;
    var intArray = new Int32Array(numberIndex + 1 | 0);
    var positionInNumber = activeBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    intArray[numberIndex] = intArray[numberIndex] | numberWithSettledBit;
    return intArray;
  }
  function compositeBitMask(capacity, masks) {
    var tmp = 0;
    var tmp_0 = new Int32Array(capacity);
    while (tmp < capacity) {
      var tmp_1 = tmp;
      var result = 0;
      var inductionVariable = 0;
      var last = masks.length;
      while (inductionVariable < last) {
        var mask = masks[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (tmp_1 < mask.length) {
          result = result | mask[tmp_1];
        }
      }
      tmp_0[tmp_1] = result;
      tmp = tmp + 1 | 0;
    }
    return tmp_0;
  }
  function isBitSet(_this__u8e3s4, possibleActiveBit) {
    var numberIndex = possibleActiveBit >> 5;
    if (numberIndex > _this__u8e3s4.length)
      return false;
    var positionInNumber = possibleActiveBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    return !((_this__u8e3s4[numberIndex] & numberWithSettledBit) === 0);
  }
  function fillArrayVal(array, initValue) {
    var inductionVariable = 0;
    var last = array.length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        array[i] = initValue;
      }
       while (!(i === last));
    return array;
  }
  function arrayIterator(array) {
    return new arrayIterator$1(array);
  }
  function arrayIterator$1($array) {
    this.h4_1 = $array;
    this.g4_1 = 0;
  }
  protoOf(arrayIterator$1).o = function () {
    return !(this.g4_1 === this.h4_1.length);
  };
  protoOf(arrayIterator$1).p = function () {
    var tmp;
    if (!(this.g4_1 === this.h4_1.length)) {
      var tmp1 = this.g4_1;
      this.g4_1 = tmp1 + 1 | 0;
      tmp = this.h4_1[tmp1];
    } else {
      throw NoSuchElementException_init_$Create$_0('' + this.g4_1);
    }
    return tmp;
  };
  function get_buf() {
    _init_properties_bitUtils_kt__nfcg4k();
    return buf;
  }
  var buf;
  function get_bufFloat64() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufFloat64;
  }
  var bufFloat64;
  function get_bufInt32() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufInt32;
  }
  var bufInt32;
  function get_lowIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return lowIndex;
  }
  var lowIndex;
  function get_highIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return highIndex;
  }
  var highIndex;
  function getNumberHashCode(obj) {
    _init_properties_bitUtils_kt__nfcg4k();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.jsBitwiseOr' call
    // Inline function 'kotlin.js.asDynamic' call
    if ((obj | 0) === obj) {
      return numberToInt(obj);
    }
    get_bufFloat64()[0] = obj;
    return imul(get_bufInt32()[get_highIndex()], 31) + get_bufInt32()[get_lowIndex()] | 0;
  }
  var properties_initialized_bitUtils_kt_i2bo3e;
  function _init_properties_bitUtils_kt__nfcg4k() {
    if (!properties_initialized_bitUtils_kt_i2bo3e) {
      properties_initialized_bitUtils_kt_i2bo3e = true;
      buf = new ArrayBuffer(8);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufFloat64 = new Float64Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      new Float32Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufInt32 = new Int32Array(get_buf());
      // Inline function 'kotlin.run' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.js.lowIndex.<anonymous>' call
      get_bufFloat64()[0] = -1.0;
      lowIndex = !(get_bufInt32()[0] === 0) ? 1 : 0;
      highIndex = 1 - get_lowIndex() | 0;
    }
  }
  function arrayToString(array) {
    return joinToString(array, ', ', '[', ']', VOID, VOID, arrayToString$lambda);
  }
  function arrayToString$lambda(it) {
    return toString_1(it);
  }
  function compareTo(a, b) {
    var tmp;
    switch (typeof a) {
      case 'number':
        var tmp_0;
        if (typeof b === 'number') {
          tmp_0 = doubleCompareTo(a, b);
        } else {
          if (b instanceof Long) {
            tmp_0 = doubleCompareTo(a, b.k4());
          } else {
            tmp_0 = primitiveCompareTo(a, b);
          }
        }

        tmp = tmp_0;
        break;
      case 'string':
      case 'boolean':
        tmp = primitiveCompareTo(a, b);
        break;
      default:
        tmp = compareToDoNotIntrinsicify(a, b);
        break;
    }
    return tmp;
  }
  function doubleCompareTo(a, b) {
    var tmp;
    if (a < b) {
      tmp = -1;
    } else if (a > b) {
      tmp = 1;
    } else if (a === b) {
      var tmp_0;
      if (a !== 0) {
        tmp_0 = 0;
      } else {
        // Inline function 'kotlin.js.asDynamic' call
        var ia = 1 / a;
        var tmp_1;
        // Inline function 'kotlin.js.asDynamic' call
        if (ia === 1 / b) {
          tmp_1 = 0;
        } else {
          if (ia < 0) {
            tmp_1 = -1;
          } else {
            tmp_1 = 1;
          }
        }
        tmp_0 = tmp_1;
      }
      tmp = tmp_0;
    } else if (a !== a) {
      tmp = b !== b ? 0 : 1;
    } else {
      tmp = -1;
    }
    return tmp;
  }
  function primitiveCompareTo(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function compareToDoNotIntrinsicify(a, b) {
    return a.f4(b);
  }
  function identityHashCode(obj) {
    return getObjectHashCode(obj);
  }
  function getObjectHashCode(obj) {
    // Inline function 'kotlin.js.jsIn' call
    if (!('kotlinHashCodeValue$' in obj)) {
      var hash = calculateRandomHash();
      var descriptor = new Object();
      descriptor.value = hash;
      descriptor.enumerable = false;
      Object.defineProperty(obj, 'kotlinHashCodeValue$', descriptor);
    }
    // Inline function 'kotlin.js.unsafeCast' call
    return obj['kotlinHashCodeValue$'];
  }
  function calculateRandomHash() {
    // Inline function 'kotlin.js.jsBitwiseOr' call
    return Math.random() * 4.294967296E9 | 0;
  }
  function toString_1(o) {
    var tmp;
    if (o == null) {
      tmp = 'null';
    } else if (isArrayish(o)) {
      tmp = '[...]';
    } else if (!(typeof o.toString === 'function')) {
      tmp = anyToString(o);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = o.toString();
    }
    return tmp;
  }
  function equals(obj1, obj2) {
    if (obj1 == null) {
      return obj2 == null;
    }
    if (obj2 == null) {
      return false;
    }
    if (typeof obj1 === 'object' ? typeof obj1.equals === 'function' : false) {
      return obj1.equals(obj2);
    }
    if (obj1 !== obj1) {
      return obj2 !== obj2;
    }
    if (typeof obj1 === 'number' ? typeof obj2 === 'number' : false) {
      var tmp;
      if (obj1 === obj2) {
        var tmp_0;
        if (obj1 !== 0) {
          tmp_0 = true;
        } else {
          // Inline function 'kotlin.js.asDynamic' call
          var tmp_1 = 1 / obj1;
          // Inline function 'kotlin.js.asDynamic' call
          tmp_0 = tmp_1 === 1 / obj2;
        }
        tmp = tmp_0;
      } else {
        tmp = false;
      }
      return tmp;
    }
    return obj1 === obj2;
  }
  function hashCode(obj) {
    if (obj == null)
      return 0;
    var typeOf = typeof obj;
    var tmp;
    switch (typeOf) {
      case 'object':
        tmp = 'function' === typeof obj.hashCode ? obj.hashCode() : getObjectHashCode(obj);
        break;
      case 'function':
        tmp = getObjectHashCode(obj);
        break;
      case 'number':
        tmp = getNumberHashCode(obj);
        break;
      case 'boolean':
        // Inline function 'kotlin.js.unsafeCast' call

        tmp = getBooleanHashCode(obj);
        break;
      case 'string':
        tmp = getStringHashCode(String(obj));
        break;
      case 'bigint':
        tmp = getBigIntHashCode(obj);
        break;
      case 'symbol':
        tmp = getSymbolHashCode(obj);
        break;
      default:
        tmp = function () {
          throw new Error('Unexpected typeof `' + typeOf + '`');
        }();
        break;
    }
    return tmp;
  }
  function anyToString(o) {
    return Object.prototype.toString.call(o);
  }
  function getBooleanHashCode(value) {
    return value ? 1231 : 1237;
  }
  function getStringHashCode(str) {
    var hash = 0;
    var length = str.length;
    var inductionVariable = 0;
    var last = length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.js.asDynamic' call
        var code = str.charCodeAt(i);
        hash = imul(hash, 31) + code | 0;
      }
       while (!(i === last));
    return hash;
  }
  function getBigIntHashCode(value) {
    var shiftNumber = BigInt(32);
    var MASK = BigInt(4.294967295E9);
    var bigNumber = value < 0 ? -value : value;
    var hashCode = 0;
    var signum = value < 0 ? -1 : 1;
    while (bigNumber != 0) {
      // Inline function 'kotlin.js.unsafeCast' call
      var chunk = Number(bigNumber & MASK);
      hashCode = imul(31, hashCode) + chunk | 0;
      bigNumber = bigNumber >> shiftNumber;
    }
    return imul(hashCode, signum);
  }
  function getSymbolHashCode(value) {
    var hashCodeMap = symbolIsSharable(value) ? getSymbolMap() : getSymbolWeakMap();
    var cachedHashCode = hashCodeMap.get(value);
    if (cachedHashCode !== VOID)
      return cachedHashCode;
    var hash = calculateRandomHash();
    hashCodeMap.set(value, hash);
    return hash;
  }
  function symbolIsSharable(symbol) {
    return Symbol.keyFor(symbol) != VOID;
  }
  function getSymbolMap() {
    if (symbolMap === VOID) {
      symbolMap = new Map();
    }
    return symbolMap;
  }
  function getSymbolWeakMap() {
    if (symbolWeakMap === VOID) {
      symbolWeakMap = new WeakMap();
    }
    return symbolWeakMap;
  }
  var symbolMap;
  var symbolWeakMap;
  function captureStack(instance, constructorFunction) {
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(instance, constructorFunction);
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      instance.stack = (new Error()).stack;
    }
  }
  function protoOf(constructor) {
    return constructor.prototype;
  }
  function defineProp(obj, name, getter, setter) {
    return Object.defineProperty(obj, name, {configurable: true, get: getter, set: setter});
  }
  function objectCreate(proto) {
    return Object.create(proto);
  }
  function extendThrowable(this_, message, cause) {
    Error.call(this_);
    setPropertiesToThrowableInstance(this_, message, cause);
  }
  function setPropertiesToThrowableInstance(this_, message, cause) {
    var errorInfo = calculateErrorInfo(Object.getPrototypeOf(this_));
    if ((errorInfo & 1) === 0) {
      var tmp;
      if (message == null) {
        var tmp_0;
        if (!(message === null)) {
          var tmp1_elvis_lhs = cause == null ? null : cause.toString();
          tmp_0 = tmp1_elvis_lhs == null ? VOID : tmp1_elvis_lhs;
        } else {
          tmp_0 = VOID;
        }
        tmp = tmp_0;
      } else {
        tmp = message;
      }
      this_.message = tmp;
    }
    if ((errorInfo & 2) === 0) {
      this_.cause = cause;
    }
    this_.name = Object.getPrototypeOf(this_).constructor.name;
  }
  function ensureNotNull(v) {
    var tmp;
    if (v == null) {
      THROW_NPE();
    } else {
      tmp = v;
    }
    return tmp;
  }
  function THROW_NPE() {
    throw NullPointerException_init_$Create$();
  }
  function THROW_CCE() {
    throw ClassCastException_init_$Create$();
  }
  function THROW_IAE(msg) {
    throw IllegalArgumentException_init_$Create$_0(msg);
  }
  function fillFrom(src, dst) {
    var srcLen = src.length;
    var dstLen = dst.length;
    var index = 0;
    // Inline function 'kotlin.js.unsafeCast' call
    var arr = dst;
    while (index < srcLen ? index < dstLen : false) {
      var tmp = index;
      var tmp0 = index;
      index = tmp0 + 1 | 0;
      arr[tmp] = src[tmp0];
    }
    return dst;
  }
  function arrayCopyResize(source, newSize, defaultValue) {
    // Inline function 'kotlin.js.unsafeCast' call
    var result = source.slice(0, newSize);
    // Inline function 'kotlin.copyArrayType' call
    if (source.$type$ !== undefined) {
      result.$type$ = source.$type$;
    }
    var index = source.length;
    if (newSize > index) {
      // Inline function 'kotlin.js.asDynamic' call
      result.length = newSize;
      while (index < newSize) {
        var tmp0 = index;
        index = tmp0 + 1 | 0;
        result[tmp0] = defaultValue;
      }
    }
    return result;
  }
  function Companion_2() {
    Companion_instance_2 = this;
    this.l4_1 = new Long(0, -2147483648);
    this.m4_1 = new Long(-1, 2147483647);
    this.n4_1 = 8;
    this.o4_1 = 64;
  }
  var Companion_instance_2;
  function Companion_getInstance_2() {
    if (Companion_instance_2 == null)
      new Companion_2();
    return Companion_instance_2;
  }
  function Long(low, high) {
    Companion_getInstance_2();
    Number_0.call(this);
    this.i4_1 = low;
    this.j4_1 = high;
  }
  protoOf(Long).p4 = function (other) {
    return compare(this, other);
  };
  protoOf(Long).f4 = function (other) {
    return this.p4(other instanceof Long ? other : THROW_CCE());
  };
  protoOf(Long).q4 = function (other) {
    return add(this, other);
  };
  protoOf(Long).r4 = function (other) {
    return divide(this, other);
  };
  protoOf(Long).s4 = function () {
    return this.t4().q4(new Long(1, 0));
  };
  protoOf(Long).t4 = function () {
    return new Long(~this.i4_1, ~this.j4_1);
  };
  protoOf(Long).u4 = function () {
    return this.i4_1;
  };
  protoOf(Long).k4 = function () {
    return toNumber(this);
  };
  protoOf(Long).valueOf = function () {
    return this.k4();
  };
  protoOf(Long).equals = function (other) {
    var tmp;
    if (other instanceof Long) {
      tmp = equalsLong(this, other);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(Long).hashCode = function () {
    return hashCode_0(this);
  };
  protoOf(Long).toString = function () {
    return toStringImpl(this, 10);
  };
  function get_ZERO() {
    _init_properties_longjs_kt__tqrzid();
    return ZERO;
  }
  var ZERO;
  function get_ONE() {
    _init_properties_longjs_kt__tqrzid();
    return ONE;
  }
  var ONE;
  function get_NEG_ONE() {
    _init_properties_longjs_kt__tqrzid();
    return NEG_ONE;
  }
  var NEG_ONE;
  function get_MAX_VALUE() {
    _init_properties_longjs_kt__tqrzid();
    return MAX_VALUE;
  }
  var MAX_VALUE;
  function get_MIN_VALUE() {
    _init_properties_longjs_kt__tqrzid();
    return MIN_VALUE;
  }
  var MIN_VALUE;
  function get_TWO_PWR_24_() {
    _init_properties_longjs_kt__tqrzid();
    return TWO_PWR_24_;
  }
  var TWO_PWR_24_;
  function compare(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    if (equalsLong(_this__u8e3s4, other)) {
      return 0;
    }
    var thisNeg = isNegative(_this__u8e3s4);
    var otherNeg = isNegative(other);
    return (thisNeg ? !otherNeg : false) ? -1 : (!thisNeg ? otherNeg : false) ? 1 : isNegative(subtract(_this__u8e3s4, other)) ? -1 : 1;
  }
  function add(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    var a48 = _this__u8e3s4.j4_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.j4_1 & 65535;
    var a16 = _this__u8e3s4.i4_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.i4_1 & 65535;
    var b48 = other.j4_1 >>> 16 | 0;
    var b32 = other.j4_1 & 65535;
    var b16 = other.i4_1 >>> 16 | 0;
    var b00 = other.i4_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + (a00 + b00 | 0) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + (a16 + b16 | 0) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + (a32 + b32 | 0) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (a48 + b48 | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function subtract(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    return add(_this__u8e3s4, other.s4());
  }
  function multiply(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    } else if (isZero(other)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      return isOdd(other) ? get_MIN_VALUE() : get_ZERO();
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return isOdd(_this__u8e3s4) ? get_MIN_VALUE() : get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = multiply(negate(_this__u8e3s4), negate(other));
      } else {
        tmp = negate(multiply(negate(_this__u8e3s4), other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(multiply(_this__u8e3s4, negate(other)));
    }
    if (lessThan(_this__u8e3s4, get_TWO_PWR_24_()) ? lessThan(other, get_TWO_PWR_24_()) : false) {
      return fromNumber(toNumber(_this__u8e3s4) * toNumber(other));
    }
    var a48 = _this__u8e3s4.j4_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.j4_1 & 65535;
    var a16 = _this__u8e3s4.i4_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.i4_1 & 65535;
    var b48 = other.j4_1 >>> 16 | 0;
    var b32 = other.j4_1 & 65535;
    var b16 = other.i4_1 >>> 16 | 0;
    var b00 = other.i4_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + imul(a00, b00) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + imul(a16, b00) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c16 = c16 + imul(a00, b16) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + imul(a32, b00) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a16, b16) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a00, b32) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (((imul(a48, b00) + imul(a32, b16) | 0) + imul(a16, b32) | 0) + imul(a00, b48) | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function divide(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    if (isZero(other)) {
      throw Exception_init_$Create$_0('division by zero');
    } else if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      if (equalsLong(other, get_ONE()) ? true : equalsLong(other, get_NEG_ONE())) {
        return get_MIN_VALUE();
      } else if (equalsLong(other, get_MIN_VALUE())) {
        return get_ONE();
      } else {
        var halfThis = shiftRight(_this__u8e3s4, 1);
        var approx = shiftLeft(halfThis.r4(other), 1);
        if (equalsLong(approx, get_ZERO())) {
          return isNegative(other) ? get_ONE() : get_NEG_ONE();
        } else {
          var rem = subtract(_this__u8e3s4, multiply(other, approx));
          return add(approx, rem.r4(other));
        }
      }
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = negate(_this__u8e3s4).r4(negate(other));
      } else {
        tmp = negate(negate(_this__u8e3s4).r4(other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(_this__u8e3s4.r4(negate(other)));
    }
    var res = get_ZERO();
    var rem_0 = _this__u8e3s4;
    while (greaterThanOrEqual(rem_0, other)) {
      var approxDouble = toNumber(rem_0) / toNumber(other);
      var approx2 = Math.max(1.0, Math.floor(approxDouble));
      var log2 = Math.ceil(Math.log(approx2) / Math.LN2);
      var delta = log2 <= 48.0 ? 1.0 : Math.pow(2.0, log2 - 48);
      var approxRes = fromNumber(approx2);
      var approxRem = multiply(approxRes, other);
      while (isNegative(approxRem) ? true : greaterThan(approxRem, rem_0)) {
        approx2 = approx2 - delta;
        approxRes = fromNumber(approx2);
        approxRem = multiply(approxRes, other);
      }
      if (isZero(approxRes)) {
        approxRes = get_ONE();
      }
      res = add(res, approxRes);
      rem_0 = subtract(rem_0, approxRem);
    }
    return res;
  }
  function shiftLeft(_this__u8e3s4, numBits) {
    _init_properties_longjs_kt__tqrzid();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.i4_1 << numBits_0, _this__u8e3s4.j4_1 << numBits_0 | (_this__u8e3s4.i4_1 >>> (32 - numBits_0 | 0) | 0));
      } else {
        return new Long(0, _this__u8e3s4.i4_1 << (numBits_0 - 32 | 0));
      }
    }
  }
  function shiftRight(_this__u8e3s4, numBits) {
    _init_properties_longjs_kt__tqrzid();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.i4_1 >>> numBits_0 | 0 | _this__u8e3s4.j4_1 << (32 - numBits_0 | 0), _this__u8e3s4.j4_1 >> numBits_0);
      } else {
        return new Long(_this__u8e3s4.j4_1 >> (numBits_0 - 32 | 0), _this__u8e3s4.j4_1 >= 0 ? 0 : -1);
      }
    }
  }
  function toNumber(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.j4_1 * 4.294967296E9 + getLowBitsUnsigned(_this__u8e3s4);
  }
  function equalsLong(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.j4_1 === other.j4_1 ? _this__u8e3s4.i4_1 === other.i4_1 : false;
  }
  function hashCode_0(l) {
    _init_properties_longjs_kt__tqrzid();
    return l.i4_1 ^ l.j4_1;
  }
  function toStringImpl(_this__u8e3s4, radix) {
    _init_properties_longjs_kt__tqrzid();
    if (radix < 2 ? true : 36 < radix) {
      throw Exception_init_$Create$_0('radix out of range: ' + radix);
    }
    if (isZero(_this__u8e3s4)) {
      return '0';
    }
    if (isNegative(_this__u8e3s4)) {
      if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
        var radixLong = fromInt(radix);
        var div = _this__u8e3s4.r4(radixLong);
        var rem = subtract(multiply(div, radixLong), _this__u8e3s4).u4();
        var tmp = toStringImpl(div, radix);
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        return tmp + rem.toString(radix);
      } else {
        return '-' + toStringImpl(negate(_this__u8e3s4), radix);
      }
    }
    var digitsPerTime = radix === 2 ? 31 : radix <= 10 ? 9 : radix <= 21 ? 7 : radix <= 35 ? 6 : 5;
    var radixToPower = fromNumber(Math.pow(radix, digitsPerTime));
    var rem_0 = _this__u8e3s4;
    var result = '';
    while (true) {
      var remDiv = rem_0.r4(radixToPower);
      var intval = subtract(rem_0, multiply(remDiv, radixToPower)).u4();
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var digits = intval.toString(radix);
      rem_0 = remDiv;
      if (isZero(rem_0)) {
        return digits + result;
      } else {
        while (digits.length < digitsPerTime) {
          digits = '0' + digits;
        }
        result = digits + result;
      }
    }
  }
  function fromInt(value) {
    _init_properties_longjs_kt__tqrzid();
    return new Long(value, value < 0 ? -1 : 0);
  }
  function isNegative(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.j4_1 < 0;
  }
  function isZero(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.j4_1 === 0 ? _this__u8e3s4.i4_1 === 0 : false;
  }
  function isOdd(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return (_this__u8e3s4.i4_1 & 1) === 1;
  }
  function negate(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.s4();
  }
  function lessThan(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    return compare(_this__u8e3s4, other) < 0;
  }
  function fromNumber(value) {
    _init_properties_longjs_kt__tqrzid();
    if (isNaN_0(value)) {
      return get_ZERO();
    } else if (value <= -9.223372036854776E18) {
      return get_MIN_VALUE();
    } else if (value + 1 >= 9.223372036854776E18) {
      return get_MAX_VALUE();
    } else if (value < 0.0) {
      return negate(fromNumber(-value));
    } else {
      var twoPwr32 = 4.294967296E9;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp = value % twoPwr32 | 0;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp$ret$1 = value / twoPwr32 | 0;
      return new Long(tmp, tmp$ret$1);
    }
  }
  function greaterThan(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    return compare(_this__u8e3s4, other) > 0;
  }
  function greaterThanOrEqual(_this__u8e3s4, other) {
    _init_properties_longjs_kt__tqrzid();
    return compare(_this__u8e3s4, other) >= 0;
  }
  function getLowBitsUnsigned(_this__u8e3s4) {
    _init_properties_longjs_kt__tqrzid();
    return _this__u8e3s4.i4_1 >= 0 ? _this__u8e3s4.i4_1 : 4.294967296E9 + _this__u8e3s4.i4_1;
  }
  var properties_initialized_longjs_kt_5aju7t;
  function _init_properties_longjs_kt__tqrzid() {
    if (!properties_initialized_longjs_kt_5aju7t) {
      properties_initialized_longjs_kt_5aju7t = true;
      ZERO = fromInt(0);
      ONE = fromInt(1);
      NEG_ONE = fromInt(-1);
      MAX_VALUE = new Long(-1, 2147483647);
      MIN_VALUE = new Long(0, -2147483648);
      TWO_PWR_24_ = fromInt(16777216);
    }
  }
  function classMeta(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    return createMetadata('class', name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity, null);
  }
  function createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity, iid) {
    var undef = VOID;
    return {kind: kind, simpleName: name, associatedObjectKey: associatedObjectKey, associatedObjects: associatedObjects, suspendArity: suspendArity, $kClass$: undef, defaultConstructor: defaultConstructor, iid: iid};
  }
  function setMetadataFor(ctor, name, metadataConstructor, parent, interfaces, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    if (!(parent == null)) {
      ctor.prototype = Object.create(parent.prototype);
      ctor.prototype.constructor = ctor;
    }
    var metadata = metadataConstructor(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity == null ? [] : suspendArity);
    ctor.$metadata$ = metadata;
    if (!(interfaces == null)) {
      var receiver = !(metadata.iid == null) ? ctor : ctor.prototype;
      receiver.$imask$ = implement(interfaces);
    }
  }
  function interfaceMeta(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    return createMetadata('interface', name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity, generateInterfaceId());
  }
  function generateInterfaceId() {
    if (iid === VOID) {
      iid = 0;
    }
    // Inline function 'kotlin.js.unsafeCast' call
    iid = iid + 1 | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    return iid;
  }
  var iid;
  function objectMeta(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    return createMetadata('object', name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity, null);
  }
  function arrayConcat(args) {
    var len = args.length;
    // Inline function 'kotlin.js.unsafeCast' call
    var typed = Array(len);
    var inductionVariable = 0;
    var last = len - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var arr = args[i];
        if (!(!(arr == null) ? isArray(arr) : false)) {
          typed[i] = [].slice.call(arr);
        } else {
          typed[i] = arr;
        }
      }
       while (!(i === last));
    return [].concat.apply([], typed);
  }
  function numberToInt(a) {
    var tmp;
    if (a instanceof Long) {
      tmp = a.u4();
    } else {
      tmp = doubleToInt(a);
    }
    return tmp;
  }
  function doubleToInt(a) {
    var tmp;
    if (a > 2.147483647E9) {
      tmp = 2147483647;
    } else if (a < -2.147483648E9) {
      tmp = -2147483648;
    } else {
      // Inline function 'kotlin.js.jsBitwiseOr' call
      tmp = a | 0;
    }
    return tmp;
  }
  function isArrayish(o) {
    return isJsArray(o) ? true : isView(o);
  }
  function isJsArray(obj) {
    // Inline function 'kotlin.js.unsafeCast' call
    return Array.isArray(obj);
  }
  function isInterface(obj, iface) {
    return isInterfaceImpl(obj, iface.$metadata$.iid);
  }
  function isInterfaceImpl(obj, iface) {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp0_elvis_lhs = obj.$imask$;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var mask = tmp;
    return isBitSet(mask, iface);
  }
  function isArray(obj) {
    var tmp;
    if (isJsArray(obj)) {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = !obj.$type$;
    } else {
      tmp = false;
    }
    return tmp;
  }
  function isCharSequence(value) {
    return typeof value === 'string' ? true : isInterface(value, CharSequence);
  }
  function calculateErrorInfo(proto) {
    var tmp0_safe_receiver = proto.constructor;
    var metadata = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.$metadata$;
    var tmp2_safe_receiver = metadata == null ? null : metadata.errorInfo;
    if (tmp2_safe_receiver == null)
      ;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      return tmp2_safe_receiver;
    }
    var result = 0;
    if (hasProp(proto, 'message'))
      result = result | 1;
    if (hasProp(proto, 'cause'))
      result = result | 2;
    if (!(result === 3)) {
      var parentProto = getPrototypeOf(proto);
      if (parentProto != Error.prototype) {
        result = result | calculateErrorInfo(parentProto);
      }
    }
    if (!(metadata == null)) {
      metadata.errorInfo = result;
    }
    return result;
  }
  function hasProp(proto, propName) {
    return proto.hasOwnProperty(propName);
  }
  function getPrototypeOf(obj) {
    return Object.getPrototypeOf(obj);
  }
  var VOID;
  function fill(_this__u8e3s4, element, fromIndex, toIndex) {
    fromIndex = fromIndex === VOID ? 0 : fromIndex;
    toIndex = toIndex === VOID ? _this__u8e3s4.length : toIndex;
    Companion_instance_3.f(fromIndex, toIndex, _this__u8e3s4.length);
    // Inline function 'kotlin.js.nativeFill' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.fill(element, fromIndex, toIndex);
  }
  function asList(_this__u8e3s4) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return new ArrayList(_this__u8e3s4);
  }
  function copyOf(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(newSize >= 0)) {
      // Inline function 'kotlin.collections.copyOf.<anonymous>' call
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return fillFrom(_this__u8e3s4, new Int32Array(newSize));
  }
  function copyOf_0(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(newSize >= 0)) {
      // Inline function 'kotlin.collections.copyOf.<anonymous>' call
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return arrayCopyResize(_this__u8e3s4, newSize, null);
  }
  function Exception_init_$Init$($this) {
    extendThrowable($this);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$() {
    var tmp = Exception_init_$Init$(objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$);
    return tmp;
  }
  function Exception_init_$Init$_0(message, $this) {
    extendThrowable($this, message);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$_0(message) {
    var tmp = Exception_init_$Init$_0(message, objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$_0);
    return tmp;
  }
  function Exception() {
    captureStack(this, Exception);
  }
  function IllegalArgumentException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$() {
    var tmp = IllegalArgumentException_init_$Init$(objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$);
    return tmp;
  }
  function IllegalArgumentException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$_0(message) {
    var tmp = IllegalArgumentException_init_$Init$_0(message, objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$_0);
    return tmp;
  }
  function IllegalArgumentException() {
    captureStack(this, IllegalArgumentException);
  }
  function IndexOutOfBoundsException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$() {
    var tmp = IndexOutOfBoundsException_init_$Init$(objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$);
    return tmp;
  }
  function IndexOutOfBoundsException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$_0(message) {
    var tmp = IndexOutOfBoundsException_init_$Init$_0(message, objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$_0);
    return tmp;
  }
  function IndexOutOfBoundsException() {
    captureStack(this, IndexOutOfBoundsException);
  }
  function IllegalStateException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$() {
    var tmp = IllegalStateException_init_$Init$(objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$);
    return tmp;
  }
  function IllegalStateException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$_0(message) {
    var tmp = IllegalStateException_init_$Init$_0(message, objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$_0);
    return tmp;
  }
  function IllegalStateException() {
    captureStack(this, IllegalStateException);
  }
  function UnsupportedOperationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    UnsupportedOperationException.call($this);
    return $this;
  }
  function UnsupportedOperationException_init_$Create$() {
    var tmp = UnsupportedOperationException_init_$Init$(objectCreate(protoOf(UnsupportedOperationException)));
    captureStack(tmp, UnsupportedOperationException_init_$Create$);
    return tmp;
  }
  function UnsupportedOperationException() {
    captureStack(this, UnsupportedOperationException);
  }
  function RuntimeException_init_$Init$($this) {
    Exception_init_$Init$($this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$() {
    var tmp = RuntimeException_init_$Init$(objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$);
    return tmp;
  }
  function RuntimeException_init_$Init$_0(message, $this) {
    Exception_init_$Init$_0(message, $this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$_0(message) {
    var tmp = RuntimeException_init_$Init$_0(message, objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$_0);
    return tmp;
  }
  function RuntimeException() {
    captureStack(this, RuntimeException);
  }
  function NoSuchElementException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$() {
    var tmp = NoSuchElementException_init_$Init$(objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$);
    return tmp;
  }
  function NoSuchElementException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$_0(message) {
    var tmp = NoSuchElementException_init_$Init$_0(message, objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$_0);
    return tmp;
  }
  function NoSuchElementException() {
    captureStack(this, NoSuchElementException);
  }
  function ConcurrentModificationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ConcurrentModificationException.call($this);
    return $this;
  }
  function ConcurrentModificationException_init_$Create$() {
    var tmp = ConcurrentModificationException_init_$Init$(objectCreate(protoOf(ConcurrentModificationException)));
    captureStack(tmp, ConcurrentModificationException_init_$Create$);
    return tmp;
  }
  function ConcurrentModificationException() {
    captureStack(this, ConcurrentModificationException);
  }
  function NullPointerException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NullPointerException.call($this);
    return $this;
  }
  function NullPointerException_init_$Create$() {
    var tmp = NullPointerException_init_$Init$(objectCreate(protoOf(NullPointerException)));
    captureStack(tmp, NullPointerException_init_$Create$);
    return tmp;
  }
  function NullPointerException() {
    captureStack(this, NullPointerException);
  }
  function ClassCastException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ClassCastException.call($this);
    return $this;
  }
  function ClassCastException_init_$Create$() {
    var tmp = ClassCastException_init_$Init$(objectCreate(protoOf(ClassCastException)));
    captureStack(tmp, ClassCastException_init_$Create$);
    return tmp;
  }
  function ClassCastException() {
    captureStack(this, ClassCastException);
  }
  function AbstractCollection$toString$lambda(this$0) {
    return function (it) {
      return it === this$0 ? '(this Collection)' : toString_0(it);
    };
  }
  function AbstractCollection() {
  }
  protoOf(AbstractCollection).i = function (element) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.any' call
      var tmp;
      if (isInterface(this, Collection)) {
        tmp = this.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = false;
        break $l$block_0;
      }
      var tmp0_iterator = this.h();
      while (tmp0_iterator.o()) {
        var element_0 = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractCollection.contains.<anonymous>' call
        if (equals(element_0, element)) {
          tmp$ret$0 = true;
          break $l$block_0;
        }
      }
      tmp$ret$0 = false;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).j = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = elements.h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractCollection.containsAll.<anonymous>' call
        if (!this.i(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).k = function () {
    return this.g() === 0;
  };
  protoOf(AbstractCollection).toString = function () {
    return joinToString_0(this, ', ', '[', ']', VOID, VOID, AbstractCollection$toString$lambda(this));
  };
  protoOf(AbstractCollection).toArray = function () {
    return collectionToArray(this);
  };
  function Companion_3() {
    this.e_1 = 2147483639;
  }
  protoOf(Companion_3).q1 = function (index, size) {
    if (index < 0 ? true : index >= size) {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
    }
  };
  protoOf(Companion_3).f = function (fromIndex, toIndex, size) {
    if (fromIndex < 0 ? true : toIndex > size) {
      throw IndexOutOfBoundsException_init_$Create$_0('fromIndex: ' + fromIndex + ', toIndex: ' + toIndex + ', size: ' + size);
    }
    if (fromIndex > toIndex) {
      throw IllegalArgumentException_init_$Create$_0('fromIndex: ' + fromIndex + ' > toIndex: ' + toIndex);
    }
  };
  protoOf(Companion_3).w2 = function (oldCapacity, minCapacity) {
    var newCapacity = oldCapacity + (oldCapacity >> 1) | 0;
    if ((newCapacity - minCapacity | 0) < 0)
      newCapacity = minCapacity;
    if ((newCapacity - 2147483639 | 0) > 0)
      newCapacity = minCapacity > 2147483639 ? IntCompanionObject_instance.MAX_VALUE : 2147483639;
    return newCapacity;
  };
  protoOf(Companion_3).v = function (c) {
    var hashCode_0 = 1;
    var tmp0_iterator = c.h();
    while (tmp0_iterator.o()) {
      var e = tmp0_iterator.p();
      var tmp = imul(31, hashCode_0);
      var tmp2_elvis_lhs = e == null ? null : hashCode(e);
      hashCode_0 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_3).u = function (c, other) {
    if (!(c.g() === other.g()))
      return false;
    var otherIterator = other.h();
    var tmp0_iterator = c.h();
    while (tmp0_iterator.o()) {
      var elem = tmp0_iterator.p();
      var elemOther = otherIterator.p();
      if (!equals(elem, elemOther)) {
        return false;
      }
    }
    return true;
  };
  var Companion_instance_3;
  function toString_2($this, o) {
    return o === $this ? '(this Map)' : toString_0(o);
  }
  function implFindEntry($this, key) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = $this.j1().h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractMap.implFindEntry.<anonymous>' call
        if (equals(element.x3(), key)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    return tmp$ret$1;
  }
  function Companion_4() {
  }
  function AbstractMap$toString$lambda(this$0) {
    return function (it) {
      return this$0.x4(it);
    };
  }
  function AbstractMap() {
    this.d1_1 = null;
    this.e1_1 = null;
  }
  protoOf(AbstractMap).f1 = function (key) {
    return !(implFindEntry(this, key) == null);
  };
  protoOf(AbstractMap).g1 = function (value) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.any' call
      var this_0 = this.j1();
      var tmp;
      if (isInterface(this_0, Collection)) {
        tmp = this_0.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = false;
        break $l$block_0;
      }
      var tmp0_iterator = this_0.h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractMap.containsValue.<anonymous>' call
        if (equals(element.k2(), value)) {
          tmp$ret$0 = true;
          break $l$block_0;
        }
      }
      tmp$ret$0 = false;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractMap).h1 = function (entry) {
    if (!(!(entry == null) ? isInterface(entry, Entry) : false))
      return false;
    var key = entry.x3();
    var value = entry.k2();
    // Inline function 'kotlin.collections.get' call
    var ourValue = (isInterface(this, Map_0) ? this : THROW_CCE()).i1(key);
    if (!equals(value, ourValue)) {
      return false;
    }
    var tmp;
    if (ourValue == null) {
      // Inline function 'kotlin.collections.containsKey' call
      tmp = !(isInterface(this, Map_0) ? this : THROW_CCE()).f1(key);
    } else {
      tmp = false;
    }
    if (tmp) {
      return false;
    }
    return true;
  };
  protoOf(AbstractMap).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, Map_0) : false))
      return false;
    if (!(this.g() === other.g()))
      return false;
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var this_0 = other.j1();
      var tmp;
      if (isInterface(this_0, Collection)) {
        tmp = this_0.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = this_0.h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.AbstractMap.equals.<anonymous>' call
        if (!this.h1(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractMap).i1 = function (key) {
    var tmp0_safe_receiver = implFindEntry(this, key);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.k2();
  };
  protoOf(AbstractMap).hashCode = function () {
    return hashCode(this.j1());
  };
  protoOf(AbstractMap).k = function () {
    return this.g() === 0;
  };
  protoOf(AbstractMap).g = function () {
    return this.j1().g();
  };
  protoOf(AbstractMap).toString = function () {
    var tmp = this.j1();
    return joinToString_0(tmp, ', ', '{', '}', VOID, VOID, AbstractMap$toString$lambda(this));
  };
  protoOf(AbstractMap).x4 = function (entry) {
    return toString_2(this, entry.x3()) + '=' + toString_2(this, entry.k2());
  };
  function Companion_5() {
  }
  protoOf(Companion_5).l1 = function (c) {
    var hashCode_0 = 0;
    var tmp0_iterator = c.h();
    while (tmp0_iterator.o()) {
      var element = tmp0_iterator.p();
      var tmp = hashCode_0;
      var tmp2_elvis_lhs = element == null ? null : hashCode(element);
      hashCode_0 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_5).k1 = function (c, other) {
    if (!(c.g() === other.g()))
      return false;
    // Inline function 'kotlin.collections.containsAll' call
    return c.j(other);
  };
  var Companion_instance_5;
  function collectionToArrayCommonImpl(collection) {
    if (collection.k()) {
      // Inline function 'kotlin.emptyArray' call
      return [];
    }
    // Inline function 'kotlin.arrayOfNulls' call
    var size = collection.g();
    var destination = fillArrayVal(Array(size), null);
    var iterator = collection.h();
    var index = 0;
    while (iterator.o()) {
      var tmp0 = index;
      index = tmp0 + 1 | 0;
      destination[tmp0] = iterator.p();
    }
    return destination;
  }
  function emptyList() {
    return EmptyList_getInstance();
  }
  function listOf_0(elements) {
    return elements.length > 0 ? asList(elements) : emptyList();
  }
  function mutableListOf(elements) {
    return elements.length === 0 ? ArrayList_init_$Create$() : ArrayList_init_$Create$_1(new ArrayAsCollection(elements, true));
  }
  function EmptyList() {
    EmptyList_instance = this;
    this.y4_1 = new Long(-1478467534, -1720727600);
  }
  protoOf(EmptyList).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, List) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyList).hashCode = function () {
    return 1;
  };
  protoOf(EmptyList).toString = function () {
    return '[]';
  };
  protoOf(EmptyList).g = function () {
    return 0;
  };
  protoOf(EmptyList).k = function () {
    return true;
  };
  protoOf(EmptyList).z4 = function (elements) {
    return elements.k();
  };
  protoOf(EmptyList).j = function (elements) {
    return this.z4(elements);
  };
  protoOf(EmptyList).q = function (index) {
    throw IndexOutOfBoundsException_init_$Create$_0("Empty list doesn't contain element at index " + index + '.');
  };
  protoOf(EmptyList).h = function () {
    return EmptyIterator_instance;
  };
  var EmptyList_instance;
  function EmptyList_getInstance() {
    if (EmptyList_instance == null)
      new EmptyList();
    return EmptyList_instance;
  }
  function ArrayAsCollection(values, isVarargs) {
    this.a5_1 = values;
    this.b5_1 = isVarargs;
  }
  protoOf(ArrayAsCollection).g = function () {
    return this.a5_1.length;
  };
  protoOf(ArrayAsCollection).k = function () {
    // Inline function 'kotlin.collections.isEmpty' call
    return this.a5_1.length === 0;
  };
  protoOf(ArrayAsCollection).c5 = function (element) {
    return contains(this.a5_1, element);
  };
  protoOf(ArrayAsCollection).d5 = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.k();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = elements.h();
      while (tmp0_iterator.o()) {
        var element = tmp0_iterator.p();
        // Inline function 'kotlin.collections.ArrayAsCollection.containsAll.<anonymous>' call
        if (!this.c5(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(ArrayAsCollection).j = function (elements) {
    return this.d5(elements);
  };
  protoOf(ArrayAsCollection).h = function () {
    return arrayIterator(this.a5_1);
  };
  function EmptyIterator() {
  }
  protoOf(EmptyIterator).o = function () {
    return false;
  };
  protoOf(EmptyIterator).p = function () {
    throw NoSuchElementException_init_$Create$();
  };
  var EmptyIterator_instance;
  function arrayListOf(elements) {
    return elements.length === 0 ? ArrayList_init_$Create$() : ArrayList_init_$Create$_1(new ArrayAsCollection(elements, true));
  }
  function asCollection(_this__u8e3s4) {
    return new ArrayAsCollection(_this__u8e3s4, false);
  }
  function mapOf(pairs) {
    return pairs.length > 0 ? toMap(pairs, LinkedHashMap_init_$Create$_0(mapCapacity(pairs.length))) : emptyMap();
  }
  function emptyMap() {
    var tmp = EmptyMap_getInstance();
    return isInterface(tmp, Map_0) ? tmp : THROW_CCE();
  }
  function toMap(_this__u8e3s4, destination) {
    // Inline function 'kotlin.apply' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.toMap.<anonymous>' call
    putAll(destination, _this__u8e3s4);
    return destination;
  }
  function EmptyMap() {
    EmptyMap_instance = this;
    this.e5_1 = new Long(-888910638, 1920087921);
  }
  protoOf(EmptyMap).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, Map_0) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyMap).hashCode = function () {
    return 0;
  };
  protoOf(EmptyMap).toString = function () {
    return '{}';
  };
  protoOf(EmptyMap).g = function () {
    return 0;
  };
  protoOf(EmptyMap).k = function () {
    return true;
  };
  protoOf(EmptyMap).f5 = function (key) {
    return false;
  };
  protoOf(EmptyMap).f1 = function (key) {
    if (!(key == null ? true : !(key == null)))
      return false;
    return this.f5((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).g5 = function (key) {
    return null;
  };
  protoOf(EmptyMap).i1 = function (key) {
    if (!(key == null ? true : !(key == null)))
      return null;
    return this.g5((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).j1 = function () {
    return EmptySet_getInstance();
  };
  var EmptyMap_instance;
  function EmptyMap_getInstance() {
    if (EmptyMap_instance == null)
      new EmptyMap();
    return EmptyMap_instance;
  }
  function putAll(_this__u8e3s4, pairs) {
    var inductionVariable = 0;
    var last = pairs.length;
    while (inductionVariable < last) {
      var tmp1_loop_parameter = pairs[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var key = tmp1_loop_parameter.j5();
      var value = tmp1_loop_parameter.k5();
      _this__u8e3s4.c1(key, value);
    }
  }
  function EmptySet() {
    EmptySet_instance = this;
    this.l5_1 = new Long(1993859828, 793161749);
  }
  protoOf(EmptySet).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, Set) : false) {
      tmp = other.k();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptySet).hashCode = function () {
    return 0;
  };
  protoOf(EmptySet).toString = function () {
    return '[]';
  };
  protoOf(EmptySet).g = function () {
    return 0;
  };
  protoOf(EmptySet).k = function () {
    return true;
  };
  protoOf(EmptySet).z4 = function (elements) {
    return elements.k();
  };
  protoOf(EmptySet).j = function (elements) {
    return this.z4(elements);
  };
  protoOf(EmptySet).h = function () {
    return EmptyIterator_instance;
  };
  var EmptySet_instance;
  function EmptySet_getInstance() {
    if (EmptySet_instance == null)
      new EmptySet();
    return EmptySet_instance;
  }
  function Default() {
    Default_instance = this;
    Random.call(this);
    this.m5_1 = defaultPlatformRandom();
  }
  protoOf(Default).n5 = function (bitCount) {
    return this.m5_1.n5(bitCount);
  };
  protoOf(Default).o5 = function () {
    return this.m5_1.o5();
  };
  var Default_instance;
  function Default_getInstance() {
    if (Default_instance == null)
      new Default();
    return Default_instance;
  }
  function Random() {
    Default_getInstance();
  }
  protoOf(Random).o5 = function () {
    return this.n5(24) / 1.6777216E7;
  };
  function Random_0(seed) {
    return XorWowRandom_init_$Create$(seed, seed >> 31);
  }
  function takeUpperBits(_this__u8e3s4, bitCount) {
    return (_this__u8e3s4 >>> (32 - bitCount | 0) | 0) & (-bitCount | 0) >> 31;
  }
  function XorWowRandom_init_$Init$(seed1, seed2, $this) {
    XorWowRandom.call($this, seed1, seed2, 0, 0, ~seed1, seed1 << 10 ^ (seed2 >>> 4 | 0));
    return $this;
  }
  function XorWowRandom_init_$Create$(seed1, seed2) {
    return XorWowRandom_init_$Init$(seed1, seed2, objectCreate(protoOf(XorWowRandom)));
  }
  function Companion_6() {
    Companion_instance_6 = this;
    this.p5_1 = new Long(0, 0);
  }
  var Companion_instance_6;
  function Companion_getInstance_6() {
    if (Companion_instance_6 == null)
      new Companion_6();
    return Companion_instance_6;
  }
  function XorWowRandom(x, y, z, w, v, addend) {
    Companion_getInstance_6();
    Random.call(this);
    this.q5_1 = x;
    this.r5_1 = y;
    this.s5_1 = z;
    this.t5_1 = w;
    this.u5_1 = v;
    this.v5_1 = addend;
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!((this.q5_1 | this.r5_1 | this.s5_1 | this.t5_1 | this.u5_1) === 0)) {
      // Inline function 'kotlin.random.XorWowRandom.<anonymous>' call
      var message = 'Initial state must have at least one non-zero element.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.repeat' call
    // Inline function 'kotlin.contracts.contract' call
    var inductionVariable = 0;
    if (inductionVariable < 64)
      do {
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.random.XorWowRandom.<anonymous>' call
        this.w5();
      }
       while (inductionVariable < 64);
  }
  protoOf(XorWowRandom).w5 = function () {
    var t = this.q5_1;
    t = t ^ (t >>> 2 | 0);
    this.q5_1 = this.r5_1;
    this.r5_1 = this.s5_1;
    this.s5_1 = this.t5_1;
    var v0 = this.u5_1;
    this.t5_1 = v0;
    t = t ^ t << 1 ^ v0 ^ v0 << 4;
    this.u5_1 = t;
    this.v5_1 = this.v5_1 + 362437 | 0;
    return t + this.v5_1 | 0;
  };
  protoOf(XorWowRandom).n5 = function (bitCount) {
    return takeUpperBits(this.w5(), bitCount);
  };
  function appendElement(_this__u8e3s4, element, transform) {
    if (!(transform == null)) {
      _this__u8e3s4.z3(transform(element));
    } else {
      if (element == null ? true : isCharSequence(element)) {
        _this__u8e3s4.z3(element);
      } else {
        if (element instanceof Char) {
          _this__u8e3s4.u3(element.x5_1);
        } else {
          _this__u8e3s4.z3(toString_0(element));
        }
      }
    }
  }
  function Pair(first, second) {
    this.h5_1 = first;
    this.i5_1 = second;
  }
  protoOf(Pair).toString = function () {
    return '(' + this.h5_1 + ', ' + this.i5_1 + ')';
  };
  protoOf(Pair).j5 = function () {
    return this.h5_1;
  };
  protoOf(Pair).k5 = function () {
    return this.i5_1;
  };
  protoOf(Pair).hashCode = function () {
    var result = this.h5_1 == null ? 0 : hashCode(this.h5_1);
    result = imul(result, 31) + (this.i5_1 == null ? 0 : hashCode(this.i5_1)) | 0;
    return result;
  };
  protoOf(Pair).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Pair))
      return false;
    var tmp0_other_with_cast = other instanceof Pair ? other : THROW_CCE();
    if (!equals(this.h5_1, tmp0_other_with_cast.h5_1))
      return false;
    if (!equals(this.i5_1, tmp0_other_with_cast.i5_1))
      return false;
    return true;
  };
  function to(_this__u8e3s4, that) {
    return new Pair(_this__u8e3s4, that);
  }
  //region block: post-declaration
  protoOf(InternalHashMap).i2 = containsAllEntries;
  //endregion
  //region block: init
  Unit_instance = new Unit();
  IntCompanionObject_instance = new IntCompanionObject();
  Companion_instance_0 = new Companion_0();
  PI = 3.141592653589793;
  Companion_instance_3 = new Companion_3();
  Companion_instance_5 = new Companion_5();
  EmptyIterator_instance = new EmptyIterator();
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = arrayConcat;
  _.$_$.b = VOID;
  _.$_$.c = ArrayList_init_$Create$;
  _.$_$.d = LinkedHashMap_init_$Create$;
  _.$_$.e = Exception_init_$Create$_0;
  _.$_$.f = IllegalArgumentException_init_$Create$_0;
  _.$_$.g = Default_getInstance;
  _.$_$.h = Unit_instance;
  _.$_$.i = List;
  _.$_$.j = arrayCopy;
  _.$_$.k = listOf;
  _.$_$.l = listOf_0;
  _.$_$.m = mapOf;
  _.$_$.n = mutableListOf;
  _.$_$.o = toMutableList;
  _.$_$.p = classMeta;
  _.$_$.q = defineProp;
  _.$_$.r = equals;
  _.$_$.s = fillArrayVal;
  _.$_$.t = getBooleanHashCode;
  _.$_$.u = getNumberHashCode;
  _.$_$.v = hashCode;
  _.$_$.w = isInterface;
  _.$_$.x = numberToInt;
  _.$_$.y = objectCreate;
  _.$_$.z = objectMeta;
  _.$_$.a1 = protoOf;
  _.$_$.b1 = setMetadataFor;
  _.$_$.c1 = toString_1;
  _.$_$.d1 = get_PI;
  _.$_$.e1 = Enum;
  _.$_$.f1 = THROW_CCE;
  _.$_$.g1 = THROW_IAE;
  _.$_$.h1 = ensureNotNull;
  _.$_$.i1 = to;
  //endregion
  return _;
}));


});

var KMPLibraryEngine = createCommonjsModule(function (module, exports) {
(function (root, factory) {
  factory(module.exports, kotlinKotlinStdlib);
}(commonjsGlobal, function (_, kotlin_kotlin) {
  //region block: imports
  var imul = Math.imul;
  var THROW_IAE = kotlin_kotlin.$_$.g1;
  var Unit_instance = kotlin_kotlin.$_$.h;
  var Enum = kotlin_kotlin.$_$.e1;
  var protoOf = kotlin_kotlin.$_$.a1;
  var defineProp = kotlin_kotlin.$_$.q;
  var classMeta = kotlin_kotlin.$_$.p;
  var setMetadataFor = kotlin_kotlin.$_$.b1;
  var VOID = kotlin_kotlin.$_$.b;
  var objectCreate = kotlin_kotlin.$_$.y;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
  var arrayCopy = kotlin_kotlin.$_$.j;
  var THROW_CCE = kotlin_kotlin.$_$.f1;
  var hashCode = kotlin_kotlin.$_$.v;
  var equals = kotlin_kotlin.$_$.r;
  var numberToInt = kotlin_kotlin.$_$.x;
  var Exception_init_$Create$ = kotlin_kotlin.$_$.e;
  var ensureNotNull = kotlin_kotlin.$_$.h1;
  var objectMeta = kotlin_kotlin.$_$.z;
  var get_PI = kotlin_kotlin.$_$.d1;
  var toMutableList = kotlin_kotlin.$_$.o;
  var Default_getInstance = kotlin_kotlin.$_$.g;
  var toString = kotlin_kotlin.$_$.c1;
  var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.f;
  var getNumberHashCode = kotlin_kotlin.$_$.u;
  var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.d;
  //endregion
  //region block: pre-declaration
  setMetadataFor(BackendMode, 'BackendMode', classMeta, Enum);
  setMetadataFor(BlendingEquation, 'BlendingEquation', classMeta, Enum);
  setMetadataFor(BlendingFactor, 'BlendingFactor', classMeta, Enum);
  setMetadataFor(Blending, 'Blending', classMeta, VOID, VOID, Blending);
  setMetadataFor(CullFace, 'CullFace', classMeta, Enum);
  setMetadataFor(DepthMode, 'DepthMode', classMeta, VOID, VOID, DepthMode);
  setMetadataFor(Mesh, 'Mesh', classMeta, VOID, VOID, MeshConstructor1);
  setMetadataFor(Scene, 'Scene', classMeta);
  setMetadataFor(Shader, 'Shader', classMeta, VOID, VOID, Shader);
  setMetadataFor(TextureFiltering, 'TextureFiltering', classMeta, Enum);
  setMetadataFor(TextureWrapping, 'TextureWrapping', classMeta, Enum);
  setMetadataFor(TextureFormat, 'TextureFormat', classMeta, Enum);
  setMetadataFor(TextureType, 'TextureType', classMeta, Enum);
  setMetadataFor(Texture, 'Texture', classMeta, VOID, VOID, Texture);
  setMetadataFor(UniformValue, 'UniformValue', classMeta, VOID, VOID, UniformValue);
  setMetadataFor(UniformFloatValue, 'UniformFloatValue', classMeta, UniformValue);
  setMetadataFor(UniformIntValue, 'UniformIntValue', classMeta, UniformValue);
  setMetadataFor(UniformTextureValue, 'UniformTextureValue', classMeta, UniformValue);
  setMetadataFor(VertexFormat, 'VertexFormat', classMeta, Enum);
  setMetadataFor(VertexAttribute, 'VertexAttribute', classMeta);
  setMetadataFor(VertexAttributesDescriptor, 'VertexAttributesDescriptor', classMeta);
  setMetadataFor(AttributeType, 'AttributeType', classMeta, Enum);
  setMetadataFor(MeshAttribute, 'MeshAttribute', classMeta);
  setMetadataFor(MeshAttributes, 'MeshAttributes', classMeta);
  setMetadataFor(TextureAnimationChunked, 'TextureAnimationChunked', classMeta);
  setMetadataFor(CameraPathAnimator, 'CameraPathAnimator', classMeta);
  setMetadataFor(CameraPosition, 'CameraPosition', classMeta);
  setMetadataFor(Companion, 'Companion', objectMeta);
  setMetadataFor(CameraPositionInterpolator, 'CameraPositionInterpolator', classMeta, VOID, VOID, CameraPositionInterpolator);
  setMetadataFor(CameraPositionPair, 'CameraPositionPair', classMeta);
  setMetadataFor(CameraState, 'CameraState', classMeta, Enum);
  setMetadataFor(Spline, 'Spline', classMeta);
  setMetadataFor(Spline3D, 'Spline3D', classMeta);
  setMetadataFor(BlurSize, 'BlurSize', classMeta, Enum);
  setMetadataFor(Command, 'Command', classMeta);
  setMetadataFor(GroupCommand, 'GroupCommand', classMeta, Command, VOID, GroupCommand);
  setMetadataFor(RenderPassCommand, 'RenderPassCommand', classMeta, GroupCommand, VOID, RenderPassCommandConstructor);
  setMetadataFor(BlurredPassCommand, 'BlurredPassCommand', classMeta, RenderPassCommand, VOID, BlurredPassCommand);
  setMetadataFor(DrawBlurredCommand, 'DrawBlurredCommand', classMeta, Command, VOID, DrawBlurredCommand);
  setMetadataFor(ClearColorCommand, 'ClearColorCommand', classMeta, Command, VOID, ClearColorCommand);
  setMetadataFor(ClearCommandClearType, 'ClearCommandClearType', classMeta, Enum);
  setMetadataFor(ClearCommand, 'ClearCommand', classMeta, Command, VOID, ClearCommand);
  setMetadataFor(CommandType, 'CommandType', classMeta, Enum);
  setMetadataFor(DrawMeshState, 'DrawMeshState', classMeta);
  setMetadataFor(PrimitiveType, 'PrimitiveType', classMeta, Enum);
  setMetadataFor(DrawMeshCommand, 'DrawMeshCommand', classMeta, Command);
  setMetadataFor(DrawTransformedMeshCommand, 'DrawTransformedMeshCommand', classMeta, DrawMeshCommand);
  setMetadataFor(DrawStaticMeshCommand, 'DrawStaticMeshCommand', classMeta, DrawTransformedMeshCommand);
  setMetadataFor(AffineTranformation, 'AffineTranformation', classMeta, VOID, VOID, AffineTranformation);
  setMetadataFor(Hint, 'Hint', classMeta);
  setMetadataFor(ShadingRate, 'ShadingRate', classMeta, Enum);
  setMetadataFor(VrsHint, 'VrsHint', classMeta, Hint);
  setMetadataFor(MainPassCommand, 'MainPassCommand', classMeta, RenderPassCommand, VOID, MainPassCommandConstructor);
  setMetadataFor(NoopCommand, 'NoopCommand', classMeta, Command, VOID, NoopCommand);
  setMetadataFor(VignetteCommand, 'VignetteCommand', classMeta, Command, VOID, VignetteCommand);
  setMetadataFor(ColorMode, 'ColorMode', classMeta, Enum);
  setMetadataFor(MathUtils, 'MathUtils', objectMeta);
  setMetadataFor(Matrix, 'Matrix', objectMeta);
  setMetadataFor(Vec2, 'Vec2', classMeta, VOID, VOID, Vec2);
  setMetadataFor(Vec3, 'Vec3', classMeta, VOID, VOID, Vec3);
  setMetadataFor(Vec4, 'Vec4', classMeta, VOID, VOID, Vec4);
  setMetadataFor(TimerParams, 'TimerParams', classMeta);
  setMetadataFor(TimersMap, 'TimersMap', classMeta, VOID, VOID, TimersMap);
  //endregion
  var BackendMode_OPENGL_instance;
  var BackendMode_METAL_instance;
  function values() {
    return [BackendMode_OPENGL_getInstance(), BackendMode_METAL_getInstance()];
  }
  function valueOf(value) {
    switch (value) {
      case 'OPENGL':
        return BackendMode_OPENGL_getInstance();
      case 'METAL':
        return BackendMode_METAL_getInstance();
      default:
        BackendMode_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var BackendMode_entriesInitialized;
  function BackendMode_initEntries() {
    if (BackendMode_entriesInitialized)
      return Unit_instance;
    BackendMode_entriesInitialized = true;
    BackendMode_OPENGL_instance = new BackendMode('OPENGL', 0);
    BackendMode_METAL_instance = new BackendMode('METAL', 1);
  }
  function BackendMode(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function BackendMode_OPENGL_getInstance() {
    BackendMode_initEntries();
    return BackendMode_OPENGL_instance;
  }
  function BackendMode_METAL_getInstance() {
    BackendMode_initEntries();
    return BackendMode_METAL_instance;
  }
  function get_BLENDING_NONE() {
    _init_properties_Blending_kt__efsar3();
    return BLENDING_NONE;
  }
  var BLENDING_NONE;
  var BlendingEquation_ADD_instance;
  var BlendingEquation_SUBTRACT_instance;
  var BlendingEquation_REVERSE_SUBTRACT_instance;
  function values_0() {
    return [BlendingEquation_ADD_getInstance(), BlendingEquation_SUBTRACT_getInstance(), BlendingEquation_REVERSE_SUBTRACT_getInstance()];
  }
  function valueOf_0(value) {
    switch (value) {
      case 'ADD':
        return BlendingEquation_ADD_getInstance();
      case 'SUBTRACT':
        return BlendingEquation_SUBTRACT_getInstance();
      case 'REVERSE_SUBTRACT':
        return BlendingEquation_REVERSE_SUBTRACT_getInstance();
      default:
        BlendingEquation_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var BlendingEquation_entriesInitialized;
  function BlendingEquation_initEntries() {
    if (BlendingEquation_entriesInitialized)
      return Unit_instance;
    BlendingEquation_entriesInitialized = true;
    BlendingEquation_ADD_instance = new BlendingEquation('ADD', 0);
    BlendingEquation_SUBTRACT_instance = new BlendingEquation('SUBTRACT', 1);
    BlendingEquation_REVERSE_SUBTRACT_instance = new BlendingEquation('REVERSE_SUBTRACT', 2);
  }
  function BlendingEquation(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  var BlendingFactor_ZERO_instance;
  var BlendingFactor_ONE_instance;
  var BlendingFactor_SRC_COLOR_instance;
  var BlendingFactor_ONE_MINUS_SRC_COLOR_instance;
  var BlendingFactor_DST_COLOR_instance;
  var BlendingFactor_ONE_MINUS_DST_COLOR_instance;
  var BlendingFactor_SRC_ALPHA_instance;
  var BlendingFactor_ONE_MINUS_SRC_ALPHA_instance;
  var BlendingFactor_DST_ALPHA_instance;
  var BlendingFactor_ONE_MINUS_DST_ALPHA_instance;
  var BlendingFactor_CONSTANT_COLOR_instance;
  var BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance;
  var BlendingFactor_CONSTANT_ALPHA_instance;
  var BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance;
  var BlendingFactor_SRC_ALPHA_SATURATE_instance;
  function values_1() {
    return [BlendingFactor_ZERO_getInstance(), BlendingFactor_ONE_getInstance(), BlendingFactor_SRC_COLOR_getInstance(), BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance(), BlendingFactor_DST_COLOR_getInstance(), BlendingFactor_ONE_MINUS_DST_COLOR_getInstance(), BlendingFactor_SRC_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance(), BlendingFactor_DST_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance(), BlendingFactor_CONSTANT_COLOR_getInstance(), BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance(), BlendingFactor_CONSTANT_ALPHA_getInstance(), BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance(), BlendingFactor_SRC_ALPHA_SATURATE_getInstance()];
  }
  function valueOf_1(value) {
    switch (value) {
      case 'ZERO':
        return BlendingFactor_ZERO_getInstance();
      case 'ONE':
        return BlendingFactor_ONE_getInstance();
      case 'SRC_COLOR':
        return BlendingFactor_SRC_COLOR_getInstance();
      case 'ONE_MINUS_SRC_COLOR':
        return BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance();
      case 'DST_COLOR':
        return BlendingFactor_DST_COLOR_getInstance();
      case 'ONE_MINUS_DST_COLOR':
        return BlendingFactor_ONE_MINUS_DST_COLOR_getInstance();
      case 'SRC_ALPHA':
        return BlendingFactor_SRC_ALPHA_getInstance();
      case 'ONE_MINUS_SRC_ALPHA':
        return BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance();
      case 'DST_ALPHA':
        return BlendingFactor_DST_ALPHA_getInstance();
      case 'ONE_MINUS_DST_ALPHA':
        return BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance();
      case 'CONSTANT_COLOR':
        return BlendingFactor_CONSTANT_COLOR_getInstance();
      case 'ONE_MINUS_CONSTANT_COLOR':
        return BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance();
      case 'CONSTANT_ALPHA':
        return BlendingFactor_CONSTANT_ALPHA_getInstance();
      case 'ONE_MINUS_CONSTANT_ALPHA':
        return BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance();
      case 'SRC_ALPHA_SATURATE':
        return BlendingFactor_SRC_ALPHA_SATURATE_getInstance();
      default:
        BlendingFactor_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var BlendingFactor_entriesInitialized;
  function BlendingFactor_initEntries() {
    if (BlendingFactor_entriesInitialized)
      return Unit_instance;
    BlendingFactor_entriesInitialized = true;
    BlendingFactor_ZERO_instance = new BlendingFactor('ZERO', 0);
    BlendingFactor_ONE_instance = new BlendingFactor('ONE', 1);
    BlendingFactor_SRC_COLOR_instance = new BlendingFactor('SRC_COLOR', 2);
    BlendingFactor_ONE_MINUS_SRC_COLOR_instance = new BlendingFactor('ONE_MINUS_SRC_COLOR', 3);
    BlendingFactor_DST_COLOR_instance = new BlendingFactor('DST_COLOR', 4);
    BlendingFactor_ONE_MINUS_DST_COLOR_instance = new BlendingFactor('ONE_MINUS_DST_COLOR', 5);
    BlendingFactor_SRC_ALPHA_instance = new BlendingFactor('SRC_ALPHA', 6);
    BlendingFactor_ONE_MINUS_SRC_ALPHA_instance = new BlendingFactor('ONE_MINUS_SRC_ALPHA', 7);
    BlendingFactor_DST_ALPHA_instance = new BlendingFactor('DST_ALPHA', 8);
    BlendingFactor_ONE_MINUS_DST_ALPHA_instance = new BlendingFactor('ONE_MINUS_DST_ALPHA', 9);
    BlendingFactor_CONSTANT_COLOR_instance = new BlendingFactor('CONSTANT_COLOR', 10);
    BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance = new BlendingFactor('ONE_MINUS_CONSTANT_COLOR', 11);
    BlendingFactor_CONSTANT_ALPHA_instance = new BlendingFactor('CONSTANT_ALPHA', 12);
    BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance = new BlendingFactor('ONE_MINUS_CONSTANT_ALPHA', 13);
    BlendingFactor_SRC_ALPHA_SATURATE_instance = new BlendingFactor('SRC_ALPHA_SATURATE', 14);
  }
  function BlendingFactor(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function Blending() {
    this.enabled = false;
    this.isSeparateAlpha = false;
    this.equationAlpha = BlendingEquation_ADD_getInstance();
    this.equationColor = BlendingEquation_ADD_getInstance();
    this.sourceFactorAlpha = BlendingFactor_ZERO_getInstance();
    this.destinationFactorAlpha = BlendingFactor_ZERO_getInstance();
    this.sourceFactorColor = BlendingFactor_ZERO_getInstance();
    this.destinationFactorColor = BlendingFactor_ZERO_getInstance();
  }
  protoOf(Blending).e6 = function (_set____db54di) {
    this.enabled = _set____db54di;
  };
  protoOf(Blending).f6 = function () {
    return this.enabled;
  };
  protoOf(Blending).g6 = function (_set____db54di) {
    this.isSeparateAlpha = _set____db54di;
  };
  protoOf(Blending).h6 = function () {
    return this.isSeparateAlpha;
  };
  protoOf(Blending).i6 = function (_set____db54di) {
    this.equationAlpha = _set____db54di;
  };
  protoOf(Blending).j6 = function () {
    return this.equationAlpha;
  };
  protoOf(Blending).k6 = function (_set____db54di) {
    this.equationColor = _set____db54di;
  };
  protoOf(Blending).l6 = function () {
    return this.equationColor;
  };
  protoOf(Blending).m6 = function (_set____db54di) {
    this.sourceFactorAlpha = _set____db54di;
  };
  protoOf(Blending).n6 = function () {
    return this.sourceFactorAlpha;
  };
  protoOf(Blending).o6 = function (_set____db54di) {
    this.destinationFactorAlpha = _set____db54di;
  };
  protoOf(Blending).p6 = function () {
    return this.destinationFactorAlpha;
  };
  protoOf(Blending).q6 = function (_set____db54di) {
    this.sourceFactorColor = _set____db54di;
  };
  protoOf(Blending).r6 = function () {
    return this.sourceFactorColor;
  };
  protoOf(Blending).s6 = function (_set____db54di) {
    this.destinationFactorColor = _set____db54di;
  };
  protoOf(Blending).t6 = function () {
    return this.destinationFactorColor;
  };
  function BlendingEquation_ADD_getInstance() {
    BlendingEquation_initEntries();
    return BlendingEquation_ADD_instance;
  }
  function BlendingEquation_SUBTRACT_getInstance() {
    BlendingEquation_initEntries();
    return BlendingEquation_SUBTRACT_instance;
  }
  function BlendingEquation_REVERSE_SUBTRACT_getInstance() {
    BlendingEquation_initEntries();
    return BlendingEquation_REVERSE_SUBTRACT_instance;
  }
  function BlendingFactor_ZERO_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ZERO_instance;
  }
  function BlendingFactor_ONE_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_instance;
  }
  function BlendingFactor_SRC_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_SRC_COLOR_instance;
  }
  function BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_SRC_COLOR_instance;
  }
  function BlendingFactor_DST_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_DST_COLOR_instance;
  }
  function BlendingFactor_ONE_MINUS_DST_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_DST_COLOR_instance;
  }
  function BlendingFactor_SRC_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_SRC_ALPHA_instance;
  }
  function BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_SRC_ALPHA_instance;
  }
  function BlendingFactor_DST_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_DST_ALPHA_instance;
  }
  function BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_DST_ALPHA_instance;
  }
  function BlendingFactor_CONSTANT_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_CONSTANT_COLOR_instance;
  }
  function BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_CONSTANT_COLOR_instance;
  }
  function BlendingFactor_CONSTANT_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_CONSTANT_ALPHA_instance;
  }
  function BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_instance;
  }
  function BlendingFactor_SRC_ALPHA_SATURATE_getInstance() {
    BlendingFactor_initEntries();
    return BlendingFactor_SRC_ALPHA_SATURATE_instance;
  }
  var properties_initialized_Blending_kt_oef843;
  function _init_properties_Blending_kt__efsar3() {
    if (!properties_initialized_Blending_kt_oef843) {
      properties_initialized_Blending_kt_oef843 = true;
      // Inline function 'kotlin.apply' call
      var this_0 = new Blending();
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'org.androidworks.engine.BLENDING_NONE.<anonymous>' call
      this_0.enabled = false;
      BLENDING_NONE = this_0;
    }
  }
  var CullFace_FRONT_instance;
  var CullFace_BACK_instance;
  var CullFace_FRONT_AND_BACK_instance;
  var CullFace_DISABLED_instance;
  function values_2() {
    return [CullFace_FRONT_getInstance(), CullFace_BACK_getInstance(), CullFace_FRONT_AND_BACK_getInstance(), CullFace_DISABLED_getInstance()];
  }
  function valueOf_2(value) {
    switch (value) {
      case 'FRONT':
        return CullFace_FRONT_getInstance();
      case 'BACK':
        return CullFace_BACK_getInstance();
      case 'FRONT_AND_BACK':
        return CullFace_FRONT_AND_BACK_getInstance();
      case 'DISABLED':
        return CullFace_DISABLED_getInstance();
      default:
        CullFace_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var CullFace_entriesInitialized;
  function CullFace_initEntries() {
    if (CullFace_entriesInitialized)
      return Unit_instance;
    CullFace_entriesInitialized = true;
    CullFace_FRONT_instance = new CullFace('FRONT', 0);
    CullFace_BACK_instance = new CullFace('BACK', 1);
    CullFace_FRONT_AND_BACK_instance = new CullFace('FRONT_AND_BACK', 2);
    CullFace_DISABLED_instance = new CullFace('DISABLED', 3);
  }
  function CullFace(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function CullFace_FRONT_getInstance() {
    CullFace_initEntries();
    return CullFace_FRONT_instance;
  }
  function CullFace_BACK_getInstance() {
    CullFace_initEntries();
    return CullFace_BACK_instance;
  }
  function CullFace_FRONT_AND_BACK_getInstance() {
    CullFace_initEntries();
    return CullFace_FRONT_AND_BACK_instance;
  }
  function CullFace_DISABLED_getInstance() {
    CullFace_initEntries();
    return CullFace_DISABLED_instance;
  }
  function get_DEPTH_TEST_ENABLED() {
    _init_properties_DepthMode_kt__qfy5t8();
    return DEPTH_TEST_ENABLED;
  }
  var DEPTH_TEST_ENABLED;
  function get_DEPTH_NO_WRITE() {
    _init_properties_DepthMode_kt__qfy5t8();
    return DEPTH_NO_WRITE;
  }
  var DEPTH_NO_WRITE;
  function DepthMode(depthTest, depthWrite) {
    depthTest = depthTest === VOID ? false : depthTest;
    depthWrite = depthWrite === VOID ? false : depthWrite;
    this.depthTest = depthTest;
    this.depthWrite = depthWrite;
  }
  protoOf(DepthMode).w6 = function (_set____db54di) {
    this.depthTest = _set____db54di;
  };
  protoOf(DepthMode).x6 = function () {
    return this.depthTest;
  };
  protoOf(DepthMode).y6 = function (_set____db54di) {
    this.depthWrite = _set____db54di;
  };
  protoOf(DepthMode).z6 = function () {
    return this.depthWrite;
  };
  var properties_initialized_DepthMode_kt_b0ctqi;
  function _init_properties_DepthMode_kt__qfy5t8() {
    if (!properties_initialized_DepthMode_kt_b0ctqi) {
      properties_initialized_DepthMode_kt_b0ctqi = true;
      new DepthMode(false, false);
      DEPTH_TEST_ENABLED = new DepthMode(true, true);
      DEPTH_NO_WRITE = new DepthMode(true, false);
      new DepthMode(false, true);
    }
  }
  function Mesh_init_$Init$($this) {
    Mesh.call($this);
    return $this;
  }
  function MeshConstructor1() {
    return Mesh_init_$Init$(objectCreate(protoOf(Mesh)));
  }
  function Mesh_init_$Init$_0(name, attrs, $this) {
    attrs = attrs === VOID ? null : attrs;
    Mesh_init_$Init$($this);
    $this.name = name;
    $this.fileName = name;
    $this.attributes = attrs;
    return $this;
  }
  function MeshConstructor2(name, attrs) {
    return Mesh_init_$Init$_0(name, attrs, objectCreate(protoOf(Mesh)));
  }
  protoOf(Mesh).a7 = function (_set____db54di) {
    this.name = _set____db54di;
  };
  protoOf(Mesh).c4 = function () {
    return this.name;
  };
  protoOf(Mesh).b7 = function (_set____db54di) {
    this.id = _set____db54di;
  };
  protoOf(Mesh).c7 = function () {
    return this.id;
  };
  protoOf(Mesh).d7 = function (_set____db54di) {
    this.fileName = _set____db54di;
  };
  protoOf(Mesh).e7 = function () {
    return this.fileName;
  };
  protoOf(Mesh).f7 = function (_set____db54di) {
    this.loaded = _set____db54di;
  };
  protoOf(Mesh).g7 = function () {
    return this.loaded;
  };
  protoOf(Mesh).h7 = function (_set____db54di) {
    this.attributes = _set____db54di;
  };
  protoOf(Mesh).i7 = function () {
    return this.attributes;
  };
  function Mesh() {
    this.name = '';
    this.id = 0;
    this.fileName = '';
    this.loaded = false;
    this.attributes = null;
  }
  function setFOV($this, matrix, fovY, aspect, zNear, zFar) {
    var fW;
    // Inline function 'kotlin.math.tan' call
    var x = fovY / 360.0 * 3.1415925;
    var fH = Math.tan(x) * zNear;
    fW = fH * aspect;
    Matrix_getInstance().q7(matrix, 0, -fW, fW, -fH, fH, zNear, zFar);
  }
  function Scene() {
    this.lastFrameTime = 0.0;
    this.viewportWidth = 0;
    this.viewportHeight = 0;
    this.matView = new Float32Array(16);
    this.useExternalViewMatrix = false;
    this.matProjection = new Float32Array(16);
    this.matModel = new Float32Array(16);
    this.matMVP = new Float32Array(16);
    this.zoom = 0.0;
    this.ZOOM_FOV = 10.0;
    this.FOV_LANDSCAPE = 0.0;
    this.FOV_PORTRAIT = 0.0;
    this.Z_NEAR = 0.0;
    this.Z_FAR = 0.0;
    this.backendMode = BackendMode_OPENGL_getInstance();
    this.r7_1 = false;
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.s7_1 = ArrayList_init_$Create$();
    var tmp_0 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_0.t7_1 = ArrayList_init_$Create$();
    var tmp_1 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_1.u7_1 = ArrayList_init_$Create$();
    var tmp_2 = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp_2.v7_1 = ArrayList_init_$Create$();
  }
  protoOf(Scene).w7 = function (_set____db54di) {
    this.lastFrameTime = _set____db54di;
  };
  protoOf(Scene).x7 = function () {
    return this.lastFrameTime;
  };
  protoOf(Scene).y7 = function (_set____db54di) {
    this.viewportWidth = _set____db54di;
  };
  protoOf(Scene).z7 = function () {
    return this.viewportWidth;
  };
  protoOf(Scene).a8 = function (_set____db54di) {
    this.viewportHeight = _set____db54di;
  };
  protoOf(Scene).b8 = function () {
    return this.viewportHeight;
  };
  protoOf(Scene).c8 = function () {
    return this.matView;
  };
  protoOf(Scene).d8 = function (_set____db54di) {
    this.useExternalViewMatrix = _set____db54di;
  };
  protoOf(Scene).e8 = function () {
    return this.useExternalViewMatrix;
  };
  protoOf(Scene).f8 = function () {
    return this.matProjection;
  };
  protoOf(Scene).g8 = function () {
    return this.matModel;
  };
  protoOf(Scene).h8 = function () {
    return this.matMVP;
  };
  protoOf(Scene).i8 = function (_set____db54di) {
    this.zoom = _set____db54di;
  };
  protoOf(Scene).j8 = function () {
    return this.zoom;
  };
  protoOf(Scene).k8 = function (_set____db54di) {
    this.ZOOM_FOV = _set____db54di;
  };
  protoOf(Scene).l8 = function () {
    return this.ZOOM_FOV;
  };
  protoOf(Scene).m8 = function (_set____db54di) {
    this.FOV_LANDSCAPE = _set____db54di;
  };
  protoOf(Scene).n8 = function () {
    return this.FOV_LANDSCAPE;
  };
  protoOf(Scene).o8 = function (_set____db54di) {
    this.FOV_PORTRAIT = _set____db54di;
  };
  protoOf(Scene).p8 = function () {
    return this.FOV_PORTRAIT;
  };
  protoOf(Scene).q8 = function (_set____db54di) {
    this.Z_NEAR = _set____db54di;
  };
  protoOf(Scene).r8 = function () {
    return this.Z_NEAR;
  };
  protoOf(Scene).s8 = function (_set____db54di) {
    this.Z_FAR = _set____db54di;
  };
  protoOf(Scene).t8 = function () {
    return this.Z_FAR;
  };
  protoOf(Scene).u8 = function (_set____db54di) {
    this.backendMode = _set____db54di;
  };
  protoOf(Scene).v8 = function () {
    return this.backendMode;
  };
  protoOf(Scene).f7 = function (value) {
    this.r7_1 = value;
  };
  protoOf(Scene).g7 = function () {
    return this.r7_1;
  };
  protoOf(Scene).w8 = function (_set____db54di) {
    this.s7_1 = _set____db54di;
  };
  protoOf(Scene).x8 = function () {
    return this.s7_1;
  };
  protoOf(Scene).y8 = function (_set____db54di) {
    this.t7_1 = _set____db54di;
  };
  protoOf(Scene).z8 = function () {
    return this.t7_1;
  };
  protoOf(Scene).a9 = function (_set____db54di) {
    this.u7_1 = _set____db54di;
  };
  protoOf(Scene).b9 = function () {
    return this.u7_1;
  };
  protoOf(Scene).c9 = function (_set____db54di) {
    this.v7_1 = _set____db54di;
  };
  protoOf(Scene).d9 = function () {
    return this.v7_1;
  };
  protoOf(Scene).updateTimers = function (time) {
    this.lastFrameTime = time;
  };
  protoOf(Scene).updateViewportSize = function (width, height) {
    this.viewportWidth = width;
    this.viewportHeight = height;
  };
  protoOf(Scene).e9 = function (multiplier, width, height) {
    var tmp;
    if (height > 0) {
      tmp = width / height;
    } else {
      tmp = 1.0;
    }
    var ratio = tmp;
    var tmp_0;
    if (width >= height) {
      tmp_0 = this.FOV_LANDSCAPE * multiplier;
    } else {
      tmp_0 = this.FOV_PORTRAIT * multiplier;
    }
    var fov = tmp_0;
    fov = fov + this.zoom * this.ZOOM_FOV;
    setFOV(this, this.matProjection, fov, ratio, this.Z_NEAR, this.Z_FAR);
    if (this.backendMode.equals(BackendMode_METAL_getInstance())) {
      var zs = this.Z_FAR / (this.Z_NEAR - this.Z_FAR);
      this.matProjection[10] = zs;
      this.matProjection[14] = zs * this.Z_NEAR;
    }
  };
  protoOf(Scene).calculateProjection = function (multiplier, width, height, $super) {
    multiplier = multiplier === VOID ? 1.0 : multiplier;
    width = width === VOID ? this.viewportWidth : width;
    height = height === VOID ? this.viewportHeight : height;
    return this.e9(multiplier, width, height);
  };
  protoOf(Scene).calculateMVPMatrix = function (tx, ty, tz, rx, ry, rz, sx, sy, sz) {
    Matrix_getInstance().f9(this.matModel, 0);
    Matrix_getInstance().g9(this.matModel, 0, tx, ty, tz);
    Matrix_getInstance().h9(this.matModel, 0, rx, 1.0, 0.0, 0.0);
    Matrix_getInstance().h9(this.matModel, 0, ry, 0.0, 1.0, 0.0);
    Matrix_getInstance().h9(this.matModel, 0, rz, 0.0, 0.0, 1.0);
    Matrix_getInstance().i9(this.matModel, 0, sx, sy, sz);
    Matrix_getInstance().j9(this.matMVP, 0, this.matView, 0, this.matModel, 0);
    Matrix_getInstance().j9(this.matMVP, 0, this.matProjection, 0, this.matMVP, 0);
  };
  protoOf(Scene).calculateMVPMatrixFromModelMatrix = function (modelMatrix) {
    Matrix_getInstance().j9(this.matMVP, 0, this.matView, 0, modelMatrix, 0);
    Matrix_getInstance().j9(this.matMVP, 0, this.matProjection, 0, this.matMVP, 0);
  };
  protoOf(Scene).setMvpUniform = function (uniform, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
    this.calculateMVPMatrix(tx, ty, tz, rx, ry, rz, sx, sy, sz);
    setUniform(uniform, this.matMVP);
  };
  protoOf(Scene).updateMeshTransformations = function (commands) {
    var tmp0_iterator = commands.h();
    $l$loop: while (tmp0_iterator.o()) {
      var command = tmp0_iterator.p();
      if (!command.enabled) {
        continue $l$loop;
      }
      if (command instanceof GroupCommand) {
        this.updateMeshTransformations(command.commands);
      }
      if (command instanceof DrawTransformedMeshCommand) {
        if (command instanceof DrawStaticMeshCommand) {
          this.calculateMVPMatrixFromModelMatrix(command.modelMatrix);
          // Inline function 'kotlin.collections.copyInto' call
          var this_0 = command.modelMatrix;
          var destination = this.matModel;
          var endIndex = this_0.length;
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          var tmp = this_0;
          // Inline function 'kotlin.js.unsafeCast' call
          // Inline function 'kotlin.js.asDynamic' call
          arrayCopy(tmp, destination, 0, 0, endIndex);
        } else {
          this.calculateMVPMatrix(command.transform.k9_1.x, command.transform.k9_1.y, command.transform.k9_1.z, command.transform.l9_1.x, command.transform.l9_1.y, command.transform.l9_1.z, command.transform.m9_1.x, command.transform.m9_1.y, command.transform.m9_1.z);
        }
        if (command.indexUniformMvp >= 0) {
          setUniform(command.uniforms.q(command.indexUniformMvp), this.matMVP);
        }
        if (command.indexUniformModel >= 0) {
          setUniform(command.uniforms.q(command.indexUniformModel), this.matModel);
        }
        if (command.indexUniformView >= 0) {
          setUniform(command.uniforms.q(command.indexUniformView), this.matView);
        }
        if (command.indexUniformProjection >= 0) {
          setUniform(command.uniforms.q(command.indexUniformProjection), this.matProjection);
        }
      }
    }
  };
  function Shader(name) {
    name = name === VOID ? '' : name;
    this.name = name;
    this.id = -1;
  }
  protoOf(Shader).a7 = function (_set____db54di) {
    this.name = _set____db54di;
  };
  protoOf(Shader).c4 = function () {
    return this.name;
  };
  protoOf(Shader).b7 = function (_set____db54di) {
    this.id = _set____db54di;
  };
  protoOf(Shader).c7 = function () {
    return this.id;
  };
  var TextureFiltering_NEAREST_instance;
  var TextureFiltering_LINEAR_instance;
  var TextureFiltering_NEAREST_MIPMAP_NEAREST_instance;
  var TextureFiltering_LINEAR_MIPMAP_NEAREST_instance;
  var TextureFiltering_NEAREST_MIPMAP_LINEAR_instance;
  var TextureFiltering_LINEAR_MIPMAP_LINEAR_instance;
  function values_3() {
    return [TextureFiltering_NEAREST_getInstance(), TextureFiltering_LINEAR_getInstance(), TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance(), TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance(), TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance(), TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance()];
  }
  function valueOf_3(value) {
    switch (value) {
      case 'NEAREST':
        return TextureFiltering_NEAREST_getInstance();
      case 'LINEAR':
        return TextureFiltering_LINEAR_getInstance();
      case 'NEAREST_MIPMAP_NEAREST':
        return TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance();
      case 'LINEAR_MIPMAP_NEAREST':
        return TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance();
      case 'NEAREST_MIPMAP_LINEAR':
        return TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance();
      case 'LINEAR_MIPMAP_LINEAR':
        return TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
      default:
        TextureFiltering_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var TextureFiltering_entriesInitialized;
  function TextureFiltering_initEntries() {
    if (TextureFiltering_entriesInitialized)
      return Unit_instance;
    TextureFiltering_entriesInitialized = true;
    TextureFiltering_NEAREST_instance = new TextureFiltering('NEAREST', 0);
    TextureFiltering_LINEAR_instance = new TextureFiltering('LINEAR', 1);
    TextureFiltering_NEAREST_MIPMAP_NEAREST_instance = new TextureFiltering('NEAREST_MIPMAP_NEAREST', 2);
    TextureFiltering_LINEAR_MIPMAP_NEAREST_instance = new TextureFiltering('LINEAR_MIPMAP_NEAREST', 3);
    TextureFiltering_NEAREST_MIPMAP_LINEAR_instance = new TextureFiltering('NEAREST_MIPMAP_LINEAR', 4);
    TextureFiltering_LINEAR_MIPMAP_LINEAR_instance = new TextureFiltering('LINEAR_MIPMAP_LINEAR', 5);
  }
  function TextureFiltering(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  var TextureWrapping_CLAMP_TO_EDGE_instance;
  var TextureWrapping_MIRRORED_REPEAT_instance;
  var TextureWrapping_REPEAT_instance;
  function values_4() {
    return [TextureWrapping_CLAMP_TO_EDGE_getInstance(), TextureWrapping_MIRRORED_REPEAT_getInstance(), TextureWrapping_REPEAT_getInstance()];
  }
  function valueOf_4(value) {
    switch (value) {
      case 'CLAMP_TO_EDGE':
        return TextureWrapping_CLAMP_TO_EDGE_getInstance();
      case 'MIRRORED_REPEAT':
        return TextureWrapping_MIRRORED_REPEAT_getInstance();
      case 'REPEAT':
        return TextureWrapping_REPEAT_getInstance();
      default:
        TextureWrapping_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var TextureWrapping_entriesInitialized;
  function TextureWrapping_initEntries() {
    if (TextureWrapping_entriesInitialized)
      return Unit_instance;
    TextureWrapping_entriesInitialized = true;
    TextureWrapping_CLAMP_TO_EDGE_instance = new TextureWrapping('CLAMP_TO_EDGE', 0);
    TextureWrapping_MIRRORED_REPEAT_instance = new TextureWrapping('MIRRORED_REPEAT', 1);
    TextureWrapping_REPEAT_instance = new TextureWrapping('REPEAT', 2);
  }
  function TextureWrapping(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  var TextureFormat_RGBA8_instance;
  var TextureFormat_RGB8_instance;
  var TextureFormat_RGB16F_instance;
  var TextureFormat_RGB32F_instance;
  var TextureFormat_RGBA16F_instance;
  var TextureFormat_RGBA32F_instance;
  var TextureFormat_ASTC_instance;
  function values_5() {
    return [TextureFormat_RGBA8_getInstance(), TextureFormat_RGB8_getInstance(), TextureFormat_RGB16F_getInstance(), TextureFormat_RGB32F_getInstance(), TextureFormat_RGBA16F_getInstance(), TextureFormat_RGBA32F_getInstance(), TextureFormat_ASTC_getInstance()];
  }
  function valueOf_5(value) {
    switch (value) {
      case 'RGBA8':
        return TextureFormat_RGBA8_getInstance();
      case 'RGB8':
        return TextureFormat_RGB8_getInstance();
      case 'RGB16F':
        return TextureFormat_RGB16F_getInstance();
      case 'RGB32F':
        return TextureFormat_RGB32F_getInstance();
      case 'RGBA16F':
        return TextureFormat_RGBA16F_getInstance();
      case 'RGBA32F':
        return TextureFormat_RGBA32F_getInstance();
      case 'ASTC':
        return TextureFormat_ASTC_getInstance();
      default:
        TextureFormat_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var TextureFormat_entriesInitialized;
  function TextureFormat_initEntries() {
    if (TextureFormat_entriesInitialized)
      return Unit_instance;
    TextureFormat_entriesInitialized = true;
    TextureFormat_RGBA8_instance = new TextureFormat('RGBA8', 0);
    TextureFormat_RGB8_instance = new TextureFormat('RGB8', 1);
    TextureFormat_RGB16F_instance = new TextureFormat('RGB16F', 2);
    TextureFormat_RGB32F_instance = new TextureFormat('RGB32F', 3);
    TextureFormat_RGBA16F_instance = new TextureFormat('RGBA16F', 4);
    TextureFormat_RGBA32F_instance = new TextureFormat('RGBA32F', 5);
    TextureFormat_ASTC_instance = new TextureFormat('ASTC', 6);
  }
  function TextureFormat(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  var TextureType_TEX_1D_instance;
  var TextureType_TEX_2D_instance;
  var TextureType_TEX_3D_instance;
  var TextureType_CUBEMAP_instance;
  function values_6() {
    return [TextureType_TEX_1D_getInstance(), TextureType_TEX_2D_getInstance(), TextureType_TEX_3D_getInstance(), TextureType_CUBEMAP_getInstance()];
  }
  function valueOf_6(value) {
    switch (value) {
      case 'TEX_1D':
        return TextureType_TEX_1D_getInstance();
      case 'TEX_2D':
        return TextureType_TEX_2D_getInstance();
      case 'TEX_3D':
        return TextureType_TEX_3D_getInstance();
      case 'CUBEMAP':
        return TextureType_CUBEMAP_getInstance();
      default:
        TextureType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var TextureType_entriesInitialized;
  function TextureType_initEntries() {
    if (TextureType_entriesInitialized)
      return Unit_instance;
    TextureType_entriesInitialized = true;
    TextureType_TEX_1D_instance = new TextureType('TEX_1D', 0);
    TextureType_TEX_2D_instance = new TextureType('TEX_2D', 1);
    TextureType_TEX_3D_instance = new TextureType('TEX_3D', 2);
    TextureType_CUBEMAP_instance = new TextureType('CUBEMAP', 3);
  }
  function TextureType(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function Texture() {
    this.type = TextureType_TEX_2D_getInstance();
    this.name = '';
    this.fileName = '';
    this.id = 0;
    this.loaded = false;
    this.width = 0;
    this.height = 0;
    this.minFilter = TextureFiltering_LINEAR_getInstance();
    this.magFilter = TextureFiltering_LINEAR_getInstance();
    this.wrapping = TextureWrapping_REPEAT_getInstance();
    this.mipmaps = 0;
    this.format = TextureFormat_RGBA8_getInstance();
    this.anisotropy = 0;
  }
  protoOf(Texture).y9 = function (_set____db54di) {
    this.type = _set____db54di;
  };
  protoOf(Texture).z9 = function () {
    return this.type;
  };
  protoOf(Texture).a7 = function (_set____db54di) {
    this.name = _set____db54di;
  };
  protoOf(Texture).c4 = function () {
    return this.name;
  };
  protoOf(Texture).d7 = function (_set____db54di) {
    this.fileName = _set____db54di;
  };
  protoOf(Texture).e7 = function () {
    return this.fileName;
  };
  protoOf(Texture).b7 = function (_set____db54di) {
    this.id = _set____db54di;
  };
  protoOf(Texture).c7 = function () {
    return this.id;
  };
  protoOf(Texture).f7 = function (_set____db54di) {
    this.loaded = _set____db54di;
  };
  protoOf(Texture).g7 = function () {
    return this.loaded;
  };
  protoOf(Texture).aa = function (_set____db54di) {
    this.width = _set____db54di;
  };
  protoOf(Texture).ba = function () {
    return this.width;
  };
  protoOf(Texture).ca = function (_set____db54di) {
    this.height = _set____db54di;
  };
  protoOf(Texture).da = function () {
    return this.height;
  };
  protoOf(Texture).ea = function (_set____db54di) {
    this.minFilter = _set____db54di;
  };
  protoOf(Texture).fa = function () {
    return this.minFilter;
  };
  protoOf(Texture).ga = function (_set____db54di) {
    this.magFilter = _set____db54di;
  };
  protoOf(Texture).ha = function () {
    return this.magFilter;
  };
  protoOf(Texture).ia = function (_set____db54di) {
    this.wrapping = _set____db54di;
  };
  protoOf(Texture).ja = function () {
    return this.wrapping;
  };
  protoOf(Texture).ka = function (_set____db54di) {
    this.mipmaps = _set____db54di;
  };
  protoOf(Texture).la = function () {
    return this.mipmaps;
  };
  protoOf(Texture).ma = function (_set____db54di) {
    this.format = _set____db54di;
  };
  protoOf(Texture).na = function () {
    return this.format;
  };
  protoOf(Texture).oa = function (_set____db54di) {
    this.anisotropy = _set____db54di;
  };
  protoOf(Texture).pa = function () {
    return this.anisotropy;
  };
  function TextureFiltering_NEAREST_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_NEAREST_instance;
  }
  function TextureFiltering_LINEAR_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_LINEAR_instance;
  }
  function TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_NEAREST_MIPMAP_NEAREST_instance;
  }
  function TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_LINEAR_MIPMAP_NEAREST_instance;
  }
  function TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_NEAREST_MIPMAP_LINEAR_instance;
  }
  function TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance() {
    TextureFiltering_initEntries();
    return TextureFiltering_LINEAR_MIPMAP_LINEAR_instance;
  }
  function TextureWrapping_CLAMP_TO_EDGE_getInstance() {
    TextureWrapping_initEntries();
    return TextureWrapping_CLAMP_TO_EDGE_instance;
  }
  function TextureWrapping_MIRRORED_REPEAT_getInstance() {
    TextureWrapping_initEntries();
    return TextureWrapping_MIRRORED_REPEAT_instance;
  }
  function TextureWrapping_REPEAT_getInstance() {
    TextureWrapping_initEntries();
    return TextureWrapping_REPEAT_instance;
  }
  function TextureFormat_RGBA8_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGBA8_instance;
  }
  function TextureFormat_RGB8_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGB8_instance;
  }
  function TextureFormat_RGB16F_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGB16F_instance;
  }
  function TextureFormat_RGB32F_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGB32F_instance;
  }
  function TextureFormat_RGBA16F_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGBA16F_instance;
  }
  function TextureFormat_RGBA32F_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_RGBA32F_instance;
  }
  function TextureFormat_ASTC_getInstance() {
    TextureFormat_initEntries();
    return TextureFormat_ASTC_instance;
  }
  function TextureType_TEX_1D_getInstance() {
    TextureType_initEntries();
    return TextureType_TEX_1D_instance;
  }
  function TextureType_TEX_2D_getInstance() {
    TextureType_initEntries();
    return TextureType_TEX_2D_instance;
  }
  function TextureType_TEX_3D_getInstance() {
    TextureType_initEntries();
    return TextureType_TEX_3D_instance;
  }
  function TextureType_CUBEMAP_getInstance() {
    TextureType_initEntries();
    return TextureType_CUBEMAP_instance;
  }
  function UniformValue() {
  }
  function UniformFloatValue_init_$Init$(value, $this) {
    UniformValue.call($this);
    UniformFloatValue.call($this);
    $this.value = value;
    return $this;
  }
  function UniformFloatValueWithArray(value) {
    return UniformFloatValue_init_$Init$(value, objectCreate(protoOf(UniformFloatValue)));
  }
  protoOf(UniformFloatValue).qa = function (_set____db54di) {
    this.value = _set____db54di;
  };
  protoOf(UniformFloatValue).k2 = function () {
    return this.value;
  };
  function UniformFloatValue() {
  }
  function UniformIntValue_init_$Init$(value, $this) {
    UniformValue.call($this);
    UniformIntValue.call($this);
    $this.value = value;
    return $this;
  }
  function UniformIntValueWithArray(value) {
    return UniformIntValue_init_$Init$(value, objectCreate(protoOf(UniformIntValue)));
  }
  protoOf(UniformIntValue).ra = function (_set____db54di) {
    this.value = _set____db54di;
  };
  protoOf(UniformIntValue).k2 = function () {
    return this.value;
  };
  function UniformIntValue() {
  }
  function UniformTextureValue(value) {
    UniformValue.call(this);
    this.value = value;
  }
  protoOf(UniformTextureValue).sa = function (_set____db54di) {
    this.value = _set____db54di;
  };
  protoOf(UniformTextureValue).k2 = function () {
    return this.value;
  };
  function setUniform(uniform, values) {
    // Inline function 'kotlin.collections.copyInto' call
    var destination = (uniform instanceof UniformFloatValue ? uniform : THROW_CCE()).value;
    var endIndex = values.length;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = values;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    arrayCopy(tmp, destination, 0, 0, endIndex);
  }
  function setUniform_0(uniform, x, y, z, w) {
    var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
    uniformFloat.value[0] = x;
    uniformFloat.value[1] = y;
    uniformFloat.value[2] = z;
    uniformFloat.value[3] = w;
  }
  function setUniform_1(uniform, x, y) {
    var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
    uniformFloat.value[0] = x;
    uniformFloat.value[1] = y;
  }
  function setUniform_2(uniform, x) {
    var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
    uniformFloat.value[0] = x;
  }
  function setUniform_3(uniform, x) {
    var uniformInt = uniform instanceof UniformIntValue ? uniform : THROW_CCE();
    uniformInt.value[0] = x;
  }
  function setUniform_4(uniform, value) {
    var uniformFloat = uniform instanceof UniformFloatValue ? uniform : THROW_CCE();
    uniformFloat.value[0] = value.x;
    uniformFloat.value[1] = value.y;
    uniformFloat.value[2] = value.z;
  }
  var VertexFormat_UBYTE_instance;
  var VertexFormat_UBYTE2_instance;
  var VertexFormat_UBYTE3_instance;
  var VertexFormat_UBYTE4_instance;
  var VertexFormat_BYTE_instance;
  var VertexFormat_BYTE2_instance;
  var VertexFormat_BYTE3_instance;
  var VertexFormat_BYTE4_instance;
  var VertexFormat_UBYTE_NORMALIZED_instance;
  var VertexFormat_UBYTE2_NORMALIZED_instance;
  var VertexFormat_UBYTE3_NORMALIZED_instance;
  var VertexFormat_UBYTE4_NORMALIZED_instance;
  var VertexFormat_BYTE_NORMALIZED_instance;
  var VertexFormat_BYTE2_NORMALIZED_instance;
  var VertexFormat_BYTE3_NORMALIZED_instance;
  var VertexFormat_BYTE4_NORMALIZED_instance;
  var VertexFormat_USHORT_instance;
  var VertexFormat_USHORT2_instance;
  var VertexFormat_USHORT3_instance;
  var VertexFormat_USHORT4_instance;
  var VertexFormat_SHORT_instance;
  var VertexFormat_SHORT2_instance;
  var VertexFormat_SHORT3_instance;
  var VertexFormat_SHORT4_instance;
  var VertexFormat_USHORT_NORMALIZED_instance;
  var VertexFormat_USHORT2_NORMALIZED_instance;
  var VertexFormat_USHORT3_NORMALIZED_instance;
  var VertexFormat_USHORT4_NORMALIZED_instance;
  var VertexFormat_SHORT_NORMALIZED_instance;
  var VertexFormat_SHORT2_NORMALIZED_instance;
  var VertexFormat_SHORT3_NORMALIZED_instance;
  var VertexFormat_SHORT4_NORMALIZED_instance;
  var VertexFormat_HALF_instance;
  var VertexFormat_HALF2_instance;
  var VertexFormat_HALF3_instance;
  var VertexFormat_HALF4_instance;
  var VertexFormat_FLOAT_instance;
  var VertexFormat_FLOAT2_instance;
  var VertexFormat_FLOAT3_instance;
  var VertexFormat_FLOAT4_instance;
  var VertexFormat_UINT_instance;
  var VertexFormat_UINT2_instance;
  var VertexFormat_UINT3_instance;
  var VertexFormat_UINT4_instance;
  var VertexFormat_INT_instance;
  var VertexFormat_INT2_instance;
  var VertexFormat_INT3_instance;
  var VertexFormat_INT4_instance;
  var VertexFormat_INT_1010102_NORMALIZED_instance;
  var VertexFormat_UINT_1010102_NORMALIZED_instance;
  function values_7() {
    return [VertexFormat_UBYTE_getInstance(), VertexFormat_UBYTE2_getInstance(), VertexFormat_UBYTE3_getInstance(), VertexFormat_UBYTE4_getInstance(), VertexFormat_BYTE_getInstance(), VertexFormat_BYTE2_getInstance(), VertexFormat_BYTE3_getInstance(), VertexFormat_BYTE4_getInstance(), VertexFormat_UBYTE_NORMALIZED_getInstance(), VertexFormat_UBYTE2_NORMALIZED_getInstance(), VertexFormat_UBYTE3_NORMALIZED_getInstance(), VertexFormat_UBYTE4_NORMALIZED_getInstance(), VertexFormat_BYTE_NORMALIZED_getInstance(), VertexFormat_BYTE2_NORMALIZED_getInstance(), VertexFormat_BYTE3_NORMALIZED_getInstance(), VertexFormat_BYTE4_NORMALIZED_getInstance(), VertexFormat_USHORT_getInstance(), VertexFormat_USHORT2_getInstance(), VertexFormat_USHORT3_getInstance(), VertexFormat_USHORT4_getInstance(), VertexFormat_SHORT_getInstance(), VertexFormat_SHORT2_getInstance(), VertexFormat_SHORT3_getInstance(), VertexFormat_SHORT4_getInstance(), VertexFormat_USHORT_NORMALIZED_getInstance(), VertexFormat_USHORT2_NORMALIZED_getInstance(), VertexFormat_USHORT3_NORMALIZED_getInstance(), VertexFormat_USHORT4_NORMALIZED_getInstance(), VertexFormat_SHORT_NORMALIZED_getInstance(), VertexFormat_SHORT2_NORMALIZED_getInstance(), VertexFormat_SHORT3_NORMALIZED_getInstance(), VertexFormat_SHORT4_NORMALIZED_getInstance(), VertexFormat_HALF_getInstance(), VertexFormat_HALF2_getInstance(), VertexFormat_HALF3_getInstance(), VertexFormat_HALF4_getInstance(), VertexFormat_FLOAT_getInstance(), VertexFormat_FLOAT2_getInstance(), VertexFormat_FLOAT3_getInstance(), VertexFormat_FLOAT4_getInstance(), VertexFormat_UINT_getInstance(), VertexFormat_UINT2_getInstance(), VertexFormat_UINT3_getInstance(), VertexFormat_UINT4_getInstance(), VertexFormat_INT_getInstance(), VertexFormat_INT2_getInstance(), VertexFormat_INT3_getInstance(), VertexFormat_INT4_getInstance(), VertexFormat_INT_1010102_NORMALIZED_getInstance(), VertexFormat_UINT_1010102_NORMALIZED_getInstance()];
  }
  function valueOf_7(value) {
    switch (value) {
      case 'UBYTE':
        return VertexFormat_UBYTE_getInstance();
      case 'UBYTE2':
        return VertexFormat_UBYTE2_getInstance();
      case 'UBYTE3':
        return VertexFormat_UBYTE3_getInstance();
      case 'UBYTE4':
        return VertexFormat_UBYTE4_getInstance();
      case 'BYTE':
        return VertexFormat_BYTE_getInstance();
      case 'BYTE2':
        return VertexFormat_BYTE2_getInstance();
      case 'BYTE3':
        return VertexFormat_BYTE3_getInstance();
      case 'BYTE4':
        return VertexFormat_BYTE4_getInstance();
      case 'UBYTE_NORMALIZED':
        return VertexFormat_UBYTE_NORMALIZED_getInstance();
      case 'UBYTE2_NORMALIZED':
        return VertexFormat_UBYTE2_NORMALIZED_getInstance();
      case 'UBYTE3_NORMALIZED':
        return VertexFormat_UBYTE3_NORMALIZED_getInstance();
      case 'UBYTE4_NORMALIZED':
        return VertexFormat_UBYTE4_NORMALIZED_getInstance();
      case 'BYTE_NORMALIZED':
        return VertexFormat_BYTE_NORMALIZED_getInstance();
      case 'BYTE2_NORMALIZED':
        return VertexFormat_BYTE2_NORMALIZED_getInstance();
      case 'BYTE3_NORMALIZED':
        return VertexFormat_BYTE3_NORMALIZED_getInstance();
      case 'BYTE4_NORMALIZED':
        return VertexFormat_BYTE4_NORMALIZED_getInstance();
      case 'USHORT':
        return VertexFormat_USHORT_getInstance();
      case 'USHORT2':
        return VertexFormat_USHORT2_getInstance();
      case 'USHORT3':
        return VertexFormat_USHORT3_getInstance();
      case 'USHORT4':
        return VertexFormat_USHORT4_getInstance();
      case 'SHORT':
        return VertexFormat_SHORT_getInstance();
      case 'SHORT2':
        return VertexFormat_SHORT2_getInstance();
      case 'SHORT3':
        return VertexFormat_SHORT3_getInstance();
      case 'SHORT4':
        return VertexFormat_SHORT4_getInstance();
      case 'USHORT_NORMALIZED':
        return VertexFormat_USHORT_NORMALIZED_getInstance();
      case 'USHORT2_NORMALIZED':
        return VertexFormat_USHORT2_NORMALIZED_getInstance();
      case 'USHORT3_NORMALIZED':
        return VertexFormat_USHORT3_NORMALIZED_getInstance();
      case 'USHORT4_NORMALIZED':
        return VertexFormat_USHORT4_NORMALIZED_getInstance();
      case 'SHORT_NORMALIZED':
        return VertexFormat_SHORT_NORMALIZED_getInstance();
      case 'SHORT2_NORMALIZED':
        return VertexFormat_SHORT2_NORMALIZED_getInstance();
      case 'SHORT3_NORMALIZED':
        return VertexFormat_SHORT3_NORMALIZED_getInstance();
      case 'SHORT4_NORMALIZED':
        return VertexFormat_SHORT4_NORMALIZED_getInstance();
      case 'HALF':
        return VertexFormat_HALF_getInstance();
      case 'HALF2':
        return VertexFormat_HALF2_getInstance();
      case 'HALF3':
        return VertexFormat_HALF3_getInstance();
      case 'HALF4':
        return VertexFormat_HALF4_getInstance();
      case 'FLOAT':
        return VertexFormat_FLOAT_getInstance();
      case 'FLOAT2':
        return VertexFormat_FLOAT2_getInstance();
      case 'FLOAT3':
        return VertexFormat_FLOAT3_getInstance();
      case 'FLOAT4':
        return VertexFormat_FLOAT4_getInstance();
      case 'UINT':
        return VertexFormat_UINT_getInstance();
      case 'UINT2':
        return VertexFormat_UINT2_getInstance();
      case 'UINT3':
        return VertexFormat_UINT3_getInstance();
      case 'UINT4':
        return VertexFormat_UINT4_getInstance();
      case 'INT':
        return VertexFormat_INT_getInstance();
      case 'INT2':
        return VertexFormat_INT2_getInstance();
      case 'INT3':
        return VertexFormat_INT3_getInstance();
      case 'INT4':
        return VertexFormat_INT4_getInstance();
      case 'INT_1010102_NORMALIZED':
        return VertexFormat_INT_1010102_NORMALIZED_getInstance();
      case 'UINT_1010102_NORMALIZED':
        return VertexFormat_UINT_1010102_NORMALIZED_getInstance();
      default:
        VertexFormat_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var VertexFormat_entriesInitialized;
  function VertexFormat_initEntries() {
    if (VertexFormat_entriesInitialized)
      return Unit_instance;
    VertexFormat_entriesInitialized = true;
    VertexFormat_UBYTE_instance = new VertexFormat('UBYTE', 0);
    VertexFormat_UBYTE2_instance = new VertexFormat('UBYTE2', 1);
    VertexFormat_UBYTE3_instance = new VertexFormat('UBYTE3', 2);
    VertexFormat_UBYTE4_instance = new VertexFormat('UBYTE4', 3);
    VertexFormat_BYTE_instance = new VertexFormat('BYTE', 4);
    VertexFormat_BYTE2_instance = new VertexFormat('BYTE2', 5);
    VertexFormat_BYTE3_instance = new VertexFormat('BYTE3', 6);
    VertexFormat_BYTE4_instance = new VertexFormat('BYTE4', 7);
    VertexFormat_UBYTE_NORMALIZED_instance = new VertexFormat('UBYTE_NORMALIZED', 8);
    VertexFormat_UBYTE2_NORMALIZED_instance = new VertexFormat('UBYTE2_NORMALIZED', 9);
    VertexFormat_UBYTE3_NORMALIZED_instance = new VertexFormat('UBYTE3_NORMALIZED', 10);
    VertexFormat_UBYTE4_NORMALIZED_instance = new VertexFormat('UBYTE4_NORMALIZED', 11);
    VertexFormat_BYTE_NORMALIZED_instance = new VertexFormat('BYTE_NORMALIZED', 12);
    VertexFormat_BYTE2_NORMALIZED_instance = new VertexFormat('BYTE2_NORMALIZED', 13);
    VertexFormat_BYTE3_NORMALIZED_instance = new VertexFormat('BYTE3_NORMALIZED', 14);
    VertexFormat_BYTE4_NORMALIZED_instance = new VertexFormat('BYTE4_NORMALIZED', 15);
    VertexFormat_USHORT_instance = new VertexFormat('USHORT', 16);
    VertexFormat_USHORT2_instance = new VertexFormat('USHORT2', 17);
    VertexFormat_USHORT3_instance = new VertexFormat('USHORT3', 18);
    VertexFormat_USHORT4_instance = new VertexFormat('USHORT4', 19);
    VertexFormat_SHORT_instance = new VertexFormat('SHORT', 20);
    VertexFormat_SHORT2_instance = new VertexFormat('SHORT2', 21);
    VertexFormat_SHORT3_instance = new VertexFormat('SHORT3', 22);
    VertexFormat_SHORT4_instance = new VertexFormat('SHORT4', 23);
    VertexFormat_USHORT_NORMALIZED_instance = new VertexFormat('USHORT_NORMALIZED', 24);
    VertexFormat_USHORT2_NORMALIZED_instance = new VertexFormat('USHORT2_NORMALIZED', 25);
    VertexFormat_USHORT3_NORMALIZED_instance = new VertexFormat('USHORT3_NORMALIZED', 26);
    VertexFormat_USHORT4_NORMALIZED_instance = new VertexFormat('USHORT4_NORMALIZED', 27);
    VertexFormat_SHORT_NORMALIZED_instance = new VertexFormat('SHORT_NORMALIZED', 28);
    VertexFormat_SHORT2_NORMALIZED_instance = new VertexFormat('SHORT2_NORMALIZED', 29);
    VertexFormat_SHORT3_NORMALIZED_instance = new VertexFormat('SHORT3_NORMALIZED', 30);
    VertexFormat_SHORT4_NORMALIZED_instance = new VertexFormat('SHORT4_NORMALIZED', 31);
    VertexFormat_HALF_instance = new VertexFormat('HALF', 32);
    VertexFormat_HALF2_instance = new VertexFormat('HALF2', 33);
    VertexFormat_HALF3_instance = new VertexFormat('HALF3', 34);
    VertexFormat_HALF4_instance = new VertexFormat('HALF4', 35);
    VertexFormat_FLOAT_instance = new VertexFormat('FLOAT', 36);
    VertexFormat_FLOAT2_instance = new VertexFormat('FLOAT2', 37);
    VertexFormat_FLOAT3_instance = new VertexFormat('FLOAT3', 38);
    VertexFormat_FLOAT4_instance = new VertexFormat('FLOAT4', 39);
    VertexFormat_UINT_instance = new VertexFormat('UINT', 40);
    VertexFormat_UINT2_instance = new VertexFormat('UINT2', 41);
    VertexFormat_UINT3_instance = new VertexFormat('UINT3', 42);
    VertexFormat_UINT4_instance = new VertexFormat('UINT4', 43);
    VertexFormat_INT_instance = new VertexFormat('INT', 44);
    VertexFormat_INT2_instance = new VertexFormat('INT2', 45);
    VertexFormat_INT3_instance = new VertexFormat('INT3', 46);
    VertexFormat_INT4_instance = new VertexFormat('INT4', 47);
    VertexFormat_INT_1010102_NORMALIZED_instance = new VertexFormat('INT_1010102_NORMALIZED', 48);
    VertexFormat_UINT_1010102_NORMALIZED_instance = new VertexFormat('UINT_1010102_NORMALIZED', 49);
  }
  function VertexFormat(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function VertexAttribute(type, index, format, offset) {
    this.type = type;
    this.index = index;
    this.format = format;
    this.offset = offset;
  }
  protoOf(VertexAttribute).z9 = function () {
    return this.type;
  };
  protoOf(VertexAttribute).va = function () {
    return this.index;
  };
  protoOf(VertexAttribute).na = function () {
    return this.format;
  };
  protoOf(VertexAttribute).wa = function () {
    return this.offset;
  };
  protoOf(VertexAttribute).j5 = function () {
    return this.type;
  };
  protoOf(VertexAttribute).k5 = function () {
    return this.index;
  };
  protoOf(VertexAttribute).xa = function () {
    return this.format;
  };
  protoOf(VertexAttribute).ya = function () {
    return this.offset;
  };
  protoOf(VertexAttribute).za = function (type, index, format, offset) {
    return new VertexAttribute(type, index, format, offset);
  };
  protoOf(VertexAttribute).copy = function (type, index, format, offset, $super) {
    type = type === VOID ? this.type : type;
    index = index === VOID ? this.index : index;
    format = format === VOID ? this.format : format;
    offset = offset === VOID ? this.offset : offset;
    return this.za(type, index, format, offset);
  };
  protoOf(VertexAttribute).toString = function () {
    return 'VertexAttribute(type=' + this.type + ', index=' + this.index + ', format=' + this.format + ', offset=' + this.offset + ')';
  };
  protoOf(VertexAttribute).hashCode = function () {
    var result = this.type.hashCode();
    result = imul(result, 31) + this.index | 0;
    result = imul(result, 31) + this.format.hashCode() | 0;
    result = imul(result, 31) + this.offset | 0;
    return result;
  };
  protoOf(VertexAttribute).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof VertexAttribute))
      return false;
    var tmp0_other_with_cast = other instanceof VertexAttribute ? other : THROW_CCE();
    if (!this.type.equals(tmp0_other_with_cast.type))
      return false;
    if (!(this.index === tmp0_other_with_cast.index))
      return false;
    if (!this.format.equals(tmp0_other_with_cast.format))
      return false;
    if (!(this.offset === tmp0_other_with_cast.offset))
      return false;
    return true;
  };
  function VertexAttributesDescriptor(attributes, stride) {
    this.attributes = attributes;
    this.stride = stride;
  }
  protoOf(VertexAttributesDescriptor).i7 = function () {
    return this.attributes;
  };
  protoOf(VertexAttributesDescriptor).ab = function () {
    return this.stride;
  };
  protoOf(VertexAttributesDescriptor).j5 = function () {
    return this.attributes;
  };
  protoOf(VertexAttributesDescriptor).k5 = function () {
    return this.stride;
  };
  protoOf(VertexAttributesDescriptor).bb = function (attributes, stride) {
    return new VertexAttributesDescriptor(attributes, stride);
  };
  protoOf(VertexAttributesDescriptor).copy = function (attributes, stride, $super) {
    attributes = attributes === VOID ? this.attributes : attributes;
    stride = stride === VOID ? this.stride : stride;
    return this.bb(attributes, stride);
  };
  protoOf(VertexAttributesDescriptor).toString = function () {
    return 'VertexAttributesDescriptor(attributes=' + this.attributes + ', stride=' + this.stride + ')';
  };
  protoOf(VertexAttributesDescriptor).hashCode = function () {
    var result = hashCode(this.attributes);
    result = imul(result, 31) + this.stride | 0;
    return result;
  };
  protoOf(VertexAttributesDescriptor).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof VertexAttributesDescriptor))
      return false;
    var tmp0_other_with_cast = other instanceof VertexAttributesDescriptor ? other : THROW_CCE();
    if (!equals(this.attributes, tmp0_other_with_cast.attributes))
      return false;
    if (!(this.stride === tmp0_other_with_cast.stride))
      return false;
    return true;
  };
  var AttributeType_VERTEX_instance;
  var AttributeType_NORMAL_instance;
  var AttributeType_COLOR_instance;
  var AttributeType_UV0_instance;
  var AttributeType_UV1_instance;
  var AttributeType_UV2_instance;
  var AttributeType_AO_instance;
  var AttributeType_CUSTOM0_instance;
  var AttributeType_CUSTOM1_instance;
  var AttributeType_CUSTOM2_instance;
  var AttributeType_CUSTOM3_instance;
  var AttributeType_U0_instance;
  var AttributeType_V0_instance;
  var AttributeType_U1_instance;
  var AttributeType_V1_instance;
  var AttributeType_U2_instance;
  var AttributeType_V2_instance;
  function values_8() {
    return [AttributeType_VERTEX_getInstance(), AttributeType_NORMAL_getInstance(), AttributeType_COLOR_getInstance(), AttributeType_UV0_getInstance(), AttributeType_UV1_getInstance(), AttributeType_UV2_getInstance(), AttributeType_AO_getInstance(), AttributeType_CUSTOM0_getInstance(), AttributeType_CUSTOM1_getInstance(), AttributeType_CUSTOM2_getInstance(), AttributeType_CUSTOM3_getInstance(), AttributeType_U0_getInstance(), AttributeType_V0_getInstance(), AttributeType_U1_getInstance(), AttributeType_V1_getInstance(), AttributeType_U2_getInstance(), AttributeType_V2_getInstance()];
  }
  function valueOf_8(value) {
    switch (value) {
      case 'VERTEX':
        return AttributeType_VERTEX_getInstance();
      case 'NORMAL':
        return AttributeType_NORMAL_getInstance();
      case 'COLOR':
        return AttributeType_COLOR_getInstance();
      case 'UV0':
        return AttributeType_UV0_getInstance();
      case 'UV1':
        return AttributeType_UV1_getInstance();
      case 'UV2':
        return AttributeType_UV2_getInstance();
      case 'AO':
        return AttributeType_AO_getInstance();
      case 'CUSTOM0':
        return AttributeType_CUSTOM0_getInstance();
      case 'CUSTOM1':
        return AttributeType_CUSTOM1_getInstance();
      case 'CUSTOM2':
        return AttributeType_CUSTOM2_getInstance();
      case 'CUSTOM3':
        return AttributeType_CUSTOM3_getInstance();
      case 'U0':
        return AttributeType_U0_getInstance();
      case 'V0':
        return AttributeType_V0_getInstance();
      case 'U1':
        return AttributeType_U1_getInstance();
      case 'V1':
        return AttributeType_V1_getInstance();
      case 'U2':
        return AttributeType_U2_getInstance();
      case 'V2':
        return AttributeType_V2_getInstance();
      default:
        AttributeType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var AttributeType_entriesInitialized;
  function AttributeType_initEntries() {
    if (AttributeType_entriesInitialized)
      return Unit_instance;
    AttributeType_entriesInitialized = true;
    AttributeType_VERTEX_instance = new AttributeType('VERTEX', 0);
    AttributeType_NORMAL_instance = new AttributeType('NORMAL', 1);
    AttributeType_COLOR_instance = new AttributeType('COLOR', 2);
    AttributeType_UV0_instance = new AttributeType('UV0', 3);
    AttributeType_UV1_instance = new AttributeType('UV1', 4);
    AttributeType_UV2_instance = new AttributeType('UV2', 5);
    AttributeType_AO_instance = new AttributeType('AO', 6);
    AttributeType_CUSTOM0_instance = new AttributeType('CUSTOM0', 7);
    AttributeType_CUSTOM1_instance = new AttributeType('CUSTOM1', 8);
    AttributeType_CUSTOM2_instance = new AttributeType('CUSTOM2', 9);
    AttributeType_CUSTOM3_instance = new AttributeType('CUSTOM3', 10);
    AttributeType_U0_instance = new AttributeType('U0', 11);
    AttributeType_V0_instance = new AttributeType('V0', 12);
    AttributeType_U1_instance = new AttributeType('U1', 13);
    AttributeType_V1_instance = new AttributeType('V1', 14);
    AttributeType_U2_instance = new AttributeType('U2', 15);
    AttributeType_V2_instance = new AttributeType('V2', 16);
  }
  function AttributeType(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function MeshAttribute(type, format, offset) {
    this.type = type;
    this.format = format;
    this.offset = offset;
  }
  protoOf(MeshAttribute).z9 = function () {
    return this.type;
  };
  protoOf(MeshAttribute).na = function () {
    return this.format;
  };
  protoOf(MeshAttribute).wa = function () {
    return this.offset;
  };
  protoOf(MeshAttribute).j5 = function () {
    return this.type;
  };
  protoOf(MeshAttribute).k5 = function () {
    return this.format;
  };
  protoOf(MeshAttribute).xa = function () {
    return this.offset;
  };
  protoOf(MeshAttribute).eb = function (type, format, offset) {
    return new MeshAttribute(type, format, offset);
  };
  protoOf(MeshAttribute).copy = function (type, format, offset, $super) {
    type = type === VOID ? this.type : type;
    format = format === VOID ? this.format : format;
    offset = offset === VOID ? this.offset : offset;
    return this.eb(type, format, offset);
  };
  protoOf(MeshAttribute).toString = function () {
    return 'MeshAttribute(type=' + this.type + ', format=' + this.format + ', offset=' + this.offset + ')';
  };
  protoOf(MeshAttribute).hashCode = function () {
    var result = this.type.hashCode();
    result = imul(result, 31) + this.format.hashCode() | 0;
    result = imul(result, 31) + this.offset | 0;
    return result;
  };
  protoOf(MeshAttribute).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MeshAttribute))
      return false;
    var tmp0_other_with_cast = other instanceof MeshAttribute ? other : THROW_CCE();
    if (!this.type.equals(tmp0_other_with_cast.type))
      return false;
    if (!this.format.equals(tmp0_other_with_cast.format))
      return false;
    if (!(this.offset === tmp0_other_with_cast.offset))
      return false;
    return true;
  };
  function MeshAttributes(attributes, stride) {
    this.attributes = attributes;
    this.stride = stride;
  }
  protoOf(MeshAttributes).i7 = function () {
    return this.attributes;
  };
  protoOf(MeshAttributes).ab = function () {
    return this.stride;
  };
  protoOf(MeshAttributes).j5 = function () {
    return this.attributes;
  };
  protoOf(MeshAttributes).k5 = function () {
    return this.stride;
  };
  protoOf(MeshAttributes).fb = function (attributes, stride) {
    return new MeshAttributes(attributes, stride);
  };
  protoOf(MeshAttributes).copy = function (attributes, stride, $super) {
    attributes = attributes === VOID ? this.attributes : attributes;
    stride = stride === VOID ? this.stride : stride;
    return this.fb(attributes, stride);
  };
  protoOf(MeshAttributes).toString = function () {
    return 'MeshAttributes(attributes=' + this.attributes + ', stride=' + this.stride + ')';
  };
  protoOf(MeshAttributes).hashCode = function () {
    var result = hashCode(this.attributes);
    result = imul(result, 31) + this.stride | 0;
    return result;
  };
  protoOf(MeshAttributes).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MeshAttributes))
      return false;
    var tmp0_other_with_cast = other instanceof MeshAttributes ? other : THROW_CCE();
    if (!equals(this.attributes, tmp0_other_with_cast.attributes))
      return false;
    if (!(this.stride === tmp0_other_with_cast.stride))
      return false;
    return true;
  };
  function VertexFormat_UBYTE_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE_instance;
  }
  function VertexFormat_UBYTE2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE2_instance;
  }
  function VertexFormat_UBYTE3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE3_instance;
  }
  function VertexFormat_UBYTE4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE4_instance;
  }
  function VertexFormat_BYTE_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE_instance;
  }
  function VertexFormat_BYTE2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE2_instance;
  }
  function VertexFormat_BYTE3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE3_instance;
  }
  function VertexFormat_BYTE4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE4_instance;
  }
  function VertexFormat_UBYTE_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE_NORMALIZED_instance;
  }
  function VertexFormat_UBYTE2_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE2_NORMALIZED_instance;
  }
  function VertexFormat_UBYTE3_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE3_NORMALIZED_instance;
  }
  function VertexFormat_UBYTE4_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UBYTE4_NORMALIZED_instance;
  }
  function VertexFormat_BYTE_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE_NORMALIZED_instance;
  }
  function VertexFormat_BYTE2_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE2_NORMALIZED_instance;
  }
  function VertexFormat_BYTE3_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE3_NORMALIZED_instance;
  }
  function VertexFormat_BYTE4_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_BYTE4_NORMALIZED_instance;
  }
  function VertexFormat_USHORT_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT_instance;
  }
  function VertexFormat_USHORT2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT2_instance;
  }
  function VertexFormat_USHORT3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT3_instance;
  }
  function VertexFormat_USHORT4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT4_instance;
  }
  function VertexFormat_SHORT_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT_instance;
  }
  function VertexFormat_SHORT2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT2_instance;
  }
  function VertexFormat_SHORT3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT3_instance;
  }
  function VertexFormat_SHORT4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT4_instance;
  }
  function VertexFormat_USHORT_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT_NORMALIZED_instance;
  }
  function VertexFormat_USHORT2_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT2_NORMALIZED_instance;
  }
  function VertexFormat_USHORT3_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT3_NORMALIZED_instance;
  }
  function VertexFormat_USHORT4_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_USHORT4_NORMALIZED_instance;
  }
  function VertexFormat_SHORT_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT_NORMALIZED_instance;
  }
  function VertexFormat_SHORT2_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT2_NORMALIZED_instance;
  }
  function VertexFormat_SHORT3_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT3_NORMALIZED_instance;
  }
  function VertexFormat_SHORT4_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_SHORT4_NORMALIZED_instance;
  }
  function VertexFormat_HALF_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_HALF_instance;
  }
  function VertexFormat_HALF2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_HALF2_instance;
  }
  function VertexFormat_HALF3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_HALF3_instance;
  }
  function VertexFormat_HALF4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_HALF4_instance;
  }
  function VertexFormat_FLOAT_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_FLOAT_instance;
  }
  function VertexFormat_FLOAT2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_FLOAT2_instance;
  }
  function VertexFormat_FLOAT3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_FLOAT3_instance;
  }
  function VertexFormat_FLOAT4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_FLOAT4_instance;
  }
  function VertexFormat_UINT_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UINT_instance;
  }
  function VertexFormat_UINT2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UINT2_instance;
  }
  function VertexFormat_UINT3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UINT3_instance;
  }
  function VertexFormat_UINT4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UINT4_instance;
  }
  function VertexFormat_INT_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_INT_instance;
  }
  function VertexFormat_INT2_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_INT2_instance;
  }
  function VertexFormat_INT3_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_INT3_instance;
  }
  function VertexFormat_INT4_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_INT4_instance;
  }
  function VertexFormat_INT_1010102_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_INT_1010102_NORMALIZED_instance;
  }
  function VertexFormat_UINT_1010102_NORMALIZED_getInstance() {
    VertexFormat_initEntries();
    return VertexFormat_UINT_1010102_NORMALIZED_instance;
  }
  function AttributeType_VERTEX_getInstance() {
    AttributeType_initEntries();
    return AttributeType_VERTEX_instance;
  }
  function AttributeType_NORMAL_getInstance() {
    AttributeType_initEntries();
    return AttributeType_NORMAL_instance;
  }
  function AttributeType_COLOR_getInstance() {
    AttributeType_initEntries();
    return AttributeType_COLOR_instance;
  }
  function AttributeType_UV0_getInstance() {
    AttributeType_initEntries();
    return AttributeType_UV0_instance;
  }
  function AttributeType_UV1_getInstance() {
    AttributeType_initEntries();
    return AttributeType_UV1_instance;
  }
  function AttributeType_UV2_getInstance() {
    AttributeType_initEntries();
    return AttributeType_UV2_instance;
  }
  function AttributeType_AO_getInstance() {
    AttributeType_initEntries();
    return AttributeType_AO_instance;
  }
  function AttributeType_CUSTOM0_getInstance() {
    AttributeType_initEntries();
    return AttributeType_CUSTOM0_instance;
  }
  function AttributeType_CUSTOM1_getInstance() {
    AttributeType_initEntries();
    return AttributeType_CUSTOM1_instance;
  }
  function AttributeType_CUSTOM2_getInstance() {
    AttributeType_initEntries();
    return AttributeType_CUSTOM2_instance;
  }
  function AttributeType_CUSTOM3_getInstance() {
    AttributeType_initEntries();
    return AttributeType_CUSTOM3_instance;
  }
  function AttributeType_U0_getInstance() {
    AttributeType_initEntries();
    return AttributeType_U0_instance;
  }
  function AttributeType_V0_getInstance() {
    AttributeType_initEntries();
    return AttributeType_V0_instance;
  }
  function AttributeType_U1_getInstance() {
    AttributeType_initEntries();
    return AttributeType_U1_instance;
  }
  function AttributeType_V1_getInstance() {
    AttributeType_initEntries();
    return AttributeType_V1_instance;
  }
  function AttributeType_U2_getInstance() {
    AttributeType_initEntries();
    return AttributeType_U2_instance;
  }
  function AttributeType_V2_getInstance() {
    AttributeType_initEntries();
    return AttributeType_V2_instance;
  }
  function TextureAnimationChunked(textureWidth, vertices, frames) {
    this.gb_1 = textureWidth;
    this.hb_1 = frames;
    this.ib_1 = 1.0 / this.gb_1 * 0.5;
    var tmp = this;
    // Inline function 'kotlin.math.ceil' call
    var x = vertices / this.gb_1;
    var tmp$ret$0 = Math.ceil(x);
    tmp.lb_1 = imul(numberToInt(tmp$ret$0), this.hb_1 + 1 | 0);
    this.jb_1 = 1.0 / this.lb_1 * 0.5;
    this.kb_1 = 1.0 / this.lb_1;
    var tmp_0 = this;
    // Inline function 'kotlin.math.ceil' call
    var x_0 = vertices / this.gb_1;
    tmp_0.mb_1 = 1.0 / Math.ceil(x_0);
  }
  protoOf(TextureAnimationChunked).nb = function (timer) {
    var coeff = timer < 0.5 ? timer * 2 : (1 - timer) * 2;
    var y = this.kb_1 * coeff * (this.hb_1 - 1 | 0) + this.jb_1;
    return y;
  };
  protoOf(TextureAnimationChunked).ob = function (timer) {
    return this.kb_1 * timer * (this.hb_1 - 1 | 0) + this.jb_1;
  };
  function updateCameraInterpolator($this) {
    var camera = $this.tb_1[$this.rb_1];
    $this.pb_1.setMinDuration($this.minDuration * $this.ub_1);
    $this.pb_1.setPosition(camera);
    $this.pb_1.reset();
  }
  function CameraPathAnimator(speed, minDuration, transitionDuration, isSmooth) {
    isSmooth = isSmooth === VOID ? false : isSmooth;
    this.speed = speed;
    this.minDuration = minDuration;
    this.transitionDuration = transitionDuration;
    this.enabled = true;
    this.pb_1 = new CameraPositionInterpolator(isSmooth);
    this.qb_1 = false;
    this.rb_1 = 0;
    this.sb_1 = CameraState_ANIMATING_getInstance();
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.tb_1 = [];
    this.ub_1 = 1.0;
    this.vb_1 = 0.0;
    this.pb_1.speed = this.speed;
    this.pb_1.setMinDuration(this.minDuration * this.ub_1);
  }
  protoOf(CameraPathAnimator).dc = function (_set____db54di) {
    this.speed = _set____db54di;
  };
  protoOf(CameraPathAnimator).ec = function () {
    return this.speed;
  };
  protoOf(CameraPathAnimator).fc = function (_set____db54di) {
    this.minDuration = _set____db54di;
  };
  protoOf(CameraPathAnimator).gc = function () {
    return this.minDuration;
  };
  protoOf(CameraPathAnimator).hc = function (_set____db54di) {
    this.transitionDuration = _set____db54di;
  };
  protoOf(CameraPathAnimator).ic = function () {
    return this.transitionDuration;
  };
  protoOf(CameraPathAnimator).e6 = function (_set____db54di) {
    this.enabled = _set____db54di;
  };
  protoOf(CameraPathAnimator).f6 = function () {
    return this.enabled;
  };
  protoOf(CameraPathAnimator).jc = function (value) {
    this.ub_1 = value;
    updateCameraInterpolator(this);
  };
  protoOf(CameraPathAnimator).kc = function () {
    return this.ub_1;
  };
  protoOf(CameraPathAnimator).enable = function () {
    this.enabled = true;
  };
  protoOf(CameraPathAnimator).disable = function () {
    this.enabled = false;
  };
  protoOf(CameraPathAnimator).lc = function () {
    return this.pb_1;
  };
  protoOf(CameraPathAnimator).mc = function () {
    return this.pb_1.timer;
  };
  protoOf(CameraPathAnimator).nc = function () {
    return this.sb_1;
  };
  protoOf(CameraPathAnimator).oc = function (value, randomizeCamera) {
    this.tb_1 = value;
    this.rb_1 = 0;
    updateCameraInterpolator(this);
    if (randomizeCamera) {
      this.randomCamera();
    }
  };
  protoOf(CameraPathAnimator).setCameras = function (value, randomizeCamera, $super) {
    randomizeCamera = randomizeCamera === VOID ? false : randomizeCamera;
    return this.oc(value, randomizeCamera);
  };
  protoOf(CameraPathAnimator).pc = function () {
    return this.tb_1[this.rb_1];
  };
  protoOf(CameraPathAnimator).nextCamera = function () {
    if (!this.enabled) {
      return Unit_instance;
    }
    this.setCameraState(CameraState_TRANSITIONING_getInstance());
  };
  protoOf(CameraPathAnimator).randomCamera = function () {
    this.rb_1 = MathUtils_instance.qc(this.tb_1.length, this.rb_1);
    updateCameraInterpolator(this);
  };
  protoOf(CameraPathAnimator).setCameraState = function (state) {
    if (this.sb_1.equals(state)) {
      return Unit_instance;
    }
    if (this.sb_1 === CameraState_ANIMATING_getInstance() ? state === CameraState_TRANSITIONING_getInstance() : false) {
      this.rb_1 = this.rb_1 + 1 | 0;
      this.rb_1 = this.rb_1 % this.tb_1.length | 0;
      var camera = this.tb_1[this.rb_1];
      this.pb_1.setMinDuration(this.transitionDuration);
      this.pb_1.setPosition(new CameraPositionPair(new CameraPosition(new Vec3(this.pb_1.cameraPosition.x, this.pb_1.cameraPosition.y, this.pb_1.cameraPosition.z), new Vec3(this.pb_1.cameraRotation.x, this.pb_1.cameraRotation.y, this.pb_1.cameraRotation.z)), new CameraPosition(new Vec3((camera.uc_1.rc_1.x - camera.tc_1.rc_1.x) / 2.0 + camera.tc_1.rc_1.x, (camera.uc_1.rc_1.y - camera.tc_1.rc_1.y) / 2.0 + camera.tc_1.rc_1.y, (camera.uc_1.rc_1.z - camera.tc_1.rc_1.z) / 2.0 + camera.tc_1.rc_1.z), new Vec3((camera.uc_1.sc_1.x - camera.tc_1.sc_1.x) / 2.0 + camera.tc_1.sc_1.x, (camera.uc_1.sc_1.y - camera.tc_1.sc_1.y) / 2.0 + camera.tc_1.sc_1.y, (camera.uc_1.sc_1.z - camera.tc_1.sc_1.z) / 2.0 + camera.tc_1.sc_1.z))));
      this.qb_1 = this.pb_1.reverse;
      this.pb_1.reverse = false;
      this.pb_1.reset();
    } else if (this.sb_1 === CameraState_TRANSITIONING_getInstance() ? state === CameraState_ANIMATING_getInstance() : false) {
      updateCameraInterpolator(this);
      this.pb_1.reverse = this.qb_1;
      this.pb_1.setTimer(0.5);
    }
    this.sb_1 = state;
  };
  protoOf(CameraPathAnimator).animate = function (timeNow) {
    if (!(this.vb_1 === 0.0)) {
      this.pb_1.iterate(timeNow);
      if (this.pb_1.timer === 1.0) {
        if (this.sb_1 === CameraState_ANIMATING_getInstance()) {
          this.pb_1.reverse = !this.pb_1.reverse;
          this.pb_1.reset();
        } else {
          this.setCameraState(CameraState_ANIMATING_getInstance());
        }
      }
    }
    this.vb_1 = timeNow;
  };
  protoOf(CameraPathAnimator).changeDirection = function (impulse) {
    if (this.sb_1 === CameraState_TRANSITIONING_getInstance()) {
      return Unit_instance;
    }
    var prevReverse = this.pb_1.reverse;
    if (impulse < 0.0) {
      if (prevReverse) {
        this.pb_1.reverse = false;
        this.pb_1.setTimer(1.0 - this.pb_1.timer);
      }
    } else {
      if (!prevReverse) {
        this.pb_1.reverse = true;
        this.pb_1.setTimer(1.0 - this.pb_1.timer);
      }
    }
  };
  function CameraPosition(position, rotation) {
    this.rc_1 = position;
    this.sc_1 = rotation;
  }
  protoOf(CameraPosition).toString = function () {
    return 'CameraPosition(position=' + this.rc_1 + ', rotation=' + this.sc_1 + ')';
  };
  protoOf(CameraPosition).hashCode = function () {
    var result = this.rc_1.hashCode();
    result = imul(result, 31) + this.sc_1.hashCode() | 0;
    return result;
  };
  protoOf(CameraPosition).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof CameraPosition))
      return false;
    var tmp0_other_with_cast = other instanceof CameraPosition ? other : THROW_CCE();
    if (!this.rc_1.equals(tmp0_other_with_cast.rc_1))
      return false;
    if (!this.sc_1.equals(tmp0_other_with_cast.sc_1))
      return false;
    return true;
  };
  function _get_length__w7ahp7($this) {
    if ($this.wb_1 == null) {
      throw Exception_init_$Create$('position is not set');
    }
    var start = ensureNotNull($this.wb_1).tc_1.rc_1;
    var end = ensureNotNull($this.wb_1).uc_1.rc_1;
    // Inline function 'kotlin.math.sqrt' call
    // Inline function 'kotlin.math.pow' call
    var this_0 = end.x - start.x;
    var tmp = Math.pow(this_0, 2.0);
    // Inline function 'kotlin.math.pow' call
    var this_1 = end.y - start.y;
    var tmp_0 = tmp + Math.pow(this_1, 2.0);
    // Inline function 'kotlin.math.pow' call
    var this_2 = end.z - start.z;
    var x = tmp_0 + Math.pow(this_2, 2.0);
    return Math.sqrt(x);
  }
  function updateMatrix($this) {
    if ($this.wb_1 == null) {
      throw Exception_init_$Create$('position is not set');
    }
    var t = $this.timer;
    if ($this.isSmooth) {
      t = MathUtils_instance.wc(0.0, 1.0, $this.timer);
    }
    var start = $this.reverse ? ensureNotNull($this.wb_1).uc_1 : ensureNotNull($this.wb_1).tc_1;
    var end = $this.reverse ? ensureNotNull($this.wb_1).tc_1 : ensureNotNull($this.wb_1).uc_1;
    $this.bc_1.x = start.rc_1.x + t * (end.rc_1.x - start.rc_1.x);
    $this.bc_1.y = start.rc_1.y + t * (end.rc_1.y - start.rc_1.y);
    $this.bc_1.z = start.rc_1.z + t * (end.rc_1.z - start.rc_1.z);
    $this.cc_1.x = start.sc_1.x + t * (end.sc_1.x - start.sc_1.x);
    $this.cc_1.y = start.sc_1.y + t * (end.sc_1.y - start.sc_1.y);
    $this.cc_1.z = start.sc_1.z + t * (end.sc_1.z - start.sc_1.z);
    Matrix_getInstance().f9($this.matrix, 0);
    Matrix_getInstance().h9($this.matrix, 0, ($this.cc_1.x - 1.5707964) * 57.2958, 1.0, 0.0, 0.0);
    Matrix_getInstance().h9($this.matrix, 0, $this.cc_1.y * 57.2958, 0.0, 0.0, 1.0);
    Matrix_getInstance().h9($this.matrix, 0, $this.cc_1.z * 57.2958, 0.0, 1.0, 0.0);
    Matrix_getInstance().g9($this.matrix, 0, -$this.bc_1.x, -$this.bc_1.y, -$this.bc_1.z);
  }
  function Companion() {
    this.xc_1 = 1.5707964;
  }
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function CameraPositionInterpolator(isSmooth) {
    isSmooth = isSmooth === VOID ? false : isSmooth;
    this.isSmooth = isSmooth;
    this.wb_1 = null;
    this.speed = 0.0;
    this.xb_1 = 0.0;
    this.yb_1 = 3000.0;
    this.zb_1 = 0.0;
    this.timer = 0.0;
    this.ac_1 = 0.0;
    this.reverse = false;
    this.bc_1 = new Vec3(0.0, 0.0, 0.0);
    this.cc_1 = new Vec3(0.0, 0.0, 0.0);
    this.matrix = new Float32Array(16);
  }
  protoOf(CameraPositionInterpolator).yc = function (_set____db54di) {
    this.isSmooth = _set____db54di;
  };
  protoOf(CameraPositionInterpolator).zc = function () {
    return this.isSmooth;
  };
  protoOf(CameraPositionInterpolator).dc = function (_set____db54di) {
    this.speed = _set____db54di;
  };
  protoOf(CameraPositionInterpolator).ec = function () {
    return this.speed;
  };
  protoOf(CameraPositionInterpolator).mc = function () {
    return this.timer;
  };
  protoOf(CameraPositionInterpolator).ad = function (_set____db54di) {
    this.reverse = _set____db54di;
  };
  protoOf(CameraPositionInterpolator).bd = function () {
    return this.reverse;
  };
  protoOf(CameraPositionInterpolator).cd = function () {
    return this.matrix;
  };
  protoOf(CameraPositionInterpolator).dd = function () {
    return this.bc_1;
  };
  protoOf(CameraPositionInterpolator).ed = function () {
    return this.cc_1;
  };
  protoOf(CameraPositionInterpolator).setMinDuration = function (value) {
    this.yb_1 = value;
  };
  protoOf(CameraPositionInterpolator).setPosition = function (value) {
    this.wb_1 = value;
    var tmp = this;
    // Inline function 'kotlin.math.max' call
    var a = _get_length__w7ahp7(this) / this.speed;
    var b = this.yb_1;
    tmp.xb_1 = Math.max(a, b);
  };
  protoOf(CameraPositionInterpolator).setTimer = function (value) {
    this.zb_1 = value;
    this.timer = value;
    updateMatrix(this);
  };
  protoOf(CameraPositionInterpolator).iterate = function (timeNow) {
    if (!(this.ac_1 === 0.0)) {
      var elapsed = timeNow - this.ac_1;
      this.zb_1 = this.zb_1 + elapsed / this.xb_1;
      if (this.zb_1 > 1.0) {
        this.zb_1 = 1.0;
      }
    }
    this.timer = this.zb_1;
    this.ac_1 = timeNow;
    updateMatrix(this);
  };
  protoOf(CameraPositionInterpolator).reset = function () {
    this.ac_1 = 0.0;
    this.zb_1 = 0.0;
    this.timer = 0.0;
    updateMatrix(this);
  };
  function CameraPositionPair(start, end, speedMultiplier) {
    speedMultiplier = speedMultiplier === VOID ? 1.0 : speedMultiplier;
    this.tc_1 = start;
    this.uc_1 = end;
    this.vc_1 = speedMultiplier;
  }
  var CameraState_ANIMATING_instance;
  var CameraState_TRANSITIONING_instance;
  function values_9() {
    return [CameraState_ANIMATING_getInstance(), CameraState_TRANSITIONING_getInstance()];
  }
  function valueOf_9(value) {
    switch (value) {
      case 'ANIMATING':
        return CameraState_ANIMATING_getInstance();
      case 'TRANSITIONING':
        return CameraState_TRANSITIONING_getInstance();
      default:
        CameraState_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var CameraState_entriesInitialized;
  function CameraState_initEntries() {
    if (CameraState_entriesInitialized)
      return Unit_instance;
    CameraState_entriesInitialized = true;
    CameraState_ANIMATING_instance = new CameraState('ANIMATING', 0, 0);
    CameraState_TRANSITIONING_instance = new CameraState('TRANSITIONING', 1, 1);
  }
  function CameraState(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.value = value;
  }
  protoOf(CameraState).k2 = function () {
    return this.value;
  };
  function CameraState_ANIMATING_getInstance() {
    CameraState_initEntries();
    return CameraState_ANIMATING_instance;
  }
  function CameraState_TRANSITIONING_getInstance() {
    CameraState_initEntries();
    return CameraState_TRANSITIONING_instance;
  }
  function Spline_init_$Init$(y, bPrepareEnds, $this) {
    Spline.call($this);
    if (bPrepareEnds) {
      $this.hd_1 = prepareSplineCoords($this, y);
    } else {
      $this.hd_1 = y;
    }
    var n = y.length;
    $this.jd_1 = new Float64Array(n);
    var u = new Float64Array(n);
    var inductionVariable = 1;
    var last = n - 1 | 0;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        $this.jd_1[i] = -1.0 / (4.0 + $this.jd_1[i - 1 | 0]);
        u[i] = (6.0 * (y[i + 1 | 0] - 2.0 * y[i] + y[i - 1 | 0]) - u[i - 1 | 0]) / (4.0 + $this.jd_1[i - 1 | 0]);
      }
       while (inductionVariable < last);
    var inductionVariable_0 = n - 2 | 0;
    if (0 <= inductionVariable_0)
      do {
        var i_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + -1 | 0;
        $this.jd_1[i_0] = $this.jd_1[i_0] * $this.jd_1[i_0 + 1 | 0] + u[i_0];
      }
       while (0 <= inductionVariable_0);
    return $this;
  }
  function Spline_init_$Create$(y, bPrepareEnds) {
    return Spline_init_$Init$(y, bPrepareEnds, objectCreate(protoOf(Spline)));
  }
  function prepareSplineCoords($this, array) {
    array[0] = array[array.length - 4 | 0];
    array[1] = array[array.length - 3 | 0];
    array[array.length - 2 | 0] = array[2];
    array[array.length - 1 | 0] = array[3];
    return array;
  }
  protoOf(Spline).kd = function (i, low, high) {
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.min' call
    var a = Math.min(i, high);
    return Math.max(a, low);
  };
  protoOf(Spline).ld = function (m) {
    var clampedM = this.kd(m, 0.0, 1.0);
    if (clampedM === 0.0)
      return this.hd_1[2];
    if (clampedM === 1.0)
      return this.hd_1[this.hd_1.length - 2 | 0];
    // Inline function 'kotlin.math.floor' call
    var x = clampedM * (this.hd_1.length - 4 | 0) + 2;
    var tmp$ret$0 = Math.floor(x);
    var n = numberToInt(tmp$ret$0);
    var t = clampedM * (this.hd_1.length - 4 | 0) + 2 - n;
    return this.md(n, t);
  };
  protoOf(Spline).md = function (n, t) {
    return t * this.hd_1[n + 1 | 0] - (t - 1.0) * t * ((t - 2.0) * this.jd_1[n] - (t + 1.0) * this.jd_1[n + 1 | 0]) / 6.0 + this.hd_1[n] - t * this.hd_1[n];
  };
  function Spline() {
  }
  function Spline3D_init_$Init$(bPrepareEnds, x, y, z, $this) {
    Spline3D.call($this);
    $this.nd_1 = Spline_init_$Create$(x, bPrepareEnds);
    $this.od_1 = Spline_init_$Create$(y, bPrepareEnds);
    $this.pd_1 = Spline_init_$Create$(z, bPrepareEnds);
    $this.qd_1 = new Vec3();
    $this.rd_1 = new Vec3();
    return $this;
  }
  function Spline3D_init_$Create$(bPrepareEnds, x, y, z) {
    return Spline3D_init_$Init$(bPrepareEnds, x, y, z, objectCreate(protoOf(Spline3D)));
  }
  protoOf(Spline3D).ld = function (m) {
    this.qd_1.x = this.nd_1.ld(m);
    this.qd_1.y = this.od_1.ld(m);
    this.qd_1.z = this.pd_1.ld(m);
    return this.qd_1;
  };
  protoOf(Spline3D).sd = function (a) {
    this.ld(a);
    var headingA = a + 1.0E-4;
    if (headingA > 1.0) {
      headingA = 1 - headingA;
    }
    var tempPointX = this.nd_1.ld(headingA);
    var tempPointY = this.od_1.ld(headingA);
    var tempPointZ = this.pd_1.ld(headingA);
    var tmp = ensureNotNull(this.rd_1);
    // Inline function 'kotlin.math.atan2' call
    var y = this.qd_1.z - tempPointZ;
    var x = this.qd_1.y - tempPointY;
    tmp.x = Math.atan2(y, x) * 180.0 / get_PI();
    var tmp_0 = ensureNotNull(this.rd_1);
    // Inline function 'kotlin.math.atan2' call
    var y_0 = this.qd_1.z - tempPointZ;
    var x_0 = this.qd_1.x - tempPointX;
    tmp_0.y = Math.atan2(y_0, x_0) * 180.0 / get_PI();
    var tmp_1 = ensureNotNull(this.rd_1);
    // Inline function 'kotlin.math.atan2' call
    var y_1 = this.qd_1.y - tempPointY;
    var x_1 = this.qd_1.x - tempPointX;
    tmp_1.z = Math.atan2(y_1, x_1) * 180.0 / get_PI();
    return this.rd_1;
  };
  function Spline3D() {
  }
  var BlurSize_KERNEL_5_instance;
  var BlurSize_KERNEL_4_instance;
  var BlurSize_KERNEL_3_instance;
  var BlurSize_KERNEL_2_instance;
  function values_10() {
    return [BlurSize_KERNEL_5_getInstance(), BlurSize_KERNEL_4_getInstance(), BlurSize_KERNEL_3_getInstance(), BlurSize_KERNEL_2_getInstance()];
  }
  function valueOf_10(value) {
    switch (value) {
      case 'KERNEL_5':
        return BlurSize_KERNEL_5_getInstance();
      case 'KERNEL_4':
        return BlurSize_KERNEL_4_getInstance();
      case 'KERNEL_3':
        return BlurSize_KERNEL_3_getInstance();
      case 'KERNEL_2':
        return BlurSize_KERNEL_2_getInstance();
      default:
        BlurSize_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var BlurSize_entriesInitialized;
  function BlurSize_initEntries() {
    if (BlurSize_entriesInitialized)
      return Unit_instance;
    BlurSize_entriesInitialized = true;
    BlurSize_KERNEL_5_instance = new BlurSize('KERNEL_5', 0);
    BlurSize_KERNEL_4_instance = new BlurSize('KERNEL_4', 1);
    BlurSize_KERNEL_3_instance = new BlurSize('KERNEL_3', 2);
    BlurSize_KERNEL_2_instance = new BlurSize('KERNEL_2', 3);
  }
  function BlurSize(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function BlurredPassCommand() {
    RenderPassCommand_init_$Init$(this);
    this.wd_1 = CommandType_BLURRED_PASS_getInstance();
    this.minSize = 200;
    this.brightness = 1.0;
    this.blurSize = BlurSize_KERNEL_4_getInstance();
    this.additionalBlur = false;
    this.id = 0;
  }
  protoOf(BlurredPassCommand).z9 = function () {
    return this.wd_1;
  };
  protoOf(BlurredPassCommand).xd = function (_set____db54di) {
    this.minSize = _set____db54di;
  };
  protoOf(BlurredPassCommand).yd = function () {
    return this.minSize;
  };
  protoOf(BlurredPassCommand).zd = function (_set____db54di) {
    this.brightness = _set____db54di;
  };
  protoOf(BlurredPassCommand).ae = function () {
    return this.brightness;
  };
  protoOf(BlurredPassCommand).be = function (_set____db54di) {
    this.blurSize = _set____db54di;
  };
  protoOf(BlurredPassCommand).ce = function () {
    return this.blurSize;
  };
  protoOf(BlurredPassCommand).de = function (_set____db54di) {
    this.additionalBlur = _set____db54di;
  };
  protoOf(BlurredPassCommand).ee = function () {
    return this.additionalBlur;
  };
  protoOf(BlurredPassCommand).b7 = function (_set____db54di) {
    this.id = _set____db54di;
  };
  protoOf(BlurredPassCommand).c7 = function () {
    return this.id;
  };
  function DrawBlurredCommand() {
    Command.call(this);
    this.fe_1 = CommandType_DRAW_BLURRED_getInstance();
    this.blending = get_BLENDING_NONE();
    this.id = 0;
  }
  protoOf(DrawBlurredCommand).z9 = function () {
    return this.fe_1;
  };
  protoOf(DrawBlurredCommand).ge = function (_set____db54di) {
    this.blending = _set____db54di;
  };
  protoOf(DrawBlurredCommand).he = function () {
    return this.blending;
  };
  protoOf(DrawBlurredCommand).b7 = function (_set____db54di) {
    this.id = _set____db54di;
  };
  protoOf(DrawBlurredCommand).c7 = function () {
    return this.id;
  };
  function BlurSize_KERNEL_5_getInstance() {
    BlurSize_initEntries();
    return BlurSize_KERNEL_5_instance;
  }
  function BlurSize_KERNEL_4_getInstance() {
    BlurSize_initEntries();
    return BlurSize_KERNEL_4_instance;
  }
  function BlurSize_KERNEL_3_getInstance() {
    BlurSize_initEntries();
    return BlurSize_KERNEL_3_instance;
  }
  function BlurSize_KERNEL_2_getInstance() {
    BlurSize_initEntries();
    return BlurSize_KERNEL_2_instance;
  }
  function ClearColorCommand() {
    Command.call(this);
    this.ie_1 = CommandType_CLEAR_COLOR_getInstance();
    this.color = new Vec4(0.0, 0.0, 0.0, 0.0);
  }
  protoOf(ClearColorCommand).z9 = function () {
    return this.ie_1;
  };
  protoOf(ClearColorCommand).je = function (_set____db54di) {
    this.color = _set____db54di;
  };
  protoOf(ClearColorCommand).ke = function () {
    return this.color;
  };
  var ClearCommandClearType_COLOR_instance;
  var ClearCommandClearType_DEPTH_instance;
  var ClearCommandClearType_COLOR_AND_DEPTH_instance;
  function values_11() {
    return [ClearCommandClearType_COLOR_getInstance(), ClearCommandClearType_DEPTH_getInstance(), ClearCommandClearType_COLOR_AND_DEPTH_getInstance()];
  }
  function valueOf_11(value) {
    switch (value) {
      case 'COLOR':
        return ClearCommandClearType_COLOR_getInstance();
      case 'DEPTH':
        return ClearCommandClearType_DEPTH_getInstance();
      case 'COLOR_AND_DEPTH':
        return ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
      default:
        ClearCommandClearType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var ClearCommandClearType_entriesInitialized;
  function ClearCommandClearType_initEntries() {
    if (ClearCommandClearType_entriesInitialized)
      return Unit_instance;
    ClearCommandClearType_entriesInitialized = true;
    ClearCommandClearType_COLOR_instance = new ClearCommandClearType('COLOR', 0);
    ClearCommandClearType_DEPTH_instance = new ClearCommandClearType('DEPTH', 1);
    ClearCommandClearType_COLOR_AND_DEPTH_instance = new ClearCommandClearType('COLOR_AND_DEPTH', 2);
  }
  function ClearCommandClearType(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function ClearCommand() {
    Command.call(this);
    this.ne_1 = CommandType_CLEAR_getInstance();
    this.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
  }
  protoOf(ClearCommand).z9 = function () {
    return this.ne_1;
  };
  protoOf(ClearCommand).oe = function (_set____db54di) {
    this.clearType = _set____db54di;
  };
  protoOf(ClearCommand).pe = function () {
    return this.clearType;
  };
  function ClearCommandClearType_COLOR_getInstance() {
    ClearCommandClearType_initEntries();
    return ClearCommandClearType_COLOR_instance;
  }
  function ClearCommandClearType_DEPTH_getInstance() {
    ClearCommandClearType_initEntries();
    return ClearCommandClearType_DEPTH_instance;
  }
  function ClearCommandClearType_COLOR_AND_DEPTH_getInstance() {
    ClearCommandClearType_initEntries();
    return ClearCommandClearType_COLOR_AND_DEPTH_instance;
  }
  function Command() {
    this.enabled = true;
    this.name = '';
  }
  protoOf(Command).e6 = function (_set____db54di) {
    this.enabled = _set____db54di;
  };
  protoOf(Command).f6 = function () {
    return this.enabled;
  };
  protoOf(Command).a7 = function (_set____db54di) {
    this.name = _set____db54di;
  };
  protoOf(Command).c4 = function () {
    return this.name;
  };
  var CommandType_NOOP_instance;
  var CommandType_GROUP_instance;
  var CommandType_CLEAR_COLOR_instance;
  var CommandType_CLEAR_instance;
  var CommandType_VIGNETTE_instance;
  var CommandType_DRAW_MESH_instance;
  var CommandType_BLURRED_PASS_instance;
  var CommandType_DRAW_BLURRED_instance;
  var CommandType_RENDER_PASS_instance;
  var CommandType_MAIN_PASS_instance;
  var CommandType_CUSTOM_instance;
  function values_12() {
    return [CommandType_NOOP_getInstance(), CommandType_GROUP_getInstance(), CommandType_CLEAR_COLOR_getInstance(), CommandType_CLEAR_getInstance(), CommandType_VIGNETTE_getInstance(), CommandType_DRAW_MESH_getInstance(), CommandType_BLURRED_PASS_getInstance(), CommandType_DRAW_BLURRED_getInstance(), CommandType_RENDER_PASS_getInstance(), CommandType_MAIN_PASS_getInstance(), CommandType_CUSTOM_getInstance()];
  }
  function valueOf_12(value) {
    switch (value) {
      case 'NOOP':
        return CommandType_NOOP_getInstance();
      case 'GROUP':
        return CommandType_GROUP_getInstance();
      case 'CLEAR_COLOR':
        return CommandType_CLEAR_COLOR_getInstance();
      case 'CLEAR':
        return CommandType_CLEAR_getInstance();
      case 'VIGNETTE':
        return CommandType_VIGNETTE_getInstance();
      case 'DRAW_MESH':
        return CommandType_DRAW_MESH_getInstance();
      case 'BLURRED_PASS':
        return CommandType_BLURRED_PASS_getInstance();
      case 'DRAW_BLURRED':
        return CommandType_DRAW_BLURRED_getInstance();
      case 'RENDER_PASS':
        return CommandType_RENDER_PASS_getInstance();
      case 'MAIN_PASS':
        return CommandType_MAIN_PASS_getInstance();
      case 'CUSTOM':
        return CommandType_CUSTOM_getInstance();
      default:
        CommandType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var CommandType_entriesInitialized;
  function CommandType_initEntries() {
    if (CommandType_entriesInitialized)
      return Unit_instance;
    CommandType_entriesInitialized = true;
    CommandType_NOOP_instance = new CommandType('NOOP', 0, 0);
    CommandType_GROUP_instance = new CommandType('GROUP', 1, 1);
    CommandType_CLEAR_COLOR_instance = new CommandType('CLEAR_COLOR', 2, 2);
    CommandType_CLEAR_instance = new CommandType('CLEAR', 3, 3);
    CommandType_VIGNETTE_instance = new CommandType('VIGNETTE', 4, 4);
    CommandType_DRAW_MESH_instance = new CommandType('DRAW_MESH', 5, 5);
    CommandType_BLURRED_PASS_instance = new CommandType('BLURRED_PASS', 6, 6);
    CommandType_DRAW_BLURRED_instance = new CommandType('DRAW_BLURRED', 7, 7);
    CommandType_RENDER_PASS_instance = new CommandType('RENDER_PASS', 8, 8);
    CommandType_MAIN_PASS_instance = new CommandType('MAIN_PASS', 9, 9);
    CommandType_CUSTOM_instance = new CommandType('CUSTOM', 10, 10);
  }
  function CommandType(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.value = value;
  }
  protoOf(CommandType).k2 = function () {
    return this.value;
  };
  function CommandType_NOOP_getInstance() {
    CommandType_initEntries();
    return CommandType_NOOP_instance;
  }
  function CommandType_GROUP_getInstance() {
    CommandType_initEntries();
    return CommandType_GROUP_instance;
  }
  function CommandType_CLEAR_COLOR_getInstance() {
    CommandType_initEntries();
    return CommandType_CLEAR_COLOR_instance;
  }
  function CommandType_CLEAR_getInstance() {
    CommandType_initEntries();
    return CommandType_CLEAR_instance;
  }
  function CommandType_VIGNETTE_getInstance() {
    CommandType_initEntries();
    return CommandType_VIGNETTE_instance;
  }
  function CommandType_DRAW_MESH_getInstance() {
    CommandType_initEntries();
    return CommandType_DRAW_MESH_instance;
  }
  function CommandType_BLURRED_PASS_getInstance() {
    CommandType_initEntries();
    return CommandType_BLURRED_PASS_instance;
  }
  function CommandType_DRAW_BLURRED_getInstance() {
    CommandType_initEntries();
    return CommandType_DRAW_BLURRED_instance;
  }
  function CommandType_RENDER_PASS_getInstance() {
    CommandType_initEntries();
    return CommandType_RENDER_PASS_instance;
  }
  function CommandType_MAIN_PASS_getInstance() {
    CommandType_initEntries();
    return CommandType_MAIN_PASS_instance;
  }
  function CommandType_CUSTOM_getInstance() {
    CommandType_initEntries();
    return CommandType_CUSTOM_instance;
  }
  function DrawMeshState(shader, blending, depthMode, culling, vertexAttributes) {
    this.shader = shader;
    this.blending = blending;
    this.depthMode = depthMode;
    this.culling = culling;
    this.vertexAttributes = vertexAttributes;
  }
  protoOf(DrawMeshState).se = function (_set____db54di) {
    this.shader = _set____db54di;
  };
  protoOf(DrawMeshState).te = function () {
    return this.shader;
  };
  protoOf(DrawMeshState).ge = function (_set____db54di) {
    this.blending = _set____db54di;
  };
  protoOf(DrawMeshState).he = function () {
    return this.blending;
  };
  protoOf(DrawMeshState).ue = function (_set____db54di) {
    this.depthMode = _set____db54di;
  };
  protoOf(DrawMeshState).ve = function () {
    return this.depthMode;
  };
  protoOf(DrawMeshState).we = function (_set____db54di) {
    this.culling = _set____db54di;
  };
  protoOf(DrawMeshState).xe = function () {
    return this.culling;
  };
  protoOf(DrawMeshState).ye = function (_set____db54di) {
    this.vertexAttributes = _set____db54di;
  };
  protoOf(DrawMeshState).ze = function () {
    return this.vertexAttributes;
  };
  var PrimitiveType_TRIANGLES_instance;
  var PrimitiveType_TRIANGLE_STRIP_instance;
  var PrimitiveType_POINTS_instance;
  function values_13() {
    return [PrimitiveType_TRIANGLES_getInstance(), PrimitiveType_TRIANGLE_STRIP_getInstance(), PrimitiveType_POINTS_getInstance()];
  }
  function valueOf_13(value) {
    switch (value) {
      case 'TRIANGLES':
        return PrimitiveType_TRIANGLES_getInstance();
      case 'TRIANGLE_STRIP':
        return PrimitiveType_TRIANGLE_STRIP_getInstance();
      case 'POINTS':
        return PrimitiveType_POINTS_getInstance();
      default:
        PrimitiveType_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var PrimitiveType_entriesInitialized;
  function PrimitiveType_initEntries() {
    if (PrimitiveType_entriesInitialized)
      return Unit_instance;
    PrimitiveType_entriesInitialized = true;
    PrimitiveType_TRIANGLES_instance = new PrimitiveType('TRIANGLES', 0);
    PrimitiveType_TRIANGLE_STRIP_instance = new PrimitiveType('TRIANGLE_STRIP', 1);
    PrimitiveType_POINTS_instance = new PrimitiveType('POINTS', 2);
  }
  function PrimitiveType(name, ordinal, value) {
    Enum.call(this, name, ordinal);
  }
  function DrawMeshCommand(mesh, uniforms, state, primitiveType, primitiveCount) {
    primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
    primitiveCount = primitiveCount === VOID ? -1 : primitiveCount;
    Command.call(this);
    this.mesh = mesh;
    this.uniforms = uniforms;
    this.state = state;
    this.primitiveType = primitiveType;
    this.primitiveCount = primitiveCount;
    this.p9_1 = CommandType_DRAW_MESH_getInstance();
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.hints = ArrayList_init_$Create$();
  }
  protoOf(DrawMeshCommand).cf = function (_set____db54di) {
    this.mesh = _set____db54di;
  };
  protoOf(DrawMeshCommand).df = function () {
    return this.mesh;
  };
  protoOf(DrawMeshCommand).ef = function (_set____db54di) {
    this.uniforms = _set____db54di;
  };
  protoOf(DrawMeshCommand).ff = function () {
    return this.uniforms;
  };
  protoOf(DrawMeshCommand).gf = function (_set____db54di) {
    this.state = _set____db54di;
  };
  protoOf(DrawMeshCommand).nc = function () {
    return this.state;
  };
  protoOf(DrawMeshCommand).hf = function (_set____db54di) {
    this.primitiveType = _set____db54di;
  };
  protoOf(DrawMeshCommand).if = function () {
    return this.primitiveType;
  };
  protoOf(DrawMeshCommand).jf = function (_set____db54di) {
    this.primitiveCount = _set____db54di;
  };
  protoOf(DrawMeshCommand).kf = function () {
    return this.primitiveCount;
  };
  protoOf(DrawMeshCommand).z9 = function () {
    return this.p9_1;
  };
  protoOf(DrawMeshCommand).lf = function (_set____db54di) {
    this.hints = _set____db54di;
  };
  protoOf(DrawMeshCommand).mf = function () {
    return this.hints;
  };
  function PrimitiveType_TRIANGLES_getInstance() {
    PrimitiveType_initEntries();
    return PrimitiveType_TRIANGLES_instance;
  }
  function PrimitiveType_TRIANGLE_STRIP_getInstance() {
    PrimitiveType_initEntries();
    return PrimitiveType_TRIANGLE_STRIP_instance;
  }
  function PrimitiveType_POINTS_getInstance() {
    PrimitiveType_initEntries();
    return PrimitiveType_POINTS_instance;
  }
  function DrawTransformedMeshCommand(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType) {
    indexUniformMvp = indexUniformMvp === VOID ? 0 : indexUniformMvp;
    indexUniformModel = indexUniformModel === VOID ? -1 : indexUniformModel;
    indexUniformView = indexUniformView === VOID ? -1 : indexUniformView;
    indexUniformProjection = indexUniformProjection === VOID ? -1 : indexUniformProjection;
    primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
    DrawMeshCommand.call(this, mesh, uniforms, state, primitiveType);
    this.transform = transform;
    this.indexUniformMvp = indexUniformMvp;
    this.indexUniformModel = indexUniformModel;
    this.indexUniformView = indexUniformView;
    this.indexUniformProjection = indexUniformProjection;
  }
  protoOf(DrawTransformedMeshCommand).nf = function (_set____db54di) {
    this.transform = _set____db54di;
  };
  protoOf(DrawTransformedMeshCommand).of = function () {
    return this.transform;
  };
  protoOf(DrawTransformedMeshCommand).pf = function (_set____db54di) {
    this.indexUniformMvp = _set____db54di;
  };
  protoOf(DrawTransformedMeshCommand).qf = function () {
    return this.indexUniformMvp;
  };
  protoOf(DrawTransformedMeshCommand).rf = function (_set____db54di) {
    this.indexUniformModel = _set____db54di;
  };
  protoOf(DrawTransformedMeshCommand).sf = function () {
    return this.indexUniformModel;
  };
  protoOf(DrawTransformedMeshCommand).tf = function (_set____db54di) {
    this.indexUniformView = _set____db54di;
  };
  protoOf(DrawTransformedMeshCommand).uf = function () {
    return this.indexUniformView;
  };
  protoOf(DrawTransformedMeshCommand).vf = function (_set____db54di) {
    this.indexUniformProjection = _set____db54di;
  };
  protoOf(DrawTransformedMeshCommand).wf = function () {
    return this.indexUniformProjection;
  };
  function DrawStaticMeshCommand_init_$Init$(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType, $this) {
    indexUniformMvp = indexUniformMvp === VOID ? 0 : indexUniformMvp;
    indexUniformModel = indexUniformModel === VOID ? -1 : indexUniformModel;
    indexUniformView = indexUniformView === VOID ? -1 : indexUniformView;
    indexUniformProjection = indexUniformProjection === VOID ? -1 : indexUniformProjection;
    primitiveType = primitiveType === VOID ? PrimitiveType_TRIANGLES_getInstance() : primitiveType;
    DrawTransformedMeshCommand.call($this, mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType);
    DrawStaticMeshCommand.call($this);
    Matrix_getInstance().f9($this.modelMatrix, 0);
    Matrix_getInstance().g9($this.modelMatrix, 0, transform.k9_1.x, transform.k9_1.y, transform.k9_1.z);
    Matrix_getInstance().h9($this.modelMatrix, 0, transform.l9_1.x, 1.0, 0.0, 0.0);
    Matrix_getInstance().h9($this.modelMatrix, 0, transform.l9_1.y, 0.0, 1.0, 0.0);
    Matrix_getInstance().h9($this.modelMatrix, 0, transform.l9_1.z, 0.0, 0.0, 1.0);
    Matrix_getInstance().i9($this.modelMatrix, 0, transform.m9_1.x, transform.m9_1.y, transform.m9_1.z);
    return $this;
  }
  function DrawStaticMeshCommandConstructor(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType) {
    return DrawStaticMeshCommand_init_$Init$(mesh, uniforms, state, transform, indexUniformMvp, indexUniformModel, indexUniformView, indexUniformProjection, primitiveType, objectCreate(protoOf(DrawStaticMeshCommand)));
  }
  protoOf(DrawStaticMeshCommand).xf = function () {
    return this.modelMatrix;
  };
  function DrawStaticMeshCommand() {
    this.modelMatrix = new Float32Array(16);
  }
  function AffineTranformation(translation, rotation, scale) {
    translation = translation === VOID ? new Vec3(0.0, 0.0, 0.0) : translation;
    rotation = rotation === VOID ? new Vec3(0.0, 0.0, 0.0) : rotation;
    scale = scale === VOID ? new Vec3(1.0, 1.0, 1.0) : scale;
    this.k9_1 = translation;
    this.l9_1 = rotation;
    this.m9_1 = scale;
  }
  protoOf(AffineTranformation).toString = function () {
    return 'AffineTranformation(translation=' + this.k9_1 + ', rotation=' + this.l9_1 + ', scale=' + this.m9_1 + ')';
  };
  protoOf(AffineTranformation).hashCode = function () {
    var result = this.k9_1.hashCode();
    result = imul(result, 31) + this.l9_1.hashCode() | 0;
    result = imul(result, 31) + this.m9_1.hashCode() | 0;
    return result;
  };
  protoOf(AffineTranformation).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof AffineTranformation))
      return false;
    var tmp0_other_with_cast = other instanceof AffineTranformation ? other : THROW_CCE();
    if (!this.k9_1.equals(tmp0_other_with_cast.k9_1))
      return false;
    if (!this.l9_1.equals(tmp0_other_with_cast.l9_1))
      return false;
    if (!this.m9_1.equals(tmp0_other_with_cast.m9_1))
      return false;
    return true;
  };
  function GroupCommand_init_$Init$(enabled, commands, $this) {
    GroupCommand.call($this);
    $this.enabled = enabled;
    $this.commands = toMutableList(commands);
    return $this;
  }
  function GroupCommandArr(enabled, commands) {
    return GroupCommand_init_$Init$(enabled, commands, objectCreate(protoOf(GroupCommand)));
  }
  function GroupCommand() {
    Command.call(this);
    var tmp = this;
    // Inline function 'kotlin.collections.mutableListOf' call
    tmp.commands = ArrayList_init_$Create$();
  }
  protoOf(GroupCommand).z9 = function () {
    return CommandType_GROUP_getInstance();
  };
  protoOf(GroupCommand).w8 = function (_set____db54di) {
    this.commands = _set____db54di;
  };
  protoOf(GroupCommand).x8 = function () {
    return this.commands;
  };
  function get_HINT_VRS_NONE() {
    _init_properties_Hints_kt__d0aug6();
    return HINT_VRS_NONE;
  }
  var HINT_VRS_NONE;
  function get_HINT_VRS_2X2() {
    _init_properties_Hints_kt__d0aug6();
    return HINT_VRS_2X2;
  }
  var HINT_VRS_2X2;
  function get_HINT_VRS_4X4() {
    _init_properties_Hints_kt__d0aug6();
    return HINT_VRS_4X4;
  }
  var HINT_VRS_4X4;
  function Hint() {
  }
  var ShadingRate_SHADING_RATE_1X1_instance;
  var ShadingRate_SHADING_RATE_1X2_instance;
  var ShadingRate_SHADING_RATE_2X1_instance;
  var ShadingRate_SHADING_RATE_2X2_instance;
  var ShadingRate_SHADING_RATE_4X2_instance;
  var ShadingRate_SHADING_RATE_4X4_instance;
  function values_14() {
    return [ShadingRate_SHADING_RATE_1X1_getInstance(), ShadingRate_SHADING_RATE_1X2_getInstance(), ShadingRate_SHADING_RATE_2X1_getInstance(), ShadingRate_SHADING_RATE_2X2_getInstance(), ShadingRate_SHADING_RATE_4X2_getInstance(), ShadingRate_SHADING_RATE_4X4_getInstance()];
  }
  function valueOf_14(value) {
    switch (value) {
      case 'SHADING_RATE_1X1':
        return ShadingRate_SHADING_RATE_1X1_getInstance();
      case 'SHADING_RATE_1X2':
        return ShadingRate_SHADING_RATE_1X2_getInstance();
      case 'SHADING_RATE_2X1':
        return ShadingRate_SHADING_RATE_2X1_getInstance();
      case 'SHADING_RATE_2X2':
        return ShadingRate_SHADING_RATE_2X2_getInstance();
      case 'SHADING_RATE_4X2':
        return ShadingRate_SHADING_RATE_4X2_getInstance();
      case 'SHADING_RATE_4X4':
        return ShadingRate_SHADING_RATE_4X4_getInstance();
      default:
        ShadingRate_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var ShadingRate_entriesInitialized;
  function ShadingRate_initEntries() {
    if (ShadingRate_entriesInitialized)
      return Unit_instance;
    ShadingRate_entriesInitialized = true;
    ShadingRate_SHADING_RATE_1X1_instance = new ShadingRate('SHADING_RATE_1X1', 0, 38566);
    ShadingRate_SHADING_RATE_1X2_instance = new ShadingRate('SHADING_RATE_1X2', 1, 38567);
    ShadingRate_SHADING_RATE_2X1_instance = new ShadingRate('SHADING_RATE_2X1', 2, 38568);
    ShadingRate_SHADING_RATE_2X2_instance = new ShadingRate('SHADING_RATE_2X2', 3, 38569);
    ShadingRate_SHADING_RATE_4X2_instance = new ShadingRate('SHADING_RATE_4X2', 4, 38572);
    ShadingRate_SHADING_RATE_4X4_instance = new ShadingRate('SHADING_RATE_4X4', 5, 38574);
  }
  function ShadingRate(name, ordinal, value) {
    Enum.call(this, name, ordinal);
    this.value = value;
  }
  protoOf(ShadingRate).k2 = function () {
    return this.value;
  };
  function VrsHint(shadingRate) {
    Hint.call(this);
    this.shadingRate = shadingRate;
  }
  protoOf(VrsHint).ag = function () {
    return this.shadingRate;
  };
  function ShadingRate_SHADING_RATE_1X1_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_1X1_instance;
  }
  function ShadingRate_SHADING_RATE_1X2_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_1X2_instance;
  }
  function ShadingRate_SHADING_RATE_2X1_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_2X1_instance;
  }
  function ShadingRate_SHADING_RATE_2X2_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_2X2_instance;
  }
  function ShadingRate_SHADING_RATE_4X2_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_4X2_instance;
  }
  function ShadingRate_SHADING_RATE_4X4_getInstance() {
    ShadingRate_initEntries();
    return ShadingRate_SHADING_RATE_4X4_instance;
  }
  var properties_initialized_Hints_kt_2kk7lo;
  function _init_properties_Hints_kt__d0aug6() {
    if (!properties_initialized_Hints_kt_2kk7lo) {
      properties_initialized_Hints_kt_2kk7lo = true;
      HINT_VRS_NONE = new VrsHint(ShadingRate_SHADING_RATE_1X1_getInstance());
      new VrsHint(ShadingRate_SHADING_RATE_1X2_getInstance());
      new VrsHint(ShadingRate_SHADING_RATE_2X1_getInstance());
      HINT_VRS_2X2 = new VrsHint(ShadingRate_SHADING_RATE_2X2_getInstance());
      new VrsHint(ShadingRate_SHADING_RATE_4X2_getInstance());
      HINT_VRS_4X4 = new VrsHint(ShadingRate_SHADING_RATE_4X4_getInstance());
    }
  }
  function MainPassCommand_init_$Init$($this) {
    RenderPassCommand_init_$Init$($this);
    MainPassCommand.call($this);
    return $this;
  }
  function MainPassCommandConstructor() {
    return MainPassCommand_init_$Init$(objectCreate(protoOf(MainPassCommand)));
  }
  function MainPassCommand_init_$Init$_0(enabled, commands, $this) {
    RenderPassCommand_init_$Init$_0(enabled, commands.slice(), $this);
    MainPassCommand.call($this);
    return $this;
  }
  function MainPassCommandArr(enabled, commands) {
    return MainPassCommand_init_$Init$_0(enabled, commands, objectCreate(protoOf(MainPassCommand)));
  }
  protoOf(MainPassCommand).z9 = function () {
    return this.cg_1;
  };
  function MainPassCommand() {
    this.cg_1 = CommandType_MAIN_PASS_getInstance();
  }
  function NoopCommand() {
    Command.call(this);
  }
  protoOf(NoopCommand).z9 = function () {
    return CommandType_NOOP_getInstance();
  };
  function RenderPassCommand_init_$Init$($this) {
    GroupCommand.call($this);
    RenderPassCommand.call($this);
    return $this;
  }
  function RenderPassCommandConstructor() {
    return RenderPassCommand_init_$Init$(objectCreate(protoOf(RenderPassCommand)));
  }
  function RenderPassCommand_init_$Init$_0(enabled, commands, $this) {
    GroupCommand_init_$Init$(enabled, commands.slice(), $this);
    RenderPassCommand.call($this);
    return $this;
  }
  function RenderPassCommandArr(enabled, commands) {
    return RenderPassCommand_init_$Init$_0(enabled, commands, objectCreate(protoOf(RenderPassCommand)));
  }
  protoOf(RenderPassCommand).z9 = function () {
    return this.dg_1;
  };
  function RenderPassCommand() {
    this.dg_1 = CommandType_RENDER_PASS_getInstance();
  }
  function VignetteCommand() {
    Command.call(this);
    this.eg_1 = CommandType_VIGNETTE_getInstance();
    this.color0 = new Vec4(0.0, 0.0, 0.0, 1.0);
    this.color1 = new Vec4(0.0, 0.0, 0.0, 1.0);
  }
  protoOf(VignetteCommand).z9 = function () {
    return this.eg_1;
  };
  protoOf(VignetteCommand).fg = function (_set____db54di) {
    this.color0 = _set____db54di;
  };
  protoOf(VignetteCommand).gg = function () {
    return this.color0;
  };
  protoOf(VignetteCommand).hg = function (_set____db54di) {
    this.color1 = _set____db54di;
  };
  protoOf(VignetteCommand).ig = function () {
    return this.color1;
  };
  var ColorMode_Normal_instance;
  var ColorMode_Grayscale_instance;
  var ColorMode_Sepia_instance;
  var ColorMode_HighContrast_instance;
  var ColorMode_LowContrast_instance;
  var ColorMode_BlackAndWhite_instance;
  var ColorMode_IsolatedColor_instance;
  var ColorMode_Crosshatch_instance;
  var ColorMode_LimitedColors_instance;
  function values_15() {
    return [ColorMode_Normal_getInstance(), ColorMode_Grayscale_getInstance(), ColorMode_Sepia_getInstance(), ColorMode_HighContrast_getInstance(), ColorMode_LowContrast_getInstance(), ColorMode_BlackAndWhite_getInstance(), ColorMode_IsolatedColor_getInstance(), ColorMode_Crosshatch_getInstance(), ColorMode_LimitedColors_getInstance()];
  }
  function valueOf_15(value) {
    switch (value) {
      case 'Normal':
        return ColorMode_Normal_getInstance();
      case 'Grayscale':
        return ColorMode_Grayscale_getInstance();
      case 'Sepia':
        return ColorMode_Sepia_getInstance();
      case 'HighContrast':
        return ColorMode_HighContrast_getInstance();
      case 'LowContrast':
        return ColorMode_LowContrast_getInstance();
      case 'BlackAndWhite':
        return ColorMode_BlackAndWhite_getInstance();
      case 'IsolatedColor':
        return ColorMode_IsolatedColor_getInstance();
      case 'Crosshatch':
        return ColorMode_Crosshatch_getInstance();
      case 'LimitedColors':
        return ColorMode_LimitedColors_getInstance();
      default:
        ColorMode_initEntries();
        THROW_IAE('No enum constant value.');
        break;
    }
  }
  var ColorMode_entriesInitialized;
  function ColorMode_initEntries() {
    if (ColorMode_entriesInitialized)
      return Unit_instance;
    ColorMode_entriesInitialized = true;
    ColorMode_Normal_instance = new ColorMode('Normal', 0);
    ColorMode_Grayscale_instance = new ColorMode('Grayscale', 1);
    ColorMode_Sepia_instance = new ColorMode('Sepia', 2);
    ColorMode_HighContrast_instance = new ColorMode('HighContrast', 3);
    ColorMode_LowContrast_instance = new ColorMode('LowContrast', 4);
    ColorMode_BlackAndWhite_instance = new ColorMode('BlackAndWhite', 5);
    ColorMode_IsolatedColor_instance = new ColorMode('IsolatedColor', 6);
    ColorMode_Crosshatch_instance = new ColorMode('Crosshatch', 7);
    ColorMode_LimitedColors_instance = new ColorMode('LimitedColors', 8);
  }
  function ColorMode(name, ordinal) {
    Enum.call(this, name, ordinal);
  }
  function ColorMode_Normal_getInstance() {
    ColorMode_initEntries();
    return ColorMode_Normal_instance;
  }
  function ColorMode_Grayscale_getInstance() {
    ColorMode_initEntries();
    return ColorMode_Grayscale_instance;
  }
  function ColorMode_Sepia_getInstance() {
    ColorMode_initEntries();
    return ColorMode_Sepia_instance;
  }
  function ColorMode_HighContrast_getInstance() {
    ColorMode_initEntries();
    return ColorMode_HighContrast_instance;
  }
  function ColorMode_LowContrast_getInstance() {
    ColorMode_initEntries();
    return ColorMode_LowContrast_instance;
  }
  function ColorMode_BlackAndWhite_getInstance() {
    ColorMode_initEntries();
    return ColorMode_BlackAndWhite_instance;
  }
  function ColorMode_IsolatedColor_getInstance() {
    ColorMode_initEntries();
    return ColorMode_IsolatedColor_instance;
  }
  function ColorMode_Crosshatch_getInstance() {
    ColorMode_initEntries();
    return ColorMode_Crosshatch_instance;
  }
  function ColorMode_LimitedColors_getInstance() {
    ColorMode_initEntries();
    return ColorMode_LimitedColors_instance;
  }
  function MathUtils() {
  }
  protoOf(MathUtils).lg = function (i, low, high) {
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.min' call
    var a = Math.min(i, high);
    return Math.max(a, low);
  };
  protoOf(MathUtils).wc = function (edge0, edge1, x) {
    var t = this.lg((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  };
  protoOf(MathUtils).qc = function (length, current) {
    return ((current + 1 | 0) + numberToInt(Default_getInstance().o5() * (length - 2 | 0)) | 0) % length | 0;
  };
  protoOf(MathUtils).mg = function (rad) {
    return rad * 57.29578;
  };
  var MathUtils_instance;
  function Matrix() {
    Matrix_instance = this;
    this.j7_1 = new Float32Array(32);
    this.k7_1 = new Float32Array(16);
    this.l7_1 = new Float32Array(16);
    this.m7_1 = new Float32Array(16);
    this.n7_1 = new Float32Array(4);
    this.o7_1 = new Float32Array(16);
    this.p7_1 = new Float32Array(4);
  }
  protoOf(Matrix).j9 = function (result, resultOffset, lhs, lhsOffset, rhs, rhsOffset) {
    this.ng(result, resultOffset, this.k7_1, 0, 16);
    this.ng(lhs, lhsOffset, this.l7_1, 0, 16);
    this.ng(rhs, rhsOffset, this.m7_1, 0, 16);
    this.og(this.k7_1, this.l7_1, this.m7_1);
    this.ng(this.k7_1, 0, result, resultOffset, 16);
  };
  protoOf(Matrix).ng = function (src, srcPos, dest, destPos, length) {
    // Inline function 'kotlin.collections.copyInto' call
    var endIndex = srcPos + length | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp = src;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    arrayCopy(tmp, dest, destPos, srcPos, endIndex);
  };
  protoOf(Matrix).pg = function (_i, _j) {
    return _j + imul(4, _i) | 0;
  };
  protoOf(Matrix).og = function (r, lhs, rhs) {
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var rhs_i0 = rhs[this.pg(i, 0)];
        var ri0 = lhs[0] * rhs_i0;
        var ri1 = lhs[1] * rhs_i0;
        var ri2 = lhs[2] * rhs_i0;
        var ri3 = lhs[3] * rhs_i0;
        var inductionVariable_0 = 1;
        if (inductionVariable_0 <= 3)
          do {
            var j = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var rhs_ij = rhs[this.pg(i, j)];
            ri0 = ri0 + lhs[this.pg(j, 0)] * rhs_ij;
            ri1 = ri1 + lhs[this.pg(j, 1)] * rhs_ij;
            ri2 = ri2 + lhs[this.pg(j, 2)] * rhs_ij;
            ri3 = ri3 + lhs[this.pg(j, 3)] * rhs_ij;
          }
           while (inductionVariable_0 <= 3);
        r[this.pg(i, 0)] = ri0;
        r[this.pg(i, 1)] = ri1;
        r[this.pg(i, 2)] = ri2;
        r[this.pg(i, 3)] = ri3;
      }
       while (inductionVariable <= 3);
  };
  protoOf(Matrix).q7 = function (m, offset, left, right, bottom, top, near, far) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(left === right)) {
      // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
      var message = 'left == right';
      throw IllegalArgumentException_init_$Create$(toString(message));
    }
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(top === bottom)) {
      // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
      var message_0 = 'top == bottom';
      throw IllegalArgumentException_init_$Create$(toString(message_0));
    }
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(near === far)) {
      // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
      var message_1 = 'near == far';
      throw IllegalArgumentException_init_$Create$(toString(message_1));
    }
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(near <= 0.0)) {
      // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
      var message_2 = 'near <= 0.0f';
      throw IllegalArgumentException_init_$Create$(toString(message_2));
    }
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(far <= 0.0)) {
      // Inline function 'org.androidworks.engine.math.Matrix.frustumM.<anonymous>' call
      var message_3 = 'far <= 0.0f';
      throw IllegalArgumentException_init_$Create$(toString(message_3));
    }
    var r_width = 1.0 / (right - left);
    var r_height = 1.0 / (top - bottom);
    var r_depth = 1.0 / (near - far);
    var x = 2.0 * (near * r_width);
    var y = 2.0 * (near * r_height);
    var A = (right + left) * r_width;
    var B = (top + bottom) * r_height;
    var C = (far + near) * r_depth;
    var D = 2.0 * (far * near * r_depth);
    m[offset + 0 | 0] = x;
    m[offset + 5 | 0] = y;
    m[offset + 8 | 0] = A;
    m[offset + 9 | 0] = B;
    m[offset + 10 | 0] = C;
    m[offset + 14 | 0] = D;
    m[offset + 11 | 0] = -1.0;
    m[offset + 1 | 0] = 0.0;
    m[offset + 2 | 0] = 0.0;
    m[offset + 3 | 0] = 0.0;
    m[offset + 4 | 0] = 0.0;
    m[offset + 6 | 0] = 0.0;
    m[offset + 7 | 0] = 0.0;
    m[offset + 12 | 0] = 0.0;
    m[offset + 13 | 0] = 0.0;
    m[offset + 15 | 0] = 0.0;
  };
  protoOf(Matrix).qg = function (x, y, z) {
    // Inline function 'kotlin.math.sqrt' call
    var x_0 = x * x + y * y + z * z;
    return Math.sqrt(x_0);
  };
  protoOf(Matrix).f9 = function (sm, smOffset) {
    var inductionVariable = 0;
    if (inductionVariable <= 15)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        sm[smOffset + i | 0] = 0.0;
      }
       while (inductionVariable <= 15);
    var i_0 = 0;
    while (i_0 < 16) {
      sm[smOffset + i_0 | 0] = 1.0;
      i_0 = i_0 + 5 | 0;
    }
  };
  protoOf(Matrix).i9 = function (m, mOffset, x, y, z) {
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var mi = mOffset + i | 0;
        m[mi] = m[mi] * x;
        var tmp4_index0 = 4 + mi | 0;
        m[tmp4_index0] = m[tmp4_index0] * y;
        var tmp6_index0 = 8 + mi | 0;
        m[tmp6_index0] = m[tmp6_index0] * z;
      }
       while (inductionVariable <= 3);
  };
  protoOf(Matrix).g9 = function (m, mOffset, x, y, z) {
    var inductionVariable = 0;
    if (inductionVariable <= 3)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var mi = mOffset + i | 0;
        var tmp2_index0 = 12 + mi | 0;
        m[tmp2_index0] = m[tmp2_index0] + (m[mi] * x + m[4 + mi | 0] * y + m[8 + mi | 0] * z);
      }
       while (inductionVariable <= 3);
  };
  protoOf(Matrix).h9 = function (m, mOffset, a, x, y, z) {
    this.rg(this.j7_1, 0, a, x, y, z);
    this.j9(this.j7_1, 16, m, mOffset, this.j7_1, 0);
    this.ng(this.j7_1, 16, m, mOffset, 16);
  };
  protoOf(Matrix).rg = function (rm, rmOffset, a, x, y, z) {
    var a_0 = a;
    var x_0 = x;
    var y_0 = y;
    var z_0 = z;
    rm[rmOffset + 3 | 0] = 0.0;
    rm[rmOffset + 7 | 0] = 0.0;
    rm[rmOffset + 11 | 0] = 0.0;
    rm[rmOffset + 12 | 0] = 0.0;
    rm[rmOffset + 13 | 0] = 0.0;
    rm[rmOffset + 14 | 0] = 0.0;
    rm[rmOffset + 15 | 0] = 1.0;
    a_0 = a_0 * (get_PI() / 180.0);
    // Inline function 'kotlin.math.sin' call
    var x_1 = a_0;
    var s = Math.sin(x_1);
    // Inline function 'kotlin.math.cos' call
    var x_2 = a_0;
    var c = Math.cos(x_2);
    if ((1.0 === x_0 ? 0.0 === y_0 : false) ? 0.0 === z_0 : false) {
      rm[rmOffset + 5 | 0] = c;
      rm[rmOffset + 10 | 0] = c;
      rm[rmOffset + 6 | 0] = s;
      rm[rmOffset + 9 | 0] = -s;
      rm[rmOffset + 1 | 0] = 0.0;
      rm[rmOffset + 2 | 0] = 0.0;
      rm[rmOffset + 4 | 0] = 0.0;
      rm[rmOffset + 8 | 0] = 0.0;
      rm[rmOffset + 0 | 0] = 1.0;
    } else if ((0.0 === x_0 ? 1.0 === y_0 : false) ? 0.0 === z_0 : false) {
      rm[rmOffset + 0 | 0] = c;
      rm[rmOffset + 10 | 0] = c;
      rm[rmOffset + 8 | 0] = s;
      rm[rmOffset + 2 | 0] = -s;
      rm[rmOffset + 1 | 0] = 0.0;
      rm[rmOffset + 4 | 0] = 0.0;
      rm[rmOffset + 6 | 0] = 0.0;
      rm[rmOffset + 9 | 0] = 0.0;
      rm[rmOffset + 5 | 0] = 1.0;
    } else if ((0.0 === x_0 ? 0.0 === y_0 : false) ? 1.0 === z_0 : false) {
      rm[rmOffset + 0 | 0] = c;
      rm[rmOffset + 5 | 0] = c;
      rm[rmOffset + 1 | 0] = s;
      rm[rmOffset + 4 | 0] = -s;
      rm[rmOffset + 2 | 0] = 0.0;
      rm[rmOffset + 6 | 0] = 0.0;
      rm[rmOffset + 8 | 0] = 0.0;
      rm[rmOffset + 9 | 0] = 0.0;
      rm[rmOffset + 10 | 0] = 1.0;
    } else {
      var len = this.qg(x_0, y_0, z_0);
      if (!(1.0 === len)) {
        var recipLen = 1.0 / len;
        x_0 = x_0 * recipLen;
        y_0 = y_0 * recipLen;
        z_0 = z_0 * recipLen;
      }
      var nc = 1.0 - c;
      var xy = x_0 * y_0;
      var yz = y_0 * z_0;
      var zx = z_0 * x_0;
      var xs = x_0 * s;
      var ys = y_0 * s;
      var zs = z_0 * s;
      rm[rmOffset + 0 | 0] = x_0 * x_0 * nc + c;
      rm[rmOffset + 4 | 0] = xy * nc - zs;
      rm[rmOffset + 8 | 0] = zx * nc + ys;
      rm[rmOffset + 1 | 0] = xy * nc + zs;
      rm[rmOffset + 5 | 0] = y_0 * y_0 * nc + c;
      rm[rmOffset + 9 | 0] = yz * nc - xs;
      rm[rmOffset + 2 | 0] = zx * nc - ys;
      rm[rmOffset + 6 | 0] = yz * nc + xs;
      rm[rmOffset + 10 | 0] = z_0 * z_0 * nc + c;
    }
  };
  protoOf(Matrix).sg = function (rm, rmOffset, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
    var fx = centerX - eyeX;
    var fy = centerY - eyeY;
    var fz = centerZ - eyeZ;
    var rlf = 1.0 / this.qg(fx, fy, fz);
    fx = fx * rlf;
    fy = fy * rlf;
    fz = fz * rlf;
    var sx = fy * upZ - fz * upY;
    var sy = fz * upX - fx * upZ;
    var sz = fx * upY - fy * upX;
    var rls = 1.0 / this.qg(sx, sy, sz);
    sx = sx * rls;
    sy = sy * rls;
    sz = sz * rls;
    var ux = sy * fz - sz * fy;
    var uy = sz * fx - sx * fz;
    var uz = sx * fy - sy * fx;
    rm[rmOffset + 0 | 0] = sx;
    rm[rmOffset + 1 | 0] = ux;
    rm[rmOffset + 2 | 0] = -fx;
    rm[rmOffset + 3 | 0] = 0.0;
    rm[rmOffset + 4 | 0] = sy;
    rm[rmOffset + 5 | 0] = uy;
    rm[rmOffset + 6 | 0] = -fy;
    rm[rmOffset + 7 | 0] = 0.0;
    rm[rmOffset + 8 | 0] = sz;
    rm[rmOffset + 9 | 0] = uz;
    rm[rmOffset + 10 | 0] = -fz;
    rm[rmOffset + 11 | 0] = 0.0;
    rm[rmOffset + 12 | 0] = 0.0;
    rm[rmOffset + 13 | 0] = 0.0;
    rm[rmOffset + 14 | 0] = 0.0;
    rm[rmOffset + 15 | 0] = 1.0;
    this.g9(rm, rmOffset, -eyeX, -eyeY, -eyeZ);
  };
  var Matrix_instance;
  function Matrix_getInstance() {
    if (Matrix_instance == null)
      new Matrix();
    return Matrix_instance;
  }
  function Vec2(_x, _y) {
    _x = _x === VOID ? 0.0 : _x;
    _y = _y === VOID ? 0.0 : _y;
    this.tg_1 = _x;
    this.ug_1 = _y;
  }
  protoOf(Vec2).vg = function (value) {
    this.tg_1 = value;
  };
  protoOf(Vec2).wg = function () {
    return this.tg_1;
  };
  protoOf(Vec2).xg = function (value) {
    this.tg_1 = value;
  };
  protoOf(Vec2).yg = function () {
    return this.tg_1;
  };
  protoOf(Vec2).zg = function (value) {
    this.ug_1 = value;
  };
  protoOf(Vec2).ah = function () {
    return this.ug_1;
  };
  protoOf(Vec2).bh = function (value) {
    this.ug_1 = value;
  };
  protoOf(Vec2).ch = function () {
    return this.ug_1;
  };
  protoOf(Vec2).dh = function (_x, _y) {
    return new Vec2(_x, _y);
  };
  protoOf(Vec2).copy = function (_x, _y, $super) {
    _x = _x === VOID ? this.tg_1 : _x;
    _y = _y === VOID ? this.ug_1 : _y;
    return this.dh(_x, _y);
  };
  protoOf(Vec2).toString = function () {
    return 'Vec2(_x=' + this.tg_1 + ', _y=' + this.ug_1 + ')';
  };
  protoOf(Vec2).hashCode = function () {
    var result = getNumberHashCode(this.tg_1);
    result = imul(result, 31) + getNumberHashCode(this.ug_1) | 0;
    return result;
  };
  protoOf(Vec2).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Vec2))
      return false;
    var tmp0_other_with_cast = other instanceof Vec2 ? other : THROW_CCE();
    if (!equals(this.tg_1, tmp0_other_with_cast.tg_1))
      return false;
    if (!equals(this.ug_1, tmp0_other_with_cast.ug_1))
      return false;
    return true;
  };
  function Vec3(_x, _y, _z) {
    _x = _x === VOID ? 0.0 : _x;
    _y = _y === VOID ? 0.0 : _y;
    _z = _z === VOID ? 0.0 : _z;
    this.eh_1 = _x;
    this.fh_1 = _y;
    this.gh_1 = _z;
  }
  protoOf(Vec3).vg = function (value) {
    this.eh_1 = value;
  };
  protoOf(Vec3).wg = function () {
    return this.eh_1;
  };
  protoOf(Vec3).xg = function (value) {
    this.eh_1 = value;
  };
  protoOf(Vec3).yg = function () {
    return this.eh_1;
  };
  protoOf(Vec3).zg = function (value) {
    this.fh_1 = value;
  };
  protoOf(Vec3).ah = function () {
    return this.fh_1;
  };
  protoOf(Vec3).bh = function (value) {
    this.fh_1 = value;
  };
  protoOf(Vec3).ch = function () {
    return this.fh_1;
  };
  protoOf(Vec3).hh = function (value) {
    this.gh_1 = value;
  };
  protoOf(Vec3).ih = function () {
    return this.gh_1;
  };
  protoOf(Vec3).jh = function (value) {
    this.gh_1 = value;
  };
  protoOf(Vec3).kh = function () {
    return this.gh_1;
  };
  protoOf(Vec3).lh = function (_x, _y, _z) {
    return new Vec3(_x, _y, _z);
  };
  protoOf(Vec3).copy = function (_x, _y, _z, $super) {
    _x = _x === VOID ? this.eh_1 : _x;
    _y = _y === VOID ? this.fh_1 : _y;
    _z = _z === VOID ? this.gh_1 : _z;
    return this.lh(_x, _y, _z);
  };
  protoOf(Vec3).toString = function () {
    return 'Vec3(_x=' + this.eh_1 + ', _y=' + this.fh_1 + ', _z=' + this.gh_1 + ')';
  };
  protoOf(Vec3).hashCode = function () {
    var result = getNumberHashCode(this.eh_1);
    result = imul(result, 31) + getNumberHashCode(this.fh_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.gh_1) | 0;
    return result;
  };
  protoOf(Vec3).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Vec3))
      return false;
    var tmp0_other_with_cast = other instanceof Vec3 ? other : THROW_CCE();
    if (!equals(this.eh_1, tmp0_other_with_cast.eh_1))
      return false;
    if (!equals(this.fh_1, tmp0_other_with_cast.fh_1))
      return false;
    if (!equals(this.gh_1, tmp0_other_with_cast.gh_1))
      return false;
    return true;
  };
  function Vec4(_x, _y, _z, _w) {
    _x = _x === VOID ? 0.0 : _x;
    _y = _y === VOID ? 0.0 : _y;
    _z = _z === VOID ? 0.0 : _z;
    _w = _w === VOID ? 0.0 : _w;
    this.mh_1 = _x;
    this.nh_1 = _y;
    this.oh_1 = _z;
    this.ph_1 = _w;
  }
  protoOf(Vec4).vg = function (value) {
    this.mh_1 = value;
  };
  protoOf(Vec4).wg = function () {
    return this.mh_1;
  };
  protoOf(Vec4).xg = function (value) {
    this.mh_1 = value;
  };
  protoOf(Vec4).yg = function () {
    return this.mh_1;
  };
  protoOf(Vec4).zg = function (value) {
    this.nh_1 = value;
  };
  protoOf(Vec4).ah = function () {
    return this.nh_1;
  };
  protoOf(Vec4).bh = function (value) {
    this.nh_1 = value;
  };
  protoOf(Vec4).ch = function () {
    return this.nh_1;
  };
  protoOf(Vec4).hh = function (value) {
    this.oh_1 = value;
  };
  protoOf(Vec4).ih = function () {
    return this.oh_1;
  };
  protoOf(Vec4).jh = function (value) {
    this.oh_1 = value;
  };
  protoOf(Vec4).kh = function () {
    return this.oh_1;
  };
  protoOf(Vec4).qh = function (value) {
    this.ph_1 = value;
  };
  protoOf(Vec4).rh = function () {
    return this.ph_1;
  };
  protoOf(Vec4).sh = function (value) {
    this.ph_1 = value;
  };
  protoOf(Vec4).th = function () {
    return this.ph_1;
  };
  protoOf(Vec4).uh = function (_x, _y, _z, _w) {
    return new Vec4(_x, _y, _z, _w);
  };
  protoOf(Vec4).copy = function (_x, _y, _z, _w, $super) {
    _x = _x === VOID ? this.mh_1 : _x;
    _y = _y === VOID ? this.nh_1 : _y;
    _z = _z === VOID ? this.oh_1 : _z;
    _w = _w === VOID ? this.ph_1 : _w;
    return this.uh(_x, _y, _z, _w);
  };
  protoOf(Vec4).toString = function () {
    return 'Vec4(_x=' + this.mh_1 + ', _y=' + this.nh_1 + ', _z=' + this.oh_1 + ', _w=' + this.ph_1 + ')';
  };
  protoOf(Vec4).hashCode = function () {
    var result = getNumberHashCode(this.mh_1);
    result = imul(result, 31) + getNumberHashCode(this.nh_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.oh_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.ph_1) | 0;
    return result;
  };
  protoOf(Vec4).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Vec4))
      return false;
    var tmp0_other_with_cast = other instanceof Vec4 ? other : THROW_CCE();
    if (!equals(this.mh_1, tmp0_other_with_cast.mh_1))
      return false;
    if (!equals(this.nh_1, tmp0_other_with_cast.nh_1))
      return false;
    if (!equals(this.oh_1, tmp0_other_with_cast.oh_1))
      return false;
    if (!equals(this.ph_1, tmp0_other_with_cast.ph_1))
      return false;
    return true;
  };
  function TimerParams(timer, period, rotating) {
    this.vh_1 = timer;
    this.wh_1 = period;
    this.xh_1 = rotating;
  }
  function TimersMap() {
    var tmp = this;
    // Inline function 'kotlin.collections.mutableMapOf' call
    tmp.yh_1 = LinkedHashMap_init_$Create$();
    this.zh_1 = 0.0;
  }
  protoOf(TimersMap).ai = function (key, period) {
    this.yh_1.c1(key, new TimerParams(0.0, period, true));
  };
  protoOf(TimersMap).bi = function (key, period, rotating) {
    this.yh_1.c1(key, new TimerParams(0.0, period, rotating));
  };
  protoOf(TimersMap).ci = function (index) {
    var tmp0_elvis_lhs = this.yh_1.i1(index);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw Exception_init_$Create$('Timer not found');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var timer = tmp;
    return timer.vh_1;
  };
  protoOf(TimersMap).di = function (index, value) {
    var tmp0_elvis_lhs = this.yh_1.i1(index);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      throw Exception_init_$Create$('Timer not found');
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var timer = tmp;
    timer.vh_1 = value;
  };
  protoOf(TimersMap).ei = function (timeNow) {
    // Inline function 'kotlin.collections.iterator' call
    var tmp0_iterator = this.yh_1.b1().h();
    while (tmp0_iterator.o()) {
      var timer = tmp0_iterator.p();
      var delta = (timeNow - this.zh_1) / timer.wh_1;
      timer.vh_1 = timer.vh_1 + delta;
      if (timer.xh_1) {
        timer.vh_1 = timer.vh_1 % 1.0;
      } else {
        if (timer.vh_1 > 1.0) {
          timer.vh_1 = 1.0;
        }
      }
    }
    this.zh_1 = timeNow;
  };
  //region block: post-declaration
  defineProp(protoOf(BackendMode), 'name', protoOf(BackendMode).c4);
  defineProp(protoOf(BackendMode), 'ordinal', protoOf(BackendMode).d4);
  defineProp(protoOf(BlendingEquation), 'name', protoOf(BlendingEquation).c4);
  defineProp(protoOf(BlendingEquation), 'ordinal', protoOf(BlendingEquation).d4);
  defineProp(protoOf(BlendingFactor), 'name', protoOf(BlendingFactor).c4);
  defineProp(protoOf(BlendingFactor), 'ordinal', protoOf(BlendingFactor).d4);
  defineProp(protoOf(CullFace), 'name', protoOf(CullFace).c4);
  defineProp(protoOf(CullFace), 'ordinal', protoOf(CullFace).d4);
  defineProp(protoOf(Scene), 'loaded', protoOf(Scene).g7, protoOf(Scene).f7);
  defineProp(protoOf(Scene), 'commands', function () {
    return this.x8();
  }, function (value) {
    this.w8(value);
  });
  defineProp(protoOf(Scene), 'meshes', function () {
    return this.z8();
  }, function (value) {
    this.y8(value);
  });
  defineProp(protoOf(Scene), 'textures', function () {
    return this.b9();
  }, function (value) {
    this.a9(value);
  });
  defineProp(protoOf(Scene), 'shaders', function () {
    return this.d9();
  }, function (value) {
    this.c9(value);
  });
  defineProp(protoOf(TextureFiltering), 'name', protoOf(TextureFiltering).c4);
  defineProp(protoOf(TextureFiltering), 'ordinal', protoOf(TextureFiltering).d4);
  defineProp(protoOf(TextureWrapping), 'name', protoOf(TextureWrapping).c4);
  defineProp(protoOf(TextureWrapping), 'ordinal', protoOf(TextureWrapping).d4);
  defineProp(protoOf(TextureFormat), 'name', protoOf(TextureFormat).c4);
  defineProp(protoOf(TextureFormat), 'ordinal', protoOf(TextureFormat).d4);
  defineProp(protoOf(TextureType), 'name', protoOf(TextureType).c4);
  defineProp(protoOf(TextureType), 'ordinal', protoOf(TextureType).d4);
  defineProp(protoOf(VertexFormat), 'name', protoOf(VertexFormat).c4);
  defineProp(protoOf(VertexFormat), 'ordinal', protoOf(VertexFormat).d4);
  defineProp(protoOf(AttributeType), 'name', protoOf(AttributeType).c4);
  defineProp(protoOf(AttributeType), 'ordinal', protoOf(AttributeType).d4);
  defineProp(protoOf(CameraPathAnimator), 'minDurationCoefficient', protoOf(CameraPathAnimator).kc, protoOf(CameraPathAnimator).jc);
  defineProp(protoOf(CameraPathAnimator), 'positionInterpolator', protoOf(CameraPathAnimator).lc);
  defineProp(protoOf(CameraPathAnimator), 'timer', protoOf(CameraPathAnimator).mc);
  defineProp(protoOf(CameraPathAnimator), 'state', protoOf(CameraPathAnimator).nc);
  defineProp(protoOf(CameraPathAnimator), 'currentCameraPair', protoOf(CameraPathAnimator).pc);
  defineProp(protoOf(CameraPositionInterpolator), 'cameraPosition', protoOf(CameraPositionInterpolator).dd);
  defineProp(protoOf(CameraPositionInterpolator), 'cameraRotation', protoOf(CameraPositionInterpolator).ed);
  defineProp(protoOf(CameraState), 'name', protoOf(CameraState).c4);
  defineProp(protoOf(CameraState), 'ordinal', protoOf(CameraState).d4);
  defineProp(protoOf(BlurSize), 'name', protoOf(BlurSize).c4);
  defineProp(protoOf(BlurSize), 'ordinal', protoOf(BlurSize).d4);
  defineProp(protoOf(Command), 'type', function () {
    return this.z9();
  });
  defineProp(protoOf(ClearCommandClearType), 'name', protoOf(ClearCommandClearType).c4);
  defineProp(protoOf(ClearCommandClearType), 'ordinal', protoOf(ClearCommandClearType).d4);
  defineProp(protoOf(CommandType), 'name', protoOf(CommandType).c4);
  defineProp(protoOf(CommandType), 'ordinal', protoOf(CommandType).d4);
  defineProp(protoOf(PrimitiveType), 'name', protoOf(PrimitiveType).c4);
  defineProp(protoOf(PrimitiveType), 'ordinal', protoOf(PrimitiveType).d4);
  defineProp(protoOf(ShadingRate), 'name', protoOf(ShadingRate).c4);
  defineProp(protoOf(ShadingRate), 'ordinal', protoOf(ShadingRate).d4);
  defineProp(protoOf(ColorMode), 'name', protoOf(ColorMode).c4);
  defineProp(protoOf(ColorMode), 'ordinal', protoOf(ColorMode).d4);
  defineProp(protoOf(Vec2), 'x', protoOf(Vec2).wg, protoOf(Vec2).vg);
  defineProp(protoOf(Vec2), 'r', protoOf(Vec2).yg, protoOf(Vec2).xg);
  defineProp(protoOf(Vec2), 'y', protoOf(Vec2).ah, protoOf(Vec2).zg);
  defineProp(protoOf(Vec2), 'g', protoOf(Vec2).ch, protoOf(Vec2).bh);
  defineProp(protoOf(Vec3), 'x', protoOf(Vec3).wg, protoOf(Vec3).vg);
  defineProp(protoOf(Vec3), 'r', protoOf(Vec3).yg, protoOf(Vec3).xg);
  defineProp(protoOf(Vec3), 'y', protoOf(Vec3).ah, protoOf(Vec3).zg);
  defineProp(protoOf(Vec3), 'g', protoOf(Vec3).ch, protoOf(Vec3).bh);
  defineProp(protoOf(Vec3), 'z', protoOf(Vec3).ih, protoOf(Vec3).hh);
  defineProp(protoOf(Vec3), 'b', protoOf(Vec3).kh, protoOf(Vec3).jh);
  defineProp(protoOf(Vec4), 'x', protoOf(Vec4).wg, protoOf(Vec4).vg);
  defineProp(protoOf(Vec4), 'r', protoOf(Vec4).yg, protoOf(Vec4).xg);
  defineProp(protoOf(Vec4), 'y', protoOf(Vec4).ah, protoOf(Vec4).zg);
  defineProp(protoOf(Vec4), 'g', protoOf(Vec4).ch, protoOf(Vec4).bh);
  defineProp(protoOf(Vec4), 'z', protoOf(Vec4).ih, protoOf(Vec4).hh);
  defineProp(protoOf(Vec4), 'b', protoOf(Vec4).kh, protoOf(Vec4).jh);
  defineProp(protoOf(Vec4), 'w', protoOf(Vec4).rh, protoOf(Vec4).qh);
  defineProp(protoOf(Vec4), 'a', protoOf(Vec4).th, protoOf(Vec4).sh);
  //endregion
  //region block: init
  Companion_instance = new Companion();
  MathUtils_instance = new MathUtils();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.BackendMode = BackendMode;
    $org$androidworks$engine.BackendMode.values = values;
    $org$androidworks$engine.BackendMode.valueOf = valueOf;
    defineProp($org$androidworks$engine.BackendMode, 'OPENGL', BackendMode_OPENGL_getInstance);
    defineProp($org$androidworks$engine.BackendMode, 'METAL', BackendMode_METAL_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.BlendingEquation = BlendingEquation;
    $org$androidworks$engine.BlendingEquation.values = values_0;
    $org$androidworks$engine.BlendingEquation.valueOf = valueOf_0;
    defineProp($org$androidworks$engine.BlendingEquation, 'ADD', BlendingEquation_ADD_getInstance);
    defineProp($org$androidworks$engine.BlendingEquation, 'SUBTRACT', BlendingEquation_SUBTRACT_getInstance);
    defineProp($org$androidworks$engine.BlendingEquation, 'REVERSE_SUBTRACT', BlendingEquation_REVERSE_SUBTRACT_getInstance);
    $org$androidworks$engine.BlendingFactor = BlendingFactor;
    $org$androidworks$engine.BlendingFactor.values = values_1;
    $org$androidworks$engine.BlendingFactor.valueOf = valueOf_1;
    defineProp($org$androidworks$engine.BlendingFactor, 'ZERO', BlendingFactor_ZERO_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE', BlendingFactor_ONE_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'SRC_COLOR', BlendingFactor_SRC_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_SRC_COLOR', BlendingFactor_ONE_MINUS_SRC_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'DST_COLOR', BlendingFactor_DST_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_DST_COLOR', BlendingFactor_ONE_MINUS_DST_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'SRC_ALPHA', BlendingFactor_SRC_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_SRC_ALPHA', BlendingFactor_ONE_MINUS_SRC_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'DST_ALPHA', BlendingFactor_DST_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_DST_ALPHA', BlendingFactor_ONE_MINUS_DST_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'CONSTANT_COLOR', BlendingFactor_CONSTANT_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_CONSTANT_COLOR', BlendingFactor_ONE_MINUS_CONSTANT_COLOR_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'CONSTANT_ALPHA', BlendingFactor_CONSTANT_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'ONE_MINUS_CONSTANT_ALPHA', BlendingFactor_ONE_MINUS_CONSTANT_ALPHA_getInstance);
    defineProp($org$androidworks$engine.BlendingFactor, 'SRC_ALPHA_SATURATE', BlendingFactor_SRC_ALPHA_SATURATE_getInstance);
    $org$androidworks$engine.Blending = Blending;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.CullFace = CullFace;
    $org$androidworks$engine.CullFace.values = values_2;
    $org$androidworks$engine.CullFace.valueOf = valueOf_2;
    defineProp($org$androidworks$engine.CullFace, 'FRONT', CullFace_FRONT_getInstance);
    defineProp($org$androidworks$engine.CullFace, 'BACK', CullFace_BACK_getInstance);
    defineProp($org$androidworks$engine.CullFace, 'FRONT_AND_BACK', CullFace_FRONT_AND_BACK_getInstance);
    defineProp($org$androidworks$engine.CullFace, 'DISABLED', CullFace_DISABLED_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.DepthMode = DepthMode;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.Mesh = Mesh;
    $org$androidworks$engine.Mesh.MeshConstructor1 = MeshConstructor1;
    $org$androidworks$engine.Mesh.MeshConstructor2 = MeshConstructor2;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.Scene = Scene;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.Shader = Shader;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.TextureFiltering = TextureFiltering;
    $org$androidworks$engine.TextureFiltering.values = values_3;
    $org$androidworks$engine.TextureFiltering.valueOf = valueOf_3;
    defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST', TextureFiltering_NEAREST_getInstance);
    defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR', TextureFiltering_LINEAR_getInstance);
    defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST_MIPMAP_NEAREST', TextureFiltering_NEAREST_MIPMAP_NEAREST_getInstance);
    defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR_MIPMAP_NEAREST', TextureFiltering_LINEAR_MIPMAP_NEAREST_getInstance);
    defineProp($org$androidworks$engine.TextureFiltering, 'NEAREST_MIPMAP_LINEAR', TextureFiltering_NEAREST_MIPMAP_LINEAR_getInstance);
    defineProp($org$androidworks$engine.TextureFiltering, 'LINEAR_MIPMAP_LINEAR', TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance);
    $org$androidworks$engine.TextureWrapping = TextureWrapping;
    $org$androidworks$engine.TextureWrapping.values = values_4;
    $org$androidworks$engine.TextureWrapping.valueOf = valueOf_4;
    defineProp($org$androidworks$engine.TextureWrapping, 'CLAMP_TO_EDGE', TextureWrapping_CLAMP_TO_EDGE_getInstance);
    defineProp($org$androidworks$engine.TextureWrapping, 'MIRRORED_REPEAT', TextureWrapping_MIRRORED_REPEAT_getInstance);
    defineProp($org$androidworks$engine.TextureWrapping, 'REPEAT', TextureWrapping_REPEAT_getInstance);
    $org$androidworks$engine.TextureFormat = TextureFormat;
    $org$androidworks$engine.TextureFormat.values = values_5;
    $org$androidworks$engine.TextureFormat.valueOf = valueOf_5;
    defineProp($org$androidworks$engine.TextureFormat, 'RGBA8', TextureFormat_RGBA8_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'RGB8', TextureFormat_RGB8_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'RGB16F', TextureFormat_RGB16F_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'RGB32F', TextureFormat_RGB32F_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'RGBA16F', TextureFormat_RGBA16F_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'RGBA32F', TextureFormat_RGBA32F_getInstance);
    defineProp($org$androidworks$engine.TextureFormat, 'ASTC', TextureFormat_ASTC_getInstance);
    $org$androidworks$engine.TextureType = TextureType;
    $org$androidworks$engine.TextureType.values = values_6;
    $org$androidworks$engine.TextureType.valueOf = valueOf_6;
    defineProp($org$androidworks$engine.TextureType, 'TEX_1D', TextureType_TEX_1D_getInstance);
    defineProp($org$androidworks$engine.TextureType, 'TEX_2D', TextureType_TEX_2D_getInstance);
    defineProp($org$androidworks$engine.TextureType, 'TEX_3D', TextureType_TEX_3D_getInstance);
    defineProp($org$androidworks$engine.TextureType, 'CUBEMAP', TextureType_CUBEMAP_getInstance);
    $org$androidworks$engine.Texture = Texture;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.UniformValue = UniformValue;
    $org$androidworks$engine.UniformFloatValue = UniformFloatValue;
    $org$androidworks$engine.UniformFloatValue.UniformFloatValueWithArray = UniformFloatValueWithArray;
    $org$androidworks$engine.UniformIntValue = UniformIntValue;
    $org$androidworks$engine.UniformIntValue.UniformIntValueWithArray = UniformIntValueWithArray;
    $org$androidworks$engine.UniformTextureValue = UniformTextureValue;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    $org$androidworks$engine.VertexFormat = VertexFormat;
    $org$androidworks$engine.VertexFormat.values = values_7;
    $org$androidworks$engine.VertexFormat.valueOf = valueOf_7;
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE', VertexFormat_UBYTE_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE2', VertexFormat_UBYTE2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE3', VertexFormat_UBYTE3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE4', VertexFormat_UBYTE4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE', VertexFormat_BYTE_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE2', VertexFormat_BYTE2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE3', VertexFormat_BYTE3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE4', VertexFormat_BYTE4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE_NORMALIZED', VertexFormat_UBYTE_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE2_NORMALIZED', VertexFormat_UBYTE2_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE3_NORMALIZED', VertexFormat_UBYTE3_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UBYTE4_NORMALIZED', VertexFormat_UBYTE4_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE_NORMALIZED', VertexFormat_BYTE_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE2_NORMALIZED', VertexFormat_BYTE2_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE3_NORMALIZED', VertexFormat_BYTE3_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'BYTE4_NORMALIZED', VertexFormat_BYTE4_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT', VertexFormat_USHORT_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT2', VertexFormat_USHORT2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT3', VertexFormat_USHORT3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT4', VertexFormat_USHORT4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT', VertexFormat_SHORT_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT2', VertexFormat_SHORT2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT3', VertexFormat_SHORT3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT4', VertexFormat_SHORT4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT_NORMALIZED', VertexFormat_USHORT_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT2_NORMALIZED', VertexFormat_USHORT2_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT3_NORMALIZED', VertexFormat_USHORT3_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'USHORT4_NORMALIZED', VertexFormat_USHORT4_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT_NORMALIZED', VertexFormat_SHORT_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT2_NORMALIZED', VertexFormat_SHORT2_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT3_NORMALIZED', VertexFormat_SHORT3_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'SHORT4_NORMALIZED', VertexFormat_SHORT4_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'HALF', VertexFormat_HALF_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'HALF2', VertexFormat_HALF2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'HALF3', VertexFormat_HALF3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'HALF4', VertexFormat_HALF4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'FLOAT', VertexFormat_FLOAT_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'FLOAT2', VertexFormat_FLOAT2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'FLOAT3', VertexFormat_FLOAT3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'FLOAT4', VertexFormat_FLOAT4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UINT', VertexFormat_UINT_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UINT2', VertexFormat_UINT2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UINT3', VertexFormat_UINT3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UINT4', VertexFormat_UINT4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'INT', VertexFormat_INT_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'INT2', VertexFormat_INT2_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'INT3', VertexFormat_INT3_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'INT4', VertexFormat_INT4_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'INT_1010102_NORMALIZED', VertexFormat_INT_1010102_NORMALIZED_getInstance);
    defineProp($org$androidworks$engine.VertexFormat, 'UINT_1010102_NORMALIZED', VertexFormat_UINT_1010102_NORMALIZED_getInstance);
    $org$androidworks$engine.VertexAttribute = VertexAttribute;
    $org$androidworks$engine.VertexAttributesDescriptor = VertexAttributesDescriptor;
    $org$androidworks$engine.AttributeType = AttributeType;
    $org$androidworks$engine.AttributeType.values = values_8;
    $org$androidworks$engine.AttributeType.valueOf = valueOf_8;
    defineProp($org$androidworks$engine.AttributeType, 'VERTEX', AttributeType_VERTEX_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'NORMAL', AttributeType_NORMAL_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'COLOR', AttributeType_COLOR_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'UV0', AttributeType_UV0_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'UV1', AttributeType_UV1_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'UV2', AttributeType_UV2_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'AO', AttributeType_AO_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'CUSTOM0', AttributeType_CUSTOM0_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'CUSTOM1', AttributeType_CUSTOM1_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'CUSTOM2', AttributeType_CUSTOM2_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'CUSTOM3', AttributeType_CUSTOM3_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'U0', AttributeType_U0_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'V0', AttributeType_V0_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'U1', AttributeType_U1_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'V1', AttributeType_V1_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'U2', AttributeType_U2_getInstance);
    defineProp($org$androidworks$engine.AttributeType, 'V2', AttributeType_V2_getInstance);
    $org$androidworks$engine.MeshAttribute = MeshAttribute;
    $org$androidworks$engine.MeshAttributes = MeshAttributes;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
    $org$androidworks$engine$camera.CameraPathAnimator = CameraPathAnimator;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
    $org$androidworks$engine$camera.CameraPositionInterpolator = CameraPositionInterpolator;
    defineProp($org$androidworks$engine$camera.CameraPositionInterpolator, 'Companion', Companion_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$camera = $org$androidworks$engine.camera || ($org$androidworks$engine.camera = {});
    $org$androidworks$engine$camera.CameraState = CameraState;
    $org$androidworks$engine$camera.CameraState.values = values_9;
    $org$androidworks$engine$camera.CameraState.valueOf = valueOf_9;
    defineProp($org$androidworks$engine$camera.CameraState, 'ANIMATING', CameraState_ANIMATING_getInstance);
    defineProp($org$androidworks$engine$camera.CameraState, 'TRANSITIONING', CameraState_TRANSITIONING_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.BlurSize = BlurSize;
    $org$androidworks$engine$commands.BlurSize.values = values_10;
    $org$androidworks$engine$commands.BlurSize.valueOf = valueOf_10;
    defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_5', BlurSize_KERNEL_5_getInstance);
    defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_4', BlurSize_KERNEL_4_getInstance);
    defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_3', BlurSize_KERNEL_3_getInstance);
    defineProp($org$androidworks$engine$commands.BlurSize, 'KERNEL_2', BlurSize_KERNEL_2_getInstance);
    $org$androidworks$engine$commands.BlurredPassCommand = BlurredPassCommand;
    $org$androidworks$engine$commands.DrawBlurredCommand = DrawBlurredCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.ClearColorCommand = ClearColorCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.ClearCommandClearType = ClearCommandClearType;
    $org$androidworks$engine$commands.ClearCommandClearType.values = values_11;
    $org$androidworks$engine$commands.ClearCommandClearType.valueOf = valueOf_11;
    defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'COLOR', ClearCommandClearType_COLOR_getInstance);
    defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'DEPTH', ClearCommandClearType_DEPTH_getInstance);
    defineProp($org$androidworks$engine$commands.ClearCommandClearType, 'COLOR_AND_DEPTH', ClearCommandClearType_COLOR_AND_DEPTH_getInstance);
    $org$androidworks$engine$commands.ClearCommand = ClearCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.Command = Command;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.CommandType = CommandType;
    $org$androidworks$engine$commands.CommandType.values = values_12;
    $org$androidworks$engine$commands.CommandType.valueOf = valueOf_12;
    defineProp($org$androidworks$engine$commands.CommandType, 'NOOP', CommandType_NOOP_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'GROUP', CommandType_GROUP_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'CLEAR_COLOR', CommandType_CLEAR_COLOR_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'CLEAR', CommandType_CLEAR_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'VIGNETTE', CommandType_VIGNETTE_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'DRAW_MESH', CommandType_DRAW_MESH_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'BLURRED_PASS', CommandType_BLURRED_PASS_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'DRAW_BLURRED', CommandType_DRAW_BLURRED_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'RENDER_PASS', CommandType_RENDER_PASS_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'MAIN_PASS', CommandType_MAIN_PASS_getInstance);
    defineProp($org$androidworks$engine$commands.CommandType, 'CUSTOM', CommandType_CUSTOM_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.DrawMeshState = DrawMeshState;
    $org$androidworks$engine$commands.PrimitiveType = PrimitiveType;
    $org$androidworks$engine$commands.PrimitiveType.values = values_13;
    $org$androidworks$engine$commands.PrimitiveType.valueOf = valueOf_13;
    defineProp($org$androidworks$engine$commands.PrimitiveType, 'TRIANGLES', PrimitiveType_TRIANGLES_getInstance);
    defineProp($org$androidworks$engine$commands.PrimitiveType, 'TRIANGLE_STRIP', PrimitiveType_TRIANGLE_STRIP_getInstance);
    defineProp($org$androidworks$engine$commands.PrimitiveType, 'POINTS', PrimitiveType_POINTS_getInstance);
    $org$androidworks$engine$commands.DrawMeshCommand = DrawMeshCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.DrawTransformedMeshCommand = DrawTransformedMeshCommand;
    $org$androidworks$engine$commands.DrawStaticMeshCommand = DrawStaticMeshCommand;
    $org$androidworks$engine$commands.DrawStaticMeshCommand.DrawStaticMeshCommandConstructor = DrawStaticMeshCommandConstructor;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.GroupCommand = GroupCommand;
    $org$androidworks$engine$commands.GroupCommand.GroupCommandArr = GroupCommandArr;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.Hint = Hint;
    $org$androidworks$engine$commands.ShadingRate = ShadingRate;
    $org$androidworks$engine$commands.ShadingRate.values = values_14;
    $org$androidworks$engine$commands.ShadingRate.valueOf = valueOf_14;
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_1X1', ShadingRate_SHADING_RATE_1X1_getInstance);
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_1X2', ShadingRate_SHADING_RATE_1X2_getInstance);
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_2X1', ShadingRate_SHADING_RATE_2X1_getInstance);
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_2X2', ShadingRate_SHADING_RATE_2X2_getInstance);
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_4X2', ShadingRate_SHADING_RATE_4X2_getInstance);
    defineProp($org$androidworks$engine$commands.ShadingRate, 'SHADING_RATE_4X4', ShadingRate_SHADING_RATE_4X4_getInstance);
    $org$androidworks$engine$commands.VrsHint = VrsHint;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.MainPassCommand = MainPassCommand;
    $org$androidworks$engine$commands.MainPassCommand.MainPassCommandConstructor = MainPassCommandConstructor;
    $org$androidworks$engine$commands.MainPassCommand.MainPassCommandArr = MainPassCommandArr;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.NoopCommand = NoopCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.RenderPassCommand = RenderPassCommand;
    $org$androidworks$engine$commands.RenderPassCommand.RenderPassCommandConstructor = RenderPassCommandConstructor;
    $org$androidworks$engine$commands.RenderPassCommand.RenderPassCommandArr = RenderPassCommandArr;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$commands = $org$androidworks$engine.commands || ($org$androidworks$engine.commands = {});
    $org$androidworks$engine$commands.VignetteCommand = VignetteCommand;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$common = $org$androidworks$engine.common || ($org$androidworks$engine.common = {});
    $org$androidworks$engine$common.ColorMode = ColorMode;
    $org$androidworks$engine$common.ColorMode.values = values_15;
    $org$androidworks$engine$common.ColorMode.valueOf = valueOf_15;
    defineProp($org$androidworks$engine$common.ColorMode, 'Normal', ColorMode_Normal_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'Grayscale', ColorMode_Grayscale_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'Sepia', ColorMode_Sepia_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'HighContrast', ColorMode_HighContrast_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'LowContrast', ColorMode_LowContrast_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'BlackAndWhite', ColorMode_BlackAndWhite_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'IsolatedColor', ColorMode_IsolatedColor_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'Crosshatch', ColorMode_Crosshatch_getInstance);
    defineProp($org$androidworks$engine$common.ColorMode, 'LimitedColors', ColorMode_LimitedColors_getInstance);
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
    $org$androidworks$engine$math.Vec2 = Vec2;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
    $org$androidworks$engine$math.Vec3 = Vec3;
    var $org = _.org || (_.org = {});
    var $org$androidworks = $org.androidworks || ($org.androidworks = {});
    var $org$androidworks$engine = $org$androidworks.engine || ($org$androidworks.engine = {});
    var $org$androidworks$engine$math = $org$androidworks$engine.math || ($org$androidworks$engine.math = {});
    $org$androidworks$engine$math.Vec4 = Vec4;
  }
  $jsExportAll$(_);
  _.$jsExportAll$ = $jsExportAll$;
  _.$_$ = _.$_$ || {};
  _.$_$.a = CameraState_TRANSITIONING_getInstance;
  _.$_$.b = BlurSize_KERNEL_3_getInstance;
  _.$_$.c = BlurSize_KERNEL_4_getInstance;
  _.$_$.d = BlurSize_KERNEL_5_getInstance;
  _.$_$.e = ClearCommandClearType_COLOR_AND_DEPTH_getInstance;
  _.$_$.f = CommandType_CUSTOM_getInstance;
  _.$_$.g = PrimitiveType_POINTS_getInstance;
  _.$_$.h = ColorMode_Normal_getInstance;
  _.$_$.i = ColorMode_Sepia_getInstance;
  _.$_$.j = AttributeType_NORMAL_getInstance;
  _.$_$.k = AttributeType_U0_getInstance;
  _.$_$.l = AttributeType_UV0_getInstance;
  _.$_$.m = AttributeType_VERTEX_getInstance;
  _.$_$.n = BlendingEquation_ADD_getInstance;
  _.$_$.o = BlendingFactor_ONE_getInstance;
  _.$_$.p = BlendingFactor_SRC_ALPHA_getInstance;
  _.$_$.q = CullFace_BACK_getInstance;
  _.$_$.r = CullFace_DISABLED_getInstance;
  _.$_$.s = CullFace_FRONT_getInstance;
  _.$_$.t = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance;
  _.$_$.u = TextureFiltering_LINEAR_getInstance;
  _.$_$.v = TextureFiltering_NEAREST_getInstance;
  _.$_$.w = TextureFormat_ASTC_getInstance;
  _.$_$.x = TextureFormat_RGBA16F_getInstance;
  _.$_$.y = TextureFormat_RGBA8_getInstance;
  _.$_$.z = TextureType_CUBEMAP_getInstance;
  _.$_$.a1 = TextureWrapping_CLAMP_TO_EDGE_getInstance;
  _.$_$.b1 = VertexFormat_BYTE2_NORMALIZED_getInstance;
  _.$_$.c1 = VertexFormat_FLOAT2_getInstance;
  _.$_$.d1 = VertexFormat_FLOAT3_getInstance;
  _.$_$.e1 = VertexFormat_HALF2_getInstance;
  _.$_$.f1 = VertexFormat_HALF3_getInstance;
  _.$_$.g1 = VertexFormat_HALF_getInstance;
  _.$_$.h1 = VertexFormat_UBYTE2_NORMALIZED_getInstance;
  _.$_$.i1 = VertexFormat_UBYTE_NORMALIZED_getInstance;
  _.$_$.j1 = Spline3D_init_$Create$;
  _.$_$.k1 = DrawStaticMeshCommandConstructor;
  _.$_$.l1 = GroupCommandArr;
  _.$_$.m1 = MainPassCommandArr;
  _.$_$.n1 = MeshConstructor1;
  _.$_$.o1 = MeshConstructor2;
  _.$_$.p1 = UniformFloatValueWithArray;
  _.$_$.q1 = UniformIntValueWithArray;
  _.$_$.r1 = MathUtils_instance;
  _.$_$.s1 = Matrix_getInstance;
  _.$_$.t1 = TextureAnimationChunked;
  _.$_$.u1 = CameraPathAnimator;
  _.$_$.v1 = CameraPositionPair;
  _.$_$.w1 = CameraPosition;
  _.$_$.x1 = AffineTranformation;
  _.$_$.y1 = BlurredPassCommand;
  _.$_$.z1 = ClearColorCommand;
  _.$_$.a2 = ClearCommand;
  _.$_$.b2 = Command;
  _.$_$.c2 = DrawBlurredCommand;
  _.$_$.d2 = DrawMeshCommand;
  _.$_$.e2 = DrawMeshState;
  _.$_$.f2 = DrawTransformedMeshCommand;
  _.$_$.g2 = GroupCommand;
  _.$_$.h2 = get_HINT_VRS_2X2;
  _.$_$.i2 = get_HINT_VRS_4X4;
  _.$_$.j2 = get_HINT_VRS_NONE;
  _.$_$.k2 = NoopCommand;
  _.$_$.l2 = VignetteCommand;
  _.$_$.m2 = Vec3;
  _.$_$.n2 = Vec4;
  _.$_$.o2 = TimersMap;
  _.$_$.p2 = get_BLENDING_NONE;
  _.$_$.q2 = Blending;
  _.$_$.r2 = get_DEPTH_NO_WRITE;
  _.$_$.s2 = get_DEPTH_TEST_ENABLED;
  _.$_$.t2 = MeshAttributes;
  _.$_$.u2 = MeshAttribute;
  _.$_$.v2 = Scene;
  _.$_$.w2 = Shader;
  _.$_$.x2 = Texture;
  _.$_$.y2 = UniformFloatValue;
  _.$_$.z2 = UniformTextureValue;
  _.$_$.a3 = VertexAttributesDescriptor;
  _.$_$.b3 = VertexAttribute;
  _.$_$.c3 = setUniform_2;
  _.$_$.d3 = setUniform_3;
  _.$_$.e3 = setUniform_1;
  _.$_$.f3 = setUniform_0;
  _.$_$.g3 = setUniform_4;
  //endregion
  return _;
}));


});

var KMPLibraryShared = createCommonjsModule(function (module, exports) {
(function (root, factory) {
  factory(module.exports, kotlinKotlinStdlib, KMPLibraryEngine);
}(commonjsGlobal, function (_, kotlin_kotlin, kotlin_org_androidworks_engine_engine) {
  //region block: imports
  var imul = Math.imul;
  var protoOf = kotlin_kotlin.$_$.a1;
  var classMeta = kotlin_kotlin.$_$.p;
  var setMetadataFor = kotlin_kotlin.$_$.b1;
  var VOID = kotlin_kotlin.$_$.b;
  var Vec3 = kotlin_org_androidworks_engine_engine.$_$.m2;
  var TextureAnimationChunked = kotlin_org_androidworks_engine_engine.$_$.t1;
  var objectMeta = kotlin_kotlin.$_$.z;
  var CameraPosition = kotlin_org_androidworks_engine_engine.$_$.w1;
  var CameraPositionPair = kotlin_org_androidworks_engine_engine.$_$.v1;
  var getBooleanHashCode = kotlin_kotlin.$_$.t;
  var THROW_CCE = kotlin_kotlin.$_$.f1;
  var Vec4 = kotlin_org_androidworks_engine_engine.$_$.n2;
  var AttributeType_VERTEX_getInstance = kotlin_org_androidworks_engine_engine.$_$.m;
  var VertexFormat_HALF3_getInstance = kotlin_org_androidworks_engine_engine.$_$.f1;
  var MeshAttribute = kotlin_org_androidworks_engine_engine.$_$.u2;
  var AttributeType_U0_getInstance = kotlin_org_androidworks_engine_engine.$_$.k;
  var VertexFormat_HALF_getInstance = kotlin_org_androidworks_engine_engine.$_$.g1;
  var listOf = kotlin_kotlin.$_$.l;
  var MeshAttributes = kotlin_org_androidworks_engine_engine.$_$.t2;
  var VertexFormat_FLOAT3_getInstance = kotlin_org_androidworks_engine_engine.$_$.d1;
  var AttributeType_UV0_getInstance = kotlin_org_androidworks_engine_engine.$_$.l;
  var VertexFormat_HALF2_getInstance = kotlin_org_androidworks_engine_engine.$_$.e1;
  var listOf_0 = kotlin_kotlin.$_$.k;
  var VertexFormat_UBYTE_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.i1;
  var VertexFormat_FLOAT2_getInstance = kotlin_org_androidworks_engine_engine.$_$.c1;
  var MeshConstructor2 = kotlin_org_androidworks_engine_engine.$_$.o1;
  var mutableListOf = kotlin_kotlin.$_$.n;
  var setUniform = kotlin_org_androidworks_engine_engine.$_$.f3;
  var setUniform_0 = kotlin_org_androidworks_engine_engine.$_$.e3;
  var setUniform_1 = kotlin_org_androidworks_engine_engine.$_$.c3;
  var List = kotlin_kotlin.$_$.i;
  var isInterface = kotlin_kotlin.$_$.w;
  var Unit_instance = kotlin_kotlin.$_$.h;
  var setUniform_2 = kotlin_org_androidworks_engine_engine.$_$.d3;
  var ensureNotNull = kotlin_kotlin.$_$.h1;
  var Scene = kotlin_org_androidworks_engine_engine.$_$.v2;
  var TimersMap = kotlin_org_androidworks_engine_engine.$_$.o2;
  var get_HINT_VRS_4X4 = kotlin_org_androidworks_engine_engine.$_$.i2;
  var UniformTextureValue = kotlin_org_androidworks_engine_engine.$_$.z2;
  var CameraPathAnimator = kotlin_org_androidworks_engine_engine.$_$.u1;
  var ClearColorCommand = kotlin_org_androidworks_engine_engine.$_$.z1;
  var get_BLENDING_NONE = kotlin_org_androidworks_engine_engine.$_$.p2;
  var get_DEPTH_TEST_ENABLED = kotlin_org_androidworks_engine_engine.$_$.s2;
  var CullFace_BACK_getInstance = kotlin_org_androidworks_engine_engine.$_$.q;
  var VertexAttribute = kotlin_org_androidworks_engine_engine.$_$.b3;
  var VertexAttributesDescriptor = kotlin_org_androidworks_engine_engine.$_$.a3;
  var DrawMeshState = kotlin_org_androidworks_engine_engine.$_$.e2;
  var AffineTranformation = kotlin_org_androidworks_engine_engine.$_$.x1;
  var UniformFloatValueWithArray = kotlin_org_androidworks_engine_engine.$_$.p1;
  var DrawStaticMeshCommandConstructor = kotlin_org_androidworks_engine_engine.$_$.k1;
  var GroupCommand = kotlin_org_androidworks_engine_engine.$_$.g2;
  var DrawTransformedMeshCommand = kotlin_org_androidworks_engine_engine.$_$.f2;
  var UniformIntValueWithArray = kotlin_org_androidworks_engine_engine.$_$.q1;
  var GroupCommandArr = kotlin_org_androidworks_engine_engine.$_$.l1;
  var ClearCommand = kotlin_org_androidworks_engine_engine.$_$.a2;
  var ClearCommandClearType_COLOR_AND_DEPTH_getInstance = kotlin_org_androidworks_engine_engine.$_$.e;
  var VignetteCommand = kotlin_org_androidworks_engine_engine.$_$.l2;
  var MainPassCommandArr = kotlin_org_androidworks_engine_engine.$_$.m1;
  var BlurredPassCommand = kotlin_org_androidworks_engine_engine.$_$.y1;
  var BlurSize_KERNEL_4_getInstance = kotlin_org_androidworks_engine_engine.$_$.c;
  var DrawBlurredCommand = kotlin_org_androidworks_engine_engine.$_$.c2;
  var Default_getInstance = kotlin_kotlin.$_$.g;
  var Matrix_getInstance = kotlin_org_androidworks_engine_engine.$_$.s1;
  var CameraState_TRANSITIONING_getInstance = kotlin_org_androidworks_engine_engine.$_$.a;
  var Spline3D_init_$Create$ = kotlin_org_androidworks_engine_engine.$_$.j1;
  var THROW_IAE = kotlin_kotlin.$_$.g1;
  var Enum = kotlin_kotlin.$_$.e1;
  var defineProp = kotlin_kotlin.$_$.q;
  var Shader = kotlin_org_androidworks_engine_engine.$_$.w2;
  var Texture = kotlin_org_androidworks_engine_engine.$_$.x2;
  var TextureFormat_RGBA8_getInstance = kotlin_org_androidworks_engine_engine.$_$.y;
  var TextureFiltering_NEAREST_getInstance = kotlin_org_androidworks_engine_engine.$_$.v;
  var TextureWrapping_CLAMP_TO_EDGE_getInstance = kotlin_org_androidworks_engine_engine.$_$.a1;
  var TextureFiltering_LINEAR_getInstance = kotlin_org_androidworks_engine_engine.$_$.u;
  var TextureFormat_ASTC_getInstance = kotlin_org_androidworks_engine_engine.$_$.w;
  var TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance = kotlin_org_androidworks_engine_engine.$_$.t;
  var TextureFormat_RGBA16F_getInstance = kotlin_org_androidworks_engine_engine.$_$.x;
  var Command = kotlin_org_androidworks_engine_engine.$_$.b2;
  var CommandType_CUSTOM_getInstance = kotlin_org_androidworks_engine_engine.$_$.f;
  var get_HINT_VRS_NONE = kotlin_org_androidworks_engine_engine.$_$.j2;
  var ColorMode_Normal_getInstance = kotlin_org_androidworks_engine_engine.$_$.h;
  var MeshConstructor1 = kotlin_org_androidworks_engine_engine.$_$.n1;
  var BlurSize_KERNEL_5_getInstance = kotlin_org_androidworks_engine_engine.$_$.d;
  var Blending = kotlin_org_androidworks_engine_engine.$_$.q2;
  var BlendingEquation_ADD_getInstance = kotlin_org_androidworks_engine_engine.$_$.n;
  var BlendingFactor_ONE_getInstance = kotlin_org_androidworks_engine_engine.$_$.o;
  var BlurSize_KERNEL_3_getInstance = kotlin_org_androidworks_engine_engine.$_$.b;
  var get_HINT_VRS_2X2 = kotlin_org_androidworks_engine_engine.$_$.h2;
  var ColorMode_Sepia_getInstance = kotlin_org_androidworks_engine_engine.$_$.i;
  var AttributeType_NORMAL_getInstance = kotlin_org_androidworks_engine_engine.$_$.j;
  var CullFace_FRONT_getInstance = kotlin_org_androidworks_engine_engine.$_$.s;
  var BlendingFactor_SRC_ALPHA_getInstance = kotlin_org_androidworks_engine_engine.$_$.p;
  var get_DEPTH_NO_WRITE = kotlin_org_androidworks_engine_engine.$_$.r2;
  var CullFace_DISABLED_getInstance = kotlin_org_androidworks_engine_engine.$_$.r;
  var MathUtils_instance = kotlin_org_androidworks_engine_engine.$_$.r1;
  var objectCreate = kotlin_kotlin.$_$.y;
  var fillArrayVal = kotlin_kotlin.$_$.s;
  var to = kotlin_kotlin.$_$.i1;
  var mapOf = kotlin_kotlin.$_$.m;
  var NoopCommand = kotlin_org_androidworks_engine_engine.$_$.k2;
  var DrawMeshCommand = kotlin_org_androidworks_engine_engine.$_$.d2;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.c;
  var UniformFloatValue = kotlin_org_androidworks_engine_engine.$_$.y2;
  var get_PI = kotlin_kotlin.$_$.d1;
  var VertexFormat_UBYTE2_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.h1;
  var VertexFormat_BYTE2_NORMALIZED_getInstance = kotlin_org_androidworks_engine_engine.$_$.b1;
  var arrayConcat = kotlin_kotlin.$_$.a;
  var PrimitiveType_POINTS_getInstance = kotlin_org_androidworks_engine_engine.$_$.g;
  var setUniform_3 = kotlin_org_androidworks_engine_engine.$_$.g3;
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
    this.fi_1 = 0.0;
    this.gi_1 = 0.0;
  }
  function AnimatedObjectInfo() {
    AnimatedObjectInfoBase.call(this);
    this.ji_1 = new Vec3();
    this.ki_1 = new Vec3();
  }
  function SplineAnimatedObjectInfo() {
    AnimatedObjectInfoBase.call(this);
    this.ni_1 = null;
  }
  function Animations() {
    Animations_instance = this;
    this.oi_1 = new TextureAnimationChunked(133, 133, 3);
    this.pi_1 = new TextureAnimationChunked(341, 341, 15);
    this.qi_1 = new TextureAnimationChunked(238, 238, 10);
    this.ri_1 = new TextureAnimationChunked(263, 263, 9);
    this.si_1 = new TextureAnimationChunked(263, 263, 12);
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
    tmp.ti_1 = [new CameraPositionPair(new CameraPosition(new Vec3(-20834.791, 47426.33, 2531.646), new Vec3(-25922.844, 23601.791, 886.872)), new CameraPosition(new Vec3(10194.038, -1464.044, 886.872), new Vec3(918.405, -14209.802, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-4109.569, 11284.58, 2531.646), new Vec3(-26652.816, 1825.736, 886.872)), new CameraPosition(new Vec3(4167.435, 9801.106, 886.872), new Vec3(20338.879, -12121.901, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1316.869, -26605.557, 730.833), new Vec3(7972.117, -8640.933, 156.916)), new CameraPosition(new Vec3(5633.813, -2835.024, 590.909), new Vec3(7054.362, -11628.732, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(1058.602, -6343.349, 7252.608), new Vec3(12343.629, -9785.771, 156.916)), new CameraPosition(new Vec3(10627.578, -5523.65, 952.352), new Vec3(7975.851, -12773.571, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-15084.583, -6685.166, 1734.204), new Vec3(-7877.742, -11902.989, 156.916)), new CameraPosition(new Vec3(-5300.519, -8189.871, 2864.12), new Vec3(-14072.867, -12477.64, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-12847.906, 6333.75, 388.651), new Vec3(-9402.603, 9611.532, 156.916)), new CameraPosition(new Vec3(-7762.645, 7800.965, 3749.253), new Vec3(-11462.321, 8195.902, 156.916)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-22389.021, 1075.924, 5119.1), new Vec3(-6829.5, 16726.61, 3154.788)), new CameraPosition(new Vec3(-23767.002, 14537.841, 5001.777), new Vec3(1434.719, 1224.992, 4490.559)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-35127.016, 27564.738, 886.872), new Vec3(-7923.539, 14634.557, 886.872)), new CameraPosition(new Vec3(-24081.432, -14828.664, 886.872), new Vec3(-7150.61, -5201.194, 886.872)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-26917.791, 18527.285, 3173.479), new Vec3(-19059.227, 11528.038, 886.872)), new CameraPosition(new Vec3(1437.67, 4945.704, 571.601), new Vec3(6268.789, -4323.603, 886.872)), 1.0)];
  }
  var Cameras_instance;
  function Cameras_getInstance() {
    if (Cameras_instance == null)
      new Cameras();
    return Cameras_instance;
  }
  function SceneColors(isDay, isLowSun, drawBirds, birds, clouds, stars, waterColorNear, waterColorFar, distantZFogColor) {
    this.ui_1 = isDay;
    this.vi_1 = isLowSun;
    this.wi_1 = drawBirds;
    this.xi_1 = birds;
    this.yi_1 = clouds;
    this.zi_1 = stars;
    this.aj_1 = waterColorNear;
    this.bj_1 = waterColorFar;
    this.cj_1 = distantZFogColor;
  }
  protoOf(SceneColors).toString = function () {
    return 'SceneColors(isDay=' + this.ui_1 + ', isLowSun=' + this.vi_1 + ', drawBirds=' + this.wi_1 + ', birds=' + this.xi_1 + ', clouds=' + this.yi_1 + ', stars=' + this.zi_1 + ', waterColorNear=' + this.aj_1 + ', waterColorFar=' + this.bj_1 + ', distantZFogColor=' + this.cj_1 + ')';
  };
  protoOf(SceneColors).hashCode = function () {
    var result = getBooleanHashCode(this.ui_1);
    result = imul(result, 31) + getBooleanHashCode(this.vi_1) | 0;
    result = imul(result, 31) + getBooleanHashCode(this.wi_1) | 0;
    result = imul(result, 31) + this.xi_1.hashCode() | 0;
    result = imul(result, 31) + this.yi_1.hashCode() | 0;
    result = imul(result, 31) + this.zi_1.hashCode() | 0;
    result = imul(result, 31) + this.aj_1.hashCode() | 0;
    result = imul(result, 31) + this.bj_1.hashCode() | 0;
    result = imul(result, 31) + this.cj_1.hashCode() | 0;
    return result;
  };
  protoOf(SceneColors).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof SceneColors))
      return false;
    var tmp0_other_with_cast = other instanceof SceneColors ? other : THROW_CCE();
    if (!(this.ui_1 === tmp0_other_with_cast.ui_1))
      return false;
    if (!(this.vi_1 === tmp0_other_with_cast.vi_1))
      return false;
    if (!(this.wi_1 === tmp0_other_with_cast.wi_1))
      return false;
    if (!this.xi_1.equals(tmp0_other_with_cast.xi_1))
      return false;
    if (!this.yi_1.equals(tmp0_other_with_cast.yi_1))
      return false;
    if (!this.zi_1.equals(tmp0_other_with_cast.zi_1))
      return false;
    if (!this.aj_1.equals(tmp0_other_with_cast.aj_1))
      return false;
    if (!this.bj_1.equals(tmp0_other_with_cast.bj_1))
      return false;
    if (!this.cj_1.equals(tmp0_other_with_cast.cj_1))
      return false;
    return true;
  };
  function Colors() {
    Colors_instance = this;
    var tmp = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.dj_1 = [new SceneColors(true, false, true, new Vec4(0.3137254901960784, 0.3137254901960784, 0.3137254901960784, 1.0), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.21568627450980393, 0.6313725490196078, 0.8274509803921568), new Vec4(0.5137254901960784, 0.8352941176470589, 0.8901960784313725), new Vec4(1.0, 1.0, 1.0, 0.75)), new SceneColors(false, false, false, new Vec4(1.0, 0.0, 0.0, 1.0), new Vec4(0.058823529411764705, 0.2627450980392157, 0.3843137254901961, 0.3), new Vec4(1.0, 1.0, 1.0, 1.0), new Vec4(0.03529411764705882, 0.17254901960784313, 0.3215686274509804), new Vec4(0.043137254901960784, 0.12156862745098039, 0.2196078431372549), new Vec4(0.2627450980392157, 0.4823529411764706, 0.611764705882353, 0.75)), new SceneColors(true, true, true, new Vec4(0.49411764705882355, 0.42745098039215684, 0.26666666666666666, 1.0), new Vec4(0.9294117647058824, 0.7490196078431373, 0.38823529411764707, 0.3), new Vec4(0.8666666666666667, 0.9725490196078431, 1.0, 0.3), new Vec4(0.592156862745098, 0.6313725490196078, 0.5098039215686274), new Vec4(0.8509803921568627, 0.7333333333333333, 0.5372549019607843), new Vec4(0.8980392156862745, 0.8745098039215686, 0.7137254901960784, 0.75)), new SceneColors(true, true, false, new Vec4(0.3686274509803922, 0.17647058823529413, 0.20784313725490197, 1.0), new Vec4(0.4549019607843137, 0.2784313725490196, 0.5019607843137255, 0.3), new Vec4(1.0, 1.0, 1.0, 1.0), new Vec4(0.0784313725490196, 0.20784313725490197, 0.4549019607843137), new Vec4(0.25882352941176473, 0.24313725490196078, 0.5098039215686274), new Vec4(0.8823529411764706, 0.6745098039215687, 0.8392156862745098, 0.75))];
  }
  var Colors_instance;
  function Colors_getInstance() {
    if (Colors_instance == null)
      new Colors();
    return Colors_instance;
  }
  function Meshes() {
    Meshes_instance = this;
    this.ej_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_U0_getInstance(), VertexFormat_HALF_getInstance(), 6)]), 8);
    this.fj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 12)]), 16);
    this.gj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.hj_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0)), 8);
    this.ij_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.jj_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0), new MeshAttribute(AttributeType_U0_getInstance(), VertexFormat_UBYTE_NORMALIZED_getInstance(), 12)]), 16);
    this.kj_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_FLOAT2_getInstance(), 0)), 4);
    this.lj_1 = MeshConstructor2('mountains1', this.ej_1);
    this.mj_1 = MeshConstructor2('mountains_distant1', this.ej_1);
    this.nj_1 = MeshConstructor2('sun', this.fj_1);
    this.oj_1 = MeshConstructor2('sun2', this.fj_1);
    this.pj_1 = MeshConstructor2('water_test', this.gj_1);
    this.qj_1 = MeshConstructor2('sky', this.fj_1);
    this.rj_1 = MeshConstructor2('stars', this.ij_1);
    this.sj_1 = MeshConstructor2('clouds', this.jj_1);
    this.tj_1 = MeshConstructor2('bird1');
    this.uj_1 = MeshConstructor2('ship', this.ej_1);
    this.vj_1 = MeshConstructor2('penguin-idle', this.kj_1);
    this.wj_1 = MeshConstructor2('penguin-idle2', this.kj_1);
    this.xj_1 = MeshConstructor2('seal-idle', this.kj_1);
    this.yj_1 = MeshConstructor2('animals_sleeping', this.fj_1);
    this.zj_1 = mutableListOf([this.nj_1, this.oj_1, this.lj_1, this.mj_1, this.pj_1, this.qj_1, this.rj_1, this.sj_1, this.tj_1, this.uj_1, this.vj_1, this.wj_1, this.xj_1, this.yj_1]);
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
    this_0.ji_1 = new Vec3(-10793.156, 7192.894, 37.26);
    this_0.ki_1 = new Vec3(0.0, 0.0, -160.0);
    this_0.fi_1 = 0.88;
    this_0.gi_1 = 0.5;
    var tmp_0 = this_0;
    // Inline function 'kotlin.apply' call
    var this_1 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_1.ji_1 = new Vec3(-10851.307, 7243.238, 37.26);
    this_1.ki_1 = new Vec3(0.0, 0.0, 70.0);
    this_1.fi_1 = 0.75;
    this_1.gi_1 = 0.25;
    var tmp_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_2.ji_1 = new Vec3(-10762.938, 7258.693, 37.26);
    this_2.ki_1 = new Vec3(0.0, 0.0, 0.0);
    this_2.fi_1 = 0.65;
    this_2.gi_1 = 0.77;
    var tmp_2 = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_3.ji_1 = new Vec3(-10280.157, 8529.577, 69.556);
    this_3.ki_1 = new Vec3(0.0, 0.0, -20.0);
    this_3.fi_1 = 0.65;
    this_3.gi_1 = 0.2;
    var tmp_3 = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_4.ji_1 = new Vec3(-10359.45, 8782.093, 69.556);
    this_4.ki_1 = new Vec3(0.0, 0.0, 70.0);
    this_4.fi_1 = 0.77;
    this_4.gi_1 = 0.35;
    var tmp_4 = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_5.ji_1 = new Vec3(-10081.696, 8657.917, 69.556);
    this_5.ki_1 = new Vec3(0.0, 0.0, -160.0);
    this_5.fi_1 = 0.85;
    this_5.gi_1 = 0.75;
    var tmp_5 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_6.ji_1 = new Vec3(-10150.821, 9009.801, 69.556);
    this_6.ki_1 = new Vec3(0.0, 0.0, 130.0);
    this_6.fi_1 = 0.7;
    this_6.gi_1 = 0.66;
    var tmp_6 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_7.ji_1 = new Vec3(-10006.514, 8820.707, 69.556);
    this_7.ki_1 = new Vec3(0.0, 0.0, -90.0);
    this_7.fi_1 = 0.8;
    this_7.gi_1 = 0.8;
    var tmp_7 = this_7;
    // Inline function 'kotlin.apply' call
    var this_8 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE.<anonymous>' call
    this_8.ji_1 = new Vec3(-9890.24, 8932.688, 69.556);
    this_8.ki_1 = new Vec3(0.0, 0.0, 140.0);
    this_8.fi_1 = 0.85;
    this_8.gi_1 = 0.5;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.ak_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, this_8];
    var tmp_8 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.apply' call
    var this_9 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_9.ji_1 = new Vec3(-12338.941, 6764.751, 33.536);
    this_9.ki_1 = new Vec3(0.0, 0.0, 180.0);
    this_9.fi_1 = 0.9;
    this_9.gi_1 = 0.2;
    var tmp_9 = this_9;
    // Inline function 'kotlin.apply' call
    var this_10 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_10.ji_1 = new Vec3(-12192.411, 6887.637, 33.536);
    this_10.ki_1 = new Vec3(0.0, 0.0, -135.0);
    this_10.fi_1 = 0.8;
    this_10.gi_1 = 0.33;
    var tmp_10 = this_10;
    // Inline function 'kotlin.apply' call
    var this_11 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_11.ji_1 = new Vec3(-12480.681, 6825.791, 33.536);
    this_11.ki_1 = new Vec3(0.0, 0.0, 160.0);
    this_11.fi_1 = 0.75;
    this_11.gi_1 = 0.5;
    var tmp_11 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_12.ji_1 = new Vec3(-10744.105, 7007.923, 33.536);
    this_12.ki_1 = new Vec3(0.0, 0.0, -160.0);
    this_12.fi_1 = 0.75;
    this_12.gi_1 = 0.5;
    var tmp_12 = this_12;
    // Inline function 'kotlin.apply' call
    var this_13 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_13.ji_1 = new Vec3(-11312.577, 8120.395, 33.536);
    this_13.ki_1 = new Vec3(0.0, 0.0, 50.0);
    this_13.fi_1 = 0.75;
    this_13.gi_1 = 0.75;
    var tmp_13 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Penguins.IDLE2.<anonymous>' call
    this_14.ji_1 = new Vec3(-10070.444, 7941.108, 65.833);
    this_14.ki_1 = new Vec3(0.0, 0.0, 155.0);
    this_14.fi_1 = 0.75;
    this_14.gi_1 = 0.8;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_8.bk_1 = [tmp_9, tmp_10, tmp_11, tmp_12, tmp_13, this_14];
  }
  var Penguins_instance;
  function Penguins_getInstance() {
    if (Penguins_instance == null)
      new Penguins();
    return Penguins_instance;
  }
  function toggleDayNightObjects($this) {
    var isDay = Colors_getInstance().dj_1[$this.settings.timeOfDay.b4_1].ui_1;
    $this.commandStars.enabled = !isDay;
    $this.groupBirds.enabled = isDay;
    $this.groupAnimalsAnimated.enabled = isDay;
    $this.groupAnimalsSleeping.enabled = !isDay;
    $this.groupShips.enabled = isDay;
  }
  function updateColors($this) {
    var colors = Colors_getInstance().dj_1[$this.settings.timeOfDay.b4_1];
    setUniform($this.tk_1.q(2), colors.cj_1.r, colors.cj_1.g, colors.cj_1.b, colors.cj_1.a);
    setUniform_0($this.tk_1.q(3), 0.0, 1500.0);
    setUniform($this.vk_1.q(1), colors.zi_1.r, colors.zi_1.g, colors.zi_1.b, colors.zi_1.a);
    setUniform($this.wk_1.q(1), colors.yi_1.r, colors.yi_1.g, colors.yi_1.b, colors.yi_1.a);
    var tmp = $this.wk_1.q(2);
    // Inline function 'kotlin.math.sin' call
    var x = $this.timers.ci(Timers_CloudsAnimation_getInstance()) * $this.PIf * 2.0;
    var tmp$ret$0 = Math.sin(x);
    setUniform_1(tmp, tmp$ret$0);
    $this.commandClouds.transform.l9_1.z = $this.timers.ci(Timers_CloudsRotation_getInstance()) * 360.0;
  }
  function updateWater($this) {
    var colors = Colors_getInstance().dj_1[$this.settings.timeOfDay.b4_1];
    var k = 0.2;
    var timeFract = $this.timers.ci(Timers_Water_getInstance()) * 80.0 * k % 1.0;
    timeFract = timeFract / k;
    setUniform_1($this.uk_1.q(2), timeFract);
    setUniform_1($this.uk_1.q(3), $this.timers.ci(Timers_WaterLarge_getInstance()));
    setUniform_1($this.uk_1.q(4), 15.0);
    setUniform($this.uk_1.q(7), colors.aj_1.r, colors.aj_1.g, colors.aj_1.b, colors.aj_1.a);
    setUniform($this.uk_1.q(8), colors.bj_1.r, colors.bj_1.g, colors.bj_1.b, colors.bj_1.a);
    setUniform_0($this.uk_1.q(5), 10000.0, 15000.0);
    setUniform($this.uk_1.q(6), 5000.0, 2000.0, 1.0, $this.settings.blurred ? 100.0 : 20000.0);
  }
  function updateTimeOfDayTextures($this) {
    $this.uniformPaletteTexture.value = Textures_getInstance().nl_1[$this.settings.timeOfDay.b4_1];
    $this.uniformSkyTexture.value = Textures_getInstance().ol_1[$this.settings.timeOfDay.b4_1];
  }
  function updateSun($this) {
    var colors = Colors_getInstance().dj_1[$this.settings.timeOfDay.b4_1];
    $this.commandSun.enabled = !colors.vi_1;
    $this.commandSunLow.enabled = colors.vi_1;
  }
  function updateBirds($this) {
    var tmp = $this.groupBirds.commands;
    var commands = isInterface(tmp, List) ? tmp : THROW_CCE();
    var angle = $this.timers.ci(Timers_BirdsFly_getInstance()) * $this.PIf * 2.0;
    setBirdPosition($this, angle, 0.0, 0.0, commands.q(0).transform.k9_1);
    setBirdPosition($this, -angle - $this.PIf, 0.0, -4000.0, commands.q(1).transform.k9_1);
    setBirdPosition($this, -angle - $this.PIf, 0.0, 3000.0, commands.q(2).transform.k9_1);
    setBirdPosition($this, angle, 7000.0, 3000.0, commands.q(3).transform.k9_1);
    setBirdPosition($this, -angle - $this.PIf, 5000.0, 3000.0, commands.q(4).transform.k9_1);
    setBirdPosition($this, angle, -5000.0, 7000.0, commands.q(5).transform.k9_1);
    commands.q(0).transform.l9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    commands.q(1).transform.l9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(2).transform.l9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(3).transform.l9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    commands.q(4).transform.l9_1.z = (angle + $this.PIf / 2.0) * 57.29578;
    commands.q(5).transform.l9_1.z = (-angle + $this.PIf / 2.0) * 57.29578;
    var wingTimer1 = $this.timers.ci(Timers_BirdWings1_getInstance());
    var wingTimer2 = $this.timers.ci(Timers_BirdWings2_getInstance());
    setAnimationUniforms$default($this, wingTimer1, Animations_getInstance().oi_1, commands.q(0).uniforms);
    setAnimationUniforms$default($this, wingTimer2, Animations_getInstance().oi_1, commands.q(1).uniforms);
    setAnimationUniforms$default($this, wingTimer1 + 0.3, Animations_getInstance().oi_1, commands.q(2).uniforms);
    setAnimationUniforms$default($this, wingTimer2 + 0.5, Animations_getInstance().oi_1, commands.q(3).uniforms);
    setAnimationUniforms$default($this, wingTimer1 + 0.5, Animations_getInstance().oi_1, commands.q(4).uniforms);
    setAnimationUniforms$default($this, wingTimer2 + 0.6, Animations_getInstance().oi_1, commands.q(5).uniforms);
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
    setUniform_2(uniforms.q(2), animation.gb_1);
    setUniform_1(uniforms.q(3), 1.0 / animation.lb_1);
    setUniform(uniforms.q(5), animation.gb_1, animation.ib_1, startEndStart ? animation.nb(timer) : animation.ob(timer), animation.mb_1);
  }
  function setAnimationUniforms$default($this, timerAnim, animation, uniforms, startEndStart, $super) {
    startEndStart = startEndStart === VOID ? true : startEndStart;
    return setAnimationUniforms($this, timerAnim, animation, uniforms, startEndStart);
  }
  function updateShips($this) {
    var tmp = $this.groupShips.commands;
    var commandsShips = isInterface(tmp, List) ? tmp : THROW_CCE();
    var timerSpline = $this.timers.ci(Timers_Ships_getInstance());
    var inductionVariable = 0;
    var last = ShipsConfig_getInstance().pl_1.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var ship = ShipsConfig_getInstance().pl_1[i];
        var command = commandsShips.q(i);
        var position = ship.ql_1.ld(timerSpline);
        var rotation = ship.ql_1.sd(timerSpline).z + 180.0;
        command.transform.k9_1.x = position.x;
        command.transform.k9_1.y = position.y;
        command.transform.k9_1.z = position.z;
        command.transform.l9_1.z = rotation;
        command.transform.m9_1.x = ship.rl_1;
        command.transform.m9_1.y = ship.rl_1;
        command.transform.m9_1.z = ship.rl_1;
      }
       while (inductionVariable < last);
  }
  function updateAnimalsAnimated($this) {
    var timerPenguinIdle = $this.timers.ci(Timers_PenguinIdle_getInstance());
    var timerPenguinIdle2 = $this.timers.ci(Timers_PenguinIdle2_getInstance());
    var timerSealIdle = $this.timers.ci(Timers_SealIdleAnim_getInstance());
    var timerSealWalk = $this.timers.ci(Timers_SealWalkAnim_getInstance());
    var timerSealSpline = $this.timers.ci(Timers_SealWalkSpline_getInstance());
    var tmp = $this.groupPenguinsIdle.commands;
    var commandsPenguins1 = isInterface(tmp, List) ? tmp : THROW_CCE();
    var tmp_0 = $this.groupPenguinsIdle2.commands;
    var commandsPenguins2 = isInterface(tmp_0, List) ? tmp_0 : THROW_CCE();
    var tmp_1 = $this.groupSealIdle.commands;
    var commandsSealsIdle = isInterface(tmp_1, List) ? tmp_1 : THROW_CCE();
    var tmp_2 = $this.groupSealWalking.commands;
    var commandsSealsWalking = isInterface(tmp_2, List) ? tmp_2 : THROW_CCE();
    var inductionVariable = 0;
    var last = Penguins_getInstance().ak_1.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var command = commandsPenguins1.q(i);
        var config = Penguins_getInstance().ak_1[i];
        setAnimationUniforms$default($this, timerPenguinIdle + config.gi_1, Animations_getInstance().pi_1, command.uniforms);
      }
       while (inductionVariable < last);
    var inductionVariable_0 = 0;
    var last_0 = Penguins_getInstance().bk_1.length;
    if (inductionVariable_0 < last_0)
      do {
        var i_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        var command_0 = commandsPenguins2.q(i_0);
        var config_0 = Penguins_getInstance().bk_1[i_0];
        setAnimationUniforms$default($this, timerPenguinIdle2 + config_0.gi_1, Animations_getInstance().qi_1, command_0.uniforms);
      }
       while (inductionVariable_0 < last_0);
    var inductionVariable_1 = 0;
    var last_1 = Seals_getInstance().tl_1.length;
    if (inductionVariable_1 < last_1)
      do {
        var i_1 = inductionVariable_1;
        inductionVariable_1 = inductionVariable_1 + 1 | 0;
        var command_1 = commandsSealsIdle.q(i_1);
        var config_1 = Seals_getInstance().tl_1[i_1];
        setAnimationUniforms($this, timerSealIdle + config_1.gi_1, Animations_getInstance().ri_1, command_1.uniforms, false);
      }
       while (inductionVariable_1 < last_1);
    var inductionVariable_2 = 0;
    var last_2 = Seals_getInstance().ul_1.length;
    if (inductionVariable_2 < last_2)
      $l$loop: do {
        var i_2 = inductionVariable_2;
        inductionVariable_2 = inductionVariable_2 + 1 | 0;
        var command_2 = commandsSealsWalking.q(i_2);
        var config_2 = Seals_getInstance().ul_1[i_2];
        if (config_2.ni_1 == null) {
          continue $l$loop;
        }
        var position = ensureNotNull(config_2.ni_1).ld(timerSealSpline);
        var rotation = ensureNotNull(config_2.ni_1).sd(timerSealSpline).z - 90.0;
        setAnimationUniforms($this, timerSealWalk + config_2.gi_1, Animations_getInstance().si_1, command_2.uniforms, false);
        command_2.transform.k9_1.x = position.x;
        command_2.transform.k9_1.y = position.y;
        command_2.transform.k9_1.z = position.z;
        command_2.transform.l9_1.z = rotation;
        command_2.transform.m9_1.x = config_2.fi_1;
        command_2.transform.m9_1.y = config_2.fi_1;
        command_2.transform.m9_1.z = config_2.fi_1;
      }
       while (inductionVariable_2 < last_2);
  }
  function ArcticScene() {
    Scene.call(this);
    this.timers = new TimersMap();
    this.hk_1 = 1000000.0;
    this.ik_1 = 23000.0;
    this.jk_1 = 2000.0;
    this.FOV_TRANSITION = 20.0;
    this.rk_1 = mutableListOf([get_HINT_VRS_4X4()]);
    this.uniformPaletteTexture = new UniformTextureValue(Textures_getInstance().xk_1);
    this.uniformSkyTexture = new UniformTextureValue(Textures_getInstance().bl_1);
    this.BIRD_FLIGHT_RADIUS = 19000.0;
    this.PIf = 3.1415927;
    this.meshes = Meshes_getInstance().zj_1;
    this.textures = Textures_getInstance().ml_1;
    this.shaders = Shaders_getInstance().fm_1;
    Companion_instance.gm(this.timers);
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
    this.cameraAnimator = new CameraPathAnimator(this.hk_1, this.ik_1, this.jk_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance().ti_1);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_1.color = new Vec4(1.0, 0.0, 1.0, 1.0);
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_0.ok_1 = this_1;
    var statePaletteFp16 = new DrawMeshState(Shaders_getInstance().vl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_HALF_getInstance(), 6)]), 8));
    var stateDiffuseFp16 = new DrawMeshState(Shaders_getInstance().wl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 12)]), 16));
    var stateWater = new DrawMeshState(Shaders_getInstance().yl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var stateDiffuseZFog = new DrawMeshState(Shaders_getInstance().xl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_HALF_getInstance(), 6)]), 8));
    var txOrigin = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var tmp_1 = this;
    // Inline function 'kotlin.apply' call
    var this_2 = DrawStaticMeshCommandConstructor(Meshes_getInstance().nj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_2.hints = this.rk_1;
    tmp_1.commandSun = this_2;
    var tmp_2 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = DrawStaticMeshCommandConstructor(Meshes_getInstance().oj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_3.hints = this.rk_1;
    tmp_2.commandSunLow = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_4.name = 'sun';
    this_4.enabled = true;
    this_4.commands = mutableListOf([this.commandSun, this.commandSunLow]);
    var groupSun = this_4;
    this.sk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]);
    this.tk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(2))]);
    // Inline function 'kotlin.apply' call
    var this_5 = new GroupCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_5.name = 'mountains';
    this_5.enabled = true;
    var tmp_3 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = DrawStaticMeshCommandConstructor(Meshes_getInstance().lj_1, this.sk_1, statePaletteFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>.<anonymous>' call
    this_6.hints = this.rk_1;
    var tmp_4 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = DrawStaticMeshCommandConstructor(Meshes_getInstance().mj_1, this.tk_1, stateDiffuseZFog, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>.<anonymous>' call
    this_7.hints = this.rk_1;
    tmp_3.commands = mutableListOf([tmp_4, this_7]);
    var groupMountains = this_5;
    this.uk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance().gl_1), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), UniformFloatValueWithArray(new Float32Array(2)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(4))]);
    var commandWater = DrawStaticMeshCommandConstructor(Meshes_getInstance().pj_1, this.uk_1, stateWater, txOrigin);
    var stateSky = new DrawMeshState(Shaders_getInstance().zl_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 12)]), 16));
    var commandSky = DrawStaticMeshCommandConstructor(Meshes_getInstance().qj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformSkyTexture, new UniformTextureValue(Textures_getInstance().fl_1)]), stateSky, txOrigin);
    var stateStars = new DrawMeshState(Shaders_getInstance().am_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0)), 12));
    this.vk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4))]);
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_8 = DrawStaticMeshCommandConstructor(Meshes_getInstance().rj_1, this.vk_1, stateStars, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_8.hints = this.rk_1;
    tmp_5.commandStars = this_8;
    var stateClouds = new DrawMeshState(Shaders_getInstance().cm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0), new VertexAttribute(AttributeType_U0_getInstance(), 1, VertexFormat_UBYTE_NORMALIZED_getInstance(), 12)]), 16));
    this.wk_1 = listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformFloatValueWithArray(new Float32Array(1))]);
    var tmp_6 = this;
    // Inline function 'kotlin.apply' call
    var this_9 = new DrawTransformedMeshCommand(Meshes_getInstance().sj_1, this.wk_1, stateClouds, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_9.hints = this.rk_1;
    tmp_6.commandClouds = this_9;
    var stateBird = new DrawMeshState(Shaders_getInstance().dm_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), null);
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_10 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 10000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_10.hints = this.rk_1;
    var tmp_8 = this_10;
    // Inline function 'kotlin.apply' call
    var this_11 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 11000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_11.hints = this.rk_1;
    var tmp_9 = this_11;
    // Inline function 'kotlin.apply' call
    var this_12 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 12000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_12.hints = this.rk_1;
    var tmp_10 = this_12;
    // Inline function 'kotlin.apply' call
    var this_13 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 13000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_13.hints = this.rk_1;
    var tmp_11 = this_13;
    // Inline function 'kotlin.apply' call
    var this_14 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 14000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_14.hints = this.rk_1;
    var tmp_12 = this_14;
    // Inline function 'kotlin.apply' call
    var this_15 = new DrawTransformedMeshCommand(Meshes_getInstance().tj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), UniformFloatValueWithArray(new Float32Array(4)), UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().hl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateBird, new AffineTranformation(new Vec3(0.0, 0.0, 15000.0), new Vec3(0.0, 0.0, 0.0), new Vec3(6.0, 3.0, 3.0)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_15.hints = this.rk_1;
    tmp_7.groupBirds = GroupCommandArr(true, [tmp_8, tmp_9, tmp_10, tmp_11, tmp_12, this_15]);
    var tmp_13 = this;
    // Inline function 'kotlin.apply' call
    var this_16 = new DrawTransformedMeshCommand(Meshes_getInstance().uj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_16.hints = this.rk_1;
    var tmp_14 = this_16;
    // Inline function 'kotlin.apply' call
    var this_17 = new DrawTransformedMeshCommand(Meshes_getInstance().uj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_17.hints = this.rk_1;
    var tmp_15 = this_17;
    // Inline function 'kotlin.apply' call
    var this_18 = new DrawTransformedMeshCommand(Meshes_getInstance().uj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), statePaletteFp16, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_18.hints = this.rk_1;
    tmp_13.groupShips = GroupCommandArr(true, [tmp_14, tmp_15, this_18]);
    var stateAnimatedTextured = new DrawMeshState(Shaders_getInstance().em_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_UV0_getInstance(), 0, VertexFormat_HALF2_getInstance(), 0)), 4));
    var tmp_16 = this;
    // Inline function 'kotlin.apply' call
    var this_19 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[0].ji_1, Penguins_getInstance().ak_1[0].ki_1, new Vec3(Penguins_getInstance().ak_1[0].fi_1, Penguins_getInstance().ak_1[0].fi_1, Penguins_getInstance().ak_1[0].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_19.hints = this.rk_1;
    var tmp_17 = this_19;
    // Inline function 'kotlin.apply' call
    var this_20 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[1].ji_1, Penguins_getInstance().ak_1[1].ki_1, new Vec3(Penguins_getInstance().ak_1[1].fi_1, Penguins_getInstance().ak_1[1].fi_1, Penguins_getInstance().ak_1[1].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_20.hints = this.rk_1;
    var tmp_18 = this_20;
    // Inline function 'kotlin.apply' call
    var this_21 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[2].ji_1, Penguins_getInstance().ak_1[2].ki_1, new Vec3(Penguins_getInstance().ak_1[2].fi_1, Penguins_getInstance().ak_1[2].fi_1, Penguins_getInstance().ak_1[2].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_21.hints = this.rk_1;
    var tmp_19 = this_21;
    // Inline function 'kotlin.apply' call
    var this_22 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[3].ji_1, Penguins_getInstance().ak_1[3].ki_1, new Vec3(Penguins_getInstance().ak_1[3].fi_1, Penguins_getInstance().ak_1[3].fi_1, Penguins_getInstance().ak_1[3].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_22.hints = this.rk_1;
    var tmp_20 = this_22;
    // Inline function 'kotlin.apply' call
    var this_23 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[4].ji_1, Penguins_getInstance().ak_1[4].ki_1, new Vec3(Penguins_getInstance().ak_1[4].fi_1, Penguins_getInstance().ak_1[4].fi_1, Penguins_getInstance().ak_1[4].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_23.hints = this.rk_1;
    var tmp_21 = this_23;
    // Inline function 'kotlin.apply' call
    var this_24 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[5].ji_1, Penguins_getInstance().ak_1[5].ki_1, new Vec3(Penguins_getInstance().ak_1[5].fi_1, Penguins_getInstance().ak_1[5].fi_1, Penguins_getInstance().ak_1[5].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_24.hints = this.rk_1;
    var tmp_22 = this_24;
    // Inline function 'kotlin.apply' call
    var this_25 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[6].ji_1, Penguins_getInstance().ak_1[6].ki_1, new Vec3(Penguins_getInstance().ak_1[6].fi_1, Penguins_getInstance().ak_1[6].fi_1, Penguins_getInstance().ak_1[6].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_25.hints = this.rk_1;
    var tmp_23 = this_25;
    // Inline function 'kotlin.apply' call
    var this_26 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[7].ji_1, Penguins_getInstance().ak_1[7].ki_1, new Vec3(Penguins_getInstance().ak_1[7].fi_1, Penguins_getInstance().ak_1[7].fi_1, Penguins_getInstance().ak_1[7].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_26.hints = this.rk_1;
    var tmp_24 = this_26;
    // Inline function 'kotlin.apply' call
    var this_27 = DrawStaticMeshCommandConstructor(Meshes_getInstance().vj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().il_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().ak_1[8].ji_1, Penguins_getInstance().ak_1[8].ki_1, new Vec3(Penguins_getInstance().ak_1[8].fi_1, Penguins_getInstance().ak_1[8].fi_1, Penguins_getInstance().ak_1[8].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_27.hints = this.rk_1;
    tmp_16.groupPenguinsIdle = GroupCommandArr(true, [tmp_17, tmp_18, tmp_19, tmp_20, tmp_21, tmp_22, tmp_23, tmp_24, this_27]);
    var tmp_25 = this;
    // Inline function 'kotlin.apply' call
    var this_28 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[0].ji_1, Penguins_getInstance().bk_1[0].ki_1, new Vec3(Penguins_getInstance().bk_1[0].fi_1, Penguins_getInstance().bk_1[0].fi_1, Penguins_getInstance().bk_1[0].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_28.hints = this.rk_1;
    var tmp_26 = this_28;
    // Inline function 'kotlin.apply' call
    var this_29 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[1].ji_1, Penguins_getInstance().bk_1[1].ki_1, new Vec3(Penguins_getInstance().bk_1[1].fi_1, Penguins_getInstance().bk_1[1].fi_1, Penguins_getInstance().bk_1[1].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_29.hints = this.rk_1;
    var tmp_27 = this_29;
    // Inline function 'kotlin.apply' call
    var this_30 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[2].ji_1, Penguins_getInstance().bk_1[2].ki_1, new Vec3(Penguins_getInstance().bk_1[2].fi_1, Penguins_getInstance().bk_1[2].fi_1, Penguins_getInstance().bk_1[2].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_30.hints = this.rk_1;
    var tmp_28 = this_30;
    // Inline function 'kotlin.apply' call
    var this_31 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[3].ji_1, Penguins_getInstance().bk_1[3].ki_1, new Vec3(Penguins_getInstance().bk_1[3].fi_1, Penguins_getInstance().bk_1[3].fi_1, Penguins_getInstance().bk_1[3].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_31.hints = this.rk_1;
    var tmp_29 = this_31;
    // Inline function 'kotlin.apply' call
    var this_32 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[4].ji_1, Penguins_getInstance().bk_1[4].ki_1, new Vec3(Penguins_getInstance().bk_1[4].fi_1, Penguins_getInstance().bk_1[4].fi_1, Penguins_getInstance().bk_1[4].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_32.hints = this.rk_1;
    var tmp_30 = this_32;
    // Inline function 'kotlin.apply' call
    var this_33 = DrawStaticMeshCommandConstructor(Meshes_getInstance().wj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().jl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Penguins_getInstance().bk_1[5].ji_1, Penguins_getInstance().bk_1[5].ki_1, new Vec3(Penguins_getInstance().bk_1[5].fi_1, Penguins_getInstance().bk_1[5].fi_1, Penguins_getInstance().bk_1[5].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_33.hints = this.rk_1;
    tmp_25.groupPenguinsIdle2 = GroupCommandArr(true, [tmp_26, tmp_27, tmp_28, tmp_29, tmp_30, this_33]);
    var tmp_31 = this;
    // Inline function 'kotlin.apply' call
    var this_34 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[0].ji_1, Seals_getInstance().tl_1[0].ki_1, new Vec3(Seals_getInstance().tl_1[0].fi_1, Seals_getInstance().tl_1[0].fi_1, Seals_getInstance().tl_1[0].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_34.hints = this.rk_1;
    var tmp_32 = this_34;
    // Inline function 'kotlin.apply' call
    var this_35 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[1].ji_1, Seals_getInstance().tl_1[1].ki_1, new Vec3(Seals_getInstance().tl_1[1].fi_1, Seals_getInstance().tl_1[1].fi_1, Seals_getInstance().tl_1[1].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_35.hints = this.rk_1;
    var tmp_33 = this_35;
    // Inline function 'kotlin.apply' call
    var this_36 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[2].ji_1, Seals_getInstance().tl_1[2].ki_1, new Vec3(Seals_getInstance().tl_1[2].fi_1, Seals_getInstance().tl_1[2].fi_1, Seals_getInstance().tl_1[2].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_36.hints = this.rk_1;
    var tmp_34 = this_36;
    // Inline function 'kotlin.apply' call
    var this_37 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[3].ji_1, Seals_getInstance().tl_1[3].ki_1, new Vec3(Seals_getInstance().tl_1[3].fi_1, Seals_getInstance().tl_1[3].fi_1, Seals_getInstance().tl_1[3].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_37.hints = this.rk_1;
    var tmp_35 = this_37;
    // Inline function 'kotlin.apply' call
    var this_38 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[4].ji_1, Seals_getInstance().tl_1[4].ki_1, new Vec3(Seals_getInstance().tl_1[4].fi_1, Seals_getInstance().tl_1[4].fi_1, Seals_getInstance().tl_1[4].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_38.hints = this.rk_1;
    var tmp_36 = this_38;
    // Inline function 'kotlin.apply' call
    var this_39 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[5].ji_1, Seals_getInstance().tl_1[5].ki_1, new Vec3(Seals_getInstance().tl_1[5].fi_1, Seals_getInstance().tl_1[5].fi_1, Seals_getInstance().tl_1[5].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_39.hints = this.rk_1;
    var tmp_37 = this_39;
    // Inline function 'kotlin.apply' call
    var this_40 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[6].ji_1, Seals_getInstance().tl_1[6].ki_1, new Vec3(Seals_getInstance().tl_1[6].fi_1, Seals_getInstance().tl_1[6].fi_1, Seals_getInstance().tl_1[6].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_40.hints = this.rk_1;
    var tmp_38 = this_40;
    // Inline function 'kotlin.apply' call
    var this_41 = DrawStaticMeshCommandConstructor(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().kl_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation(Seals_getInstance().tl_1[7].ji_1, Seals_getInstance().tl_1[7].ki_1, new Vec3(Seals_getInstance().tl_1[7].fi_1, Seals_getInstance().tl_1[7].fi_1, Seals_getInstance().tl_1[7].fi_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_41.hints = this.rk_1;
    tmp_31.groupSealIdle = GroupCommandArr(true, [tmp_32, tmp_33, tmp_34, tmp_35, tmp_36, tmp_37, tmp_38, this_41]);
    var tmp_39 = this;
    // Inline function 'kotlin.apply' call
    var this_42 = new DrawTransformedMeshCommand(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_42.hints = this.rk_1;
    var tmp_40 = this_42;
    // Inline function 'kotlin.apply' call
    var this_43 = new DrawTransformedMeshCommand(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_43.hints = this.rk_1;
    var tmp_41 = this_43;
    // Inline function 'kotlin.apply' call
    var this_44 = new DrawTransformedMeshCommand(Meshes_getInstance().xj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture, UniformIntValueWithArray(new Int32Array(1)), UniformFloatValueWithArray(new Float32Array(1)), new UniformTextureValue(Textures_getInstance().ll_1), UniformFloatValueWithArray(new Float32Array(4))]), stateAnimatedTextured, new AffineTranformation());
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_44.hints = this.rk_1;
    tmp_39.groupSealWalking = GroupCommandArr(true, [tmp_40, tmp_41, this_44]);
    this.groupAnimalsAnimated = GroupCommandArr(true, [this.groupPenguinsIdle, this.groupPenguinsIdle2, this.groupSealIdle, this.groupSealWalking]);
    var tmp_42 = this;
    // Inline function 'kotlin.apply' call
    var this_45 = DrawStaticMeshCommandConstructor(Meshes_getInstance().yj_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), this.uniformPaletteTexture]), stateDiffuseFp16, txOrigin);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_45.hints = this.rk_1;
    tmp_42.groupAnimalsSleeping = GroupCommandArr(true, [this_45]);
    var tmp_43 = this;
    // Inline function 'kotlin.apply' call
    var this_46 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_46.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_43.nk_1 = GroupCommandArr(true, [this.ok_1, this_46]);
    var tmp_44 = this;
    // Inline function 'kotlin.apply' call
    var this_47 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_47.color0 = new Vec4(0.65, 0.65, 0.65, 1.0);
    this_47.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_44.pk_1 = this_47;
    this.kk_1 = GroupCommandArr(true, [MainPassCommandArr(true, [this.nk_1, this.groupBirds, this.groupShips, this.groupAnimalsAnimated, this.groupAnimalsSleeping, groupSun, groupMountains, commandWater, this.commandStars, this.commandClouds, commandSky, this.pk_1])]);
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
    this_48.commands = mutableListOf([this.nk_1, this.groupShips, this.groupAnimalsAnimated, this.groupAnimalsSleeping, groupSun, groupMountains, commandWater, this.commandStars, this.commandClouds, commandSky, this.pk_1]);
    tmp_45.mk_1 = this_48;
    var tmp_46 = this;
    // Inline function 'kotlin.apply' call
    var this_49 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.ArcticScene.<anonymous>' call
    this_49.name = 'draw blurred';
    this_49.blending = get_BLENDING_NONE();
    tmp_46.qk_1 = this_49;
    this.lk_1 = GroupCommandArr(false, [this.mk_1, MainPassCommandArr(true, [this.nk_1, this.qk_1])]);
    this.commands = mutableListOf([this.kk_1, this.lk_1]);
  }
  protoOf(ArcticScene).hm = function () {
    return this.timers;
  };
  protoOf(ArcticScene).im = function () {
    return this.cameraAnimator;
  };
  protoOf(ArcticScene).jm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(ArcticScene).km = function () {
    return this.settings;
  };
  protoOf(ArcticScene).lm = function () {
    return this.uniformPaletteTexture;
  };
  protoOf(ArcticScene).mm = function () {
    return this.uniformSkyTexture;
  };
  protoOf(ArcticScene).nm = function () {
    return this.commandClouds;
  };
  protoOf(ArcticScene).om = function () {
    return this.commandStars;
  };
  protoOf(ArcticScene).pm = function () {
    return this.groupBirds;
  };
  protoOf(ArcticScene).qm = function () {
    return this.BIRD_FLIGHT_RADIUS;
  };
  protoOf(ArcticScene).rm = function () {
    return this.groupShips;
  };
  protoOf(ArcticScene).sm = function () {
    return this.groupAnimalsAnimated;
  };
  protoOf(ArcticScene).tm = function () {
    return this.groupAnimalsSleeping;
  };
  protoOf(ArcticScene).um = function () {
    return this.groupPenguinsIdle;
  };
  protoOf(ArcticScene).vm = function () {
    return this.groupPenguinsIdle2;
  };
  protoOf(ArcticScene).wm = function () {
    return this.groupSealIdle;
  };
  protoOf(ArcticScene).xm = function () {
    return this.groupSealWalking;
  };
  protoOf(ArcticScene).ym = function () {
    return this.commandSun;
  };
  protoOf(ArcticScene).zm = function () {
    return this.commandSunLow;
  };
  protoOf(ArcticScene).an = function () {
    return this.PIf;
  };
  protoOf(ArcticScene).updateTimers = function (time) {
    this.timers.ei(time);
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
    this.kk_1.enabled = !this.settings.blurred;
    this.lk_1.enabled = this.settings.blurred;
    this.pk_1.enabled = this.settings.vignette;
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    if ((this.cameraAnimator.timer > 0.99 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().o5() < 0.5 : false) {
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
      Matrix_getInstance().sg(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    toggleDayNightObjects(this);
    updateTimeOfDayTextures(this);
    updateSun(this);
    updateBirds(this);
    updateShips(this);
    updateAnimalsAnimated(this);
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
    this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().o5() < 0.5;
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
    this_0.ji_1 = new Vec3(-10197.612, -11412.881, 163.703);
    this_0.ki_1 = new Vec3(0.0, 0.0, 305.0);
    this_0.fi_1 = 21.6;
    this_0.gi_1 = 0.1;
    var tmp_0 = this_0;
    // Inline function 'kotlin.apply' call
    var this_1 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_1.ji_1 = new Vec3(-11490.098, -10868.786, 163.703);
    this_1.ki_1 = new Vec3(0.0, 0.0, 180.0);
    this_1.fi_1 = 21.0;
    this_1.gi_1 = 0.2;
    var tmp_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_2.ji_1 = new Vec3(-12481.07, -9990.127, 163.703);
    this_2.ki_1 = new Vec3(0.0, 0.0, 40.0);
    this_2.fi_1 = 24.0;
    this_2.gi_1 = 0.0;
    var tmp_2 = this_2;
    // Inline function 'kotlin.apply' call
    var this_3 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_3.ji_1 = new Vec3(-8848.467, -10551.67, 163.703);
    this_3.ki_1 = new Vec3(0.0, 0.0, 270.0);
    this_3.fi_1 = 23.0;
    this_3.gi_1 = 0.66;
    var tmp_3 = this_3;
    // Inline function 'kotlin.apply' call
    var this_4 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_4.ji_1 = new Vec3(-11421.474, -8197.367, 163.703);
    this_4.ki_1 = new Vec3(0.0, 0.0, 155.0);
    this_4.fi_1 = 22.0;
    this_4.gi_1 = 0.3;
    var tmp_4 = this_4;
    // Inline function 'kotlin.apply' call
    var this_5 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_5.ji_1 = new Vec3(-9098.065, -9784.568, 163.703);
    this_5.ki_1 = new Vec3(0.0, 0.0, 180.0);
    this_5.fi_1 = 21.0;
    this_5.gi_1 = 0.7;
    var tmp_5 = this_5;
    // Inline function 'kotlin.apply' call
    var this_6 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_6.ji_1 = new Vec3(-8929.758, -9630.826, 163.703);
    this_6.ki_1 = new Vec3(0.0, 0.0, 260.0);
    this_6.fi_1 = 20.0;
    this_6.gi_1 = 0.2;
    var tmp_6 = this_6;
    // Inline function 'kotlin.apply' call
    var this_7 = new AnimatedObjectInfo();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.arctic.Seals.IDLE.<anonymous>' call
    this_7.ji_1 = new Vec3(-9159.626, -9498.492, 163.703);
    this_7.ki_1 = new Vec3(0.0, 0.0, 25.0);
    this_7.fi_1 = 22.0;
    this_7.gi_1 = 0.4;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp.tl_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, this_7];
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
    tmp_8.ni_1 = Spline3D_init_$Create$(true, tmp_9, tmp_10, tmp$ret$13);
    this_8.fi_1 = 25.0;
    this_8.gi_1 = 0.4;
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
    tmp_12.ni_1 = Spline3D_init_$Create$(true, tmp_13, tmp_14, tmp$ret$17);
    this_9.fi_1 = 22.0;
    this_9.gi_1 = 0.6;
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
    tmp_16.ni_1 = Spline3D_init_$Create$(true, tmp_17, tmp_18, tmp$ret$21);
    this_10.fi_1 = 23.0;
    this_10.gi_1 = 0.88;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_7.ul_1 = [tmp_11, tmp_15, this_10];
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
    TimeOfDay_Day_instance = new TimeOfDay('Day', 0);
    TimeOfDay_Night_instance = new TimeOfDay('Night', 1);
    TimeOfDay_Sunrise_instance = new TimeOfDay('Sunrise', 2);
    TimeOfDay_Sunset_instance = new TimeOfDay('Sunset', 3);
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
  protoOf(ArcticSettings).dn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(ArcticSettings).en = function () {
    return this.cameraPeriod;
  };
  protoOf(ArcticSettings).fn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(ArcticSettings).gn = function () {
    return this.vignette;
  };
  protoOf(ArcticSettings).hn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(ArcticSettings).in = function () {
    return this.blurred;
  };
  protoOf(ArcticSettings).jn = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(ArcticSettings).kn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(ArcticSettings).ln = function (_set____db54di) {
    this.timeOfDay = _set____db54di;
  };
  protoOf(ArcticSettings).mn = function () {
    return this.timeOfDay;
  };
  protoOf(ArcticSettings).nn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(ArcticSettings).on = function () {
    return this.clock;
  };
  protoOf(ArcticSettings).pn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(ArcticSettings).qn = function () {
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
    this.vl_1 = new Shader('Palette');
    this.wl_1 = new Shader('Diffuse');
    this.xl_1 = new Shader('DiffuseZFog');
    this.yl_1 = new Shader('CausticsWater');
    this.zl_1 = new Shader('SkyDither');
    this.am_1 = new Shader('Color');
    this.bm_1 = new Shader('ColorAnimatedTextureChunked');
    this.cm_1 = new Shader('Cloud');
    this.dm_1 = new Shader('ColorAnimatedTextureChunked');
    this.em_1 = new Shader('DiffuseAnimatedTextureChunked');
    this.fm_1 = mutableListOf([this.wl_1, this.vl_1, this.xl_1, this.yl_1, this.zl_1, this.am_1, this.bm_1, this.cm_1, this.dm_1, this.em_1]);
  }
  var Shaders_instance;
  function Shaders_getInstance() {
    if (Shaders_instance == null)
      new Shaders();
    return Shaders_instance;
  }
  function ShipConfig(spline, scale, animTimerOffset) {
    this.ql_1 = spline;
    this.rl_1 = scale;
    this.sl_1 = animTimerOffset;
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
    tmp.pl_1 = [tmp_2, tmp_5, new ShipConfig(Spline3D_init_$Create$(true, tmp_6, tmp_7, tmp$ret$8), 1.4, 0.88)];
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
    tmp.xk_1 = this_0;
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
    tmp_0.yk_1 = this_1;
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
    tmp_1.zk_1 = this_2;
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
    tmp_2.al_1 = this_3;
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
    tmp_3.bl_1 = this_4;
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
    tmp_4.cl_1 = this_5;
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
    tmp_5.dl_1 = this_6;
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
    tmp_6.el_1 = this_7;
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
    tmp_7.fl_1 = this_8;
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
    tmp_8.gl_1 = this_9;
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
    this_10.width = Animations_getInstance().oi_1.gb_1;
    this_10.height = Animations_getInstance().oi_1.lb_1;
    tmp_9.hl_1 = this_10;
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
    this_11.width = Animations_getInstance().pi_1.gb_1;
    this_11.height = Animations_getInstance().pi_1.lb_1;
    tmp_10.il_1 = this_11;
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
    this_12.width = Animations_getInstance().qi_1.gb_1;
    this_12.height = Animations_getInstance().qi_1.lb_1;
    tmp_11.jl_1 = this_12;
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
    this_13.width = Animations_getInstance().ri_1.gb_1;
    this_13.height = Animations_getInstance().ri_1.lb_1;
    tmp_12.kl_1 = this_13;
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
    this_14.width = Animations_getInstance().si_1.gb_1;
    this_14.height = Animations_getInstance().si_1.lb_1;
    tmp_13.ll_1 = this_14;
    this.ml_1 = mutableListOf([this.xk_1, this.yk_1, this.zk_1, this.al_1, this.bl_1, this.cl_1, this.dl_1, this.el_1, this.fl_1, this.gl_1, this.hl_1, this.il_1, this.jl_1, this.kl_1, this.ll_1]);
    var tmp_14 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_14.nl_1 = [this.xk_1, this.yk_1, this.zk_1, this.al_1];
    var tmp_15 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_15.ol_1 = [this.bl_1, this.cl_1, this.dl_1, this.el_1];
  }
  var Textures_instance;
  function Textures_getInstance() {
    if (Textures_instance == null)
      new Textures();
    return Textures_instance;
  }
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
  protoOf(Companion).gm = function (timers) {
    timers.ai(Timers_Water_getInstance(), 720000.0);
    timers.ai(Timers_WaterLarge_getInstance(), 60000.0);
    timers.ai(Timers_CloudsRotation_getInstance(), 300000.0);
    timers.ai(Timers_CloudsAnimation_getInstance(), 15000.0);
    timers.ai(Timers_BirdWings1_getInstance(), 1000.0);
    timers.ai(Timers_BirdWings2_getInstance(), 900.0);
    timers.ai(Timers_BirdsFly_getInstance(), 75000.0);
    timers.ai(Timers_Ships_getInstance(), 200000.0);
    timers.ai(Timers_PenguinIdle_getInstance(), 5000.0);
    timers.ai(Timers_PenguinIdle2_getInstance(), 5000.0);
    timers.ai(Timers_SealIdleAnim_getInstance(), 4000.0);
    timers.ai(Timers_SealWalkAnim_getInstance(), 1900.0);
    timers.ai(Timers_SealWalkSpline_getInstance(), 114000.0);
  };
  var Companion_instance;
  var Timers_entriesInitialized;
  function Timers_initEntries() {
    if (Timers_entriesInitialized)
      return Unit_instance;
    Timers_entriesInitialized = true;
    new Timers('Camera', 0);
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
    tmp.rn_1 = [tmp_0, [new CameraPositionPair(new CameraPosition(new Vec3(-842.0926, -846.5076, 129.98555), new Vec3(-674.4083, 775.07825, 47.71223)), new CameraPosition(new Vec3(-828.56775, 790.18756, 129.86708), new Vec3(940.84375, 1304.5559, 46.237785)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1442.4281, -137.39117, 400.79602), new Vec3(98.2589, -729.51196, 445.23422)), new CameraPosition(new Vec3(-165.14899, 2.8690004, 130.22337), new Vec3(1178.7565, 470.28696, 214.73752)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-451.56958, -252.30167, 587.1848), new Vec3(-898.23376, 597.8059, 38.427677)), new CameraPosition(new Vec3(1161.2458, -52.537415, 721.2996), new Vec3(1249.9236, 615.2596, 46.237785)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1809.4268, 206.302, 822.04504), new Vec3(-704.4282, -1200.5166, 570.46594)), new CameraPosition(new Vec3(485.292, 0.00439453, 654.2626), new Vec3(740.58057, 152.70099, 570.47485)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-1201.3511, -321.01813, 1267.3562), new Vec3(-1091.3955, 484.66968, -120.63285)), new CameraPosition(new Vec3(348.40283, 333.19476, 531.56305), new Vec3(1243.907, 207.53552, 454.83487)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(1280.2383, 0.00817871, 765.05676), new Vec3(1020.4136, -0.0057373, 681.30115)), new CameraPosition(new Vec3(-542.4983, -0.00439453, 765.0978), new Vec3(-716.4851, 0.00195313, 656.9107)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(684.19763, -906.22656, 562.2279), new Vec3(293.5536, -235.00806, 457.9884)), new CameraPosition(new Vec3(-355.00952, 702.02734, 585.4181), new Vec3(582.56335, 400.67163, 433.59796)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(255.49573, -216.34082, 356.14874), new Vec3(621.0696, 213.13354, 377.2011)), new CameraPosition(new Vec3(-261.60974, 210.44629, 9.956253), new Vec3(444.66296, 48.16748, 614.7096)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(187.09607, -779.0669, 151.3941), new Vec3(-729.9801, -1107.8511, 366.46796)), new CameraPosition(new Vec3(181.64563, 716.58813, 151.3935), new Vec3(-921.05164, -237.90332, 366.46844)), 1.0)]];
  }
  var Cameras_instance_0;
  function Cameras_getInstance_0() {
    if (Cameras_instance_0 == null)
      new Cameras_0();
    return Cameras_instance_0;
  }
  function DrawClockCommand() {
    Command.call(this);
    this.sn_1 = CommandType_CUSTOM_getInstance();
  }
  protoOf(DrawClockCommand).z9 = function () {
    return this.sn_1;
  };
  function BrutalismScene() {
    Scene.call(this);
    this.timers = new TimersMap();
    this.yn_1 = 1000000.0;
    this.zn_1 = 22000.0;
    this.ao_1 = 3500.0;
    this.FOV_TRANSITION = 20.0;
    this.so_1 = mutableListOf([get_HINT_VRS_NONE()]);
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
    this.cameraAnimator = new CameraPathAnimator(this.yn_1, this.zn_1, this.ao_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_0().rn_1[1]);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    this.qo_1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    this.ro_1 = new Vec4(0.74, 0.55, 0.3, 1.0);
    var tmp_0 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_1.color = this.qo_1;
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_0.po_1 = this_1;
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
    this_12.hints = this.so_1;
    tmp_2.commands = mutableListOf([this_12]);
    tmp_1.bo_1 = this_11;
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
    tmp_3.co_1 = this_13;
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
    this_16.hints = this.so_1;
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
    tmp_5.do_1 = this_15;
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
    tmp_9.eo_1 = this_19;
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
    tmp_14.commands = mutableListOf([this.po_1, this_24]);
    tmp_13.fo_1 = this_23;
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
    this_25.commands = mutableListOf([this.fo_1, this.co_1]);
    this_25.id = 0;
    tmp_15.go_1 = this_25;
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
    this_26.commands = mutableListOf([this.fo_1, this.eo_1]);
    this_26.id = 1;
    tmp_16.ho_1 = this_26;
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
    tmp_17.io_1 = this_27;
    var tmp_19 = this;
    // Inline function 'kotlin.apply' call
    var this_29 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_29.name = 'draw blurred';
    this_29.blending = get_BLENDING_NONE();
    tmp_19.jo_1 = this_29;
    var tmp_20 = this;
    // Inline function 'kotlin.apply' call
    var this_30 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.brutalism.BrutalismScene.<anonymous>' call
    this_30.color0 = new Vec4(0.4, 0.4, 0.4, 1.0);
    this_30.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_20.ko_1 = this_30;
    this.lo_1 = new DrawClockCommand();
    this.mo_1 = GroupCommandArr(true, [this.go_1, this.ho_1, MainPassCommandArr(true, [this.fo_1, this.bo_1, this.do_1, this.io_1, this.ko_1, this.lo_1])]);
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
    this_31.commands = mutableListOf([this.fo_1, this.bo_1, this.do_1, this.ko_1]);
    this_31.id = 2;
    tmp_21.oo_1 = this_31;
    this.no_1 = GroupCommandArr(true, [this.oo_1, MainPassCommandArr(true, [this.fo_1, this.jo_1])]);
    this.commands = mutableListOf([this.mo_1, this.no_1]);
  }
  protoOf(BrutalismScene).hm = function () {
    return this.timers;
  };
  protoOf(BrutalismScene).im = function () {
    return this.cameraAnimator;
  };
  protoOf(BrutalismScene).jm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(BrutalismScene).km = function () {
    return this.settings;
  };
  protoOf(BrutalismScene).updateTimers = function (time) {
    this.timers.ei(time);
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
    this.mo_1.enabled = !this.settings.blurred;
    this.no_1.enabled = this.settings.blurred;
    this.go_1.blurSize = this.settings.lowQuality ? BlurSize_KERNEL_3_getInstance() : BlurSize_KERNEL_5_getInstance();
    this.ho_1.blurSize = this.settings.lowQuality ? BlurSize_KERNEL_3_getInstance() : BlurSize_KERNEL_5_getInstance();
    this.so_1.s(0, this.settings.lowQuality ? get_HINT_VRS_2X2() : get_HINT_VRS_NONE());
    this.ko_1.enabled = this.settings.vignette;
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    this.lo_1.enabled = this.settings.clock;
    if ((this.cameraAnimator.timer > 0.98 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().o5() < 0.5 : false) {
      this.randomCameraOrNextRoom();
    }
    this.po_1.color = this.settings.colorMode.equals(ColorMode_Sepia_getInstance()) ? this.ro_1 : this.qo_1;
  };
  protoOf(BrutalismScene).animate = function () {
    this.applySettings();
    this.calculateProjection();
    var cameraPositionInterpolator = this.cameraAnimator.positionInterpolator;
    var eye = cameraPositionInterpolator.cameraPosition;
    var lookat = cameraPositionInterpolator.cameraRotation;
    if (!this.useExternalViewMatrix) {
      Matrix_getInstance().sg(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updateMeshTransformations(this.commands);
  };
  protoOf(BrutalismScene).nextCamera = function () {
    this.cameraAnimator.nextCamera();
  };
  protoOf(BrutalismScene).nextRoom = function () {
    if (this.bo_1.enabled) {
      this.bo_1.enabled = false;
      this.do_1.enabled = true;
      this.go_1.enabled = false;
      this.ho_1.enabled = true;
      this.cameraAnimator.setCameras(Cameras_getInstance_0().rn_1[1], true);
    } else if (this.do_1.enabled) {
      this.bo_1.enabled = true;
      this.do_1.enabled = false;
      this.go_1.enabled = true;
      this.ho_1.enabled = false;
      this.cameraAnimator.setCameras(Cameras_getInstance_0().rn_1[0], true);
    }
  };
  protoOf(BrutalismScene).nextCameraOrRoom = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    var switchRoomProbability = this.bo_1.enabled ? 0.75 : 0.25;
    if (Default_getInstance().o5() < switchRoomProbability) {
      this.nextRoom();
    } else {
      this.nextCamera();
    }
  };
  protoOf(BrutalismScene).randomCameraOrNextRoom = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    var switchRoomProbability = this.bo_1.enabled ? 0.75 : 0.25;
    if (Default_getInstance().o5() < switchRoomProbability) {
      this.nextRoom();
    } else {
      this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().o5() < 0.5;
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
  protoOf(BrutalismSettings).pn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(BrutalismSettings).qn = function () {
    return this.lowQuality;
  };
  protoOf(BrutalismSettings).dn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(BrutalismSettings).en = function () {
    return this.cameraPeriod;
  };
  protoOf(BrutalismSettings).fn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(BrutalismSettings).gn = function () {
    return this.vignette;
  };
  protoOf(BrutalismSettings).nn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(BrutalismSettings).on = function () {
    return this.clock;
  };
  protoOf(BrutalismSettings).hn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(BrutalismSettings).in = function () {
    return this.blurred;
  };
  protoOf(BrutalismSettings).to = function (_set____db54di) {
    this.colorMode = _set____db54di;
  };
  protoOf(BrutalismSettings).uo = function () {
    return this.colorMode;
  };
  protoOf(BrutalismSettings).jn = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(BrutalismSettings).kn = function () {
    return this.autoSwitchCameras;
  };
  function Meshes_0() {
    Meshes_instance_0 = this;
    this.vo_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.wo_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6), new MeshAttribute(AttributeType_NORMAL_getInstance(), VertexFormat_HALF3_getInstance(), 10)]), 16);
    this.xo_1 = MeshConstructor2('sky', this.vo_1);
    this.yo_1 = MeshConstructor2('quad', this.vo_1);
    this.zo_1 = MeshConstructor2('plane0', this.wo_1);
    this.ap_1 = MeshConstructor2('plane1', this.wo_1);
    this.bp_1 = mutableListOf([this.xo_1, this.yo_1, this.zo_1, this.ap_1]);
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
    tmp.cp_1 = [tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, [new Vec3(-224.0, -823.0, 515.0), new Vec3(-224.0, 823.0, 515.0)]];
    var tmp_11 = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp_11.dp_1 = new Float32Array([1.4, 1.1, 1.2, 1.5, 1.2, 1.8, 1.6, 1.1, 0.5, 1.1, 1.8, 1.2]);
  }
  var Props_instance;
  function Props_getInstance() {
    if (Props_instance == null)
      new Props();
    return Props_instance;
  }
  function CartoonPlanesScene() {
    Scene.call(this);
    this.jp_1 = new TimersMap();
    this.kp_1 = 0.25;
    this.lp_1 = 80.0;
    this.mp_1 = 100.0;
    this.np_1 = 10.0;
    this.op_1 = 500.0;
    this.pp_1 = 1.5;
    this.qp_1 = 1000000.0;
    this.rp_1 = 29000.0;
    this.sp_1 = 2600.0;
    this.fq_1 = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.np_1, this.np_1, this.np_1));
    this.gq_1 = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.op_1 * 3.0, this.op_1 * 3.0, this.op_1 * 3.0));
    this.hq_1 = mutableListOf([get_HINT_VRS_2X2()]);
    this.PIf = 3.1415927;
    var tmp = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp.iq_1 = new Float32Array([0.5]);
    this.kq_1 = new Vec3();
    this.lq_1 = 0.0;
    this.mq_1 = new Vec3(0.0, 0.0, 0.0);
    this.nq_1 = 0.0;
    this.oq_1 = 0.0;
    this.pq_1 = 0.0;
    this.qq_1 = 0.0;
    this.rq_1 = 3000.0;
    this.sq_1 = new Vec3();
    this.texSky = Textures_getInstance_0().wq_1;
    this.texSky1 = Textures_getInstance_0().uq_1;
    this.texSky2 = Textures_getInstance_0().vq_1;
    this.meshes = Meshes_getInstance_0().bp_1;
    this.textures = Textures_getInstance_0().ar_1;
    this.shaders = Shaders_getInstance_0().fr_1;
    Companion_instance_0.gr(this.jp_1);
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
    tmp_1.xp_1 = this_1;
    new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    var stateSky = new DrawMeshState(Shaders_getInstance_0().cr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    this.aq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().xo_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_0().uq_1), new UniformTextureValue(Textures_getInstance_0().vq_1), new UniformTextureValue(Textures_getInstance_0().tq_1), UniformFloatValueWithArray(this.iq_1)]), stateSky, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(350.0, 350.0, 350.0)));
    var stateSkyStatic = new DrawMeshState(Shaders_getInstance_0().br_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    this.bq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().xo_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(this.texSky)]), stateSkyStatic, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(350.0, 350.0, 350.0)));
    var statePlaneDiffuse = new DrawMeshState(Shaders_getInstance_0().br_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 16));
    this.cq_1 = new DrawTransformedMeshCommand(Meshes_getInstance_0().zo_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_0().xq_1)]), statePlaneDiffuse, this.fq_1);
    var statePlaneOutline = new DrawMeshState(Shaders_getInstance_0().dr_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_FRONT_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_NORMAL_getInstance(), 1, VertexFormat_HALF3_getInstance(), 10)]), 16));
    var tmp_2 = this;
    var tmp_3 = Meshes_getInstance_0().zo_1;
    var tmp_4 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$3 = new Float32Array([1.5]);
    var tmp_5 = UniformFloatValueWithArray(tmp$ret$3);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$4 = new Float32Array([0.0, 0.0, 0.0, 1.0]);
    tmp_2.dq_1 = new DrawTransformedMeshCommand(tmp_3, listOf([tmp_4, tmp_5, UniformFloatValueWithArray(tmp$ret$4)]), statePlaneOutline, this.fq_1);
    var tmp_6 = Shaders_getInstance_0().er_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_2.enabled = true;
    this_2.equationColor = BlendingEquation_ADD_getInstance();
    this_2.sourceFactorColor = BlendingFactor_SRC_ALPHA_getInstance();
    this_2.destinationFactorColor = BlendingFactor_ONE_getInstance();
    var stateProp = new DrawMeshState(tmp_6, this_2, get_DEPTH_NO_WRITE(), CullFace_DISABLED_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var tmp_7 = this;
    var tmp_8 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_9 = new UniformTextureValue(Textures_getInstance_0().zq_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$6 = new Float32Array([1.5]);
    tmp_7.jq_1 = listOf([tmp_8, tmp_9, UniformFloatValueWithArray(tmp$ret$6)]);
    this.eq_1 = GroupCommandArr(true, [new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1), new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1), new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1), new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1), new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1), new DrawTransformedMeshCommand(Meshes_getInstance_0().yo_1, this.jq_1, stateProp, this.gq_1)]);
    var tmp_10 = this;
    // Inline function 'kotlin.apply' call
    var this_3 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_3.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_10.wp_1 = GroupCommandArr(true, [this.xp_1, this_3]);
    var tmp_11 = this;
    // Inline function 'kotlin.apply' call
    var this_4 = new VignetteCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_4.color0 = new Vec4(0.6, 0.6, 0.6, 1.0);
    this_4.color1 = new Vec4(1.0, 1.0, 1.0, 1.0);
    tmp_11.yp_1 = this_4;
    this.tp_1 = GroupCommandArr(true, [MainPassCommandArr(true, [this.wp_1, this.cq_1, this.dq_1, this.bq_1, this.aq_1, this.eq_1, this.yp_1])]);
    var tmp_12 = this;
    // Inline function 'kotlin.apply' call
    var this_5 = new BlurredPassCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_5.name = 'blurred-main';
    this_5.enabled = true;
    this_5.minSize = 180;
    this_5.brightness = 0.95;
    this_5.blurSize = BlurSize_KERNEL_4_getInstance();
    this_5.commands = mutableListOf([this.wp_1, this.cq_1, this.bq_1, this.aq_1, this.yp_1]);
    tmp_12.vp_1 = this_5;
    var tmp_13 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.CartoonPlanesScene.<anonymous>' call
    this_6.name = 'draw blurred';
    this_6.blending = get_BLENDING_NONE();
    tmp_13.zp_1 = this_6;
    this.up_1 = GroupCommandArr(false, [this.vp_1, MainPassCommandArr(true, [this.wp_1, this.zp_1])]);
    this.commands = mutableListOf([this.tp_1, this.up_1]);
  }
  protoOf(CartoonPlanesScene).km = function () {
    return this.settings;
  };
  protoOf(CartoonPlanesScene).an = function () {
    return this.PIf;
  };
  protoOf(CartoonPlanesScene).hr = function (_set____db54di) {
    this.texSky = _set____db54di;
  };
  protoOf(CartoonPlanesScene).ir = function () {
    return this.texSky;
  };
  protoOf(CartoonPlanesScene).jr = function (_set____db54di) {
    this.texSky1 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).kr = function () {
    return this.texSky1;
  };
  protoOf(CartoonPlanesScene).lr = function (_set____db54di) {
    this.texSky2 = _set____db54di;
  };
  protoOf(CartoonPlanesScene).mr = function () {
    return this.texSky2;
  };
  protoOf(CartoonPlanesScene).updateTimers = function (time) {
    this.jp_1.ei(time);
    this.animate();
    protoOf(Scene).updateTimers.call(this, time);
  };
  protoOf(CartoonPlanesScene).updateViewportSize = function (width, height) {
    protoOf(Scene).updateViewportSize.call(this, width, height);
  };
  protoOf(CartoonPlanesScene).initialize = function () {
    this.randomizeCamera();
  };
  protoOf(CartoonPlanesScene).applySettings = function () {
    this.tp_1.enabled = !this.settings.blurred;
    this.up_1.enabled = this.settings.blurred;
    this.yp_1.enabled = this.settings.vignette;
    this.vp_1.additionalBlur = !this.settings.lowQuality;
  };
  protoOf(CartoonPlanesScene).animate = function () {
    this.applySettings();
    this.positionCamera();
    this.calculateProjection();
    this.calculatePlanePosition(this.mq_1, 0.0);
    this.updatePlaneTransforms();
    this.updateSky();
    this.updateMeshTransformations(this.commands);
  };
  protoOf(CartoonPlanesScene).updateSky = function () {
    var timer = this.jp_1.ci(Timers_SwapSky_getInstance());
    if (timer > 0.1 ? timer < 0.9 : false) {
      this.bq_1.enabled = false;
      this.aq_1.enabled = true;
      setUniform_1(this.aq_1.uniforms.q(4), timer);
      this.aq_1.transform.k9_1 = this.sq_1;
    } else {
      this.bq_1.enabled = true;
      this.aq_1.enabled = false;
      this.bq_1.transform.k9_1 = this.sq_1;
    }
    if (timer > 0.5) {
      this.texSky.id = this.texSky2.id;
      this.texSky.fileName = this.texSky2.fileName;
    }
  };
  protoOf(CartoonPlanesScene).updatePlaneTransforms = function () {
    this.fq_1.k9_1 = this.kq_1;
    this.fq_1.l9_1.x = MathUtils_instance.mg(this.lq_1);
    var tmp0_iterator = this.eq_1.commands.h();
    while (tmp0_iterator.o()) {
      var command = tmp0_iterator.p();
      command.enabled = false;
    }
    var propIndex = 0;
    var props = Props_getInstance().cp_1[this.settings.currentPlane];
    var scale = Props_getInstance().dp_1[this.settings.currentPlane] * this.op_1;
    var inductionVariable = 0;
    var last = props.length;
    while (inductionVariable < last) {
      var prop = props[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var tmp = prop.y;
      // Inline function 'kotlin.math.cos' call
      var x = this.lq_1;
      var tmp_0 = tmp * Math.cos(x);
      var tmp_1 = prop.z;
      // Inline function 'kotlin.math.sin' call
      var x_0 = this.lq_1;
      var propY = tmp_0 - tmp_1 * Math.sin(x_0);
      var tmp_2 = prop.z;
      // Inline function 'kotlin.math.cos' call
      var x_1 = this.lq_1;
      var tmp_3 = tmp_2 * Math.cos(x_1);
      var tmp_4 = prop.y;
      // Inline function 'kotlin.math.sin' call
      var x_2 = this.lq_1;
      var propZ = tmp_3 + tmp_4 * Math.sin(x_2);
      var rotation = MathUtils_instance.mg(this.jp_1.ci(Timers_PropRotate_getInstance()) * this.PIf * 2.0);
      // Inline function 'kotlin.math.sin' call
      var x_3 = this.jp_1.ci(Timers_PropFlicker_getInstance()) * this.PIf * 2.0;
      var brightness = 2.0 + Math.sin(x_3);
      setUniform_1(this.jq_1.q(2), brightness);
      var tmp_5 = this.eq_1.commands.q(propIndex);
      var command_0 = tmp_5 instanceof DrawTransformedMeshCommand ? tmp_5 : THROW_CCE();
      command_0.enabled = true;
      command_0.transform.l9_1.x = MathUtils_instance.mg(rotation);
      command_0.transform.l9_1.y = 0.0;
      command_0.transform.l9_1.z = 0.0;
      command_0.transform.k9_1.x = this.kq_1.x + prop.x;
      command_0.transform.k9_1.y = this.kq_1.y + propY;
      command_0.transform.k9_1.z = this.kq_1.z + propZ;
      command_0.transform.m9_1.x = scale;
      command_0.transform.m9_1.y = scale;
      command_0.transform.m9_1.z = scale;
    }
  };
  protoOf(CartoonPlanesScene).positionCamera = function () {
    if (!this.useExternalViewMatrix) {
      var timer = this.jp_1.ci(Timers_Camera_getInstance());
      timer = MathUtils_instance.wc(0.0, 1.0, timer);
      var angleX = this.nq_1 + timer * (this.pq_1 - this.nq_1);
      var angleY = this.oq_1 + timer * (this.qq_1 - this.oq_1);
      var tmp = this.sq_1;
      // Inline function 'kotlin.math.sin' call
      tmp.x = Math.sin(angleX) * this.rq_1;
      var tmp_0 = this.sq_1;
      // Inline function 'kotlin.math.cos' call
      tmp_0.y = Math.cos(angleX) * this.rq_1;
      var tmp_1 = this.sq_1;
      // Inline function 'kotlin.math.sin' call
      tmp_1.z = Math.sin(angleY) * this.rq_1;
      Matrix_getInstance().sg(this.matView, 0, this.sq_1.x, this.sq_1.y, this.sq_1.z, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0);
      if (timer === 1.0) {
        this.jp_1.di(Timers_Camera_getInstance(), 0.0);
        this.randomizeCamera();
      }
    }
  };
  protoOf(CartoonPlanesScene).calculatePlanePosition = function (offset, timersOffset) {
    var time1 = (this.jp_1.ci(Timers_PlaneWonder1_getInstance()) + timersOffset) % 1.0;
    var time2 = (this.jp_1.ci(Timers_PlaneWonder2_getInstance()) + timersOffset) % 1.0;
    var tmp = offset.x;
    // Inline function 'kotlin.math.sin' call
    var x = time1 * 3.0 * this.PIf * 2.0;
    var tmp$ret$0 = Math.sin(x);
    this.kq_1.x = tmp + tmp$ret$0 * this.lp_1 * 3.0;
    var tmp_0 = offset.y;
    // Inline function 'kotlin.math.cos' call
    var x_0 = time1 * 5.0 * this.PIf * 2.0;
    var tmp$ret$1 = Math.cos(x_0);
    this.kq_1.y = tmp_0 + tmp$ret$1 * this.lp_1;
    var tmp_1 = offset.z;
    // Inline function 'kotlin.math.cos' call
    var x_1 = time2 * this.PIf * 2.0;
    var tmp$ret$2 = Math.cos(x_1);
    this.kq_1.z = tmp_1 + tmp$ret$2 * this.mp_1;
    var tmp_2 = this;
    // Inline function 'kotlin.math.sin' call
    var x_2 = this.jp_1.ci(Timers_PlaneBanking_getInstance()) * this.PIf * 2.0;
    tmp_2.lq_1 = Math.sin(x_2) * this.kp_1 * 1.0;
  };
  protoOf(CartoonPlanesScene).nextCamera = function () {
  };
  protoOf(CartoonPlanesScene).randomizeCamera = function () {
    this.nq_1 = Default_getInstance().o5() * this.PIf * 2.0;
    this.oq_1 = (Default_getInstance().o5() - 0.3) * this.PIf * 0.9;
    this.pq_1 = Default_getInstance().o5() * this.PIf * 2.0;
    this.qq_1 = (Default_getInstance().o5() - 0.3) * this.PIf * 0.9;
    this.rq_1 = 2700.0 + Default_getInstance().o5() * 800.0;
  };
  protoOf(CartoonPlanesScene).changeSky = function () {
    this.jp_1.di(Timers_SwapSky_getInstance(), 0.0);
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
  protoOf(CartoonPlanesSettings).dn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).en = function () {
    return this.cameraPeriod;
  };
  protoOf(CartoonPlanesSettings).fn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).gn = function () {
    return this.vignette;
  };
  protoOf(CartoonPlanesSettings).hn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).in = function () {
    return this.blurred;
  };
  protoOf(CartoonPlanesSettings).jn = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).kn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(CartoonPlanesSettings).pn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).qn = function () {
    return this.lowQuality;
  };
  protoOf(CartoonPlanesSettings).nn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).on = function () {
    return this.clock;
  };
  protoOf(CartoonPlanesSettings).nr = function (_set____db54di) {
    this.currentPlane = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).or = function () {
    return this.currentPlane;
  };
  protoOf(CartoonPlanesSettings).pr = function (_set____db54di) {
    this.nextPlane = _set____db54di;
  };
  protoOf(CartoonPlanesSettings).qr = function () {
    return this.nextPlane;
  };
  function Shaders_0() {
    Shaders_instance_0 = this;
    this.br_1 = new Shader('Diffuse');
    this.cr_1 = new Shader('SkyTransition');
    this.dr_1 = new Shader('Outline');
    this.er_1 = new Shader('Prop');
    this.fr_1 = mutableListOf([this.br_1, this.cr_1, this.dr_1, this.er_1]);
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
    tmp.tq_1 = this_0;
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
    tmp_0.uq_1 = this_1;
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
    tmp_1.vq_1 = this_2;
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
    tmp_2.wq_1 = this_3;
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
    this_4.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    this_4.mipmaps = 10;
    tmp_3.xq_1 = this_4;
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
    this_5.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    this_5.mipmaps = 10;
    tmp_4.yq_1 = this_5;
    var tmp_5 = this;
    // Inline function 'kotlin.apply' call
    var this_6 = new Texture();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.cartoonplanes.Textures.texProp.<anonymous>' call
    this_6.name = 'prop';
    this_6.fileName = 'prop/3';
    this_6.format = TextureFormat_ASTC_getInstance();
    this_6.wrapping = TextureWrapping_CLAMP_TO_EDGE_getInstance();
    this_6.minFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.magFilter = TextureFiltering_LINEAR_MIPMAP_LINEAR_getInstance();
    this_6.mipmaps = 8;
    tmp_5.zq_1 = this_6;
    this.ar_1 = mutableListOf([this.tq_1, this.wq_1, this.uq_1, this.vq_1, this.xq_1, this.yq_1, this.zq_1]);
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
  protoOf(Companion_0).gr = function (timers) {
    timers.ai(Timers_PropRotate_getInstance(), 741000.0);
    timers.ai(Timers_PropFlicker_getInstance(), 10.0);
    timers.ai(Timers_PlaneWonder1_getInstance(), 25000.0);
    timers.ai(Timers_PlaneWonder2_getInstance(), 6000.0);
    timers.ai(Timers_PlaneBanking_getInstance(), 22800.0);
    timers.bi(Timers_Camera_getInstance(), 25800.0, false);
    timers.bi(Timers_SwapPlanes_getInstance(), 6000.0, false);
    timers.bi(Timers_SwapSky_getInstance(), 5000.0, false);
  };
  var Companion_instance_0;
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
    tmp.rr_1 = [InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(4.84, -644.785, -25.362), new Vec3(4.673, -1.741, 4.447)), new CameraPosition(new Vec3(2.56, -126.0, -8.595), new Vec3(2.533, -1.741, 3.993)), 1.0, '', false), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-137.0, -115.0, -12.0), new Vec3(3.485, -0.679, -16.321)), new CameraPosition(new Vec3(138.0, -110.0, 20.0), new Vec3(3.485, -0.679, -16.321)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(208.0, -208.0, -21.0), new Vec3(0.0, 0.0, 0.0)), new CameraPosition(new Vec3(265.0, 77.0, 22.0), new Vec3(0.0, 0.0, -35.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(347.0, 73.0, 15.0), new Vec3(161.0, -220.0, -19.0)), new CameraPosition(new Vec3(69.0, 365.0, 15.0), new Vec3(-100.0, 162.0, -18.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(147.0, 212.0, 0.0), new Vec3(20.0, -10.0, 7.0)), new CameraPosition(new Vec3(-146.0, 182.0, 30.0), new Vec3(-20.0, 4.0, -35.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-244.0, 139.0, 77.0), new Vec3(-3.0, -27.0, -37.0)), new CameraPosition(new Vec3(-151.0, -357.0, 11.0), new Vec3(20.0, -45.0, 0.0)), 1.0, '', true), InteractiveCameraPositionPair_init_$Create$(new CameraPosition(new Vec3(-265.0, -158.0, -20.0), new Vec3(0.0, 0.0, 32.0)), new CameraPosition(new Vec3(-95.0, -70.0, 0.0), new Vec3(9.0, -13.0, -10.0)), 1.0, '', false)];
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
    $this.vr_1 = name;
    $this.wr_1 = interactive;
    return $this;
  }
  function InteractiveCameraPositionPair_init_$Create$(start, end, speedMultiplier, name, interactive) {
    return InteractiveCameraPositionPair_init_$Init$(start, end, speedMultiplier, name, interactive, objectCreate(protoOf(InteractiveCameraPositionPair)));
  }
  function InteractiveCameraPositionPair() {
    this.vr_1 = '';
    this.wr_1 = false;
  }
  function Companion_1() {
    Companion_instance_1 = this;
    this.xr_1 = new Vec4(0.55859375, 0.7578125, 0.87890625, 1.0);
    var tmp = this;
    // Inline function 'kotlin.apply' call
    var this_0 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.example.Companion.clearColorCommand.<anonymous>' call
    this_0.color = Companion_getInstance_1().xr_1;
    this_0.name = 'clear color';
    this_0.enabled = true;
    tmp.yr_1 = this_0;
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
    this.es_1 = 6.2831855;
    this.fs_1 = 1000000.0;
    this.gs_1 = 11000.0;
    this.hs_1 = 1100.0;
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
    this.is_1 = 25000.0;
    this.js_1 = 34000.0;
    this.ks_1 = 250000.0;
    this.ls_1 = 300000.0;
    this.ms_1 = 2500.0;
    this.ns_1 = 1000.0;
    this.os_1 = 900.0;
    this.ps_1 = 6000.0;
    this.qs_1 = 1000.0;
    this.Z_NEAR = 50.0;
    this.Z_FAR = 10000.0;
    this.FOV_LANDSCAPE = 35.0;
    this.FOV_PORTRAIT = 60.0;
    this.timers.ai(Timers_Clouds1_getInstance(), this.ks_1);
    this.timers.ai(Timers_Clouds2_getInstance(), this.ls_1);
    this.timers.ai(Timers_Water_getInstance_0(), this.ms_1);
    this.timers.ai(Timers_BirdWings1_getInstance_0(), this.ns_1);
    this.timers.ai(Timers_BirdWings2_getInstance_0(), this.os_1);
    this.timers.ai(Timers_AnimalAnimation_getInstance(), this.ps_1);
    this.timers.ai(Timers_ShootingStar_getInstance(), this.qs_1);
    this.timers.ai(Timers_BirdsFly_getInstance_0(), this.is_1);
    this.timers.ai(Timers_Camera_getInstance_0(), this.js_1);
    this.cameraAnimator = new CameraPathAnimator(this.fs_1, this.gs_1, this.hs_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_1().rr_1);
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
    var tmp_36 = Companion_getInstance_1().yr_1;
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
  protoOf(ExampleScene).hm = function () {
    return this.timers;
  };
  protoOf(ExampleScene).im = function () {
    return this.cameraAnimator;
  };
  protoOf(ExampleScene).jm = function () {
    return this.FOV_TRANSITION;
  };
  protoOf(ExampleScene).rs = function () {
    return this.arr1;
  };
  protoOf(ExampleScene).ss = function () {
    return this.arr2;
  };
  protoOf(ExampleScene).ts = function () {
    return this.arr3;
  };
  protoOf(ExampleScene).us = function (_set____db54di) {
    this.arr4 = _set____db54di;
  };
  protoOf(ExampleScene).vs = function () {
    return this.arr4;
  };
  protoOf(ExampleScene).ws = function () {
    return this.map8;
  };
  protoOf(ExampleScene).xs = function () {
    return this.uniformsMountainsBright;
  };
  protoOf(ExampleScene).ys = function () {
    return this.uniformsMountainsDark;
  };
  protoOf(ExampleScene).zs = function () {
    return this.uniformsCenterRockBright;
  };
  protoOf(ExampleScene).at = function () {
    return this.uniformsCenterRockDark;
  };
  protoOf(ExampleScene).bt = function () {
    return this.uniformsHills;
  };
  protoOf(ExampleScene).ct = function () {
    return this.uniformsGround1;
  };
  protoOf(ExampleScene).dt = function () {
    return this.uniformsGround2;
  };
  protoOf(ExampleScene).et = function () {
    return this.uniformsWater;
  };
  protoOf(ExampleScene).ft = function () {
    return this.uniformsWaterHighlights;
  };
  protoOf(ExampleScene).gt = function () {
    return this.uniformsSkyObjects;
  };
  protoOf(ExampleScene).ht = function () {
    return this.texStatic;
  };
  protoOf(ExampleScene).it = function () {
    return this.uniformsDiffuseTest;
  };
  protoOf(ExampleScene).jt = function () {
    return this.texFp16;
  };
  protoOf(ExampleScene).kt = function () {
    return this.uniformsAnimated;
  };
  protoOf(ExampleScene).lt = function () {
    return this.animationAnimal;
  };
  protoOf(ExampleScene).updateTimers = function (time) {
    this.timers.ei(time);
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
      Matrix_getInstance().sg(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updateMeshTransformations(this.commands);
    var tmp = this.uniformsDiffuseTest.q(0);
    this.setMvpUniform(tmp instanceof UniformFloatValue ? tmp : THROW_CCE(), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 8.0, 8.0, 8.0);
    // Inline function 'kotlin.math.min' call
    var a = this.timers.ci(Timers_AnimalAnimation_getInstance()) * 1.1;
    var timer = Math.min(a, 1.0);
    this.setMvpUniform(this.uniformsAnimated.q(0), 1.554, -0.796, -2.327, 0.0, 0.0, 0.0, 0.4, 0.4, 0.4);
    setUniform(this.uniformsAnimated.q(1), 0.1640625, 0.1484375, 0.1171875, 1.0);
    setUniform_2(this.uniformsAnimated.q(2), this.animationAnimal.gb_1);
    setUniform_1(this.uniformsAnimated.q(3), 1.0 / this.animationAnimal.lb_1);
    setUniform(this.uniformsAnimated.q(5), this.animationAnimal.gb_1, this.animationAnimal.ib_1, this.animationAnimal.nb(timer), this.animationAnimal.mb_1);
    setUniform_1(this.uniformsWaterHighlights.q(2), this.timers.ci(Timers_Water_getInstance_0()) * get_PI() * 2.0);
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
    tmp.mt_1 = [new CameraPositionPair(new CameraPosition(new Vec3(182.522, 451.945, 100.426994), new Vec3(95.628395, -240.9175, 179.154)), new CameraPosition(new Vec3(-343.592, 309.3397, 121.102), new Vec3(-48.3742, -284.307, 183.019)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(466.2929, -304.8695, 30.390701), new Vec3(-343.613, 27.9626, 220.6635)), new CameraPosition(new Vec3(563.2295, 19.3432, 24.534698), new Vec3(-218.45789, 183.19339, 193.65689)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-17.8381, -512.5913, 60.937397), new Vec3(-276.7568, 195.7981, 179.154)), new CameraPosition(new Vec3(502.0434, -225.924, 73.5525), new Vec3(-59.8787, 269.7749, 205.40071)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-620.36957, -208.8635, 52.049202), new Vec3(216.4319, -70.2999, 243.01979)), new CameraPosition(new Vec3(-536.29553, -347.5239, 66.9248), new Vec3(245.4221, 141.5389, 220.25499)), 1.0), new CameraPositionPair(new CameraPosition(new Vec3(-405.834, 809.1909, 140.3126), new Vec3(195.42691, -167.5669, 264.4845)), new CameraPosition(new Vec3(-586.92596, -130.8418, 24.389801), new Vec3(195.42691, -167.5669, 220.6635)), 1.0)];
  }
  var Cameras_instance_2;
  function Cameras_getInstance_2() {
    if (Cameras_instance_2 == null)
      new Cameras_2();
    return Cameras_instance_2;
  }
  function Meshes_1() {
    Meshes_instance_1 = this;
    this.nt_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6)]), 12);
    this.ot_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0)), 8);
    this.pt_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.qt_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_HALF2_getInstance(), 6), new MeshAttribute(AttributeType_NORMAL_getInstance(), VertexFormat_HALF3_getInstance(), 10)]), 16);
    this.rt_1 = new MeshAttributes(listOf([new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_HALF3_getInstance(), 0), new MeshAttribute(AttributeType_UV0_getInstance(), VertexFormat_UBYTE2_NORMALIZED_getInstance(), 6)]), 8);
    this.st_1 = new MeshAttributes(listOf_0(new MeshAttribute(AttributeType_VERTEX_getInstance(), VertexFormat_FLOAT3_getInstance(), 0)), 12);
    this.tt_1 = MeshConstructor2('sky', this.nt_1);
    this.ut_1 = MeshConstructor2('stars', this.pt_1);
    this.vt_1 = MeshConstructor2('building-1', this.qt_1);
    this.wt_1 = MeshConstructor2('buildings-distant', this.rt_1);
    this.xt_1 = MeshConstructor2('red-lamps', this.ot_1);
    this.yt_1 = MeshConstructor2('islands', this.ot_1);
    this.zt_1 = MeshConstructor2('water', this.ot_1);
    this.au_1 = MeshConstructor2('neon-signs', this.rt_1);
    this.bu_1 = MeshConstructor2('red-lights', this.st_1);
    this.cu_1 = mutableListOf([this.tt_1, this.ut_1, this.vt_1, this.wt_1, this.xt_1, this.yt_1, this.zt_1, this.au_1, this.bu_1]);
  }
  var Meshes_instance_1;
  function Meshes_getInstance_1() {
    if (Meshes_instance_1 == null)
      new Meshes_1();
    return Meshes_instance_1;
  }
  function SkyscrapersScene() {
    Scene.call(this);
    this.iu_1 = new TimersMap();
    this.ju_1 = 1000000.0;
    this.ku_1 = 29000.0;
    this.lu_1 = 2600.0;
    this.vu_1 = mutableListOf([get_HINT_VRS_2X2()]);
    this.wu_1 = 100.0;
    this.PIf = 3.1415927;
    var tmp = this;
    // Inline function 'kotlin.floatArrayOf' call
    tmp.xu_1 = new Float32Array([0.145, 0.137, 0.141, 1.0]);
    this.yu_1 = 2300.0;
    this.zu_1 = 2500.0;
    var tmp_0 = this;
    // Inline function 'kotlin.arrayOf' call
    var tmp_1 = UniformFloatValueWithArray(this.xu_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$1 = new Float32Array([this.yu_1]);
    var tmp_2 = UniformFloatValueWithArray(tmp$ret$1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$2 = new Float32Array([this.zu_1]);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_0.av_1 = [tmp_1, tmp_2, UniformFloatValueWithArray(tmp$ret$2)];
    this.bv_1 = 990.0;
    var tmp_3 = this;
    // Inline function 'kotlin.arrayOf' call
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$6 = new Float32Array([3.0]);
    var tmp_4 = UniformFloatValueWithArray(tmp$ret$6);
    var tmp_5 = new UniformTextureValue(Textures_getInstance_1().rv_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$7 = new Float32Array([1.2, 1.2, 1.2, 1.0]);
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    tmp_3.iv_1 = [tmp_4, tmp_5, UniformFloatValueWithArray(tmp$ret$7)];
    this.meshes = Meshes_getInstance_1().cu_1;
    this.textures = Textures_getInstance_1().tv_1;
    this.shaders = Shaders_getInstance_1().cw_1;
    Companion_instance_2.dw(this.iu_1);
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
    this.cameraAnimator = new CameraPathAnimator(this.ju_1, this.ku_1, this.lu_1, true);
    this.cameraAnimator.setCameras(Cameras_getInstance_2().mt_1);
    this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    var tmp_7 = this;
    // Inline function 'kotlin.apply' call
    var this_1 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_1.color = new Vec4(0.0, 0.0392156862745098, 0.0784313725490196, 1.0);
    this_1.name = 'clear color';
    this_1.enabled = true;
    tmp_7.ru_1 = this_1;
    // Inline function 'kotlin.apply' call
    var this_2 = new ClearColorCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_2.color = new Vec4(0.0, 0.0, 0.0, 1.0);
    this_2.name = 'clear color bloom';
    this_2.enabled = true;
    var clearColorBloomCommand = this_2;
    var txSceneObjects = new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1));
    var stateSky = new DrawMeshState(Shaders_getInstance_1().vv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6)]), 12));
    var commandSky = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().tt_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().jv_1), new UniformTextureValue(Textures_getInstance_1().kv_1)]), stateSky, txSceneObjects);
    var stateStars = new DrawMeshState(Shaders_getInstance_1().wv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_FLOAT3_getInstance(), 0)), 12));
    var tmp_8 = this;
    // Inline function 'kotlin.apply' call
    var tmp_9 = Meshes_getInstance_1().ut_1;
    var tmp_10 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$14 = new Float32Array([0.35, 0.35, 0.35, 1.0]);
    var this_3 = new DrawTransformedMeshCommand(tmp_9, listOf([tmp_10, UniformFloatValueWithArray(tmp$ret$14)]), stateStars, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 0.0), new Vec3(0.055, 0.055, 0.055)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_3.hints = this.vu_1;
    tmp_8.commandStars = this_3;
    var stateBuilding = new DrawMeshState(Shaders_getInstance_1().xv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_HALF2_getInstance(), 6), new VertexAttribute(AttributeType_NORMAL_getInstance(), 2, VertexFormat_HALF3_getInstance(), 10)]), 16));
    var tmp_11 = this;
    // Inline function 'kotlin.apply' call
    var tmp_12 = Meshes_getInstance_1().vt_1;
    var tmp_13 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_14 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$16 = new Float32Array([0.707106, 0.707106, 0.0]);
    var tmp_15 = UniformFloatValueWithArray(tmp$ret$16);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$17 = new Float32Array([0.05, 0.6]);
    var tmp_16 = UniformFloatValueWithArray(tmp$ret$17);
    var tmp_17 = UniformFloatValueWithArray(new Float32Array(3));
    var tmp_18 = new UniformTextureValue(Textures_getInstance_1().lv_1);
    var tmp_19 = new UniformTextureValue(Textures_getInstance_1().mv_1);
    var tmp_20 = new UniformTextureValue(Textures_getInstance_1().nv_1);
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
    var tmp_25 = Meshes_getInstance_1().vt_1;
    var tmp_26 = UniformFloatValueWithArray(new Float32Array(16));
    var tmp_27 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$23 = new Float32Array([0.707106, 0.707106, 0.0]);
    var tmp_28 = UniformFloatValueWithArray(tmp$ret$23);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$24 = new Float32Array([0.05, 0.6]);
    var tmp_29 = UniformFloatValueWithArray(tmp$ret$24);
    var tmp_30 = UniformFloatValueWithArray(new Float32Array(3));
    var tmp_31 = new UniformTextureValue(Textures_getInstance_1().lv_1);
    var tmp_32 = new UniformTextureValue(Textures_getInstance_1().mv_1);
    var tmp_33 = new UniformTextureValue(Textures_getInstance_1().nv_1);
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
    var stateRed = new DrawMeshState(Shaders_getInstance_1().wv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    // Inline function 'kotlin.apply' call
    var tmp_37 = Meshes_getInstance_1().xt_1;
    var tmp_38 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$30 = new Float32Array([1.0, 0.3, 0.3, 1.0]);
    var this_6 = new DrawTransformedMeshCommand(tmp_37, listOf([tmp_38, UniformFloatValueWithArray(tmp$ret$30)]), stateRed, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_6.hints = this.vu_1;
    var commandRed = this_6;
    var stateDistant = new DrawMeshState(Shaders_getInstance_1().yv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_BYTE2_NORMALIZED_getInstance(), 6)]), 8));
    var commandBuildingsDistant = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().wt_1, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().ov_1)], this.av_1])), stateDistant, txSceneObjects);
    var commandBuildingsDistant2 = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().wt_1, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().ov_1)], this.av_1])), stateDistant, new AffineTranformation(new Vec3(0.0, 0.0, 0.0), new Vec3(0.0, 0.0, 180.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    var stateGround = new DrawMeshState(Shaders_getInstance_1().zv_1, get_BLENDING_NONE(), get_DEPTH_TEST_ENABLED(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf_0(new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0)), 8));
    var tmp_39 = Meshes_getInstance_1().yt_1;
    var tmp_40 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$32 = new Float32Array([0.1171875, 0.1171875, 0.1171875, 1.0]);
    var commandIslands1 = DrawStaticMeshCommandConstructor(tmp_39, listOf(arrayConcat([[tmp_40, UniformFloatValueWithArray(tmp$ret$32)], this.av_1])), stateGround, txSceneObjects);
    var tmp_41 = Meshes_getInstance_1().zt_1;
    var tmp_42 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$33 = new Float32Array([0.0, 0.01953125, 0.01953125, 1.0]);
    var commandWater = DrawStaticMeshCommandConstructor(tmp_41, listOf(arrayConcat([[tmp_42, UniformFloatValueWithArray(tmp$ret$33)], this.av_1])), stateGround, txSceneObjects);
    var tmp_43 = Shaders_getInstance_1().uv_1;
    // Inline function 'kotlin.apply' call
    var this_7 = new Blending();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_7.enabled = true;
    this_7.sourceFactorColor = BlendingFactor_ONE_getInstance();
    this_7.destinationFactorColor = BlendingFactor_ONE_getInstance();
    this_7.isSeparateAlpha = false;
    var stateNeon = new DrawMeshState(tmp_43, this_7, get_DEPTH_NO_WRITE(), CullFace_BACK_getInstance(), new VertexAttributesDescriptor(listOf([new VertexAttribute(AttributeType_VERTEX_getInstance(), 0, VertexFormat_HALF3_getInstance(), 0), new VertexAttribute(AttributeType_UV0_getInstance(), 1, VertexFormat_UBYTE2_NORMALIZED_getInstance(), 6)]), 8));
    var commandNeon = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().au_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().pv_1)]), stateNeon, txSceneObjects);
    var commandNeonBloom = DrawStaticMeshCommandConstructor(Meshes_getInstance_1().au_1, listOf([UniformFloatValueWithArray(new Float32Array(16)), new UniformTextureValue(Textures_getInstance_1().sv_1)]), stateNeon, txSceneObjects);
    var tmp_44 = Shaders_getInstance_1().aw_1;
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
    var tmp_45 = Meshes_getInstance_1().bu_1;
    var tmp_46 = UniformFloatValueWithArray(new Float32Array(16));
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$36 = new Float32Array([4.0]);
    var tmp_47 = UniformFloatValueWithArray(tmp$ret$36);
    var tmp_48 = new UniformTextureValue(Textures_getInstance_1().qv_1);
    // Inline function 'kotlin.floatArrayOf' call
    var tmp$ret$37 = new Float32Array([1.0, 0.2, 0.2, 1.0]);
    var this_9 = DrawStaticMeshCommandConstructor(tmp_45, listOf([tmp_46, tmp_47, tmp_48, UniformFloatValueWithArray(tmp$ret$37)]), stateRedSprites, txSceneObjects);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_9.primitiveType = PrimitiveType_POINTS_getInstance();
    var commandRedSprites = this_9;
    var tmp_49 = Shaders_getInstance_1().bw_1;
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
    var this_11 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 380.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_11.primitiveType = PrimitiveType_POINTS_getInstance();
    this_11.primitiveCount = 1;
    tmp_50.cv_1 = this_11;
    var tmp_51 = this;
    // Inline function 'kotlin.apply' call
    var this_12 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 400.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_12.primitiveType = PrimitiveType_POINTS_getInstance();
    this_12.primitiveCount = 1;
    tmp_51.dv_1 = this_12;
    var tmp_52 = this;
    // Inline function 'kotlin.apply' call
    var this_13 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 350.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_13.primitiveType = PrimitiveType_POINTS_getInstance();
    this_13.primitiveCount = 1;
    tmp_52.ev_1 = this_13;
    var tmp_53 = this;
    // Inline function 'kotlin.apply' call
    var this_14 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 450.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_14.primitiveType = PrimitiveType_POINTS_getInstance();
    this_14.primitiveCount = 1;
    tmp_53.fv_1 = this_14;
    var tmp_54 = this;
    // Inline function 'kotlin.apply' call
    var this_15 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 430.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_15.primitiveType = PrimitiveType_POINTS_getInstance();
    this_15.primitiveCount = 1;
    tmp_54.gv_1 = this_15;
    var tmp_55 = this;
    // Inline function 'kotlin.apply' call
    var this_16 = new DrawTransformedMeshCommand(null, listOf(arrayConcat([[UniformFloatValueWithArray(new Float32Array(16))], this.iv_1])), statePlanes, new AffineTranformation(new Vec3(0.0, 0.0, 500.0), new Vec3(0.0, 0.0, 0.0), new Vec3(this.wu_1, this.wu_1, this.wu_1)));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_16.primitiveType = PrimitiveType_POINTS_getInstance();
    this_16.primitiveCount = 1;
    tmp_55.hv_1 = this_16;
    var tmp_56 = this;
    // Inline function 'kotlin.apply' call
    var this_17 = new ClearCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_17.clearType = ClearCommandClearType_COLOR_AND_DEPTH_getInstance();
    tmp_56.qu_1 = GroupCommandArr(true, [this.ru_1, this_17]);
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
    tmp_57.su_1 = this_19;
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
    tmp_58.pu_1 = this_20;
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
    tmp_59.uu_1 = this_21;
    this.mu_1 = GroupCommandArr(true, [this.pu_1, MainPassCommandArr(true, [this.qu_1, this.commandBuildings, commandRed, commandBuildingsDistant, commandBuildingsDistant2, commandIslands1, commandWater, this.commandStars, commandSky, this.cv_1, this.dv_1, this.ev_1, this.fv_1, this.gv_1, this.hv_1, commandNeon, this.uu_1, this.su_1])]);
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
    this_23.commands = mutableListOf([groupClearBloom, this.commandBuildings, commandBuildingsDistant, commandBuildingsDistant2, commandIslands1, commandWater, commandSky, commandNeon, this.su_1]);
    tmp_61.ou_1 = this_23;
    var tmp_62 = this;
    // Inline function 'kotlin.apply' call
    var this_24 = new DrawBlurredCommand();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'org.androidworks.skyscrapers.SkyscrapersScene.<anonymous>' call
    this_24.name = 'draw blurred';
    this_24.blending = get_BLENDING_NONE();
    tmp_62.tu_1 = this_24;
    this.nu_1 = GroupCommandArr(false, [this.ou_1, MainPassCommandArr(true, [this.qu_1, this.tu_1])]);
    this.commands = mutableListOf([this.mu_1, this.nu_1]);
  }
  protoOf(SkyscrapersScene).im = function () {
    return this.cameraAnimator;
  };
  protoOf(SkyscrapersScene).km = function () {
    return this.settings;
  };
  protoOf(SkyscrapersScene).om = function () {
    return this.commandStars;
  };
  protoOf(SkyscrapersScene).ew = function () {
    return this.commandBuildings;
  };
  protoOf(SkyscrapersScene).fw = function () {
    return this.commandBuildingsBloom;
  };
  protoOf(SkyscrapersScene).an = function () {
    return this.PIf;
  };
  protoOf(SkyscrapersScene).updateTimers = function (time) {
    this.iu_1.ei(time);
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
    this.mu_1.enabled = !this.settings.blurred;
    this.nu_1.enabled = this.settings.blurred;
    this.su_1.enabled = this.settings.vignette;
    this.ou_1.additionalBlur = !this.settings.lowQuality;
    this.pu_1.additionalBlur = !this.settings.lowQuality;
    setUniform_1(this.commandBuildings.uniforms.q(11), 1.0 - this.settings.lights);
    setUniform_1(this.commandBuildingsBloom.uniforms.q(11), 1.0 - this.settings.lights);
    if (!(this.cameraAnimator.minDurationCoefficient === this.settings.cameraPeriod)) {
      this.cameraAnimator.minDurationCoefficient = this.settings.cameraPeriod;
    }
    if ((this.cameraAnimator.timer > 0.99 ? this.settings.autoSwitchCameras : false) ? Default_getInstance().o5() < 0.5 : false) {
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
      Matrix_getInstance().sg(this.matView, 0, eye.x, eye.y, eye.z, lookat.x, lookat.y, lookat.z, 0.0, 0.0, 1.0);
    }
    this.updatePlanes();
    this.updateMeshTransformations(this.commands);
    setUniform_3(this.commandBuildings.uniforms.q(4), eye);
    setUniform_3(this.commandBuildingsBloom.uniforms.q(4), eye);
  };
  protoOf(SkyscrapersScene).updatePlanes = function () {
    var angle1 = this.iu_1.ci(Timers_Planes1_getInstance()) * this.PIf * 2.0;
    var angle2 = this.iu_1.ci(Timers_Planes2_getInstance()) * this.PIf * 2.0;
    this.updatePlanePosition(angle1, 0.0, 0.0, this.cv_1.transform.k9_1);
    this.updatePlanePosition(-angle2 - this.PIf, 0.0, -400.0, this.dv_1.transform.k9_1);
    this.updatePlanePosition(-angle1 - this.PIf, 0.0, 300.0, this.ev_1.transform.k9_1);
    this.updatePlanePosition(angle2, 100.0, 300.0, this.fv_1.transform.k9_1);
    this.updatePlanePosition(angle1 + this.PIf / 2.0, 100.0, 300.0, this.gv_1.transform.k9_1);
    this.updatePlanePosition(angle2 + this.PIf / 1.5, 100.0, 300.0, this.hv_1.transform.k9_1);
    // Inline function 'kotlin.math.max' call
    // Inline function 'kotlin.math.min' call
    var a = this.viewportWidth;
    var b = this.viewportHeight;
    var b_0 = Math.min(a, b) / 300.0;
    var size = Math.max(2.5, b_0);
    setUniform_1(this.cv_1.uniforms.q(1), size);
  };
  protoOf(SkyscrapersScene).updatePlanePosition = function (angle, centerX, centerY, result) {
    // Inline function 'kotlin.math.sin' call
    result.x = Math.sin(angle) * this.bv_1 + centerX;
    // Inline function 'kotlin.math.cos' call
    result.y = Math.cos(angle) * this.bv_1 + centerY;
  };
  protoOf(SkyscrapersScene).nextCamera = function () {
    this.cameraAnimator.nextCamera();
  };
  protoOf(SkyscrapersScene).randomCamera = function () {
    if (this.cameraAnimator.state.equals(CameraState_TRANSITIONING_getInstance())) {
      return Unit_instance;
    }
    this.cameraAnimator.positionInterpolator.reverse = Default_getInstance().o5() < 0.5;
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
  protoOf(SkyscrapersSettings).dn = function (_set____db54di) {
    this.cameraPeriod = _set____db54di;
  };
  protoOf(SkyscrapersSettings).en = function () {
    return this.cameraPeriod;
  };
  protoOf(SkyscrapersSettings).fn = function (_set____db54di) {
    this.vignette = _set____db54di;
  };
  protoOf(SkyscrapersSettings).gn = function () {
    return this.vignette;
  };
  protoOf(SkyscrapersSettings).hn = function (_set____db54di) {
    this.blurred = _set____db54di;
  };
  protoOf(SkyscrapersSettings).in = function () {
    return this.blurred;
  };
  protoOf(SkyscrapersSettings).jn = function (_set____db54di) {
    this.autoSwitchCameras = _set____db54di;
  };
  protoOf(SkyscrapersSettings).kn = function () {
    return this.autoSwitchCameras;
  };
  protoOf(SkyscrapersSettings).pn = function (_set____db54di) {
    this.lowQuality = _set____db54di;
  };
  protoOf(SkyscrapersSettings).qn = function () {
    return this.lowQuality;
  };
  protoOf(SkyscrapersSettings).nn = function (_set____db54di) {
    this.clock = _set____db54di;
  };
  protoOf(SkyscrapersSettings).on = function () {
    return this.clock;
  };
  protoOf(SkyscrapersSettings).gw = function (_set____db54di) {
    this.lights = _set____db54di;
  };
  protoOf(SkyscrapersSettings).hw = function () {
    return this.lights;
  };
  function Shaders_1() {
    Shaders_instance_1 = this;
    this.uv_1 = new Shader('Diffuse');
    this.vv_1 = new Shader('SkyDither');
    this.wv_1 = new Shader('Color');
    this.xv_1 = new Shader('Building');
    this.yv_1 = new Shader('DiffuseFog');
    this.zv_1 = new Shader('ColorFog');
    this.aw_1 = new Shader('PointSpritesColored');
    this.bw_1 = new Shader('PointSpriteColored');
    this.cw_1 = mutableListOf([this.uv_1, this.vv_1, this.wv_1, this.xv_1, this.yv_1, this.zv_1, this.aw_1, this.bw_1]);
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
    tmp.jv_1 = this_0;
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
    tmp_0.kv_1 = this_1;
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
    tmp_1.lv_1 = this_2;
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
    tmp_2.mv_1 = this_3;
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
    tmp_3.nv_1 = this_4;
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
    tmp_4.ov_1 = this_5;
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
    tmp_5.pv_1 = this_6;
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
    tmp_6.qv_1 = this_7;
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
    tmp_7.rv_1 = this_8;
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
    tmp_8.sv_1 = this_9;
    this.tv_1 = mutableListOf([this.jv_1, this.kv_1, this.lv_1, this.mv_1, this.nv_1, this.ov_1, this.pv_1, this.qv_1, this.rv_1, this.sv_1]);
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
  protoOf(Companion_2).dw = function (timers) {
    timers.ai(Timers_Planes1_getInstance(), 80000.0);
    timers.ai(Timers_Planes2_getInstance(), 70000.0);
  };
  var Companion_instance_2;
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


});

const engine = KMPLibraryShared.org.androidworks.engine;
KMPLibraryShared.org.androidworks.example;
const cartoonplanes = KMPLibraryShared.org.androidworks.cartoonplanes;

class VertexVignetteShader2 extends BaseShader {
    constructor() {
        super(...arguments);
        // Attributes are numbers.
        this.rm_Vertex = 0;
        this.rm_AO = 1;
    }
    fillCode() {
        this.vertexShaderCode = `#version 300 es
            precision highp float;
            layout(location = 0) in vec2 rm_Vertex;
            layout(location = 1) in mediump float aAO;

            uniform mediump vec4 color0;
            uniform mediump vec4 color1;
            out mediump vec4 vAO;
            void main() {
              gl_Position.xy = rm_Vertex;
              gl_Position.z = 0.5;
              gl_Position.w = 1.0;
              vAO = mix(color0, color1, aAO);
            }`;
        this.fragmentShaderCode = `#version 300 es
            precision mediump float;
            out vec4 fragColor;
            in mediump vec4 vAO;

            const float MIN = 0.0;
            const float MAX = 1.0;

            void main() {
              fragColor = smoothstep(MIN, MAX, vAO);
            }`;
    }
    fillUniformsAttributes() {
        this.color0 = this.getUniform("color0");
        this.color1 = this.getUniform("color1");
    }
    drawVignette(renderer, model) {
        const gl = renderer.gl;
        model.bindBuffers(gl);
        gl.enableVertexAttribArray(this.rm_Vertex);
        gl.enableVertexAttribArray(this.rm_AO);
        gl.vertexAttribPointer(this.rm_Vertex, 2, gl.HALF_FLOAT, false, 8, 0);
        gl.vertexAttribPointer(this.rm_AO, 1, gl.UNSIGNED_BYTE, true, 8, 6);
        gl.drawElements(gl.TRIANGLES, model.getNumIndices() * 3, gl.UNSIGNED_SHORT, 0);
        renderer.checkGlError("VertexVignetteShader2 drawVignette");
    }
}

class Vignette {
    constructor() {
        this.fmVignette = new FullModel();
        this.color0 = [0, 0, 0, 1];
        this.color1 = [1, 1, 1, 1];
    }
    async initialize(gl) {
        this.shader = new VertexVignetteShader2(gl);
        await this.fmVignette.load(`data/models/vignette-round-vntao`, gl);
    }
    setColor0(r, g, b, a) {
        this.color0[0] = r;
        this.color0[1] = g;
        this.color0[2] = b;
        this.color0[3] = a;
    }
    setColor1(r, g, b, a) {
        this.color1[0] = r;
        this.color1[1] = g;
        this.color1[2] = b;
        this.color1[3] = a;
    }
    draw(renderer) {
        if (this.shader === undefined) {
            return;
        }
        const gl = renderer.gl;
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
        this.shader.use();
        gl.uniform4fv(this.shader.color0, this.color0);
        gl.uniform4fv(this.shader.color1, this.color1);
        this.shader.drawVignette(renderer, this.fmVignette);
        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
    }
}

const BLENDING_FACTORS = {
    "ZERO": WebGL2RenderingContext.ZERO,
    "ONE": WebGL2RenderingContext.ONE,
    "SRC_COLOR": WebGL2RenderingContext.SRC_COLOR,
    "ONE_MINUS_SRC_COLOR": WebGL2RenderingContext.ONE_MINUS_SRC_COLOR,
    "DST_COLOR": WebGL2RenderingContext.DST_COLOR,
    "ONE_MINUS_DST_COLOR": WebGL2RenderingContext.ONE_MINUS_DST_COLOR,
    "SRC_ALPHA": WebGL2RenderingContext.SRC_ALPHA,
    "ONE_MINUS_SRC_ALPHA": WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA,
    "DST_ALPHA": WebGL2RenderingContext.DST_ALPHA,
    "ONE_MINUS_DST_ALPHA": WebGL2RenderingContext.ONE_MINUS_DST_ALPHA,
    "CONSTANT_COLOR": WebGL2RenderingContext.CONSTANT_COLOR,
    "ONE_MINUS_CONSTANT_COLOR": WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR,
    "CONSTANT_ALPHA": WebGL2RenderingContext.CONSTANT_ALPHA,
    "ONE_MINUS_CONSTANT_ALPHA": WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA,
    "SRC_ALPHA_SATURATE": WebGL2RenderingContext.SRC_ALPHA_SATURATE
};
const BLENDING_EQUATIONS = {
    "ADD": WebGL2RenderingContext.FUNC_ADD,
    "SUBTRACT": WebGL2RenderingContext.FUNC_SUBTRACT,
    "REVERSE_SUBTRACT": WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT
};
const CULLING = {
    "BACK": WebGL2RenderingContext.BACK,
    "FRONT": WebGL2RenderingContext.FRONT,
    "FRONT_AND_BACK": WebGL2RenderingContext.FRONT_AND_BACK
};
const VERTEX_FORMATS = {
    "UBYTE": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 1, normalized: false },
    "UBYTE2": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 2, normalized: false },
    "UBYTE3": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 3, normalized: false },
    "UBYTE4": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 4, normalized: false },
    "BYTE": { type: WebGL2RenderingContext.BYTE, size: 1, normalized: false },
    "BYTE2": { type: WebGL2RenderingContext.BYTE, size: 2, normalized: false },
    "BYTE3": { type: WebGL2RenderingContext.BYTE, size: 3, normalized: false },
    "BYTE4": { type: WebGL2RenderingContext.BYTE, size: 4, normalized: false },
    "UBYTE_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 1, normalized: true },
    "UBYTE2_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 2, normalized: true },
    "UBYTE3_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 3, normalized: true },
    "UBYTE4_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_BYTE, size: 4, normalized: true },
    "BYTE_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 1, normalized: true },
    "BYTE2_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 2, normalized: true },
    "BYTE3_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 3, normalized: true },
    "BYTE4_NORMALIZED": { type: WebGL2RenderingContext.BYTE, size: 4, normalized: true },
    "USHORT": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 1, normalized: false },
    "USHORT2": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 2, normalized: false },
    "USHORT3": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 3, normalized: false },
    "USHORT4": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 4, normalized: false },
    "SHORT": { type: WebGL2RenderingContext.SHORT, size: 1, normalized: false },
    "SHORT2": { type: WebGL2RenderingContext.SHORT, size: 2, normalized: false },
    "SHORT3": { type: WebGL2RenderingContext.SHORT, size: 3, normalized: false },
    "SHORT4": { type: WebGL2RenderingContext.SHORT, size: 4, normalized: false },
    "USHORT_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 1, normalized: true },
    "USHORT2_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 2, normalized: true },
    "USHORT3_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 3, normalized: true },
    "USHORT4_NORMALIZED": { type: WebGL2RenderingContext.UNSIGNED_SHORT, size: 4, normalized: true },
    "SHORT_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 1, normalized: true },
    "SHORT2_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 2, normalized: true },
    "SHORT3_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 3, normalized: true },
    "SHORT4_NORMALIZED": { type: WebGL2RenderingContext.SHORT, size: 4, normalized: true },
    "HALF": { type: WebGL2RenderingContext.HALF_FLOAT, size: 1, normalized: false },
    "HALF2": { type: WebGL2RenderingContext.HALF_FLOAT, size: 2, normalized: false },
    "HALF3": { type: WebGL2RenderingContext.HALF_FLOAT, size: 3, normalized: false },
    "HALF4": { type: WebGL2RenderingContext.HALF_FLOAT, size: 4, normalized: false },
    "FLOAT": { type: WebGL2RenderingContext.FLOAT, size: 1, normalized: false },
    "FLOAT2": { type: WebGL2RenderingContext.FLOAT, size: 2, normalized: false },
    "FLOAT3": { type: WebGL2RenderingContext.FLOAT, size: 3, normalized: false },
    "FLOAT4": { type: WebGL2RenderingContext.FLOAT, size: 4, normalized: false },
    "UINT": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 1, normalized: false },
    "UINT2": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 2, normalized: false },
    "UINT3": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 3, normalized: false },
    "UINT4": { type: WebGL2RenderingContext.UNSIGNED_INT, size: 4, normalized: false },
    "INT": { type: WebGL2RenderingContext.INT, size: 1, normalized: false },
    "INT2": { type: WebGL2RenderingContext.INT, size: 2, normalized: false },
    "INT3": { type: WebGL2RenderingContext.INT, size: 3, normalized: false },
    "INT4": { type: WebGL2RenderingContext.INT, size: 4, normalized: false },
    "INT_1010102_NORMALIZED": { type: WebGL2RenderingContext.INT_2_10_10_10_REV, size: 1, normalized: true },
    "UINT_1010102_NORMALIZED": { type: WebGL2RenderingContext.INT_2_10_10_10_REV, size: 1, normalized: true }
};
const TEXTURE_FILTERING = {
    "NEAREST": WebGL2RenderingContext.NEAREST,
    "LINEAR": WebGL2RenderingContext.LINEAR,
    "NEAREST_MIPMAP_NEAREST": WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST,
    "LINEAR_MIPMAP_NEAREST": WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
    "NEAREST_MIPMAP_LINEAR": WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR,
    "LINEAR_MIPMAP_LINEAR": WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR
};

async function fetchArrayBuffer(url) {
    const response = await fetch(url);
    const result = await response.arrayBuffer();
    return result;
}

function loadFloatingPointTexture(renderer, data, gl, width, height, minFilter = gl.LINEAR, magFilter = gl.LINEAR, clamp = false, type = "fp16", numberOfComponents = 3) {
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
    let internalFormat = gl.RGB16F;
    let format = gl.RGB;
    let typeValue = gl.HALF_FLOAT;
    if (numberOfComponents === 2) {
        internalFormat = gl.RG16F;
        format = gl.RG;
    }
    else if (numberOfComponents === 1) {
        internalFormat = gl.R16F;
        format = gl.RED;
    }
    else if (numberOfComponents === 4) {
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
        }
        else if (numberOfComponents === 1) {
            internalFormat = gl.R8_SNORM;
            format = gl.RED;
        }
        else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA8_SNORM;
            format = gl.RGBA;
        }
    }
    else if (type === "sbyte") {
        internalFormat = gl.RGB8I;
        format = gl.RGB_INTEGER;
        typeValue = gl.BYTE;
        if (numberOfComponents === 2) {
            internalFormat = gl.RG8I;
            format = gl.RG_INTEGER;
        }
        else if (numberOfComponents === 1) {
            internalFormat = gl.R8I;
            format = gl.RED_INTEGER;
        }
        else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA8I;
            format = gl.RGBA_INTEGER;
        }
    }
    else if (type === "fp32") {
        internalFormat = gl.RGB32F;
        format = gl.RGB;
        typeValue = gl.FLOAT;
        if (numberOfComponents === 2) {
            internalFormat = gl.RG32F;
            format = gl.RG;
        }
        else if (numberOfComponents === 1) {
            internalFormat = gl.R32F;
            format = gl.RED;
        }
        else if (numberOfComponents === 4) {
            internalFormat = gl.RGBA32F;
            format = gl.RGBA;
        }
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, // type === "fp16" ? gl.RGB16F : gl.RGB8_SNORM,
    width, height, 0, format, //gl.RGB,
    typeValue, // type === "fp16" ? gl.HALF_FLOAT : gl.BYTE,
    dataView);
    renderer.checkGlError("loadFloatingPointTexture 1");
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    if (clamp === true) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
    renderer.checkGlError("loadFloatingPointTexture 2");
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}
async function loadRgbTexture(texture, gl) {
    texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";
    const glTexture = await UncompressedTextureLoader.load(`data/textures/${texture.fileName}.webp`, // WEBP only, instead of ASTC too
    gl, texture.mipmaps > 0 ? gl.LINEAR : minFilter, texture.mipmaps > 0 ? gl.LINEAR : magFilter, clamp);
    if (texture.mipmaps > 0) {
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    if (texture.anisotropy !== 0) {
        const ext = gl.getExtension("EXT_texture_filter_anisotropic") ||
            gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        if (ext) {
            const maxAnisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(maxAnisotropy, texture.anisotropy));
        }
    }
    return glTexture;
}
async function loadRgb16fTexture(texture, gl, renderer) {
    texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";
    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(renderer, data, gl, texture.width, texture.height, minFilter, magFilter, clamp, "fp16", 3);
    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);
    return glTexture;
}
async function loadRgba16fTexture(texture, gl, renderer) {
    texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";
    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(renderer, data, gl, texture.width, texture.height, minFilter, magFilter, clamp, "fp16", 4);
    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);
    return glTexture;
}
async function loadRgb32fTexture(texture, gl, renderer) {
    texture.format.name;
    const minFilter = TEXTURE_FILTERING[texture.minFilter.name];
    const magFilter = TEXTURE_FILTERING[texture.magFilter.name];
    const clamp = texture.wrapping.name === "CLAMP_TO_EDGE";
    const fileName = `data/textures/${texture.fileName}`;
    const data = await fetchArrayBuffer(fileName);
    const glTexture = loadFloatingPointTexture(renderer, data, gl, texture.width, texture.height, minFilter, magFilter, clamp, "fp32", 3);
    console.log(`Loaded texture ${fileName} [${texture.width}x${texture.height}]`);
    return glTexture;
}
async function loadCubemap(texture, gl) {
    return await UncompressedTextureLoader.loadCubemap(`data/textures/${texture.fileName}`, gl, "webp");
}

/**
 * Common utilities
 * @module glMatrix
 */
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$1() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * A Flying Camera allows free motion around the scene using FPS style controls (WASD + mouselook)
 * This type of camera is good for displaying large scenes
 */
class FpsCamera {
    get angles() {
        return this._angles;
    }
    set angles(value) {
        this._angles = value;
        this._dirty = true;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
        this._dirty = true;
    }
    get dirty() {
        return this._dirty;
    }
    set dirty(value) {
        this._dirty = value;
    }
    get viewMat() {
        if (this._dirty) {
            var mv = this._viewMat;
            identity(mv);
            rotateX(mv, mv, this.angles[0] - Math.PI / 2.0);
            rotateZ(mv, mv, this.angles[1]);
            rotateY(mv, mv, this.angles[2]);
            translate(mv, mv, [-this.position[0], -this.position[1], -this.position[2]]);
            this._dirty = false;
        }
        return this._viewMat;
    }
    constructor(options) {
        var _a, _b;
        this.options = options;
        this._dirty = true;
        this._angles = create();
        this._position = create();
        this.speed = 100;
        this.rotationSpeed = 0.025;
        this._cameraMat = create$1();
        this._viewMat = create$1();
        this.projectionMat = create$1();
        this.pressedKeys = new Array();
        this.vec3Temp1 = create();
        this.vec3Temp2 = create();
        this.canvas = options.canvas;
        this.speed = (_a = options.movementSpeed) !== null && _a !== void 0 ? _a : 100;
        this.rotationSpeed = (_b = options.rotationSpeed) !== null && _b !== void 0 ? _b : 0.025;
        // Set up the appropriate event hooks
        let moving = false;
        let lastX, lastY;
        window.addEventListener("keydown", event => this.pressedKeys[event.keyCode] = true);
        window.addEventListener("keyup", event => this.pressedKeys[event.keyCode] = false);
        this.canvas.addEventListener('contextmenu', event => event.preventDefault());
        this.canvas.addEventListener('mousedown', event => {
            if (event.which === 3) {
                moving = true;
            }
            lastX = event.pageX;
            lastY = event.pageY;
        });
        this.canvas.addEventListener('mousemove', event => {
            if (moving) {
                let xDelta = event.pageX - lastX;
                let yDelta = event.pageY - lastY;
                lastX = event.pageX;
                lastY = event.pageY;
                this.angles[1] += xDelta * this.rotationSpeed;
                if (this.angles[1] < 0) {
                    this.angles[1] += Math.PI * 2;
                }
                if (this.angles[1] >= Math.PI * 2) {
                    this.angles[1] -= Math.PI * 2;
                }
                this.angles[0] += yDelta * this.rotationSpeed;
                if (this.angles[0] < -Math.PI * 0.5) {
                    this.angles[0] = -Math.PI * 0.5;
                }
                if (this.angles[0] > Math.PI * 0.5) {
                    this.angles[0] = Math.PI * 0.5;
                }
                this._dirty = true;
            }
        });
        this.canvas.addEventListener('mouseup', event => moving = false);
    }
    update(frameTime) {
        this.vec3Temp1[0] = 0;
        this.vec3Temp1[1] = 0;
        this.vec3Temp1[2] = 0;
        let speed = (this.speed / 1000) * frameTime;
        if (this.pressedKeys[16]) { // Shift, speed up
            speed *= 5;
        }
        // This is our first person movement code. It's not really pretty, but it works
        if (this.pressedKeys['W'.charCodeAt(0)]) {
            this.vec3Temp1[1] += speed;
        }
        if (this.pressedKeys['S'.charCodeAt(0)]) {
            this.vec3Temp1[1] -= speed;
        }
        if (this.pressedKeys['A'.charCodeAt(0)]) {
            this.vec3Temp1[0] -= speed;
        }
        if (this.pressedKeys['D'.charCodeAt(0)]) {
            this.vec3Temp1[0] += speed;
        }
        if (this.pressedKeys[32]) { // Space, moves up
            this.vec3Temp1[2] += speed;
        }
        if (this.pressedKeys['C'.charCodeAt(0)]) { // C, moves down
            this.vec3Temp1[2] -= speed;
        }
        if (this.vec3Temp1[0] !== 0 || this.vec3Temp1[1] !== 0 || this.vec3Temp1[2] !== 0) {
            let cam = this._cameraMat;
            identity(cam);
            rotateX(cam, cam, this.angles[0]);
            rotateZ(cam, cam, this.angles[1]);
            invert(cam, cam);
            transformMat4(this.vec3Temp1, this.vec3Temp1, cam);
            // Move the camera in the direction we are facing
            add(this.position, this.position, this.vec3Temp1);
            // Restrict movement to the bounding box
            if (this.options.boundingBox) {
                const { boundingBox } = this.options;
                if (this.position[0] < boundingBox.minX) {
                    this.position[0] = boundingBox.minX;
                }
                if (this.position[0] > boundingBox.maxX) {
                    this.position[0] = boundingBox.maxX;
                }
                if (this.position[1] < boundingBox.minY) {
                    this.position[1] = boundingBox.minY;
                }
                if (this.position[1] > boundingBox.maxY) {
                    this.position[1] = boundingBox.maxY;
                }
                if (this.position[2] < boundingBox.minZ) {
                    this.position[2] = boundingBox.minZ;
                }
                if (this.position[2] > boundingBox.maxZ) {
                    this.position[2] = boundingBox.maxZ;
                }
            }
            this._dirty = true;
        }
    }
}

var MovementMode;
(function (MovementMode) {
    MovementMode[MovementMode["Free"] = 0] = "Free";
    MovementMode[MovementMode["Predefined"] = 1] = "Predefined";
})(MovementMode || (MovementMode = {}));
class FreeMovement {
    constructor(renderer, options) {
        this.renderer = renderer;
        this.options = options;
        this.matCamera = create$1();
        this.matInvCamera = new Float32Array(16);
        this.vec3Eye = new Float32Array(3);
        this.vec3Rotation = new Float32Array(3);
        this.enabled = false;
        this.mode = MovementMode.Predefined;
        this.setupControls();
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
        this.renderer.setCustomCamera(undefined);
    }
    setupControls() {
        var _a;
        this.matCamera = clone(this.renderer.getViewMatrix());
        // this.renderer.setCustomCamera(this.matCamera);
        this.mode = MovementMode.Free;
        invert(this.matInvCamera, this.matCamera);
        getTranslation(this.vec3Eye, this.matInvCamera);
        normalize(this.vec3Rotation, this.vec3Eye);
        scale(this.vec3Rotation, this.vec3Rotation, -1);
        this.fpsCamera = (_a = this.fpsCamera) !== null && _a !== void 0 ? _a : new FpsCamera(this.options);
        this.fpsCamera.position = this.vec3Eye;
        const callback = (_time) => {
            if (this.mode !== MovementMode.Free) {
                return;
            }
            this.fpsCamera.update(16);
            this.matCamera = this.fpsCamera.viewMat;
            if (this.enabled) {
                this.renderer.setCustomCamera(this.matCamera, this.fpsCamera.position, this.fpsCamera.angles);
            }
            requestAnimationFrame(callback);
        };
        callback();
    }
    ;
    updatePosition(position) {
        if (this.fpsCamera) {
            this.fpsCamera.position[0] = position[0];
            this.fpsCamera.position[1] = position[1];
            this.fpsCamera.position[2] = position[2];
            this.fpsCamera.dirty = true;
            this.fpsCamera.update(0);
        }
    }
    updateRotation(rotation) {
        if (this.fpsCamera) {
            this.fpsCamera.angles[0] = rotation[0];
            this.fpsCamera.angles[1] = rotation[1];
            this.fpsCamera.angles[2] = rotation[2];
            this.fpsCamera.dirty = true;
            this.fpsCamera.update(0);
        }
    }
}

var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["Rotating"] = 0] = "Rotating";
    CameraMode[CameraMode["Random"] = 1] = "Random";
    CameraMode[CameraMode["Orbiting"] = 2] = "Orbiting";
    CameraMode[CameraMode["FPS"] = 3] = "FPS";
    CameraMode[CameraMode["FrontEnd"] = 4] = "FrontEnd";
})(CameraMode || (CameraMode = {}));

/**
 * Gaussian blur shader.
 * Uses default blur radius of 5 pixels.
 */
class GaussianBlurShader extends BaseShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 6;
const float OFFSETS[6] = float[6](
    -4.455269417428358,
    -2.4751038298192056,
    -0.4950160492928827,
    1.485055021558738,
    3.465172537482815,
    5.0
);
const float WEIGHTS[6] = float[6](
    0.14587920530480702,
    0.19230308352110734,
    0.21647621943673803,
    0.20809835496561988,
    0.17082879595769634,
    0.06641434081403137
);`;
    }
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `#version 300 es
            precision highp float;
            out vec2 vTextureCoord;

            const vec2 vertices[4] = vec2[4](
              vec2(-1.0f, -1.0f),
              vec2( 1.0f, -1.0f),
              vec2(-1.0f,  1.0f),
              vec2( 1.0f,  1.0f)
            );
            const vec2 uvs[4] = vec2[4](
              vec2(0.0f, 0.0f),
              vec2(1.0f, 0.0f),
              vec2(0.0f, 1.0f),
              vec2(1.0f, 1.0f)
            );

            void main() {
              gl_Position = vec4(vertices[gl_VertexID], 0.0f, 1.0f);
              vTextureCoord = uvs[gl_VertexID];
            }`;
        this.fragmentShaderCode = `#version 300 es
            precision highp float;

            ${this.getKernel()}

            // blurDirection is:
            //     vec2(1,0) for horizontal pass
            //     vec2(0,1) for vertical pass
            // The sourceTexture to be blurred MUST use linear filtering!
            // pixelCoord is in [0..1]
            mediump vec4 blur(in sampler2D sourceTexture, vec2 blurDirection, vec2 pixelCoord)
            {
                mediump vec4 result = vec4(0.0);
                vec2 size = vec2(textureSize(sourceTexture, 0));
                for (int i = 0; i < SAMPLE_COUNT; ++i)
                {
                    vec2 offset = blurDirection * OFFSETS[i] / size;
                    float weight = WEIGHTS[i];
                    result += texture(sourceTexture, pixelCoord + offset) * weight;
                }
                return result;
            }

            in vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform vec2 direction;
            uniform mediump float brightness;
            out mediump vec4 fragColor;

            void main() {
                fragColor = blur(sTexture, direction, vTextureCoord);
                fragColor *= brightness;
            }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        this.sTexture = this.getUniform("sTexture");
        this.brightness = this.getUniform("brightness");
        this.direction = this.getUniform("direction");
    }
}

/**
 * Gaussian blur shader.
 * Uses blur radius of 4 pixels.
 */
class GaussianBlurShader4 extends GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 5;
const float OFFSETS[5] = float[5](
    -3.4048471718931532,
    -1.4588111840004858,
    0.48624268466894843,
    2.431625915613778,
    4.
);
const float WEIGHTS[5] = float[5](
    0.15642123799829394,
    0.26718801880015064,
    0.29738065394682034,
    0.21568339342709997,
    0.06332669582763516
);`;
    }
}

/**
 * Gaussian blur shader.
 * Uses blur radius of 3 pixels.
 */
class GaussianBlurShader3 extends GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 4;
const float OFFSETS[4] = float[4](
    -2.431625915613778,
    -0.4862426846689484,
    1.4588111840004858,
    3.
);
const float WEIGHTS[4] = float[4](
    0.24696196374528634,
    0.34050702333458593,
    0.30593582919679174,
    0.10659518372333592
);`;
    }
}

/**
 * Gaussian blur shader.
 * Uses blur radius of 3 pixels.
 */
class GaussianBlurShader2 extends GaussianBlurShader {
    getKernel() {
        return `const int SAMPLE_COUNT = 3;
const float OFFSETS[3] = float[3](
    -1.4588111840004858,
    0.48624268466894843,
    2.
);
const float WEIGHTS[3] = float[3](
    0.38883081312055,
    0.43276926113573877,
    0.17839992574371122
);`;
    }
}

/**
 * Gaussian blur kernel size.
 */
var BlurSize;
(function (BlurSize) {
    BlurSize[BlurSize["KERNEL_5"] = 0] = "KERNEL_5";
    BlurSize[BlurSize["KERNEL_4"] = 1] = "KERNEL_4";
    BlurSize[BlurSize["KERNEL_3"] = 2] = "KERNEL_3";
    BlurSize[BlurSize["KERNEL_2"] = 3] = "KERNEL_2";
})(BlurSize || (BlurSize = {}));
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
        this.blurShader5 = new GaussianBlurShader(gl);
        this.blurShader4 = new GaussianBlurShader4(gl);
        this.blurShader3 = new GaussianBlurShader3(gl);
        this.blurShader2 = new GaussianBlurShader2(gl);
        this.textureOffscreen = TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreen = new FrameBuffer(gl);
        this.fboOffscreen.textureHandle = this.textureOffscreen;
        this.fboOffscreen.width = this.width;
        this.fboOffscreen.height = this.height;
        this.fboOffscreen.createGLData(this.width, this.height);
        this.textureOffscreenMsaa = TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenMsaa = new MsaaFrameBuffer(gl);
        this.fboOffscreenMsaa.textureHandle = this.textureOffscreenMsaa;
        this.fboOffscreenMsaa.width = this.width;
        this.fboOffscreenMsaa.height = this.height;
        this.fboOffscreenMsaa.createGLData(this.width, this.height);
        this.textureOffscreenVert = TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenVert = new FrameBuffer(gl);
        this.fboOffscreenVert.textureHandle = this.textureOffscreenVert;
        this.fboOffscreenVert.width = this.width;
        this.fboOffscreenVert.height = this.height;
        this.fboOffscreenVert.createGLData(this.width, this.height);
        this.textureOffscreenVertMsaa = TextureUtils.createNpotTexture(gl, this.width, this.height, false);
        this.fboOffscreenVertMsaa = new FrameBuffer(gl);
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

class FullscreenQuad {
    constructor(gl) {
        this.gl = gl;
        this.matrix = create$1();
        identity(this.matrix);
        this.initBuffer();
    }
    initBuffer() {
        this.quadTriangles = new Float32Array([
            // X, Y, Z, U, V
            -1.0, -1.0, 0.0, 0.0, 0.0,
            1.0, -1.0, 0.0, 1.0, 0.0,
            -1.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0, 1.0, // 3. right-top
        ]);
        this.vertexDataBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.quadTriangles, this.gl.STATIC_DRAW);
    }
    draw(shader) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
        this.gl.enableVertexAttribArray(shader.rm_Vertex);
        this.gl.vertexAttribPointer(shader.rm_Vertex, 3, this.gl.FLOAT, false, 5 * 4, 0);
        this.gl.enableVertexAttribArray(shader.rm_TexCoord0);
        this.gl.vertexAttribPointer(shader.rm_TexCoord0, 2, this.gl.FLOAT, false, 5 * 4, 4 * 3);
        this.gl.uniformMatrix4fv(shader.view_proj_matrix, false, this.matrix);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}

const BLUR_SIZES = {
    "KERNEL_2": BlurSize.KERNEL_2,
    "KERNEL_3": BlurSize.KERNEL_3,
    "KERNEL_4": BlurSize.KERNEL_4,
    "KERNEL_5": BlurSize.KERNEL_5
};

class BasePreprocessingShader extends BaseShader {
    constructor(gl, preprocessingVertex = [], preprocessingFragment = []) {
        super(gl);
        this.preprocessingVertex = preprocessingVertex;
        this.preprocessingFragment = preprocessingFragment;
        this.initShader();
    }
    initShader() {
        // Prevent super from compiling shader without preprocessing replacements initialized
        if (this.preprocessingVertex === undefined || this.preprocessingFragment === undefined) {
            return;
        }
        this.preprocessCode();
        super.initShader();
    }
    preprocessCode() {
        var _a, _b;
        for (const item of (_a = this.preprocessingVertex) !== null && _a !== void 0 ? _a : []) {
            this.vertexShaderCode = this.vertexShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
        for (const item of (_b = this.preprocessingFragment) !== null && _b !== void 0 ? _b : []) {
            this.fragmentShaderCode = this.fragmentShaderCode.replace(item.stringToReplace, item.valueToReplaceWith);
        }
    }
}

class DiffuseShader extends BasePreprocessingShader {
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
            uniform mat4 view_proj_matrix;
            attribute vec4 rm_Vertex;
            attribute vec2 rm_TexCoord0;
            varying vec2 vTextureCoord;
            /*UNIFORMS*/

            void main() {
              gl_Position = view_proj_matrix * rm_Vertex;
              vTextureCoord = rm_TexCoord0;
              /*POST_VERTEX*/;
            }`;
        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            /*UNIFORMS*/

            void main() {
              gl_FragColor = texture2D(sTexture, vTextureCoord);
              /*POST_FRAGMENT*/;
            }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        this.rm_Vertex = this.getAttrib('rm_Vertex');
        this.rm_TexCoord0 = this.getAttrib('rm_TexCoord0');
        this.view_proj_matrix = this.getUniform('view_proj_matrix');
        this.sTexture = this.getUniform('sTexture');
        this.attributes = [this.rm_Vertex, this.rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: this.rm_Vertex,
            [engine.AttributeType.UV0.ordinal]: this.rm_TexCoord0
        };
        this.uniforms = [this.view_proj_matrix, this.sTexture];
    }
}

/**
 * Base class to render and interact with `Scene`.
 */
class SceneRenderer extends BaseRenderer {
    constructor() {
        super();
        this.framesCount = 0;
        this.models = [];
        this.textures = [];
        this.shaders = [];
        this.cameraMode = CameraMode.FrontEnd;
        this.cameraPosition = create();
        this.cameraRotation = create();
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
        this.freeMovement = new FreeMovement(this, {
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
        this.gl;
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
            const model = new FullModel();
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
                return loadRgbTexture(texture, gl);
            }
            else if (formatName === "RGB16F") {
                return loadRgb16fTexture(texture, gl, this);
            }
            else if (formatName === "RGBA16F") {
                return loadRgba16fTexture(texture, gl, this);
            }
            else if (formatName === "RGB32F") {
                return loadRgb32fTexture(texture, gl, this);
            }
        }
        else if (texture.type.name === "CUBEMAP") {
            return loadCubemap(texture, gl);
        }
        throw new Error(`Unsupported texture type ${texture.type.name}`);
    }
    async loadData() {
        var _a, _b, _c;
        if (this.scene === undefined) {
            return;
        }
        this.vignette = new Vignette();
        await this.vignette.initialize(this.gl);
        await Promise.all([this.loadSceneModels(), this.loadSceneTextures()]);
        console.log("Loaded scene data.");
        if (this.canvas) {
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.updateViewportSize(this.canvas.width, this.canvas.height);
            (_b = this.scene) === null || _b === void 0 ? void 0 : _b.initialize();
        }
        this.fullscreenQuad = new FullscreenQuad(this.gl);
        this.shaderDiffuse = new DiffuseShader(this.gl);
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
            if (command instanceof engine.commands.BlurredPassCommand) {
                this.processBlurredPassCommands(command);
            }
            else if (command instanceof engine.commands.GroupCommand) {
                this.processCommands(command.commands.toArray());
            }
            else if (command instanceof engine.commands.ClearColorCommand) {
                const { color } = command;
                this.gl.clearColor(color.r, color.g, color.b, color.a);
            }
            else if (command instanceof engine.commands.ClearCommand) {
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
            }
            else if (command instanceof engine.commands.VignetteCommand) {
                this.drawVignette(command);
            }
            else if (command instanceof engine.commands.DrawMeshCommand) {
                this.drawMesh(command);
            }
            else if (command instanceof engine.commands.DrawBlurredCommand) {
                this.processDrawBlurred(command);
            }
            else {
                this.processCustomCommand(command);
            }
        }
    }
    processBlurredPassCommands(command) {
        var _a, _b, _c, _d;
        (_a = this.blurredPass) !== null && _a !== void 0 ? _a : (this.blurredPass = new GaussianBlurRenderPass(this.gl, command.minSize, this.canvas.width / this.canvas.height));
        (_b = this.blurredPass) === null || _b === void 0 ? void 0 : _b.switchToOffscreenFBOMsaa();
        this.processCommands(command.commands.toArray());
        this.blurredPass.blitToTexture();
        (_c = this.blurredPass) === null || _c === void 0 ? void 0 : _c.blur(command.brightness, BLUR_SIZES[command.blurSize.name]);
        if (command.additionalBlur) {
            (_d = this.blurredPass) === null || _d === void 0 ? void 0 : _d.blur(1.0, BLUR_SIZES.KERNEL_2);
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
            const { type, size, normalized } = VERTEX_FORMATS[attrib.format.name];
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
            }
            else if (uniform instanceof engine.UniformTextureValue) {
                if (uniform.value.type.name === "TEX_2D") {
                    this.setTexture2D(currentTextureUnit++, this.textures[uniform.value.id], binding);
                }
                else if (uniform.value.type.name === "CUBEMAP") {
                    this.setTextureCubemap(currentTextureUnit++, this.textures[uniform.value.id], binding);
                }
            }
            else if (uniform instanceof engine.UniformIntValue) {
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
                gl.blendEquation(BLENDING_EQUATIONS[blending.equationColor.name]);
                gl.blendFunc(BLENDING_FACTORS[blending.sourceFactorColor.name], BLENDING_FACTORS[blending.destinationFactorColor.name]);
            }
            else {
                gl.blendEquationSeparate(BLENDING_EQUATIONS[blending.equationColor.name], BLENDING_EQUATIONS[blending.equationAlpha.name]);
                gl.blendFuncSeparate(BLENDING_FACTORS[blending.sourceFactorColor.name], BLENDING_FACTORS[blending.destinationFactorColor.name], BLENDING_FACTORS[blending.sourceFactorAlpha.name], BLENDING_FACTORS[blending.destinationFactorAlpha.name]);
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
            gl.cullFace(CULLING[culling.name]);
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
        if (mode === CameraMode.FPS) {
            (_a = this.freeMovement) === null || _a === void 0 ? void 0 : _a.updatePosition([0, 0, 0]);
            (_b = this.freeMovement) === null || _b === void 0 ? void 0 : _b.updateRotation([0, 0, 0]);
            (_c = this.freeMovement) === null || _c === void 0 ? void 0 : _c.enable();
        }
        else if (mode === CameraMode.FrontEnd) {
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

class SkyTransitionShader extends BasePreprocessingShader {
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
            uniform mat4 view_proj_matrix;
            attribute vec4 rm_Vertex;
            attribute vec2 rm_TexCoord0;
            varying vec2 vTextureCoord;
            /*UNIFORMS*/

            void main() {
              gl_Position = view_proj_matrix * rm_Vertex;
              vTextureCoord = rm_TexCoord0;
              /*POST_VERTEX*/;
            }`;
        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform sampler2D sTexture2;
            uniform sampler2D sNoise;
            uniform float transition;
            /*UNIFORMS*/

            void main() {
                vec4 color1 = texture2D(sTexture, vTextureCoord);
                vec4 color2 = texture2D(sTexture2, vTextureCoord);
                float r = texture2D(sNoise, vTextureCoord).r;

                r -= 0.5;
                r += transition;
                r = smoothstep(0.49, 0.51, r);
                // r = step(0.5, r);

                vec4 mixed = mix(color1, color2, r);
                mixed *= smoothstep(0.15, 0.25, abs(r - 0.5));

                gl_FragColor = mixed;
                /*POST_FRAGMENT*/;
            }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_TexCoord0 = this.getAttrib("rm_TexCoord0");
        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const sTexture = this.getUniform("sTexture");
        const sTexture2 = this.getUniform("sTexture2");
        const sNoise = this.getUniform("sNoise");
        const transition = this.getUniform("transition");
        this.attributes = [rm_Vertex, rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [engine.AttributeType.UV0.ordinal]: rm_TexCoord0
        };
        this.uniforms = [view_proj_matrix, sTexture, sTexture2, sNoise, transition];
    }
}

class OutlineShader extends BasePreprocessingShader {
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
        attribute vec4 rm_Vertex;
        attribute vec4 rm_Normal;

        uniform mat4 view_proj_matrix;
        uniform float uThickness1; // 0.002

        void main() {
            vec4 pos = vec4(rm_Vertex.xyz, 1.0);
            float dist = (view_proj_matrix * pos).w / 3000.;
            pos += rm_Normal * uThickness1 * dist;
            // pos += rm_Normal * uThickness1;
            pos.w = 1.0;

            gl_Position = view_proj_matrix * pos;
        }`;
        this.fragmentShaderCode = `precision mediump float;
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_Normal = this.getAttrib("rm_Normal");
        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const uThickness1 = this.getUniform("uThickness1");
        const color = this.getUniform("color");
        this.attributes = [rm_Vertex, rm_Normal];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [engine.AttributeType.NORMAL.ordinal]: rm_Normal
        };
        this.uniforms = [view_proj_matrix, uThickness1, color];
    }
}

class PropShader extends BasePreprocessingShader {
    /** @inheritdoc */
    fillCode() {
        this.vertexShaderCode = `precision highp float;
            uniform mat4 view_proj_matrix;
            attribute vec4 rm_Vertex;
            attribute vec2 rm_TexCoord0;
            varying vec2 vTextureCoord;
            /*UNIFORMS*/

            void main() {
              gl_Position = view_proj_matrix * rm_Vertex;
              vTextureCoord = rm_TexCoord0;
              /*POST_VERTEX*/;
            }`;
        this.fragmentShaderCode = `precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D sTexture;
            uniform float brightness;

            void main() {
              vec4 color = texture2D(sTexture, vTextureCoord);
              gl_FragColor = vec4(color.rgb * brightness, 1. - color.r);
            }`;
    }
    /** @inheritdoc */
    fillUniformsAttributes() {
        const rm_Vertex = this.getAttrib("rm_Vertex");
        const rm_TexCoord0 = this.getAttrib("rm_TexCoord0");
        const view_proj_matrix = this.getUniform("view_proj_matrix");
        const sTexture = this.getUniform("sTexture");
        const brightness = this.getUniform("brightness");
        this.attributes = [rm_Vertex, rm_TexCoord0];
        this.typedAttributes = {
            [engine.AttributeType.VERTEX.ordinal]: rm_Vertex,
            [engine.AttributeType.UV0.ordinal]: rm_TexCoord0
        };
        this.uniforms = [view_proj_matrix, sTexture, brightness];
    }
}

class Renderer extends SceneRenderer {
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
        const scene = new cartoonplanes.CartoonPlanesScene();
        scene.nextCamera();
        return scene;
    }
    createShader(name) {
        // const filters = getFilters("gl_FragColor");
        // const filter = filters[this.scene?.settings.colorMode.name!];
        if (name === "Diffuse") {
            return new DiffuseShader(this.gl, []);
        }
        else if (name === "SkyTransition") {
            return new SkyTransitionShader(this.gl, []);
        }
        else if (name === "Outline") {
            return new OutlineShader(this.gl, []);
        }
        else if (name === "Prop") {
            return new PropShader(this.gl, []);
        }
        throw new Error(`Unknown shader type ${name}`);
    }
    nextCamera() {
        var _a;
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.nextCamera();
    }
    get settings() {
        return this.scene.settings;
    }
    async randomizeSky() {
        // const length = this.config.animals[this.config.currentAnimal].animations.length;
        // this.config.currentAnimalAnimation = (this.config.currentAnimalAnimation + 1 + Math.trunc(Math.random() * (length - 2))) % length;
        var _a;
        if (this.scene === undefined) {
            return;
        }
        // TODO: Use a separate texture for static sky and pair for transition,
        // then update only the transition textures and draw transition only after timer is > 0.05 or smth
        // This should prevent 1-frame flickering when changing sky
        this.scene.texSky.id;
        const id1 = this.scene.texSky1.id;
        const id2 = this.scene.texSky2.id;
        this.scene.texSky1.fileName;
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
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.changeSky();
        // Update draw commands after changing sky
        this.processCommands(this.commands);
    }
}

/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */

/**
 * Base class for all controllers.
 */
class Controller {

	constructor( parent, object, property, className, elementType = 'div' ) {

		/**
		 * The GUI that contains this controller.
		 * @type {GUI}
		 */
		this.parent = parent;

		/**
		 * The object this controller will modify.
		 * @type {object}
		 */
		this.object = object;

		/**
		 * The name of the property to control.
		 * @type {string}
		 */
		this.property = property;

		/**
		 * Used to determine if the controller is disabled.
		 * Use `controller.disable( true|false )` to modify this value.
		 * @type {boolean}
		 */
		this._disabled = false;

		/**
		 * Used to determine if the Controller is hidden.
		 * Use `controller.show()` or `controller.hide()` to change this.
		 * @type {boolean}
		 */
		this._hidden = false;

		/**
		 * The value of `object[ property ]` when the controller was created.
		 * @type {any}
		 */
		this.initialValue = this.getValue();

		/**
		 * The outermost container DOM element for this controller.
		 * @type {HTMLElement}
		 */
		this.domElement = document.createElement( elementType );
		this.domElement.classList.add( 'controller' );
		this.domElement.classList.add( className );

		/**
		 * The DOM element that contains the controller's name.
		 * @type {HTMLElement}
		 */
		this.$name = document.createElement( 'div' );
		this.$name.classList.add( 'name' );

		Controller.nextNameID = Controller.nextNameID || 0;
		this.$name.id = `lil-gui-name-${++Controller.nextNameID}`;

		/**
		 * The DOM element that contains the controller's "widget" (which differs by controller type).
		 * @type {HTMLElement}
		 */
		this.$widget = document.createElement( 'div' );
		this.$widget.classList.add( 'widget' );

		/**
		 * The DOM element that receives the disabled attribute when using disable().
		 * @type {HTMLElement}
		 */
		this.$disable = this.$widget;

		this.domElement.appendChild( this.$name );
		this.domElement.appendChild( this.$widget );

		// Don't fire global key events while typing in a controller
		this.domElement.addEventListener( 'keydown', e => e.stopPropagation() );
		this.domElement.addEventListener( 'keyup', e => e.stopPropagation() );

		this.parent.children.push( this );
		this.parent.controllers.push( this );

		this.parent.$children.appendChild( this.domElement );

		this._listenCallback = this._listenCallback.bind( this );

		this.name( property );

	}

	/**
	 * Sets the name of the controller and its label in the GUI.
	 * @param {string} name
	 * @returns {this}
	 */
	name( name ) {
		/**
		 * The controller's name. Use `controller.name( 'Name' )` to modify this value.
		 * @type {string}
		 */
		this._name = name;
		this.$name.textContent = name;
		return this;
	}

	/**
	 * Pass a function to be called whenever the value is modified by this controller.
	 * The function receives the new value as its first parameter. The value of `this` will be the
	 * controller.
	 *
	 * For function controllers, the `onChange` callback will be fired on click, after the function
	 * executes.
	 * @param {Function} callback
	 * @returns {this}
	 * @example
	 * const controller = gui.add( object, 'property' );
	 *
	 * controller.onChange( function( v ) {
	 * 	console.log( 'The value is now ' + v );
	 * 	console.assert( this === controller );
	 * } );
	 */
	onChange( callback ) {
		/**
		 * Used to access the function bound to `onChange` events. Don't modify this value directly.
		 * Use the `controller.onChange( callback )` method instead.
		 * @type {Function}
		 */
		this._onChange = callback;
		return this;
	}

	/**
	 * Calls the onChange methods of this controller and its parent GUI.
	 * @protected
	 */
	_callOnChange() {

		this.parent._callOnChange( this );

		if ( this._onChange !== undefined ) {
			this._onChange.call( this, this.getValue() );
		}

		this._changed = true;

	}

	/**
	 * Pass a function to be called after this controller has been modified and loses focus.
	 * @param {Function} callback
	 * @returns {this}
	 * @example
	 * const controller = gui.add( object, 'property' );
	 *
	 * controller.onFinishChange( function( v ) {
	 * 	console.log( 'Changes complete: ' + v );
	 * 	console.assert( this === controller );
	 * } );
	 */
	onFinishChange( callback ) {
		/**
		 * Used to access the function bound to `onFinishChange` events. Don't modify this value
		 * directly. Use the `controller.onFinishChange( callback )` method instead.
		 * @type {Function}
		 */
		this._onFinishChange = callback;
		return this;
	}

	/**
	 * Should be called by Controller when its widgets lose focus.
	 * @protected
	 */
	_callOnFinishChange() {

		if ( this._changed ) {

			this.parent._callOnFinishChange( this );

			if ( this._onFinishChange !== undefined ) {
				this._onFinishChange.call( this, this.getValue() );
			}

		}

		this._changed = false;

	}

	/**
	 * Sets the controller back to its initial value.
	 * @returns {this}
	 */
	reset() {
		this.setValue( this.initialValue );
		this._callOnFinishChange();
		return this;
	}

	/**
	 * Enables this controller.
	 * @param {boolean} enabled
	 * @returns {this}
	 * @example
	 * controller.enable();
	 * controller.enable( false ); // disable
	 * controller.enable( controller._disabled ); // toggle
	 */
	enable( enabled = true ) {
		return this.disable( !enabled );
	}

	/**
	 * Disables this controller.
	 * @param {boolean} disabled
	 * @returns {this}
	 * @example
	 * controller.disable();
	 * controller.disable( false ); // enable
	 * controller.disable( !controller._disabled ); // toggle
	 */
	disable( disabled = true ) {

		if ( disabled === this._disabled ) return this;

		this._disabled = disabled;

		this.domElement.classList.toggle( 'disabled', disabled );
		this.$disable.toggleAttribute( 'disabled', disabled );

		return this;

	}

	/**
	 * Shows the Controller after it's been hidden.
	 * @param {boolean} show
	 * @returns {this}
	 * @example
	 * controller.show();
	 * controller.show( false ); // hide
	 * controller.show( controller._hidden ); // toggle
	 */
	show( show = true ) {

		this._hidden = !show;

		this.domElement.style.display = this._hidden ? 'none' : '';

		return this;

	}

	/**
	 * Hides the Controller.
	 * @returns {this}
	 */
	hide() {
		return this.show( false );
	}

	/**
	 * Changes this controller into a dropdown of options.
	 *
	 * Calling this method on an option controller will simply update the options. However, if this
	 * controller was not already an option controller, old references to this controller are
	 * destroyed, and a new controller is added to the end of the GUI.
	 * @example
	 * // safe usage
	 *
	 * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
	 * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
	 * gui.add( obj, 'prop3' );
	 *
	 * // danger
	 *
	 * const ctrl1 = gui.add( obj, 'prop1' );
	 * gui.add( obj, 'prop2' );
	 *
	 * // calling options out of order adds a new controller to the end...
	 * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
	 *
	 * // ...and ctrl1 now references a controller that doesn't exist
	 * assert( ctrl2 !== ctrl1 )
	 * @param {object|Array} options
	 * @returns {Controller}
	 */
	options( options ) {
		const controller = this.parent.add( this.object, this.property, options );
		controller.name( this._name );
		this.destroy();
		return controller;
	}

	/**
	 * Sets the minimum value. Only works on number controllers.
	 * @param {number} min
	 * @returns {this}
	 */
	min( min ) {
		return this;
	}

	/**
	 * Sets the maximum value. Only works on number controllers.
	 * @param {number} max
	 * @returns {this}
	 */
	max( max ) {
		return this;
	}

	/**
	 * Values set by this controller will be rounded to multiples of `step`. Only works on number
	 * controllers.
	 * @param {number} step
	 * @returns {this}
	 */
	step( step ) {
		return this;
	}

	/**
	 * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
	 * like `step()`. Only works on number controllers.
	 * @example
	 * gui.add( object, 'property' ).listen().decimals( 4 );
	 * @param {number} decimals
	 * @returns {this}
	 */
	decimals( decimals ) {
		return this;
	}

	/**
	 * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
	 * @param {boolean} listen
	 * @returns {this}
	 */
	listen( listen = true ) {

		/**
		 * Used to determine if the controller is currently listening. Don't modify this value
		 * directly. Use the `controller.listen( true|false )` method instead.
		 * @type {boolean}
		 */
		this._listening = listen;

		if ( this._listenCallbackID !== undefined ) {
			cancelAnimationFrame( this._listenCallbackID );
			this._listenCallbackID = undefined;
		}

		if ( this._listening ) {
			this._listenCallback();
		}

		return this;

	}

	_listenCallback() {

		this._listenCallbackID = requestAnimationFrame( this._listenCallback );

		// To prevent framerate loss, make sure the value has changed before updating the display.
		// Note: save() is used here instead of getValue() only because of ColorController. The !== operator
		// won't work for color objects or arrays, but ColorController.save() always returns a string.

		const curValue = this.save();

		if ( curValue !== this._listenPrevValue ) {
			this.updateDisplay();
		}

		this._listenPrevValue = curValue;

	}

	/**
	 * Returns `object[ property ]`.
	 * @returns {any}
	 */
	getValue() {
		return this.object[ this.property ];
	}

	/**
	 * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
	 * @param {any} value
	 * @returns {this}
	 */
	setValue( value ) {

		if ( this.getValue() !== value ) {

			this.object[ this.property ] = value;
			this._callOnChange();
			this.updateDisplay();

		}

		return this;

	}

	/**
	 * Updates the display to keep it in sync with the current value. Useful for updating your
	 * controllers when their values have been modified outside of the GUI.
	 * @returns {this}
	 */
	updateDisplay() {
		return this;
	}

	load( value ) {
		this.setValue( value );
		this._callOnFinishChange();
		return this;
	}

	save() {
		return this.getValue();
	}

	/**
	 * Destroys this controller and removes it from the parent GUI.
	 */
	destroy() {
		this.listen( false );
		this.parent.children.splice( this.parent.children.indexOf( this ), 1 );
		this.parent.controllers.splice( this.parent.controllers.indexOf( this ), 1 );
		this.parent.$children.removeChild( this.domElement );
	}

}

class BooleanController extends Controller {

	constructor( parent, object, property ) {

		super( parent, object, property, 'boolean', 'label' );

		this.$input = document.createElement( 'input' );
		this.$input.setAttribute( 'type', 'checkbox' );
		this.$input.setAttribute( 'aria-labelledby', this.$name.id );

		this.$widget.appendChild( this.$input );

		this.$input.addEventListener( 'change', () => {
			this.setValue( this.$input.checked );
			this._callOnFinishChange();
		} );

		this.$disable = this.$input;

		this.updateDisplay();

	}

	updateDisplay() {
		this.$input.checked = this.getValue();
		return this;
	}

}

function normalizeColorString( string ) {

	let match, result;

	if ( match = string.match( /(#|0x)?([a-f0-9]{6})/i ) ) {

		result = match[ 2 ];

	} else if ( match = string.match( /rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/ ) ) {

		result = parseInt( match[ 1 ] ).toString( 16 ).padStart( 2, 0 )
			+ parseInt( match[ 2 ] ).toString( 16 ).padStart( 2, 0 )
			+ parseInt( match[ 3 ] ).toString( 16 ).padStart( 2, 0 );

	} else if ( match = string.match( /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i ) ) {

		result = match[ 1 ] + match[ 1 ] + match[ 2 ] + match[ 2 ] + match[ 3 ] + match[ 3 ];

	}

	if ( result ) {
		return '#' + result;
	}

	return false;

}

const STRING = {
	isPrimitive: true,
	match: v => typeof v === 'string',
	fromHexString: normalizeColorString,
	toHexString: normalizeColorString
};

const INT = {
	isPrimitive: true,
	match: v => typeof v === 'number',
	fromHexString: string => parseInt( string.substring( 1 ), 16 ),
	toHexString: value => '#' + value.toString( 16 ).padStart( 6, 0 )
};

const ARRAY = {
	isPrimitive: false,

	// The arrow function is here to appease tree shakers like esbuild or webpack.
	// See https://esbuild.github.io/api/#tree-shaking
	match: v => Array.isArray( v ),

	fromHexString( string, target, rgbScale = 1 ) {

		const int = INT.fromHexString( string );

		target[ 0 ] = ( int >> 16 & 255 ) / 255 * rgbScale;
		target[ 1 ] = ( int >> 8 & 255 ) / 255 * rgbScale;
		target[ 2 ] = ( int & 255 ) / 255 * rgbScale;

	},
	toHexString( [ r, g, b ], rgbScale = 1 ) {

		rgbScale = 255 / rgbScale;

		const int = ( r * rgbScale ) << 16 ^
			( g * rgbScale ) << 8 ^
			( b * rgbScale ) << 0;

		return INT.toHexString( int );

	}
};

const OBJECT = {
	isPrimitive: false,
	match: v => Object( v ) === v,
	fromHexString( string, target, rgbScale = 1 ) {

		const int = INT.fromHexString( string );

		target.r = ( int >> 16 & 255 ) / 255 * rgbScale;
		target.g = ( int >> 8 & 255 ) / 255 * rgbScale;
		target.b = ( int & 255 ) / 255 * rgbScale;

	},
	toHexString( { r, g, b }, rgbScale = 1 ) {

		rgbScale = 255 / rgbScale;

		const int = ( r * rgbScale ) << 16 ^
			( g * rgbScale ) << 8 ^
			( b * rgbScale ) << 0;

		return INT.toHexString( int );

	}
};

const FORMATS = [ STRING, INT, ARRAY, OBJECT ];

function getColorFormat( value ) {
	return FORMATS.find( format => format.match( value ) );
}

class ColorController extends Controller {

	constructor( parent, object, property, rgbScale ) {

		super( parent, object, property, 'color' );

		this.$input = document.createElement( 'input' );
		this.$input.setAttribute( 'type', 'color' );
		this.$input.setAttribute( 'tabindex', -1 );
		this.$input.setAttribute( 'aria-labelledby', this.$name.id );

		this.$text = document.createElement( 'input' );
		this.$text.setAttribute( 'type', 'text' );
		this.$text.setAttribute( 'spellcheck', 'false' );
		this.$text.setAttribute( 'aria-labelledby', this.$name.id );

		this.$display = document.createElement( 'div' );
		this.$display.classList.add( 'display' );

		this.$display.appendChild( this.$input );
		this.$widget.appendChild( this.$display );
		this.$widget.appendChild( this.$text );

		this._format = getColorFormat( this.initialValue );
		this._rgbScale = rgbScale;

		this._initialValueHexString = this.save();
		this._textFocused = false;

		this.$input.addEventListener( 'input', () => {
			this._setValueFromHexString( this.$input.value );
		} );

		this.$input.addEventListener( 'blur', () => {
			this._callOnFinishChange();
		} );

		this.$text.addEventListener( 'input', () => {
			const tryParse = normalizeColorString( this.$text.value );
			if ( tryParse ) {
				this._setValueFromHexString( tryParse );
			}
		} );

		this.$text.addEventListener( 'focus', () => {
			this._textFocused = true;
			this.$text.select();
		} );

		this.$text.addEventListener( 'blur', () => {
			this._textFocused = false;
			this.updateDisplay();
			this._callOnFinishChange();
		} );

		this.$disable = this.$text;

		this.updateDisplay();

	}

	reset() {
		this._setValueFromHexString( this._initialValueHexString );
		return this;
	}

	_setValueFromHexString( value ) {

		if ( this._format.isPrimitive ) {

			const newValue = this._format.fromHexString( value );
			this.setValue( newValue );

		} else {

			this._format.fromHexString( value, this.getValue(), this._rgbScale );
			this._callOnChange();
			this.updateDisplay();

		}

	}

	save() {
		return this._format.toHexString( this.getValue(), this._rgbScale );
	}

	load( value ) {
		this._setValueFromHexString( value );
		this._callOnFinishChange();
		return this;
	}

	updateDisplay() {
		this.$input.value = this._format.toHexString( this.getValue(), this._rgbScale );
		if ( !this._textFocused ) {
			this.$text.value = this.$input.value.substring( 1 );
		}
		this.$display.style.backgroundColor = this.$input.value;
		return this;
	}

}

class FunctionController extends Controller {

	constructor( parent, object, property ) {

		super( parent, object, property, 'function' );

		// Buttons are the only case where widget contains name
		this.$button = document.createElement( 'button' );
		this.$button.appendChild( this.$name );
		this.$widget.appendChild( this.$button );

		this.$button.addEventListener( 'click', e => {
			e.preventDefault();
			this.getValue().call( this.object );
			this._callOnChange();
		} );

		// enables :active pseudo class on mobile
		this.$button.addEventListener( 'touchstart', () => {}, { passive: true } );

		this.$disable = this.$button;

	}

}

class NumberController extends Controller {

	constructor( parent, object, property, min, max, step ) {

		super( parent, object, property, 'number' );

		this._initInput();

		this.min( min );
		this.max( max );

		const stepExplicit = step !== undefined;
		this.step( stepExplicit ? step : this._getImplicitStep(), stepExplicit );

		this.updateDisplay();

	}

	decimals( decimals ) {
		this._decimals = decimals;
		this.updateDisplay();
		return this;
	}

	min( min ) {
		this._min = min;
		this._onUpdateMinMax();
		return this;
	}

	max( max ) {
		this._max = max;
		this._onUpdateMinMax();
		return this;
	}

	step( step, explicit = true ) {
		this._step = step;
		this._stepExplicit = explicit;
		return this;
	}

	updateDisplay() {

		const value = this.getValue();

		if ( this._hasSlider ) {

			let percent = ( value - this._min ) / ( this._max - this._min );
			percent = Math.max( 0, Math.min( percent, 1 ) );

			this.$fill.style.width = percent * 100 + '%';

		}

		if ( !this._inputFocused ) {
			this.$input.value = this._decimals === undefined ? value : value.toFixed( this._decimals );
		}

		return this;

	}

	_initInput() {

		this.$input = document.createElement( 'input' );
		this.$input.setAttribute( 'type', 'text' );
		this.$input.setAttribute( 'aria-labelledby', this.$name.id );

		// On touch devices only, use input[type=number] to force a numeric keyboard.
		// Ideally we could use one input type everywhere, but [type=number] has quirks
		// on desktop, and [inputmode=decimal] has quirks on iOS.
		// See https://github.com/georgealways/lil-gui/pull/16

		const isTouch = window.matchMedia( '(pointer: coarse)' ).matches;

		if ( isTouch ) {
			this.$input.setAttribute( 'type', 'number' );
			this.$input.setAttribute( 'step', 'any' );
		}

		this.$widget.appendChild( this.$input );

		this.$disable = this.$input;

		const onInput = () => {

			let value = parseFloat( this.$input.value );

			if ( isNaN( value ) ) return;

			if ( this._stepExplicit ) {
				value = this._snap( value );
			}

			this.setValue( this._clamp( value ) );

		};

		// Keys & mouse wheel
		// ---------------------------------------------------------------------

		const increment = delta => {

			const value = parseFloat( this.$input.value );

			if ( isNaN( value ) ) return;

			this._snapClampSetValue( value + delta );

			// Force the input to updateDisplay when it's focused
			this.$input.value = this.getValue();

		};

		const onKeyDown = e => {
			// Using `e.key` instead of `e.code` also catches NumpadEnter
			if ( e.key === 'Enter' ) {
				this.$input.blur();
			}
			if ( e.code === 'ArrowUp' ) {
				e.preventDefault();
				increment( this._step * this._arrowKeyMultiplier( e ) );
			}
			if ( e.code === 'ArrowDown' ) {
				e.preventDefault();
				increment( this._step * this._arrowKeyMultiplier( e ) * -1 );
			}
		};

		const onWheel = e => {
			if ( this._inputFocused ) {
				e.preventDefault();
				increment( this._step * this._normalizeMouseWheel( e ) );
			}
		};

		// Vertical drag
		// ---------------------------------------------------------------------

		let testingForVerticalDrag = false,
			initClientX,
			initClientY,
			prevClientY,
			initValue,
			dragDelta;

		// Once the mouse is dragged more than DRAG_THRESH px on any axis, we decide
		// on the user's intent: horizontal means highlight, vertical means drag.
		const DRAG_THRESH = 5;

		const onMouseDown = e => {

			initClientX = e.clientX;
			initClientY = prevClientY = e.clientY;
			testingForVerticalDrag = true;

			initValue = this.getValue();
			dragDelta = 0;

			window.addEventListener( 'mousemove', onMouseMove );
			window.addEventListener( 'mouseup', onMouseUp );

		};

		const onMouseMove = e => {

			if ( testingForVerticalDrag ) {

				const dx = e.clientX - initClientX;
				const dy = e.clientY - initClientY;

				if ( Math.abs( dy ) > DRAG_THRESH ) {

					e.preventDefault();
					this.$input.blur();
					testingForVerticalDrag = false;
					this._setDraggingStyle( true, 'vertical' );

				} else if ( Math.abs( dx ) > DRAG_THRESH ) {

					onMouseUp();

				}

			}

			// This isn't an else so that the first move counts towards dragDelta
			if ( !testingForVerticalDrag ) {

				const dy = e.clientY - prevClientY;

				dragDelta -= dy * this._step * this._arrowKeyMultiplier( e );

				// Clamp dragDelta so we don't have 'dead space' after dragging past bounds.
				// We're okay with the fact that bounds can be undefined here.
				if ( initValue + dragDelta > this._max ) {
					dragDelta = this._max - initValue;
				} else if ( initValue + dragDelta < this._min ) {
					dragDelta = this._min - initValue;
				}

				this._snapClampSetValue( initValue + dragDelta );

			}

			prevClientY = e.clientY;

		};

		const onMouseUp = () => {
			this._setDraggingStyle( false, 'vertical' );
			this._callOnFinishChange();
			window.removeEventListener( 'mousemove', onMouseMove );
			window.removeEventListener( 'mouseup', onMouseUp );
		};

		// Focus state & onFinishChange
		// ---------------------------------------------------------------------

		const onFocus = () => {
			this._inputFocused = true;
		};

		const onBlur = () => {
			this._inputFocused = false;
			this.updateDisplay();
			this._callOnFinishChange();
		};

		this.$input.addEventListener( 'input', onInput );
		this.$input.addEventListener( 'keydown', onKeyDown );
		this.$input.addEventListener( 'wheel', onWheel, { passive: false } );
		this.$input.addEventListener( 'mousedown', onMouseDown );
		this.$input.addEventListener( 'focus', onFocus );
		this.$input.addEventListener( 'blur', onBlur );

	}

	_initSlider() {

		this._hasSlider = true;

		// Build DOM
		// ---------------------------------------------------------------------

		this.$slider = document.createElement( 'div' );
		this.$slider.classList.add( 'slider' );

		this.$fill = document.createElement( 'div' );
		this.$fill.classList.add( 'fill' );

		this.$slider.appendChild( this.$fill );
		this.$widget.insertBefore( this.$slider, this.$input );

		this.domElement.classList.add( 'hasSlider' );

		// Map clientX to value
		// ---------------------------------------------------------------------

		const map = ( v, a, b, c, d ) => {
			return ( v - a ) / ( b - a ) * ( d - c ) + c;
		};

		const setValueFromX = clientX => {
			const rect = this.$slider.getBoundingClientRect();
			let value = map( clientX, rect.left, rect.right, this._min, this._max );
			this._snapClampSetValue( value );
		};

		// Mouse drag
		// ---------------------------------------------------------------------

		const mouseDown = e => {
			this._setDraggingStyle( true );
			setValueFromX( e.clientX );
			window.addEventListener( 'mousemove', mouseMove );
			window.addEventListener( 'mouseup', mouseUp );
		};

		const mouseMove = e => {
			setValueFromX( e.clientX );
		};

		const mouseUp = () => {
			this._callOnFinishChange();
			this._setDraggingStyle( false );
			window.removeEventListener( 'mousemove', mouseMove );
			window.removeEventListener( 'mouseup', mouseUp );
		};

		// Touch drag
		// ---------------------------------------------------------------------

		let testingForScroll = false, prevClientX, prevClientY;

		const beginTouchDrag = e => {
			e.preventDefault();
			this._setDraggingStyle( true );
			setValueFromX( e.touches[ 0 ].clientX );
			testingForScroll = false;
		};

		const onTouchStart = e => {

			if ( e.touches.length > 1 ) return;

			// If we're in a scrollable container, we should wait for the first
			// touchmove to see if the user is trying to slide or scroll.
			if ( this._hasScrollBar ) {

				prevClientX = e.touches[ 0 ].clientX;
				prevClientY = e.touches[ 0 ].clientY;
				testingForScroll = true;

			} else {

				// Otherwise, we can set the value straight away on touchstart.
				beginTouchDrag( e );

			}

			window.addEventListener( 'touchmove', onTouchMove, { passive: false } );
			window.addEventListener( 'touchend', onTouchEnd );

		};

		const onTouchMove = e => {

			if ( testingForScroll ) {

				const dx = e.touches[ 0 ].clientX - prevClientX;
				const dy = e.touches[ 0 ].clientY - prevClientY;

				if ( Math.abs( dx ) > Math.abs( dy ) ) {

					// We moved horizontally, set the value and stop checking.
					beginTouchDrag( e );

				} else {

					// This was, in fact, an attempt to scroll. Abort.
					window.removeEventListener( 'touchmove', onTouchMove );
					window.removeEventListener( 'touchend', onTouchEnd );

				}

			} else {

				e.preventDefault();
				setValueFromX( e.touches[ 0 ].clientX );

			}

		};

		const onTouchEnd = () => {
			this._callOnFinishChange();
			this._setDraggingStyle( false );
			window.removeEventListener( 'touchmove', onTouchMove );
			window.removeEventListener( 'touchend', onTouchEnd );
		};

		// Mouse wheel
		// ---------------------------------------------------------------------

		// We have to use a debounced function to call onFinishChange because
		// there's no way to tell when the user is "done" mouse-wheeling.
		const callOnFinishChange = this._callOnFinishChange.bind( this );
		const WHEEL_DEBOUNCE_TIME = 400;
		let wheelFinishChangeTimeout;

		const onWheel = e => {

			// ignore vertical wheels if there's a scrollbar
			const isVertical = Math.abs( e.deltaX ) < Math.abs( e.deltaY );
			if ( isVertical && this._hasScrollBar ) return;

			e.preventDefault();

			// set value
			const delta = this._normalizeMouseWheel( e ) * this._step;
			this._snapClampSetValue( this.getValue() + delta );

			// force the input to updateDisplay when it's focused
			this.$input.value = this.getValue();

			// debounce onFinishChange
			clearTimeout( wheelFinishChangeTimeout );
			wheelFinishChangeTimeout = setTimeout( callOnFinishChange, WHEEL_DEBOUNCE_TIME );

		};

		this.$slider.addEventListener( 'mousedown', mouseDown );
		this.$slider.addEventListener( 'touchstart', onTouchStart, { passive: false } );
		this.$slider.addEventListener( 'wheel', onWheel, { passive: false } );

	}

	_setDraggingStyle( active, axis = 'horizontal' ) {
		if ( this.$slider ) {
			this.$slider.classList.toggle( 'active', active );
		}
		document.body.classList.toggle( 'lil-gui-dragging', active );
		document.body.classList.toggle( `lil-gui-${axis}`, active );
	}

	_getImplicitStep() {

		if ( this._hasMin && this._hasMax ) {
			return ( this._max - this._min ) / 1000;
		}

		return 0.1;

	}

	_onUpdateMinMax() {

		if ( !this._hasSlider && this._hasMin && this._hasMax ) {

			// If this is the first time we're hearing about min and max
			// and we haven't explicitly stated what our step is, let's
			// update that too.
			if ( !this._stepExplicit ) {
				this.step( this._getImplicitStep(), false );
			}

			this._initSlider();
			this.updateDisplay();

		}

	}

	_normalizeMouseWheel( e ) {

		let { deltaX, deltaY } = e;

		// Safari and Chrome report weird non-integral values for a notched wheel,
		// but still expose actual lines scrolled via wheelDelta. Notched wheels
		// should behave the same way as arrow keys.
		if ( Math.floor( e.deltaY ) !== e.deltaY && e.wheelDelta ) {
			deltaX = 0;
			deltaY = -e.wheelDelta / 120;
			deltaY *= this._stepExplicit ? 1 : 10;
		}

		const wheel = deltaX + -deltaY;

		return wheel;

	}

	_arrowKeyMultiplier( e ) {

		let mult = this._stepExplicit ? 1 : 10;

		if ( e.shiftKey ) {
			mult *= 10;
		} else if ( e.altKey ) {
			mult /= 10;
		}

		return mult;

	}

	_snap( value ) {

		// This would be the logical way to do things, but floating point errors.
		// return Math.round( value / this._step ) * this._step;

		// Using inverse step solves a lot of them, but not all
		// const inverseStep = 1 / this._step;
		// return Math.round( value * inverseStep ) / inverseStep;

		// Not happy about this, but haven't seen it break.
		const r = Math.round( value / this._step ) * this._step;
		return parseFloat( r.toPrecision( 15 ) );

	}

	_clamp( value ) {
		// either condition is false if min or max is undefined
		if ( value < this._min ) value = this._min;
		if ( value > this._max ) value = this._max;
		return value;
	}

	_snapClampSetValue( value ) {
		this.setValue( this._clamp( this._snap( value ) ) );
	}

	get _hasScrollBar() {
		const root = this.parent.root.$children;
		return root.scrollHeight > root.clientHeight;
	}

	get _hasMin() {
		return this._min !== undefined;
	}

	get _hasMax() {
		return this._max !== undefined;
	}

}

class OptionController extends Controller {

	constructor( parent, object, property, options ) {

		super( parent, object, property, 'option' );

		this.$select = document.createElement( 'select' );
		this.$select.setAttribute( 'aria-labelledby', this.$name.id );

		this.$display = document.createElement( 'div' );
		this.$display.classList.add( 'display' );

		this.$select.addEventListener( 'change', () => {
			this.setValue( this._values[ this.$select.selectedIndex ] );
			this._callOnFinishChange();
		} );

		this.$select.addEventListener( 'focus', () => {
			this.$display.classList.add( 'focus' );
		} );

		this.$select.addEventListener( 'blur', () => {
			this.$display.classList.remove( 'focus' );
		} );

		this.$widget.appendChild( this.$select );
		this.$widget.appendChild( this.$display );

		this.$disable = this.$select;

		this.options( options );

	}

	options( options ) {

		this._values = Array.isArray( options ) ? options : Object.values( options );
		this._names = Array.isArray( options ) ? options : Object.keys( options );

		this.$select.replaceChildren();

		this._names.forEach( name => {
			const $option = document.createElement( 'option' );
			$option.textContent = name;
			this.$select.appendChild( $option );
		} );

		this.updateDisplay();

		return this;

	}

	updateDisplay() {
		const value = this.getValue();
		const index = this._values.indexOf( value );
		this.$select.selectedIndex = index;
		this.$display.textContent = index === -1 ? value : this._names[ index ];
		return this;
	}

}

class StringController extends Controller {

	constructor( parent, object, property ) {

		super( parent, object, property, 'string' );

		this.$input = document.createElement( 'input' );
		this.$input.setAttribute( 'type', 'text' );
		this.$input.setAttribute( 'spellcheck', 'false' );
		this.$input.setAttribute( 'aria-labelledby', this.$name.id );

		this.$input.addEventListener( 'input', () => {
			this.setValue( this.$input.value );
		} );

		this.$input.addEventListener( 'keydown', e => {
			if ( e.code === 'Enter' ) {
				this.$input.blur();
			}
		} );

		this.$input.addEventListener( 'blur', () => {
			this._callOnFinishChange();
		} );

		this.$widget.appendChild( this.$input );

		this.$disable = this.$input;

		this.updateDisplay();

	}

	updateDisplay() {
		this.$input.value = this.getValue();
		return this;
	}

}

const stylesheet = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;

function _injectStyles( cssContent ) {
	const injected = document.createElement( 'style' );
	injected.innerHTML = cssContent;
	const before = document.querySelector( 'head link[rel=stylesheet], head style' );
	if ( before ) {
		document.head.insertBefore( injected, before );
	} else {
		document.head.appendChild( injected );
	}
}

let stylesInjected = false;

class GUI {

	/**
	 * Creates a panel that holds controllers.
	 * @example
	 * new GUI();
	 * new GUI( { container: document.getElementById( 'custom' ) } );
	 *
	 * @param {object} [options]
	 * @param {boolean} [options.autoPlace=true]
	 * Adds the GUI to `document.body` and fixes it to the top right of the page.
	 *
	 * @param {HTMLElement} [options.container]
	 * Adds the GUI to this DOM element. Overrides `autoPlace`.
	 *
	 * @param {number} [options.width=245]
	 * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
	 * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
	 *
	 * @param {string} [options.title=Controls]
	 * Name to display in the title bar.
	 *
	 * @param {boolean} [options.closeFolders=false]
	 * Pass `true` to close all folders in this GUI by default.
	 *
	 * @param {boolean} [options.injectStyles=true]
	 * Injects the default stylesheet into the page if this is the first GUI.
	 * Pass `false` to use your own stylesheet.
	 *
	 * @param {number} [options.touchStyles=true]
	 * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
	 *
	 * @param {GUI} [options.parent]
	 * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
	 *
	 */
	constructor( {
		parent,
		autoPlace = parent === undefined,
		container,
		width,
		title = 'Controls',
		closeFolders = false,
		injectStyles = true,
		touchStyles = true
	} = {} ) {

		/**
		 * The GUI containing this folder, or `undefined` if this is the root GUI.
		 * @type {GUI}
		 */
		this.parent = parent;

		/**
		 * The top level GUI containing this folder, or `this` if this is the root GUI.
		 * @type {GUI}
		 */
		this.root = parent ? parent.root : this;

		/**
		 * The list of controllers and folders contained by this GUI.
		 * @type {Array<GUI|Controller>}
		 */
		this.children = [];

		/**
		 * The list of controllers contained by this GUI.
		 * @type {Array<Controller>}
		 */
		this.controllers = [];

		/**
		 * The list of folders contained by this GUI.
		 * @type {Array<GUI>}
		 */
		this.folders = [];

		/**
		 * Used to determine if the GUI is closed. Use `gui.open()` or `gui.close()` to change this.
		 * @type {boolean}
		 */
		this._closed = false;

		/**
		 * Used to determine if the GUI is hidden. Use `gui.show()` or `gui.hide()` to change this.
		 * @type {boolean}
		 */
		this._hidden = false;

		/**
		 * The outermost container element.
		 * @type {HTMLElement}
		 */
		this.domElement = document.createElement( 'div' );
		this.domElement.classList.add( 'lil-gui' );

		/**
		 * The DOM element that contains the title.
		 * @type {HTMLElement}
		 */
		this.$title = document.createElement( 'div' );
		this.$title.classList.add( 'title' );
		this.$title.setAttribute( 'role', 'button' );
		this.$title.setAttribute( 'aria-expanded', true );
		this.$title.setAttribute( 'tabindex', 0 );

		this.$title.addEventListener( 'click', () => this.openAnimated( this._closed ) );
		this.$title.addEventListener( 'keydown', e => {
			if ( e.code === 'Enter' || e.code === 'Space' ) {
				e.preventDefault();
				this.$title.click();
			}
		} );

		// enables :active pseudo class on mobile
		this.$title.addEventListener( 'touchstart', () => {}, { passive: true } );

		/**
		 * The DOM element that contains children.
		 * @type {HTMLElement}
		 */
		this.$children = document.createElement( 'div' );
		this.$children.classList.add( 'children' );

		this.domElement.appendChild( this.$title );
		this.domElement.appendChild( this.$children );

		this.title( title );

		if ( this.parent ) {

			this.parent.children.push( this );
			this.parent.folders.push( this );

			this.parent.$children.appendChild( this.domElement );

			// Stop the constructor early, everything onward only applies to root GUI's
			return;

		}

		this.domElement.classList.add( 'root' );

		if ( touchStyles ) {
			this.domElement.classList.add( 'allow-touch-styles' );
		}

		// Inject stylesheet if we haven't done that yet
		if ( !stylesInjected && injectStyles ) {
			_injectStyles( stylesheet );
			stylesInjected = true;
		}

		if ( container ) {

			container.appendChild( this.domElement );

		} else if ( autoPlace ) {

			this.domElement.classList.add( 'autoPlace' );
			document.body.appendChild( this.domElement );

		}

		if ( width ) {
			this.domElement.style.setProperty( '--width', width + 'px' );
		}

		this._closeFolders = closeFolders;

	}

	/**
	 * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
	 * @example
	 * gui.add( object, 'property' );
	 * gui.add( object, 'number', 0, 100, 1 );
	 * gui.add( object, 'options', [ 1, 2, 3 ] );
	 *
	 * @param {object} object The object the controller will modify.
	 * @param {string} property Name of the property to control.
	 * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
	 * selectable values for a dropdown.
	 * @param {number} [max] Maximum value for number controllers.
	 * @param {number} [step] Step value for number controllers.
	 * @returns {Controller}
	 */
	add( object, property, $1, max, step ) {

		if ( Object( $1 ) === $1 ) {

			return new OptionController( this, object, property, $1 );

		}

		const initialValue = object[ property ];

		switch ( typeof initialValue ) {

			case 'number':

				return new NumberController( this, object, property, $1, max, step );

			case 'boolean':

				return new BooleanController( this, object, property );

			case 'string':

				return new StringController( this, object, property );

			case 'function':

				return new FunctionController( this, object, property );

		}

		console.error( `gui.add failed
	property:`, property, `
	object:`, object, `
	value:`, initialValue );

	}

	/**
	 * Adds a color controller to the GUI.
	 * @example
	 * params = {
	 * 	cssColor: '#ff00ff',
	 * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
	 * 	customRange: [ 0, 127, 255 ],
	 * };
	 *
	 * gui.addColor( params, 'cssColor' );
	 * gui.addColor( params, 'rgbColor' );
	 * gui.addColor( params, 'customRange', 255 );
	 *
	 * @param {object} object The object the controller will modify.
	 * @param {string} property Name of the property to control.
	 * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
	 * need to set this to 255 if your colors are too bright.
	 * @returns {Controller}
	 */
	addColor( object, property, rgbScale = 1 ) {
		return new ColorController( this, object, property, rgbScale );
	}

	/**
	 * Adds a folder to the GUI, which is just another GUI. This method returns
	 * the nested GUI so you can add controllers to it.
	 * @example
	 * const folder = gui.addFolder( 'Position' );
	 * folder.add( position, 'x' );
	 * folder.add( position, 'y' );
	 * folder.add( position, 'z' );
	 *
	 * @param {string} title Name to display in the folder's title bar.
	 * @returns {GUI}
	 */
	addFolder( title ) {
		const folder = new GUI( { parent: this, title } );
		if ( this.root._closeFolders ) folder.close();
		return folder;
	}

	/**
	 * Recalls values that were saved with `gui.save()`.
	 * @param {object} obj
	 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
	 * @returns {this}
	 */
	load( obj, recursive = true ) {

		if ( obj.controllers ) {

			this.controllers.forEach( c => {

				if ( c instanceof FunctionController ) return;

				if ( c._name in obj.controllers ) {
					c.load( obj.controllers[ c._name ] );
				}

			} );

		}

		if ( recursive && obj.folders ) {

			this.folders.forEach( f => {

				if ( f._title in obj.folders ) {
					f.load( obj.folders[ f._title ] );
				}

			} );

		}

		return this;

	}

	/**
	 * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
	 * recall these values.
	 * @example
	 * {
	 * 	controllers: {
	 * 		prop1: 1,
	 * 		prop2: 'value',
	 * 		...
	 * 	},
	 * 	folders: {
	 * 		folderName1: { controllers, folders },
	 * 		folderName2: { controllers, folders }
	 * 		...
	 * 	}
	 * }
	 *
	 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
	 * @returns {object}
	 */
	save( recursive = true ) {

		const obj = {
			controllers: {},
			folders: {}
		};

		this.controllers.forEach( c => {

			if ( c instanceof FunctionController ) return;

			if ( c._name in obj.controllers ) {
				throw new Error( `Cannot save GUI with duplicate property "${c._name}"` );
			}

			obj.controllers[ c._name ] = c.save();

		} );

		if ( recursive ) {

			this.folders.forEach( f => {

				if ( f._title in obj.folders ) {
					throw new Error( `Cannot save GUI with duplicate folder "${f._title}"` );
				}

				obj.folders[ f._title ] = f.save();

			} );

		}

		return obj;

	}

	/**
	 * Opens a GUI or folder. GUI and folders are open by default.
	 * @param {boolean} open Pass false to close.
	 * @returns {this}
	 * @example
	 * gui.open(); // open
	 * gui.open( false ); // close
	 * gui.open( gui._closed ); // toggle
	 */
	open( open = true ) {

		this._setClosed( !open );

		this.$title.setAttribute( 'aria-expanded', !this._closed );
		this.domElement.classList.toggle( 'closed', this._closed );

		return this;

	}

	/**
	 * Closes the GUI.
	 * @returns {this}
	 */
	close() {
		return this.open( false );
	}

	_setClosed( closed ) {
		if ( this._closed === closed ) return;
		this._closed = closed;
		this._callOnOpenClose( this );
	}

	/**
	 * Shows the GUI after it's been hidden.
	 * @param {boolean} show
	 * @returns {this}
	 * @example
	 * gui.show();
	 * gui.show( false ); // hide
	 * gui.show( gui._hidden ); // toggle
	 */
	show( show = true ) {

		this._hidden = !show;

		this.domElement.style.display = this._hidden ? 'none' : '';

		return this;

	}

	/**
	 * Hides the GUI.
	 * @returns {this}
	 */
	hide() {
		return this.show( false );
	}

	openAnimated( open = true ) {

		// set state immediately
		this._setClosed( !open );

		this.$title.setAttribute( 'aria-expanded', !this._closed );

		// wait for next frame to measure $children
		requestAnimationFrame( () => {

			// explicitly set initial height for transition
			const initialHeight = this.$children.clientHeight;
			this.$children.style.height = initialHeight + 'px';

			this.domElement.classList.add( 'transition' );

			const onTransitionEnd = e => {
				if ( e.target !== this.$children ) return;
				this.$children.style.height = '';
				this.domElement.classList.remove( 'transition' );
				this.$children.removeEventListener( 'transitionend', onTransitionEnd );
			};

			this.$children.addEventListener( 'transitionend', onTransitionEnd );

			// todo: this is wrong if children's scrollHeight makes for a gui taller than maxHeight
			const targetHeight = !open ? 0 : this.$children.scrollHeight;

			this.domElement.classList.toggle( 'closed', !open );

			requestAnimationFrame( () => {
				this.$children.style.height = targetHeight + 'px';
			} );

		} );

		return this;

	}

	/**
	 * Change the title of this GUI.
	 * @param {string} title
	 * @returns {this}
	 */
	title( title ) {
		/**
		 * Current title of the GUI. Use `gui.title( 'Title' )` to modify this value.
		 * @type {string}
		 */
		this._title = title;
		this.$title.textContent = title;
		return this;
	}

	/**
	 * Resets all controllers to their initial values.
	 * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
	 * @returns {this}
	 */
	reset( recursive = true ) {
		const controllers = recursive ? this.controllersRecursive() : this.controllers;
		controllers.forEach( c => c.reset() );
		return this;
	}

	/**
	 * Pass a function to be called whenever a controller in this GUI changes.
	 * @param {function({object:object, property:string, value:any, controller:Controller})} callback
	 * @returns {this}
	 * @example
	 * gui.onChange( event => {
	 * 	event.object     // object that was modified
	 * 	event.property   // string, name of property
	 * 	event.value      // new value of controller
	 * 	event.controller // controller that was modified
	 * } );
	 */
	onChange( callback ) {
		/**
		 * Used to access the function bound to `onChange` events. Don't modify this value
		 * directly. Use the `gui.onChange( callback )` method instead.
		 * @type {Function}
		 */
		this._onChange = callback;
		return this;
	}

	_callOnChange( controller ) {

		if ( this.parent ) {
			this.parent._callOnChange( controller );
		}

		if ( this._onChange !== undefined ) {
			this._onChange.call( this, {
				object: controller.object,
				property: controller.property,
				value: controller.getValue(),
				controller
			} );
		}
	}

	/**
	 * Pass a function to be called whenever a controller in this GUI has finished changing.
	 * @param {function({object:object, property:string, value:any, controller:Controller})} callback
	 * @returns {this}
	 * @example
	 * gui.onFinishChange( event => {
	 * 	event.object     // object that was modified
	 * 	event.property   // string, name of property
	 * 	event.value      // new value of controller
	 * 	event.controller // controller that was modified
	 * } );
	 */
	onFinishChange( callback ) {
		/**
		 * Used to access the function bound to `onFinishChange` events. Don't modify this value
		 * directly. Use the `gui.onFinishChange( callback )` method instead.
		 * @type {Function}
		 */
		this._onFinishChange = callback;
		return this;
	}

	_callOnFinishChange( controller ) {

		if ( this.parent ) {
			this.parent._callOnFinishChange( controller );
		}

		if ( this._onFinishChange !== undefined ) {
			this._onFinishChange.call( this, {
				object: controller.object,
				property: controller.property,
				value: controller.getValue(),
				controller
			} );
		}
	}

	/**
	 * Pass a function to be called when this GUI or its descendants are opened or closed.
	 * @param {function(GUI)} callback
	 * @returns {this}
	 * @example
	 * gui.onOpenClose( changedGUI => {
	 * 	console.log( changedGUI._closed );
	 * } );
	 */
	onOpenClose( callback ) {
		this._onOpenClose = callback;
		return this;
	}

	_callOnOpenClose( changedGUI ) {
		if ( this.parent ) {
			this.parent._callOnOpenClose( changedGUI );
		}

		if ( this._onOpenClose !== undefined ) {
			this._onOpenClose.call( this, changedGUI );
		}
	}

	/**
	 * Destroys all DOM elements and event listeners associated with this GUI.
	 */
	destroy() {

		if ( this.parent ) {
			this.parent.children.splice( this.parent.children.indexOf( this ), 1 );
			this.parent.folders.splice( this.parent.folders.indexOf( this ), 1 );
		}

		if ( this.domElement.parentElement ) {
			this.domElement.parentElement.removeChild( this.domElement );
		}

		Array.from( this.children ).forEach( c => c.destroy() );

	}

	/**
	 * Returns an array of controllers contained by this GUI and its descendents.
	 * @returns {Controller[]}
	 */
	controllersRecursive() {
		let controllers = Array.from( this.controllers );
		this.folders.forEach( f => {
			controllers = controllers.concat( f.controllersRecursive() );
		} );
		return controllers;
	}

	/**
	 * Returns an array of folders contained by this GUI and its descendents.
	 * @returns {GUI[]}
	 */
	foldersRecursive() {
		let folders = Array.from( this.folders );
		this.folders.forEach( f => {
			folders = folders.concat( f.foldersRecursive() );
		} );
		return folders;
	}

}

var GUI$1 = GUI;

function ready(fn) {
    if (document.readyState !== "loading") {
        fn();
    }
    else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
let renderer;
ready(() => {
    renderer = new Renderer();
    renderer.ready = () => {
        initUI();
    };
    renderer.init("canvasGL", true);
});
function initUI() {
    var _a, _b;
    (_a = document.getElementById("message")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
    (_b = document.getElementById("canvasGL")) === null || _b === void 0 ? void 0 : _b.classList.remove("transparent");
    const gui = new GUI$1();
    const fullScreenUtils = new FullScreenUtils();
    const fullscreen = {
        toggleFullscreen: () => {
            if (fullScreenUtils.isFullScreen()) {
                fullScreenUtils.exitFullScreen();
            }
            else {
                fullScreenUtils.enterFullScreen();
            }
        }
    };
    gui.add(renderer, "currentCameraMode", {
        "FrontEnd": CameraMode.FrontEnd,
        "FPS": CameraMode.FPS
    }).name("Camera");
    // gui.add(
    //     renderer.settings,
    //     "timeOfDay",
    //     {
    //         "Day": arctic.TimeOfDay.Day,
    //         "Night": arctic.TimeOfDay.Night,
    //         "Sunrise": arctic.TimeOfDay.Sunrise,
    //         "Sunset": arctic.TimeOfDay.Sunset
    //     }
    // )
    //     .name("Time of Day")
    //     .onChange((value: any) => renderer.settings.timeOfDay = value);
    gui.add(renderer.settings, "cameraPeriod", 0.1, 2, 0.1);
    gui.add(renderer.settings, "vignette");
    gui.add(renderer.settings, "blurred");
    gui.add(renderer.settings, "lowQuality");
    gui.add(renderer.settings, "autoSwitchCameras");
    gui.add(renderer, "randomizeSky");
    gui.add(renderer, "nextCamera");
    gui.add(fullscreen, "toggleFullscreen");
    initDebugUI();
}
function initDebugUI() {
    const canvas = document.getElementById("canvasGL");
    if (!canvas) {
        return;
    }
    document.addEventListener("keypress", event => {
        if (event.key === "f") {
            renderer.currentCameraMode = renderer.currentCameraMode === CameraMode.FPS ? CameraMode.FrontEnd : CameraMode.FPS;
        }
        else if (event.key === "n") {
            renderer.nextCamera();
        }
    });
}
//# sourceMappingURL=index.js.map
