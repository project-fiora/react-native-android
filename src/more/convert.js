/**
 * Created by kusob on 2017. 7. 20..
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import Common from "../common/common";
import SelectBox from "../common/selectBox";

export default class Convert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cryptoList: [],
            marketcapList: [],
            coinValue: '',
            result: '',
            loading: false,
            load: false,
            TYPE: ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'DASH'],
            currentTYPE: 0,
        };
    }

    componentDidMount() {
        this.getKrw();
    }

    getKrw() {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,ETC,XRP,LTC,DASH&tsyms=BTC,KRW,BTC,USD")
            .then((response) => response.json())
            .then((responseJson) => {
                var arr = [];
                arr.push(responseJson.RAW.BTC.KRW.PRICE);
                arr.push(responseJson.RAW.ETH.KRW.PRICE);
                arr.push(responseJson.RAW.ETC.KRW.PRICE);
                arr.push(responseJson.RAW.XRP.KRW.PRICE);
                arr.push(responseJson.RAW.LTC.KRW.PRICE);
                arr.push(responseJson.RAW.DASH.KRW.PRICE);
                this.setState({ cryptoList: arr, load: true });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    convert() {
        if (this.state.coinValue == "") {
            Common.alert("값을 입력하세요!");
            return false;
        }
        var result = parseFloat(this.state.cryptoList[this.state.currentTYPE]) * parseFloat(this.state.coinValue);
        this.setState({ result: result.toFixed(0).toString() });
    }

    setType(i) {
        this.setState({ currentTYPE: i });
    }

    render() {
        return (
            <View style={styles.frame}>
                {!this.state.load &&
                    <Text style={styles.centerTxt}>
                        초기데이터를 불러오는중...
                    </Text>
                }

                <Text style={styles.centerTxt}>
                    임의의 가상화폐를 한화로 변환해보세요!{'\n'}
                    cryptocompare의 데이터를 기반으로 합니다.
                </Text>
                <TextInput
                    style={styles.inputCoinValue}
                    value={this.state.coinValue}
                    onChangeText={(coinValue) => this.setState({ coinValue: coinValue })}
                    placeholder={'임의의 값을 입력하세요'}
                    placeholderTextColor="#FFFFFF"
                    autoCapitalize='none'
                    keyboardType='numeric'
                    autoCorrect={false}
                    maxLength={30}
                    multiline={false}
                />
                <Text style={styles.centerTxt}>아래 버튼을 눌러서 유형을 선택하세요!</Text>
                <SelectBox
                    list={this.state.TYPE}
                    currentItem={0}
                    selectBoxText={null}
                    onClickBoxFunction={(i) => {
                        this.setType(i);
                    }} />
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.convert()}
                    style={styles.convertBtn}
                >
                    <Text style={styles.btnText}>
                        변환
                    </Text>
                </TouchableOpacity>
                <Text style={styles.result}>
                    결과 : {this.state.result}원
                </Text>
            </View>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
var styles = StyleSheet.create({
    frame: {
        paddingTop: 20 * dpi,
    },
    centerTxt: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17 * dpi,
        textAlign: 'center',
        margin: 10 * dpi,
    },
    inputCoinValue: {
        width: 0.6 * wid,
        height: 0.07 * hei,
        fontSize: 15 * dpi,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 15 * dpi,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        paddingLeft: 20 * dpi,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 0.6 * wid,
        height: 0.05 * hei,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1 * dpi,
        borderRadius: 10 * dpi,
        paddingLeft: 17 * dpi,
        paddingRight: 15 * dpi,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectBoxText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        opacity: 0.9,
    },
    convertBtn: {
        width: 0.2 * wid,
        height: 0.04 * hei,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        opacity: 0.6,
        margin: 15 * dpi,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15 * dpi
    },
    result: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17 * dpi,
        textAlign: 'center',
        margin: 5 * dpi,
    },
});
