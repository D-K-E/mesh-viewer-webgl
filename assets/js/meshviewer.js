// mesh viewer scripts
"use strict";

/**
starts the webgl object using the associated canvas id
*/

class SceneManager {
    constructor() {
        this._gl_manager = null;
        this._shader = null;
        this.drawables = [];
    }
    clear() {
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
    }
    add_renderable(a) {
        this.drawables.push(a);
    }
    init(canvas_id, vs_id, fs_id) {
        this.gl = new GLManager(canvas_id);
        this.mShader = new ConstantColorShader(vs_id, fs_id);
        this.mShader.link_program(this.gl);
    }
    draw() {
        let gl = this.gl;
        this.mShader.activate(gl);

        for (const key in this.drawables) {
            this.drawables[key].draw(gl, this.mShader);
        }
    }
}
