export const DEFAULT_ERROR = 'Something went wrong. Please try again later';

export type HasMessage = { message: string };

export const hasMessage = (value: unknown): value is HasMessage => {
    return !!value && typeof value === 'object' && !!(value as HasMessage).message;
};
