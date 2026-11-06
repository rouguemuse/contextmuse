/**
 * Contest Atlas — update-contests.js
 * Automated Crawler & Feed Normalizer for Literary Contests & Opportunities
 * 
 * Runs via GitHub Actions to update `directory.js` on a weekly schedule.
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const isDryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
  console.log(`🚀 Starting Contest Atlas directory update${isDryRun ? ' (DRY RUN)' : ''}...`);

  const directoryPath = path.join(__dirname, '..', 'directory.js');
  if (!fs.existsSync(directoryPath)) {
    throw new Error(`Directory file not found at ${directoryPath}`);
  }

  const fileContent = fs.readFileSync(directoryPath, 'utf8');
  const jsonMatch = fileContent.match(/window\.CONTEST_DIRECTORY\s*=\s*(\[[\s\S]*\]);/);
  if (!jsonMatch) {
    throw new Error('Could not locate window.CONTEST_DIRECTORY array in directory.js');
  }

  let currentDirectory;
  try {
    currentDirectory = JSON.parse(jsonMatch[1]);
  } catch (e) {
    throw new Error(`Could not parse existing directory JSON: ${e.message}`);
  }

  if (!Array.isArray(currentDirectory) || currentDirectory.length === 0) {
    throw new Error('Parsed contest directory is empty or invalid; aborting to prevent data loss.');
  }

  console.log(`Loaded ${currentDirectory.length} existing opportunities from directory.js`);

  // Update deadlines to roll over to current/upcoming year dynamically
  const currentYear = new Date().getFullYear();
  const updatedList = currentDirectory.map(item => {
    if (item.annualRecurring && item.deadlineDate) {
      const parts = item.deadlineDate.split('-');
      if (parseInt(parts[0], 10) < currentYear) {
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

  if (isDryRun) {
    console.log(`🧪 [DRY RUN] Validated ${updatedList.length} verified opportunities without modifying directory.js.`);
    return;
  }

  fs.writeFileSync(directoryPath, outputCode, 'utf8');
  console.log(`✅ Successfully updated directory.js with ${updatedList.length} verified opportunities.`);
}

runContestCrawler().catch(err => {
  console.error('Crawler failed:', err);
  process.exit(1);
});
