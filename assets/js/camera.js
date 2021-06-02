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
        this.up = up;
        this.right;
        this.worldUp;
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
        let rad_yaw = glMatrix.toRadian(this.yaw);
        let rad_pitch = glMatrix.toRadian(this.pitch);
        front.x = Math.cos(rad_yaw) * Math.cos(rad_pitch);
        front.y = Math.sin(rad_pitch);
        front.z = Math.sin(rad_yaw) * Math.cos(rad_pitch);
        glMatrix.vec3.normalize(this.front, front);
        //
        // compute right
        let right = glMatrix.vec3.create();
        glMatrix.vec3.normalize(this.right,
            glMatrix.vec3.cross(right, this.front, this.worldUp));
        //
        // compute up
        let up = glMatrix.vec3.create();
        glMatrix.vec3.normalize(this.up,
            glMatrix.vec3.cross(up, this.right, this.front));
    }
    process_keyboard(movement, deltaTime) {
        let velocity = this.movementSpeed * deltaTime;
        if (movement === CAMERA_MOVEMENT["FORWARD"]) {
            this.pos += this.front * velocity;
        } else if (movement === CAMERA_MOVEMENT["BACKWARD"]) {
            this.pos -= this.front * velocity;
        } else if (movement === CAMERA_MOVEMENT["RIGHT"]) {
            this.pos += this.right * velocity;
        } else if (movement === CAMERA_MOVEMENT["LEFT"]) {
            this.pos -= this.right * velocity;
        }
    }
    get_view_matrix() {
        let target = this.pos + this.front;
        let upvec = this.up;
        let cameraDirection = glMatrix.vec3.create();
        glMatrix.vec3.normalize(cameraDirection, this.pos - target);
        let upv = glMatrix.vec3.create();
        let right = glMatrix.vec3.create();
        //
        glMatrix.vec3.normalize(right,
            glMatrix.vec3.cross(upv, upvec, cameraDirection)
        );
        let realUp = glMatrix.vec3.create();
        glMatrix.vec3.normalize(realUp,
            glMatrix.vec3.cross(glMatrix.vec3.create(), cameraDirection, right)
        );
        //
        let trans = glMatrix.mat4.create(1.0);
        trans[3][0] = -this.pos.x;
        trans[3][1] = -this.pos.y;
        trans[3][2] = -this.pos.z;

        //
        let rotation = glMatrix.mat4.create(1.0);
        rotation[0][0] = right.x;
        rotation[1][0] = right.y;
        rotation[2][0] = right.z;
        rotation[0][1] = realUp.x;
        rotation[1][1] = realUp.y;
        rotation[2][1] = realUp.z;
        rotation[0][2] = cameraDirection.x;
        rotation[1][2] = cameraDirection.y;
        rotation[2][2] = cameraDirection.z;
        return rotation * trans;
    }

    processKeyBoardRotate(direction, deltaTime) {

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
    processMouseScroll(yoffset) {
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
