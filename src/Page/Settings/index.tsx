import { EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { SettingsType } from "../../App/Model/types";

type SettingsProps = {}
 
const Settings:React.FC<SettingsProps> = () => {
    const [loading, setloading] = useState(false)

    const [form] = Form.useForm();

    async function fetchapi() {
        setloading(true)
       
        const res2 =  await agent.contact.get()
        setloading(false)
    
        form.setFieldsValue(res2.data);
       
        
               
    }
    async function onFinish(params:SettingsType) {
       
        const res2 = await agent.contact.update(params)
       
            message.success('Settings was updated')
           /*  fetchapi() */
        
    }


    useEffect(() => {
        fetchapi()
   
    }, [])
    
    return (
  <>

<div>
    <Form
    onFinish={onFinish}
    name="wrap"
    labelCol={{ flex: '110px' }}
    labelAlign="left"
    labelWrap
    wrapperCol={{ flex: 1 }}
    colon={false}
    form={form}
  >
  

    <Form.Item label="Instagram" name="instagram" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Facebook" name="facebook" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
 
    <Form.Item label="Email" name="mail" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Phone_1" name="phone_1" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Phone_2" name="phone_2" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    
    <Form.Item label="address:Az" name="addressaz" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="address:En" name="addressen" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="address:Ru" name="addressru" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label=" ">
      <Button type="primary" htmlType="submit" loading={loading} block>
        Submit
      </Button>
    </Form.Item>
  </Form>
        </div>
  </>

    );
}
 
 
export default Settings;