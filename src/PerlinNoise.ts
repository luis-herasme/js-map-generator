import { Vector2 } from './Vector';

function Shuffle(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const i2 = Math.floor(Math.random() * array.length);
        [array[i2], array[i]] = [array[i], array[i2]];
    }
}

function MakePermutation(size: number = 256) {
    let P = [];
    for (let i = 0; i < size; i++) {
        P.push(i);
    }

    Shuffle(P);

    for (let i = 0; i < size; i++) {
        P.push(P[i]);
    }

    return P;
}
let P = MakePermutation(500);

const CONSTANT_VECTORS = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
];

function Fade(t: number) {
    return ((6 * t - 15) * t + 10) * t * t * t;
}

function Lerp(t: number, a1: number, a2: number) {
    return a1 + t * (a2 - a1);
}

export function Noise2D(x: number, y: number) {
    const xFractionalpart = x - Math.floor(x);
    const yFractionalpart = y - Math.floor(y);

    const topRight = { x: xFractionalpart - 1, y: yFractionalpart - 1 };
    const topLeft = { x: xFractionalpart, y: yFractionalpart - 1 };
    const bottomRight = { x: xFractionalpart - 1, y: yFractionalpart };
    const bottomLeft = { x: xFractionalpart, y: yFractionalpart };

    const xIndex = Math.floor(x) % 255;
    const yIndex = Math.floor(y) % 255;

    const valueTopRight = P[P[xIndex + 1] + yIndex + 1];
    const valueTopLeft = P[P[xIndex] + yIndex + 1];
    const valueBottomRight = P[P[xIndex + 1] + yIndex];
    const valueBottomLeft = P[P[xIndex] + yIndex];

    const dotTopLeft = Vector2.dot(topLeft, CONSTANT_VECTORS[valueTopLeft % 4]);
    const dotTopRight = Vector2.dot(topRight, CONSTANT_VECTORS[valueTopRight % 4]);
    const dotBottomLeft = Vector2.dot(bottomLeft, CONSTANT_VECTORS[valueBottomLeft % 4]);
    const dotBottomRight = Vector2.dot(bottomRight, CONSTANT_VECTORS[valueBottomRight % 4]);

    const xFade = Fade(xFractionalpart);
    const yFade = Fade(yFractionalpart);

    return Lerp(xFade, Lerp(yFade, dotBottomLeft, dotTopLeft), Lerp(yFade, dotBottomRight, dotTopRight));
}
