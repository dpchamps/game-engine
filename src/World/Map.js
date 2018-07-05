"use strict";
import * as PIXI from 'pixi.js';
import {Container} from '../util/decorators/Container';
import {TileSet} from './TileSet'
import {Loader} from '../renderer/loader';

@Container
export class Grid {
    tileSets = new Map();

    constructor(width, height, tileSize = 32) {
        this.grid = [];
        this.tileSize = tileSize;
        this.width = width;
        this.height = height;
        this.rows = this.height * tileSize;
        this.cols = this.width * tileSize;

        this.initialize();
    }

    initialize() {
        this.loadSpriteSheet();
        this.resetMap();
    }

    addTileSet(name, spriteSheet, tileType) {
        // const loader = Loader.GetInstance();
        //
        // return loader.loadSpriteSheet(this.tileSize, this.tileSize, spriteSheet)
        //     .then((texture, sprites) => {
        //         const tileSet = new TileSet(texture, sprites, this.tileSize);
        //         this.tileSets.set(name, tileSet);
        //     });
    }

    resetMap() {
        for (let row = 0; row < this.rows; row += 1) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col += 1) {
                this.grid[row][col] = 0;
            }
        }
    }
}