
import levelTMJ from './level.tmj';
import levelTMX from './level.tmx';
import { Parser } from './parser';

const tmx$ = document.getElementById('tmx') as HTMLPreElement;
tmx$.innerText = levelTMX;

const parser = new Parser();
const tm = parser.parse(levelTMX);


// const tmjJson = JSON.parse(levelTMJ);
const tmj$ = document.getElementById('tmj') as HTMLPreElement;
tmj$.innerText = JSON.stringify(tm, null, 2);

const matches$ = document.getElementById('matches') as HTMLDivElement;
matches$.innerText = (JSON.stringify(tm, null, 2) == JSON.stringify(JSON.parse(levelTMJ), null, 2)).toString();