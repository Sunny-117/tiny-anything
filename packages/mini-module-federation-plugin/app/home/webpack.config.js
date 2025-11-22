const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 8080
  },
  output: {
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      // 模块联邦的名称
      // 该名称将成为一个全部变量，通过该变量将可获取当前联邦的所有暴露模块
      name: 'home',
      // 模块联邦生成的文件名，全部变量将置入到该文件中
      filename: 'home-entry.js',
      // 模块联邦暴露的所有模块
      exposes: {
        // key：相对于模块联邦的路径
        // 这里的 ./now 将决定该模块的访问路径为 home/now
        // value: 模块的具体路径
        './now': './src/now.js',
      },
      remotes: {
        // key: 自定义远程暴露的联邦名
        // 比如为 abc， 则之后引用该联邦的模块则使用 import "abc/模块名"
        // value: 模块联邦名@模块联邦访问地址
        // 远程访问时，将从下面的地址加载
        active: 'active@http://localhost:3000/active-entry.js',
      },
      shared: {
        // jquery为共享模块
        jquery: {
          singleton: true, // 全局唯一
        },
      },
    }),
  ],
};
