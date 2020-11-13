import React from 'react';
import {useEffect,useRef} from "react";
import PropTypes from 'prop-types';

export default function Lazyload(props){
    const imgRef = useRef('imgRef');
   
    useEffect(()=>{
        let observer =  new IntersectionObserver((interSectionObserverEntries)=>{
            let imgEntry = interSectionObserverEntries[0];
            let {target,intersectionRatio} = imgEntry;
            if(intersectionRatio > 0){
                target.src = props.src;
                observer.unobserve(target)
            }
        })
        observer.observe(imgRef.current);
    },[])

    function __imgLoadError(){
        imgRef.current.src = props.load_errror_img_src
    }
   
    return (
        <img ref={imgRef} style={props.styles} onError={__imgLoadError} />
    )
}






Lazyload.defaultProps = {
    styles: {},
};
Lazyload.propTypes = {
    styles: PropTypes.object, //自定义图片样式
    src: PropTypes.string.isRequired, //图片链接
    load_errror_img_src: PropTypes.string, //加载错误图片链接
}
