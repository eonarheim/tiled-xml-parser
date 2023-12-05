
import levelTMJ from './level.tmj';
import levelTMX from './level.tmx';

import tilsetTSJ from './Platformer.tsj';
import tilsetTSX from './Platformer.tsx';

import { Parser } from './parser';
import { diffString } from 'json-diff';

const tmx$ = document.getElementById('tmx') as HTMLPreElement;
tmx$.innerText = levelTMX;

const parser = new Parser();

const tm = parser.parse(levelTMX);
const ts = parser.parseExternalTsx(tilsetTSX);
console.log(ts);

const tmj$ = document.getElementById('tmj') as HTMLPreElement;
tmj$.innerText = JSON.stringify(tm, null, 2);

const matches$ = document.getElementById('matches') as HTMLDivElement;
matches$.innerText = diffString(tm, JSON.parse(levelTMJ), {
    excludeKeys: ['x', 'y'] // for some reason the precision is different
});


