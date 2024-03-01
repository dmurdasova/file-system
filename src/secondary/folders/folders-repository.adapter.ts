import { IFile, IFolder } from 'src/domain/entities';
import { IFoldersRepository } from 'src/domain/ports';
import { buildItems } from './build-items';
import { IApiFolder, IApiFile } from '../contracts';
import { filterItems } from './filter-items';
import { useMemo } from 'react';

const BASE_URL = process.env.REACT_APP_API;

const FILES_URL = `${BASE_URL}/files`;
const FOLDERS_URL = `${BASE_URL}/folders`;

const EMPTY = Symbol('Empty term search');

const getData = <T>(url: string): Promise<T> => fetch(url).then((response) => response.json());

const cache = new Map<string | symbol, ReadonlyArray<IFile | IFolder>>();

const foldersRepository: IFoldersRepository = {
    getRoot: async function (term?: string): Promise<ReadonlyArray<IFile | IFolder>> {
        if (cache.size === 0) {
            const [folders, files] = await Promise.all([
                getData<Array<IApiFolder>>(FOLDERS_URL).then((items) =>
                    items.map((item) => <IApiFolder>{ ...item, type: 'folder' })
                ),
                getData<Array<IApiFile>>(FILES_URL).then((items) =>
                    items.map((item) => <IApiFile>{ ...item, type: 'file' })
                )
            ]);

            const items = buildItems(folders, files);
            cache.set(EMPTY, items);
        }

        const nonFiltered = cache.get(EMPTY)!;

        if (!term) {
            return nonFiltered;
        }

        if (!cache.has(term)) {
            const filtered = filterItems(nonFiltered, term);
            cache.set(term, filtered);
        }

        return cache.get(term)!;
    }
};

export const useFoldersRepository = (): IFoldersRepository => {
    return useMemo(() => foldersRepository, []);
};
