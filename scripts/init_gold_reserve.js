const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Custom Provider to fix timestamp issue
class QuantaureumProvider extends ethers.JsonRpcProvider {
    async send(method, params) {
        const result = await super.send(method, params);
        
        // Fix timestamp in block results
        if ((method === 'eth_getBlockByNumber' || method === 'eth_getBlockByHash') && result) {
            // console.log("Debug: Fixing block", result.number); // Comment out to reduce noise
            
            // Fix missing difficulty/gasLimit for Ethers v6 compatibility
            if (!result.difficulty) result.difficulty = "0x0";
            if (!result.gasLimit) result.gasLimit = "0x1fffffffffffff"; // Large limit
            if (!result.baseFeePerGas) result.baseFeePerGas = "0x0"; 
            if (!result.extraData) result.extraData = "0x";
            if (!result.nonce) result.nonce = "0x0000000000000000";
            if (!result.mixHash) result.mixHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

            if (result.timestamp && typeof result.timestamp === 'string' && result.timestamp.length > 12) {
                const bigTs = BigInt(result.timestamp);
                const seconds = bigTs / 1000000000n;
                result.timestamp = "0x" + seconds.toString(16);
            }

            // Fix transactions in block
            if (result.transactions && Array.isArray(result.transactions)) {
                result.transactions.forEach(tx => {
                    if (typeof tx === 'object') {
                        // console.log("Debug: Checking tx", tx.hash);
                        if (tx.value === '0x') tx.value = '0x0';
                        if (tx.gas === '0x') tx.gas = '0x0';
                        if (tx.gasPrice === '0x') tx.gasPrice = '0x0';
                        if (tx.nonce === '0x') tx.nonce = '0x0';
                        if (tx.v === '0x') tx.v = '0x0';
                        if (tx.r === '0x') tx.r = '0x0';
                        if (tx.s === '0x') tx.s = '0x0';
                        // Also check type, chainId etc if they are 0x
                        if (tx.type === '0x') tx.type = '0x0';
                        if (tx.chainId === '0x') tx.chainId = '0x0';
                        
                        // Fix for other potential fields
                        if (tx.maxFeePerGas === '0x') tx.maxFeePerGas = '0x0';
                        if (tx.maxPriorityFeePerGas === '0x') tx.maxPriorityFeePerGas = '0x0';
                        if (tx.blockNumber === '0x') tx.blockNumber = '0x0';
                        if (tx.transactionIndex === '0x') tx.transactionIndex = '0x0';

                        // Polyfill missing signature fields (Quantaureum node might omit them or use different scheme)
                        if (!tx.r) tx.r = "0x0000000000000000000000000000000000000000000000000000000000000001";
                        if (!tx.s) tx.s = "0x0000000000000000000000000000000000000000000000000000000000000001";
                        if (!tx.v) tx.v = "0x1b";
                        if (!tx.yParity) tx.yParity = "0x0"; // Ethers v6 might look for this

                        // Debug: check if any field is still "0x"
                        for (const key in tx) {
                            if (tx[key] === '0x') {
                                console.log(`Debug: Found 0x in tx ${tx.hash} field ${key}`);
                                tx[key] = '0x0'; // Auto-fix
                            }
                        }
                    }
                });
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
        throw new Error("deployment.json not found. Run deploy.js first.");
    }
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log("GoldReserve Address:", deploymentInfo.GoldReserve);

    // Load signer (Validator 1)
    const fallbackPk = "0x540e1b0a5673ded9aa84ee6d541fe22754b382bc59666a95734ee96ab66f8755";
    const signer = new ethers.Wallet(fallbackPk, provider);
    console.log("Signer:", signer.address);

    // ABI
    const GoldReserveABI = [
        "function certifyGoldDeposit(uint256 amount, string memory auditRef) external",
        "function issueQAU(address payable to, uint256 amount, string memory auditRef) external",
        "function totalGoldReserve() view returns (uint256)",
        "function totalQAUIssued() view returns (uint256)"
    ];

    const goldReserve = new ethers.Contract(deploymentInfo.GoldReserve, GoldReserveABI, signer);

    // 1. Certify Gold Deposit (Auditor is deployer/signer in deploy.js)
    console.log("Certifying Gold Deposit...");
    // Deposit 100,000,000 grams (Total Initial Supply according to economics.json)
    const depositAmount = 100000000;
    try {
        const tx1 = await goldReserve.certifyGoldDeposit(depositAmount, "AUDIT-2025-GENESIS-FULL");
        await tx1.wait();
        console.log("Certified 100,000,000g Gold.");
    } catch (e) {
        console.log("Certification failed (maybe not auditor?):", e.message);
    }

    // 2. Issue QAU (Genesis Distribution only, rest is mined/vested)
    console.log("Issuing QAU...");
    // Issue 72,000,000 QAU (Genesis Allocation)
    const issueAmount = ethers.parseUnits("72000000", 18);
    
    // Check contract balance first (it needs native tokens to back QAU if QAU is native-like in this logic)
    // In GoldReserve.sol logic: issueQAU transfers native value. 
    // Wait, the GoldReserve contract needs to HOLD native coins to send them?
    // Let's check issueQAU:
    // function issueQAU(address payable to, uint256 amount, string memory auditRef) external onlyOwner {
    //    require(address(this).balance >= amount, "Insufficient QAU in reserve");
    //    (bool sent, ) = to.call{value: amount}("");
    // }
    
    // So the contract must have balance.
    // Let's fund the contract first.
    console.log("Funding contract...");
    const txFund = await signer.sendTransaction({
        to: deploymentInfo.GoldReserve,
        value: issueAmount
    });
    await txFund.wait();
    console.log("Contract funded.");

    try {
        const tx2 = await goldReserve.issueQAU(deploymentInfo.Treasury, issueAmount, "MINT-GENESIS");
        await tx2.wait();
        console.log("Issued 72,000,000 QAU to Treasury.");
    } catch (e) {
        console.log("Issuance failed:", e.message);
    }

    // Check status
    const reserve = await goldReserve.totalGoldReserve();
    const issued = await goldReserve.totalQAUIssued();
    console.log("Current Reserve (g):", reserve.toString());
    console.log("Current Issued (QAU):", ethers.formatUnits(issued, 18));
}

main().catch(console.error);
