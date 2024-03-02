import { useNotificationService } from '../notification/notification-service.adapter';
import { useFoldersRepository } from '../folders';
import { useCallback, useMemo } from 'react';
import { updateItemsUseCase } from 'src/primary/items/update-items';
import { TreeDataNode } from 'antd';
import { fromTreeDataNode } from 'src/utils';

export function useUpdateItems(): (items: ReadonlyArray<TreeDataNode>) => Promise<void> {
    const foldersRepository = useFoldersRepository();
    const notificationService = useNotificationService();

    const deps = useMemo(
        () => ({ foldersRepository, notificationService }),
        [foldersRepository, notificationService]
    );

    const callback = useCallback(
        async (items: ReadonlyArray<TreeDataNode>) => {
            // Let's emulate here waiting for backend
            await new Promise((res) => {
                setTimeout(() => {
                    res(null);
                }, 1000);
            });

            const mapped = fromTreeDataNode(items);
            await updateItemsUseCase(mapped, deps);
        },
        [deps]
    );

    return callback;
}
