"use strict";

import {Container as PIXIContainer} from 'pixi.js';
import {mixin} from '../helpers/mixin';
import {Body, Bodies} from 'matter-js';

const bodyDefaults = {
  friction : 0.2,
  frictionAir : 0.2
};

export const Container = mixin({
    getContainer(){
        this.container = new PIXIContainer();
        this.body = new Bodies.rectangle(0,0,1,1, bodyDefaults);
    },

    setCoords(coords){
        Body.setPosition(this.body, coords);
    },

    updateContainer(){
        this.container.x = this.body.position.x;
        this.container.y = this.body.position.y;
    },

    getCoords(){
        return{
            x : this.body.position.x,
            y : this.body.position.y
        }
    }
});