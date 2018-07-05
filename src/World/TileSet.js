"use strict";
import {TileType, Terrain} from '../types';
import {Loader} from '../renderer/loader';

export class TileSet {
    sprites;
    texture;
    tileSize;
    tileType;

    constructor(spriteSheet, tileSize, tileType) {
        this.tileSize = tileSize;
        this.tileType = tileType;

        switch (tileType) {
            case TileType.AutoTile:
                let _tileSize = tileSize * 0.5;
                this.loadTileSet(_tileSize, spriteSheet)
                    .then(this.buildAutoTiles.bind(this));
                break;
            case TileType.StaticTile:
                this.loadTileSet(tileSize, spriteSheet);
                break;
        }
    }

    loadTileSet(tileSize, spriteSheet) {
        const loader = Loader.GetInstance();

        return loader.loadSpriteSheet(tileSize, tileSize, spriteSheet)
            .then((texture, sprites) => {
                this.texture = texture;
                this.sprites = sprites;
            });
    }

    buildAutoTiles() {

    }
}