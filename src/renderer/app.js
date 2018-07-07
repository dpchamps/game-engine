"use strict";
import debounce from 'lodash/debounce';

export class App{
    _app;

    appOptions = {
        width: 250,
        height: 250,
        antialias: true,
        resolution: 1,
        transparent: false
    };

    constructor(PIXI){
        this.Application = PIXI.Application;
        this.el = document.querySelector('#game');

        this.initialize();
    }

    initialize(){
        this._app = new this.Application(this.appOptions);

        const {view, renderer, stage, ticker} = this._app;

        renderer.autoResize = true;
        renderer.resize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', debounce(() =>{
            renderer.resize(window.innerWidth, window.innerHeight);
        }, 150));

        this.el.appendChild(view);

        this.view = view;
        this.stage = stage;
        this.renderer = renderer;
        this.ticker = ticker;
    }
}