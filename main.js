"use strict";

import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import {renderer} from './src/renderer';
import {Character} from './src/GameObject/Character/Character';
import {AutoTile} from './src/World/AutoTile';
import {AutoTileAtlas, AutoTileAtlasNeighborMaskToIdx, AutoTileAtlasNeighborToKey} from "./src/util/lookup-tables/AutoTileAtlas";
import {TileSet} from "./src/World/TileSet";
import {TileType} from "./src/types";
import {Grid} from "./src/World/Grid";


let grid = new Grid(10, 10, 32);

grid.addTileSet('grassAutoTile', 'assets/images/tilesets/autotile/grass.png', TileType.AutoTile);

const mapLookup = {
    0 : {},
    1 : {
        tileSetName : 'grassAutoTile'
    }
};

const map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const buildGrid = ( cell ) => mapLookup[cell];
const test = map.map(row => row.map(buildGrid));

grid.assetsReady().then(() => {
    console.log('grid ready');
    grid.loadGrid(test);
    renderer.app.stage.addChild(grid.container);
    renderer.app.ticker.add(grid.update.bind(grid));
});
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