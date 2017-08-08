/**
 * Created by kusob on 2017. 7. 15..
 */

import React, { Component } from 'react';
import { PixelRatio, Dimensions, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PrivateAddr from "./private/address";
import StateStore from '../common/stateStore';

var { height, width } = Dimensions.get('window');

class Common extends Component {
    static clone(obj) {
        if (obj === null || typeof (obj) !== 'object')
            return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    static getRatio() {
        return (width * height) / (375 * 667);
    }

    static widthRatio() { //iphone6 = 375
        return 375 / width;
    }

    static heightRatio() { //iphone6 = 667
        return 667 / height;
    }

    static winWidth() {
        return width;
    }

    static winHeight() {
        return height;
    }

    static modifyDate(date) {
        var today = new Date();
        var tmp = "";
        var dateTime = date.split(" ");
        //dateTime[0] = 2017-07-24
        //dateTime[1] = 22:23:40.0
        var yearMonthDay = dateTime[0].split("-");
        var time = dateTime[1].split(":");
        //time[0] = 22 (시)
        if (time[0] > 12) {
            time[0] = "오후" + (time[0] - 12);
        } else {
            time[0] = "오전" + time[0];
        }
        //time[1] = 23 (분)
        if (yearMonthDay[0] != today.getFullYear()) { //년도가 다른경우 년도 추가
            tmp += yearMonthDay[0] + "년 "; //
        } else if ((today.getFullYear().toString() == yearMonthDay[0]
            && "0" + (today.getMonth() + 1) == yearMonthDay[1]
            && today.getDate().toString() == yearMonthDay[2]) == false) { //오늘이 아니면
            tmp += yearMonthDay[1] + "월 " + yearMonthDay[2] + "일 "; //월 일 추가
        }
        tmp += time[0] + ":" + time[1];
        return tmp;
    }

    static getBalance(type, addr) { //잔액조회
        return new Promise((resolve, reject) => {
            if (type == 'BTC') {
                fetch("https://chain.api.btc.com/v3/address/" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.data != null) {
                            resolve(responseJson.data.balance);
                        } else {
                            resolve('조회 불가');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'ETH') {
                fetch("https://api.etherscan.io/api?module=account&action=balance&address=" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve((parseInt(responseJson.result) / 1000000000000000000).toFixed(15));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'ETC') {
                fetch("https://etcchain.com/api/v1/getAddressBalance?address=" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.balance != null || responseJson.balance != undefined) {
                            resolve(responseJson.balance);
                        } else {
                            resolve('조회 불가');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'XRP') {
                fetch("https://data.ripple.com/v2/accounts/" + addr + "/balances")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson != null) {
                            if (responseJson.result == 'success')
                                resolve(responseJson.balances[0].value);
                            else
                                resolve('조회 불가'); //주소오류

                        } else {
                            resolve('조회 불가'); //api오류
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'LTC') { //// 아직 테스트 안된 api ////////////////////////////////////
                fetch("https://ltc.blockr.io/api/v1/address/balance/" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status == 'success') {
                            resolve(responseJson.data.balance);
                        } else {
                            resolve('조회 불가');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'DASH') {
                fetch("https://api.blockcypher.com/v1/dash/main/addrs/" + addr + "/balance")
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.balance != null) {
                            resolve(responseJson.balance);
                        } else {
                            resolve('조회 불가');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }

    static async addWallet() {
        const TYPE = ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'DASH'];
        if (StateStore.walletName() == "") {
            alert("지갑 이름을 입력하세요!");
            return false;
        } else if (StateStore.walletAddr() == "") {
            alert("지갑 주소를 입력하세요!");
            return false;
        } else {
            await AsyncStorage.getItem('Token', (err, result) => {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                try {
                    //post api call
                    fetch(PrivateAddr.getAddr() + 'wallet/add', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({
                            walletName: StateStore.walletName(),
                            walletAddr: StateStore.walletAddr(),
                            walletType: TYPE[StateStore.walletType()],
                        })
                    }).then((response) => {
                        return response.json()
                    }).then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            alert('지갑을 추가했습니다!');
                            Actions.main({ goTo: 'myWallet' });
                        } else {
                            alert('오류가 발생했습니다.\n다시 시도해주세요!');
                        }
                    }).catch((error) => {
                        alert('Network Connection Failed');
                        console.error(error);
                    }).done();
                    StateStore.setName('');
                    StateStore.setType(0);
                    StateStore.setAddr('');
                } catch (err) {
                    alert('지갑추가실패 : ' + err);
                }
            });
        }
    }

    static editWallet() {
        var list = StateStore.currentMyWalletList();
        if (StateStore.edit_walletName() == "") {
            alert('지갑 이름을 입력하세요!');
            return false;
        } else if (StateStore.edit_walletAddr() == "") {
            alert('지갑 주소를 입력하세요!');
            return false;
        } else {
            AsyncStorage.getItem('Token', (err, result) => {
                if (err != null) {
                    alert(err);
                    return false;
                }
                const token = JSON.parse(result).token;
                try {
                    fetch(PrivateAddr.getAddr() + 'wallet/edit', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({
                            walletId: StateStore.edit_walletId(),
                            walletName: StateStore.edit_walletName(),
                            walletAddr: StateStore.edit_walletAddr(),
                            walletType: StateStore.edit_walletType(),
                        })
                    }).then((response) => {
                        return response.json()
                    }).then((responseJson) => {
                        if (responseJson.message == "SUCCESS") {
                            alert('지갑 수정 성공!');
                            Actions.main({ goTo: 'myWallet' });
                        } else {
                            alert('오류가 발생했습니다.\n다시 시도해주세요!');
                        }
                    }).catch((error) => {
                        alert('Network Connection Failed');
                        console.error(error);
                    }).done(() => {
                        StateStore.setEdit_walletId('');
                        StateStore.setEdit_walletName('');
                        StateStore.setEdit_walletAddr('');
                        StateStore.setEdit_walletType('');
                    });

                } catch (err) {
                    alert('수정실패 ' + err);
                    return false;
                }
            });
        }
    }
}

export default Common;