import { File, IFile } from './File';

describe('File class', () => {
    test('should create a file instance', () => {
        const id = 1;
        const title = 'Test File';
        const file: IFile = new File(id, title);

        expect(file).toBeInstanceOf(File);
        expect(file.id).toBe(id);
        expect(file.title).toBe(title);
    });

    test('should correctly identify as a file', () => {
        const id = 1;
        const title = 'Test File';
        const file: IFile = new File(id, title);

        expect(file.isFile).toBe(true);
    });
});
