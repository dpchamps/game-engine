"use strict";

import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {renderer} from './src/renderer';
import {Character} from './src/GameObject/Character/Character';
import {Player} from "./src/GameObject/Character/Player";
import {AutoTile} from './src/World/AutoTile';
import {snapToGrid, randomInt} from './src/util/common';

import {TileSet} from "./src/World/TileSet";
import {TileType} from "./src/types";
import {Grid} from "./src/World/Grid";
import {World} from './src/World/World';
import {Vector, Body} from 'matter-js';
import {Keyboard} from "./src/Input/Keyboard";


const mapLookup = {
    0: {},
    1: {
        tileSetName: 'grassAutoTile'
    },
    2: {
        tileSetName: 'wallAutoTile'
    },
    3 : {
        tileSetName: 'barrels',
        tileIdx: 0,
        passable : false
    },
    4 : {
        tileSetName: 'barrels',
        tileIdx : 8,
        passable: false
    }
};
const world = new World(32);
const rows = ((window.innerHeight )/32 | 0);
const cols = ((window.innerWidth)/32 | 0);
const barrelGrid = [
    [0, 0, 0, 3, 4],
    [3, 0, 4, 0, 0],
];
const spriteSheet = 'assets/images/chars/main_char_2/hero_walk1.png';
const player = new Player('walk', spriteSheet, 64, 64);

const randomWalk = function(deltaTime){
    const dir = randomInt(0, 3);
    this.animate = true;
    this.direction = dir;
    const forwardVector = this.forward();
    this.setVelocity(Vector.mult(forwardVector, 0.0002));
};
const stand = function(deltaTime){
    this.sprite.gotoAndStop(0);
    this.animate = false;
    this.setVelocity(0,0);
};

const buildGrid = (cell) => mapLookup[cell];
world
    .addTileSet('grassAutoTile', 'assets/images/tilesets/autotile/grass.png', TileType.AutoTile)
    .addTileSet('wallAutoTile', 'assets/images/tilesets/autotile/wall.png', TileType.AutoTile)
    .addTileSet('barrels', 'assets/images/tilesets/barrels.png', TileType.StaticTile)

    .addGrid(100, 100, 0, 0, 1)
    .addGrid(rows, cols/2|0, 0, 0)
    .addGrid(2, 5, 50, 50, 3)
;
Promise.all([
    player.ready,
    world.assetsReady()
]).then(() => {
    const map1 = Array(world.grids[0].rows).fill(null).map(x => x = Array(world.grids[0].cols).fill(1));
    const map2 = Array(world.grids[0].rows).fill(null).map(x => x = Array(world.grids[0].cols).fill(2));
    const mapData1 = map1.map(row => row.map(buildGrid));
    const mapData2 = map2.map(row => row.map(buildGrid));
    const mapData3 = barrelGrid.map(row => row.map(buildGrid));

    world.grids[0].loadGrid(mapData1);
   //world.grids[1].loadGrid(mapData2);
   world.grids[2].loadGrid(mapData3);
   console.log(rows+' rows x' , cols+' cols', 'tiles');


    player.setCoords({x: 50*32, y: 50*32});
    // player.setCoords({x: 0, y: 0});
    player.isMoving = true;
    player.animate = true;
    // player.addBehavior('randomWalk', randomWalk)
    //     .addBehavior('stand', stand)
    //     .setBehavior('randomWalk', 200)
    //     .setBehavior('stand', 300);
    console.log(player);
    world.addObject(player);

    renderer.app.renderer.resize(world.camera.width, world.camera.height);
    renderer.app.stage.addChild(world.container);
    renderer.app.ticker.add(world.update.bind(world));
    renderer.app.ticker.add( player.update.bind(player) );

    world.camera.follow(player);

});

