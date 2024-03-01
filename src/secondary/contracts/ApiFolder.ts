export interface IApiFolder {
    id: string;
    title: string;
    type: 'folder';
    files: ReadonlyArray<string>;
    folders: ReadonlyArray<string>;
}
