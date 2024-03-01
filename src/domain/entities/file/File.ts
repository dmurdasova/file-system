import { IIdentifiable, ISystemElement } from '../public-api';

export interface IFile extends IIdentifiable, ISystemElement {}

export class File implements IFile {
    constructor(public readonly id: number, public readonly title: string) {}

    isFile() {
        return true;
    }
}
