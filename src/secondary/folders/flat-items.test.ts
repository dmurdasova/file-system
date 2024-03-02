import { IFile, IFolder } from 'src/domain/entities';
import { createFile, createFolder } from 'src/utils';
import { flatItems } from './flat-items';

describe('flatItems function', () => {
    test('should flatten items into API folders and files', () => {
        const mockData: Array<IFile | IFolder> = [
            createFile(1, 'Resume.docx'),
            createFile(2, 'ProjectReport.pdf'),
            createFolder(3, 'Personal', [
                createFile(4, 'FamilyPhoto.jpg'),
                createFile(5, 'MeetingMinutes.txt'),
                createFolder(6, 'Vacation', [
                    createFile(7, 'TravelGuide.pdf'),
                    createFile(8, 'HolidayPhotos.zip')
                ])
            ]),
            createFolder(9, 'Work', [
                createFile(10, 'CodeSnippet.js'),
                createFile(11, 'Budget.xlsx'),
                createFolder(12, 'Projects', [
                    createFile(13, 'ProjectA.docx'),
                    createFile(14, 'ProjectB.pptx')
                ])
            ])
        ];

        const [flattedFolders, flattedFiles] = flatItems(mockData);

        expect(flattedFolders).toHaveLength(4);
        expect(flattedFiles).toHaveLength(10);

        expect(flattedFolders[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                type: 'folder',
                files: expect.any(Array),
                folders: expect.any(Array),
                order: expect.any(String)
            })
        );
        expect(flattedFiles[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                type: 'file',
                order: expect.any(String)
            })
        );
    });
});
