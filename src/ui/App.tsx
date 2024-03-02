import React, { useEffect, useMemo, useState, ChangeEvent, useCallback } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
    FloatButton,
    Layout,
    Input,
    Flex,
    Spin,
    Tree,
    type TreeDataNode,
    TreeProps,
    Alert
} from 'antd';
import { useDebounce } from './hooks';
import { useGetItems } from 'src/secondary';

import './App.scss';
import { loop, toTreeDataNode } from 'src/utils';
import { useUpdateItems } from 'src/secondary/items/update-items.adapter';
import { IFile, IFolder } from 'src/domain/entities';

const { Content, Footer } = Layout;
const { DirectoryTree } = Tree;

enum AppState {
    Loading = 'LOADING',
    Loaded = 'LOADED',
    Error = 'ERROR'
}

function App() {
    const [state, setState] = useState(AppState.Loaded);
    const [items, setItems] = useState<ReadonlyArray<IFile | IFolder>>([]);
    const [term, setTerm] = useState('');

    const setNewTerm = useDebounce((value: string) => {
        setTerm(value);
    });

    const loadItems = useGetItems();
    const updateItems = useUpdateItems();

    useEffect(() => {
        const fetchData = async () => {
            setState(AppState.Loading);

            try {
                const data = await loadItems(term);
                setItems(data);
                setState(AppState.Loaded);
            } catch (error) {
                setState(AppState.Error);
            }
        };

        fetchData();
    }, [term, loadItems]);

    const isLoading = useMemo(() => state === AppState.Loading, [state]);
    const isError = useMemo(() => state === AppState.Error, [state]);

    const treeData = useMemo(() => toTreeDataNode(items), [items]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        setNewTerm(value);
    };

    const handleUpdateItems = useCallback(
        async (items: ReadonlyArray<TreeDataNode>) => {
            setState(AppState.Loading);

            try {
                await updateItems(items);
                const data = await loadItems(term);
                setItems(data);
                setState(AppState.Loaded);
            } catch (e) {
                setState(AppState.Error);
            }
        },
        [term, updateItems, loadItems]
    );

    const handleOnDrop: TreeProps['onDrop'] = useCallback(
        // Note: the UI lib doesn't provide open (exported) types for this cb
        (info: any) => {
            const dropKey = info.node.key;
            const dragKey = info.dragNode.key;
            const dropPos = info.node.pos.split('-');
            const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

            const data = structuredClone(treeData);

            let dragObj: TreeDataNode;

            loop(data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });

            if (!info.dropToGap) {
                loop(data, dropKey, (item) => {
                    item.children = item.children || [];
                    item.children.unshift(dragObj);
                });
            } else {
                let ar: TreeDataNode[] = [];
                let i: number;
                loop(data, dropKey, (_item, index, arr) => {
                    ar = arr;
                    i = index;
                });
                if (dropPosition === -1) {
                    ar.splice(i!, 0, dragObj!);
                } else {
                    ar.splice(i! + 1, 0, dragObj!);
                }
            }

            handleUpdateItems(data);
        },
        [treeData, handleUpdateItems]
    );

    return (
        <Layout className="layout">
            <Content className="layout__content">
                <Input
                    size="large"
                    allowClear
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
                    onChange={handleSearchChange}
                    data-testid="input"
                />
                {isError && <Alert message="Something went wrong!" type="error" />}
                <Spin size="large" spinning={isLoading} wrapperClassName="layout__content__loader">
                    <DirectoryTree
                        showLine
                        draggable
                        className="layout__content__tree"
                        onDrop={handleOnDrop}
                        treeData={treeData}
                    />
                </Spin>
            </Content>

            <FloatButton.BackTop />

            <Footer style={{ textAlign: 'center' }}>
                File System ©2024 Created by Diana Murdasova
            </Footer>
        </Layout>
    );
}

export default App;
