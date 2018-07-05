"use strict";

import * as PIXI from 'pixi.js';
import {mixin} from '../helpers/mixin';

export const Container = mixin({
    container : new PIXI.Container,

    setCoords(coords){
        this.container.x = coords.x;
        this.container.y = coords.y;
    },

    getCoords(){
        return{
            x : this.container.x,
            y : this.container.y
        }
    }
});