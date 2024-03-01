import React, { useEffect, useMemo, useState, ChangeEvent } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { FloatButton, Layout, Input, Flex, Spin, Tree, type TreeDataNode } from 'antd';
import { useDebounce } from './hooks';
import { useGetItems } from 'src/secondary';

import './App.scss';

const { Content, Footer } = Layout;
const { DirectoryTree } = Tree;

enum AppState {
    Loading = 'LOADING',
    Loaded = 'LOADED',
    Error = 'ERROR'
}

function App() {
    const [state, setState] = useState(AppState.Loaded);
    const [items, setItems] = useState<Array<TreeDataNode>>([]);
    const [term, setTerm] = useState('');

    const setNewTerm = useDebounce((value: string) => {
        setTerm(value);
    });

    const loadItems = useGetItems();

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        setNewTerm(value);
    };

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

                <Flex
                    className="layout__content__data"
                    justify="center"
                    align={isLoading ? 'center' : 'flex-start'}
                    gap="middle">
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <DirectoryTree
                            showLine
                            className="layout__content__tree"
                            treeData={items}
                        />
                    )}
                </Flex>
            </Content>

            <FloatButton.BackTop />

            <Footer style={{ textAlign: 'center' }}>
                File System ©2024 Created by Diana Murdasova
            </Footer>
        </Layout>
    );
}

export default App;
