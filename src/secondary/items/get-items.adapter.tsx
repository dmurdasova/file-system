import { useCallback, useMemo } from 'react';
import { IFolder, IFile } from 'src/domain/entities';
import { useNotificationService } from '../notification/notification-service.adapter';
import { getItemsUseCase } from 'src/primary';
import { useFoldersRepository } from '../folders';

export function useGetItems(): (
    term?: string,
    timeout?: number
) => Promise<ReadonlyArray<IFolder | IFile>> {
    const foldersRepository = useFoldersRepository();
    const notificationService = useNotificationService();

    const deps = useMemo(
        () => ({ foldersRepository, notificationService }),
        [foldersRepository, notificationService]
    );

    const callback = useCallback(
        async (term?: string, timeout = 1500) => {
            // Let's emulate here waiting for backend
            await new Promise((res) => {
                setTimeout(() => {
                    res(null);
                }, timeout);
            });

            return await getItemsUseCase(term, deps);
        },
        [deps]
    );

    return callback;
}
