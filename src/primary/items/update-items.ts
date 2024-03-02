import { IFile, IFolder } from 'src/domain/entities';
import { IFoldersRepository, INotificationService } from '../../domain/ports';
import { DEFAULT_ERROR, hasMessage } from '../shared';

type Deps = {
    foldersRepository: IFoldersRepository;
    notificationService: INotificationService;
};

export async function updateItemsUseCase(
    data: ReadonlyArray<IFolder | IFile>,
    deps: Deps
): Promise<void> {
    const { foldersRepository, notificationService } = deps;
    try {
        await foldersRepository.update(data);
        notificationService.notify('Saved!', 'success');
        return;
    } catch (e) {
        const message = hasMessage(e) ? e.message : DEFAULT_ERROR;
        notificationService.notify(message, 'error');
        return;
    }
}
