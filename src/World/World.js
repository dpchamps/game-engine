"use strict";
import {Container} from '../util/decorators/Container';
import {Engine, World as PhysicsWorld, Body, Events} from 'matter-js';
import {TileSet} from './TileSet';
import {Grid} from './Grid';
import {QuadTree} from "../util/data-structures/QuadTree";
import {Rectangle} from 'pixi.js';
import {Camera} from "../Camera/Camera";
import {snapToGrid} from "../util/common";

const maxWorldWidth = 1600;
const maxWorldHeight = 1600;

@Container
export class World {
    _lastVisibleTiles = [];
    grids = [];
    tileSets = new Map();
    tileSize;
    needsSort = false;
    gameObjectQuadTree;
    gameObjects = [];
    physicsEngine = null;

    constructor(tileSize = 32, camera = new Camera(970)) {
        this.physicsEngine = new Engine.create();
        this.physicsEngine.world.gravity.y = 0;
        this.physicsEngine.world.gravity.x = 0;
        this.tileSize = tileSize;
        this.camera = camera;
        this.getContainer();

        const quadtreeRect = new Rectangle(0, 0, maxWorldWidth * tileSize, maxWorldHeight * tileSize);
        this.gameObjectQuadTree = new QuadTree(0, quadtreeRect);
        Events.on(this.physicsEngine, 'afterUpdate', () => {
           this.gameObjects.forEach( gameObject => {
              if(gameObject.suspendedInAir){
                  gameObject.body.force.y += gameObject.body.mass * 2;
                  if(gameObject.getInAirDistance() <= 0){
                      gameObject.suspendedInAir = false;
                      gameObject.container.addChild(gameObject.shadow);
                  }
              }
           });
        });
    }

    addTileSet(name, spriteSheet, tileType) {
        const tileSet = new TileSet(spriteSheet, this.tileSize, tileType);
        this.tileSets.set(name, tileSet);

        return this;
    }

    addGrid(rows, cols, rowOffset = 0, colOffset = 0, zIndex = 0) {
        const grid = new Grid(rows, cols, this.tileSize, zIndex, this);

        grid.container.y = rowOffset * this.tileSize;
        grid.container.x = colOffset * this.tileSize;

        this.grids.push(grid);
        this.container.addChild(grid.container);

        this.needsSort = true;

        return this;
    }

    addObject(gameObject){
        gameObject.world = this;
        this.gameObjects.push(gameObject);
        this.container.addChild(gameObject.container);
        this.container.addChild.apply(this.container, gameObject.containers);
        PhysicsWorld.add(this.physicsEngine.world, [gameObject.body, gameObject.shadowPlatform]);
    }

    assetsReady() {
        return new Promise((res, rej) => {
            const tileSetPromises = Array.from(this.tileSets.values())
                .map(tileSet => tileSet.ready);
            Promise.all([...tileSetPromises])
                .then(res)
                .catch(rej);
        });
    }

    renderViewport() {

        if (this.camera.hasMoved()) {
            const edge = 2;
            const cameraOffsetX = this.camera.x / 32 | 0;
            const cameraOffsetY = this.camera.y / 32 | 0;
            const cameraCols = edge + cameraOffsetX + (this.camera.width / this.tileSize | 0);
            const cameraRows = edge + cameraOffsetY + (this.camera.height / this.tileSize | 0);
            const gridIterator = (grid, row, col) => {
                if(grid[row] && grid[row][col]){
                    const tile = grid[row][col];

                    tile.sprite.renderable = true;
                    this._lastVisibleTiles.push(tile);
                }
            };


            this._lastVisibleTiles.forEach(sprite => sprite.renderable = false);
            this._lastVisibleTiles = [];

            for(let col = 0; col < cameraCols; col += 1){
                for(let row = 0; row < cameraRows; row +=1 ){
                    this.grids.forEach( grid => gridIterator(grid.grid, row, col));
                }
            }
        }
    }

    update(deltaTime) {
        if (this.needsSort) {
            this.container.children.sort((a, b) => a.zIndex - b.zIndex);
            this.needsSort = false;
        }
        this.camera.update(deltaTime);
        this.renderViewport();
        this.camera.postUpdate();
        this.container.position.set(-this.camera.x, -this.camera.y);
        this.grids.forEach(grid => grid.update());
        Engine.update(this.physicsEngine, deltaTime);
    }
}