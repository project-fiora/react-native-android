/**
 * Created by kusob on 2017. 7. 15..
 */

'use strict';

import Realm from 'realm';

class Wallet extends Realm.Object {}
Wallet.schema = {
    name: 'Wallet',
    properties: {
        id:{ type: 'int', indexed: true },
        owner:{ type: 'string', indexed: true },
        name: 'string',
        addr:'string',
        site:'string'
    }
};

class FriendWallet extends Realm.Object {}
FriendWallet.schema = {
    name: 'FriendWallet',
    properties: {
        id:{ type: 'int', indexed: true },
        owner:{ type: 'string', indexed: true },
        name: 'string',
        addr:'string',
        site:'string'
    }
};

class Token extends Realm.Object {}
Token.schema = {
    name: 'Token',
    properties: {
        email:'string',
        password:'string',
        token:'string'
    }
}

var key = new Int8Array(64);
export default new Realm({schema: [Wallet, FriendWallet, Token], encryptionKey: key});