import { Button, Form, Input, message, Select, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { NewsType } from "../../App/Model/types";
import type { FormInstance } from 'antd/es/form';
type ServiceAddEditProps = {
  news?: NewsType&{icon:string}
  callback: any,
  categoryService?: {title:string, id:number}[]|null
}

const ServiceAddEdit: React.FC<ServiceAddEditProps> = ({ news, callback, categoryService}) => {
  const formRef = React.createRef<FormInstance>();
console.log(news,'test');

  const [form] = Form.useForm();
  const beforeUpload = (file: RcFile) => {

    return false
  }

  const onFinish = async (values: any) => {

    console.log(values.image, 'gfdsgsdfgsdfgdfsgdfsgfsd');

    const formdata = new FormData
    formdata.append('image', values.image.file||values.image)
    formdata.append('icon', values.icon.file||values.icon)
    formdata.append('title:az', values.title_az)
    formdata.append('title:en', values.title_en)
    formdata.append('title:ru', values.title_ru)
    formdata.append('description:az', values.description_az)
    formdata.append('description:en', values.description_en)
    formdata.append('description:ru', values.description_ru)

    if (news) {
      const res = await agent.service.update(formdata, news?.id)
      res.data && message.success('service was updated')
      callback()
    } else {
      const res = await agent.service.add(formdata)
      res.data && message.success('service was added')
      callback()
    }

    formRef.current!.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {

  };

  useLayoutEffect(() => {


    formRef.current!.resetFields();
    form.setFieldsValue({
      title_az: news?.title_az,
      title_en: news?.title_en,
      title_ru: news?.title_ru,
      description_az: news?.description_az,
      description_en: news?.description_en,
      description_ru: news?.description_ru,
      image: news?.image,
      icon: news?.icon,
   
    });
  }, [news])
  useEffect(() => {
   
  }, [])
  
  return (
    <Form
    labelAlign="left"
    labelCol={{ span: 5 }}
    wrapperCol={{ span: 18 }}
      layout="horizontal"
      id="AddNews"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      ref={formRef}
    >

      <Form.Item label="Title:az" name='title_az' rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Title:en" name='title_en' rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Title:ru" name='title_ru' rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>

      <Form.Item label="Description:az" name='description_az' rules={[{ required: true }]}>
      <Input.TextArea placeholder="description" />
      </Form.Item>
      <Form.Item label="Description:en" name='description_en' rules={[{ required: true }]}>
      <Input.TextArea placeholder="description" />
      </Form.Item>
      <Form.Item label="Description:ru" name='description_ru' rules={[{ required: true }]}>
      <Input.TextArea placeholder="description" />
      </Form.Item>

   
      <Form.Item label="Image" name='image' rules={[{ required: true }]}>
      
        <Upload
          defaultFileList={news && [{ uid: 'test', url: baseImageUrl + news?.image, status: 'done', name: news?.title_az }]}
          beforeUpload={beforeUpload}
          listType="picture"
          maxCount={1}

        >

          <Button icon={<UploadOutlined />}>Upload image</Button>
        </Upload>
      </Form.Item>


      <Form.Item label="Icon" name='icon' rules={[{ required: true }]}>
      
        <Upload
          defaultFileList={news && [{ uid: 'test_l', url: baseImageUrl + news?.icon, status: 'done', name: news?.title_az }]}
          beforeUpload={beforeUpload}
          listType="picture"
          maxCount={1}

        >

          <Button icon={<UploadOutlined />}>Upload icon</Button>
        </Upload>
      </Form.Item>


    </Form>
  );
}


export default ServiceAddEdit;