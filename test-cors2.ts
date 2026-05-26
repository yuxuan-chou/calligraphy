async function test() {
    const r = await fetch('https://jgwords.neillu.com/data/index.json', {
        headers: { 'Origin': 'http://localhost:3000' }
    });
    console.log("CORS:", r.headers.get('access-control-allow-origin'));
}
test();
