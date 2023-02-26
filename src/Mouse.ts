import { Vector2 } from './Vector';

type Mouse = {
    position: Vector2;
    positionScreen: Vector2;
    isDown: boolean;
    mouseUp: Vector2;
    mouseDown: Vector2;
    mouseDownTime: number;
    mouseUpTime: number;
};

export const mouse: Mouse = {
    isDown: false,
    mouseUp: new Vector2(),
    mouseDown: new Vector2(),
    mouseDownTime: Date.now(),
    mouseUpTime: Date.now(),
    position: new Vector2(),
    positionScreen: new Vector2()
};
