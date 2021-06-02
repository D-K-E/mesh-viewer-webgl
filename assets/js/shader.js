"use strict";

// simple shader class

class Shader {
    constructor(vs_id, fs_id) {
        this._gl_shader = null;
        this._vertex_shader_text = document.getElementById(vs_id).text.trim();
        this._fragment_shader_text =
            document.getElementById(fs_id).text.trim();
        this._gl_uniform_props = null;
        this._vao = new VertexArrayObject();
        this._vbo = new VertexBufferObject();
    }
    /*
    coord === {
        name: "string",
        offset: int,
        stride: int
        size: int
        type: gl.FLOAT
    };
     */

    /*
    props == {
    name: "string",
    location: int,
    type: "vec3",
    data: []
    }
     */
    get uniform_props() {
        if (this._gl_uniform_props === null) {
            throw "uniform props are null";
        }
        return this._gl_uniform_props;
    }
    set_uniform(props) {
        if (this._gl_uniform_props === null) {
            this._gl_uniform_props = {};
        }
        this.uniform_props[props["name"]] = props;
    }
    set_uniform_data(name, data) {
        this.uniform_props[name]["data"] = data;
    }
    get_udata(name) {
        let udata = this._gl_uniform_props[name].data;
        if (udata === null) {
            throw "uniform data for " + name + " is null";
        }
        return udata;
    }
    get_utype(name) {
        let utype = this._gl_uniform_props[name].type;
        if (utype === null) {
            throw "uniform type for " + name + " is null";
        }
        return utype;
    }
    get_uloc(name) {
        let uloc = this._gl_uniform_props[name].location;
        if (uloc === null) {
            throw "uniform location for " + name + " is null";
        }
        return uloc;
    }
    load_uniform_vector(gl, name) {
        let udata = this.get_udata(name);
        let utype = this.get_utype(name);
        let uloc = this.get_uloc(name);
        if (utype === "vec2") {
            gl.uniform2fv(uloc, udata);
        } else if (utype === "vec3") {
            gl.uniform3fv(uloc, udata);

        } else if (utype === "vec4") {
            gl.uniform4fv(uloc, udata);
        } else {
            throw "unknown uniform type: " + utype;
        }

    }
    load_uniform_matrix(gl, name) {
        let udata = this.get_udata(name);
        let utype = this.get_utype(name);
        let uloc = this.get_uloc(name);
        if (utype === "mat2") {
            gl.uniformMatrix2fv(uloc, false, udata);
        } else if (utype === "mat3") {
            gl.uniformMatrix3fv(uloc, false, udata);

        } else if (utype === "mat4") {
            gl.uniformMatrix4fv(uloc, false, udata);
        } else {
            throw "unknown uniform type: " + utype;
        }
    }
    load_uniforms(gl) {
        for (const key in this.uniform_props) {
            let uprop = this.uniform_props[key];
            if (uprop.type.includes("mat")) {
                this.load_uniform_matrix(gl, key);
            } else if (uprop.type.includes("vec")) {
                this.load_uniform_vector(gl, key);
            }
        }
    }

    set_phong_vs_props(gl) {
        let aPos = {
            "name": "aPos",
            "size": 3,
            "type": gl.FLOAT,
            "location": 0,
            "stride": 0,
            "offset": 0
        };
        this.vao.set_props(aPos);
        let aNormal = {
            "name": "aNormal",
            "size": 3,
            "type": gl.FLOAT,
            "location": 1,
            "stride": 3,
            "offset": 0
        };
        this.vao.set_props(aNormal);
        let aTexCoord = {
            "name": "aNormal",
            "size": 2,
            "type": gl.FLOAT,
            "location": 2,
            "stride": 5,
            "offset": 0
        };
        this.vao.set_props(aTexCoord);

    }
    set_phong_fs_props(gl) {
        this.set_vec3_uniforms(gl, "viewPos");
        this.set_vec3_uniforms(gl, "lightPos");
        this.set_vec3_uniforms(gl, "attc");
        this.set_vec3_uniforms(gl, "ambientShininessLight");
    }
    set_type_uniforms(gl, name, type) {
        let obj = {
            "name": name,
            "type": type,
            "data": null,
            "location": null
        };
        gl.useProgram(this.mShader);
        obj["location"] = gl.getUniformLocation(this.mShader, obj["name"]);
        this.set_uniform(obj);
    }
    set_vec3_uniforms(gl, name) {
        this.set_type_uniforms(gl, name, "vec3");
    }
    set_mat4_uniforms(gl, name) {
        this.set_type_uniforms(gl, name, "mat4");
    }

    set_constant_fs_props(gl) {
        this.set_vec3_uniforms(gl, "vcolor");
        this.set_mat4_uniforms(gl, "model");
    }
    set_constant_vs_coord(gl) {
        let coord = {
            "name": "vcoord",
            "size": 3,
            "type": gl.FLOAT,
            "location": null,
            "stride": 0,
            "offset": 0
        };
        coord["location"] = gl.getAttribLocation(this.mShader, coord["name"]);
        this.vao.set_props(coord);
    }
    get vao() {
        if (this._vao === null) {
            throw "vertex array object is null";
        }
        return this._vao;
    }
    get vbo() {
        if (this._vbo === null) {
            throw "vertex buffer object is null";
        }
        return this._vbo;
    }
    init(gl, data) {
        let vs_shader = this.load_shader(gl, gl.VERTEX_SHADER,
            this._vertex_shader_text);
        let fs_shader = this.load_shader(gl, gl.FRAGMENT_SHADER,
            this._fragment_shader_text);
        this._gl_shader = gl.createProgram();
        gl.attachShader(this.mShader, vs_shader);
        gl.attachShader(this.mShader, fs_shader);
        gl.linkProgram(this.mShader);

        if (!gl.getProgramParameter(this.mShader, gl.LINK_STATUS)) {
            throw "shader program is not linked";
        }
        // vertex buffer object and vertex array object
        // setting up a constant color shader
        this.vao.init(gl);
        this.vbo.init(gl, data);
        this.set_constant_fs_props(gl);
        this.set_constant_vs_coord(gl);
    }

    get mShader() {
        if (this._gl_shader === null) {
            throw "gl shader is null";
        }
        return this._gl_shader;
    }
    load_shader(gl, shader_type, shader_txt) {
        let compiled_shader = gl.createShader(shader_type);
        gl.shaderSource(compiled_shader, shader_txt);
        gl.compileShader(compiled_shader);

        if (!gl.getShaderParameter(compiled_shader, gl.COMPILE_STATUS)) {
            throw "shader can not be compiled";
        }
        return compiled_shader;
    }
    activate(gl) {
        gl.useProgram(this.mShader);
        this.vao.enable(gl, this.vbo.vbo);
    }
}
