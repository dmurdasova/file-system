import { notification } from 'antd';
import { INotificationService } from '../../domain/ports';

const service: INotificationService = {
    notify: (message: string, type: 'info' | 'error' = 'info') => {
        notification.open({ message, type });
    }
};

export function useNotificationService(): INotificationService {
    return service;
}
