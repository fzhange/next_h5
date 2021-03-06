//用于 Next 启动服务已经构建阶段，但是不作用于浏览器端。
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withSourceMaps = require('@zeit/next-source-maps')
const withPlugins = require('next-compose-plugins');
const SentryCliPlugin = require('@sentry/webpack-plugin')
const logger = require("./tool_server/logger")(__filename);
const ENV = process.env.NODE_ENV;
const {SENTRY_URL_PREFIX,RELEASE_ID,baseUrl,PORT} = require('./config.json');
const {getIPAddress} = require("./tool_server/tools");
const { default: Server } = require('next/dist/next-server/server/next-server');
const LOCAL_IP = getIPAddress();
const port = parseInt(process.env.PORT, 10) || PORT


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
        lessOptions:{
          javascriptEnabled: true,
        }
      },
    }
  ],[
    withSourceMaps
  ]
]
const config = {
  experimental: {
    css: false,
  },
  basePath:baseUrl,
  assetPrefix: `http://${LOCAL_IP}:${port}${baseUrl}`,
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
  generateBuildId: async () => {
    return RELEASE_ID
  },

  webpack: (config, {dev,isServer,buildId }) => {
    console.log('dev: ', dev);
    console.log('isServer: ', isServer);
    logger.info('buildId: ', buildId);
    if (isServer) {
      const antStyles = /antd-mobile\/.*?\/style.*?/
      // const flowSakura =/flow_sakura_ui(\/.*)*\/*\.css/;
      const flowSakura = /flow_sakura_ui/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (request.match(flowSakura)) return callback()

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
      // if(!dev){
      //   config.plugins.push(
      //     new SentryCliPlugin({
      //       include: ['.next'], // 上传的文件夹，next项目传.next文件夹就行
      //       ignore: ['node_modules', 'next.config.js'], // 忽略的文件
      //       configFile: '.sentryclirc', // 上传相关的配置文件
      //       release: RELEASE_ID,           // 版本号
      //       urlPrefix: SENTRY_URL_PREFIX,  // 最关键的，相对路径
      //     })
      //   )
      // }
    }else{
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    if(!dev){ //客户端 生产环境 代码分离处理
      if(!isServer){
        // config
        config.optimization.splitChunks = {
          cacheGroups:{
            framework:{
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, //匹配库当中的react和react-dom
              priority: 40, //权重为40 最大权重
            }
          },
          lib:{
            test(module) {
              console.log('module: ', JSON.stringify(module));
            }
          }
        }
      }
    }
    return config
  },
}


module.exports = withPlugins(stylePlugins,config);

