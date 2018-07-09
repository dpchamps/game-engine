"use strict";
import {Container} from '../util/decorators/Container';
import {TileSet} from './TileSet';
import {Grid} from './Grid';

@Container
export class World {
    grids = [];
    tileSets = new Map();
    tileSize;
    needsSort = false;

    constructor(tileSize = 32) {
        this.tileSize = tileSize;
        this.getContainer();
    }

    addTileSet(name, spriteSheet, tileType) {
        const tileSet = new TileSet(spriteSheet, this.tileSize, tileType);
        this.tileSets.set(name, tileSet);

        return this;
    }

    addGrid(rows, cols, rowOffset = 0, colOffset = 0, zIndex = 0){
        const grid = new Grid(rows, cols, this.tileSize, zIndex, this);

        grid.container.y = rowOffset * this.tileSize;
        grid.container.x = colOffset * this.tileSize;

        this.grids.push(grid);
        this.container.addChild(grid.container);

        this.needsSort = true;

        return this;
    }

    assetsReady() {
        return new Promise((res, rej) => {
            const tileSetPromises = Array.from(this.tileSets.values())
                .map(tileSet => tileSet.ready);
            Promise.all([...tileSetPromises])
                .then(res)
                .catch(rej);
        });
    }

    update(){
        if(this.needsSort){
            this.container.children.sort( (a, b) => a.zIndex - b.zIndex);
            this.needsSort = false;
        }
        this.grids.forEach(grid => grid.update());
    }
}