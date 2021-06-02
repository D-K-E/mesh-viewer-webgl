"use strict";


class VertexArrayObject {
    constructor() {
        this._props = null;
        this._vao = null;
    }
    init(gl) {
        this._vao = gl.createVertexArray();
    }
    get vao() {
        if (this._vao === null) {
            throw "vertex array object is null";
        }
        return this._vao;
    }
    get props() {
        if (this._props === null) {
            throw "vertex array props is null";
        }
        return this._props;

    }
    set_props(coord) {
        if (this._props === null) {
            this._props = {};
        }
        this.props[coord["name"]] = coord;
    }
    set_prop_size(name, size) {
        this.props[name]["size"] = size;
    }
    set_prop_type(name, type) {
        this.props[name]["type"] = type;
    }
    set_prop_location(name, loc) {
        this.props[name]["location"] = loc;
    }

    enable(gl, vbo) {
        //
        gl.bindVertexArray(this.vao);

        //
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        //
        var offset = 0;
        for (const key in this.props) {
            let prop = this.props[key];
            gl.vertexAttribPointer(
                prop["location"], // index
                prop["size"], // size
                prop["type"], // GLenum type
                false, // normalized
                prop["stride"], // GLsizei stride
                prop["offset"] // GLintptr offset
            );
            gl.enableVertexAttribArray(prop["location"]);
        }
    }
}
