
import levelTMJ from './tiled/level.tmj';
import levelTMX from './tiled/level.tmx';
import hexagonTMX from './tiled/hexagon.tmx';
import hexagonTMJ from './tiled/hexagon.tmj';
import infiniteTMX from './tiled/infinite.tmx';
import infiniteTMJ from './tiled/infinite.tmj';
import isometricTMX from './tiled/isometric.tmx';
import isometricTMJ from './tiled/isometric.tmj';
import isometricStaggeredTMX from './tiled/isometric-staggered.tmx';
import isometricStaggeredTMJ from './tiled/isometric-staggered.tmj';
import keyblockTX from './tiled/keyblock.tx';

import tilsetTSJ from './tiled/Platformer.tsj';
// @ts-ignore THIS IS NOT A typescript file
import tilesetTSX from './tiled/Platformer.tsx';

import { TiledMap, TiledParser, TiledTemplateFile, TiledTilesetFile } from './tiled-parser';
import { diffString } from 'json-diff';

const tmx$ = document.getElementById('tmx') as HTMLPreElement;
tmx$.innerText = levelTMX;

const parser = new TiledParser();
let tm!: TiledMap;
let hexagon!: TiledMap;
let infinite!: TiledMap;
let isometric!: TiledMap;
let isometricStaggered!: TiledMap;
let tx!: TiledTemplateFile;
let ts!: TiledTilesetFile;
let success = false;

try {
    tm = parser.parse(levelTMX);
    hexagon = parser.parse(hexagonTMX);
    console.log('hexagon diff:', diffString(hexagon, JSON.parse(hexagonTMJ), {
        excludeKeys: ['encoding'], // we do this on purpose
        precision: 3
    }));
    

    infinite = parser.parse(infiniteTMX);
    console.log('infinite diff:', diffString(infinite, JSON.parse(infiniteTMJ), {
        excludeKeys: ['encoding'], // we do this on purpose
        precision: 3
    }));
    
    isometric = parser.parse(isometricTMX);
    console.log('isometric diff:',diffString(isometric, JSON.parse(isometricTMJ), {
        excludeKeys: ['encoding'], // we do this on purpose
        precision: 3
    }));

    isometricStaggered = parser.parse(isometricStaggeredTMX);
    console.log('isometric staggered diff:',diffString(isometricStaggered, JSON.parse(isometricStaggeredTMJ), {
        excludeKeys: ['encoding'], // we do this on purpose
        precision: 3
    }));

    tx = parser.parseExternalTemplate(keyblockTX);
    // console.log(tx);

    ts = parser.parseExternalTileset(tilesetTSX);
    success = true;
} catch (e) {
    success = false;
    console.error(e);
} 

const parsed$ = document.getElementById('parsed') as HTMLDivElement;
parsed$.innerText = success.toString();

if (success) {
    const tmj$ = document.getElementById('tmj') as HTMLPreElement;
    tmj$.innerText = JSON.stringify(tm, null, 2);

    const matches$ = document.getElementById('tmj-diff') as HTMLDivElement;
    matches$.innerText = diffString(tm, JSON.parse(levelTMJ), {
        excludeKeys: ['encoding'], 
        precision: 3  // for some reason the precision is different between Tiled's tmx and tmj
    });

    const tsjDiff$ = document.getElementById('tsj-diff') as HTMLDivElement;
    tsjDiff$.innerText = diffString(ts, JSON.parse(tilsetTSJ), {
        precision: 3
    });
}