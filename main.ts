
import levelTMJ from './level.tmj';
import levelTMX from './level.tmx';

import tilsetTSJ from './Platformer.tsj';
import tilsetTSX from './Platformer.tsx';

import { TiledParser } from './tiled-parser';
import { diffString } from 'json-diff';

const tmx$ = document.getElementById('tmx') as HTMLPreElement;
tmx$.innerText = levelTMX;

const parser = new TiledParser();

const tm = parser.parse(levelTMX);
const ts = parser.parseExternalTsx(tilsetTSX);

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


