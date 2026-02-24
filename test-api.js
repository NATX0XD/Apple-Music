const https = require('https');

function searchTracks(query, limit = 1) {
    return new Promise((resolve, reject) => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).results));
        }).on('error', reject);
    });
}

async function test() {
    const res = await searchTracks("Abbey Road", 1);
    console.log(res.length > 0 ? "Found Audio" : "NO AUDIO FOUND");
}
test();
