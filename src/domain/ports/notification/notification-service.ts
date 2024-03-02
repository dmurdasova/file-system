export interface INotificationService {
    notify(message: string, type: 'info' | 'error' | 'success'): void;
}
