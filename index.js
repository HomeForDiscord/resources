(async () => {
  const fs = require('fs'), path = require('path'), axios = require('axios');
  require('dotenv').config();


  const loadFolder = (folder, cb, dcb) => {
    let joined;
    for (const entry of fs.readdirSync(folder)) {
      joined = path.join(folder, entry);
      if (fs.lstatSync(joined).isDirectory()) dcb(joined), loadFolder(joined, cb, dcb);
      else cb(joined)
    }
    return true;
  };

  const rootDir = path.join(process.cwd(), 'src', 'pages');
  const data = {};
  loadFolder(rootDir, (file) => {
    const filePath = file.replace(rootDir, '').slice(1).split(path.sep);
    const fileName = filePath.pop();
    filePath.slice(0, -1).reduce((obj, i) => obj[i], data)[fileName] = {
      name: fileName,
      content: fs.readFileSync(file).toString()
    }
  }, (dir) => {
    const a = dir.replace(rootDir, '').split(path.sep).slice(1);
    const b = a.reduceRight((original, key) => ({ [key]: original }), {});
    data[a[0]] = b[a[0]];
  });

  const poster = await axios.post(`https://${process.env.DOMAIN}/resources/save`, {
    headers: {
      "Authorization": process.env.RESOURCES_AUTH,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  
  // console.log(JSON.stringify(data, null, 2));
  console.log(poster.status, poster.data.includes('Sign in ・ Cloudflare Access') ? 'Blocked by Cloudflare Access' : poster.data)
})()