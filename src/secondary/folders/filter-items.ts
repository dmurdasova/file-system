import { IFile, IFolder } from 'src/domain/entities';
import { isFile, isFolder } from '../contracts';

export const filterItems = (
    items: ReadonlyArray<IFile | IFolder>,
    term: string
): ReadonlyArray<IFile | IFolder> => {
    const regExp = new RegExp(term, 'i');

    const searchInFolder = (current: IFolder): Array<IFile | IFolder> => {
        if (regExp.test(current.title)) {
            return [current];
        }

        const result = [];

        for (const child of current.children) {
            if (isFile(child) && regExp.test(child.title)) {
                result.push(child);
            } else if (isFolder(child)) {
                const CHILD = searchInFolder(child);
                result.push(...CHILD);
            }
        }

        return result;
    };

    const result = items.reduce((acc: Array<IFile | IFolder>, item: IFile | IFolder) => {
        if (isFile(item) && regExp.test(item.title)) {
            acc.push(item);
        } else if (isFolder(item)) {
            const items = searchInFolder(item);
            acc.push(...items);
        }

        return acc;
    }, []);

    return result;
};
