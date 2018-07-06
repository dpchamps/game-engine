import {mixin} from '../helpers/mixin';

export const Promisify = mixin({
    _resolve : null,
    _reject : null,
    ready : null,
    promisify(){
        this.ready = new Promise( (res, rej) => {
            this._resolve = res;
            this._reject = rej;
        });
    }
});