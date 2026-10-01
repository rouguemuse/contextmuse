const fs = require('fs');

console.log('Finalizing truthful Synthetic Demonstration Dataset labeling...\n');

// 1. signal/demo/index.html
{
  const file = 'signal/demo/index.html';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/loadAnonymizedSample/g, 'loadSyntheticSample');
  c = c.replace(/anonymizedParsed/g, 'syntheticParsed');
  fs.writeFileSync(file, c, 'utf8');
  console.log('1. Updated signal/demo/index.html function names to loadSyntheticSample');
}

// 2. signal/sample-reports/index.html
{
  const file = 'signal/sample-reports/index.html';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    'View an anonymized sample of a Signal operational intelligence diagnostic brief',
    'View a sample of a Signal operational intelligence diagnostic brief using a Synthetic Demonstration Dataset'
  );
  c = c.replace(
    'View an anonymized sample of a Signal operational intelligence diagnostic brief',
    'View a sample of a Signal operational intelligence diagnostic brief using a Synthetic Demonstration Dataset'
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('2. Updated signal/sample-reports/index.html metadata descriptions');
}

// 3. index.html
{
  const file = 'index.html';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    'Demonstration data — values and identifiers have been anonymized.',
    'Synthetic Demonstration Dataset — values and records generated to simulate restaurant POS telemetry.'
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('3. Updated index.html Signal caption to Synthetic Demonstration Dataset');
}

// 4. work/index.html
{
  const file = 'work/index.html';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    'Demonstration data &mdash; values and identifiers have been anonymized.',
    'Synthetic Demonstration Dataset &mdash; simulated operational telemetry for demonstration.'
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('4. Updated work/index.html Signal caption to Synthetic Demonstration Dataset');
}

// 5. proof-of-work/index.html
{
  const file = 'proof-of-work/index.html';
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    'Demonstration data — values and identifiers have been anonymized.',
    'Synthetic Demonstration Dataset — simulated operational telemetry for demonstration.'
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('5. Updated proof-of-work/index.html Signal caption to Synthetic Demonstration Dataset');
}

console.log('\nFinalized truthful labeling successfully.');
