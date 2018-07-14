import {Bounds} from 'matter-js';

const MAX_OBJECTS = 15;
const MAX_LEVELS = 10;

export class QuadTree{
    level = 0;
    objects = [];
    bounds;
    nodes = Array(4).fill(null);

    constructor(level, bounds){
        this.level = level;
        this.bounds = bounds;
    }

    clear(){
        this.objects = [];
        this.nodes.forEach((node, index) => {
            node.clear();
            node[index] = null;
        });
    }


}