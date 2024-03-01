import { IIdentifiable, ISystemElement } from '../public-api';
import { IFile } from '../file';

export interface IFolder extends IIdentifiable, ISystemElement {
    children: ReadonlyArray<IFolder | IFile>;
    add: (child: IFolder | IFile) => void;
}

export class Folder implements IFolder {
    public readonly id: number;
    public readonly title: string;

    private _children: Array<IFolder | IFile>;

    public get children() {
        return this._children as ReadonlyArray<IFolder | IFile>;
    }

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this._children = [];
    }

    public add(child: IFolder | IFile): void {
        this._children.push(child);
    }

    public isFile() {
        return false;
    }
}
