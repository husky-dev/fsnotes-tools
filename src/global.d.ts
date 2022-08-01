declare module '*.json' {
  const content: string;
  export default content;
}

declare module '*.html' {
  const content: string;
  export default content;
}

declare const VERSION: string;
declare const DESCRIPTION: string;
declare const NAME: string;
