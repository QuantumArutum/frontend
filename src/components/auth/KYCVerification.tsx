import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KYCData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  documents: {
    idFront: File | null;
    idBack: File | null;
    selfie: File | null;
    proofOfAddress: File | null;
  };
  verification: {
    phoneNumber: string;
    phoneVerified: boolean;
    emailVerified: boolean;
  };
}

interface KYCVerificationProps {
  currentLevel: number;
  onSubmit: (data: KYCData, level: number) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ currentLevel, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      nationality: '',
      idNumber: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    documents: {
      idFront: null,
      idBack: null,
      selfie: null,
      proofOfAddress: null,
    },
    verification: {
      phoneNumber: '',
      phoneVerified: false,
      emailVerified: false,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!kycData.personalInfo.fullName.trim()) {
        newErrors.fullName = '请输入完整姓名';
      }
      if (!kycData.personalInfo.dateOfBirth) {
        newErrors.dateOfBirth = '请选择出生日期';
      }
      if (!kycData.personalInfo.nationality.trim()) {
        newErrors.nationality = '请输入国籍';
      }
      if (!kycData.personalInfo.idNumber.trim()) {
        newErrors.idNumber = '请输入身份证号码';
      }
    }

    if (stepNumber === 2) {
      if (!kycData.documents.idFront) {
        newErrors.idFront = '请上传身份证正面照片';
      }
      if (!kycData.documents.idBack) {
        newErrors.idBack = '请上传身份证背面照片';
      }
      if (!kycData.documents.selfie) {
        newErrors.selfie = '请上传手持身份证自拍照';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setKycData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = useCallback(
    (field: keyof KYCData['documents'], file: File) => {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: '只支持 JPG、PNG 格式的图片',
        }));
        return;
      }

      // 验证文件大小 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: '文件大小不能超过 5MB',
        }));
        return;
      }

      setKycData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file,
        },
      }));

      // 清除错误
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleDragOver = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    setDragOver(field);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, field: keyof KYCData['documents']) => {
    e.preventDefault();
    setDragOver(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(field, files[0]);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      const targetLevel = currentLevel + 1;
      const result = await onSubmit(kycData, targetLevel);

      if (result.success) {
        // 显示成功消息
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadArea: React.FC<{
    field: keyof KYCData['documents'];
    label: string;
    description: string;
  }> = ({ field, label, description }) => {
    const file = kycData.documents[field];
    const error = errors[field];

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver === field
              ? 'border-blue-400 bg-blue-50'
              : error
                ? 'border-red-300 bg-red-50'
                : file
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => handleDragOver(e, field)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, field)}
        >
          {file ? (
            <div className="space-y-2">
              <div className="text-green-600">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-sm text-gray-600">{file.name}</div>
              <button
                type="button"
                onClick={() => handleFileUpload(field, file)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                重新上传
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400">
                <svg
                  className="w-8 h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="text-sm text-gray-600">{description}</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(field, file);
                }}
                className="hidden"
                id={`upload-${field}`}
              />
              <label
                htmlFor={`upload-${field}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                选择文件
              </label>
            </div>
          )}
        </div>
        {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">KYC身份验证</h2>
              <p className="text-gray-600 mt-1">完成身份验证以提升账户等级</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 进度条 */}
          <div className="mt-6">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>个人信息</span>
              <span>文档上传</span>
              <span>验证确认</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">个人基本信息</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      完整姓名 *
                    </label>
                    <input
                      type="text"
                      value={kycData.personalInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="请输入您的完整姓名"
                    />
                    {errors.fullName && (
                      <div className="mt-1 text-sm text-red-600">{errors.fullName}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      出生日期 *
                    </label>
                    <input
                      type="date"
                      value={kycData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <div className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">国籍 *</label>
                    <input
                      type="text"
                      value={kycData.personalInfo.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nationality ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="例如：中国"
                    />
                    {errors.nationality && (
                      <div className="mt-1 text-sm text-red-600">{errors.nationality}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      身份证号码 *
                    </label>
                    <input
                      type="text"
                      value={kycData.personalInfo.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.idNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="请输入身份证号码"
                    />
                    {errors.idNumber && (
                      <div className="mt-1 text-sm text-red-600">{errors.idNumber}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">身份证明文档</h3>

                <FileUploadArea
                  field="idFront"
                  label="身份证正面 *"
                  description="请上传清晰的身份证正面照片"
                />

                <FileUploadArea
                  field="idBack"
                  label="身份证背面 *"
                  description="请上传清晰的身份证背面照片"
                />

                <FileUploadArea
                  field="selfie"
                  label="手持身份证自拍 *"
                  description="请手持身份证与本人合影"
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">确认提交</h3>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">姓名:</span>
                    <span className="font-medium">{kycData.personalInfo.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">身份证号:</span>
                    <span className="font-medium">
                      {kycData.personalInfo.idNumber.replace(/(.{6})(.*)(.{4})/, '$1****$3')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">上传文档:</span>
                    <span className="font-medium">
                      {Object.values(kycData.documents).filter(Boolean).length} 个文件
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="text-blue-600 mr-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">提交须知：</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>审核通常需要1-3个工作日</li>
                        <li>请确保上传的文档清晰可见</li>
                        <li>审核结果将通过邮件通知</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={step === 1 ? onCancel : prevStep}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === 1 ? '取消' : '上一步'}
          </button>

          <div className="space-x-3">
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '提交中...' : '提交审核'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KYCVerification;
