import https from 'https';

const urls = [
    'https://www.contextmuse.com/',
    'https://www.contextmuse.com/about/',
    'https://www.contextmuse.com/services/',
    'https://www.contextmuse.com/custom/',
    'https://www.contextmuse.com/contact/',
    'https://www.contextmuse.com/systems/',
    'https://www.contextmuse.com/systems/client-builds/',
    'https://www.contextmuse.com/proof-of-work/',
    'https://www.contextmuse.com/signal/',
    'https://www.contextmuse.com/gensort/',
    'https://www.contextmuse.com/creative/',
    'https://www.contextmuse.com/restaurant-systems/',
    'https://www.contextmuse.com/partners/'
];

function check(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const hasNav = data.includes('Start a Project') && data.includes('href="/contact/" class="nav-cta');
                const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
                const title = titleMatch ? titleMatch[1] : 'NONE';
                resolve({ url, status: res.statusCode, hasNav, title });
            });
        });
    });
}

Promise.all(urls.map(check)).then(results => {
    console.log('--- ALL PUBLIC ROUTES LIVE AUDIT ---');
    results.forEach(r => {
        console.log(`[${r.status}] ${r.url}`);
        console.log(`      Title: ${r.title}`);
        console.log(`      New Nav Active: ${r.hasNav}`);
    });
});
