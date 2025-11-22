const path = require('path');
const fs = require('fs');

/**
 * Mini Module Federation Plugin - 超简化版
 *
 * 核心思路：
 * 1. 为 exposes 创建一个真实的入口文件
 * 2. 使用 webpack externals 处理 remotes
 * 3. 通过 runtime 实现 shared singleton
 */
class ModuleFederationPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { name, filename, exposes = {}, remotes = {} } = this.options;

    // 使用 afterEnvironment hook，在 webpack 应用默认配置之前修改
    compiler.hooks.afterEnvironment.tap('ModuleFederationPlugin', () => {
      // 1. 注入 runtime
      this.injectRuntime(compiler);

      // 2. 处理 exposes - 添加新的 entry
      if (Object.keys(exposes).length > 0) {
        this.handleExposes(compiler, name, filename, exposes);
      }

      // 3. 处理 remotes - 配置 externals
      if (Object.keys(remotes).length > 0) {
        this.handleRemotes(compiler, remotes);
      }
    });
  }

  injectRuntime(compiler) {
    const runtimePath = path.resolve(__dirname, './federation-runtime.js');

    // 确保 entry 是对象格式
    if (typeof compiler.options.entry === 'string') {
      const originalEntry = compiler.options.entry;
      compiler.options.entry = {
        main: {
          import: [runtimePath, originalEntry]
        }
      };
    } else if (Array.isArray(compiler.options.entry)) {
      const originalEntry = compiler.options.entry;
      compiler.options.entry = {
        main: {
          import: [runtimePath, ...originalEntry]
        }
      };
    } else if (typeof compiler.options.entry === 'object') {
      // 为每个 entry 添加 runtime
      for (const [key, value] of Object.entries(compiler.options.entry)) {
        if (typeof value === 'string') {
          compiler.options.entry[key] = { import: [runtimePath, value] };
        } else if (Array.isArray(value)) {
          compiler.options.entry[key] = { import: [runtimePath, ...value] };
        } else if (value && typeof value === 'object' && value.import) {
          // 已经是对象格式，添加 runtime 到 import 数组
          const imports = Array.isArray(value.import) ? value.import : [value.import];
          compiler.options.entry[key] = {
            ...value,
            import: [runtimePath, ...imports]
          };
        }
      }
    }
  }

  handleExposes(compiler, name, filename, exposes) {
    const runtimePath = path.resolve(__dirname, './federation-runtime.js');

    // 创建临时目录
    const tempDir = path.join(compiler.context, '.federation-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const entryFilePath = path.join(tempDir, `${name}-expose-entry.js`);

    // 生成入口文件内容 - 使用动态 import
    let content = `// Module Federation Entry for "${name}"\n\n`;
    content += `const modules = {};\n\n`;

    for (const [exposePath, modulePath] of Object.entries(exposes)) {
      // 使用相对路径
      const absolutePath = path.resolve(compiler.context, modulePath);
      const relativePath = path.relative(tempDir, absolutePath).split(path.sep).join('/');
      const finalPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;

      content += `modules['${exposePath}'] = async () => {\n`;
      content += `  const mod = await import('${finalPath}');\n`;
      content += `  return mod;\n`;
      content += `};\n\n`;
    }

    content += `if (typeof window !== 'undefined' && window.__FEDERATION__) {\n`;
    content += `  window.__FEDERATION__.register('${name}', modules);\n`;
    content += `  console.log('[Federation] Registered: ${name}');\n`;
    content += `} else {\n`;
    content += `  console.error('[Federation] Runtime not loaded!');\n`;
    content += `}\n`;

    fs.writeFileSync(entryFilePath, content, 'utf-8');

    // 添加 federation entry，并确保 runtime 先加载
    const entryName = filename.replace('.js', '');
    compiler.options.entry[entryName] = {
      import: [runtimePath, entryFilePath],
      filename: filename
    };
  }

  handleRemotes(compiler, remotes) {
    const remotesMap = {};
    for (const [alias, config] of Object.entries(remotes)) {
      const [remoteName, remoteUrl] = config.split('@');
      remotesMap[alias] = { name: remoteName, url: remoteUrl };
    }
    
    const originalExternals = compiler.options.externals || [];
    const externalsArray = Array.isArray(originalExternals) ? originalExternals : [originalExternals];
    
    externalsArray.push((_context, request, callback) => {
      for (const [alias, remote] of Object.entries(remotesMap)) {
        if (request.startsWith(alias + '/')) {
          const modulePath = './' + request.slice(alias.length + 1);
          return callback(null, `promise new Promise(resolve => {
            window.__FEDERATION__.getRemote('${remote.name}', '${remote.url}', '${modulePath}')
              .then(module => resolve(module))
              .catch(err => { console.error(err); resolve({}); });
          })`);
        }
      }
      callback();
    });
    
    compiler.options.externals = externalsArray;
  }
}

module.exports = ModuleFederationPlugin;
