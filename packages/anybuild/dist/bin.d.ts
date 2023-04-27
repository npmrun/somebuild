declare function getInfo(): {
    jsonFile: string;
    pkgInfo: any;
    buildinfo: any;
    externals: string[];
    globals: Record<string, string>;
    dependencies: any;
    devDependencies: any;
    peerDependencies: any;
};

interface IConfig<T extends any> {
    path: string;
    config: T;
    dependencies: string[];
}
declare function getAnybuildConfig<T>(): IConfig<T>;
declare function getAnybuildConfigAsync(): Promise<any>;

declare function error(message: string, willExit?: 'exit'): void;
declare function upperFirst(word: string): string;
declare const isObject: (obj: any) => boolean;
declare const isString: (obj: any) => boolean;

export { IConfig, error, getAnybuildConfig, getAnybuildConfigAsync, getInfo, isObject, isString, upperFirst };
