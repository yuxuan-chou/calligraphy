import shengjiaoData from './src/data/shengjiao.json' assert { type: "json" };
import { Converter } from 'opencc-js';
const converter = Converter({ from: 'tw', to: 'cn' });

const query = '天';
const chars = query.replace(/\s+/g, '').split('');
const results = [];
chars.forEach((char, charIdx) => {
const simplifiedChar = converter(char);
const filenames = shengjiaoData[simplifiedChar];
if (filenames && filenames.length > 0) {
    results.push(filenames);
}
});
console.log("Results for 天:", results);
