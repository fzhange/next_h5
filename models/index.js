import { useStaticRendering } from 'mobx-react';
import TestStore from "./TestStore";
import SyncServerDataStore from "./SyncServerDataStore";

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);


export default function initializeStore(initialData = {}){
    let mobxStore = {
        testStore: new TestStore(initialData?.testStore || {}),
        syncServerDataStore : new SyncServerDataStore(initialData?.syncServerDataStore || {})
    }
    if (isServer) {
        return mobxStore;
    }else{
        const __NEXT_MOBX_STORE__ = '__NEXT_MOBX_STORE__'
        if (!window[__NEXT_MOBX_STORE__]) window[__NEXT_MOBX_STORE__] = mobxStore;
        return mobxStore;
    }
}

