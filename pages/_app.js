import App, {Container} from 'next/app'
import React from 'react'
import  initializeStore  from '../models/index';
import { Provider } from 'mobx-react'
import "./styles/_app.less";



class MyApp extends App {
    static async getInitialProps({req,res,router,Component}) {
        let ComponentInitProps = {};

        let initializeStoreObj = initializeStore({
            testStore:{ count:2 }
        });

        if(Component.getInitialProps) ComponentInitProps = await Component.getInitialProps({
            router ,req ,res, initializeStoreObj
        })

        return {
            ComponentInitProps,
            initializeStoreObj
        };
    }

    constructor(props) {
        super(props)
        this.mobxStore = initializeStore(props?.initializeStoreObj);
    }

    render() {
        const { Component, ComponentInitProps={} } = this.props;
        return (
            <Provider {...this.mobxStore}>
                <Component {...ComponentInitProps}/>
            </Provider>
        )
    }
}
export default MyApp



