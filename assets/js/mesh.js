"use strict";
// mesh object

class BaseMesh {
    constructor(gl, vertices = null, textures = null, indices = null, uniforms = null) {
        this._vertices = vertices;
        this._textures = textures;
        this._indices = indices;
        this._vao = null;
        this._vbo = null;
        this._uniforms = uniforms;
    }
    set uniforms(u) {
        this._uniforms = u;
    }
    set_uniform_prop(u) {
        if (this._uniforms === null) {
            this._uniforms = {};
        }
        this._uniforms[u["name"]] = u;
    }
    get uniforms() {
        if (this._uniforms === null) {
            throw "uniforms for this renderable are null";
        }
        return this._uniforms;
    }
    load_uniforms(gl, shaderProgram) {
        for (const uniform_name in this.uniforms) {
            //
            let udata = this.uniforms[uniform_name].data;
            let utype = this.uniforms[uniform_name].type;
            shaderProgram.set_uniform(gl, uniform_name, udata, utype);
        }
    }
    get vertices() {
        if (this._vertices === null) {
            throw "vertces are null";
        }
        return this._vertices;
    }
    get textures() {
        if (this._textures === null) {
            throw "textures are null";
        }
        return this._textures;
    }
    get indices() {
        if (this._indices === null) {
            throw "indices are null";
        }
        return this._indices;
    }
    get vbo() {
        if (this._vbo === null) {
            throw "vertex buffer object null";
        }
        return this._vbo;
    }
    get vao() {
        if (this._vao === null) {
            throw "vertex array object null";
        }
        return this._vao;
    }
    to_vertex_array() {
        let arr = [];
        let vsize = this.vertices[0].size();
        for (const index in this.vertices) {
            let vertex = this.vertices[index];
            let size = vertex.size();
            if (size !== vsize) {
                let mes = "vertex size is not correct for given vertex array";
                mes += " this messes up stride for overall vertex array";
                throw mes;
            }
            let lst = vertex.to_list();
            for (const i in lst) {
                arr.push(lst[i]);
            }
        }
        return new Float32Array(arr);
    }
    set_vao_values(gl) {
        let lst = this.vertices[0].to_list();
        let vsize = lst.byteLength;
        if (vsize >= 5) {
            // enable position
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, vsize, 0);
            gl.enableVertexAttribArray(0);

            let subarr = lst.subarray(0, 3);
            // enable uv coordinate
            gl.vertexAttribPointer(1, 2, gl.FLOAT, false, vsize,
                subarr.byteLength);
            gl.enableVertexAttribArray(1);
        }
        if (vsize >= 8) {
            let subarr = lst.subarray(0, 5);
            // set normals
            gl.vertexAttribPointer(2, 3, gl.FLOAT, false, vsize,
                subarr.byteLength);
            gl.enableVertexAttribArray(2);
        }
        if (vsize === 14) {
            // set tangent and bitangent
            let subarr = lst.subarray(0, 8);

            // set tangent
            gl.vertexAttribPointer(3, 3, gl.FLOAT, false, vsize,
                subarr.byteLength);
            gl.enableVertexAttribArray(3);

            subarr = lst.subarray(0, 11);
            // set bitangent
            gl.vertexAttribPointer(4, 3, gl.FLOAT,
                false, stride,
                subarr.byteLength
            );
            gl.enableVertexAttribArray(4);
        }
    }
    /*
    map vertex attributes to shader
    */
    map_vertex_attrib_to_shader(gl, shaderProgram) {
        let vsize = this.vertices[0].size();
        if (vsize >= 5) {
            gl.bindAttribLocation(shaderProgram, 0, 'aPos');
            gl.bindAttribLocation(shaderProgram, 1, 'aTexCoord');
        }
        if (vsize >= 8) {
            // set normals
            gl.bindAttribLocation(shaderProgram, 2, 'aNormal');
        }
        if (vsize === 14) {
            // set tangent and bitangent
            gl.bindAttribLocation(shaderProgram, 3, 'aTan');
            gl.bindAttribLocation(shaderProgram, 4, 'aBiTan');
        }
        //Set the attributes in the vertex shader to the same indices
        //Since the attribute indices have changed, we must re-link the shader
        //Note that this will reset all uniforms that were previously set.
        shaderProgram.link_program(gl);
        this.load_uniforms(gl, shaderProgram);
    }
    activate_textures(gl, shaderProgram) {
        // bind textures
        let diffuseNb = 1;
        let specularNb = 1;
        let normalNb = 1;
        let heightNb = 1;
        let dispNb = 1;
        let aoNb = 1;
        let roughNb = 1;
        let metalNb = 1;
        let albedoNb = 1;
        for (var i = 0; i < this.textures.length; i++) {
            let gflag = textures[i].flag;
            gl.activeTexture(gflag);
            let nb = null;
            let ttype = textures[i].type;
            let tname = textures[i].name;
            if (ttype === TEXTURE_TYPE["DIFFUSE"]) {
                diffuseNb++;
                nb = diffuseNb.toString();
            } else if (ttype === TEXTURE_TYPE["SPECULAR"]) {
                specularNb++;
                nb = specularNb.toString();
            } else if (ttype === TEXTURE_TYPE["NORMAL"]) {
                normalNb++;
                nb = normalNb.toString();
            } else if (ttype === TEXTURE_TYPE["HEIGHT"]) {
                heightNb++;
                nb = heightNb.toString();
            } else if (ttype === TEXTURE_TYPE["DISPLACEMENT"]) {
                dispNb++;
                nb = heightNb.toString();
            } else if (ttype === TEXTURE_TYPE["AO"]) {
                aoNb++;
                nb = aoNb.toString();
            } else if (ttype === TEXTURE_TYPE["ROUGHNESS"]) {
                roughNb++;
                nb = roughNb.toString();
            } else if (ttype === TEXTURE_TYPE["ALBEDO"]) {
                albedoNb++;
                nb = albedoNb.toString();
            } else if (ttype === TEXTURE_TYPE["METALLIC"]) {
                metalNb++;
                nb = metalNb.toString();
            }
            shaderProgram.set_int_uniform(gl, tname + nb, i);
            gl.bindTexture(gl.TEXTURE_2D, textures[i].id);
        }
    }
}

