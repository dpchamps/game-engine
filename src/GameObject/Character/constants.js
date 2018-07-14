"use strict";
import {Direction} from '../../types/Direction';
import {Vector} from "matter-js";

export const DEFAULT = {
    SPEED : 0.25,
    DIR : Direction.DOWN
};

export const ForwardVectors = {};
ForwardVectors[Direction.UP] = Vector.create(0, -1);
ForwardVectors[Direction.RIGHT] = Vector.create(1, 0);
ForwardVectors[Direction.DOWN] = Vector.create(0, 1);
ForwardVectors[Direction.LEFT] = Vector.create(-1, 0);