const { ethers } = require('ethers');

const addresses = {
  'Validator 1': '0x02B7947CcE9E8c00F38D34C7ae860eF0355a6f2B',
  'Validator 2': '0xfbA0A79F802622322D87f9534bf2C948ea3240B4',
  'Validator 3': '0x490fE6181994f40222bFe01f6845a8496cdDCF82',
  Treasury: '0xA71B122B0cEB23F80310f533bc443FfD8150478f',
  Auditor: '0x060e2bbf962381d67fCc56c8667611A2c08f9e70',
  'Public Sale (21.6M)': '0x1004E86c182dBd670eEabE500BA194da836FBd93',
  'Private Sale (14.4M)': '0x48F458c01Ce896292E0Effdea3D55129d51c7510',
  'Team & Advisors (10.8M)': '0x28f5C897634987cc33357900Fe5aa77Af951c378',
  'Ecosystem Fund (10.8M)': '0x7f7e031489128775c2847f04e466A8FEdEC49e2e',
  'Community Airdrops (7.2M)': '0x54eb714F120180358C1AdB1180BB079fCa13EcE9',
  'Development Fund (7.2M)': '0xF79Ccc21953a7f73eCfda63533e1A6Fe49f0ea36',
  'Validator Incentive (20M)': '0x75C490Bc914E406fe1451d4F442456F70D5F1E07',
  'Foundation Reserve (8M)': '0xE9eFDcE8D31E64fEE97fd1A3e5A7387e016348Bb',
  'Fee Receiver': '0x5fe30D65160d72f59005EE520ecD023035b42fe6',
};

async function main() {
  const provider = new ethers.JsonRpcProvider('http://localhost:8545');
  let total = 0n;

  console.log('\n=== 地址余额检查 ===\n');

  for (const [name, addr] of Object.entries(addresses)) {
    const balance = await provider.getBalance(addr);
    const qau = ethers.formatEther(balance);
    total += balance;
    console.log(`${name.padEnd(30)} ${addr}  ${Number(qau).toLocaleString()} QAU`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`总计: ${Number(ethers.formatEther(total)).toLocaleString()} QAU`);
}

main().catch(console.error);
