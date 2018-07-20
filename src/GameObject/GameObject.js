"use strict";
import {Container} from '../util/decorators/Container';
import {Bodies, Body, Vector} from 'matter-js';

@Container
export class GameObject{
    _resolve = null;
    _reject = null;

    containers = [];
    canMove = true;
    velocity = {
        x : 0,
        y: 0
    };
    sprite = null;
    animationSpeed;
    body;

    ready = new Promise( (resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    });

    setVelocity(vector){
        const{x,y} = vector;

        this.velocity.x = x;
        this.velocity.y = y;
    }
    addVelocity(vector){
        this.velocity = Vector.add(this.velocity, vector);
    }

    isMoving(){
        return (this.velocity.x !== 0 || this.velocity.y !== 0);
    }

    constructor(){
        this.getContainer();
    }
    
    update(delta){
        this.updateContainer();
        if(this.canMove){
            Body.applyForce(this.body, this.getCoords(), {x : this.velocity.x,y : this.velocity.y})
        }
        this.velocity = {x : 0, y: 0};

    }

    
}