const { ethers } = require('ethers');

// Custom Provider to fix timestamp issue
class QuantaureumProvider extends ethers.JsonRpcProvider {
    async send(method, params) {
        const result = await super.send(method, params);
        if ((method === 'eth_getBlockByNumber' || method === 'eth_getBlockByHash') && result) {
            if (!result.difficulty) result.difficulty = "0x0";
            if (!result.gasLimit) result.gasLimit = "0x1fffffffffffff";
            if (!result.baseFeePerGas) result.baseFeePerGas = "0x0"; 
            if (!result.extraData) result.extraData = "0x";
            if (!result.nonce) result.nonce = "0x0000000000000000";
            if (!result.mixHash) result.mixHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
            if (result.timestamp && typeof result.timestamp === 'string' && result.timestamp.length > 12) {
                const bigTs = BigInt(result.timestamp);
                const seconds = bigTs / 1000000000n;
                result.timestamp = "0x" + seconds.toString(16);
            }
        }
        return result;
    }
}

async function test() {
  const provider = new QuantaureumProvider('http://localhost:8545');
  const wallet = new ethers.Wallet('0x540e1b0a5673ded9aa84ee6d541fe22754b382bc59666a95734ee96ab66f8755', provider);
  
  console.log('Address:', wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', ethers.formatEther(balance), 'QAU');
  
  // 简单转账测试
  console.log('Sending test transaction...');
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: ethers.parseEther('0.001'),
    gasLimit: 21000,
    gasPrice: ethers.parseUnits('1', 'gwei')
  });
  console.log('TX Hash:', tx.hash);
  console.log('Waiting for confirmation...');
  const receipt = await tx.wait();
  console.log('Status:', receipt.status);
  console.log('Block:', receipt.blockNumber);
}

test().catch(console.error);
