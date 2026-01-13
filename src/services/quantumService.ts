import { request } from "../utils/request";

const BASE_URL = "/api/quantum"; // 使用Next.js API路由

// 类型定义
interface KeyGenerateResponse {
  key: string;
  keyId: string;
}

interface KeyPairResponse {
  publicKey: string;
  privateKey: string;
  keyId: string;
}

interface EncryptResponse {
  encryptedData: string;
  iv?: string;
  tag?: string;
}

interface DecryptResponse {
  data: string;
}

interface SignatureResponse {
  signature: string;
}

interface VerifyResponse {
  valid: boolean;
}

interface RandomResponse {
  value: string | number;
}

interface HashResponse {
  hash: string;
}

interface ZKPProofResponse {
  proof: string;
}

interface CommitmentResponse {
  commitment: string;
}

interface QKDSessionResponse {
  sessionId: string;
}

interface ChannelResponse {
  channelId: string;
}

interface SystemStatusResponse {
  status: string;
  uptime: number;
}

interface MetricsResponse {
  operations: number;
  latency: number;
}

interface AlgorithmsResponse {
  encryption: string[];
  signature: string[];
  hash: string[];
}

export const quantumService = {
  // 密钥管理
  keyManager: {
    // 生成密钥
    generateKey: async (size: number = 32): Promise<KeyGenerateResponse> => {
      return request(`${BASE_URL}/keys/generate`, {
        method: 'POST',
        body: JSON.stringify({ size })
      });
    },

    // 生成密钥对
    generateKeyPair: async (): Promise<KeyPairResponse> => {
      return request(`${BASE_URL}/keys/generate-pair`, {
        method: 'POST'
      });
    },

    // 存储密钥
    storeKey: async (keyId: string, key: string, expiresAt: string | null = null): Promise<{ success: boolean }> => {
      return request(`${BASE_URL}/keys/store`, {
        method: 'POST',
        body: JSON.stringify({ keyId, key, expiresAt })
      });
    },

    // 获取密钥
    getKey: async (keyId: string): Promise<{ key: string }> => {
      return request(`${BASE_URL}/keys/${keyId}`);
    },

    // 轮换密钥
    rotateKey: async (keyId: string): Promise<KeyGenerateResponse> => {
      return request(`${BASE_URL}/keys/rotate`, {
        method: 'POST',
        body: JSON.stringify({ keyId })
      });
    },

    // 删除密钥
    deleteKey: async (keyId: string): Promise<{ success: boolean }> => {
      return request(`${BASE_URL}/keys/${keyId}`, {
        method: 'DELETE'
      });
    }
  },

  // 量子加密
  encryption: {
    // 加密数据
    encrypt: async (data: string, algorithm: string = 'AES-256-GCM', keyId: string | null = null): Promise<EncryptResponse> => {
      return request(`${BASE_URL}/encrypt`, {
        method: 'POST',
        body: JSON.stringify({ data, algorithm, keyId })
      });
    },

    // 解密数据
    decrypt: async (encryptedData: string, algorithm: string = 'AES-256-GCM', keyId: string | null = null): Promise<DecryptResponse> => {
      return request(`${BASE_URL}/decrypt`, {
        method: 'POST',
        body: JSON.stringify({ encryptedData, algorithm, keyId })
      });
    },

    // 批量加密
    encryptBatch: async (dataList: string[], algorithm: string = 'AES-256-GCM'): Promise<EncryptResponse[]> => {
      return request(`${BASE_URL}/encrypt/batch`, {
        method: 'POST',
        body: JSON.stringify({ dataList, algorithm })
      });
    },

    // 批量解密
    decryptBatch: async (encryptedDataList: string[], algorithm: string = 'AES-256-GCM'): Promise<DecryptResponse[]> => {
      return request(`${BASE_URL}/decrypt/batch`, {
        method: 'POST',
        body: JSON.stringify({ encryptedDataList, algorithm })
      });
    }
  },


  // 数字签名
  signature: {
    // 生成签名
    sign: async (data: string, privateKey: string, algorithm: string = 'Dilithium'): Promise<SignatureResponse> => {
      return request(`${BASE_URL}/sign`, {
        method: 'POST',
        body: JSON.stringify({ data, privateKey, algorithm })
      });
    },

    // 验证签名
    verify: async (data: string, signature: string, publicKey: string, algorithm: string = 'Dilithium'): Promise<VerifyResponse> => {
      return request(`${BASE_URL}/verify`, {
        method: 'POST',
        body: JSON.stringify({ data, signature, publicKey, algorithm })
      });
    },

    // 批量签名
    signBatch: async (dataList: string[], privateKey: string, algorithm: string = 'Dilithium'): Promise<SignatureResponse[]> => {
      return request(`${BASE_URL}/sign/batch`, {
        method: 'POST',
        body: JSON.stringify({ dataList, privateKey, algorithm })
      });
    },

    // 批量验证
    verifyBatch: async (verificationList: Array<{ data: string; signature: string; publicKey: string }>, algorithm: string = 'Dilithium'): Promise<VerifyResponse[]> => {
      return request(`${BASE_URL}/verify/batch`, {
        method: 'POST',
        body: JSON.stringify({ verificationList, algorithm })
      });
    }
  },

  // 量子随机数生成
  random: {
    // 生成量子随机数
    generateQuantumRandom: async (size: number = 32): Promise<RandomResponse> => {
      return request(`${BASE_URL}/random/quantum`, {
        method: 'POST',
        body: JSON.stringify({ size })
      });
    },

    // 生成量子随机字符串
    generateQuantumString: async (length: number = 32, charset: string = 'alphanumeric'): Promise<RandomResponse> => {
      return request(`${BASE_URL}/random/string`, {
        method: 'POST',
        body: JSON.stringify({ length, charset })
      });
    },

    // 生成量子随机整数
    generateQuantumInteger: async (min: number = 0, max: number = 100): Promise<RandomResponse> => {
      return request(`${BASE_URL}/random/integer`, {
        method: 'POST',
        body: JSON.stringify({ min, max })
      });
    }
  },

  // 哈希函数
  hash: {
    // 计算量子安全哈希
    computeHash: async (data: string, algorithm: string = 'SHA3-256'): Promise<HashResponse> => {
      return request(`${BASE_URL}/hash`, {
        method: 'POST',
        body: JSON.stringify({ data, algorithm })
      });
    },

    // 验证哈希
    verifyHash: async (data: string, hash: string, algorithm: string = 'SHA3-256'): Promise<VerifyResponse> => {
      return request(`${BASE_URL}/hash/verify`, {
        method: 'POST',
        body: JSON.stringify({ data, hash, algorithm })
      });
    },

    // 计算Merkle树根
    computeMerkleRoot: async (dataList: string[]): Promise<HashResponse> => {
      return request(`${BASE_URL}/hash/merkle`, {
        method: 'POST',
        body: JSON.stringify({ dataList })
      });
    }
  },

  // 零知识证明
  zkp: {
    // 生成零知识证明
    generateProof: async (statement: string, witness: string, circuit: string): Promise<ZKPProofResponse> => {
      return request(`${BASE_URL}/zkp/prove`, {
        method: 'POST',
        body: JSON.stringify({ statement, witness, circuit })
      });
    },

    // 验证零知识证明
    verifyProof: async (proof: string, statement: string, circuit: string): Promise<VerifyResponse> => {
      return request(`${BASE_URL}/zkp/verify`, {
        method: 'POST',
        body: JSON.stringify({ proof, statement, circuit })
      });
    },

    // 生成承诺
    generateCommitment: async (value: string, randomness: string): Promise<CommitmentResponse> => {
      return request(`${BASE_URL}/zkp/commit`, {
        method: 'POST',
        body: JSON.stringify({ value, randomness })
      });
    },

    // 验证承诺
    verifyCommitment: async (commitment: string, value: string, randomness: string): Promise<VerifyResponse> => {
      return request(`${BASE_URL}/zkp/verify-commitment`, {
        method: 'POST',
        body: JSON.stringify({ commitment, value, randomness })
      });
    }
  },


  // 量子密钥分发
  qkd: {
    // 初始化QKD会话
    initSession: async (participantId: string): Promise<QKDSessionResponse> => {
      return request(`${BASE_URL}/qkd/init`, {
        method: 'POST',
        body: JSON.stringify({ participantId })
      });
    },

    // 交换量子密钥
    exchangeKey: async (sessionId: string, qubits: string[]): Promise<{ success: boolean }> => {
      return request(`${BASE_URL}/qkd/exchange`, {
        method: 'POST',
        body: JSON.stringify({ sessionId, qubits })
      });
    },

    // 获取共享密钥
    getSharedKey: async (sessionId: string): Promise<{ key: string }> => {
      return request(`${BASE_URL}/qkd/key/${sessionId}`);
    }
  },

  // 安全通信
  secureComm: {
    // 建立安全通道
    establishChannel: async (participantId: string, algorithm: string = 'Kyber'): Promise<ChannelResponse> => {
      return request(`${BASE_URL}/secure/establish`, {
        method: 'POST',
        body: JSON.stringify({ participantId, algorithm })
      });
    },

    // 发送安全消息
    sendMessage: async (channelId: string, message: string): Promise<{ success: boolean }> => {
      return request(`${BASE_URL}/secure/send`, {
        method: 'POST',
        body: JSON.stringify({ channelId, message })
      });
    },

    // 接收安全消息
    receiveMessage: async (channelId: string): Promise<{ message: string }> => {
      return request(`${BASE_URL}/secure/receive/${channelId}`);
    },

    // 关闭安全通道
    closeChannel: async (channelId: string): Promise<{ success: boolean }> => {
      return request(`${BASE_URL}/secure/close`, {
        method: 'POST',
        body: JSON.stringify({ channelId })
      });
    }
  },

  // 系统状态和监控
  system: {
    // 获取量子加密系统状态
    getStatus: async (): Promise<SystemStatusResponse> => {
      return request(`${BASE_URL}/system/status`);
    },

    // 获取性能指标
    getMetrics: async (): Promise<MetricsResponse> => {
      return request(`${BASE_URL}/system/metrics`);
    },

    // 获取支持的算法列表
    getSupportedAlgorithms: async (): Promise<AlgorithmsResponse> => {
      return request(`${BASE_URL}/system/algorithms`);
    },

    // 运行系统自检
    runSelfTest: async (): Promise<{ passed: boolean; results: Record<string, boolean> }> => {
      return request(`${BASE_URL}/system/self-test`, {
        method: 'POST'
      });
    }
  }
};
