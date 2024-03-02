import { ApiType } from './ApiType';

export interface IApiFile {
    id: string;
    name: string;
    order?: string;
    type: ApiType.File;
}
