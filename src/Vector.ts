export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    mult(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    add(v: Vector2JSON) {
        this.x += v.x;
        this.y += v.y;
    }

    normalize() {
        const mag = this.mag();
        this.x /= mag;
        this.y /= mag;
    }

    dot(v: Vector2JSON) {
        return this.x * v.x + this.y * v.y;
    }

    static dot(v1: Vector2JSON, v2: Vector2JSON): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static sub(v1: Vector2JSON, v2: Vector2JSON): Vector2 {
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    static distance(v1: Vector2JSON, v2: Vector2JSON): number {
        return Vector2.sub(v1, v2).mag();
    }
}

export type Vector2JSON = {
    x: number;
    y: number;
};
