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
        if (this.objects > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
            if (this.nodes[0] === null) {
                this.split();
            }

            while (this.objects.length > 0) {
                const _mRect = this.objects.pop();
                const _index = this.getIndex(_mRect);
                this.nodes[_index].insert(_mRect)
            }
        }
    }

    insert(mRect) {
        if (this.nodes[0] !== null) {
            const index = this.getIndex(mRect);

            if (index !== -1) {
                this.nodes[index].insert(mRect);
            }
        } else {
            this.objects.push(mRect);
        }

        this.resizeIfNeeded();
    }

    getNearestObjects(mRect, returnObjects = []){
        const index = this.getIndex(mRect);

        if(index !== -1 && this.nodes[0] !== null){
            this.nodes[index].getNearestObjects(mRect, returnObjects);
        }

        returnObjects = returnObjects.concat(this.objects);

        return returnObjects;
    }

}