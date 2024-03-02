import { IIdentifiable, ISystemElement } from '../public-api';
import { IFile } from '../file';

export interface IFolder extends IIdentifiable, ISystemElement {
    children: ReadonlyArray<IFolder | IFile>;
    add: (child: IFolder | IFile) => void;
}

export class Folder implements IFolder {
    private _children: Array<IFolder | IFile>;

    public get children() {
        return this._children as ReadonlyArray<IFolder | IFile>;
    }

    constructor(public readonly id: number, public readonly title: string) {
        this._children = [];
    }

    public add(child: IFolder | IFile): void {
        this._children.push(child);
    }

    public get isFile() {
        return false;
    }
}
