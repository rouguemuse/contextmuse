import fs from 'fs';

console.log('Removing synthetic restaurant mockups...');

// 1. proof-of-work/index.html: Remove Card: McGregor's Comedy Club
if (fs.existsSync('proof-of-work/index.html')) {
  let pow = fs.readFileSync('proof-of-work/index.html', 'utf8');
  // Target the McGregor's Comedy Club block
  const mcgregorsPattern = /\s*<!-- Card: McGregor's Comedy Club -->[\s\S]*?View Details &rarr;<\/a>\s*<\/div>/;
  if (mcgregorsPattern.test(pow)) {
    pow = pow.replace(mcgregorsPattern, '');
    fs.writeFileSync('proof-of-work/index.html', pow, 'utf8');
    console.log('Removed McGregor\'s Comedy Club card from proof-of-work/index.html');
  } else {
    console.warn('Could not match McGregor\'s Comedy Club card in proof-of-work/index.html');
  }
}

// 2. restaurant-builds/index.html: Remove the 3 synthetic images and make cards text-led
if (fs.existsSync('restaurant-builds/index.html')) {
  let rb = fs.readFileSync('restaurant-builds/index.html', 'utf8');
  // Remove confidential_pizza_preview.png wrapper
  rb = rb.replace(/<div class="p-card__media-link">\s*<div class="p-card__media">[\s\S]*?confidential_pizza_preview\.png[\s\S]*?<\/div>\s*<\/div>/, '');
  // Remove confidential_pub_preview.png wrapper
  rb = rb.replace(/<div class="p-card__media-link">\s*<div class="p-card__media">[\s\S]*?confidential_pub_preview\.png[\s\S]*?<\/div>\s*<\/div>/, '');
  // Remove confidential_comedy_preview.png wrapper
  rb = rb.replace(/<div class="p-card__media-link">\s*<div class="p-card__media">[\s\S]*?confidential_comedy_preview\.png[\s\S]*?<\/div>\s*<\/div>/, '');
  fs.writeFileSync('restaurant-builds/index.html', rb, 'utf8');
  console.log('Removed synthetic images from restaurant-builds/index.html');
}

// 3. restaurant-builds/detroit-pizza/index.html
if (fs.existsSync('restaurant-builds/detroit-pizza/index.html')) {
  let dp = fs.readFileSync('restaurant-builds/detroit-pizza/index.html', 'utf8');
  dp = dp.replace(/<div class="cs-visual">\s*<div class="cs-browser">[\s\S]*?confidential_pizza_preview\.png[\s\S]*?<\/div>/, '');
  fs.writeFileSync('restaurant-builds/detroit-pizza/index.html', dp, 'utf8');
  console.log('Removed synthetic image from restaurant-builds/detroit-pizza/index.html');
}

// 4. restaurant-builds/events-venue/index.html
if (fs.existsSync('restaurant-builds/events-venue/index.html')) {
  let ev = fs.readFileSync('restaurant-builds/events-venue/index.html', 'utf8');
  ev = ev.replace(/<div class="cs-visual">\s*<div class="cs-browser">[\s\S]*?confidential_pub_preview\.png[\s\S]*?<\/div>/, '');
  fs.writeFileSync('restaurant-builds/events-venue/index.html', ev, 'utf8');
  console.log('Removed synthetic image from restaurant-builds/events-venue/index.html');
}

// 5. restaurant-builds/comedy-venue/index.html
if (fs.existsSync('restaurant-builds/comedy-venue/index.html')) {
  let cv = fs.readFileSync('restaurant-builds/comedy-venue/index.html', 'utf8');
  cv = cv.replace(/<div class="cs-visual">\s*<div class="cs-browser">[\s\S]*?confidential_comedy_preview\.png[\s\S]*?<\/div>/, '');
  fs.writeFileSync('restaurant-builds/comedy-venue/index.html', cv, 'utf8');
  console.log('Removed synthetic image from restaurant-builds/comedy-venue/index.html');
}

console.log('Synthetic restaurant visuals removal complete.');
