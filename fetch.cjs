const fs = require('fs');

async function fetchSource() {
  const res = await fetch("https://jgwords.neillu.com/");
  const text = await res.text();
  fs.writeFileSync('jgwords.html', text);
  console.log("Done");
}

fetchSource();
