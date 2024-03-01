import { IFile, IFolder } from 'src/domain/entities';

export const createFile = (id: number, title: string): IFile => ({
    id,
    title,
    isFile: () => true
});

export const createFolder = (
    id: number,
    title: string,
    children: Array<IFile | IFolder> = []
): IFolder => ({
    id,
    title,
    isFile: () => false,
    children,
    add: (child) => children.push(child)
});
