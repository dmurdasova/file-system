import { File, Folder, IFolder, IFile } from 'src/domain/entities';
import { IApiFolder, IApiFile, isApiFile } from '../contracts';

export const buildItems = (
    apiFolders: ReadonlyArray<IApiFolder>,
    apiFiles: ReadonlyArray<IApiFile>
): ReadonlyArray<IFolder | IFile> => {
    const nodes = new Map<string, IApiFolder>();

    const files = new Map<string, File>();
    const folders = new Map<string, Folder>();

    for (const apiFile of apiFiles) {
        const file = new File(Number(apiFile.id), apiFile.name);
        files.set(apiFile.id, file);
    }

    for (const apiFolder of apiFolders) {
        const folder = new Folder(Number(apiFolder.id), apiFolder.title);
        folders.set(apiFolder.id, folder);
        nodes.set(apiFolder.id, apiFolder);
    }

    const root = new Folder(0, 'Root');

    const visited = new Set<string>();

    const dfs = (current: IApiFolder | IApiFile, parent: Folder) => {
        if (visited.has(current.id)) {
            return;
        }

        if (!isApiFile(current)) {
            const folder = folders.get(current.id);

            if (folder) {
                current.folders?.forEach((subFolderId) => {
                    const apiFolder = nodes.get(subFolderId);
                    if (apiFolder) {
                        dfs(apiFolder, folder);
                    }
                });

                current.files?.forEach((fileId) => {
                    const file = files.get(fileId);
                    if (file) {
                        folder.add(file);
                        files.delete(fileId);
                    }
                });

                parent.add(folder);
            }
        } else {
            const file = files.get(current.id);

            if (file) {
                parent.add(file);
                files.delete(current.id);
            }
        }

        visited.add(current.id);
    };

    for (const apiFolder of apiFolders) {
        dfs(apiFolder, root);
    }

    for (const file of files.values()) {
        root.add(file);
    }

    return root.children;
};
