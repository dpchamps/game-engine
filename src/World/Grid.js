"use strict";
import {Container} from '../util/decorators/Container';
import {TileType} from "../types";
import {AutoTile} from "./AutoTile";

@Container
export class Grid {
    tileSets = new Map();
    needsUpdate = true;
    tileReference = {};
    grid = [];
    zIndex = 0;

    constructor(rows, cols, tileSize = 32, zIndex = 0, parent = null) {
        this.getContainer();

        this.container.zIndex = zIndex;
        this.tileSize = tileSize;
        this.width = rows * tileSize;
        this.height = cols * tileSize;
        this.rows = rows;
        this.cols = cols;

        if (parent)
            this.tileSets = parent.tileSets;

        this.initialize();
    }

    iterateGrid(fn) {
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                fn(row, col);
            }
        }
    }

    initialize() {
        this.resetMap();
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
        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                const cell = grid[row][col];

                let {tileSetName, tileIdx, tileOptions} = cell;

                this.addTile(row, col, tileSetName, tileIdx, tileOptions);
            }
        }
    }

    addTile(row, col, tileSetName, tileIdx, tileOptions) {
        this.needsUpdate = true;
        if (!tileSetName) return;
        if (this.grid[row][col] !== null) {
            this.updateTile(row, col, tileSetName, tileIdx, tileOptions);
            return;
        }
        const tileSet = this.tileSets.get(tileSetName);

        tileOptions = tileOptions || {};
        tileIdx = tileIdx || 0;

        const tile = tileSet.getTile(tileIdx, tileOptions);
        const x = col * this.tileSize;
        const y = row * this.tileSize;

        tile.sprite.x = x;
        tile.sprite.y = y;
        tile.tileSetName = tileSetName;
        tile.tileIdx = tileIdx;
        this.container.addChild(tile.sprite);
        this.grid[row][col] = tile;
    }

    updateTile(row, col, tileSetName, tileIdx, tileOptions) {
        const tile = this.grid[row][col];
        if (!tile || tile.tileIdx === tileIdx) return;

        const tileSet = this.tileSets.get(tileSetName);

        tile.tileIdx = tileIdx;

        tile.sprite.texture = tileSet.getTexture(tileIdx);
        tile.options = Object.assign({}, tile.options, tileOptions);
    }

    removeTile(row, col) {
        const tile = this.grid[row][col];

        if (!tile) return;

        this.container.removeChild(tile.sprite);
        this.grid[row][col] = null;
        this.needsUpdate = true;
    }

    getAutoTileNeighbors(terrain, row, col) {
        let neighbors = [];
        let coords = [
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1]
        ];

        while (coords.length > 0) {
            const [x, y] = coords.shift();

            const _col = col + x;
            const _row = row + y;

            if (!this.grid[_row]) {
                neighbors.push(false);
            } else if (!this.grid[_row][_col]) {
                neighbors.push(false);
            } else {
                neighbors.push(this.grid[_row][_col].options.terrain === terrain);
            }
        }

        return neighbors
    }

    getNeighbors(row, col) {
        const coords = [
            [-1, 0], [-1, -1],
            [0, -1], [1, -1],
            [1, 0], [1, 1],
            [0, 1], [-1, 1]
        ];

        const iterator = (([x,y], index) => {
            const _col = col + x;
            const _row = row + y;

            if (!this.grid[_row] || !this.grid[_row][_col]) {
                return null;
            } else {
                return this.grid[_row][_col].tileSetName;
            }
        });

        return coords.map(iterator);
    }

    findSimilarNeighbors(tile) {
        return tile.neighbors.map(tileSetName => {
            return tileSetName === tile.tileSetName
        })
    }

    collectTiles() {
        this.tileReference = {};
        const iteratorFn = (row, col) => {
            const tile = this.grid[row][col];
            if (tile === null) return;

            tile.neighbors = this.getNeighbors(row, col);
            tile.calculateBitwiseNeighbors();

            this.tileReference[tile.type] = this.tileReference[tile.type] || [];
            this.tileReference[tile.type].push({
                tile,
                row,
                col
            });
        };

        this.iterateGrid(iteratorFn.bind(this));
    }

    autoTile() {
        const autoTiles = this.tileReference[TileType.AutoTile];
        if (!autoTiles) return;

        autoTiles.forEach(tileRef => {
            const {row, col, tile} = tileRef;
            const neighbors = this.findSimilarNeighbors(tile);
            const neighborMask = AutoTile.GetNeighborMask(neighbors);
            const newIdx = AutoTile.GetTileIndex(neighborMask);

            this.updateTile(row, col, tile.tileSetName, newIdx, tile.options);
        })
    }

    update() {
        if (this.needsUpdate) {
            this.collectTiles();
            this.autoTile();
            this.needsUpdate = false;
        }

    }
}