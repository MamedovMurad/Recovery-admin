import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import {  YoutubeLinkType } from "../../App/Model/types";
import type { FormInstance } from "antd/es/form";
import TextArea from "antd/lib/input/TextArea";


const VIdeoPage: React.FC = () => {
  const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();
const [slider, setslider] = useState<YoutubeLinkType|null>(null)

  const onFinish = async (values: any) => {
    console.log(values, "values");

    const formdata = new FormData();
    formdata.append("title:az", values['title:az']);
    formdata.append("title:ru", values['title:ru']);
    formdata.append("title:en", values['title:en']);
    formdata.append("link", values.link);
   
      const res = await agent.youtubeLink.edit(formdata);
      res.data && message.success("Video was updated");
      fetchVIdeo()
      formRef.current!.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {};
  async function fetchVIdeo() {
    const res =  await agent.youtubeLink.get();
    formRef.current!.resetFields();
    form.setFieldsValue({
      ['title:az']: res.data?.title_az,
      ['title:en']: res.data?.title_en,
      ['title:ru']: res.data?.title_ru,
      ['link']: res.data?.link,
  


    });
    setslider(res.data)
  }

  useEffect(() => {
    fetchVIdeo()
  }, []);
  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      id="AddSLider"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      ref={formRef}
    >
      <Form.Item label="title:az" name="title:az" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="title:en" name="title:en" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="title:ru" name="title:ru" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>

      <Form.Item label="link" name="link" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>


          <div style={{textAlign:'center', marginBottom:'20px'}}>
          <img src={baseImageUrl+ slider?.image} alt=""  width={400}/>
          </div>

          <Button type="primary" htmlType="submit"  block>
        Submit
      </Button>
    </Form>
  );
};

export default VIdeoPage;
