import React from 'react';
import {Lazyload,InfiniteScroll,Swiper} from "components";


import "./index.less";
/**
 * 前端错误类型
 * ? 1.同步错误 通过try catch 进行错误捕获  pass
 * ? 2.异步错误        pass
 * ? 3.网络错误        fail   sentry不能主动进行网络错误的捕获 需要通过代码hack的方式进行处理
 * 
 * node 错误类型
 * ? 1. 同步错误  try catch   pass
 * ? 2. 异步错误  callback   eventEmitter error事件监听     pass
 * 
 * 服务端错误捕获
 * ? 1. next 服务端组件渲染错误捕获
 * ? 2. express 错误捕获
 * 
 * 开发手动异常上报
 * ? 开发在业务代码中进行catch捕获 按需进行异常上报
 */

export default class Index extends React.Component{
    static async getInitialProps({req,res,router,Component}) {
        return {} 
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        // setTimeout(()=>{
        //     console.log('--------',asyncData);  //! 这是一个异步客户端错误
        // },1000)

        // Sentry.captureException(new Error('custom error'));   //! 客户端手动异常上报
    }
    doClick(){
        console.log('--------',data);  //! 这是一个同步客户端错误
    }

    render(){
        return (
            <>
                <h1 onClick={this.doClick.bind(this)}>this click will error</h1>
                <div>this is index page</div>
            </>
        )
    }
}



