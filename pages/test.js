import React from 'react';
import {invoke_post,Loading} from "../common/index";
import "./styles/index.less"
import { Picker } from 'antd-mobile';



// http://10.38.53.5:8080/next_h5/_next/webpack-hmr?page=/
export default class extends React.Component {
    constructor(props){
        super(props);
        this.state={
            pickerValue: [],
        };
    }
    componentDidMount(){
        console.log(' window.sessionStorage(): ',  window.sessionStorage);
    }
    setSession(){
        window.sessionStorage.setItem("name","fzhange");
        window.open('http://10.32.33.126:3000/next_h5/test')
    }
    render(){
        return (
            <div onClick={this.setSession.bind(this)}>
               test render
            </div>
        )
    }
}

