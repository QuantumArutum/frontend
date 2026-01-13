const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Custom Provider (simplified)
class QuantaureumProvider extends ethers.JsonRpcProvider {
    async send(method, params) {
        const result = await super.send(method, params);
        // Fix block/tx formatting... (omitted for brevity as getCode doesn't need it usually)
        return result;
    }
}

async function main() {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545'); // Standard provider usually works for getCode
    
    // Load deployment info
    const deploymentPath = path.join(__dirname, '../deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        throw new Error("deployment.json not found.");
    }
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log("GoldReserve Address:", deploymentInfo.GoldReserve);

    const code = await provider.getCode(deploymentInfo.GoldReserve);
    console.log("Code length:", (code.length - 2) / 2); // Remove 0x

    if (code === '0x') {
        console.log("WARNING: No code at this address!");
    } else {
        console.log("Contract code found.");
    }
}

main().catch(console.error);
