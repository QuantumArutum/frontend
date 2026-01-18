'use client';
import React, { useState } from 'react';
import { Card, Upload, Button, Form, Input, Select, message, Typography } from 'antd';
import { UploadOutlined, IdcardOutlined } from '@ant-design/icons';
import { barongAPI } from '@/api/client';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const { Title, Paragraph } = Typography;

export default function KYCPage() {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('upload', file);
      });
      formData.append('doc_type', values.doc_type);
      formData.append('doc_number', values.doc_number);

      setUploading(true);

      const res = await barongAPI.post('/resource/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        message.success(t('settings.kyc.messages.upload_success'));
        setFileList([]);
        form.resetFields();
      } else {
        message.error(t('settings.kyc.messages.upload_failed'));
      }
    } catch (error) {
      console.error(error);
      message.error(t('settings.kyc.messages.upload_failed'));
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
          <Title level={1} className="text-white">
            {t('settings.kyc.title')}
          </Title>
          <Paragraph className="text-lg text-gray-400">{t('settings.kyc.subtitle')}</Paragraph>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <Form form={form} layout="vertical" onFinish={handleUpload}>
            <Form.Item
              name="doc_type"
              label={<span className="text-white">{t('settings.kyc.doc_type')}</span>}
              rules={[{ required: true }]}
            >
              <Select className="bg-gray-800" placeholder={t('settings.kyc.select_doc_type')}>
                <Select.Option value="Identity Card">
                  {t('settings.kyc.doc_types.id_card')}
                </Select.Option>
                <Select.Option value="Passport">
                  {t('settings.kyc.doc_types.passport')}
                </Select.Option>
                <Select.Option value="Driver License">
                  {t('settings.kyc.doc_types.driver_license')}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="doc_number"
              label={<span className="text-white">{t('settings.kyc.doc_number')}</span>}
              rules={[{ required: true }]}
            >
              <Input
                className="bg-gray-800 text-white border-gray-700"
                placeholder={t('settings.kyc.enter_doc_number')}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">{t('settings.kyc.upload_doc')}</span>}
              required
            >
              <Upload {...props} maxCount={1} className="text-white">
                <Button
                  icon={<UploadOutlined />}
                  className="bg-gray-800 text-white border-gray-700"
                >
                  {t('settings.kyc.select_file')}
                </Button>
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
              {t('settings.kyc.submit')}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
