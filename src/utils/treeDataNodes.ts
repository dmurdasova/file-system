import { TreeDataNode } from 'antd';
import { IFile, IFolder } from 'src/domain/entities';
import { ApiType, isFolder } from 'src/secondary/contracts';

export const toTreeDataNode = (from: ReadonlyArray<IFolder | IFile>): Array<TreeDataNode> => {
    return from.map((item) => {
        const isLeaf = item.isFile;

        if (isFolder(item)) {
            const children = toTreeDataNode(item.children);
            return {
                title: item.title,
                key: `${ApiType.Folder}-${item.id}`,
                selectable: false,
                children,
                isLeaf
            };
        }

        return {
            isLeaf,
            title: item.title,
            selectable: false,
            key: `${ApiType.File}-${item.id}`
        };
    });
};

export const fromTreeDataNode = (
    from: ReadonlyArray<TreeDataNode>
): ReadonlyArray<IFolder | IFile> => {
    return from.map((item) => {
        const key = item.key?.toString() ?? '';
        const [type, stringifiedId] = key.split('-');

        const id = stringifiedId ? +stringifiedId : 0;

        if (item.isLeaf || type === ApiType.File) {
            return <IFile>{
                id,
                title: item.title?.toString() ?? '',
                isFile: true
            };
        } else {
            const children = fromTreeDataNode(item.children ?? []);

            return {
                id,
                title: item.title?.toString() ?? '',
                children,
                isFile: false
            };
        }
    });
};
