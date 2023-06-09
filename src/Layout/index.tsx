import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FormOutlined,
  UserDeleteOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Button, Col, Layout, Menu, Popconfirm, Row, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import 'antd/dist/antd.css'
import './index.css'
import Sliders from '../Page/Slider';
import About from '../Page/About';
import Partner from '../Page/Progress';
import News from '../Page/News';
import Service from '../Page/Service';
import Settings from '../Page/Settings';
import Progress from '../Page/Progress';
import VIdeoPage from '../Page/video';
import PriceList from '../Page/price-list';
import Info from '../Page/info';
const { Header, Sider, Content } = Layout;

const Layouts: React.FC = () => {
  let navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
let router =  useParams()
console.log(router['*'],'hhhh');

useEffect(() => {
  if (!localStorage.getItem('agent')) {
    return navigate('/login')
  }
}, [])

  return (
     <div className='layouts'>
    {
      localStorage.getItem('agent')&&<Layout >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" >
          Recovery
          </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[router['*']?router['*']:'about']}

          items={[
            {
              label:'Bas Sehife',
              key:'homePage',
              icon:<AppstoreOutlined/>,
              children:[

                {
                  key: 'sliders',
                  icon: <FormOutlined />,
                  label: 'Sliderler',
                  onClick:()=>navigate('/sliders'),
                  
                },
           
                {
                  key: 'Xeberler',
                  icon: <FormOutlined />,
                  label: 'Xeberler',
                  onClick:()=>navigate('/news'),
                },
                {
                  key: 'Video',
                  icon: <FormOutlined />,
                  label: 'Video',
                  onClick:()=>navigate('/video'),
                },
                {
                  key: 'Is prosesimiz',
                  icon: <FormOutlined />,
                  label: 'Is prosesimiz',
                  onClick:()=>navigate('/progress'),
                },

              ]
            },
            {
              key: 'Haqqimizda',
              icon: <FormOutlined />,
              label: 'Haqqimizda',
              onClick:()=>navigate('/about'),
            },
   
            {
              key: 'service',
              icon: <FormOutlined />,
              label: 'Xidmetler',
              onClick:()=>navigate('/service'),
            },
            {
              key: 'pricelist',
              icon: <FormOutlined />,
              label: 'Qiymetler',
              onClick:()=>navigate('/price-list'),
            },
            {
              key: 'info',
              icon: <FormOutlined />,
              label: 'Melumatlar',
              onClick:()=>navigate('/info'),
            },
     
            {
              key: 'settings',
              icon: <FormOutlined />,
              label: 'Tenzimlemeler',
              onClick:()=>navigate('/settings'),
            },
           

          
        
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" >
          <Row>
            <Col span={22}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
            </Col>
            <Col span={2}>
                  
          <Popconfirm  placement={'bottomLeft'} title={'are you sure ?'} onConfirm={()=>{localStorage.removeItem('agent'); navigate('/login')}} okText="Yes" cancelText="No">
                <Button  loading={false} type="dashed" danger style={{marginTop:'20px'}} >      <UserDeleteOutlined  /> </Button>
      </Popconfirm>
   
      </Col>
          </Row>
   
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
            <Routes >
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="/sliders" element={<Sliders/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/partners" element={<Partner/>}/>
            <Route path="/news" element={<News/>}/>
            <Route path="/service" element={<Service/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/progress" element={<Progress/>}/>
            <Route path="/video" element={<VIdeoPage/>}/>
            <Route path="/price-list" element={<PriceList/>}/>
            <Route path="/info" element={<Info/>}/>
            </Routes>
        </Content>
      </Layout>
    </Layout>
    }
    </div>
   
  );
};

export default Layouts;