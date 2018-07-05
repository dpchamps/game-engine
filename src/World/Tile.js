"use strict";
import {Container} from '../util/decorators/Container';
import {TileType, Terrain} from '../types';

@Container
export class Tile{
    constructor(tileSet, type){
        this.type = type;
        this.tileSet = tileSet;
    }
}