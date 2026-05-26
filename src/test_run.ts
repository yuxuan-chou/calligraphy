import { Converter } from 'opencc-js';
try {
  const converter = Converter({ from: 'tw', to: 'cn' });
  console.log(converter('雲'));
} catch (e) {
  console.error(e);
}
