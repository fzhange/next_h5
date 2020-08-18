//用于 Next 启动服务已经构建阶段，但是不作用于浏览器端。
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const logger = require("./tool_server/logger")(__filename);
const BuildHash = '202008131400';

const stylePlugins = [
  [
    withCSS,
  ],
  [
    withLess,
    {
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    }
  ]
]
const config = {
  webpack: (config, options) => {
    logger.info('options: ',JSON.stringify(options));
    return config;
  },
}

module.exports = withPlugins(stylePlugins,config)

