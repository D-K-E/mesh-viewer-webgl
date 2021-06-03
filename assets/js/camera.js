// camera object
"use strict";

const CAMERA_MOVEMENT = {
    FORWARD: "FORWARD",
    BACKWARD: "BACKWARD",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
};

// default values for the camera
const M_YAW = -90.0;
const M_PITCH = 0.0;
const M_SPEED = 2.5;
const M_SENSITIVITY = 0.00001;
const M_ZOOM = 45.0;

class Camera {
    constructor(pos = glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
        up = glMatrix.vec3.fromValues(0.0, 1.0, 0.0),
        yaw = M_YAW, pitch = M_PITCH, zoom = M_ZOOM,
        front = glMatrix.vec3.fromValues(0.0, 0.0, -1.0),
        speed = M_SPEED, sens = M_SENSITIVITY
    ) {
        this.pos = pos;
        this.front = front;
        this.worldUp = up;
        // euler angles
        this.yaw = yaw;
        this.pitch = pitch;

        // camera options
        this.movementSpeed = speed;
        this.mouseSensitivity = sens;
        this.zoom = zoom;
        this.update_camera_vectors();
    }
    set_camera(posX, posY, posZ, upX, upY, upZ,
        yaw, pitch, front = glMatrix.vec3.fromValues(0.0, 0.0, -1.0),
        speed = M_SPEED, sens = M_SENSITIVITY, zoom = M_ZOOM) {
        this.pos = glMatrix.vec3.fromValues(posX, posY, posZ);
        this.worldUp = glMatrix.vec3.fromValues(upX, upY, upZ);
        this.yaw = yaw;
        this.pitch = pitch;
        this.movementSpeed = speed;
        this.mouseSensitivity = sens;
        this.zoom = zoom;
        this.update_camera_vectors();
    }
    update_camera_vectors() {
        let front = glMatrix.vec3.create();
        let rad_yaw = glMatrix.glMatrix.toRadian(this.yaw);
        let rad_pitch = glMatrix.glMatrix.toRadian(this.pitch);
        front[0] = Math.cos(rad_yaw) * Math.cos(rad_pitch);
        front[1] = Math.sin(rad_pitch);
        front[2] = Math.sin(rad_yaw) * Math.cos(rad_pitch);
        glMatrix.vec3.normalize(this.front, front);
        //
        // compute right
        let right = glMatrix.vec3.create();
        glMatrix.vec3.cross(right, this.front, this.worldUp);
        this.right = glMatrix.vec3.create();
        glMatrix.vec3.normalize(this.right, right);
        //
        // compute up
        let up = glMatrix.vec3.create();
        glMatrix.vec3.cross(up, this.right, this.front);
        this.up = glMatrix.vec3.create();
        glMatrix.vec3.normalize(this.up, up);
    }
    process_keyboard(movement, deltaTime) {
        let velocity = this.movementSpeed * deltaTime;
        let fvel = glMatrix.vec3.create();
        let pos = glMatrix.vec3.create();
        if (movement === CAMERA_MOVEMENT["FORWARD"]) {
            glMatrix.vec3.scale(fvel, this.front, velocity);
            console.log(fvel);
            glMatrix.vec3.add(pos, this.pos, fvel);
            this.pos = pos;
        } else if (movement === CAMERA_MOVEMENT["BACKWARD"]) {
            glMatrix.vec3.scale(fvel, this.front, velocity);
            glMatrix.vec3.subtract(pos, this.pos, fvel);
            this.pos = pos;
        } else if (movement === CAMERA_MOVEMENT["RIGHT"]) {
            glMatrix.vec3.scale(fvel, this.right, velocity);
            glMatrix.vec3.add(pos, this.pos, fvel);
            this.pos = pos;
        } else if (movement === CAMERA_MOVEMENT["LEFT"]) {
            glMatrix.vec3.scale(fvel, this.right, velocity);
            glMatrix.vec3.subtract(pos, this.pos, fvel);
            this.pos = pos;
        }
    }
    get_view_matrix() {
        let cpos = this.pos;
        let cfront = this.front;
        let cup = this.up;
        let front_pos = glMatrix.vec3.create();
        glMatrix.vec3.add(front_pos, cpos, cfront);
        let view = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(view, cpos, front_pos, cup);
        return view;
    }

    process_keyboard_rotate(direction, deltaTime) {

        deltaTime *= this.movementSpeed;
        if (direction === CAMERA_MOVEMENT["FORWARD"]) {
            this.pitch += deltaTime;
        } else if (direction === CAMERA_MOVEMENT["BACKWARD"]) {
            this.pitch -= deltaTime;
        } else if (direction === CAMERA_MOVEMENT["RIGHT"]) {
            this.yaw += deltaTime;
        } else if (direction === CAMERA_MOVEMENT["LEFT"]) {
            this.yaw -= deltaTime;
        }
        this.update_camera_vectors();
    }
    process_mouse_scroll(yoffset) {
        let zoom = this.zoom;

        if (this.zoom >= 1.0 && this.zoom <= 45.0) {
            this.zoom -= yoffset;
        }
        if (this.zoom <= 1.0) {
            this.zoom = 1.0;
        }
        if (this.zoom >= 45.0) {
            this.zoom = 45.0;
        }
    }
}
