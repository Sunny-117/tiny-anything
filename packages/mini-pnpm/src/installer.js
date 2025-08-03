const fs = require('fs-extra');
const path = require('path');
const { 
  ensureStoreExists, 
  isPackageInStore, 
  savePackageToStore, 
  getPackageFromStore,
  createHardLink,
  createSymlink
} = require('./store');
const { resolveDependencies, getProjectDependencies, setRegistry } = require('./resolver');
const { downloadPackage, cleanupTempDir } = require('./downloader');

/**
 * 创建node_modules结构
 */
async function createNodeModulesStructure(projectPath) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  const pnpmPath = path.join(nodeModulesPath, '.pnpm');
  
  // 清理现有的node_modules
  if (await fs.pathExists(nodeModulesPath)) {
    await fs.remove(nodeModulesPath);
  }
  
  // 创建目录结构
  await fs.ensureDir(nodeModulesPath);
  await fs.ensureDir(pnpmPath);
  
  return { nodeModulesPath, pnpmPath };
}

/**
 * 安装单个包
 */
async function installPackage(packageInfo, pnpmPath, nodeModulesPath) {
  const { name, version, tarball } = packageInfo;
  const packageKey = `${name}@${version}`;
  
  console.log(`📦 Installing ${packageKey}...`);
  
  let packagePath;
  
  // 检查是否已在store中
  if (await isPackageInStore(name, version)) {
    console.log(`📦 Using cached ${packageKey}`);
    packagePath = await getPackageFromStore(name, version);
  } else {
    // 下载包
    const tempPackagePath = await downloadPackage(tarball, name, version);
    
    // 保存到store
    await savePackageToStore(name, version, tempPackagePath);
    packagePath = await getPackageFromStore(name, version);
    
    // 清理临时文件
    await cleanupTempDir(path.dirname(tempPackagePath));
  }
  
  // 在.pnpm目录中创建硬链接
  const pnpmPackagePath = path.join(pnpmPath, packageKey);
  await createHardLink(packagePath, pnpmPackagePath);
  
  // 在node_modules根目录创建符号链接（直接依赖）
  const nodeModulesPackagePath = path.join(nodeModulesPath, name);
  await createSymlink(pnpmPackagePath, nodeModulesPackagePath);
  
  return pnpmPackagePath;
}

/**
 * 解决幽灵依赖
 */
async function resolvePhantomDependencies(packages, pnpmPath, nodeModulesPath) {
  console.log('🔗 Resolving phantom dependencies...');
  
  // 收集所有间接依赖
  const allDependencies = new Set();
  
  for (const [packageKey, packageInfo] of packages) {
    if (packageInfo.dependencies) {
      for (const [depName, depVersion] of Object.entries(packageInfo.dependencies)) {
        allDependencies.add(`${depName}@${depVersion}`);
      }
    }
  }
  
  // 为每个间接依赖创建符号链接
  for (const depKey of allDependencies) {
    const [depName, depVersion] = depKey.split('@');
    
    // 检查是否已作为直接依赖安装
    const directDepPath = path.join(nodeModulesPath, depName);
    if (await fs.pathExists(directDepPath)) {
      continue; // 跳过直接依赖
    }
    
    // 在.pnpm/node_modules中创建符号链接
    const phantomPath = path.join(pnpmPath, 'node_modules', depName);
    const sourcePath = path.join(pnpmPath, depKey);
    
    if (await fs.pathExists(sourcePath)) {
      await createSymlink(sourcePath, phantomPath);
    }
  }
}

/**
 * 安装单个包
 */
async function installSinglePackage(packageName, version = 'latest', options = {}) {
  const projectPath = process.cwd();
  
  console.log(`🚀 Installing ${packageName}@${version}...`);
  
  try {
    // 设置registry
    if (options.registry) {
      setRegistry(options.registry);
    }
    
    // 确保store存在
    await ensureStoreExists();
    
    // 解析单个包
    console.log('🔍 Resolving package...');
    const packageDeps = new Map([[packageName, version]]);
    const resolvedPackages = await resolveDependencies(packageDeps, new Map(), 0, {
      maxDepth: options.maxDepth || 3,
      maxPackages: options.maxPackages || 50
    });
    
    // 创建node_modules结构
    const { nodeModulesPath, pnpmPath } = await createNodeModulesStructure(projectPath);
    
    // 安装包
    console.log('📦 Installing package...');
    for (const [packageKey, packageInfo] of resolvedPackages) {
      await installPackage(packageInfo, pnpmPath, nodeModulesPath);
    }
    
    // 解决幽灵依赖
    await resolvePhantomDependencies(resolvedPackages, pnpmPath, nodeModulesPath);
    
    console.log(`✅ ${packageName}@${version} installed successfully!`);
    
  } catch (error) {
    console.error(`❌ Failed to install ${packageName}@${version}:`, error.message);
    throw error;
  }
}

/**
 * 主安装函数
 */
async function install(options = {}) {
  const projectPath = process.cwd();
  
  console.log('🚀 Starting mini-pnpm installation...');
  
  try {
    // 设置registry
    if (options.registry) {
      setRegistry(options.registry);
    }
    
    // 确保store存在
    await ensureStoreExists();
    
    // 获取项目依赖
    const projectDeps = await getProjectDependencies(projectPath);
    
    if (projectDeps.size === 0) {
      console.log('📝 No dependencies found in package.json');
      return;
    }
    
    // 解析依赖树
    console.log('🔍 Resolving dependencies...');
    const resolvedPackages = await resolveDependencies(projectDeps, new Map(), 0, {
      maxDepth: options.maxDepth || 3,
      maxPackages: options.maxPackages || 50
    });
    
    // 创建node_modules结构
    const { nodeModulesPath, pnpmPath } = await createNodeModulesStructure(projectPath);
    
    // 安装所有包
    console.log('📦 Installing packages...');
    for (const [packageKey, packageInfo] of resolvedPackages) {
      await installPackage(packageInfo, pnpmPath, nodeModulesPath);
    }
    
    // 解决幽灵依赖
    await resolvePhantomDependencies(resolvedPackages, pnpmPath, nodeModulesPath);
    
    console.log('✅ Installation completed!');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    throw error;
  }
}

module.exports = {
  install,
  installSinglePackage
}; 