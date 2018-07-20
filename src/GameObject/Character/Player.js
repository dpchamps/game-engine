import {Character} from "./Character";
import {Keyboard} from "../../Input/Keyboard";
import {Direction} from "../../types";
import {Vector} from 'matter-js';
import {ForwardVectors} from "./constants";
import {Body} from 'matter-js';
import {KeyCodes} from "../../util/common/keycodes";

export class Player extends Character {
    moveSpeed = 0.0003;

    constructor(...rest) {
        super(...rest);
        this.initializeKeyboardControls();
    }

    initializeKeyboardControls() {
        const keyboard = new Keyboard();
        const self = this;

        keyboard.register('up', 'w', function () {
            self.direction = Direction.UP;
            const moveVector = Vector.mult(ForwardVectors[Direction.UP], self.moveSpeed);
            self.addVelocity(moveVector);
        });
        keyboard.register('down', 's', function () {
            self.direction = Direction.DOWN;
            const moveVector = Vector.mult(ForwardVectors[Direction.DOWN], self.moveSpeed);
            self.addVelocity(moveVector);
        });
        keyboard.register('left', 'a', function () {
            self.direction = Direction.LEFT;
            const moveVector = Vector.mult(ForwardVectors[Direction.LEFT], self.moveSpeed);
            self.addVelocity(moveVector);
        });
        keyboard.register('right', 'd', function () {
            self.direction = Direction.RIGHT;
            const moveVector = Vector.mult(ForwardVectors[Direction.RIGHT], self.moveSpeed);
            self.addVelocity(moveVector);
        });
        keyboard.register('run', KeyCodes.spacebar, function () {
            self.moveSpeed = 0.0005;
        }, function () {
            self.moveSpeed = 0.0003;
        });
        


        this.keyboard = keyboard;
    }

    update(delta) {
        this.keyboard.update();
        super.update(delta);
    }
}