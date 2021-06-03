"use strict";

// simple shader class

// check the shader compilation
function checkShaderCompilation(gl, shader) {
    let gbool = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!gbool) {
        let mess = gl.getShaderInfoLog(shader);
        throw mess;
    }
    return gbool;
}

function checkShaderProgramCompilation(gl, program) {
    // check the program compilation
    let pstat = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!pstat) {
        let mess = gl.getProgramInfoLog(program);
        throw mess;
    }
    return pstat;
}

function getUniformLocation(gl, program, name) {
    let locVal = gl.getUniformLocation(program, name);
    if (locVal === null) {
        throw "no location is given for the uniform in the program";
    }
    check_error(gl);
    return locVal;
}

class Shader {
    constructor(vs_id, fs_id) {
        // shader source [{"text": "", "type": ""}]
        this._shader_sources = null;
        this._shader_id = null;
        this.init_shader_sources_vs_fs(vs_id, fs_id);
    }
    init_shader_sources(arr) {
        for (const key in arr) {
            let source_id_type = arr[key];
            let text =
                document.getElementById(source_id_type["id"]).text.trim();
            let stype = source_id_type["type"];
            this.set_shader_source(text, stype);
        }
    }
    init_shader_sources_vs_fs(vs_id, fs_id) {
        let arr = [{
            "type": "FRAGMENT_SHADER",
            "id": fs_id
        }, {
            "type": "VERTEX_SHADER",
            "id": vs_id
        }];
        this.init_shader_sources(arr);
    }
    get shader_sources() {
        if (this._shader_sources === null) {
            throw "shader sources are null";
        }
        return this._shader_sources;
    }
    get_shader_source_by_type(stype) {
        for (const key in this.shader_sources) {
            let source = this.shader_sources[key];
            if (source["type"] === stype) {
                return source["text"];
            }
        }
        return null;
    }
    set_shader_source(stext, stype) {
        if (this._shader_sources === null) {
            this._shader_sources = [];
        }
        let st = this.get_shader_source_by_type(stype);
        if (st === null) {
            this.shader_sources.push({
                "text": stext,
                "type": stype
            });
        } else {
            throw "same type shader already exists among shader source";
        }
    }
    get vs_text() {
        return this.get_shader_source_by_type("VERTEX_SHADER");
    }
    get fs_text() {
        return this.get_shader_source_by_type("FRAGMENT_SHADER");
    }
    get program_id() {
        if (this._shader_id === null) {
            throw "shader id is null";
        }
        return this._shader_id;
    }
    load_shader(gl, shader_type, shader_txt) {
        check_error(gl);
        let compiled_shader = gl.createShader(shader_type);
        gl.shaderSource(compiled_shader, shader_txt);
        gl.compileShader(compiled_shader);
        checkShaderCompilation(gl, compiled_shader);
        check_error(gl);
        return compiled_shader;
    }
    activate(gl) {
        gl.useProgram(this.program_id);
    }

    link_program(gl) {
        this._shader_id = gl.createProgram();
        let shaders = [];
        for (const key in this.shader_sources) {
            let source = this.shader_sources[key];
            let text = source["text"];
            var stype = null;
            if (source["type"] === "FRAGMENT_SHADER") {
                stype = gl.FRAGMENT_SHADER;
            } else if (source["type"] === "VERTEX_SHADER") {
                stype = gl.VERTEX_SHADER;
            } else {
                throw "unsupported shader type " + source["type"];
            }
            let shader = this.load_shader(gl, stype, text);
            shaders.push(shader);
        }
        for (const key in shaders) {
            gl.attachShader(this.program_id, shaders[key]);
        }
        gl.linkProgram(this.program_id);
        checkShaderProgramCompilation(gl, this.program_id);
    }
    check_type(val, expected_type) {
        check_type(val, expected_type);
    }
    check_components(val, expected_nb_components) {
        let nc = expected_nb_components;
        if (typeof(val) === "object") {
            if (val.length === nc) {
                return true;
            } else {
                let mess = "expected number of components is " + nc.toString();
                mess += " but you had provided an object of length: ";
                mess += val.length.toString();
                throw mess;
            }
        } else {
            let m = "object " + val.toString() + " is not an array";
            m += " type: " + typeof(val);
            m += " with length " + val.length.toString();
            m += " number of components: " +
                expected_nb_components.toString();
            throw m;
        }
    }
    set_int_uniform(gl, name, value) {
        this.check_type(value, "number")
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform1i(uloc, value);
    }
    set_bool_uniform(gl, name, value) {
        this.check_type(value, "boolean")
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform1i(uloc, Number(value));
    }
    set_float_uniform(gl, name, value) {
        this.check_type(value, "number")
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform1f(uloc, parseFloat(value));
    }
    set_vec2_uniform(gl, name, value) {
        this.check_components(value, 2)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform2f(uloc, value[0], value[1]);
    }
    set_vec3_uniform(gl, name, value) {
        this.check_components(value, 3)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform3f(uloc, value[0], value[1], value[2]);
    }
    set_vec4_uniform(gl, name, value) {
        this.check_components(value, 4)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniform4f(uloc, value[0], value[1], value[2], value[3]);
    }
    set_mat2_uniform(gl, name, value) {
        this.check_components(value, 4)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniformMatrix2fv(uloc, false, value);
    }
    set_mat3_uniform(gl, name, value) {
        this.check_components(value, 9)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniformMatrix3fv(uloc, false, value);
    }
    set_mat4_uniform(gl, name, value) {
        this.check_components(value, 16)
        let uloc = getUniformLocation(gl, this.program_id, name);
        gl.uniformMatrix4fv(uloc, false, value);
    }
    set_uniform(gl, name, udata, utype) {
        if (utype === "vec2") {
            this.set_vec2_uniform(gl, name, udata);
        } else if (utype === "vec3") {
            this.set_vec3_uniform(gl, name, udata);
        } else if (utype === "vec4") {
            this.set_vec4_uniform(gl, name, udata);
        } else if (utype === "mat2") {
            this.set_mat2_uniform(gl, name, udata);
        } else if (utype === "mat3") {
            this.set_mat3_uniform(gl, name, udata);
        } else if (utype === "mat4") {
            this.set_mat4_uniform(gl, name, udata);
        } else if (utype === "bool") {
            this.set_bool_uniform(gl, name, udata);
        } else if (utype === "int") {
            this.set_int_uniform(gl, name, udata);
        } else if (utype === "float") {
            this.set_float_uniform(gl, name, udata);
        } else {
            throw "unknown uniform type: " + utype;
        }
    }
}

class ConstantColorShader extends Shader {
    constructor(vs_id, fs_id) {
        super(vs_id, fs_id);
    }
}
