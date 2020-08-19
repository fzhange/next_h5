import React from 'react';
import {invoke_post,Loading} from "../common/index";
import "./styles/index.less"

import { Button,Modal } from 'antd-mobile';
import 'antd-mobile/lib/button/style/index.less'


export default class Login extends React.Component{
    constructor(props){
        super(props);
    }
    btnClick(){
        Loading.show();
    }

    render(){
        return (
            <div>
                <Button onClick={this.btnClick.bind(this)} type="primary">primary</Button>
            </div>
        )
    }
}

