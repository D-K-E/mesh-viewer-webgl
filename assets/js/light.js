"use strict";
// light implementation

const LYAW = -90.0;
const LPITCH = 0.0;
const LSPEED = 2.5;

//

const LIGHT_MOVEMENT = {
    L_FORWARD: "L_FORWARD",
    L_BACKWARD: "L_BACKWARD",
    L_LEFT: "L_LEFT",
    L_RIGHT: "L_RIGHT"
};

class Light {
    constructor(lightColor) {
        this.emitColor = lightColor;
    }
    emitted(emits) {
        emits = this.emitColor;
        return true;
    }
}

class DirectionalLight extends Light {
    constructor(lightColor, wup, y = LYAW, p = LPITCH) {
        super(lightColor);
        this.yaw = y;
        this.pitch = p;
        this.worldUp = wup;
        this.front = null;
        this.right = null;
        this.up = null;
        this.updateDirection();
    }

    setYaw(val) {
        this.yaw = val;
        this.updateDirection();
    }
    setPitch(val) {
        this.pitch = val;
        this.updateDirection();
    }
    updateDirection() {
        //
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
    processKeyBoardRotate(direction, deltaTime) {

        deltaTime *= this.movementSpeed;
        if (direction === LIGHT_MOVEMENT["L_FORWARD"]) {
            this.pitch += deltaTime;
        } else if (direction === LIGHT_MOVEMENT["L_BACKWARD"]) {
            this.pitch -= deltaTime;
        } else if (direction === LIGHT_MOVEMENT["L_RIGHT"]) {
            this.yaw += deltaTime;
        } else if (direction === LIGHT_MOVEMENT["L_LEFT"]) {
            this.yaw -= deltaTime;
        }
        this.updateDirection();
    }
}

class PointLight extends Light {
    constructor(lightColor, pos) {
        super(lightColor);
        this.pos = pos;
    }

}

class SpotLight {
    constructor(lightColor, pos, wup, y = LYAW,
        p = LPITCH, cutOffAngleDegree = 0.91,
        outerCut = 0.82, mspeed = LSPEED) {
        //
        this.cutOff = glMatrix.toRadian(cutOffAngleDegree);
        this.outerCutoff = outerCut;
        this.dirLight = new DirectionalLight(lightColor, wup, y, p);
        this.pointLight = new PointLight(lightColor, pos);
        this.movementSpeed = mspeed;
    }
    get_view_matrix() {
        let target = this.pointLight.pos + this.dirLight.front;
        let upvec = this.dirLight.up;
        let cameraDirection = glMatrix.vec3.create();
        glMatrix.vec3.normalize(cameraDirection, this.pointLight.pos - target);
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
        trans[3][0] = -this.pointLight.pos.x;
        trans[3][1] = -this.pointLight.pos.y;
        trans[3][2] = -this.pointLight.pos.z;

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
        this.dirLight.processKeyBoardRotate(direction, deltaTime);
    }
    process_keyboard(movement, deltaTime) {
        let velocity = this.movementSpeed * deltaTime;
        if (movement === LIGHT_MOVEMENT["L_FORWARD"]) {
            this.pointLight.pos += this.dirLight.front * velocity;
        } else if (movement === LIGHT_MOVEMENT["L_BACKWARD"]) {
            this.pointLight.pos -= this.dirLight.front * velocity;
        } else if (movement === LIGHT_MOVEMENT["L_RIGHT"]) {
            this.pointLight.pos += this.dirLight.right * velocity;
        } else if (movement === LIGHT_MOVEMENT["L_LEFT"]) {
            this.pointLight.pos -= this.dirLight.right * velocity;
        }
    }
};
