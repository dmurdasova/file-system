import { IFile, IFolder } from 'src/domain/entities';
import { IFoldersRepository, INotificationService } from '../../domain/ports';
import { DEFAULT_ERROR, hasMessage } from '../shared';

type Deps = {
    foldersRepository: IFoldersRepository;
    notificationService: INotificationService;
};

export async function getItemsUseCase(
    term = '',
    deps: Deps
): Promise<ReadonlyArray<IFolder | IFile>> {
    const { foldersRepository, notificationService } = deps;
    try {
        return foldersRepository.getRoot(term);
    } catch (e) {
        const message = hasMessage(e) ? e.message : DEFAULT_ERROR;
        notificationService.notify(message, 'error');
        return [];
    }
}
