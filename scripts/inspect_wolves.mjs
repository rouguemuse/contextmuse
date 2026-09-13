import fs from 'fs';

const res = await fetch('https://howtoexplainyourselftowolves.com/');
const html = await res.text();
console.log('Status:', res.status);
console.log('HTML length:', html.length);
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');
const metaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
console.log('Description:', metaDesc ? metaDesc[1] : 'None');
console.log('\nFirst 500 chars of text:');
const body = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log(body.substring(0, 500));
