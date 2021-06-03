"use strict";
// texture usage
const TEXTURE_TYPE = {
    DIFFUSE: "DIFFUSE",
    SPECULAR: "SPECULAR",
    NORMAL: "NORMAL",
    HEIGHT: "HEIGHT",
    DISPLACEMENT: "DISPLACEMENT",
    AO: "AO",
    ROUGHNESS: "ROUGHNESS",
    ALBEDO: "ALBEDO",
    METALLIC: "METALLIC",
};

class Texture {
    constructor(ttype = null, flag = null, name = null, id = null) {
        this._type = ttype;
        this._flag = flag;
        this._name = name;
        this._id = id;
    }
    get ttype() {
        if (this._type === null) {
            throw "texture type is null";
        }
        return this._type;
    }
    get flag() {
        if (this._flag === null) {
            throw "texture flag is null";
        }
        return this._flag;
    }
    get name() {
        if (this._name === null) {
            throw "texture name is null";
        }
        return this._name;
    }
    get id() {
        if (this._id === null) {
            throw "texture id is null";
        }
        return this._id;
    }
}
