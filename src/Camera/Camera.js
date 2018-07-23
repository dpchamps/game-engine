import {Rectangle} from 'pixi.js';
import isEqual from 'lodash/isEqual';
import Mathf from 'mathf';
import {lerpVector, approximateVectors} from "../util/common";

export class Camera extends Rectangle {
    _lastPosition = null;
    _panTo = null;
    _follow = null;

    constructor(viewportWidth, aspectRatio = 1.77, xOffset = 0, yOffset = 0) {
        const viewportHeight = Math.floor(viewportWidth / aspectRatio);
        super(xOffset, yOffset, viewportWidth, viewportHeight);
    }

    _cachePosition() {
        this._lastPosition = this.position();
    }

    _setPosition(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    _lerpTo(destination, t) {
        const currentPosition = this.position();
        const newPosition = lerpVector(currentPosition, destination, t/18);

        this._setPosition(newPosition);
    }

    position() {
        const {x, y} = this;
        return {x, y};
    }

    hasMoved() {
        return !isEqual(this.position(), this._lastPosition);
    }

    panTo(gameObject) {
        const {x, y} = gameObject.container;
        this._panTo = {x, y};
    }

    isPanning() {
        return this._panTo !== null;
    }

    follow(gameObject) {
        // const {x, y} = gameObject.container;
        this._follow = gameObject.container;
        console.log('following', this._follow);
    }

    free() {
        this.follow = null;
    }

    update(deltaTime) {
        if (this.isPanning()) {
            this._lerpTo(this._panTo, deltaTime);
            if (approximateVectors(this.position(), this._panTo)) {
                this._panTo = null;
            }
        } else if (this._follow !== null) {
            let {x,y} = this._follow;

            x -= (this.width/2 | 0) - this._follow.width / 2 | 0;
            y -= (this.height/2 | 0) - this._follow.height / 2 | 0;

            x = (x < 0) ? 0 : x;
            y = (y < 0) ? 0 : y;

            if (!approximateVectors(this.position(), {x,y})) {
                this._lerpTo({x,y}, deltaTime);
            }
        }

    }

    postUpdate(){
        this._cachePosition();
    }
}