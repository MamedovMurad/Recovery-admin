import { EditOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Image, InputRef, List, message, Modal, Row, Typography, Upload } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import agent, { baseImageUrl } from '../../App/Api';
import { NewsType } from '../../App/Model/types';
import NewsAddEdit from '../../containers/NewsAddEdit';
import type { FormInstance } from 'antd/es/form';



type DataIndex = keyof NewsType;



const News: React.FC = () => {
    const [form] = Form.useForm();
    const formRef = React.createRef<FormInstance>();
    const [searchText, setSearchText] = useState('');
   
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [sliders, setsliders] = useState<NewsType[]>([])
    const [open, setOpen] = useState(false);
    const [category, setcategory] = useState(false);
    const [categoryNews, setcategoryNews] = useState<{ title_az: string,title_ru: string,title_en: string, id: number }[] | null>(null)
    const [slider, setslider] = useState<NewsType | null>(null)



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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<NewsType> => ({
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


    function updateSlider(item: NewsType) {
        setOpen(true);
        setslider(item)
    }
    const columns: ColumnsType<NewsType> = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: '30%',
            ...getColumnSearchProps('image'),
            render: (_: any, record: NewsType) => <Image
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
            render: (_: any, record: NewsType) => {
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
        const res = await agent.news.list()
        !res.error && setsliders(res.data)
        handleOk()
    }

    async function deleteNews(id: number, cat?:boolean) {
        if (cat) {
            const res =  await agent.newsCategory.delete(id)
            res.data && message.success('news category was deleted')
            fethcNewsCategories()
        }else{
            const res = await agent.news.delete(id) 
            res.data && message.success('news was deleted')
            fethcSlider()
        }
      
    }

    const showDeleteConfirm = (id: number, cat?:boolean) => {

        Modal.confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            /* content: 'Some descriptions', */
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteNews(id, cat)
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
        setcategory(false)
        setslider(null)
    };
    async function fethcNewsCategories() {
        const res = await agent.newsCategory.list()
        !res.error && setcategoryNews(res.data)
    }
    async function onFinish(params: any) {
        const res = await agent.newsCategory.add(params)
        if (res.data) {
            message.success('Category of news was added')
            fethcNewsCategories()
            formRef.current!.resetFields();
        }
    }

    useEffect(() => {
        fethcSlider()
        fethcNewsCategories()
      
    }, [])
    return <>


        <Row>
            <Col span={6}>  <Button onClick={() => { showModal(); setcategory(true) }} type="primary" block style={{ marginBottom: '20px' }} >Add News category</Button></Col>
            <Col span={12}>
            </Col>
            <Col span={6}>

                <Button onClick={showModal} type="primary" block style={{ marginBottom: '20px' }} >Add</Button>


            </Col>
        </Row>

        <Table columns={columns} dataSource={sliders} />

        <Modal
            width={'60%' }
            title={"News"+(slider?' Edit':' Add')}
            open={open}
            onOk={handleOk}

            onCancel={handleCancel}
            footer={!category ? [
                <>
                    <Button onClick={handleCancel} >Cancel</Button>
                    <Button type="primary"  form='AddNews' htmlType='submit' >Ok</Button></>


            ] : null}
        >
            {
                category ?
                    <>
                        <Form
                            id="AddNewsCategory"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            /*    onFinishFailed={onFinishFailed} */
                            form={form}
                            ref={formRef}
                        >

                            <Row>
                                <Col span={18}>
                                    <Form.Item label="Title:az" name='title:az'>
                                        <Input placeholder="input placeholder" />
                                    </Form.Item>
                                    <Form.Item label="Title:en" name='title:en'>
                                        <Input placeholder="input placeholder" />
                                    </Form.Item>
                                    <Form.Item label="Title:ru" name='title:ru'>
                                        <Input placeholder="input placeholder" />
                                    </Form.Item>

                                </Col>
                                <Col span={2}>
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" htmlType='submit' block >Add</Button>
                                </Col>
                            </Row>
                        </Form>
                        <List
                        
                            bordered
                            dataSource={categoryNews || []}
                            renderItem={item => (

                                <List.Item>
                                    <Row style={{ width: '100%' }}>  <Col span={20}>
                                        {item.title_az}
                                    </Col>
                                        <Col span={4}>
                                        <Button  loading={false} type="dashed" danger  onClick={()=>showDeleteConfirm(item.id, true)} >   Delete </Button>
                                        </Col>
                                    </Row>
                                </List.Item>

                            )}
                        />
                    </>
                    : <NewsAddEdit news={slider || undefined} callback={fethcSlider} categoryNews={categoryNews} />
            }
        </Modal>


    </>

        ;
};

export default News;