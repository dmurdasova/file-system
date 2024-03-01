import { File, IFile } from './File';

describe('File class', () => {
    test('should create a file instance', () => {
        const fileId = 1;
        const fileTitle = 'Test File';
        const file: IFile = new File(fileId, fileTitle);

        expect(file).toBeInstanceOf(File);
        expect(file.id).toBe(fileId);
        expect(file.title).toBe(fileTitle);
    });

    test('should correctly identify as a file', () => {
        const fileId = 1;
        const fileTitle = 'Test File';
        const file: IFile = new File(fileId, fileTitle);

        expect(file.isFile()).toBe(true);
    });
});
