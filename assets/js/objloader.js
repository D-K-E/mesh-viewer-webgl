"use strict";
// my obj parser inspired from
// https://github.com/Bly7/OBJ-Loader/blob/master/Source/OBJ_Loader.h

// some utility functions

// Projection Calculation of a onto b
function ProjV3(a, b) {
    let bn = b / glMatrix.vec3.length(b);
    return bn * glMatrix.vec3.dot(a, bn);
}

function GenTriNormal(t1, t2, t3) {

    let u = t2 - t1;
    let v = t3 - t1;
    let norm = glMatrix.vec3.cross(u, v);
    return norm;
}

function SameSide(p1, p2, a, b) {
    let cp1 = glMatrix.vec3.cross(b - a, p1 - a);
    let cp2 = glMatrix.vec3.cross(b - a, p2 - a);

    if (glMatrix.vec3.dot(cp1, cp2) >= 0) {
        return true;
    } else {
        return false;
    }
}

function inTriangle(point, tri1, tri2, tri3) {
    let within_tri_prisim = SameSide(point, tri1, tri2, tri3) && SameSide(point, tri2, tri1, tri3) &&
        SameSide(point, tri3, tri1, tri2);

    // If it isn't it will never be on the triangle
    if (!within_tri_prisim) {
        return false;
    }

    // Calulate Triangle's Normal
    let n = GenTriNormal(tri1, tri2, tri3);

    // Project the point onto this normal
    let proj = ProjV3(point, n);

    // If the distance from the triangle to the point is 0
    //	it lies on the triangle
    if (glMatrix.vec3.length(proj) === 0) {
        return true;
    } else {
        return false;
    }
}

//


class ObjMaterial {
    // Material Name
    _name = null;
    // Ambient Color
    _Ka = null;
    // Diffuse Color
    _Kd = null;
    // Specular Color
    _Ks = null;
    // Specular Exponent
    _Ns = null;
    // Optical Density
    _Ni = null;
    // Dissolve
    _d = null;
    // Illumination
    _illum = null;
    // Ambient Texture Map
    _map_Ka = null;
    // Diffuse Texture Map
    _map_Kd = null;
    // Specular Texture Map
    _map_Ks = null;
    // Specular Hightlight Map
    _map_Ns = null;
    // Alpha Texture Map
    _map_d = null;
    // Bump Map
    _map_bump = null;

    constructor() {
        this.Ns = 0.0;
        this.Ni = 0.0;
        this.d = 0.0;
        this.illum = 0;
    }
    get name() {
        if (this._name === null || typeof this._name !== "string") {
            throw "name is null or it is not a string";
        }
        return this._name;
    }
    set name(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._name = s;
    }
    get Ka() {
        if (this._Ka === null) {
            throw "Ka is null";
        }
        return this._Ka;
    }
    get Kd() {
        if (this._Kd === null) {
            throw "Kd is null";
        }
        return this._Kd;
    }
    get Ks() {
        if (this._Ks === null) {
            throw "Ks is null";
        }
        return this._Ks;
    }
    get Ns() {
        if (this._Ns === null || typeof this._Ns !== "number") {
            throw "Ns is null or it is not a number";
        }
        return this._Ns;
    }
    set Ns(s) {
        if (typeof s !== "number") {
            throw "argument is not a number";
        }
        this._Ns = s;
    }

    get Ni() {
        if (this._Ni === null || typeof this._Ni !== "number") {
            throw "Ni is null or it is not a number";
        }
        return this._Ni;
    }
    set Ni(s) {
        if (typeof s !== "number") {
            throw "argument is not a number";
        }
        this._Ni = s;
    }
    get d() {
        if (this._d === null || typeof this._d !== "number") {
            throw "d is null or it is not a number";
        }
        return this._d;
    }
    set d(s) {
        if (typeof s !== "number") {
            throw "argument is not a number";
        }
        this._d = s;
    }
    get illum() {
        if (this._illum === null || typeof this._illum !== "number") {
            throw "illum is null or it is not a number";
        }
        return this._illum;
    }
    set illum(s) {
        if (typeof s !== "number") {
            throw "argument is not a number";
        }
        this._illum = s;
    }
    get map_Ka() {
        if (this._map_Ka === null || typeof this._map_Ka !== "string") {
            throw "map_Ka is null or it is not string";
        }
        return this._map_Ka;
    }
    set map_Ka(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_Ka = s;
    }
    get map_Kd() {
        if (this._map_Kd === null || typeof this._map_Kd !== "string") {
            throw "map_Kd is null or it is not string";
        }
        return this._map_Kd;
    }
    set map_Kd(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_Kd = s;
    }
    get map_Ks() {
        if (this._map_Ks === null || typeof this._map_Ks !== "string") {
            throw "map_Ks is null or it is not string";
        }
        return this._map_Ks;
    }
    set map_Ks(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_Ks = s;
    }
    get map_Ns() {
        if (this._map_Ns === null || typeof this._map_Na !== "string") {
            throw "map_Ns is null or it is not string";
        }
        return this._map_Ns;
    }
    set map_Ns(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_Ns = s;
    }
    get map_d() {
        if (this._map_d === null || typeof this._map_d !== "string") {
            throw "map_d is null or it is not string";
        }
        return this._map_d;
    }
    set map_d(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_d = s;
    }
    get map_bump() {
        if (this._map_bump === null || typeof this._map_bump !== "string") {
            throw "map_bump is null or it is not string";
        }
        return this._map_bump;
    }
    set map_bump(s) {
        if (typeof s !== "string") {
            throw "argument is not a string";
        }
        this._map_bump = s;
    }
}

