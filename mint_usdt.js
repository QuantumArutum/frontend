const { ethers } = require('ethers');

const RPC_URL = 'http://localhost:8545';
const USDT_ADDRESS = '0x9088E84253d633271af2D88E11e85841Df5F910C';

// MockERC20 ABI with mint function
const MOCK_ERC20_ABI = [
    "function mint(address to, uint256 amount) returns (bool)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function main() {
    // Get recipient address from command line or use default
    const recipient = process.argv[2] || '0x02B7947CcE9E8c00F38D34C7ae860eF0355a6f2B';
    const amount = process.argv[3] || '1000000'; // Default 1M USDT
    
    console.log('Minting USDT to:', recipient);
    console.log('Amount:', amount, 'USDT');
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // Use validator key to sign
    const pk = "0x540e1b0a5673ded9aa84ee6d541fe22754b382bc59666a95734ee96ab66f8755";
    const signer = new ethers.Wallet(pk, provider);
    
    const usdt = new ethers.Contract(USDT_ADDRESS, MOCK_ERC20_ABI, signer);
    
    // Get decimals
    const decimals = await usdt.decimals();
    console.log('USDT decimals:', decimals);
    
    // Mint tokens
    const mintAmount = ethers.parseUnits(amount, decimals);
    console.log('Minting', mintAmount.toString(), 'units...');
    
    const tx = await usdt.mint(recipient, mintAmount, {
        gasLimit: 100000,
        gasPrice: 1000000000
    });
    console.log('TX hash:', tx.hash);
    
    // Wait for confirmation
    console.log('Waiting for confirmation...');
    await new Promise(r => setTimeout(r, 15000));
    
    // Check balance
    const balance = await usdt.balanceOf(recipient);
    console.log('New balance:', ethers.formatUnits(balance, decimals), 'USDT');
}

main().catch(console.error);
