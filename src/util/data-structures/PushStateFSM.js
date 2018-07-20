export class PushStateFSM{
    stack = [];

    constructor(){}

    pushState(state){
        this.stack.push(state);
    }

    popState(){
        return this.stack.pop();
    }

    get currentState(){
        return (this.stack.length > 0) ? this.stack[this.stack.length-1] : null;
    }
}

export class State{
    command = null;
    complete = false;
    constructor(){}
    enter(){}
    exit(){}
    update(){}
}