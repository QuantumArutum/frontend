const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');

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
    // 1. Connect to local node using Custom Provider
    const provider = new QuantaureumProvider('http://localhost:8545');
    
    let signer;
    try {
        // Try to read test accounts
        const testAccPath = path.join(__dirname, '../testnet/test_accounts.json');
        console.log("Checking for test accounts at:", testAccPath);
        
        if (fs.existsSync(testAccPath)) {
            console.log("File exists. Reading...");
            const content = fs.readFileSync(testAccPath, 'utf8');
            const testAccs = JSON.parse(content);
            console.log("Found accounts:", testAccs.length);
            
            if (testAccs.length > 0) {
                // Check if privateKey needs 0x prefix
                let pk = testAccs[0].privateKey;
                // Trim potential whitespace
                pk = pk.trim();
                
                if (pk.length > 100) {
                    console.log("Private key seems to be non-standard (Dilithium?). Ethers cannot use it.");
                    throw new Error("Non-standard private key");
                }

                if (!pk.startsWith('0x')) pk = '0x' + pk;
                signer = new ethers.Wallet(pk, provider);
                console.log("Using test account:", signer.address);
            }
        } else {
            console.log("Test accounts file not found.");
        }
    } catch (e) {
        console.log("Could not use test accounts:", e.message);
        console.log("Using a deterministic fallback account (Validator 1)...");
        // Validator 1 key from keys/validator1.key
        const fallbackPk = "0x540e1b0a5673ded9aa84ee6d541fe22754b382bc59666a95734ee96ab66f8755";
        signer = new ethers.Wallet(fallbackPk, provider);
    }

    const signerAddress = await signer.getAddress();
    console.log("Deploying with account:", signerAddress);
    
    const balance = await provider.getBalance(signerAddress);
    console.log("Account balance:", balance.toString());

    if (balance === 0n) {
        console.log("WARNING: Account has 0 balance. Deployment will fail.");
        console.log("Please fund this address: " + signerAddress);
        // We will try to proceed, but it will likely fail.
        // In a real dev env, we might want to auto-fund from a genesis key if available.
    }

    // 2. Compile Contracts
    const contractsPath = path.resolve(__dirname, '../contracts');
    const goldReservePath = path.join(contractsPath, 'GoldReserve.sol');
    const qauSalePath = path.join(contractsPath, 'QAUSale.sol');
    const mockERC20Path = path.join(contractsPath, 'MockERC20.sol');

    const sources = {
        'GoldReserve.sol': { content: fs.readFileSync(goldReservePath, 'utf8') },
        'QAUSale.sol': { content: fs.readFileSync(qauSalePath, 'utf8') },
        'MockERC20.sol': { content: fs.readFileSync(mockERC20Path, 'utf8') }
    };

    const input = {
        language: 'Solidity',
        sources: sources,
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    console.log("Compiling contracts...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
        let hasError = false;
        output.errors.forEach(err => {
            if (err.severity === 'error') hasError = true;
            console.log(err.formattedMessage);
        });
        if (hasError) throw new Error("Compilation failed");
    }

    const GoldReserve = output.contracts['GoldReserve.sol']['GoldReserve'];
    const QAUSale = output.contracts['QAUSale.sol']['QAUSale'];
    const MockERC20 = output.contracts['MockERC20.sol']['MockERC20'];

    // 3. Deploy
    console.log("Deploying GoldReserve...");
    let nonce = await provider.getTransactionCount(signerAddress);
    console.log("Current Nonce:", nonce);
    
    const GoldReserveFactory = new ethers.ContractFactory(GoldReserve.abi, GoldReserve.evm.bytecode, signer);
    
    // Gas Overrides
    const overrides = {
        gasLimit: 5000000,
        gasPrice: 1000000000, // 1 Gwei
        nonce: nonce
    };
    
    // Increment manually for next txs to ensure correct sequence if node is slow to update
    let currentNonce = nonce;

    // Auditor address - 审计员地址
    const auditor = "0x060e2bbf962381d67fCc56c8667611A2c08f9e70"; 
    const goldReserve = await GoldReserveFactory.deploy(auditor, overrides);
    console.log("Waiting for GoldReserve deployment...");
    await new Promise(r => setTimeout(r, 15000)); // Wait 15 seconds
    const goldReserveAddr = await goldReserve.getAddress();
    console.log("GoldReserve deployed to:", goldReserveAddr);

    currentNonce++;
    overrides.nonce = currentNonce;
    console.log("Deploying MockUSDT with nonce:", currentNonce);
    const MockERC20Factory = new ethers.ContractFactory(MockERC20.abi, MockERC20.evm.bytecode, signer);
    const mockUSDT = await MockERC20Factory.deploy("Tether USD", "USDT", 6, overrides);
    console.log("Waiting for MockUSDT deployment...");
    await new Promise(r => setTimeout(r, 15000));
    const mockUSDTAddr = await mockUSDT.getAddress();
    console.log("MockUSDT deployed to:", mockUSDTAddr);

    currentNonce++;
    overrides.nonce = currentNonce;
    console.log("Deploying QAUSale with nonce:", currentNonce);
    const QAUSaleFactory = new ethers.ContractFactory(QAUSale.abi, QAUSale.evm.bytecode, signer);
    
    // Params: _goldReserve, _paymentToken, _treasury, _feeBasisPoints, _initialPrice
    // 使用配置的地址
    const treasury = "0xA71B122B0cEB23F80310f533bc443FfD8150478f"; // Treasury 收款地址
    const feeBps = 50; // 0.5% 手续费
    const initialPrice = 75000000; // $75.00 * 10^6 (assuming 6 decimals for USDT)
    
    const qauSale = await QAUSaleFactory.deploy(
        goldReserveAddr,
        mockUSDTAddr,
        treasury,
        feeBps,
        initialPrice,
        overrides
    );
    console.log("Waiting for QAUSale deployment...");
    await new Promise(r => setTimeout(r, 15000));
    const qauSaleAddr = await qauSale.getAddress();
    console.log("QAUSale deployed to:", qauSaleAddr);

    // Write addresses to file
    const deploymentInfo = {
        GoldReserve: goldReserveAddr,
        MockUSDT: mockUSDTAddr,
        QAUSale: qauSaleAddr,
        Treasury: treasury,
        Network: "Quantaureum Local"
    };
    
    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log("Deployment info saved to deployment.json");

}

main().catch(console.error);
