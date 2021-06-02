"use strict";

// vertex buffer object

class VertexBufferObject {
    constructor(arr) {
        this._buffer_ptr = null;
        this._data = arr;
        this.set_triangle_data();
    }
    set_triangle_data() {
        this._data = new Float32Array([
            -0.5, -0.5, 0.0,
            0.5, -0.5, 0.0,
            0.0, 0.5, 0.0,
        ]);
    }
    set_cube_data() {
        this._data = cube_vertex_normal_texture["data"];
    }
    get vbo() {
        if (this._buffer_ptr === null) {
            throw "vertex buffer object has not been initialized";
        }
        return this._buffer_ptr;
    }
    get data() {
        if (this._data === null) {
            throw "there is no data associated to this buffer";
        }
        return this._data;
    }
    set data(arr) {
        this._data = arr;
    }
    init(gl, arr) {
        this._buffer_ptr = gl.createBuffer();
        this.data = arr;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data),
            gl.STATIC_DRAW);
    }
}
