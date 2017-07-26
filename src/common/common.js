/**
 * Created by kusob on 2017. 7. 15..
 */

import React, {Component} from 'react';
import {PixelRatio, Dimensions} from 'react-native';

var {height, width} = Dimensions.get('window');

class Common extends Component {
    static clone(obj) {
        if (obj === null || typeof(obj) !== 'object')
            return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = clone(obj[attr]);
            }
        }
        return copy;
    }

    static getRatio(){
        return (width*height)/(375*667);
    }

    static widthRatio(){ //iphone6 = 375
        return 375/width;
    }

    static heightRatio(){ //iphone6 = 667
        return 667/height;
    }

    static winWidth(){
        return width;
    }

    static winHeight(){
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
        if(time[0]>12){
            time[0] = "오후"+(time[0]-12);
        } else{
            time[0] = "오전"+time[0];
        }
        //time[1] = 23 (분)
        if(yearMonthDay[0]!=today.getFullYear()){ //년도가 다른경우 년도 추가
            tmp += yearMonthDay[0]+"년 "; //
        } else if ((today.getFullYear().toString() == yearMonthDay[0]
            && "0"+(today.getMonth()+1)==yearMonthDay[1]
            && today.getDate().toString() == yearMonthDay[2])==false) { //오늘이 아니면
            tmp += yearMonthDay[1]+"월 "+yearMonthDay[2]+"일 "; //월 일 추가
        }
        tmp += time[0]+":"+time[1];
        return tmp;
    }

    static getBalance(type, addr) {
        return new Promise((resolve, reject) => {
            if (type == 'BTC') {
                fetch("https://chain.api.btc.com/v3/address/" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.data != null) {
                            resolve(responseJson.data.balance);
                        } else {
                            resolve('지갑주소 or 잔액조회 api error');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else if (type == 'ETH') {
                fetch("https://api.etherscan.io/api?module=account&action=balance&address=" + addr)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve(responseJson.result);
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
                            resolve('지갑주소 or 잔액조회 api error');
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
                                resolve('지갑 주소 오류');

                        } else {
                            resolve('잔액조회 api error');
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
                            resolve('지갑주소 or 잔액조회 api 오류');
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
                            resolve('지갑주소 or 잔액조회 api 오류');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }
}

export default Common;