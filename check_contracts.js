const { ethers } = require('ethers');

const RPC_URL = 'http://localhost:8545';
const GOLD_RESERVE_ADDRESS = '0xad5D4D92cb99ab5954e900471F572f55bB90E3A2';
const USDT_ADDRESS = '0x9088E84253d633271af2D88E11e85841Df5F910C';
const QAU_SALE_ADDRESS = '0xde5f387d6D47bFB3d899F6F5b60214Ad0907BC1f';

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    console.log('Checking contract deployments...\n');
    
    const goldCode = await provider.getCode(GOLD_RESERVE_ADDRESS);
    console.log('GoldReserve:', GOLD_RESERVE_ADDRESS);
    console.log('  Code length:', goldCode.length, goldCode === '0x' ? '(NOT DEPLOYED)' : '(DEPLOYED)');
    
    const usdtCode = await provider.getCode(USDT_ADDRESS);
    console.log('\nMockUSDT:', USDT_ADDRESS);
    console.log('  Code length:', usdtCode.length, usdtCode === '0x' ? '(NOT DEPLOYED)' : '(DEPLOYED)');
    
    const saleCode = await provider.getCode(QAU_SALE_ADDRESS);
    console.log('\nQAUSale:', QAU_SALE_ADDRESS);
    console.log('  Code length:', saleCode.length, saleCode === '0x' ? '(NOT DEPLOYED)' : '(DEPLOYED)');
    
    // Check latest block
    const blockNum = await provider.getBlockNumber();
    console.log('\nLatest block:', blockNum);
}

main().catch(console.error);