class ObjMesh {
    constructor(vertices = null, indices = null) {
        this._vertices = vertices;
        this._indices = vertices;
        this._mesh_name = null;
        this._material = null; // ObjMaterial 
    }
    set mesh_name(s) {
        this._mesh_name = s;
    }
    get mesh_name() {
        if (this._mesh_name === null) {
            throw "mesh name null";
        }
        return this._mesh_name;
    }
}

class ObjLoader {
    constructor(obj_text) {
        this.text = obj_text
    }
    load_text() {
        let LoadedMeshes = [];
        let LoadedVertices = [];
        let LoadedIndices = [];
        let Positions = [];
        let TCoords = [];
        let Normals = [];

        let Vertices = [];
        let Indices = [];

        let MeshMatNames = [];

        let listening = false;
        let meshname = null;
        let tempmesh = null;

        // split text into lines
        var lines = this.text.split(/\r\n|\n\r|\n|\r/);
        for (const index in lines) {
            let line = lines[index];
            let ftoken = firstToken(line);

            // Generate a Mesh Object or Prepare for an object to be created
            if (ftoken === "o" || ftoken === "g" || line[0] === "g") {
                if (!listening) {
                    listening = true;
                    if (ftoken === "o" || ftoken === "g") {
                        meshname = tail_str(line);
                    } else {
                        meshname = "unnamed";
                    }
                } else {
                    if (Vertices.length !== 0 && Indices.length !== 0) {

                        // create mesh
                        tempmesh = new ObjMesh(Vertices, Indices);
                        tempmesh.mesh_name = meshname;

                        // insert mesh
                        LoadedMeshes.push(tempmesh);

                        // Cleanup
                        Vertices = [];
                        Indices = [];
                        meshname = null;

                        meshname = tail_str(line);
                    } else {
                        //
                        if (firstToken(line) === "o" || firstToken(line) === "g") {
                            meshname = tail_str(curline);
                        } else {
                            meshname = "unnamed";
                        }
                    }

                }
            }
            // Generate a Vertex Position
            if (firstToken(line) === "v") {
                let spos = [];
                let vpos = glMatrix.vec3.create();
                let line_tail = tail_str(line);
                spos = line_tail.split(" ");
                glMatrix.vec3.set(vpos, parseFloat(spos[0]),
                    parseFloat(spos[1]),
                    parseFloat(spos[2]));

                Positions.push(vpos);
            }
            // Generate a Vertex Texture Coordinate
            if (firstToken(line) == "vt") {
                let vtex = glMatrix.vec2.create();

                let line_tail = tail_str(line);
                let stex = line_tail.split(" ");

                glMatrix.vec2.set(vtex, parseFloat(stex[0]),
                    parseFloat(stex[1]));

                TCoords.push(vtex);
            }
            // Generate a Vertex Normal;
            if (firstToken(line) == "vn") {
                let vnor = glMatrix.vec3.create();

                let line_tail = tail_str(line);
                let snor = line_tail.split(" ");

                glMatrix.vec3.set(vnor, parseFloat(snor[0]),
                    parseFloat(snor[1]),
                    parseFloat(snor[2]));
                Normals.push(vnor);
            }
            //https://github.com/Bly7/OBJ-Loader/blob/03b06bf50bca2953a0ccd2d2ba373b27f46eecf2/Source/OBJ_Loader.h#L576
            // Generate a Face (vertices & indices)
        }
    }
}
