const MaxKeyPressTime = 10000;
import {KeyCodes} from "../util/common/keycodes";

export class Keyboard {
    keys = {};
    keyActions = {};

    constructor() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(e) {
        const key = e.which;

        this.keys[key] = performance.now();
    }

    onKeyUp(e) {
        const key = e.which;
        if(this.keyActions[key]){
            this.keyActions[key].forEach(action => {
                if(typeof action.releaseCb === 'function'){
                    action.releaseCb();
                }
            });
        }

        delete this.keys[key];
    }

    register(name, key, pressCb, releaseCb) {
        const keyCode = (typeof key === 'string') ? KeyCodes[key] : key;

        const existingActions = this.keyActions[keyCode];
        const action = new KeyboardAction(name, pressCb, releaseCb);

        this.keyActions[keyCode] = (existingActions) ? [...existingActions, ...action] : [action];
    }

    registerOnce(name, key, pressCb){

        const keyCode = (typeof key === 'string') ? KeyCodes[key] : key;
        const existingActions = this.keyActions[keyCode];
        const onceCb = () => {
            pressCb.call(this);
            setTimeout(()=>delete this.keys[key], 25);
        };
        const action = new KeyboardAction(name, onceCb);


        this.keyActions[keyCode] = (existingActions) ? [...existingActions, ...action] : [action];
    }

    unregister(name, key) {
        if (typeof name !== 'string') {
            key = name;
            name = null;
        }

        const keyCode = KeyCodes[key];
        let actions = this.keyActions[keyCode];

        if (!actions)
            return;

        actions = actions.filter(action => {
            if (name === null) {
                return false;
            } else {
                return action.name !== name;
            }
        });

        if (actions.length === 0) {
            delete this.keyActions[keyCode];
        } else {
            this.keyActions[keyCode] = actions;
        }
    }

    update() {
        Object.keys(this.keys).forEach(keyCode => {
            const actions = this.keyActions[keyCode];
            if(actions){
                actions.forEach(action => action.pressCb.call(this));
            }
        });
    }
}

class KeyboardAction {
    constructor(name, pressCb, releaseCb) {
        this.name = name;
        this.pressCb = pressCb;
        this.releaseCb = releaseCb;
    }
}