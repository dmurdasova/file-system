import { IFile, IFolder } from 'src/domain/entities';
import { IApiFile } from './ApiFile';
import { IApiFolder } from './ApiFolder';
import { ApiType } from './ApiType';

export const isApiFile = (value: IApiFile | IApiFolder): value is IApiFile => {
    return value.type === ApiType.File;
};

export const isFile = (value: IFile | IFolder): value is IFile => {
    return value.isFile;
};

export const isFolder = (value: IFile | IFolder): value is IFolder => {
    return !value.isFile;
};
