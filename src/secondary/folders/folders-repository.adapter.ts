import { IFile, IFolder } from 'src/domain/entities';
import { IFoldersRepository } from 'src/domain/ports';
import { buildItems } from './build-items';
import { IApiFolder, IApiFile, ApiType } from '../contracts';
import { filterItems } from './filter-items';
import { useMemo } from 'react';
import { flatItems } from './flat-items';

const BASE_URL = process.env.REACT_APP_API;

const FILES_URL = `${BASE_URL}/files`;
const FOLDERS_URL = `${BASE_URL}/folders`;

const EMPTY = Symbol('Empty term search');

const headers = {
    'Content-type': 'application/json; charset=UTF-8'
};

const getData = <T>(url: string): Promise<T> => fetch(url).then((response) => response.json());

const updateItem = <T extends IApiFile | IApiFolder>(url: string, item: T): Promise<Response> =>
    fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(item)
    });

const cache = new Map<string | symbol, ReadonlyArray<IFile | IFolder>>();

const foldersRepository: IFoldersRepository = {
    getRoot: async function (term?: string): Promise<ReadonlyArray<IFile | IFolder>> {
        if (cache.size === 0) {
            const [folders, files] = await Promise.all([
                getData<Array<IApiFolder>>(`${FOLDERS_URL}?_sort=order`).then((items) =>
                    items.map((item) => <IApiFolder>{ ...item, type: item.type ?? ApiType.Folder })
                ),
                getData<Array<IApiFile>>(`${FILES_URL}?_sort=order`).then((items) =>
                    items.map((item) => <IApiFile>{ ...item, type: item.type ?? ApiType.File })
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
    },
    update: async function (data: ReadonlyArray<IFile | IFolder>): Promise<void> {
        const [flattedFolders, flattedFiles] = flatItems(data);

        const folderPromises = flattedFolders.map((item) =>
            updateItem(`${FOLDERS_URL}/${item.id}`, item)
        );

        const filePromises = flattedFiles.map((item) =>
            updateItem(`${FILES_URL}/${item.id}`, item)
        );

        await Promise.all([...folderPromises, ...filePromises]);

        // We changed order, that's why we can't use cache anymore
        cache.clear();

        return;
    }
};

export const useFoldersRepository = (): IFoldersRepository => {
    return useMemo(() => foldersRepository, []);
};
