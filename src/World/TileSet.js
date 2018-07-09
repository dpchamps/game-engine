"use strict";
import {TileType, Terrain} from '../types';
import * as Common from "../util/common";
import {Tile} from "./Tile";
import {Loader} from '../renderer/loader';
import {Promisify} from "../util/decorators/Promisify";
import {AutoTileAtlasIdxToNeighborMask} from "../util/lookup-tables/AutoTileAtlas";
import {AutoTile} from "./AutoTile";
import {renderer} from "../renderer";
import * as PIXI from 'pixi.js';

export const AutoTileWidth = 8;

@Promisify
export class TileSet {
    textures;
    texture;
    tileSize;
    tileType;

    constructor(spriteSheet, tileSize, tileType) {
        this.promisify();
        this.tileSize = tileSize;
        this.qTileSize = tileSize * 0.5;
        this.tileType = tileType;

        let promiseChain;

        switch (tileType) {
            case TileType.AutoTile:
                promiseChain = this.loadTileSet(this.qTileSize, spriteSheet)
                    .then(this.buildAutoTiles.bind(this));
                break;
            case TileType.StaticTile:
                promiseChain = this.loadTileSet(this.tileSize, spriteSheet);
                break;
        }

        promiseChain.then((container) => this._resolve(container));
    }

    loadTileSet(tileSize, spriteSheet) {
        const loader = Loader.GetInstance();

        return loader
            .loadTexturesFromSpriteSheet(tileSize, tileSize, spriteSheet)
            .then(({parentTexture, textures}) => {
                this.texture = parentTexture;
                this.textures = textures;
                this.width = this.texture / this.tileSize
            });
    }

    buildQTileSprite(qTileIdx, idx) {
        const sprite = new PIXI.Sprite(this.textures[qTileIdx]);
        sprite.x = (idx % 2) * this.qTileSize;
        sprite.y = ((idx / 2) | 0) * this.qTileSize;

        return sprite;
    }

    generateTileTexture(qTiles) {
        const tile = new PIXI.Container();
        const qTileArray = qTiles.map(this.buildQTileSprite.bind(this));

        tile.addChild.apply(tile, qTileArray);


        return renderer.app.renderer.generateTexture(tile);
    }

    buildAutoTiles() {

        this.textures = AutoTileAtlasIdxToNeighborMask
            .map(AutoTile.GetBlobQTileIdx)
            .map(this.generateTileTexture.bind(this));

        this.width = AutoTileWidth;

        return Promise.resolve({
            sprites: this.textures,
            tileSize: this.tileSize
        });
    }

    getIndexFromArgs(argArray) {
        let idx;

        const oneArg = argArray.length === 1;
        const oneValidArg = (argArray.length === 2 && Common.isObject(argArray[1]));
        const twoValidArgs = (typeof argArray[0] === 'number' && typeof argArray[1] === 'number');

        if ( oneArg || oneValidArg) {
            idx = argArray[0]
        }else if(twoValidArgs){
            idx = argArray[0] + this.width * argArray[2];
        }

        return idx;
    }

    getOptionsFromArgs(argArray){
        let options = {};

        if(Common.isObject(argArray[1])){
            options = argArray[1];
        }else if(Common.isObject(argArray[2])){
            options = argArray[2];
        }

        return options;
    }
    
    getTexture(...rest){
        const idx = this.getIndexFromArgs(rest);
        
        return this.textures[idx];
    }

    getSprite(...rest) {
        const idx = this.getIndexFromArgs(rest);
        const tileTex = this.textures[idx];

        return new PIXI.Sprite(tileTex);
    }

    getTile(...rest) {
        const idx = this.getIndexFromArgs(rest);
        const sprite = this.getSprite(idx);
        const tileOptions = this.getOptionsFromArgs(rest);

        return new Tile(this.tileType, sprite, tileOptions);
    }
}