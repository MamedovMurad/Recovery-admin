import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import type { FormInstance } from 'antd/es/form';
import React, { useLayoutEffect, useState } from "react";
import agent, { baseImageUrl } from "../../App/Api";
import { AboutType } from "../../App/Model/types";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { uploadPlugin } from "../../hooks/file";


type AboutContainerProps = {
    about?: AboutType
    callback?: any
}

const AboutContainer: React.FC<AboutContainerProps> = ({ about, callback }) => {
    const [editorContent, setEditorContent] = useState('');
    function handleEditorChange(event: any, editor: any) {
        const data = editor.getData();
        console.log(editor);
        
        setEditorContent(data);
    }
    const [form] = Form.useForm();
    const formRef = React.createRef<FormInstance>();
    const [editorState, seteditorState] = useState<any>({})
    const beforeUpload = (file: RcFile) => {
        return false
    }

    const onFinish = async (values: any) => {
        /* formRef.current!.resetFields(); */
        const formdata = new FormData
        
        
    
        formdata.append('title:az', values.title_az)
        formdata.append('title:en', values.title_en)
        formdata.append('title:ru', values.title_ru)
        formdata.append('description:az', values.description_az)
        formdata.append('description:en', values.description_en)
        formdata.append('description:ru', values.description_ru)
        const res = await agent.about.update(formdata)
        res.data && message.success('about was updated')
        callback()
    };
    useLayoutEffect(() => {


        formRef.current!.resetFields();
        form.setFieldsValue({
            title_az: about?.title_az,
            title_ru: about?.title_ru,
            title_en: about?.title_en,
            description_az: about?.description_az,
            description_ru: about?.description_ru,
            description_en: about?.description_en,
        
        });
    }, [about])




 



    return (
        <div>
            <Form
                labelAlign="left"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                ref={formRef}
                id="AddSLider"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                /*    onFinishFailed={onFinishFailed} */
                form={form}

            >

                <Form.Item label="title:az" name='title_az' rules={[{ required: true }]}>
                    <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="title:en" name='title_en' rules={[{ required: true }]}>
                    <Input placeholder="input placeholder" />
                </Form.Item>
                <Form.Item label="title:ru" name='title_ru' rules={[{ required: true }]}>
                    <Input placeholder="input placeholder" />
                </Form.Item>




                <Form.Item label="description:az" name='description_az' rules={[{ required: true }]} 
                 getValueFromEvent={(event, editor) => {
                    const data = editor.getData();
                    return data;
                    }}  >
                    <CKEditor
                        editor={ClassicEditor}
                        data={about?.description_az}
                        config={{
                            extraPlugins: [uploadPlugin]
                          }}
                    />
                </Form.Item>
                <Form.Item label="description:en" name='description_en' rules={[{ required: true }]}
                   getValueFromEvent={(event, editor) => {
                    const data = editor.getData();
                    return data;
                    }} >
                    <CKEditor
                        editor={ClassicEditor}
                        data={about?.description_en}
                       config={{
                          extraPlugins: [uploadPlugin]
                        }}
                    />
                </Form.Item>
                <Form.Item label="description:ru" name='description_ru' rules={[{ required: true }]}
                   getValueFromEvent={(event, editor) => {
                    const data = editor.getData();
                    return data;
                    }} >
                   <CKEditor
                        editor={ClassicEditor}
                        data={about?.description_ru}
                        config={{
                            extraPlugins: [uploadPlugin]
                          }}
                    />
                </Form.Item>

              
            </Form>
        </div>
    );
}


export default AboutContainer;