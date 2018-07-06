"use strict";
import * as PIXIE from 'pixi.js';

export class Loader {
    assets = [];
    sprites = [];
    _resolve;
    _reject;

    constructor(PIXI) {
        this.loader = PIXI.loader;
        this.Sprite = PIXI.Sprite;
        this.Rectangle = PIXI.Rectangle;
        this.TextureCache = PIXI.utils.TextureCache;
    }
    
    static GetInstance(){
        return new Loader(PIXIE);
    }

    getSprite(id) {
        return new this.Sprite(
            this.loader.resources[id].texture
        );
    }

    load() {
        this.loader.reset();
        return new Promise((res, rej) => {
            this._resolve = res;
            this._reject = rej;
            try {
                this.loader
                    .add(this.assets)
                    .load(this.setup.bind(this));
            } catch (e) {
                this._reject(e);
            }
        });
    }

    getTexture(name){
        return this.TextureCache[name];
    }

    loadSpriteSheet(x, y, spriteSheet) {
        this.loader.reset();
        const context = Object.assign({}, {
            spriteSheet,
            self: this,
            x,
            y
        }, this);

        return new Promise((res, rej) => {
            context._resolve = res;
            context._reject = rej;

            try {
                this.loader
                    .add(spriteSheet)
                    .load(this.setupSpriteSheet.bind(context));
            } catch (e) {

            }
        })
    }

    setup() {
        this.sprites = this.assets.map(this.getSprite.bind(this));
        this._resolve();
    }

    setupSpriteSheet() {
        const texture = this.TextureCache[this.spriteSheet];
        const cols = texture.width / this.x;
        const rows = texture.height / this.y;
        const spriteWidth = this.x;
        const spriteHeight = this.y;
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                const t = texture.clone();
                const rect = new this.Rectangle(col * spriteWidth, row * spriteHeight, spriteWidth, spriteHeight);

                t.frame = rect;
                this.sprites.push(new this.Sprite(t));
            }
        }

        this._resolve({
            texture : texture.clone(),
            sprites : this.sprites
        });
    }
}