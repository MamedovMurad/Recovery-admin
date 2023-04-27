import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';
import { Col, Image, InputRef, message, Modal, Row } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import agent, { baseImageUrl } from '../../App/Api';
import { PriceType } from '../../App/Model/types';
import SliderAddEdit from '../../containers/SliderAdd';
import PriceAddEdit from '../../containers/priceAddEdit';



type DataIndex = keyof PriceType;



const PriceList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [sliders, setsliders] = useState<PriceType[]>([])
  const [open, setOpen] = useState(false);
  const [slider, setslider] = useState<PriceType | null>(null)

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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<PriceType> => ({
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


  function updateSlider(item: PriceType) {
    setOpen(true);
    setslider(item)
  }

  const columns: ColumnsType<any> = [

    {
      title: 'Title',
      dataIndex: 'title_az',
      key: 'title_az',
      ...getColumnSearchProps('title_az'),
      sorter: (a, b) => a.title_az.length - b.title_az.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps('price'),
      sorter: (a, b) => a.title_az.length - b.title_az.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: PriceType) => {
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

  async function fethcSlider() {
    const res = await agent.price.list()
    !res.error && setsliders(res.data)
    handleOk()
  }

  async function deleteSlider(id: number) {
    const res = await agent.price.delete(id)
    res.data && message.success('slider was deleted')
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
        deleteSlider(id)
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

  useEffect(() => {
    fethcSlider()
  }, [])

  return <>
    <Row>
      <Col span={18}>    </Col>
      <Col span={6}>

        <Button onClick={showModal} type="primary" block style={{ marginBottom: '20px' }} >Add</Button>


      </Col>
    </Row>

    <Table columns={columns} dataSource={sliders} />
    <Modal
      width={800}
      title="Slider Add"
      open={open}
      onOk={handleOk}

      onCancel={handleCancel}
      footer={[
        <>
          <Button onClick={handleCancel} >Cancel</Button>
          <Button type="primary" form='AddSLider' htmlType='submit' >Ok</Button></>


      ]}
    >
      <PriceAddEdit slider={slider || undefined} callback={fethcSlider} />
    </Modal>
  </>

    ;
};

export default PriceList;