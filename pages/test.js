import React from 'react';


import "./test.less";


export default class Index extends React.Component{
    static async getInitialProps({req,res,router,Component}) {
        return {} 
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.addEventListener('click',function(event){
            console.log('>>>>', event.currentTarget,event.target);
            let x = event.target == document.querySelector('.test_con')
            console.log('x: ', x);
        })
    }


    render(){
        return (
            <>
               <div className="test_con">
                   <div>1234</div> 
               </div>
            </>
        )
    }
}



