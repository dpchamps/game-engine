import {Command} from "./Command";
import {Body, Vector} from 'matter-js';

export class CharacterCommand extends Command{
    character;
    previousActions = [];
    constructor(character){
        super();
        console.log('new character command', character)
        this.character = character;
    }

    execute(){
        super.execute();
    }

    undo(){
        super.undo();
    }
}

export class MoveCharacterCommand extends CharacterCommand{
    constructor(...rest){super(...rest);}

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
        console.log('undoing', lastCoords);
        Body.setPosition(body, lastCoords);
        super.undo();
    }
}

export class WalkCharacterCommand extends MoveCharacterCommand{
    walkSpeed = 1.5;

    constructor(...rest){super(...rest)}

    execute(walkSpeed){
        const forward = this.character.forward();
        const force = Vector.mult(forward, this.walkSpeed);

        super.execute(force);
    }
}

export class JumpCharacterCommand extends MoveCharacterCommand{
    jumpSpeed = 4;

    constructor(...rest){super(...rest)}

    execute(sign = 1){
        const force = Vector.create(0, this.jumpSpeed*sign);

        super.execute(force);
    }
}

export class RunCharacterCommand extends MoveCharacterCommand{
    runSpeed = 3;
    constructor(...rest){super(...rest)}

    execute(){
        const forward = this.character.forward();
        const force = Vector.mult(forward, this.runSpeed);

        super.execute(force);
    }
}