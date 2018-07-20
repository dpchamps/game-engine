"use strict";
import debounce from 'lodash/debounce';

export class App{
    _app;
    _fpsMeter;

    appOptions = {
        width: 250,
        height: 250,
        antialias: true,
        resolution: 1,
        transparent: false,
        debug : true,
        // forceCanvas : true
    };

    constructor(PIXI){
        this.Application = PIXI.Application;
        this.el = document.querySelector('#game');

        this.initialize();
    }

    createFPSMeter(){
        this._fpsMeter = document.createElement('div');
        this._fpsMeter.style.position = 'absolute';
        this._fpsMeter.style.top = '0';
        this._fpsMeter.style.left = '0';
        this._fpsMeter.style.zIndex = '9999';
        this._fpsMeter.style.backgroundColor = '#F0EAD6';
        this._fpsMeter.style.boxShadow = '1px 1px 1px 1px rgba(0,0,0,0.45)';
        this._fpsMeter.style.padding = '0.5em';


        document.body.appendChild(this._fpsMeter);

        this.ticker.add(() => {
            this._fpsMeter.innerText = `FPS: ${this.ticker.FPS.toFixed(3)}`;
        });
    }

    initialize(){
        this._app = new this.Application(this.appOptions);

        const {view, renderer, stage, ticker} = this._app;

        renderer.autoResize = true;
        renderer.resize(window.innerWidth , window.innerHeight );


        this.el.appendChild(view);

        this.view = view;
        this.stage = stage;
        this.renderer = renderer;
        this.ticker = ticker;

        if(this.appOptions.debug){
            this.createFPSMeter();
        }
    }
}