import { IFile, IFolder } from 'src/domain/entities';
import { ApiType, IApiFile, IApiFolder } from '../contracts';

const toApiFile = (from: IFile): IApiFile => ({
    id: from.id.toString(),
    name: from.title,
    type: ApiType.File
});

const toApiFolder = (
    from: IFolder,
    files: ReadonlyArray<number>,
    folders: ReadonlyArray<number>
): IApiFolder => ({
    id: from.id.toString(),
    title: from.title,
    type: ApiType.Folder,
    files: files.map((id) => id.toString()),
    folders: folders.map((id) => id.toString())
});

const ROOT = Symbol('Root elements');

export const flatItems = (
    items: ReadonlyArray<IFolder | IFile>
): [ReadonlyArray<IApiFolder>, ReadonlyArray<IApiFile>] => {
    const folderOrders = new Map<string | symbol, string>();
    const fileOrders = new Map<string | symbol, string>();

    const folders = new Map<string, IApiFolder>();
    const files = new Map<string, IApiFile>();

    const dfs = (parent: IFolder | null, current: IFolder | IFile, order: number) => {
        if (current.isFile) {
            const file = toApiFile(current);

            fileOrders.set(parent?.id?.toString() ?? ROOT, order.toString());
            files.set(file.id, file);
        } else {
            const { children } = current as IFolder;

            const fileIds: Array<number> = [];
            const subFolderIds: Array<number> = [];

            children?.forEach((child, index) => {
                if (child.isFile) {
                    fileIds.push(child.id);
                } else {
                    subFolderIds.push(child.id);
                }

                dfs(current as IFolder, child, index + 1);
            });

            const folder = toApiFolder(current as IFolder, fileIds, subFolderIds);

            folderOrders.set(parent?.id?.toString() ?? ROOT, order.toString());
            folders.set(folder.id, folder);
        }
    };

    items.forEach((item, index) => {
        dfs(null, item, index + 1);
    });

    const flattedFolders: Array<IApiFolder> = [];

    folders.forEach((value, key) => {
        const order = folderOrders.get(key) ?? '1';
        flattedFolders.push({ ...value, order });
    });

    const flattedFiles: Array<IApiFile> = [];

    files.forEach((value, key) => {
        const order = fileOrders.get(key) ?? '1';
        flattedFiles.push({ ...value, order });
    });

    return [flattedFolders, flattedFiles];
};
