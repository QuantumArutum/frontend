'use client';
import React, { useState } from 'react';
import { Card, Upload, Button, Form, Input, Select, message, Typography } from 'antd';
import { UploadOutlined, IdcardOutlined } from '@ant-design/icons';
import { barongAPI } from '@/api/client';

const { Title, Paragraph } = Typography;

export default function KYCPage() {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('upload', file);
      });
      formData.append('doc_type', values.doc_type);
      formData.append('doc_number', values.doc_number);

      setUploading(true);

      const res = await barongAPI.post('/resource/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        message.success('Documents uploaded successfully. Verification pending.');
        setFileList([]);
        form.resetFields();
      } else {
        message.error('Upload failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Title level={1} className="text-white">Identity Verification</Title>
          <Paragraph className="text-lg text-gray-400">
            Verify your identity to unlock higher limits and features.
          </Paragraph>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <Form form={form} layout="vertical" onFinish={handleUpload}>
            <Form.Item name="doc_type" label={<span className="text-white">Document Type</span>} rules={[{ required: true }]}>
              <Select className="bg-gray-800" placeholder="Select document type">
                <Select.Option value="Identity Card">Identity Card</Select.Option>
                <Select.Option value="Passport">Passport</Select.Option>
                <Select.Option value="Driver License">Driver License</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="doc_number" label={<span className="text-white">Document Number</span>} rules={[{ required: true }]}>
              <Input className="bg-gray-800 text-white border-gray-700" placeholder="Enter document number" />
            </Form.Item>

            <Form.Item label={<span className="text-white">Upload Document</span>} required>
              <Upload {...props} maxCount={1} className="text-white">
                <Button icon={<UploadOutlined />} className="bg-gray-800 text-white border-gray-700">Select File</Button>
              </Upload>
            </Form.Item>

            <Button 
              type="primary" 
              htmlType="submit" 
              loading={uploading} 
              disabled={fileList.length === 0}
              block
              size="large"
              icon={<IdcardOutlined />}
            >
              Submit for Verification
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
