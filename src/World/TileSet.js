"use strict";
import {TileType, Terrain} from '../types';
import {Loader} from '../renderer/loader';
import {Promisify} from "../util/decorators/Promisify";
import {AutoTileAtlasIdxToNeighborMask} from "../util/lookup-tables/AutoTileAtlas";
import {AutoTile} from "./AutoTile";
import * as PIXI from 'pixi.js';

@Promisify
export class TileSet {
    sprites;
    texture;
    tileSize;
    tileType;

    constructor(spriteSheet, tileSize, tileType) {
        this.promisify();
        this.tileSize = tileSize;
        this.tileType = tileType;

        let promiseChain;

        switch (tileType) {
            case TileType.AutoTile:
                let _tileSize = tileSize * 0.5;
                promiseChain = this.loadTileSet(_tileSize, spriteSheet)
                    .then(() => this.buildAutoTiles.call(this, _tileSize));
                break;
            case TileType.StaticTile:
                promiseChain = this.loadTileSet(tileSize, spriteSheet);
                break;
        }

        promiseChain.then((container)=>this._resolve(container));
    }

    loadTileSet(tileSize, spriteSheet) {
        const loader = Loader.GetInstance();

        return loader.loadSpriteSheet(tileSize, tileSize, spriteSheet)
            .then(({texture, sprites}) => {
                this.texture = texture;
                this.sprites = sprites;
            });
    }

    buildAutoTiles(tileSize) {
        const container = new PIXI.Container();

        const buildTile = (qTileIdx) => {
            const sprite = new PIXI.Sprite(this.sprites[qTileIdx].texture);
            sprite.x = (qTileIdx % 32);
            sprite.y = (Math.floor(qTileIdx / 32));
            console.log(sprite.x, sprite.y);
            return sprite;
        };

        const pushToContainer = (sprite) => container.addChild(sprite);


        let blobCoords = Object.values(AutoTileAtlasIdxToNeighborMask).map(AutoTile.GetBlobQTileIdx);

        blobCoords.forEach( tile => {
            tile.map(buildTile).forEach(pushToContainer);
        });

        console.log(container);

        return Promise.resolve(container);
    }
}