class ArrayMesh extends BaseMesh {
    constructor(gl, vertices = null, textures = null, indices = null, uniforms = null) {
        super(gl, vertices, textures, indices, uniforms);
        this.setup_mesh(gl);
    }
    setup_mesh(gl) {
        // create object
        this._vao = gl.createVertexArray();
        this._vbo = gl.createBuffer();

        // bind vertex array object
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        check_error(gl);

        // bind buffer data
        let arr = this.to_vertex_array();
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
        check_error(gl);

        // bind vao values
        this.set_vao_values(gl);
        check_error(gl);
    }
    draw(gl, shaderProgram) {
        // this.activate_textures();
        shaderProgram.activate(gl);
        this.load_uniforms(gl, shaderProgram);
        gl.bindVertexArray(this.vao);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
        gl.bindVertexArray(null);
        gl.activeTexture(gl.TEXTURE0);

    }
}

class Mesh extends BaseMesh {
    constructor(gl, vertices = null, textures = null, indices = null, uniforms = null) {
        super(gl, vertices, textures, indices, uniforms);
        this._ebo = null;
        this.setup_mesh(gl);
    }

    get ebo() {
        if (this._ebo === null) {
            throw "element buffer object null";
        }
        return this._ebo;
    }
    setup_mesh(gl) {
        // create object
        this._vao = gl.createVertexArray();
        this._vbo = gl.createBuffer();
        this._ebo = gl.createBuffer();

        // bind vertex array object
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        check_error(gl);

        // bind buffer data
        let arr = this.to_vertex_array();
        gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
        check_error(gl);

        // bind index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        check_error(gl);

        // bind vao values
        this.set_vao_values(gl);
        check_error(gl);
    }
    draw(gl, shaderProgram) {
        // bind textures
        this.activate_textures(gl, shaderProgram);

        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);

        //
        gl.bindVertexArray(null);
        gl.activeTexture(gl.TEXTURE0);
    }
}
