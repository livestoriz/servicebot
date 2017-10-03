

let { triggerEvent}  =  require("./actions");

class Store{
    constructor(){
    }
    setStore(store){
      this.store = store;
    }
    getState(getServicebot=true){
        if(getServicebot) {
            return this.store.getState().servicebot;
        }else{
            return this.store.getState();
        }
    }
    dispatchEvent(eventName, eventObject){
        return this.store.dispatch(triggerEvent(eventName, eventObject));

    };
}

module.exports = new Store();