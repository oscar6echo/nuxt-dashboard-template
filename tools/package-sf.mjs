import path from 'path';
import fs from 'fs';
import cpx from 'cpx';

const multipleReplace = (str, mapObj) => {
  const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

  return str.replace(re, (matched) => mapObj[matched.toLowerCase()]);
};

const wrap = (s) => `\n\n<script> \n\n ${s} \n\n </script>\n\n`;

const getAllFiles = function(dirPath, arrayFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayFiles = getAllFiles(path.join(dirPath, file), arrayFiles);
    } else {
      arrayFiles.push(path.join(dirPath, file));
    }
  });

  return arrayFiles;
};
console.log('\n---------- PACKAGE APP INTO SINGLE FILE INDEX.HTML\n');

const src = path.join('..', 'dist');
const stage = path.join('..', 'staging');
const stat = path.join('..', 'static');
const cdn = path.join('..', 'cdn');
const dst = path.join('..', 'single-file');

console.log('copy to ', dst);
for (const fn of [
  'index.html',
  path.join('_nuxt', 'app.js'),
  path.join('_nuxt', 'commons.app.js'),
  path.join('_nuxt', 'runtime.js')
]) {
  const fp = path.join(src, fn);
  console.log('  ', fp);
  cpx.copySync(fp, stage);
}

const index = fs.readFileSync(path.join(stage, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(stage, 'app.js'), 'utf8');
const commonsApp = fs.readFileSync(path.join(stage, 'commons.app.js'), 'utf8');
const runtime = fs.readFileSync(path.join(stage, 'runtime.js'), 'utf8');

const mapObj = {
  '<link rel="preload" href="./runtime.js" as="script">': '',
  '<link rel="preload" href="./commons.app.js" as="script">': '',
  '<link rel="preload" href="./app.js" as="script">': '',
  '<script type="text/javascript" src="./runtime.js"></script>': wrap(runtime),
  '<script type="text/javascript" src="./commons.app.js"></script>': wrap(
    commonsApp
  ),
  '<script type="text/javascript" src="./app.js"></script>': wrap(app)
};

console.log('\nin index.html');
console.log('supress all  <link rel="preload"...> tags');
console.log(
  'inline js for script tags:\n  runtime.js\n  commons.app.js\n  app.js'
);
const indexNew = multipleReplace(index, mapObj);

if (fs.existsSync(dst)) {
  console.log('\nremove existing folder ', dst);
  fs.rmdirSync(dst, { recursive: true });
}
console.log('create folder ', dst);
fs.mkdirSync(dst);

console.log('\nsave new file', dst + '/index.html');
fs.writeFileSync(path.join(dst, 'index.html'), indexNew, 'utf8');

const staticFiles = getAllFiles(stat).filter(
  (e) => !['README.md', 'favicon.ico'].includes(path.basename(e))
);
console.log(`\ncopy ${staticFiles.length} files in static/ to ${dst}`);
staticFiles.forEach((e) => {
  console.log('  ', e, ' --> ', path.join(dst, path.basename(e)));
  cpx.copySync(e, dst);
});

// const cdnFiles = getAllFiles(cdn);
// console.log(`\ncopy ${cdnFiles.length} files in cdn/ to ${dst}`);
// cdnFiles.forEach((e) => {
//   console.log('  ', e, ' --> ', path.join(dst, path.basename(e)));
//   cpx.copySync(e, path.join(dst, 'cdn'));
// });

console.log('\n---------- DONE');
