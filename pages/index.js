import React from 'react';
import {Lazyload,InfiniteScroll,Swiper} from "components";
import "./index.less";




export default function Named(){
    return (
        <div className="con">
            {/* <Lazyload styles={{width:"100%"}} 
            load_errror_img_src={'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2150142154,1136750838&fm=26&gp=0.jpg'}
            src={'https://t9.baidu.com/it/u=1307125826,3433407105&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1601021871&t=fb25b1074fb9d4d9681dba69a3c68042'}
            ></Lazyload> */}
            <InfiniteScroll></InfiniteScroll>
              {/* <Swiper imgList = {[{
                    dynamicUrl:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1276916710,1285268234&fm=26&gp=0.jpg',
                },{
                    dynamicUrl:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=277644228,196381912&fm=26&gp=0.jpg',
                },{
                    dynamicUrl:"https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3195819313,3977662193&fm=26&gp=0.jpg",
                }]}>
                </Swiper> */}
        </div>
    )
}

