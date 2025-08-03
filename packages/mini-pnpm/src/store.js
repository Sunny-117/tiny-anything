const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// 全局store路径
const STORE_PATH = path.join(os.homedir(), '.mini-pnpm', 'store');

/**
 * 获取store路径
 */
function getStorePath() {
  return STORE_PATH;
}

/**
 * 确保store目录存在
 */
async function ensureStoreExists() {
  await fs.ensureDir(STORE_PATH);
}

/**
 * 生成包的store key
 */
function getStoreKey(packageName, version) {
  const content = `${packageName}@${version}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 8);
}

/**
 * 获取包在store中的路径
 */
function getPackageStorePath(packageName, version) {
  const storeKey = getStoreKey(packageName, version);
  return path.join(STORE_PATH, storeKey);
}

/**
 * 检查包是否已在store中
 */
async function isPackageInStore(packageName, version) {
  const packagePath = getPackageStorePath(packageName, version);
  return await fs.pathExists(packagePath);
}

/**
 * 将包保存到store中
 */
async function savePackageToStore(packageName, version, packagePath) {
  const storePath = getPackageStorePath(packageName, version);
  await fs.copy(packagePath, storePath);
  console.log(`📦 Cached ${packageName}@${version} in store`);
}

/**
 * 从store中获取包
 */
async function getPackageFromStore(packageName, version) {
  const storePath = getPackageStorePath(packageName, version);
  if (await fs.pathExists(storePath)) {
    return storePath;
  }
  return null;
}

/**
 * 创建硬链接
 */
async function createHardLink(source, target) {
  try {
    await fs.ensureDir(path.dirname(target));
    await fs.link(source, target);
    return true;
  } catch (error) {
    console.warn(`⚠️  Failed to create hard link: ${error.message}`);
    // 如果硬链接失败，回退到复制
    await fs.copy(source, target);
    return false;
  }
}

/**
 * 创建符号链接
 */
async function createSymlink(source, target) {
  try {
    await fs.ensureDir(path.dirname(target));
    await fs.symlink(source, target);
    return true;
  } catch (error) {
    console.warn(`⚠️  Failed to create symlink: ${error.message}`);
    return false;
  }
}

module.exports = {
  getStorePath,
  ensureStoreExists,
  getStoreKey,
  getPackageStorePath,
  isPackageInStore,
  savePackageToStore,
  getPackageFromStore,
  createHardLink,
  createSymlink
}; 