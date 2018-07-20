import {Rectangle} from 'pixi.js';

export class QuadTree {
    MAX_OBJECTS = 15;
    MAX_LEVELS = 10;
    level = 0;
    objects = [];
    bounds;
    nodes = Array(4).fill(null);

    constructor(level, bounds) {
        this.level = level;
        this.bounds = bounds;
    }

    clear() {
        this.objects = [];
        this.nodes.forEach((node, index) => {
            node.clear();
            node[index] = null;
        });
    }

    split() {
        const _width = Math.floor(this.bounds.width / 2);
        const _height = Math.floor(this.bounds.height / 2);
        const _offsetX = this.bounds.x;
        const _offsetY = this.bounds.y;
        const _rects = [
            new Rectangle(_offsetX + _width, _offsetY, _width, _height),
            new Rectangle(_offsetX, _offsetY, _width, _height),
            new Rectangle(_offsetX, _offsetY + _height, _width, _height),
            new Rectangle(_offsetX + _width, _offsetY + _height, _width, _height)
        ];
        const _level = this.level + 1;

        _rects.forEach((rect, index) => {
            this.nodes[index] = new QuadTree(_level, rect);
        });
    }

    getIndex(mRect) {
        const xMidPoint = this.bounds.x + (this.bounds.width / 2);
        const yMidPoint = this.bounds.y + (this.bounds.height / 2);
        // console.log(`(${mRect.x}, ${mRect.y}) (${mRect.right},${mRect.top}) ${xMidPoint}) | ${yMidPoint}`);

        const inTopHalf = mRect.top < yMidPoint;
        const inBottomHalf = mRect.y > yMidPoint;
        const inRightHalf = mRect.x > xMidPoint;
        const inLeftHalf = mRect.right < xMidPoint;

        let index = -1;

        if (inTopHalf && inRightHalf) {
            index = 0
        } else if (inTopHalf && inLeftHalf) {
            index = 1;
        } else if (inBottomHalf && inRightHalf) {
            index = 2;
        } else if (inBottomHalf && inLeftHalf) {
            index = 3;
        }

        return index;
    }

    resizeIfNeeded() {
        if (this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            // console.log('resizing');
            if (this.nodes[0] === null) {
                this.split();
            }

           for(let i = (this.objects.length-1); i > 0; i-=1){
               // console.log(i, this.objects[i]);
               const _index = this.getIndex(this.objects[i].getBounds());
                if(_index !== -1){
                    this.nodes[_index].insert(this.objects.splice(i, 1)[0])
                }
           }
            // console.log(`After: ${this.level} - ${this.objects.length}`);
        }
    }

    insert(container) {
        if (this.nodes[0] !== null) {
            const index = this.getIndex(container.getBounds());

            if (index !== -1) {
                this.nodes[index].insert(container);
                return;
            }
        }

        this.objects.push(container);
        this.resizeIfNeeded();
    }

    getNearestObjects(mRect, returnObjects = []) {
        const index = this.getIndex(mRect);

        //console.log(this.objects, mRect, this.level);
        returnObjects = [...returnObjects, ...this.objects.slice()];
        if (index !== -1 && this.nodes[0] !== null) {
            return this.nodes[index].getNearestObjects(mRect, returnObjects);
        }


        return returnObjects;
    }

    getAllItemsInQuadrant(q, arr = []){
        // console.log(this.objects.length)
        if(this.nodes[0] !== null && this.level < this.MAX_LEVELS){
            arr = this.nodes[q].getAllItemsInQuadrant(q, arr);
        }

        arr = [...arr, ...this.objects];


        return arr;
    }

    countAllObjects(numObjects = 0){
        this.nodes.forEach(node => {
            if(node !== null)
                numObjects = node.countAllObjects(numObjects)
        });

        numObjects += this.objects.length;

        return numObjects;


    }

}