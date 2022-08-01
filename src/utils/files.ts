import { readdirSync, statSync, createWriteStream, mkdirSync } from 'fs';
import https from 'https';

export const listFilesInDir = (dir: string, ext?: string[]): string[] => {
  const files: string[] = [];
  const dirFiles = readdirSync(dir);
  dirFiles.forEach(file => {
    const filePath = `${dir}/${file}`;
    if (statSync(filePath).isFile()) {
      if (!ext) files.push(filePath);
      else {
        const fileExt = file.split('.').pop();
        if (fileExt && ext.includes(fileExt)) files.push(filePath);
      }
    }
  });
  return files;
};

export const downloadFile = async (url: string, filePath: string) =>
  new Promise<void>(resolve => {
    const file = createWriteStream(filePath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
  });

export const mkdirp = (dir: string) => {
  const dirs = dir.split('/');
  let path = '';
  dirs.forEach(dir => {
    path += `${dir}/`;
    if (!statSync(path).isDirectory()) {
      mkdirSync(path);
    }
  });
};
