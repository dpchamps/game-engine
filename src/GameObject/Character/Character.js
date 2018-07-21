"use strict";

import {GameObject} from '../GameObject';
import {Container as PIXIContainer} from "pixi.js";
import {Loader} from '../../renderer/loader';
import {DEFAULT} from './constants';
import {Direction} from '../../types/Direction';
import {Vector} from 'matter-js';
import {ForwardVectors} from "./constants";
import {extras, Graphics, Sprite} from 'pixi.js';
import Mathf from 'Mathf';
import {Body} from 'matter-js';
import {PushStateFSM} from "../../util/data-structures/PushStateFSM";
import {JumpingCharacterState, RunningCharacterState, StandingCharacterState, WalkingCharacterState} from "./CharacterStates";

export class Character extends GameObject {
    _animations = new Map();
    _actions = new Map();
    _behaviors = new Map();
    _currentBehaviorIndex = 0;
    _cachedDirection;
    _behaviorInterval = 0;
    _targetBehaviorInterval = 0;
    _behaviorQueue = [];
    shadowContainer;
    shadow;
    _lastJump = false;
    _peakJumpHeight = 0;
    _maxJumpHeight = 4;
    direction = Direction.DOWN;
    currentAction = null;
    animate = false;
    jumping = false;
    landingTarget = null;

    constructor(action, spriteSheet, spriteWidth, spriteHeight) {
        super();
        if (action) {
            this.addAction(action, spriteSheet, spriteWidth, spriteHeight)
                .then(() => {
                    this.currentAction = action;
                    this.initialize();
                    this._resolve();
                });
        }
        this.pushStateFSM = new PushStateFSM();

    }

    get _currentBehavior(){
        if(typeof this._behaviorQueue[this._currentBehaviorIndex] === 'undefined'){
            return null
        }else{
            return this._behaviorQueue[this._currentBehaviorIndex];
        }
    }

    _cycleQueue(){
        const currentIndex = this._currentBehaviorIndex;
        this._currentBehaviorIndex = (currentIndex === this._behaviorQueue.length-1) ? 0 : currentIndex + 1;
    }

    addAction(name, spriteSheet, spriteWidth, spriteHeight) {
        return new Promise((res, rej) => {
            const loader = Loader.GetInstance();
            const spriteData = {
                spriteSheet,
                height: spriteHeight,
                width: spriteWidth
            };

            this._actions.set(name, spriteData);

            loader.loadSpriteSheet(spriteWidth, spriteHeight, spriteSheet)
                .then(() => {
                    const texture = loader.getTexture(spriteSheet);
                    const sprites = loader.sprites;

                    this.loadAnimation.call(this, name, texture, sprites);
                    res();
                });
        });
    }

    addBehavior(name, fn) {
        this._behaviors.set(name, fn.bind(this));
        return this;
    }

    setBehavior(name, interval = 1) {
        const behavior = {
            name,
            interval,
            cb : this._behaviors.get(name)
        };

        this._behaviorQueue.push(behavior);
        return this;
    }

    removeBehaviorFromCue(name) {
        const behaviorIndex = this._behaviorQueue.findIndex( behavior => behavior.name === name);
        const currentIndex = this._currentBehaviorIndex;
        if(behaviorIndex === -1)
            return;

        if(behaviorIndex === currentIndex) {
            this._cycleQueue();
        }else{
            this._currentBehaviorIndex--;
        }

        this._behaviorQueue.splice(behaviorIndex, 1);
    }

    loadAnimation(name, texture, sprites) {
        const spriteData = this._actions.get(name);
        const {width, height} = texture;
        const spriteReference = {};
        const textureArrays = new Array(4);

        sprites.forEach((sprite, index) => {
            const row = Math.floor(index / (width / spriteData.width));
            textureArrays[row] = textureArrays[row] || [];
            textureArrays[row].push(sprite.texture.clone());
        });

        textureArrays.forEach((textureArray, index) => {
            const animationSprite = new extras.AnimatedSprite(textureArray);

            animationSprite.visible = false;
            spriteReference[index] = animationSprite;

            this.container.addChild(animationSprite);
            this._animations.set(name, spriteReference);
        });
    }

    initialize() {
        this.animationSpeed = DEFAULT.SPEED;
        this.updateSprite();
        this.initShadow(this.sprite.width, this.sprite.height);

        this.states = {
            'standing' : new StandingCharacterState(this),
            'walking' : new WalkingCharacterState(this),
            'running' : new RunningCharacterState(this),
            'jumping' : new JumpingCharacterState(this)
        };

        this.pushStateFSM.pushState(this.states.standing);
    }

    initShadow(spriteWidth, spriteHeight){
        const circle = new Graphics();
        circle.lineStyle(0, 0xFFFFFF,1);
        circle.alpha = 0.4;
        circle.beginFill(0x22222233);
        circle.drawEllipse(0,0, spriteWidth/5, spriteWidth/18);
        circle.endFill();


        this.shadow = new Sprite(circle.generateTexture());
        this.shadow.anchor.x = 0.5;
        this.shadow.anchor.y = 0.5;
        this.shadow.x = spriteWidth/2;
        this.shadow.y = spriteHeight - 3;
        this.shadowContainer = new PIXIContainer();

        this.containers.push(this.shadowContainer);

        this.container.addChild(this.shadow);

    }

    updateSprite() {
        const animationEntries = Object.entries(this._animations.get(this.currentAction));

        animationEntries.forEach(([direction, sprite]) => {
            if (Number(direction) === this.direction) {
                sprite.visible = true;
                this.sprite = sprite;
            } else {
                sprite.visible = false;
            }
        });

        this._cachedDirection = this.direction;
    }

    getPlayerAirDistance(){
        let shadowYDistance = this.shadowContainer.y - this.container.y;
        this._peakJumpHeight = Math.max(shadowYDistance, this._peakJumpHeight);

        return Mathf.clamp(shadowYDistance*0.0045, 0, this._maxJumpHeight);
    }


    setSpritePlayState() {
        this.sprite.animationSpeed = this.animationSpeed;
        if (this.sprite.playing && !this.animate) {
            this.sprite.stop();
        } else if (!this.sprite.playing && this.animate) {
            this.sprite.play();
        }
    }

    fireCurrentBehavior(delta) {
        if (this._currentBehavior === null) return;

        this._behaviorInterval += delta;
        if (this._behaviorInterval >= this._currentBehavior.interval) {
            this._currentBehavior.cb(delta);
            this._cycleQueue();
            this._behaviorInterval = 0;
        }
    }

    forward(){
        return ForwardVectors[this.direction];
    }

    update(delta) {
        this.pushStateFSM.currentState.update();
        if (this.direction !== this._cachedDirection) {
            this.updateSprite();
        }
        this.setSpritePlayState();
        super.update(delta);
    }
}