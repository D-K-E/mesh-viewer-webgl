"use strict";

// error check code


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


function check_error(gl) {
    let err = gl.getError();
    if (err === gl.NO_ERROR) {
        return true;
    } else if (err === gl.INVALID_ENUM) {
        let mess = "An unacceptable value has been specified for an enumerated";
        mess += " argument. The command is ignored and the error flag is set.";
        throw "INVALID_ENUM :: " + mess;
    } else if (err === gl.INVALID_VALUE) {
        let mess = "A numeric argument is out of range.";
        mess += " The command is ignored and the error flag is set.";
        throw "INVALID_VALUE :: " + mess;
    } else if (err === gl.INVALID_OPERATION) {
        let mess = "The specified command is not allowed for the current";
        mess += " state. The command is ignored and the error flag is set.";
        throw "INVALID_OPERATION :: " + mess;
    } else if (err === gl.INVALID_FRAMEBUFFER_OPERATION) {
        let mess = "The currently bound framebuffer is not framebuffer complete";
        mess += " when trying to render to or to read from it.";
        throw "INVALID_FRAMEBUFFER_OPERATION :: " + mess;
    } else if (err === gl.OUT_OF_MEMORY) {
        let mess = "Not enough memory is left to execute the command.";
        throw "OUT_OF_MEMORY :: " + mess;
    } else if (err === gl.CONTEXT_LOST_WEBGL) {
        let mess = "If the WebGL context is lost, this error is returned on ";
        mess += "the first call to getError. Afterwards and until the context";
        mess += " has been restored, it returns gl.NO_ERROR.";
        throw "CONTEXT_LOST_WEBGL :: " + mess;
    }
}
