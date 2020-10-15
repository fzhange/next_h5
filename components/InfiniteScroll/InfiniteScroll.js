import React from 'react';
import { useEffect, useRef, useState } from "react";
import "./InfiniteScroll.less";
const TOP_SENTRY_ID = 'topSentry';
const BOTTOM_SENTRY_ID = 'bottomSentry';

//https://juejin.im/post/6844904007396229128 基于 IntersectionObserver API 实现无限滚动组件
// https://juejin.im/post/6844904009568878600  一个简洁、有趣的无限下拉方案
let firstIndex = 0;
const LIST_SIZE = 20;
const INCREMENT = LIST_SIZE/2;


export default function InfiniteScroll(props) {
    let [eleArr, setEleArr] = useState(__getArrEel());
    let [topSentryEleTop,setTopSentryEleTop] = useState(0);
    let [bottomSentryEleBottom,setBottomSentryEleBottom] = useState(0);

    const topSentryRef = useRef('topSentryRef');
    const bottomSentryRef = useRef('bottomSentryRef');



    useEffect(() => {
        const infiniteScrollConEle = document.querySelector('.infinite_scroll_con');
        const topSentryEle = topSentryRef.current;
        const bottomSentryEle = bottomSentryRef.current;
        // const containerEle =  document.querySelector('.container');

        const observer = new IntersectionObserver((interSectionObserverEntries)=>{

            interSectionObserverEntries.forEach((entry) => {
                let { target, intersectionRatio, isIntersecting,boundingClientRect } = entry;

                if (target.id == TOP_SENTRY_ID) {
                    if (isIntersecting) {
                    // console.log('>>>>>>>顶部守卫展示');
                    //     if(firstIndex == 0){
                    //         if(firstIndex == 0) setPlacehodlerEleTop(0);
                    //         const renderEle = __getArrEel();
                    //         setEleArr(renderEle);
                    //     }
                    //     if(firstIndex>0){
                    //         firstIndex = firstIndex - INCREMENT;
                    //         const containerEleHeight = containerEle?.scrollHeight || 0;
                    //         const paddingTop = parseInt(placeHolderEle.style.paddingTop.replace('px',""))
                    //         const __placeholderEleTop = paddingTop - Math.floor(containerEleHeight/2);
                    //         console.log('__placeholderEleTop: ',renderEle, __placeholderEleTop);
                    //         const renderEle = __getArrEel();
                    //         if(__placeholderEleTop>=0)  setPlacehodlerEleTop(__placeholderEleTop);
                    //         if(!!renderEle && !!renderEle.length){
                    //             setEleArr(renderEle);
                    //         }
                    //     }
                    }
                } else if (target.id == BOTTOM_SENTRY_ID) {
                    if (isIntersecting) {
                        // console.log('底部守卫展示',firstIndex,boundingClientRect.top);
                        // firstIndex = firstIndex + INCREMENT;
                        // setEleArr(__getArrEel());
                       
                        
                        // if(firstIndex <= endingFlag){
                        //     firstIndex = firstIndex + INCREMENT;
                        
                        //     const containerEleHeight = containerEle?.scrollHeight || 0;
                        //     const paddingTop = parseInt(placeHolderEle.style.paddingTop.replace('px',""))
                        //     const __placeholderEleTop = paddingTop + Math.floor(containerEleHeight/2);
                        //     const renderEle = __getArrEel();
                            
                        //     if(!!renderEle && !!renderEle.length){
                        //         console.log('renderEle: >>>>>>', __placeholderEleTop,firstIndex);
                        //         setPlacehodlerEleTop(__placeholderEleTop);
                        //         setEleArr(renderEle);
                        //     }
                        // }
                    }
                }
            })
        },{root:infiniteScrollConEle});

        observer.observe(topSentryRef.current);
        observer.observe(bottomSentryRef.current);
    }, [])


    function __getArrEel() {
        // return arr.slice(firstIndex, firstIndex + LIST_SIZE)
        let arr = [];
        for(let i=0;i<=LIST_SIZE;i++){
            arr.push(firstIndex+i)
        }
        return arr;
    }



    return (
        <div className="infinite_scroll_con">
            <div className="top_sentry" id={TOP_SENTRY_ID} ref={topSentryRef} style={{ paddingTop: `${topSentryEleTop}px` }}></div>
            <div className="container">
                {
                    eleArr.map((item, idx) => {
                        return (
                            <div style={idx % 2 == 0 ? { background: "lightcoral" } : {}} className="ele" key={idx}>{item}</div>
                        )
                    })
                }
            </div>
            <div className="bottom_sentry" id={BOTTOM_SENTRY_ID} ref={bottomSentryRef}  style={{ paddingTop: `${bottomSentryEleBottom}px` }}></div>
        </div>
    )
}








