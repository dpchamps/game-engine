"use strict";
import {CompositeBody} from '../util/decorators/CompositeBody';
import {Bodies, Body, Vector, SAT} from 'matter-js';
import {OnGroundState, InitialInAirState, InAirState} from './GameObjectState'
import Mathf from 'mathf';
@CompositeBody
export class GameObject{
    _resolve = null;
    _reject = null;
    _airState = null;

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
        this.initializeCompositeBody();
        this.states = {
            onGround : new OnGroundState(this),
            initialInAir : new InitialInAirState(this),
            inAir : new InAirState(this)
        };
        
        this._airState = this.states.onGround;
    }
    
    manageAirState(){
        let nextState = null;
        
        if(!this._airState.hasEntered){
            this._airState.enter();
        }
        switch(this._airState.constructor.name){
            case "OnGroundState":
                if(this.suspendedInAir){
                    nextState = this.states.initialInAir;
                }
                break;
            case "InitialInAirState":
                if(this.getInAirDistance() > 0){
                    nextState = this.states.inAir;
                }
                break;
            case "InAirState":
                const collision = SAT.collides(this.body,this.shadowPlatform);
                if(collision.collided){
                    nextState = this.states.onGround;
                }
                break;
        }

        if(nextState !== null){
            this._airState.exit();
            this._airState.reset();
            this._airState = nextState;
        }

        this._airState.update();
    }
    
    update(delta){
        this.updateCompositeBody();
        this.manageAirState();
    }

    
}