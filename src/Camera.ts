import { Container } from 'pixi.js';
import { mouse } from './Mouse';
import { Vector2, Vector2JSON } from './Vector';

export class Camera {
    private stage: Container;
    private velocity = new Vector2();
    private acceleration = new Vector2();
    private velocityWheel: number = 0;
    private accelerationWheel: number = 0;
    private friction: number = 0.98;
    private wheelFriction: number = 0.94;
    private mass: number = 1;

    constructor(stage: Container) {
        this.stage = stage;
    }

    updateMovement(deltaTime: number) {
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.friction);
        this.stage.x += this.velocity.x * deltaTime;
        this.stage.y += this.velocity.y * deltaTime;

        this.velocityWheel += this.accelerationWheel;
        if ((this.velocityWheel > 0 && this.stage.scale.x < 4) || (this.velocityWheel < 0 && this.stage.scale.x > 0.5)) {
            this.velocityWheel *= this.wheelFriction;

            const deltaWheelVelocity = this.velocityWheel * deltaTime;

            const xBefore = (mouse.positionScreen.x - this.stage.x) / this.stage.scale.x;
            const yBefore = (mouse.positionScreen.y - this.stage.y) / this.stage.scale.y;

            this.stage.scale.x += deltaWheelVelocity;
            this.stage.scale.y += deltaWheelVelocity;

            this.stage.x = mouse.positionScreen.x - xBefore * this.stage.scale.x;
            this.stage.y = mouse.positionScreen.y - yBefore * this.stage.scale.y;
        } else {
            this.velocityWheel = 0;
        }

        this.accelerationWheel = 0;
        this.acceleration.mult(0);
    }

    addWheelForce(force: number) {
        this.accelerationWheel += force / this.mass;
    }

    addForce(force: Vector2) {
        force.mult(1 / this.mass);
        this.acceleration.add(force);
    }

    getPosition(): Vector2JSON {
        return {
            x: this.stage.x,
            y: this.stage.y
        };
    }
}
