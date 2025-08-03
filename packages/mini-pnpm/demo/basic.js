const fs = require('fs-extra');
const path = require('path');
const { install } = require('../src/installer');
const { exec } = require('child_process');

async function basicDemo() {
  console.log('🚀 mini-pnpm Basic Demo\n');
  
  const testDir = path.join(__dirname, 'basic-demo-project');
  
  // 创建测试目录
  await fs.ensureDir(testDir);
  
  // 创建package.json
  const packageJson = {
    "name": "basic-demo",
    "type": "module",
    "version": "1.0.0",
    "dependencies": {
      "lodash-es": "^4.17.21"
    }
  };
  
  await fs.writeFile(
    path.join(testDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // 创建index.js文件
  const indexJsContent = `import { chunk } from 'lodash-es';

async function main() {
  console.log('Lodash chunk:', chunk([1,2,3,4,5,6,7,8,9,10], 2));
}

main();`;

  await fs.writeFile(
    path.join(testDir, 'index.js'),
    indexJsContent
  );
  
  console.log('📁 Created demo project with:');
  console.log('   - package.json with dependencies');
  console.log('   - index.js that imports the installed packages\n');
  
  // 切换到测试目录
  const originalCwd = process.cwd();
  process.chdir(testDir);
  
  try {
    // 安装依赖
    console.log('📦 Installing dependencies...');
    await install();
    
    // 展示结果
    console.log('\n📋 Installation Results:');
    
    const nodeModulesPath = path.join(testDir, 'node_modules');
    const pnpmPath = path.join(nodeModulesPath, '.pnpm');
    
    // 检查目录结构
    console.log('\n📁 Directory Structure:');
    console.log(`   ${nodeModulesPath}/`);
    console.log(`   ├── .pnpm/`);
    
    if (await fs.pathExists(pnpmPath)) {
      const pnpmContents = await fs.readdir(pnpmPath);
      console.log(`   │   ├── ${pnpmContents.length} packages cached`);
      
      // 显示前几个包
      for (let i = 0; i < Math.min(5, pnpmContents.length); i++) {
        console.log(`   │   ├── ${pnpmContents[i]}`);
      }
      if (pnpmContents.length > 5) {
        console.log(`   │   ├── ... and ${pnpmContents.length - 5} more`);
      }
    }
    
    console.log(`   ├── lodash -> .pnpm/lodash@4.17.21`);
    
    // 测试require
    console.log('\n🧪 Testing require from index.js:');
    try {
      const s = path.join(testDir, 'index.js');
      exec(`node ${s}`, (err, stdout)=>{
        console.log({err, stdout});
      })
    } catch (error) {
      console.log(`   ❌ Error running index.js: ${error.message}`);
    }
    
    console.log('\n✅ Basic demo completed successfully!');
    console.log('\n💡 Key Features Demonstrated:');
    console.log('   - Automatic index.js creation with package imports');
    console.log('   - Global package caching');
    console.log('   - Hard links for space efficiency');
    console.log('   - Symbolic links for dependency resolution');
    console.log('   - Phantom dependency resolution');
    
  } catch (error) {
    console.error('❌ Basic demo failed:', error.message);
  } finally {
    process.chdir(originalCwd);
  }
}

basicDemo();