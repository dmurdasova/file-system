import { IFolder, IFile } from 'src/domain/entities';

export interface IFoldersRepository {
    getRoot(term?: string): Promise<ReadonlyArray<IFolder | IFile>>;
    update(data: ReadonlyArray<IFolder | IFile>): Promise<void>;
}
