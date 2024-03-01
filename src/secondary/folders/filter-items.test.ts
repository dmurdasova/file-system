import { IFile, IFolder } from 'src/domain/entities';
import { filterItems } from './filter-items';
import { createFile, createFolder } from 'src/utils';

describe('filterItems function', () => {
    const createMockData = (): Array<IFile | IFolder> => [
        createFile(1, 'Resume.docx'),
        createFile(2, 'ProjectReport.pdf'),
        createFolder(3, 'Personal', [
            createFile(4, 'FamilyPhoto.jpg'),
            createFile(5, 'MeetingMinutes.txt')
        ]),
        createFolder(6, 'Work', [createFile(7, 'CodeSnippet.js'), createFile(8, 'Budget.xlsx')])
    ];

    test('should filter items by title', () => {
        const term = 'project';
        const items = createMockData();
        const filteredItems = filterItems(items, term);

        expect(filteredItems).toHaveLength(1);
        expect(filteredItems[0].title.toLowerCase()).toContain(term.toLowerCase());
    });

    test('should filter items in nested folders', () => {
        const term = 'family';
        const items = createMockData();
        const filteredItems = filterItems(items, term);

        expect(filteredItems).toHaveLength(1);
        expect(filteredItems[0].title.toLowerCase()).toContain(term.toLowerCase());
    });

    test('should return empty array if no matching items', () => {
        const term = 'nonexistent';
        const items = createMockData();
        const filteredItems = filterItems(items, term);

        expect(filteredItems).toHaveLength(0);
    });
});
