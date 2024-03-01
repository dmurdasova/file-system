import { useCallback, useMemo } from 'react';
import { type TreeDataNode } from 'antd';
import { IFolder, IFile } from 'src/domain/entities';
import { useNotificationService } from '../notification/notification-service.adapter';
import { getItemsUseCase } from 'src/primary';
import { useFoldersRepository } from '../folders';

const isFolder = (item: IFolder | IFile): item is IFolder => !item.isFile();

const toTreeDataNode = (from: ReadonlyArray<IFolder | IFile>): Array<TreeDataNode> => {
    return from.map((item) => {
        if (isFolder(item)) {
            const children = toTreeDataNode(item.children);
            return {
                title: item.title,
                key: `${item.id}-${item.title}-folder`,
                selectable: false,
                children
            };
        }

        return {
            isLeaf: true,
            title: item.title,
            selectable: false,
            key: `${item.id}-${item.title}-file`
        };
    });
};

export function useGetItems(): (term?: string) => Promise<Array<TreeDataNode>> {
    const foldersRepository = useFoldersRepository();
    const notificationService = useNotificationService();

    const deps = useMemo(
        () => ({ foldersRepository, notificationService }),
        [foldersRepository, notificationService]
    );

    const callback = useCallback(
        async (term?: string) => {
            // Let's emulate here waiting for backend
            await new Promise((res) => {
                setTimeout(() => {
                    res(null);
                }, 1500);
            });

            const items = await getItemsUseCase(term, deps);
            return toTreeDataNode(items);
        },
        [deps]
    );

    return callback;
}
