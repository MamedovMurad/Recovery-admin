import { Button, Col, Form, Input, message, Row, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";
import React, { useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { ProgressType } from "../../App/Model/types";
import type { FormInstance } from "antd/es/form";
import TextArea from "antd/lib/input/TextArea";
type ProgressAddEditProps = {
  progress?: ProgressType;
  callback: any;
};

const ProgressAddEdit: React.FC<ProgressAddEditProps> = ({ progress, callback }) => {
  const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();
  const beforeUpload = (file: RcFile) => {
    return false;
  };

  const onFinish = async (values: any) => {
    console.log(values, "values");

    const formdata = new FormData();
    formdata.append("icon", values.icon.file||values.icon);
  
    formdata.append("title:az", values['title:az']);
    formdata.append("title:ru", values['title:ru']);
    formdata.append("title:en", values['title:en']);



   
   
    if (progress) {
      const res = await agent.progress.update(formdata, progress?.id);
      res.data && message.success("progress was updated");
      callback();
    } else {
      const res = await agent.progress.add(formdata);
      res.data && message.success("progress was added");
      callback();
    }

    formRef.current!.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {};

  useLayoutEffect(() => {
    formRef.current!.resetFields();
    form.setFieldsValue({
      ['title:az']: progress?.title_az,
      ['title:en']: progress?.title_en,
      ['title:ru']: progress?.title_ru,
       ['icon']: progress?.icon,

   



    });
  }, [progress]);
  return (
    <Form
      labelAlign="left"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      id="AddProgress"
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




      <Row>
        <Col span={24}>
        <Form.Item label="Icon (60x60)" name="icon" rules={[{ required: true }]}>
        <Upload
          defaultFileList={
            progress && [
              {
                uid: "test",
                url: baseImageUrl + progress?.icon,
                status: "done",
                name: progress?.title_az,
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

export default ProgressAddEdit;
