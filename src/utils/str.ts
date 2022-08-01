import { isBool, isErr, isNull, isNum, isStr, isUndef } from './types';
import { createHash } from 'crypto';

export const pad = (val: number, length: number): string => {
  let str: string = `${val}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

export const errToStr = (val: unknown): string => {
  if (isErr(val)) {
    return val.message;
  }
  if (isStr(val) || isNum(val)) {
    return `${val}`;
  }
  if (isBool(val)) {
    return val ? 'true' : 'false';
  }
  if (isNull(val) || isUndef(val)) {
    return '';
  }
  return '';
};

export const upperFirst = (val: string): string => val[0].toUpperCase() + val.slice(1);

export const regexAll = (val: string, regex: RegExp): RegExpExecArray[] => {
  const matches: RegExpExecArray[] = [];
  let match;
  while ((match = regex.exec(val))) {
    matches.push(match);
  }
  return matches;
};

export const strToHash = (val: string): string => {
  const hashObj = createHash('sha256');
  return hashObj.update(val).digest('hex').slice(0, 10);
};
