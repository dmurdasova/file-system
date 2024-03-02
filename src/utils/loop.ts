import { TreeDataNode } from 'antd';

export const loop = (
    data: TreeDataNode[],
    key: React.Key,
    callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
            return callback(data[i], i, data);
        }
        if (data[i].children) {
            loop(data[i].children!, key, callback);
        }
    }
};
