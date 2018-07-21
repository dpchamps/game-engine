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
            if(self.pushStateFSM.currentState === self.states.standing){
                self.pushStateFSM.pushState(self.states.walking)
            }
        }, function () {
            self.pushStateFSM.popState();
        });
        keyboard.register('down', 's', function () {
            self.direction = Direction.DOWN;
            if(self.pushStateFSM.currentState === self.states.standing){
                self.pushStateFSM.pushState(self.states.walking)
            }
        }, function () {
            self.pushStateFSM.popState();
        });
        keyboard.register('left', 'a', function () {
            self.direction = Direction.LEFT;
            if(self.pushStateFSM.currentState === self.states.standing){
                self.pushStateFSM.pushState(self.states.walking)
            }
        }, function () {
            self.pushStateFSM.popState();
        });
        keyboard.register('right', 'd', function () {
            self.direction = Direction.RIGHT;
            if(self.pushStateFSM.currentState === self.states.standing){
                self.pushStateFSM.pushState(self.states.walking)
            }
        }, function () {
            self.pushStateFSM.popState();
        });
        keyboard.register('run', KeyCodes.spacebar, function () {
            if(
                self.pushStateFSM.currentState === self.states.walking
            ){
                self.pushStateFSM.pushState(self.states.running);
            }
        }, function () {
            self.pushStateFSM.popState();
        });
        keyboard.register('jump', 'e', function(){
           if(self.pushStateFSM.currentState !== self.states.jumping){
               self.pushStateFSM.pushState(self.states.jumping);
           }
        });
        


        this.keyboard = keyboard;
    }

    update(delta) {
        this.keyboard.update();
        super.update(delta);
    }
}