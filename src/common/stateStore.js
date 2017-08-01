import {observable} from 'mobx';

const stateStore = observable({
    globalLoaded:'none',
    loaded:'',
    walletName:'',
    walletAddr:'',
    walletType:'BTC',
    edit_walletId:'',
    edit_walletName:'',
    edit_walletAddr:'',
    edit_walletType:'',
    postId:'',
    postTitle:'',
    postContents:'',
    edit_postTitle:'',
    edit_postContents:'',
});

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