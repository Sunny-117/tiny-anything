#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { install } = require('../src/installer');

async function performanceDemo() {
  console.log('⚡ mini-pnpm Performance Demo\n');
  
  // 创建测试项目
  const testDir = path.join(__dirname, 'performance-demo-project');
  await fs.ensureDir(testDir);
  
  // 创建package.json
  const packageJson = {
    "name": "performance-demo",
    "version": "1.0.0",
    "dependencies": {
      "lodash-es": "^4.17.21"
    }
  };
  
  await fs.writeFile(
    path.join(testDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('📁 Created test project with dependencies:');
  console.log('   - lodash-es@^4.17.21');
  
  // 切换到测试目录
  const originalCwd = process.cwd();
  process.chdir(testDir);
  
  try {
    // 测试1: 使用默认设置
    console.log('🔍 Test 1: Default settings (npm registry, unlimited depth)');
    console.log('   Starting installation...');
    
    const startTime1 = Date.now();
    await install({
      registry: 'npm',
      maxDepth: 10,
      maxPackages: 100
    });
    const endTime1 = Date.now();
    
    console.log(`   ⏱️  Time taken: ${endTime1 - startTime1}ms`);
    
    // 清理
    await fs.remove(path.join(testDir, 'node_modules'));
    
    // 测试2: 使用优化设置
    console.log('\n🔍 Test 2: Optimized settings (taobao registry, limited depth)');
    console.log('   Starting installation...');
    
    const startTime2 = Date.now();
    await install({
      registry: 'taobao',
      maxDepth: 2,
      maxPackages: 20
    });
    const endTime2 = Date.now();
    
    console.log(`   ⏱️  Time taken: ${endTime2 - startTime2}ms`);
    
    // 性能对比
    const timeDiff = (endTime1 - startTime1) - (endTime2 - startTime2);
    const improvement = ((endTime1 - startTime1) / (endTime2 - startTime2) - 1) * 100;
    
    console.log('\n📊 Performance Comparison:');
    console.log(`   Default settings: ${endTime1 - startTime1}ms`);
    console.log(`   Optimized settings: ${endTime2 - startTime2}ms`);
    console.log(`   Time saved: ${timeDiff}ms`);
    console.log(`   Performance improvement: ${improvement.toFixed(1)}%`);
    
    console.log('\n✅ Performance demo completed!');
    console.log('\n💡 Optimization tips:');
    console.log('   - Use taobao registry for faster downloads');
    console.log('   - Limit dependency depth to 2-3 levels');
    console.log('   - Limit package count to 20-50 packages');
    console.log('   - These settings provide good balance of speed and completeness');
    
  } catch (error) {
    console.error('❌ Performance demo failed:', error.message);
  } finally {
    process.chdir(originalCwd);
  }
}

performanceDemo(); 