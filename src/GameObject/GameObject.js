"use strict";
import {Container} from '../util/decorators/Container';

@Container
export class GameObject{
    _resolve = null;
    _reject = null;

    canMove = true;
    velocity = {
        x : 0,
        y: 0
    };
    sprite = null;
    animationSpeed;

    ready = new Promise( (resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    });

    setVelocity(...args){
        let x;
        let y;
        if(args[0] === Object(args[0])){
            x = args[0].x;
            y = args[0].y;
        }else{
            x = args[0];
            y = args[1];
        }

        if(typeof x !== 'number'){
            x = 0;
        }

        if(typeof y !== 'number'){
            y = 0;
        }

        this.velocity.x = x;
        this.velocity.y = y;
    }

    isMoving(){
        return (this.velocity.x !== 0 || this.velocity.y !== 0);
    }

    constructor(){
        this.getContainer();
    }
    
    update(delta){
        if(this.canMove){
            this.container.x += this.velocity.x * delta;
            this.container.y += this.velocity.y * delta;
        }
    }

    
}