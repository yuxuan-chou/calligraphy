import { Converter } from 'opencc-js';
const converter = Converter({ from: 'tw', to: 'cn' });
console.log(converter('雲'));
