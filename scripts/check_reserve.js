const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class QuantaureumProvider extends ethers.JsonRpcProvider {
    async send(method, params) {
        const result = await super.send(method, params);
        
        // Helper to fix object
        const fixObject = (obj) => {
            if (!obj) return obj;
            if (!obj.difficulty) obj.difficulty = "0x0";
            if (!obj.gasLimit) obj.gasLimit = "0x1fffffffffffff";
            if (!obj.baseFeePerGas) obj.baseFeePerGas = "0x0"; 
            if (!obj.extraData) obj.extraData = "0x";
            if (!obj.nonce) obj.nonce = "0x0000000000000000";
            if (!obj.mixHash) obj.mixHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

            const fieldsToFix = ['value', 'gas', 'gasPrice', 'nonce', 'v', 'r', 's', 'type', 'chainId', 'maxFeePerGas', 'maxPriorityFeePerGas', 'blockNumber', 'transactionIndex', 'difficulty', 'baseFeePerGas', 'effectiveGasPrice', 'cumulativeGasUsed', 'gasUsed'];
            fieldsToFix.forEach(key => {
                if (obj[key] === '0x') obj[key] = '0x0';
            });
            return obj;
        };

        if (method.startsWith('eth_getBlock') && result) {
            fixObject(result);
            if (result.transactions && Array.isArray(result.transactions)) {
                result.transactions.forEach(tx => typeof tx === 'object' ? fixObject(tx) : tx);
            }
        }
        return result;
    }
}

async function main() {
    const provider = new QuantaureumProvider('http://localhost:8545');
    
    // Load deployment info
    const deploymentPath = path.join(__dirname, '../deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        throw new Error("deployment.json not found.");
    }
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));

    // ABI
    const GoldReserveABI = [
        "function totalGoldReserve() view returns (uint256)",
        "function totalQAUIssued() view returns (uint256)"
    ];

    const goldReserve = new ethers.Contract(deploymentInfo.GoldReserve, GoldReserveABI, provider);

    try {
        const reserve = await goldReserve.totalGoldReserve();
        const issued = await goldReserve.totalQAUIssued();
        console.log("Current Reserve (g):", reserve.toString());
        console.log("Current Issued (QAU):", ethers.formatUnits(issued, 18));
    } catch (e) {
        console.log("Error fetching data:", e.message);
    }
}

main().catch(console.error);
