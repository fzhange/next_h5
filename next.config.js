//用于 Next 启动服务已经构建阶段，但是不作用于浏览器端。
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSourceMaps = require('@zeit/next-source-maps')
const withPlugins = require('next-compose-plugins');
const SentryCliPlugin = require('@sentry/webpack-plugin')
const logger = require("./tool_server/logger")(__filename);
const {baseUrl} = require("./config.json");
const ENV = process.env.NODE_ENV;
const {SENTRY_URL_PREFIX,RELEASE_ID} = require('./config.json');

logger.info('process.env.NODE_ENV : ', ENV);


const stylePlugins = [
  [ 
    withCSS,
    {
      cssModules: false,
      cssLoaderOptions: {
        importLoaders: 1,
        minimize:true,
        // localIdentName: "[local]___[hash:base64:5]",
      }
    }
  ],
  [
    /** 
     * The stylesheet is compiled to .next/static/css
     * 如果开启cssModule 会导致ant-design-mobile 样式匹配结果错乱；所以需要关闭
    */
    withLess,  
    {
      cssModules:false, //http://www.ruanyifeng.com/blog/2016/06/css_modules.html CSS Modules 用法教程
      cssLoaderOptions:{
        importLoaders: 1,
        minimize:true,
        // localIdentName: "[local]___[hash:base64:5]", //localIdentName  CSS-Module 定制哈希类名
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    }
  ],[
    withSourceMaps
  ]
]
const config = {
  basePath:baseUrl,
  // assetPrefix: ENV == "production" ? baseUrl : "",
  // async rewrites() {
  //   return [
  //     {
  //       source: `${baseUrl}/:slug*`,
  //       destination: '/:slug*',
  //     },
  //   ]
  // },
  env:{ 
    RELEASE_ID:RELEASE_ID,
  },

  webpack: (config, { isServer,buildId }) => {
    logger.info('buildId: ', buildId);
    if (isServer) {
      const antStyles = /antd-mobile\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()

          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]
      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
      if(ENV == "production"){
        config.plugins.push(
          new SentryCliPlugin({
            include: ['.next'], // 上传的文件夹，next项目传.next文件夹就行
            ignore: ['node_modules', 'next.config.js'], // 忽略的文件
            configFile: '.sentryclirc', // 上传相关的配置文件
            release: RELEASE_ID,           // 版本号
            urlPrefix: SENTRY_URL_PREFIX,        // 最关键的，相对路径
          })
        )
      }
    }else{
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    return config
  },
}


module.exports = withPlugins(stylePlugins,config);

