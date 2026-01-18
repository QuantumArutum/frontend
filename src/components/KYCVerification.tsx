'use client';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/label';
import { Badge } from './ui/Badge';
import { Alert, AlertDescription } from './ui/Alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/Separator';
import {
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Camera,
  Eye,
  Lock,
} from 'lucide-react';

// 个人信息类型
interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// 文档类型
interface Documents {
  idType: string;
  idNumber: string;
  idFrontImage: string | null;
  idBackImage: string | null;
  selfieImage: string | null;
}

// 验证状态类型
interface Verification {
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  submittedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string;
}

// KYC数据类型
interface KYCData {
  personalInfo: PersonalInfo;
  documents: Documents;
  verification: Verification;
}

// 组件属性类型
interface KYCVerificationProps {
  userId: string;
  onKYCComplete?: (kyc: KYCData) => void;
}

// 步骤类型
interface Step {
  id: number;
  title: string;
  description: string;
}

// 选项类型
interface SelectOption {
  value: string;
  label: string;
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ userId, onKYCComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      phoneNumber: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
    documents: {
      idType: '',
      idNumber: '',
      idFrontImage: null,
      idBackImage: null,
      selfieImage: null,
    },
    verification: {
      status: 'not_started',
      submittedAt: null,
      reviewedAt: null,
      rejectionReason: '',
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const steps: Step[] = [
    { id: 1, title: '个人信息', description: '填写基本个人信息' },
    { id: 2, title: '身份证件', description: '上传身份证明文件' },
    { id: 3, title: '人脸验证', description: '上传自拍照片进行人脸验证' },
    { id: 4, title: '提交审核', description: '提交KYC申请等待审核' },
  ];

  const idTypes: SelectOption[] = [
    { value: 'id_card', label: '身份证' },
    { value: 'passport', label: '护照' },
    { value: 'driver_license', label: '驾驶证' },
  ];

  const countries: SelectOption[] = [
    { value: 'CN', label: '中国' },
    { value: 'US', label: '美国' },
    { value: 'UK', label: '英国' },
    { value: 'JP', label: '日本' },
    { value: 'KR', label: '韩国' },
  ];

  const fetchKYCStatus = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/kyc/status/${userId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.kyc) {
          setKycData(data.data.kyc);

          if (data.data.kyc.verification.status === 'pending') {
            setCurrentStep(4);
          } else if (data.data.kyc.verification.status === 'approved') {
            setCurrentStep(5);
          }
        }
      }
    } catch (err) {
      console.error('获取KYC状态失败', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchKYCStatus();
  }, [fetchKYCStatus]);

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string): void => {
    setKycData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleDocumentChange = (field: keyof Documents, value: string | null): void => {
    setKycData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (file: File, fieldName: keyof Documents): Promise<void> => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError('请上传JPG或PNG格式的图片');
      return;
    }

    if (file.size > maxSize) {
      setError('图片大小不能超过5MB');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fieldName);

      const response = await fetch('/api/v1/kyc/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          handleDocumentChange(fieldName, data.data.fileUrl);
        } else {
          setError(data.error?.message || '文件上传失败');
        }
      } else {
        setError('文件上传失败');
      }
    } catch (err) {
      setError('文件上传失败: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      firstName: '姓名',
      lastName: '姓氏',
      dateOfBirth: '出生日期',
      nationality: '国籍',
      phoneNumber: '手机号码',
      address: '地址',
      city: '城市',
      country: '国家',
    };
    return labels[field] || field;
  };

  const validatePersonalInfo = (): boolean => {
    const { personalInfo } = kycData;
    const required: (keyof PersonalInfo)[] = [
      'firstName',
      'lastName',
      'dateOfBirth',
      'nationality',
      'phoneNumber',
      'address',
      'city',
      'country',
    ];

    for (const field of required) {
      if (!personalInfo[field]) {
        setError(`请填写${getFieldLabel(field)}`);
        return false;
      }
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(personalInfo.phoneNumber)) {
      setError('请输入正确的手机号码');
      return false;
    }

    return true;
  };

  const validateDocuments = (): boolean => {
    const { documents } = kycData;

    if (!documents.idType) {
      setError('请选择证件类型');
      return false;
    }

    if (!documents.idNumber) {
      setError('请输入证件号码');
      return false;
    }

    if (!documents.idFrontImage) {
      setError('请上传证件正面照片');
      return false;
    }

    if (documents.idType === 'id_card' && !documents.idBackImage) {
      setError('请上传身份证背面照片');
      return false;
    }

    return true;
  };

  const validateSelfie = (): boolean => {
    if (!kycData.documents.selfieImage) {
      setError('请上传自拍照片');
      return false;
    }
    return true;
  };

  const handleNextStep = (): void => {
    setError('');

    switch (currentStep) {
      case 1:
        if (validatePersonalInfo()) setCurrentStep(2);
        break;
      case 2:
        if (validateDocuments()) setCurrentStep(3);
        break;
      case 3:
        if (validateSelfie()) setCurrentStep(4);
        break;
    }
  };

  const handlePrevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const submitKYC = async (): Promise<void> => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/kyc/submit', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kycData),
      });

      const data = await response.json();

      if (data.success) {
        setKycData((prev) => ({
          ...prev,
          verification: {
            ...prev.verification,
            status: 'pending',
            submittedAt: new Date().toISOString(),
          },
        }));

        if (onKYCComplete) {
          onKYCComplete(data.data.kyc);
        }
      } else {
        setError(data.error?.message || 'KYC提交失败');
      }
    } catch (err) {
      setError('KYC提交失败: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (stepId: number): React.ReactNode => {
    if (stepId < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepId === currentStep) {
      return (
        <div className="h-5 w-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
          {stepId}
        </div>
      );
    } else {
      return (
        <div className="h-5 w-5 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold">
          {stepId}
        </div>
      );
    }
  };

  const renderPersonalInfoStep = (): React.ReactNode => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">姓名 *</Label>
          <Input
            id="firstName"
            value={kycData.personalInfo.firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePersonalInfoChange('firstName', e.target.value)
            }
            placeholder="请输入姓名"
          />
        </div>
        <div>
          <Label htmlFor="lastName">姓氏 *</Label>
          <Input
            id="lastName"
            value={kycData.personalInfo.lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePersonalInfoChange('lastName', e.target.value)
            }
            placeholder="请输入姓氏"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">出生日期 *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={kycData.personalInfo.dateOfBirth}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePersonalInfoChange('dateOfBirth', e.target.value)
            }
          />
        </div>
        <div>
          <Label htmlFor="nationality">国籍 *</Label>
          <select
            id="nationality"
            value={kycData.personalInfo.nationality}
            onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">请选择国籍</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="phoneNumber">手机号码 *</Label>
        <Input
          id="phoneNumber"
          value={kycData.personalInfo.phoneNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handlePersonalInfoChange('phoneNumber', e.target.value)
          }
          placeholder="请输入手机号码"
        />
      </div>

      <div>
        <Label htmlFor="address">地址 *</Label>
        <Input
          id="address"
          value={kycData.personalInfo.address}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handlePersonalInfoChange('address', e.target.value)
          }
          placeholder="请输入详细地址"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">城市 *</Label>
          <Input
            id="city"
            value={kycData.personalInfo.city}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePersonalInfoChange('city', e.target.value)
            }
            placeholder="城市"
          />
        </div>
        <div>
          <Label htmlFor="postalCode">邮政编码</Label>
          <Input
            id="postalCode"
            value={kycData.personalInfo.postalCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handlePersonalInfoChange('postalCode', e.target.value)
            }
            placeholder="邮政编码"
          />
        </div>
        <div>
          <Label htmlFor="country">国家 *</Label>
          <select
            id="country"
            value={kycData.personalInfo.country}
            onChange={(e) => handlePersonalInfoChange('country', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">请选择国家</option>
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderDocumentStep = (): React.ReactNode => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="idType">证件类型 *</Label>
        <select
          id="idType"
          value={kycData.documents.idType}
          onChange={(e) => handleDocumentChange('idType', e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">请选择证件类型</option>
          {idTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="idNumber">证件号码 *</Label>
        <Input
          id="idNumber"
          value={kycData.documents.idNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleDocumentChange('idNumber', e.target.value)
          }
          placeholder="请输入证件号码"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>证件正面照片 *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {kycData.documents.idFrontImage ? (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <p className="text-sm text-green-600">证件正面已上传</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">点击上传证件正面照片</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0], 'idFrontImage')
                  }
                  className="hidden"
                  id="idFrontUpload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('idFrontUpload')?.click()}
                  disabled={isLoading}
                >
                  选择文件
                </Button>
              </div>
            )}
          </div>
        </div>

        {kycData.documents.idType === 'id_card' && (
          <div>
            <Label>证件背面照片 *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {kycData.documents.idBackImage ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                  <p className="text-sm text-green-600">证件背面已上传</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">点击上传证件背面照片</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileUpload(e.target.files[0], 'idBackImage')
                    }
                    className="hidden"
                    id="idBackUpload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('idBackUpload')?.click()}
                    disabled={isLoading}
                  >
                    选择文件
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSelfieStep = (): React.ReactNode => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">人脸验证</h3>
        <p className="text-sm text-gray-600 mb-6">请上传一张清晰的自拍照片，用于验证您的身份</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {kycData.documents.selfieImage ? (
          <div className="space-y-2">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-green-600 font-medium">自拍照片已上传</p>
            <p className="text-sm text-gray-600">照片将用于人脸识别验证</p>
          </div>
        ) : (
          <div className="space-y-4">
            <User className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 mb-2">请上传自拍照片</p>
              <p className="text-xs text-gray-500 mb-4">
                • 请确保光线充足，面部清晰可见
                <br />
                • 请勿佩戴帽子、墨镜等遮挡物
                <br />• 照片中只能有您一个人
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleFileUpload(e.target.files[0], 'selfieImage')
              }
              className="hidden"
              id="selfieUpload"
            />
            <Button
              type="button"
              onClick={() => document.getElementById('selfieUpload')?.click()}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Camera className="h-4 w-4 mr-2" />
              上传自拍照片
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubmitStep = (): React.ReactNode => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">提交KYC审核</h3>
        <p className="text-sm text-gray-600 mb-6">
          请确认您提交的信息准确无误，提交后将进入人工审核阶段
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium">审核信息概览</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">姓名:</span>
            <span className="ml-2 font-medium">
              {kycData.personalInfo.firstName} {kycData.personalInfo.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-600">证件类型:</span>
            <span className="ml-2 font-medium">
              {idTypes.find((t) => t.value === kycData.documents.idType)?.label}
            </span>
          </div>
          <div>
            <span className="text-gray-600">证件号码:</span>
            <span className="ml-2 font-medium">{kycData.documents.idNumber}</span>
          </div>
          <div>
            <span className="text-gray-600">手机号码:</span>
            <span className="ml-2 font-medium">{kycData.personalInfo.phoneNumber}</span>
          </div>
        </div>
      </div>

      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          <strong>隐私保护:</strong> 您的个人信息将严格保密，仅用于身份验证目的。
          我们采用银行级加密技术保护您的数据安全。
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button
          onClick={submitKYC}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 px-8"
        >
          {isLoading ? '提交中...' : '提交KYC审核'}
        </Button>
      </div>
    </div>
  );

  const renderStatusStep = (): React.ReactNode => {
    const { verification } = kycData;

    return (
      <div className="space-y-6 text-center">
        {verification.status === 'pending' && (
          <>
            <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
            <div>
              <h3 className="text-xl font-medium mb-2">审核中</h3>
              <p className="text-gray-600 mb-4">您的KYC申请已提交，我们将在1-3个工作日内完成审核</p>
              {verification.submittedAt && (
                <Badge variant="secondary">
                  提交时间: {new Date(verification.submittedAt).toLocaleString()}
                </Badge>
              )}
            </div>
          </>
        )}

        {verification.status === 'approved' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-medium text-green-600 mb-2">审核通过</h3>
              <p className="text-gray-600 mb-4">
                恭喜！您的身份验证已通过，现在可以参与所有拍卖活动
              </p>
              {verification.reviewedAt && (
                <Badge variant="default" className="bg-green-500">
                  审核时间: {new Date(verification.reviewedAt).toLocaleString()}
                </Badge>
              )}
            </div>
          </>
        )}

        {verification.status === 'rejected' && (
          <>
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-xl font-medium text-red-600 mb-2">审核未通过</h3>
              <p className="text-gray-600 mb-4">
                很抱歉，您的KYC申请未通过审核，请根据以下原因重新提交
              </p>
              <Alert variant="destructive" className="text-left">
                <AlertDescription>
                  <strong>拒绝原因:</strong> {verification.rejectionReason}
                </AlertDescription>
              </Alert>
              <Button onClick={() => setCurrentStep(1)} className="mt-4" variant="outline">
                重新提交
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          KYC身份验证
          {kycData.verification.status === 'approved' && (
            <Badge variant="default" className="ml-auto bg-green-500">
              已验证
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep <= 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">验证进度</span>
              <span className="text-sm text-gray-500">{currentStep}/4</span>
            </div>

            <Progress value={(currentStep / 4) * 100} className="h-2" />

            <div className="grid grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center text-center">
                  {getStepIcon(step.id)}
                  <div className="mt-2">
                    <div
                      className={`text-xs font-medium ${
                        step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="min-h-[400px]">
          {currentStep === 1 && renderPersonalInfoStep()}
          {currentStep === 2 && renderDocumentStep()}
          {currentStep === 3 && renderSelfieStep()}
          {currentStep === 4 && renderSubmitStep()}
          {currentStep === 5 && renderStatusStep()}
        </div>

        {currentStep <= 3 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isLoading}
            >
              上一步
            </Button>
            <Button onClick={handleNextStep} disabled={isLoading}>
              {isLoading ? '处理中...' : '下一步'}
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>您的个人信息受到严格保护</span>
          </div>
          <p>• 所有数据采用银行级加密传输和存储</p>
          <p>• 仅用于身份验证，不会用于其他用途</p>
          <p>• 符合GDPR和相关隐私保护法规</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KYCVerification;
