"use strict";
import * as PIXI from 'pixi.js';
import {Container} from '../util/decorators/Container';
import {TileSet} from './TileSet'
import {Loader} from '../renderer/loader';
import {Tile} from "./Tile";
import {TileType} from "../types";
import {AutoTile} from "./AutoTile";

@Container
export class Grid {
    tileSets = new Map();
    needsUpdate = true;

    constructor(rows, cols, tileSize = 32) {
        this.getContainer();
        this.grid = [];
        this.tileSize = tileSize;
        this.width = rows * tileSize;
        this.height = cols * tileSize;
        this.rows = rows;
        this.cols = cols;

        this.initialize();
    }

    assetsReady() {
        return new Promise((res, rej) => {
            const tileSetPromises = Array.from(this.tileSets.values())
                .map(tileSet => tileSet.ready);
            Promise.all([...tileSetPromises])
                .then(res);
        });
    }

    iterateMap(fn){
        for (let row = 0; row < this.rows-1; row += 1) {
            for (let col = 0; col < this.cols-1; col += 1) {
                fn(row, col);
            }
        }
    }

    initialize() {
        this.resetMap();
    }

    addTileSet(name, spriteSheet, tileType) {
        const tileSet = new TileSet(spriteSheet, this.tileSize, tileType);
        this.tileSets.set(name, tileSet);


        return this;
    }

    resetMap() {
        for (let row = 0; row < this.rows; row += 1) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col += 1) {
                this.grid[row][col] = null;
            }
        }
    }

    loadGrid(grid) {
        for (let row = 0; row < this.rows-1; row += 1) {
            for (let col = 0; col < this.cols-1; col += 1) {
                const cell = grid[row][col];

                let {tileSetName, tileIdx, tileOptions} = cell;

                this.addTile(row, col, tileSetName, tileIdx, tileOptions);
            }
        }
    }

    addTile(row, col, tileSetName, tileIdx, tileOptions){
        if(!tileSetName) return;

        const tileSet = this.tileSets.get(tileSetName);

        tileOptions = tileOptions || {};
        tileIdx = tileIdx || 0;

        const tile = tileSet.getTile(tileIdx, tileOptions);
        const x = row * this.tileSize;
        const y = col * this.tileSize;

        tile.setCoords({x, y});
        tile.tileSetName = tileSetName;
        this.container.addChild(tile.container);
        this.grid[row][col] = tile;
        this.needsUpdate = true;
    }

    updateTile(row, col, tileSetName, tileIdx, tileOptions){
        const tile = this.grid[row][col];

        if(!tile) return;


        const tileSet = this.tileSets.get(tileSetName);

        tile.container.removeChild(tile.sprite);
        tile.sprite = tileSet.getSprite(tileIdx);
        tile.container.addChild(tile.sprite);
        tile.options = Object.assign({}, tile.options, tileOptions);
    }

    removeTile(row, col){
        const tile = this.grid[row][col];

        if(!tile) return;

        this.container.removeTile(tile.container);
        this.grid[row][col] = null;
        this.needsUpdate = true;
    }

    /**
     * (-1, 1)(0, 1)(1, 1)
     * (-1, 0)(tile)(1, 0)
     * (-1,-1)(0,-1)(1, -1)
     * 876
     * @param terrain
     * @param row
     * @param col
     */
    getAutoTileNeighbors(terrain, row, col){
        let neighbors = [];
        let coords = [
            [-1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
            [1, 0],
            [1, -1],
            [0, 1],
            [-1,-1]
        ];

        while(coords.length > 0){
            const [x, y] = coords.shift();

            const _col = col+y;
            const _row = row+x;
            console.log(_row, _col);

            if(!this.grid[_row]) {
                neighbors.push(false);
            }else if(!this.grid[_row][_col]){
                neighbors.push(false);
            }else{
                neighbors.push(this.grid[_row][_col].options.terrain === terrain);
            }
        }

        return neighbors
    }

    autoTile(){

        const iteratorFn = (row, col) => {
            const tile = this.grid[row][col];
            if(tile === null) return;
            if(tile.type === TileType.AutoTile){
                const neighbors = this.getAutoTileNeighbors(tile.options.terrain, row, col);
                const neighborMask = AutoTile.GetNeighborMask(neighbors);
                console.log(neighbors);
                const tileIndex = AutoTile.GetTileIndex(neighborMask);


                this.updateTile(row, col, tile.tileSetName, tileIndex);
            }
        };

        this.iterateMap(iteratorFn.bind(this));
    }

    update(){
        if(this.needsUpdate){
            this.autoTile();
            this.needsUpdate = false;
        }

    }
}