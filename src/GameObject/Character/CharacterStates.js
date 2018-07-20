import {WalkCharacterCommand, RunCharacterCommand, JumpCharacterCommand} from "../../Input/Command/CharacterCommand";
import {State} from "../../util/data-structures/PushStateFSM";
import Mathf from "mathf";

export class CharacterState extends State {
    character = null;

    constructor(character) {
        super();
        this.character = character;
    }

    enter() {
    }

    exit() {
    }
}

export class StandingCharacterState extends CharacterState {
    constructor() {
        super()
    }

    enter() {
        this.character.animate = false;
        this.character.sprite.gotoAndStop(0);
        this.complete = true;
    }
}

export class WalkingCharacterState extends CharacterState {
    constructor() {
        super();
        this.command = new WalkCharacterCommand();
    }

    enter() {
        this.character.animate = true;
    }

    update() {
        if (this.character.canMove) {
            this.command.execute();
            this.complete = true;
        }
    }
}

export class RunningCharacterState extends CharacterState {
    constructor() {
        super();
        this.command = new RunCharacterCommand();
    }

    update() {
        this.command.execute();
        this.complete = true;
    }
}

export class JumpingCharacterState extends CharacterState {
    _peakJumpHeight = 0;
    _maxJumpHeight = 4;
    constructor() {
        super();
        this.command = new JumpCharacterCommand();
    }

    getPlayerInAirDistance() {
        let shadowYDistance = this.character.shadowContainer.y - this.character.container.y;
        this._peakJumpHeight = Math.max(shadowYDistance, this._peakJumpHeight);

        return Mathf.clamp(shadowYDistance * 0.0045, 0, this._maxJumpHeight);
    }

    enter() {
        this.character.shadowContainer.addChild(this.character.shadow);
    }

    exit() {
        this.character.container.addChild(this.character.shadow);
        this.character.shadowContainer.y = this.character.container.y;
        this.character.shadow.scale = {
            x: 1,
            y: 1
        }
    }

    update() {
        const inAirDistance = this.getPlayerInAirDistance();

        if (!this.character.jumping) {
            this.command.execute();
        } else {
            this.character.shadow.scale = {
                x : 1+inAirDistance,
                y : 1+inAirDistance
            };
        }

        if(inAirDistance === 0 && this._peakJumpHeight >= this._maxJumpHeight/2){
            this.complete = true;
        }
    }
}