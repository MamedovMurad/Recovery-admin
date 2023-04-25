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
        const res = await agent.setting.get()
        const res2 =  await agent.contact.get()
        setloading(false)
       if (res.data&&res2.data) {
        form.setFieldsValue({...res.data[0],...res2.data[0]});
       }  
        
               
    }
    async function onFinish(params:SettingsType) {
        const res = await agent.setting.update(params)
        const res2 = await agent.contact.update(params)
        if (res.data&&res2.data) {
            message.success('Settings was updated')
           /*  fetchapi() */
        }
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
    <Form.Item label="Twitter" name="twitter" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Instagram" name="instagram" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Facebook" name="facebook" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Youtube" name="youtube" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Email" name="email" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item label="address" name="address" rules={[{ required: true }]}>
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