import { ApiType } from './ApiType';

export interface IApiFolder {
    id: string;
    title: string;
    type: ApiType.Folder;
    order?: string;
    files: ReadonlyArray<string>;
    folders: ReadonlyArray<string>;
}
