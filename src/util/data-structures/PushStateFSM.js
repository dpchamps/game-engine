export class PushStateFSM{
    stack = [];

    constructor(){}

    pushState(state){
        state.enter();
        if(this.currentState !== null){
            this.currentState.exit();
        }
        this.stack.push(state);
    }

    popState(){
        this.currentState.exit();
        const returnState = this.stack.pop();
        this.currentState.enter();

        return returnState;
    }

    get currentState(){
        return (this.stack.length > 0) ? this.stack[this.stack.length-1] : null;
    }
}

export class State{
    command = null;
    complete = false;
    hasEntered = false;
    hasExited = false;

    constructor(){}
    enter(){
        this.hasEntered = true;
    }
    exit(){
        this.hasExited = true;
    }
    reset(){
        this.hasEntered = false;
        this.hasExited = false;
        this.complete = false;
    }
    update(){}
}