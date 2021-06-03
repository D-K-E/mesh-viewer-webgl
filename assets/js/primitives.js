"use strict";

class Triangle {
    constructor(v1 = null, v2 = null, v3 = null, index = null, normal = null) {
        this._v1 = v1;
        this._v2 = v2;
        this._v3 = v3;
        this._index = index;
        this._normal = normal;
    }
    get v1() {
        if (this._v1 === null) {
            throw "first vertex is null";
        }
        return this._v1;
    }
    get v2() {
        if (this._v2 === null) {
            throw "second vertex is null";
        }
        return this._v2;
    }
    get v3() {
        if (this._v3 === null) {
            throw "third vertex is null";
        }
        return this._v3;
    }
    get index() {
        if (this._index === null) {
            throw "index is null";
        }
        return this._index;
    }
    get face() {
        return this.index;
    }
    set normal(s) {
        if (!Array.isArray(s)) {
            throw "must be an array with 3 elements or vec3";
        }
        this._normal = s;
    }
    get normal() {
        if (this._normal === null) {
            let edges = get_edges();
            if (this.v1._normal === null) {
                this.v1.set_normal_from_triangle_edges(edges);
            }
            this.normal = this.v1.normal;
            this.v2._normal = this.v1.normal;
            this.v3._normal = this.v1.normal;
        }
        return this._normal;
    }
    get_edges() {
        let e2 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(e2, this.v2.pos, this.v1.pos);

        let e1 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(e1, this.v3.pos, this.v1.pos);

        let e3 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(e3, this.v3.pos, this.v2.pos);

        return [e1, e2, e3];
    }
}
