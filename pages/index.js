import React from 'react';
import {invoke_post,Loading} from "../common/index";
import "./styles/index.less"
import { Picker } from 'antd-mobile';


const CustomChildren = props => (
    <div onClick={props.onClick} style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
        <div className="test" style={{ display: 'flex', height: '45px', lineHeight: '45px',position:'relative',borderBottom:0 }}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{props.children}</div>
            <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
        </div>
    </div>
);

// http://10.38.53.5:8080/next_h5/_next/webpack-hmr?page=/
export default class extends React.Component {
    constructor(props){
        super(props);
        this.state={
            pickerValue: [],
        };
    }
    onOk(value){
        console.log('value: ', value);
        this.setState({ pickerValue: value })
    }
 
    render(){
        let antdDistrict =[];
        let districtData = require('./location');
        Object.keys(districtData).forEach((index)=>{
            let itemLevel1 ={};
            let itemLevel2 ={};
            itemLevel1.value = districtData[index].code;
            itemLevel1.label = districtData[index].name;
            itemLevel1.children = [];
            let data = districtData[index].cities;
            Object.keys(data).forEach((index)=>{
                itemLevel2.value = data[index].code;
                itemLevel2.label = data[index].name;
                itemLevel2.children = [];
                let data2 = data[index].districts;
                let itemLevel3 ={};
                itemLevel3.children = [];
                Object.keys(data2).forEach((index)=>{
                    itemLevel3.value = index;
                    itemLevel3.label = data2[index];
                    itemLevel2.children.push(itemLevel3);
                    itemLevel3 ={};
                });
                itemLevel1.children.push(itemLevel2);
                itemLevel2 ={};
            });
            antdDistrict.push(itemLevel1)
        });
        return (
            <div>
                <Picker title="选择地区" extra="请选择(可选)" data={antdDistrict} value={this.state.pickerValue} onChange={v => this.setState({ pickerValue: v })}
                    onOk={this.onOk.bind(this)}
                >
                    <CustomChildren>Customized children</CustomChildren>
                </Picker>
            </div>
        )
    }
}

