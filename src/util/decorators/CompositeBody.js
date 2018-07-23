"use strict";
import {mixin} from '../helpers/mixin';
import {Container, Graphics, Sprite} from 'pixi.js';
import {renderer} from '../../renderer';
import {Body, Bodies} from 'matter-js';
import Mathf from 'mathf';
const BodyDefaults = {
    friction: 0.2,
    frictionAir: 0.2
};
const PlatformDefaults= {
    isStatic : true,
    friction : 10,
    frictionStatic : 20
};

export const CompositeBody = mixin({
    drawShadow(){
        const shadow = new Graphics();
        shadow.lineStyle(0, 0xFFFFFF, 1);
        shadow.alpha = 0.4;
        shadow.beginFill(0x222222);
        shadow.drawEllipse(0, 0, 10, 5);
        shadow.endFill();

        return renderer.app.renderer.generateTexture(shadow);
    },
    initializeContainers(){
        this.containers = [];
        this.container = new Container();
        this.shadowContainer = new Container();
        this.containers.push(this.shadowContainer);
    },
    initializeShadow(){
        this.shadow = new Sprite(this.drawShadow());
        this.shadow.anchor.x = 0.5;
        this.shadow.anchor.y = 0.5;
        this.container.addChild(this.shadow);
    },
    initializeBodies(){
        this.body = new Bodies.rectangle(0, 0, 1, 1, BodyDefaults);
        this.shadowPlatform = new Bodies.rectangle(-9999,-9999,1,1, PlatformDefaults);
    },
    initializeCompositeBody(){
        this.suspendedInAir = false;
        this.initializeContainers();
        this.initializeBodies();
        this.initializeShadow();
    },

    setPlatformPosition(coords){
        Body.setPosition(this.shadowPlatform, coords);
    },

    setCoords(coords){
        Body.setPosition(this.body, coords);
    },

    getCoords(){
        return {
            x: this.body.position.x,
            y: this.body.position.y
        }
    },

    setBody(width, height){
        this.body = new Bodies.rectangle(0,0, width, height, BodyDefaults);
        this.shadowPlatform = new Bodies.rectangle(-9999,-9999, width*1.5, 2, PlatformDefaults);
        this.shadow.width = width / 2.7;
        this.shadow.height = width / 15;
        this.shadow.x = width / 2;
        this.shadow.y = height - 3;
    },

    getBodyDimensions(){
        const bodyHeight = this.body.bounds.max.y - this.body.bounds.min.y;
        const bodyWidth = this.body.bounds.max.x - this.body.bounds.min.x;

        return {
            bodyWidth,
            bodyHeight
        };
    },

    getInAirDistance() {
        const {bodyHeight} = this.getBodyDimensions();
        return this.shadowContainer.y - (this.body.position.y -bodyHeight / 2) ;
    },

    updateCompositeBody(){
        const {bodyHeight} = this.getBodyDimensions();
        this.container.x = this.body.position.x;
        this.container.y = this.body.position.y -bodyHeight / 2;
        this.shadowContainer.x = this.body.position.x;
        
        if(!this.suspendedInAir){
            this.shadowContainer.y = this.body.position.y -bodyHeight / 2;
        }else{
            Body.setPosition(this.shadowPlatform, {
                x : this.body.position.x,
                y : this.shadowPlatform.position.y
            })
        }
    }
});
