import App from 'next/app'
import React from 'react'
import  initializeStore  from '../models/index';
import { Provider } from 'mobx-react'
import Head from 'next/head'
import "./_app.less";

import * as Sentry from '@sentry/node'
import {dsn}from "../config.json"
// const isServer = typeof window == 'undefined';
const ENV = process.env.NODE_ENV;
const isProd = ENV == 'production';

if(isProd){
    Sentry.init({ 
        dsn,
        release:process.env.RELEASE_ID,
    });
}


class MyApp extends App {
    static async getInitialProps({req,res,router,Component}) {
        try{
            let ComponentInitProps = {};
        
            let initializeStoreObj = initializeStore({
                testStore:{ count:2 },
                syncServerDataStore:{
                    env:process.env.NODE_ENV
                }
            });
    
            if(Component.getInitialProps) ComponentInitProps = await Component.getInitialProps({
                router ,req ,res, initializeStoreObj
            })
    
            return {
                ComponentInitProps,
                initializeStoreObj
            };   
        }catch(error){
            console.error('_app > getInitialProps > error: ', error);
            isProd && Sentry.captureException(error);
            return {}
        }
    }

    constructor(props) {
        super(props)
        this.mobxStore = initializeStore(props?.initializeStoreObj);
    }

    render() {
        const { Component, ComponentInitProps={} } = this.props;
        return (
            <>
                <Head>
                    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0,viewport-fit=cover" />
                    <script src="https://browser.sentry-cdn.com/5.26.0/bundle.min.js" integrity="sha384-VGljl8BTZL6Py4DmlOaYmfkOwp8mD3PrmD2L+fN446PZpsrIHuDhX7mnV/L5KuNR" crossOrigin="anonymous"></script>
                </Head>
                <Provider {...this.mobxStore}>
                    <Component {...ComponentInitProps}/>
                </Provider>
                <script dangerouslySetInnerHTML={{
                    __html:`
                    if(process.env.NODE_ENV == 'production') {
                        window.addEventListener('error',function(event){
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            let netLoadEleWhiteList = ['SCRIPT']
                            let {tagName,src} =  event.srcElement
                            if(netLoadEleWhiteList.includes(tagName)){
                                console.error('******文件加载异常，进行错误上报******');
                                console.table({ tagName,src })
                                const error = new Error('静态资源加载失败---' + JSON.stringify({ tagName,src }));
                                Sentry.withScope(function(scope) {
                                    scope.setLevel('warning');
                                    Sentry.captureException(error);
                                });
                            }
                        },true)
                    }
                    `
                }}>
                </script>
            </>

        )
    }
}
export default MyApp



