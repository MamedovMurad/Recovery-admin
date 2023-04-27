import { Button, Col, Form, Input, message, Row, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { NewsType, PriceType } from "../../App/Model/types";
import type { FormInstance } from "antd/es/form";
import TextArea from "antd/lib/input/TextArea";
type SliderAddProps = {
  slider?: PriceType;
  callback: any;
};

const PriceAddEdit: React.FC<SliderAddProps> = ({ slider, callback }) => {
  const [services, setservices] = useState<NewsType[]>([])
  const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();
  const beforeUpload = (file: RcFile) => {
    return false;
  };
async function fetchServices() {
  const res = await agent.service.list()
  setservices(res.data)
}
  const onFinish = async (values: any) => {
    console.log(values, "values");

    const formdata = new FormData();
  
  
    formdata.append("title:az", values['title:az']);
    formdata.append("title:ru", values['title:ru']);
    formdata.append("title:en", values['title:en']);
    formdata.append("service_id", values['service_id']);
    formdata.append("price", values['price']);

    if (slider) {
      const res = await agent.price.update(formdata, slider?.id);
      res.data && message.success("slider was updated");
      callback();
    } else {
      const res = await agent.price.add(formdata);
      res.data && message.success("slider was added");
      callback();
    }

    formRef.current!.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {};

  useLayoutEffect(() => {
    formRef.current!.resetFields();
    form.setFieldsValue({
      ['title:az']: slider?.title_az,
      ['title:en']: slider?.title_en,
      ['title:ru']: slider?.title_ru,
      ['service_id']: slider?.service_id,
      ['price']: slider?.price,

    });
  }, [slider]);

  useEffect(() => {
    fetchServices()
  }, [])
  
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
      <Form.Item label="Price" name="price" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Service" name="service_id" rules={[{ required: true }]}>
      <Select
          showSearch
          placeholder="Select a service"
          optionFilterProp="children"
         
          onChange={(value: string) => form.setFieldsValue({ category_id: value })}

          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {
            services?.map(item => (
              <Select.Option value={item.id} >{item.title_az}</Select.Option>
            ))
          }


        </Select>
      </Form.Item>
 
    
    </Form>
  );
};

export default PriceAddEdit;
