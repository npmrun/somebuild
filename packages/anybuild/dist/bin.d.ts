declare const jsonFile: string;
declare const pkgInfo: any;
declare const buildinfo: IBuildInfo;

declare const rootDir: string;
declare const htmlDir: string;
declare const cwdDir: string;
declare const dependencies: any;
declare const devDependencies: any;
declare const peerDependencies: any;
declare const externals: string[];
declare let globals: Record<string, string>;

declare function error(message: string, willExit?: 'exit'): void;
declare function upperFirst(word: string): string;
declare const isObject: (obj: any) => boolean;
declare const isString: (obj: any) => boolean;

export { buildinfo, cwdDir, dependencies, devDependencies, error, externals, globals, htmlDir, isObject, isString, jsonFile, peerDependencies, pkgInfo, rootDir, upperFirst };
