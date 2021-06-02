// mesh viewer scripts
"use strict";


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
        this._uniforms = null;
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
    set uniforms(u) {
        this._uniforms = u;
    }
    get uniforms() {
        if (this._uniforms === null) {
            throw "uniforms for this renderable are null";
        }
        return this._uniforms;
    }
    load_uniforms() {
        for (const uniform_name in this.uniforms) {
            //
            this.mShader.set_uniform_data(uniform_name, this.uniforms[uniform_name]);
        }
    }
    draw(gl) {
        //
        // set color
        // set model matrix
        this.mShader.activate(gl);
        //
        this.load_uniforms();
        this.mShader.load_uniforms(gl);
        gl.enableVertexAttribArray(this.mShader.vao.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mShader.vbo.vbo);
        gl.drawArrays(gl.TRIANGLE_STRIP,
            this.triangle_start, this.nb_triangles);
        console.log("yes: ", this.nb_triangles, this.triangle_start);
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
    load_renderables(arr) {
        //
        let color = glMatrix.vec3.fromValues(0.2, 0.5, 0.5);
        let model = glMatrix.mat4.create();
        let renderable = new Renderable();
        renderable.mShader = this.mShader;
        renderable.uniforms = {
            "vcolor": color,
            "model": model
        };
        // console.log(renderable);
        this.drawables.push(renderable);
    }
    init(canvas_id, vs_id, fs_id) {
        this.gl = new GLManager(canvas_id);
        this.mShader = new Shader(vs_id, fs_id);
        this.mShader.init(this.gl);
        this.load_renderables(null);
    }
    draw() {
        let gl = this.gl;
        for (const key in this.drawables) {
            this.drawables[key].draw(gl);
        }
    }
}
