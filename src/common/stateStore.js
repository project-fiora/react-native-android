import {observable} from 'mobx';

const stateStore = observable({
    guest:false,
    globalLoaded:'none',
    loaded:'',
    createWalletName:'',
    createWalletAddr:'',
    walletName:'',
    walletAddr:'',
    walletType:'',
    edit_walletId:'',
    edit_walletName:'',
    edit_walletAddr:'',
    edit_walletType:'',
    postId:'',
    postTitle:'',
    postContents:'',
    edit_postTitle:'',
    edit_postContents:'',
    currentMyWalletList:'',
    currentWallet:0,
    currentMyWalletId:'',
});
////지갑생성할때 지갑이름
stateStore.setCreateWalletName = (name)=>{
    this.createWalletName = name;
}
stateStore.createWalletName = ()=>{
    return this.createWalletName;
}
///지갑생성할때 지갑주소
stateStore.setCreateWalletAddr = (addr)=>{
    this.createWalletAddr = addr;
}
stateStore.createWalletAddr = ()=>{
    return this.createWalletAddr;
}
/////////손님 설정
stateStore.setGuest = (bool)=>{
    this.guest = bool; 
};
stateStore.guest = ()=>{
    return this.guest;
}
//////////////////////for tradeRecord
stateStore.setCurrentMyWalletList = (list)=>{
    this.currentMyWalletList = list; 
};
stateStore.currentMyWalletList = ()=>{
    return this.currentMyWalletList;
}
stateStore.setCurrentWallet = (i)=>{
    this.currentWallet = i;
}
stateStore.currentWallet = ()=>{
    return this.currentWallet;
}
/////////////////////////////////
stateStore.setCurrentMyWalletId = (id)=>{
    this.currentMyWalletId = id; //for mywalletEdit
};
stateStore.currentMyWalletId = ()=>{
    return this.currentMyWalletId;
}

///Global loading control/////
stateStore.setGlobalLoaded = (load)=>{
    this.globalLoaded = load;
};
stateStore.globalLoaded = ()=>{
    return this.globalLoaded;
}

///loading control/////
stateStore.setLoaded = (load)=>{
    this.loaded = load;
};
stateStore.loaded = ()=>{
    return this.loaded;
}
////wallet Add////
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
stateStore.walletType = ()=>{
    return this.walletType;
}

////wallet edit/////
stateStore.setEdit_walletId = (id)=>{
    this.edit_walletId = id;
};
stateStore.setEdit_walletName = (name)=>{
    this.edit_walletName = name;
};
stateStore.setEdit_walletAddr = (addr)=>{
    this.edit_walletAddr = addr;
};
stateStore.setEdit_walletType = (type)=>{
    this.edit_walletType = type;
};
stateStore.edit_walletId = ()=>{
    return this.edit_walletId;
}
stateStore.edit_walletName = ()=>{
    return this.edit_walletName;
}
stateStore.edit_walletAddr = ()=>{
    return this.edit_walletAddr;
}
stateStore.edit_walletType = ()=>{
    return this.edit_walletType;
}
/////post add, edit////////
stateStore.setPostId = (id)=>{
    this.postId = id;
};
stateStore.setPostTitle = (title)=>{
    this.postTitle = title;
};
stateStore.setPostContents = (contents)=>{
    this.postContents = contents;
};
stateStore.postId = ()=>{
    return this.postId;
}
stateStore.postTitle = ()=>{
    return this.postTitle;
}
stateStore.postContents = ()=>{
    return this.postContents;
}
//////edit 할때 제목,내용을 가져오기위한 store////
stateStore.setEdit_postTitle = (title)=>{
    this.edit_postTitle = title;
};
stateStore.setEdit_postContents = (contents)=>{
    this.edit_postContents = contents;
};
stateStore.edit_postTitle = ()=>{
    return this.edit_postTitle;
}
stateStore.edit_postContents = ()=>{
    return this.edit_postContents;
}

module.exports = stateStore;