"use strict";

import {State} from '../util/data-structures/PushStateFSM';
import {World, Vector, Body} from 'matter-js';
import Mathf from 'mathf';

export class GameObjectState extends State {
    gameObject = null;
    
    constructor(gameObject){
        super();
        this.gameObject = gameObject
    }
}

export class OnGroundState extends GameObjectState{
    constructor(...rest){super(...rest)}
    enter(){
        const {container, shadow} = this.gameObject;
        shadow.scale = {
            x : 1,
            y : 1
        };

        container.addChild(shadow);
        this.complete = true;
        super.enter();
    }
}

export class InitialInAirState extends GameObjectState{
    constructor(...rest){
        super(...rest);
    }
    
    enter(){
        const {container} = this.gameObject;
        const {bodyHeight} = this.gameObject.getBodyDimensions();
        const heightVector = Vector.create(0, bodyHeight+5);
        const platformPosition = Vector.add(container.position, heightVector);

        this.gameObject.shadowContainer.addChild(this.gameObject.shadow);
        this.gameObject.setPlatformPosition(platformPosition);
        this.gameObject.suspendedInAir = true;
        this.complete = true;
        super.enter();
    }
}

export class InAirState extends GameObjectState{
    constructor(...rest){super(...rest)}
    
    update(){
        const inAirDistance = this.gameObject.getInAirDistance();
        const shadowScale = Mathf.clamp(inAirDistance*0.02, 1, 7);
        this.gameObject.shadow.scale = {
            x : shadowScale,
            y : shadowScale
        };
        if(inAirDistance <= 0){
            this.complete = true;
        }
        super.update();
    }

    exit(){
        this.gameObject.setPlatformPosition({
            x: -9999,
            y: -9999
        });
        this.gameObject.suspendedInAir = false;

    }
}

