"use strict";
import {Tile} from './Tile';
import {AutoTileAtlas} from '../util/lookup-tables/AutoTileAtlas';
import {BlobQuarterTileAtlas} from '../util/lookup-tables/BlobQuarterTileAtlas';

export const NorthAndWest = 0x05; //-----N-W
export const EastAndNorth = 0x14; //---E-N--
export const SouthAndEast = 0x50; //-S-E----
export const WestAndSouth = 0x41; //-S-----W

export const CornerNWMask = 0xFD; //Not ------C-
export const CornerNEMask = 0xF7; //Not ----C---
export const CornerSEMask = 0xDF; //Not --C-----
export const CornerSWMask = 0x7F; //Not C-------

export const CornerScoreMask = 0x7; // -----CCC

export class AutoTile {
    static FilterNeighborMask(neighborMask) {
        if ((neighborMask & NorthAndWest) !== NorthAndWest)
            neighborMask &= CornerNWMask;
        if ((neighborMask & EastAndNorth) !== EastAndNorth)
            neighborMask &= CornerNEMask;
        if ((neighborMask & SouthAndEast) !== SouthAndEast)
            neighborMask &= CornerSEMask;
        if ((neighborMask & WestAndSouth) !== WestAndSouth)
            neighborMask &= CornerSWMask;

        return neighborMask;
    }

    static LetterMap = [
        ['0', '1', '2', '3'],
        ['4', '5', '7', '7'],
        ['8', '9', 'A', 'B'],
        ['C', 'D', 'E', 'F'],
        ['G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N']
    ];

    static GetCornerMasks(neighborByte) {
        const n = (neighborByte << 8) | neighborByte;
        return [
            ((n) & CornerScoreMask),
            ((n >> 2) & CornerScoreMask),
            ((n >> 6) & CornerScoreMask),
            ((n >> 4) & CornerScoreMask)
        ];
    }

    //@return bool
    static IsValidCornerMask(cornerMask) {
        return (
            cornerMask !== 6
            && cornerMask !== 3
            && cornerMask !== 2
        );
    }

    static MakeNeighborAtlas() {
        const reduceValidMask = (acc, val) => acc && AutoTile.IsValidCornerMask(val);
        let result = {};
        let tileIndex = 0;

        for (let i = 0; i < 256; i += 1) {
            let cornerMasks = AutoTile.GetCornerMasks(i);
            if (cornerMasks.reduce(reduceValidMask, true)) {
                result[i] = tileIndex;
                tileIndex += 1;
            }
        }

        return result;
    }

    static GetNeighborMask(neighbors) {
        const toBitMask = (acc, val, idx) => acc + (val * Math.pow(2, idx));

        return neighbors.reduce(toBitMask);
    }

    static GetTileIndex(neighborMask) {
        const filteredMask = AutoTile.FilterNeighborMask(neighborMask);
        return AutoTileAtlas[filteredMask];
    }

    static GetQuarterTilesFromNeighborMask(neighbors) {
        const cornerMasks = AutoTile.GetCornerMasks(neighbors);
        return [
            BlobQuarterTileAtlas[0xA0 + cornerMasks[0]],
            BlobQuarterTileAtlas[0xB0 + cornerMasks[1]],
            BlobQuarterTileAtlas[0xC0 + cornerMasks[2]],
            BlobQuarterTileAtlas[0xD0 + cornerMasks[3]],
        ];
    }

    static LetterLookup(coord){
        const {x,y} = coord;

        return AutoTile.LetterMap[y][x];
    }

    static GetBlobTileCoords(neighborMask){
        const filteredNeighborMask = AutoTile.FilterNeighborMask(neighborMask);
        const blobQuarterTiles = AutoTile.GetQuarterTilesFromNeighborMask(filteredNeighborMask);
        const tile = [];

        for(let i = 0; i < 4; i += 1){
            const qTileIdx = blobQuarterTiles[i];
            const qTileTop = Math.floor(qTileIdx / 4);
            const qTileLeft = qTileIdx % 4;

            tile.push({
                x : qTileLeft,
                y : qTileTop
            });
        }

        return tile;
    }

    static GetBlobQTileIdx(neighborMask){
        const filteredNeighborMask = AutoTile.FilterNeighborMask(neighborMask);
        const blobQuarterTiles = AutoTile.GetQuarterTilesFromNeighborMask(filteredNeighborMask);
        const tile = [];

        for(let i = 0; i < 4; i += 1){
            tile.push(blobQuarterTiles[i]);
        }

        return tile;
    }

}