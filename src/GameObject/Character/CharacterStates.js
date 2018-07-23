import {WalkCharacterCommand, RunCharacterCommand, JumpCharacterCommand} from "../../Input/Command/CharacterCommand";
import {State} from "../../util/data-structures/PushStateFSM";
import Mathf from "mathf";

export class CharacterState extends State {
    character = null;

    constructor(character) {
        super();
        this.character = character;
    }
}

export class StandingCharacterState extends CharacterState {
    constructor(...rest) {super(...rest)}

    enter() {
        this.character.animate = false;
        this.character.sprite.gotoAndStop(0);
        this.complete = true;
        super.enter();
    }
}

export class WalkingCharacterState extends CharacterState {
    constructor(...rest) {
        super(...rest);
        this.command = new WalkCharacterCommand(this.character);
    }

    enter() {
        this.character.animate = true;
        super.enter();
    }

    exit() {
        super.exit();
    }

    update() {
        if (this.character.canMove) {
            this.command.execute();
            this.complete = true;
        }

        super.update();
    }
}

export class RunningCharacterState extends CharacterState {
    constructor(...rest) {
        super(...rest);
        this.command = new RunCharacterCommand(this.character);
    }

    update() {
        this.command.execute();
        this.complete = true;

        super.update();
    }
}

export class JumpingCharacterState extends CharacterState {
    _peakJumpHeight = 0;
    _maxJumpHeight = 15;

    constructor(...rest) {
        super(...rest);
        this.command = new JumpCharacterCommand(this.character);
    }

    getPlayerInAirDistance() {
        let shadowYDistance = this.character.shadowContainer.y - this.character.container.y;
        this._peakJumpHeight = Math.max(shadowYDistance, this._peakJumpHeight);

        return shadowYDistance;
    }

    enter() {
        this.character.jumping = true;
        this.character.shadowContainer.y = this.character.container.y;

        this.character.shadowContainer.addChild(this.character.shadow);
        super.enter();
    }

    exit() {
        this.character.container.addChild(this.character.shadow);
        this.character.shadowContainer.y = this.character.container.y;
        this.character.shadow.scale = {
            x: 1,
            y: 1
        };
        this._peakJumpHeight = 0;
        super.exit();
    }

    update() {
        const inAirDistance = this.getPlayerInAirDistance();
        const shadowScale =  Mathf.clamp(inAirDistance * 0.0045, 0, this._maxJumpHeight);
        this.character.shadowContainer.x = this.character.container.x;

        if (this.character.jumping && inAirDistance < this._maxJumpHeight) {
            this.command.execute();

        }

        this.character.shadow.scale = {
            x: 1 + shadowScale,
            y: 1 + shadowScale
        };

        if (this._peakJumpHeight >= this._maxJumpHeight) {
            if(inAirDistance > 0){
                this.command.execute(-0.25);
            }else{
                this.command.execute(1.3)
            }

            this.character.jumping = false;
            if (inAirDistance <= 0) {
                this.complete = true;
            }
        }

        super.update();
    }
}