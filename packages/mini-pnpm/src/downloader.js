const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const tar = require('tar');
const os = require('os');

/**
 * 下载包到临时目录
 */
async function downloadPackage(tarballUrl, packageName, version) {
  const tempDir = path.join(os.tmpdir(), `mini-pnpm-${Date.now()}`);
  await fs.ensureDir(tempDir);
  
  console.log(`⬇️  Downloading ${packageName}@${version}...`);
  
  try {
    // 下载tarball
    const response = await axios({
      method: 'GET',
      url: tarballUrl,
      responseType: 'stream',
      timeout: 30000
    });
    
    const tarballPath = path.join(tempDir, `${packageName}.tgz`);
    const writer = fs.createWriteStream(tarballPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // 解压tarball
    const extractPath = path.join(tempDir, 'extracted');
    await fs.ensureDir(extractPath);
    
    await tar.extract({
      file: tarballPath,
      cwd: extractPath
    });
    
    // 找到package目录（通常是package/目录）
    const extractedDir = await fs.readdir(extractPath);
    const packageDir = path.join(extractPath, extractedDir[0]);
    
    console.log(`✅ Downloaded ${packageName}@${version}`);
    
    return packageDir;
  } catch (error) {
    await fs.remove(tempDir);
    throw new Error(`Failed to download ${packageName}@${version}: ${error.message}`);
  }
}

/**
 * 清理临时目录
 */
async function cleanupTempDir(tempDir) {
  try {
    await fs.remove(tempDir);
  } catch (error) {
    console.warn(`⚠️  Failed to cleanup temp dir: ${error.message}`);
  }
}

module.exports = {
  downloadPackage,
  cleanupTempDir
}; 