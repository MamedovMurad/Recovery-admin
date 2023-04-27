import { EditOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';
import { Col, Form, Image, InputRef, List, message, Modal, Row, Typography, Upload } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import agent, { baseImageUrl } from '../../App/Api';
import { NewsType } from '../../App/Model/types';

import type { FormInstance } from 'antd/es/form';
import ServiceAddEdit from '../../containers/ServiceAddEdit';


type DataIndex = keyof NewsType;



const Service: React.FC = () => {
    const [form] = Form.useForm();
    const formRef = React.createRef<FormInstance>();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [sliders, setsliders] = useState<(NewsType&{icon:string})[]>([])
    const [open, setOpen] = useState(false);


    const [slider, setslider] = useState<NewsType&{icon:string} | null>(null)


    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<NewsType&{icon:string}> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    function updateSlider(item: NewsType&{icon:string}) {
        setOpen(true);
        setslider(item)
    }
    const columns: ColumnsType<NewsType&{icon:string}> = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: '30%',
            ...getColumnSearchProps('image'),
            render: (_: any, record: NewsType&{icon:string}) => <Image
                width={90}
                src={baseImageUrl + record.image}
            />

        },
        {
            title: 'Title',
            dataIndex: 'title_az',
            key: 'title',
            ...getColumnSearchProps('title_az'),
            sorter: (a, b) => a.title_az.length - b.title_az.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: NewsType&{icon:string}) => {
                return (
                    <>
                        <Space size={'middle'}>
                            <Button loading={false} type="dashed" onClick={() => updateSlider(record)}     >   Edit </Button>
                            <Button loading={false} type="dashed" danger onClick={() => showDeleteConfirm(record.id)} >   Delete </Button>
                        </Space>
                    </>
                )
            }
        }
    ];

    async function fethcSlider() {
        const res = await agent.service.list()
        !res.error && setsliders(res.data)
        handleOk()

    }

    async function deleteNews(id: number) {
      
            const res = await agent.service.delete(id) 
            res.data && message.success('service was deleted')
            fethcSlider()
        
      
    }

    const showDeleteConfirm = (id: number) => {

        Modal.confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            /* content: 'Some descriptions', */
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteNews(id)
            },
            onCancel() {
                /*  setDelId(null) */
            },
        });
    };

    const showModal = () => {
        setslider(null)
        setOpen(true);
    };

    const handleOk = () => {


        setOpen(false);


    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
      
        setslider(null)
    };
 
    async function onFinish(params: any) {
        const res = await agent.newsCategory.add(params)
        if (res.data) {
            message.success('Category of news was added')
      
            formRef.current!.resetFields();
        handleOk()
        }
    }

 
    useEffect(() => {
        fethcSlider()

    
    }, [])
    return <>

        <Row>
            <Col span={6}> 
{/*              <Button onClick={() => { showModal(); setcategory(true) }} type="primary" block style={{ marginBottom: '20px' }} >Add News category</Button>
 */}             </Col>
            <Col span={12}>
            </Col>
            <Col span={6}>

                <Button onClick={showModal} type="primary" block style={{ marginBottom: '20px' }} >Add</Button>


            </Col>
        </Row>

        <Table columns={columns} dataSource={sliders} />

        <Modal
            width={'40%'}
            title={"Service"+ (slider?' edit':' add')}
            open={open}
            onOk={handleOk}

            onCancel={handleCancel}
            footer={ [
                <>
                    <Button onClick={handleCancel} >Cancel</Button>
                    <Button type="primary"  form='AddNews' htmlType='submit' >Ok</Button></>


            ] }
        >
            <ServiceAddEdit news={slider || undefined} callback={fethcSlider}  />
            
        </Modal>


    </>

        ;
};

export default Service;