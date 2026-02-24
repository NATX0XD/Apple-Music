const https = require('https');

function searchTracks(query, limit = 5) {
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
    const artist = "The Beatles";
    const title = "Abbey Road";
    const res = await searchTracks(`${title} ${artist}`, 5);
    
    // Strict matching
    const strictMatch = res.find(track => 
        track.artistName.toLowerCase().includes(artist.toLowerCase())
    );
    
    console.log(strictMatch ? "Strict Audio Found: " + strictMatch.trackName : "NO STRICT AUDIO");
    console.dir(res.map(r => ({artist: r.artistName, track: r.trackName})));
}
test();
