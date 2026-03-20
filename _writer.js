const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const content = fs.readFileSync('/dev/stdin', 'utf8');
const fullPath = path.resolve(file);
fs.mkdirSync(path.dirname(fullPath), { recursive: true });
fs.writeFileSync(fullPath, content);
console.log('Written: ' + fullPath);
