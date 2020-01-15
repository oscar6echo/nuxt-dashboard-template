import path from 'path';
import fs from 'fs';
import cpx from 'cpx';

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
console.log('\n---------- COPY CDN TO DIST\n');

const cdn = path.join('..', 'cdn');
const dst = path.join('..', 'dist');

const cdnFiles = getAllFiles(cdn);
console.log(`\ncopy ${cdnFiles.length} files in cdn/ to ${dst}`);
cdnFiles.forEach((e) => {
  console.log('  ', e, ' --> ', path.join(dst, e));
  cpx.copySync(e, path.join(dst, 'cdn'));
});

console.log('\n---------- DONE');
