// mesh viewer scripts
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
    init(gl) {
        this._buffer_ptr = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data),
            gl.STATIC_DRAW);
    }
}

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
            console.log(udata);
            console.log(uloc);
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

    set_constant_fs_props(gl) {
        let vcolor_props = {
            "name": "vcolor",
            "type": "vec3",
            "data": null,
            "location": null
        };
        gl.useProgram(this.mShader);
        vcolor_props["location"] = gl.getUniformLocation(this.mShader, "vcolor");
        this.set_uniform(vcolor_props);

        let model_props = {
            "name": "model",
            "type": "mat4",
            "data": null,
            "location": null
        };
        model_props["location"] = gl.getUniformLocation(this.mShader, "model");
        this.set_uniform(model_props);
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
    init(gl) {
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
        this.vbo.init(gl);
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

class GLManager {
    constructor(canvas_id) {
        let cnvs = document.getElementById(canvas_id);
        let mgl = cnvs.getContext("webgl2") || cnvs.getContext("webgl");
        if (mgl === null) {
            alert("Browser does not support webgl!");
        }
        this.mGL = mgl;
        this.clear_canvas(glMatrix.vec4.fromValues(0, 0, 0, 1));
    }
    get gl() {
        if (this.mGL === null) {
            throw "webgl instance is null";
        }
        return this.mGL
    }
    clear_canvas(color) {
        this.gl.clearColor(color[0], color[1], color[2], color[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}
class Renderable {
    //
    constructor() {
        this._shader = null;
        this._transform = null;
        this._nb_triangles = 3;
        this._triangle_start = 0;
    }
    get nb_triangles() {
        if (this._nb_triangles === null) {
            throw "number of triangles to draw is null";
        }
        return this._nb_triangles;
    }
    get triangle_start() {
        if (this._triangle_start === null) {
            throw "start of triangles to draw is null";
        }
        return this._triangle_start;
    }
    get mShader() {
        if (this._shader === null) {
            throw "shader is null";
        }
        return this._shader;
    }
    set mShader(s) {
        this._shader = s;
    }
    get mTransform() {
        if (this._transform === null) {
            throw "transform is null";
        }
        return this._transform;
    }
    draw(gl) {
        //
        // set color
        let color = glMatrix.vec3.fromValues(0.2, 0.5, 0.5);
        console.log(color);
        // set model matrix
        let model = glMatrix.mat4.create();
        this.mShader.activate(gl);
        //
        this.mShader.set_uniform_data("vcolor", color);
        this.mShader.set_uniform_data("model", model);
        this.mShader.load_uniforms(gl);
        gl.enableVertexAttribArray(this.mShader.vao.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mShader.vbo.vbo);
        gl.drawArrays(gl.TRIANGLE_STRIP, this.triangle_start,
            this.nb_triangles);
        console.log("yes");
    }
}


/**
starts the webgl object using the associated canvas id
*/

class SceneManager {
    constructor() {
        this._gl_manager = null;
        this._shader = null;
        this.drawables = [];
    }
    get gl() {
        if (this._gl_manager === null) {
            throw "gl manager is null";
        }
        return this._gl_manager.gl;
    }
    set gl(glmanager) {
        this._gl_manager = glmanager;
    }

    get mShader() {
        if (this._shader === null) {
            throw "shader is null";
        }
        return this._shader;
    }
    set mShader(s) {
        this._shader = s;
    }
    init(canvas_id, vs_id, fs_id) {
        this.gl = new GLManager(canvas_id);
        this.mShader = new Shader(vs_id, fs_id);
        this.mShader.init(this.gl);
        let renderable = new Renderable();
        renderable.mShader = this.mShader;
        this.drawables.push(renderable);
    }
    draw() {
        let gl = this.gl;
        for (const key in this.drawables) {
            this.drawables[key].draw(gl);
        }
    }
}
