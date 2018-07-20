import MathF from 'mathf';
export const isObject = (o) => o === Object(o);

export const snapToGrid = function(x, y, gridSize){
    if(arguments.length === 2){
        x = arguments[0].x;
        y = arguments[0].y;
        gridSize = arguments[1];
    }

    const row = (y / gridSize) | 0;
    const col = (x / gridSize) | 0;

    return {row, col}
};

export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const lerpVector = (v1, v2, t) => {
    const x = MathF.lerp(v1.x, v2.x, t);
    const y = MathF.lerp(v1.y, v2.y, t);

    return {x, y};
};

export const approximateVectors = (v1, v2) => {
    const isApproximateX = MathF.approximately(v1.x, v2.x);
    const isApproximateY = MathF.approximately(v1.y, v2.y);

    return (isApproximateX && isApproximateY);
};