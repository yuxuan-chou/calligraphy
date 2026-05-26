const fs = require('fs');
const html = fs.readFileSync('jgwords.html', 'utf8');

const regex = /https?:\/\/[^\s"'<>]+/g;
const urls = [...new Set(html.match(regex))];
console.log("URLs found:");
console.log(urls.join('\n'));
