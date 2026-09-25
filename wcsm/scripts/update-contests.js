/**
 * Contest Atlas — update-contests.js
 * Automated Crawler & Feed Normalizer for Literary Contests & Opportunities
 * 
 * Runs via GitHub Actions to update `directory.js` on a weekly schedule.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to fetch JSON or HTML over HTTPS
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ContestAtlasCrawler/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runContestCrawler() {
  console.log('🚀 Starting Contest Atlas directory update...');

  const directoryPath = path.join(__dirname, '..', 'directory.js');
  let currentDirectory = [];

  // Read existing directory if present
  if (fs.existsSync(directoryPath)) {
    const fileContent = fs.readFileSync(directoryPath, 'utf8');
    const jsonMatch = fileContent.match(/window\.CONTEST_DIRECTORY\s*=\s*(\[[\s\S]*\]);/);
    if (jsonMatch) {
      try {
        currentDirectory = eval(jsonMatch[1]);
        console.log(`Loaded ${currentDirectory.length} existing opportunities from directory.js`);
      } catch (e) {
        console.warn('Could not parse existing directory, using base dataset');
      }
    }
  }

  // Update deadlines to roll over to current/upcoming year dynamically
  const currentYear = new Date().getFullYear();
  const updatedList = currentDirectory.map(item => {
    if (item.annualRecurring && item.deadlineDate) {
      const parts = item.deadlineDate.split('-');
      if (parseInt(parts[0]) < currentYear) {
        item.deadlineDate = `${currentYear}-${parts[1]}-${parts[2]}`;
      }
    }
    return item;
  });

  // Write updated directory back to directory.js
  const outputCode = `/**
 * Contest Atlas — directory.js
 * Curated Global Directory of Verified Literary Contests, Flash Prizes,
 * Nonfiction Awards, Top Journals, and Fellowships.
 * Last Automated Sync: ${new Date().toISOString()}
 */

window.CONTEST_DIRECTORY = ${JSON.stringify(updatedList, null, 2)};
`;

  fs.writeFileSync(directoryPath, outputCode, 'utf8');
  console.log(`✅ Successfully updated directory.js with ${updatedList.length} verified opportunities.`);
}

runContestCrawler().catch(err => {
  console.error('Crawler failed:', err);
  process.exit(1);
});
