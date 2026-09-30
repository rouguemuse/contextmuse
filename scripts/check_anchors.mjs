import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('signal/demo/index.html', 'utf8');
const $ = cheerio.load(html);
$('a').each((i, el) => {
  const href = $(el).attr('href');
  console.log(i, href, $(el).text().trim());
});
