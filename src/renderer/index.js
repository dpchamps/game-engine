"use strict";
import * as PIXI from 'pixi.js';
import {App} from './app';
import {Loader} from './loader';

export const renderer = {
    app : new App(PIXI),
    loader : new Loader(PIXI)
};

