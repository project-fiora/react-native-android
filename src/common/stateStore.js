import {observable} from 'mobx';

const stateStore = observable({
    walletName:'',
    walletAddr:'',
    walletType:'BTC',
});

stateStore.setName = (name)=>{
    this.walletName = name;
};
stateStore.setAddr = (addr)=>{
    this.walletAddr= addr;
};
stateStore.setType = (type)=>{
    this.walletType = type;
};

stateStore.walletName = ()=>{
    return this.walletName;
}
stateStore.walletAddr = ()=>{
    return this.walletAddr;
}
stateStore.walletType= ()=>{
    return this.walletType;
}

module.exports = stateStore;