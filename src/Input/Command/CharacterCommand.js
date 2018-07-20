import {Command} from "./Command";
import {Body, Vector} from 'matter-js';

export class CharacterCommand extends Command{
    character;
    previousActions = [];
    constructor(character){
        super();
        this.character = character;
    }

    execute(){
        super.execute();
    }

    undo(){
        super.undo();
    }
}

export class MoveCharacterCommand extends Command{
    constructor(){super()}

    execute(force){
        const coords = this.character.getCoords();
        const body = this.character.body;

        this.previousActions.push(coords);
        Body.applyForce(body, coords, force)
        super.execute();
    }

    undo(){
        const lastCoords = this.previousActions.pop();
        const body = this.character.body;

        Body.setPosition(body, lastCoords);
        super.undo();
    }
}

export class WalkCharacterCommand extends Command{
    walkSpeed = 0.0003;

    constructor(){super()}

    execute(walkSpeed){
        const forward = this.character.forward();
        const force = Vector.mult(forward, this.walkSpeed);

        super.execute(force);
    }
}

export class JumpCharacterCommand extends Command{
    jumpSpeed = 0.002;

    constructor(){super()}

    execute(){
        const force = Vector.create(0, this.jumpSpeed);

        super.execute(force);
    }
}

export class RunCharacterCommand extends Command{
    runSpeed = 0.0005;
    constructor(){super()}

    execute(){
        const forward = this.character.forward();
        const force = Vector.mult(forward, this.runSpeed);

        super.execute(force);
    }
}