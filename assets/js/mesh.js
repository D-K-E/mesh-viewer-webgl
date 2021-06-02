"use strict";
// mesh object


class Mesh {
    constructor(gl, vertices = null, textures = null, indices = null) {
        this._vertices = vertices;
        this._textures = textures;
        this._indices = indices;
        this.setup_mesh(gl);
        this._vao = null;
        this._vbo = null;
        this._ebo = null;
    }
    get vertices() {
        if (this._vertices === null) {
            throw "vertces are null";
        }
        return this._vertices;
    }
    get textures() {
        if (this._textures === null) {
            throw "textures are null";
        }
        return this._textures;
    }
    get indices() {
        if (this._indices === null) {
            throw "indices are null";
        }
        return this._indices;
    }
    get vbo() {
        if (this._vbo === null) {
            throw "vertex buffer object null";
        }
        return this._vbo;
    }
    get vao() {
        if (this._vao === null) {
            throw "vertex array object null";
        }
        return this._vao;
    }
    get ebo() {
        if (this._ebo === null) {
            throw "element buffer object null";
        }
        return this._ebo;
    }
    setup_mesh(gl) {
        // create object
        this._vao = gl.createVertexArray();
        this._vbo = gl.createBuffer();
        this._ebo = gl.createBuffer();

        // bind vertex array object
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    }
}
