import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';

import { Col, Image, InputRef, message, Modal, Row } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import agent, { baseImageUrl } from '../../App/Api';
import { ProgressType } from '../../App/Model/types';

import ProgressAddEdit from '../../containers/progressAddEdit';



type DataIndex = keyof ProgressType;



const Progress: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [progresses, setProgresses] = useState<ProgressType[]>([])
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressType | null>(null)

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ProgressType> => ({
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


  function updateSlider(item: ProgressType) {
    setOpen(true);
    setProgress(item)
  }

  const columns: ColumnsType<ProgressType> = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '30%',
      ...getColumnSearchProps('icon'),
      render: (_: any, record: ProgressType) => <Image
        width={90}
        src={baseImageUrl + record.icon}
      />

    },
    {
      title: 'Title',
      dataIndex: 'title_az',
      key: 'title_az',
      ...getColumnSearchProps('title_az'),
      sorter: (a, b) => a.title_az.length - b.title_az.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: ProgressType) => {
        return (
          <>
            <Space size={'middle'}>
              <Button loading={false} type="dashed" onClick={() => updateSlider(record)} form='AddSLider'>   Edit </Button>
              <Button loading={false} type="dashed" danger onClick={() => showDeleteConfirm(record.id)} >   Delete </Button>
            </Space>
          </>
        )
      }
    }
  ];

  async function fethcProgress() {
    const res = await agent.progress.list()
    !res.error && setProgresses(res.data)
    handleOk()
  }

  async function deleteProgress(id: number) {
    const res = await agent.progress.delete(id)
    res.data && message.success('progress was deleted')
    fethcProgress()
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
        deleteProgress(id)
      },
      onCancel() {
        /*  setDelId(null) */
      },
    });
  };

  const showModal = () => {
    setProgress(null)
    setOpen(true);
  };

  const handleOk = () => {


    setOpen(false);


  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setProgress(null)
  };

  useEffect(() => {
    fethcProgress()
  }, [])

  return <>
    <Row>
      <Col span={18}>    </Col>
      <Col span={6}>

        <Button onClick={showModal} type="primary" block style={{ marginBottom: '20px' }} >Add</Button>


      </Col>
    </Row>

    <Table columns={columns} dataSource={progresses} />
    <Modal
      width={700}
      title="Slider Add"
      open={open}
      onOk={handleOk}

      onCancel={handleCancel}
      footer={[
        <>
          <Button onClick={handleCancel} >Cancel</Button>
          <Button type="primary" form='AddProgress' htmlType='submit' >Ok</Button></>


      ]}
    >
      <ProgressAddEdit progress={progress || undefined} callback={fethcProgress} />
    </Modal>
  </>

    ;
};

export default Progress;