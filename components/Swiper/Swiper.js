import React from "react";
import PropTypes from 'prop-types';
import "./Swiper.less"


let switchNegativeNum = (num) => {
    if (num > 0) return -num;
    else return num;
}

export default class Swiper extends React.Component {
    static propTypes = {
        imgList: PropTypes.array,
        INTERVAL_FREQ: PropTypes.number,
        wrapWidth: PropTypes.number,
        wrapHeight: PropTypes.number
    }

    constructor(props) {
        super(props);
        //当前是哪一个swiper被展示 该变量为被展示swiper的下标
        this.nowSelectedSwiperIdx = 0;
        //定时器ID
        this.intervalId = null;
        //wrap容器宽度
        this.wrapOffsetWidth = 0;
        //touchStart触摸点X轴偏移量
        this.touchStartPointOffsetX = 0;
        this.touchStartPointTransfromX = 0;

        this.listLength = this.props.imgList && this.props.imgList.length;
        this.lengthDouble = this.props.imgList && this.props.imgList.length && this.props.imgList.length * 2;

        this.touchOver = true;  //一次touch事件是否处理完成 如果上一次的touch逻辑没有处理完成。则不进行下一次touch处理。

        this.state = {
            transformXOffset: 0,
            hasTransition: false,
        }
    }

    componentDidMount() {
        this.wrapOffsetWidth = this.wrapRef.offsetWidth;
        this._autoSwitch();

        this.boxRef.addEventListener('touchstart', (touchEvent) => {
            this._boxOnTouchStart(touchEvent);
        }, { passive: false }) //  禁止 passive 效果  处理IOS页面滚动bug

        this.boxRef.addEventListener("touchmove", (touchEvent) => {
            this._boxOnTouchMove(touchEvent);
        }, { passive: false }) //  禁止 passive 效果 处理IOS页面滚动bug

        this.boxRef.addEventListener('touchend', (touchEvent) => {
            this._boxOnTouchEnd(touchEvent);
        }, { passive: false }) //  禁止 passive 效果 处理IOS页面滚动bug
    }

    _boxOnTouchStart(touchEvent) {
        touchEvent.preventDefault();
        if (this.touchOver) {
            this._stopAutoSwitch();
            let transFromXValByGet = this._getTransFromXVal();
            this.nowSelectedSwiperIdx = Math.round(transFromXValByGet / this.wrapOffsetWidth);
            if (this._isFirstPic()) { //当前展示swiper为第一张图 eg ABAB 即当前为A0
                this.nowSelectedSwiperIdx = this.listLength;  //将A0切换为A2
            }
            if (this._isLastPic()) { //当前展示swiper为最后一张图 eg ABAB 即当前为3B 
                this.nowSelectedSwiperIdx = this.listLength - 1; //将3B切换为1B
            }
            this.touchStartPointOffsetX = touchEvent.targetTouches[0].clientX;
            this._setTransFromXVal({
                transformXOffset: switchNegativeNum(this.nowSelectedSwiperIdx * this.wrapOffsetWidth),
                hasTransition: false,
                callback: () => {
                    this.touchStartPointTransfromX = switchNegativeNum(this._getTransFromXVal())
                    this.touchOver = false;
                }
            })
        }
    }

    _boxOnTouchMove(touchEvent) {
        if (!this.touchOver) {
            let touchEndPointOffsetX = parseFloat(touchEvent.changedTouches[0].clientX);
            let offsetDistance = parseFloat(touchEndPointOffsetX - this.touchStartPointOffsetX); //右滑为负 左滑为正  
            offsetDistance = offsetDistance * 1.5;
            if (offsetDistance + 60 > this.wrapOffsetWidth) return;
            let __x = offsetDistance + this.touchStartPointTransfromX;

            this._setTransFromXVal({
                transformXOffset: __x,
                hasTransition: false,
            });
        }
    }

    _boxOnTouchEnd() {
        let transFromXValByGet = this._getTransFromXVal();

        this.nowSelectedSwiperIdx = Math.round(transFromXValByGet / this.wrapOffsetWidth);
        this._setTransFromXVal({
            transformXOffset: switchNegativeNum(this.nowSelectedSwiperIdx * this.wrapOffsetWidth),
            hasTransition: true,
            callback: () => {
                this.touchOver = true;
            }
        });
        this._autoSwitch();
    }

    _setNowSelectedSwiperIdx(idx) {
        this._setNowSelectedSwiperIdx({
            nowSelectedSwiperIdx: idx
        })
    }

    _isLastPic() {
        return this.nowSelectedSwiperIdx >= this.lengthDouble - 1;
    }

    _isFirstPic() {
        return this.nowSelectedSwiperIdx == 0;
    }

