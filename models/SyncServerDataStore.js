import { observable, action } from "mobx";

export default class SyncServerDataStore {
    @observable env;
    constructor(initDataObj = {}){
        this.env = initDataObj.env;
    }
}