"use strict";
import {Container} from '../util/decorators/Container';
import {TileType, Terrain} from '../types';

const defaultOptions = {
    terrain : Terrain.Grass,
    passable : true,
    layer : 1
};


@Container
export class Tile{
    constructor(type, sprite, options){
        this.getContainer();
        this.type = type;
        this.sprite = sprite;
        this.options = Object.assign({}, defaultOptions, options);
        this.container.addChild(this.sprite);
    }
}