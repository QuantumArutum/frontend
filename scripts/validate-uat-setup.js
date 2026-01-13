#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 验证用户验收测试设置...\n');

// 检查必要文件
const requiredFiles = [
  'playwright.config.ts',
  'jest.config.js',
  'jest.setup.js',
  'e2e/user-acceptance-tests/complete-investment-flow.spec.ts',
  'e2e/user-acceptance-tests/payment-methods-validation.spec.ts',
  'e2e/user-acceptance-tests/responsive-design-validation.spec.ts',
  'e2e/user-acceptance-tests/test-execution-report.spec.ts',
  'e2e/user-acceptance-tests/README.md',
  'scripts/run-uat.js'
];

let allFilesExist = true;

console.log('📁 检查必要文件:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// 检查 package.json 中的脚本
console.log('\n📜 检查 package.json 脚本:');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredScripts = [
  'test:uat',
  'test:uat:full',
  'test:uat:report',
  'validate:uat'
];

let allScriptsExist = true;
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`   ${exists ? '✅' : '❌'} ${script}`);
  if (!exists) allScriptsExist = false;
});

// 检查依赖
console.log('\n📦 检查测试依赖:');
const requiredDeps = [
  '@playwright/test',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  'jest',
  'jest-environment-jsdom'
];

let allDepsExist = true;
requiredDeps.forEach(dep => {
  const exists = (packageJson.devDependencies && packageJson.devDependencies[dep]) ||
                 (packageJson.dependencies && packageJson.dependencies[dep]);
  console.log(`   ${exists ? '✅' : '❌'} ${dep}`);
  if (!exists) allDepsExist = false;
});

// 检查目录结构
console.log('\n📂 检查目录结构:');
const requiredDirs = [
  'e2e',
  'e2e/user-acceptance-tests',
  'scripts'
];

let allDirsExist = true;
requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  console.log(`   ${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) allDirsExist = false;
});

// 生成验证报告
console.log('\n📊 验证结果:');
const validationResults = {
  files: allFilesExist,
  scripts: allScriptsExist,
  dependencies: allDepsExist,
  directories: allDirsExist
};

const overallSuccess = Object.values(validationResults).every(result => result);

console.log(`   文件完整性: ${validationResults.files ? '✅ 通过' : '❌ 失败'}`);
console.log(`   脚本配置: ${validationResults.scripts ? '✅ 通过' : '❌ 失败'}`);
console.log(`   依赖安装: ${validationResults.dependencies ? '✅ 通过' : '❌ 失败'}`);
console.log(`   目录结构: ${validationResults.directories ? '✅ 通过' : '❌ 失败'}`);

console.log(`\n🎯 总体状态: ${overallSuccess ? '✅ 验证通过' : '❌ 验证失败'}`);

if (overallSuccess) {
  console.log('\n🚀 用户验收测试环境已就绪！');
  console.log('\n📋 下一步操作:');
  console.log('   1. 启动开发服务器: npm run dev');
  console.log('   2. 执行完整UAT: npm run test:uat:full');
  console.log('   3. 查看测试报告: test-results/uat-summary-report.html');
} else {
  console.log('\n⚠️ 请修复上述问题后重新验证');
  console.log('\n🔧 修复建议:');
  
  if (!validationResults.files) {
    console.log('   - 确保所有测试文件已正确创建');
  }
  
  if (!validationResults.scripts) {
    console.log('   - 检查 package.json 中的测试脚本配置');
  }
  
  if (!validationResults.dependencies) {
    console.log('   - 运行 npm install 安装缺失的依赖');
  }
  
  if (!validationResults.directories) {
    console.log('   - 创建缺失的目录结构');
  }
}

// 保存验证报告
const reportPath = path.join(__dirname, '..', 'test-results');
if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, { recursive: true });
}

const validationReport = {
  timestamp: new Date().toISOString(),
  results: validationResults,
  overallSuccess,
  requiredFiles,
  requiredScripts,
  requiredDeps,
  requiredDirs
};

fs.writeFileSync(
  path.join(reportPath, 'uat-setup-validation.json'),
  JSON.stringify(validationReport, null, 2)
);

console.log(`\n📄 验证报告已保存: test-results/uat-setup-validation.json`);

process.exit(overallSuccess ? 0 : 1);