    _setTransFromXVal(paramObj = {
        transformXOffset: NaN,
        hasTransition: true,
        callback: null
    }) {
        let { transformXOffset, hasTransition, callback } = paramObj;
        if (Number.isNaN(transformXOffset)) {
            throw new Error('_setTransFromXVal function transformXOffset is NaN');
        } else if (typeof transformXOffset != 'number') {
            throw new Error('_setTransFromXVal function typeof transformXOffset is ' + typeof transformXOffset);
        } else {
            this.setState({
                transformXOffset: transformXOffset,
                hasTransition: hasTransition
            }, () => {
                !!callback && callback();
            })
        }
    }

    _getTransFromXVal() {
        let transformStr = this.boxRef.style.transform;
        if (transformStr.includes('translateX')) {
            return parseInt(transformStr.replace(/[^\d|\\.]/g, ""))
        } else {
            return 0;
        }
    }

    _autoSwitch() {
        const INTERVAL_FREQ = this.props.INTERVAL_FREQ || 2000;
        this._stopAutoSwitch();
        let _tab = () => {
            setTimeout(() => {
                this.nowSelectedSwiperIdx++;
                this.setState({
                    transformXOffset: switchNegativeNum(this.nowSelectedSwiperIdx * this.wrapOffsetWidth),
                    hasTransition: true
                })
            }, 60)
        }
        this.intervalId = setInterval(() => {
            if (this._isLastPic()) { //当前展示swiper为最后一张图 eg ABAB 即当前为3B 
                this.nowSelectedSwiperIdx = this.listLength - 1; //将3B切换为1B
                this._setTransFromXVal({
                    transformXOffset: switchNegativeNum(this.nowSelectedSwiperIdx * this.wrapOffsetWidth),
                    hasTransition: false,
                    callback: _tab
                })
            } else _tab();
        }, INTERVAL_FREQ)
    }

    _stopAutoSwitch() {
        this.intervalId && clearInterval(this.intervalId);
    }

    componentWillUnmount() {
        this._stopAutoSwitch();
    }

    swiperDoTouchstart(e, item) {
        let { jumpUrl, type, imageId } = item;

        switch (type) {
            case "VIDEO":
                //TODO
                break;
            default:
                !!jumpUrl && (location.href = jumpUrl);
                break;
        }
    }

    render() {
        let { imgList } = this.props;

        let { transformXOffset, hasTransition } = this.state;
        let { wrapWidth, wrapHeight = 375 } = this.props;

        const activeEleIdx = this.nowSelectedSwiperIdx % this.listLength;

        let createSwiper = () => {
            let swipers = [];
            for (let idx = 0; idx < this.lengthDouble; idx++) {
                let item = imgList[idx % this.listLength];
                let { dynamicUrl, type } = item;
                let ele = null;
                switch (type) {
                    case "VIDEO":
                        //TODO
                        break;
                    default:
                        ele = (
                            <li key={idx} className="li" style={{ width: `${1 / this.lengthDouble * 100}%` }} onTouchStart={(e) => { this.swiperDoTouchstart(e, item, activeEleIdx) }}>
                                <img className={['imgStyle', this.nowSelectedSwiperIdx == idx && "imgScale"].join(" ")} src={dynamicUrl} />
                                {/* <img className={['imgStyle',this.nowSelectedSwiperIdx == idx && "imgScale"].join(" ")}  src={src} /> */}
                                {/* <img className={['imgStyle'].join(" ")}  src={dynamicUrl} /> */}
                            </li>
                        )
                        break;
                }
                swipers.push(ele);
            }
            return swipers;
        }
        return (
            <React.Fragment>
                <div className="wrap" ref={(ref) => this.wrapRef = ref}
                    style={
                        wrapWidth ? {
                            width: wrapWidth,
                            height: wrapHeight
                        } : {
                                height: wrapHeight
                            }
                    }>
                    <ul ref={(ref) => this.boxRef = ref}
                        className={['box', hasTransition && "hasTransition"].join(' ')}
                        style={{
                            width: `${this.listLength * 100 * 2}%`,
                            transform: [`translateX(${transformXOffset}px)`],
                        }}
                    >
                        {createSwiper()}
                    </ul>
                    <div className="tipCon">
                        {
                            imgList.map((item, idx) => {
                                return (
                                    <div key={idx} className={["tipEle", activeEleIdx == idx && "active"].join(' ')}></div>
                                )
                            })
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

/**
 * wrapWidth  show width -- default:Parent container width
 * wrapHeight show height --  default:200px
 * imgList:[{ 必传
 *  dynamicUrl:"",  必传
 *  type:""         default:"IMAGE", ['VIDEO']
 *  jumpUrl:""
 * }]
 * INTERVAL_FREQ  滚动帧率 default 2000ms
 */


