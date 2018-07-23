const MaxKeyPressTime = 10000;
import {KeyCodes} from "../util/common/keycodes";

const noOp = () => {};
export class Keyboard {
    gameObject = null;
    keys = {};
    keyActions = {};
    hasPressed = {};
    actionQueue = [];

    constructor(gameObject) {
        this.gameObject = gameObject;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(e) {
        const key = e.which;

        this.keys[key] = performance.now();
    }

    onKeyUp(e) {
        const key = e.which;
        const actions = this.keyActions[key] || [];

        actions.forEach(action => {
           this.actionQueue.push({
               key,
               fn : action.releaseCb
           });
        });

        this.keys[key] = null;
        delete this.keys[key];
        delete this.hasPressed[key];
    }

    _register(keys, pressCb, releaseCb = null, repeat = false) {
        keys.split(' ').forEach(key => {
            const action = new KeyboardAction(key, pressCb, releaseCb, repeat);
            const keyCode = KeyCodes[key];
            const existingActions = this.keyActions[keyCode];

            this.keyActions[keyCode] = (existingActions) ? existingActions.concat(action) : [action];
        });
    }
    
    press(keys, cb){
        this._register(keys, cb);
    }
    
    hold(keys, cb){
        this._register(keys, cb, null, true);
    }
    
    pressAndRelease(keys, pressCb, releaseCb){
        this._register(keys, pressCb, releaseCb);
    }
    
    release(keys, cb){
        this._register(keys, null, cb);
    }

    update() {
        Object.keys(this.keys).forEach( (keyCode) => {
            const actions = this.keyActions[keyCode] || [];

            actions.forEach(action => {

                const firstPress = (!this.hasPressed[keyCode]);
                this.hasPressed[keyCode] = true;
                if (action.repeat || firstPress) {
                    this.actionQueue.push({
                        key : action.key,
                        fn: action.pressCb
                    });
                }
            });
        });

        this.actionQueue.forEach(action => action.fn.call(this.gameObject, action.key));
        this.actionQueue = [];
    }
}

class KeyboardAction {
    constructor(key, pressCb = null, releaseCb = null, repeat = false) {
        this.key = key;
        this.pressCb = (pressCb === null) ? noOp : pressCb;
        this.releaseCb = (releaseCb === null) ? noOp : releaseCb;
        this.repeat = repeat;
    }
}