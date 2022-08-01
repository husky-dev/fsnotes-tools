import { config } from '@config';
import { downloadFile, isStr, listFilesInDir, log, mkdirp, regexAll, strToHash } from '@utils';
import { program } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';

program
  .name('fsnotes-cli')
  .description(config.description)
  .version(config.versioin, '-v, --version', 'output the current version')
  .option('--debug', 'output extra debugging');

program
  .command('md-img-dowload')
  .description('download images from markdown file')
  .option('-p, --path <path>', 'provide path to folder with markdown files')
  .action(async (opts: Record<string, string | number | boolean>) => {
    const dir = isStr(opts.path) ? opts.path : __dirname;
    log.info('listing files in dir:', dir);
    const files = listFilesInDir(dir, ['md']);
    log.info(`found ${files.length} files`);
    for (const file of files) {
      await dowloadMediaForMdFile(file);
    }
  });

const dowloadMediaForMdFile = async (mdFile: string) => {
  log.info('processing file', { mdFile });
  const dirPath = dirname(mdFile);
  const imgDirPath = `${dirPath}/i`;
  mkdirp(imgDirPath);
  let content = readFileSync(mdFile, 'utf8');
  const regex = /!\[(.+?)\]\((.+?)\)/g;
  const matches = regexAll(content, regex);
  if (!matches.length) return;
  for (const match of matches) {
    const [original, alt, url] = match;
    if (url.indexOf('https') !== 0) continue;
    const fileExt = url.split('.').pop();
    if (!fileExt) {
      log.info('no file extention found', { url });
      continue;
    }
    if (!['jpg', 'jpeg', 'mp4', 'mov'].includes(fileExt)) {
      log.info('file extension not in allowed list', { url, fileExt });
      continue;
    }
    const fileName = strToHash(url);
    const filePath = `${imgDirPath}/${fileName}.${fileExt}`;
    log.debug(`downloading file`, { url, filePath });
    await downloadFile(url, filePath);
    log.debug(`downloading file done`, { url, filePath });
    content = content.replace(original, `![${alt}](i/${fileName}.${fileExt})`);
  }
  log.info('processing file done', { mdFile });
  writeFileSync(mdFile, content, 'utf8');
};

program.parse(process.argv);
