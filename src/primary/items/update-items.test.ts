import { IFoldersRepository, INotificationService } from 'src/domain/ports';
import { IFile, IFolder } from 'src/domain/entities';
import { createFile, createFolder } from 'src/utils';
import { updateItemsUseCase } from './update-items';

describe('Update items UseCase', () => {
    let foldersRepository: IFoldersRepository;
    let notificationService: INotificationService;

    const mocks = [
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

    beforeAll(() => {
        foldersRepository = {
            getRoot(_term?: string): Promise<ReadonlyArray<IFolder | IFile>> {
                return Promise.resolve([]);
            },
            update(_data: ReadonlyArray<IFolder | IFile>) {
                return Promise.resolve();
            }
        };

        notificationService = {
            notify(): void {
                return;
            }
        };
    });

    test('should return the array of data', async () => {
        const service = jest.spyOn(foldersRepository, 'update');
        await updateItemsUseCase(mocks, { foldersRepository, notificationService });
        expect(service).toHaveBeenCalledWith(mocks);
    });
});
