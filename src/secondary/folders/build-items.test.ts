import { Folder } from 'src/domain/entities';
import { IApiFile } from '../contracts/ApiFile';
import { IApiFolder } from '../contracts/ApiFolder';
import { buildItems } from './build-items';
import { ApiType } from '../contracts';
import assert from 'assert';

describe('buildItems function', () => {
    test('should build items from API folders and files', () => {
        const apiFolders: IApiFolder[] = [
            {
                id: '1',
                title: 'Folder1',
                type: ApiType.Folder,
                files: ['1', '3', '4'],
                folders: []
            },
            {
                id: '2',
                title: 'Folder2',
                type: ApiType.Folder,
                files: [],
                folders: []
            }
        ];

        const apiFiles: IApiFile[] = [
            {
                id: '1',
                name: 'File1',
                type: ApiType.File
            },
            {
                id: '3',
                name: 'File3',
                type: ApiType.File
            },
            {
                id: '4',
                name: 'File4',
                type: ApiType.File
            }
        ];

        const items = buildItems(apiFolders, apiFiles);

        expect(items.length).toBe(2);

        expect(items[0]).toBeInstanceOf(Folder);
        expect(items[1]).toBeInstanceOf(Folder);

        assert(items[0] instanceof Folder);
        assert(items[1] instanceof Folder);

        expect(items[0].children.length).toBe(3);
        expect(items[1].children.length).toBe(0);
    });
});