// let rows = ((window.innerWidth) / 32) | 0;
// let cols = ((window.innerHeight) / 32) | 0;
// console.log((rows * cols) * 3);
// let grid = new Grid(cols, rows, 32);
// let grid2 = new Grid(cols, rows, 32);
// let grid3 = new Grid(cols, rows, 32);
// grid.addTileSet('grassAutoTile', 'assets/images/tilesets/autotile/grass.png', TileType.AutoTile);
// grid2.addTileSet('grassAutoTile', 'assets/images/tilesets/autotile/wall.png', TileType.AutoTile);
// grid3.addTileSet('grassAutoTile', 'assets/images/tilesets/autotile/grassCliff.png', TileType.AutoTile);
// const mapLookup = {
//     0: {},
//     1: {
//         tileSetName: 'grassAutoTile'
//     }
// };
//
// const map = Array(grid.rows).fill(null).map(x => x = Array(grid.cols).fill(1));
// const buildGrid = (cell) => mapLookup[cell];
// const mapData = map.map(row => row.map(buildGrid));
//
// Promise.all([
//     grid.assetsReady(),
//     grid2.assetsReady(),
//     grid3.assetsReady()
// ]).then(() => {
//     grid3.loadGrid(mapData);
//     grid2.loadGrid(mapData);
//     grid.loadGrid(mapData);
//     renderer.app.stage.addChild(grid2.container);
//     renderer.app.stage.addChild(grid.container);
//     renderer.app.stage.addChild(grid3.container);
//     renderer.app.ticker.add(grid.update.bind(grid));
//     renderer.app.ticker.add(grid2.update.bind(grid2));
//     renderer.app.ticker.add(grid3.update.bind(grid3));
//     let mouseDown = false;
//
//     renderer.app.el.addEventListener('mousedown', () => mouseDown = true);
//     renderer.app.el.addEventListener('mouseup', () => mouseDown = false);
//     renderer.app.el.addEventListener('mousemove', (e)=>{
//         if(mouseDown){
//             let {row, col} = snapToGrid(e, 32);
//             if(row > grid.rows || col > grid.cols){
//                 return;
//             }
//             switch(e.buttons){
//                 case 1:
//                     grid.addTile(row, col, 'grassAutoTile', 0, {});
//                     break;
//                 case 2:
//                     grid.removeTile(row, col, 'grassAutoTile', 0, {});
//                     break;
//             }
//         }
//     });
//
//     renderer.app.el.addEventListener('contextmenu', (e) => {
//         e.preventDefault();
//     })
// });
// // for(let i = 0; i < 47; i += 1){
// //     const mask = AutoTile.GetTileIndex(i);
// //     console.log(AutoTile.GetBlobTileCoords(mask).map(AutoTile.LetterLookup));
// // }
// //console.log(Object.keys(AutoTileAtlasNeighborMaskToIdx).map(AutoTile.GetBlobTileCoords).map( arr => arr.map(AutoTile.LetterLookup)));
// renderer.app.initialize();
// renderer.loader.assets = [
//     'assets/images/chars/main_char_2/hero_walk.png'
// ];
//
//
// const tileSet = new TileSet('assets/images/tilesets/autotile/grass.png', 32, TileType.AutoTile);
//
// tileSet.ready.then(({sprites, tileSize})=>{
//     sprites.forEach( (sprite, index) => {
//         const tile = tileSet.getTile(index);
//         const x = (index % 8) * tileSize;
//         const y = ((index / 8) | 0) * tileSize;
//
//         tile.setCoords({x, y});
//
//         renderer.app.stage.addChild(tile.container);
//     })
// });
// const spriteSheet = 'assets/images/chars/main_char_2/hero_walk1.png';
// const player = new Character('walk', spriteSheet, 64, 64);

// player.ready.then( () => {
//     // console.log(player, renderer.app.renderer, renderer.app.stage);
//     //renderer.app.stage.addChild(player.container);
//     player.coords = {x : window.innerWidth/2, y : window.innerHeight / 2};
//     renderer.app.ticker.add( player.update.bind(player) );
// });
// // renderer.loader.loadSpriteSheet(64, 64, spriteSheet)
// //     .then(() => {
// //         const texture = renderer.loader.TextureCache[spriteSheet];
// //         const {width, height} = texture;
// //
// //         const textures = [];
// //
// //         for(let idx = 0; idx < renderer.loader.sprites.length; idx += 1){
// //             const col = (idx) % (width/64);
// //             const row = Math.floor( (idx) / (width/64));
// //
// //             textures[row] = textures[row] || [];
// //
// //             textures[row].push(renderer.loader.sprites[idx].texture.clone());
// //         }
// //
// //         const animations = textures.map( animation => new PIXI.extras.AnimatedSprite(animation));
// //
// //         animations.forEach( (animation, index) => {
// //             animation.x = (index * 128) + 64;
// //             animation.y = window.innerHeight / 2;
// //             console.log(animation);
// //
// //             renderer.app.stage.addChild(animation);
// //             animation.animationSpeed = 0.1;
// //             animation.play();
// //         })
// //     })
// //     .catch(e => console.log(e));