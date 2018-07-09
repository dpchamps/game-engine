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