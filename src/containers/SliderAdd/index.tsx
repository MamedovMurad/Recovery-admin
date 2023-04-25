import { Button, Col, Form, Input, message, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import React, { useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { SliderType } from "../../App/Model/types";
import type { FormInstance } from "antd/es/form";
import TextArea from "antd/lib/input/TextArea";
type SliderAddProps = {
  slider?: SliderType;
  callback: any;
};

const SliderAddEdit: React.FC<SliderAddProps> = ({ slider, callback }) => {
  const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();
  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const onFinish = async (values: any) => {
    console.log(values, "values");

    const formdata = new FormData();
    formdata.append("image", values.image.file||values.image);
  
    formdata.append("title:az", values['title:az']);
    formdata.append("title:ru", values['title:ru']);
    formdata.append("title:en", values['title:en']);

    formdata.append("link_title:az", values['link_title:az']);
    formdata.append("link_title:ru", values['link_title:ru']);
    formdata.append("link_title:en", values['link_title:en']);

    formdata.append("description:az", values['description:az']);
    formdata.append("description:en", values['description:en']);
    formdata.append("description:ru", values['description:ru']);
    values.link&& formdata.append("link", values.link);
    if (slider) {
      const res = await agent.slider.update(formdata, slider?.id);
      res.data && message.success("slider was updated");
      callback();
    } else {
      const res = await agent.slider.add(formdata);
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

      ['description:az']: slider?.description_az,
      ['description:ru']: slider?.description_ru,
      ['description:en']: slider?.description_en,


      ['link_title:az']: slider?.link_title_az,
      ['link_title:ru']: slider?.link_title_ru,
      ['link_title:en']: slider?.link_title_en,

      link: slider?.link,
      image: slider?.image,

    });
  }, [slider]);
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

      <Form.Item label="link_title:az" name="link_title:az" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="link_title:en" name="link_title:en" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="link_title:ru" name="link_title:ru" rules={[{ required: true }]}>
        <Input placeholder="input placeholder" />
      </Form.Item>

      <Form.Item label="description:az" name="description:az" rules={[{ required: true }]}>
      <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="description:ru" name="description:ru" rules={[{ required: true }]}>
      <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="description:en" name="description:en" rules={[{ required: true }]}>
       <TextArea></TextArea>
      </Form.Item>
      <Form.Item label="link" name="link">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Row>
        <Col span={24}><Form.Item label="Image (2880x760)" name="image" rules={[{ required: true }]}>
        <Upload
          defaultFileList={
            slider && [
              {
                uid: "test",
                url: baseImageUrl + slider?.image,
                status: "done",
                name: slider?.title_az,
              },
            ]
          }
          beforeUpload={beforeUpload}
          listType="picture"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Upload image</Button>
        </Upload>
      </Form.Item>
 </Col>
    
      </Row>
    </Form>
  );
};

export default SliderAddEdit;
