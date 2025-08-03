const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

/**
 * 解析版本范围
 */
function resolveVersionRange(versionRange, availableVersions) {
  if (versionRange === 'latest') {
    return 'latest';
  }
  
  // 处理 * 版本号（接受任何版本）
  if (versionRange === '*') {
    return availableVersions[availableVersions.length - 1]; // 返回最新版本
  }
  
  // 处理单个数字版本号（如 "1" -> "1.0.0"）
  if (/^\d+$/.test(versionRange)) {
    const major = parseInt(versionRange);
    // 查找匹配的主版本号
    for (const version of availableVersions) {
      const [vMajor] = version.split('.').map(v => parseInt(v));
      if (vMajor === major) {
        return version;
      }
    }
    // 如果没找到，返回最新版本
    return availableVersions[availableVersions.length - 1];
  }
  
  // 如果是具体版本号，直接返回
  if (!versionRange.includes('^') && !versionRange.includes('~') && !versionRange.includes('>') && !versionRange.includes('<') && !versionRange.includes('*')) {
    return versionRange;
  }
  
  // 简单的版本范围解析（这里只处理 ^ 和 ~）
  const cleanVersion = versionRange.replace(/^[\^~]/, '');
  const major = parseInt(cleanVersion.split('.')[0]);
  const minor = parseInt(cleanVersion.split('.')[1]);
  const patch = parseInt(cleanVersion.split('.')[2]);
  
  let bestVersion = null;
  
  for (const version of availableVersions) {
    const [vMajor, vMinor, vPatch] = version.split('.').map(v => parseInt(v));
    
    if (versionRange.startsWith('^')) {
      // ^4.17.21 表示 >=4.17.21 <5.0.0
      if (vMajor === major && vMinor >= minor && vPatch >= patch) {
        if (!bestVersion || version > bestVersion) {
          bestVersion = version;
        }
      }
    } else if (versionRange.startsWith('~')) {
      // ~4.17.21 表示 >=4.17.21 <4.18.0
      if (vMajor === major && vMinor === minor && vPatch >= patch) {
        if (!bestVersion || version > bestVersion) {
          bestVersion = version;
        }
      }
    }
  }
  
  return bestVersion || availableVersions[availableVersions.length - 1];
}

// 配置registry
const REGISTRY_CONFIG = {
  npm: 'https://registry.npmjs.org',
  taobao: 'https://registry.npmmirror.com'
};

let currentRegistry = REGISTRY_CONFIG.npm;

/**
 * 设置registry
 */
function setRegistry(registry) {
  if (registry === 'taobao' || registry === 'npmmirror') {
    currentRegistry = REGISTRY_CONFIG.taobao;
  } else if (registry === 'npm') {
    currentRegistry = REGISTRY_CONFIG.npm;
  } else {
    currentRegistry = registry;
  }
  console.log(`📦 Using registry: ${currentRegistry}`);
}

/**
 * 从registry获取包信息
 */
async function getPackageInfo(packageName, version = 'latest') {
  try {
    const response = await axios.get(`${currentRegistry}/${packageName}`, {
      timeout: 10000
    });
    const packageData = response.data;
    
    let resolvedVersion = version;
    
    if (version === 'latest') {
      resolvedVersion = packageData['dist-tags'].latest;
    } else {
      // 解析版本范围
      const availableVersions = Object.keys(packageData.versions).sort();
      resolvedVersion = resolveVersionRange(version, availableVersions);
    }
    
    const versionData = packageData.versions[resolvedVersion];
    if (!versionData) {
      throw new Error(`Version ${resolvedVersion} not found for package ${packageName}`);
    }
    
    return {
      name: packageName,
      version: resolvedVersion,
      dependencies: versionData.dependencies || {},
      devDependencies: versionData.devDependencies || {},
      tarball: versionData.dist.tarball,
      integrity: versionData.dist.integrity
    };
  } catch (error) {
    throw new Error(`Failed to get package info for ${packageName}@${version}: ${error.message}`);
  }
}

/**
 * 解析依赖树
 */
async function resolveDependencies(packages, resolved = new Map(), depth = 0, options = {}) {
  const maxDepth = options.maxDepth || 3; // 默认只解析3层深度
  const maxPackages = options.maxPackages || 50; // 最大包数量限制
  
  if (depth > maxDepth) {
    console.warn(`⚠️  Maximum dependency depth reached (${maxDepth}), skipping deeper dependencies`);
    return resolved;
  }
  
  if (resolved.size >= maxPackages) {
    console.warn(`⚠️  Maximum package count reached (${maxPackages}), skipping remaining dependencies`);
    return resolved;
  }
  
  for (const [packageName, version] of packages) {
    const key = `${packageName}@${version}`;
    
    if (resolved.has(key)) {
      continue;
    }
    
    console.log(`🔍 Resolving ${packageName}@${version}...`);
    
    try {
      const packageInfo = await getPackageInfo(packageName, version);
      resolved.set(key, packageInfo);
      
      // 递归解析依赖（只在深度限制内）
      if (depth < maxDepth && packageInfo.dependencies && Object.keys(packageInfo.dependencies).length > 0) {
        const deps = new Map(Object.entries(packageInfo.dependencies));
        await resolveDependencies(deps, resolved, depth + 1, options);
      }
    } catch (error) {
      console.error(`❌ Failed to resolve ${packageName}@${version}: ${error.message}`);
      throw error;
    }
  }
  
  return resolved;
}

/**
 * 读取package.json文件
 */
async function readPackageJson(projectPath = '.') {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!await fs.pathExists(packageJsonPath)) {
    throw new Error('package.json not found');
  }
  
  const content = await fs.readFile(packageJsonPath, 'utf8');
  return JSON.parse(content);
}

/**
 * 获取项目依赖
 */
async function getProjectDependencies(projectPath = '.') {
  const packageJson = await readPackageJson(projectPath);
  
  const dependencies = new Map();
  
  // 合并所有依赖
  if (packageJson.dependencies) {
    Object.entries(packageJson.dependencies).forEach(([name, version]) => {
      dependencies.set(name, version);
    });
  }
  
  if (packageJson.devDependencies) {
    Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
      dependencies.set(name, version);
    });
  }
  
  return dependencies;
}

module.exports = {
  getPackageInfo,
  resolveDependencies,
  readPackageJson,
  getProjectDependencies,
  setRegistry
}; 