"use strict";
import {Container} from '../util/decorators/Container';
import {TileType, Terrain} from '../types';

const defaultOptions = {
    terrain: Terrain.Grass,
    passable: true,
    height : 0
};


@Container
export class Tile {
    type;
    sprite;
    options = defaultOptions;
    tileSetName;
    tileIdx = 0;
    neighbors = [];
    bitwiseNeighbors = 0;

    constructor(type, sprite, options) {
        this.getContainer();
        this.type = type;
        this.sprite = sprite;
        this.options = Object.assign({}, defaultOptions, options);
        this.container.addChild(this.sprite);
    }

    calculateBitwiseNeighbors() {
        const toBitMask = (acc, val, idx) => acc + (val * Math.pow(2, idx));
        this.bitwiseNeighbors = this.neighbors.map(tileSetName => tileSetName !== null)
                                              .reduce(toBitMask);
    }
}
