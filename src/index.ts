import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import { Camera } from './Camera';
import { NoiseGrid } from './MapGenerator';
import { mouse } from './Mouse';
import { Vector2 } from './Vector';

const MOVEMENT_SPEEED = 20;

const app = new PIXI.Application({ resizeTo: window });
document.body.appendChild(app.view);
const camera = new Camera(app.stage);

document.body.addEventListener('wheel', (event) => {
    if (0 > event.deltaY) {
        camera.addWheelForce(0.01);
    } else {
        camera.addWheelForce(-0.01);
    }
});

document.body.addEventListener('mouseup', (event) => {
    mouse.isDown = false;
    const { clientX, clientY } = event;
    mouse.mouseUp.x = clientX;
    mouse.mouseUp.y = clientY;
    mouse.mouseUpTime = Date.now();
});

document.body.addEventListener('keypress', (event) => {
    if (event.key.toLowerCase() == 'w') {
        camera.addForce(new Vector2(0, MOVEMENT_SPEEED));
    }
    if (event.key.toLowerCase() == 's') {
        camera.addForce(new Vector2(0, -MOVEMENT_SPEEED));
    }
    if (event.key.toLowerCase() == 'a') {
        camera.addForce(new Vector2(MOVEMENT_SPEEED, 0));
    }
    if (event.key.toLowerCase() == 'd') {
        camera.addForce(new Vector2(-MOVEMENT_SPEEED, 0));
    }
});

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

const F = 0.01;
const grid = new NoiseGrid(MAP_WIDTH, MAP_HEIGHT, F);

for (let i = 1; i < 10; i++) {
    const power = 2 ** i;
    const grid_ = new NoiseGrid(MAP_WIDTH, MAP_HEIGHT, F * power);
    grid_.mult(1 / power);
    grid.add(grid_);
}

grid.normalize();

const container = new PIXI.ParticleContainer(grid.width * grid.height, {
    position: true
});

const pixels = new Graphics();

function draw() {
    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            const color = grid.grid[y][x];
            if (color >= 0.9) {
                const color_ = 5 * (color - 0.9) + 0.5;
                pixels.beginFill(PIXI.utils.rgb2hex([color_, color_, color_]));
            } else if (color >= 0.8) {
                const color_ = 5 * (color - 0.8);
                pixels.beginFill(
                    PIXI.utils.rgb2hex([(50 * color_ + 50) / 255, (40 * color_ + 40) / 255, (50 * color_ + 50) / 255])
                );
            } else if (color >= 0.5) {
                const color_ = (color - 0.5) / (0.8 - 0.5);
                pixels.beginFill(PIXI.utils.rgb2hex([color_ * 0.2, 0.65 - (color_ * 0.3 + 0.2), color_ * 0.2]));
            } else if (color >= 0.45) {
                pixels.beginFill(PIXI.utils.rgb2hex([2 * color, 2 * color, 0.56]));
            } else if (color >= 0.35) {
                pixels.beginFill(PIXI.utils.rgb2hex([0.2, 0.2, color * 1]));
            } else {
                pixels.beginFill(PIXI.utils.rgb2hex([0.1, 0.1, color * 1]));
            }
            pixels.drawRect(x * 5, y * 5, 5, 5);
            pixels.endFill();
        }
    }
}

app.stage.addChild(container);
app.stage.addChild(pixels);

draw();
app.ticker.add((delta) => {
    camera.updateMovement(delta);
});

document.body.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;

    mouse.position.x = (clientX - app.stage.x) / app.stage.scale.x;
    mouse.position.y = (clientY - app.stage.y) / app.stage.scale.y;

    mouse.positionScreen.x = clientX;
    mouse.positionScreen.y = clientY;
});

document.body.addEventListener('mousedown', (event) => {
    const { clientX, clientY } = event;

    mouse.mouseDown.x = clientX;
    mouse.mouseDown.y = clientY;
    mouse.mouseDownTime = Date.now();
    mouse.isDown = true;
});
