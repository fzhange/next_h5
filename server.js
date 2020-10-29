require("@babel/polyfill");

const {baseUrl,PORT,dsn} = require("./config.json");
const express = require('express')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || PORT
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler();
const bodyParser = require('body-parser');
const logger = require("./tool_server/logger")(__filename);
const path = require('path');
const {getIPAddress} = require("./tool_server/tools");
const { parse } = require('url')
const Sentry = require("@sentry/node");
const fs = require('fs');
const htmlparserDeal = require('./tool_server/htmlparserDeal');

logger.info('process.env.NODE_ENV : ', process.env.NODE_ENV);
Sentry.init({ dsn });


app.prepare()
.then(() => {
  try{
    const server = express()
    server.use(Sentry.Handlers.requestHandler());

    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());
    server.use(express.static(path.join(__dirname,"static")));
    server.get('/healthyCheck',function(req,res){
      const parsedUrl = parse(req.url, true)
      const { query } = parsedUrl
      app.renderToHTML(req,res,"/test",query).then((data)=>{
        let htmlStr = htmlparserDeal(data);
        console.log('htmlStr: ', htmlStr);
      });
    })
    server.get(`*`, (req, res) => {
      // if(req.path == baseUrl)  res.redirect(301, `${baseUrl}/index`);
      return handle(req, res)
    })
    
    // ? The error handler must be before any other error middleware and after all controllers
    server.use(Sentry.Handlers.errorHandler());
        
    const LOCAL_IP = getIPAddress();
    server.listen(port, (err) => {
      if (err) throw err
      logger.info(`> Ready on http://${LOCAL_IP}:${port}${baseUrl}`);
    })
  }catch(error){
    logger.error('error:服务器点火失败 ', error);
    Sentry.captureException(error);
  }
})







