import { IFile } from '../file';
import { Folder, IFolder } from './Folder';

describe('Folder class', () => {
    test('should create a folder instance', () => {
        const id = 1;
        const title = 'Test Folder';
        const folder: IFolder = new Folder(id, title);

        expect(folder).toBeInstanceOf(Folder);
        expect(folder.id).toBe(id);
        expect(folder.title).toBe(title);
        expect(folder.children).toEqual([]);
    });

    test('should add child to folder', () => {
        const folder: IFolder = new Folder(1, 'Parent Folder');
        const childFile: IFile = { id: 2, title: 'Child File', isFile: true };
        const childFolder: IFolder = new Folder(3, 'Child Folder');

        folder.add(childFile);
        folder.add(childFolder);

        expect(folder.children).toEqual([childFile, childFolder]);
    });

    test('should correctly identify as not a file', () => {
        const folder: IFolder = new Folder(1, 'Test Folder');

        expect(folder.isFile).toBe(false);
    });
});
