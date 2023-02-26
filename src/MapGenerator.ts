import { Noise2D } from './PerlinNoise';

export class NoiseGrid {
    width: number;
    height: number;
    frequency: number;
    grid: number[][] = [];

    constructor(width = 100, heigth = 100, frequency = 0.1) {
        this.width = width;
        this.height = heigth;
        this.frequency = frequency;

        this.generate();
        this.normalize();
    }

    private generate() {
        const matrix: number[][] = [];

        for (let y = 0; y < this.height; y++) {
            matrix.push([]);
            for (let x = 0; x < this.width; x++) {
                matrix[y][x] = 10 * Noise2D(x * this.frequency, y * this.frequency);
            }
        }

        this.grid = matrix;
    }

    normalize() {
        const { max, min } = this.getMaxAndMin();

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const value = this.get(x, y);
                this.set(x, y, (value - min) / (max - min));
            }
        }
    }

    mult(scalar: number) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const value = this.get(x, y);
                this.set(x, y, value * scalar);
            }
        }
    }

    private getMaxAndMin(): { max: number; min: number } {
        let max = -Infinity;
        let min = Infinity;

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const value = this.get(x, y);
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            }
        }

        return { max, min };
    }

    get(x: number, y: number): number {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) throw Error('Invalid index');
        return this.grid[y][x];
    }

    set(x: number, y: number, value: number) {
        if (x >= this.width || x < 0 || y >= this.height || y < 0) throw Error('Invalid index');
        this.grid[y][x] = value;
    }

    add(grid: NoiseGrid) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const otherValue = grid.get(x, y);
                const thisValue = this.get(x, y);
                this.set(x, y, otherValue + thisValue);
            }
        }
    }
}
