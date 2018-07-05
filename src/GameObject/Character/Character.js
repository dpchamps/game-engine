"use strict";

import {GameObject} from '../GameObject';
import {Loader} from '../../renderer/loader';
import {DEFAULT} from './constants';
import {Container} from '../../util/decorators/Container';
import * as PIXIE from 'pixi.js';

export class Character extends GameObject {
    _animations = new Map();
    _actions = new Map();
    _cachedSprite;

    direction = DEFAULT.DIR;
    currentAction = null;
    animate = false;

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
            const animationSprite = new PIXIE.extras.AnimatedSprite(textureArray);

            animationSprite.visible = false;
            spriteReference[index] = animationSprite;

            this.container.addChild(animationSprite);
            this._animations.set(name, spriteReference);
        });
    }

    initialize() {
        this.animationSpeed = DEFAULT.SPEED;
    }

    updateSprite(){
        const animationEntries = Object.entries(this._animations.get(this.currentAction));

        animationEntries.forEach(([direction, sprite]) => {
            if (direction === this.direction) {
                sprite.visible = true;
                this.sprite = sprite;
            } else {
                sprite.visible = false;
            }
        });

        this._cachedSprite = this.sprite;
    }

    setSpritePlayState() {
        this.sprite.animationSpeed = this.animationSpeed;
        if (this.sprite.playing && !this.animate) {
            this.sprite.stop();
        } else if (!this.sprite.playing && this.animate) {
            this.sprite.play();
        }
    }

    update(delta) {
        if(this.sprite !== this._cachedSprite){
            this.updateSprite();
        }

        this.setSpritePlayState();
        super.update(delta);
    }
}