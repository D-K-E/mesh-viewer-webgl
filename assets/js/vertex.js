"use strict";
// vertex

class Vertex {
    /**

    Vertex for in a 3d plane

    @param {vec3} pos - position of vertex
    @param {vec3} normal - normal of vertex
    @param {vec2} texcoord - texture coordinate of vertex
    @param {vec3} tan - tangent coordinate of vertex
    @param {vec3} bitan - bitangent coordinate of vertex
     */
    constructor(pos = null, normal = null, texcoord = null, tan = null, bitan = null) {
        this._position = pos;
        this._normal = normal;
        this._texcoord = texcoord;
        this._tangent = tan;
        this._bitangent = bitan;
    }
    get pos() {
        if (this._position === null) {
            throw "position is null";
        }
        return this._position;
    }
    get normal() {
        if (this._normal === null) {
            throw "normal is null";
        }
        return this._normal;
    }
    get uv() {
        if (this._texcoord === null) {
            throw "texture coordinate is null";
        }
        return this._texcoord;
    }
    get tan() {
        if (this._tangent === null) {
            throw "tangent coordinate is null";
        }
        return this._tangent;
    }
    get bitan() {
        if (this._bitangent === null) {
            throw "bitangent coordinate is null";
        }
        return this._bitangent;
    }
    /**
    to quad array, first position, and to uv (texture coordinate)

    @return {Float32Array} an array with 5 values
    */
    to_quad() {
        return new Float32Array([
            this.pos[0],
            this.pos[1],
            this.pos[2],
            this.uv[0],
            this.uv[1]
        ]);
    }
    /**
     *  to quad array, first position, and to uv (texture coordinate)
     *
     *  @return {Float32Array} an array with 8 values
     */
    to_array() {
        let quad = this.to_quad();
        let quads = [];
        for (const key in quad) {
            quads.push(quad[key]);
        }
        quads.push(this.normal[0]);
        quads.push(this.normal[1]);
        quads.push(this.normal[2]);
        return new Float32Array(quads);
    }
    /**
     *  to quad array, first position, and to uv (texture coordinate)
     *
     *  @return {Float32Array} an array with 14 values
     */
    to_primitive() {
        let arr = this.to_array();
        let lst = [];
        for (const key in arr) {
            lst.push(arr[key]);
        }

        lst.push(this.tan[0]);
        lst.push(this.tan[1]);
        lst.push(this.tan[2]);
        lst.push(this.bitan[0]);
        lst.push(this.bitan[1]);
        lst.push(this.bitan[2]);
        return new Float32Array(lst);
    }
    size() {
        let count = 0;
        let p = this._position;
        let n = this._normal;
        let t = this._texcoord;
        let tt = this._tangent;
        let bt = this._bitangent;
        if (p !== null) {
            count += 3;
        }
        if (n !== null) {
            count += 3;
        }
        if (t !== null) {
            count += 2;
        }
        if (tt !== null) {
            count += 3;
        }
        if (bt !== null) {
            count += 3;
        }
        return count;
    }
    to_list() {
        let s = this.size();
        if (s === 5) {
            return this.to_quad();
        } else if (s === 8) {
            return this.to_array();
        } else if (s === 14) {
            return this.to_primitive();
        } else {
            throw "unsupported size";
        }
    }
    set_normal_from_triangle_edges(edges) {
        let edge1 = edges[0];
        let edge2 = edges[1];
        let n = glMatrix.vec3.create();
        glMatrix.vec3.cross(n, edge1, edge2);
        let n1 = glMatrix.vec3.create();
        glMatrix.vec3.normalize(n1, n);
        this._normal = n1;
    }
    set_tangent_values_from_triangle(tri) {
        let v1 = tri.v1;
        let v2 = tri.v2;
        let v3 = tri.v3;
        let edges = tri.get_edges();
        let edge1 = edges[0];
        let edge2 = edges[1];

        let deltaUV1 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(deltaUV1, v2.uv, v1.uv);

        let deltaUV2 = glMatrix.vec3.create();
        glMatrix.vec3.subtract(deltaUV2, v3.uv, v1.uv);

        let f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

        let tangent1 = glMatrix.vec3.create();
        let tangent2 = glMatrix.vec3.create();

        tangent1[0] = f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]);
        tangent1[1] = f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]);
        tangent1[2] = f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2]);

        bitangent1[0] = f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]);
        bitangent1[1] = f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]);
        bitangent1[2] = f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2]);
        this._tangent = tangent1;
        this._bitangent = bitangent1;
    }
    static from_quad(arr) {
        let v = new Vertex();
        v._position = glMatrix.vec3.create();
        v._texcoord = glMatrix.vec2.create();
        v.pos[0] = arr[0];
        v.pos[1] = arr[1];
        v.pos[2] = arr[2];
        v.uv[0] = arr[3];
        v.uv[1] = arr[4];
        return v;
    }
    static from_array(arr) {
        let v = Vertex.from_quad(arr);
        v._normal = glMatrix.vec3.create();
        v.normal[0] = arr[5];
        v.normal[1] = arr[6];
        v.normal[2] = arr[7];
        return v;
    }
    static from_primitive(arr) {
        let v = Vertex.from_array(arr);
        v._tangent = glMatrix.vec3.create();
        v._bitangent = glMatrix.vec3.create();
        v.tan[0] = arr[8];
        v.tan[1] = arr[9];
        v.tan[2] = arr[10];
        v.bitan[0] = arr[11];
        v.bitan[1] = arr[12];
        v.bitan[2] = arr[13];
        return v;
    }
    static is_arr_fit(arr, expected_nb_components) {
        if (!isIterable(arr)) {
            console.log(arr);
            console.log(typeof(arr));
            throw "argument is not an iterable";
        }
        let cond = arr.length % expected_nb_components === 0;
        if (!cond) {
            let m = expected_nb_components.toString();
            throw "length of array must be a multiple of " + m;
        }

    }
    static from_values(arr, expected_nb_components, vertex_fn) {
        let vs = [];
        Vertex.is_arr_fit(arr, expected_nb_components);

        for (var i = 0; i < arr.length; i += expected_nb_components) {
            let values = [];
            for (var j = 0; j < expected_nb_components; j++) {
                let val = arr[i + j];
                values.push(val);
            }
            let vtx = vertex_fn(values);
            vs.push(vtx);
        }
        return vs;
    }
    static from_quads(arr) {
        return Vertex.from_values(
            arr, 5, Vertex.from_quad
        );
    }
    static from_arrays(arr) {
        return Vertex.from_values(
            arr, 8, Vertex.from_array
        );
    }
    static from_primitives(arr) {
        return Vertex.from_values(
            arr, 14, Vertex.from_primitive
        );
    }
}
