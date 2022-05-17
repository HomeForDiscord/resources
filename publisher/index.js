const fs = require('fs'), path = require('path');

const loadFolder = (folder, cb, dcb) => {
  let joined;
  for (const entry of fs.readdirSync(folder)) {
    joined = path.join(folder, entry);
    if (fs.lstatSync(joined).isDirectory()) dcb(joined), loadFolder(joined, cb, dcb);
    else cb(joined)
  }
  return true;
};

const rootDir = path.join(process.cwd(), '..', 'src', 'pages');
const data = {};
loadFolder(rootDir, (file) => {
  const filePath = file.replace(rootDir, '').slice(1).split(path.sep);
  filePath.slice(0, -1).reduce((obj, i) => obj[i], data).files.push(filePath.pop());
}, (dir) => {
  const a = dir.replace(rootDir, '').split(path.sep).slice(1);
  const b = a.reduceRight((original, key) => ({ [key]: original, files: [] }), { files: [] });
  data[a[0]] = b[a[0]];
});

console.log(JSON.stringify(data, null, 2));
