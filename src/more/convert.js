/**
 * Created by kusob on 2017. 7. 20..
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';

export default class Convert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            onClickBox:false,
            cryptoList:[],
            marketcapList:[],
            coinValue: '',
            result: '',
            loading:false,
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
                this.setState({cryptoList: arr});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    convert() {
        if(this.state.coinValue==""){
            alert("값을 입력하세요!");
            return false;
        }
        var result = parseFloat(this.state.cryptoList[this.state.currentTYPE])*parseFloat(this.state.coinValue);
        this.setState({result:result.toFixed(0).toString()});
    }

    setType(i) {
        this.setState({currentTYPE: i, onClickBox: !this.state.onClickBox});
    }

    render() {
        return (
            <View style={styles.frame}>
                <Text style={styles.centerTxt}>
                    임의의 가상화폐를 한화로 변환해보세요!
                </Text>
                <TextInput
                    style={styles.inputCoinValue}
                    value={this.state.coinValue}
                    onChangeText={(coinValue) => this.setState({coinValue: coinValue})}
                    placeholder={'임의의 값을 입력하세요'}
                    placeholderTextColor="#FFFFFF"
                    autoCapitalize='none'
                    keyboardType='numeric'
                    autoCorrect={false}
                    maxLength={30}
                    multiline={false}
                />
                {/*////////////////////////////////////////////////////////////////////////////////*/}
                <Text style={styles.centerTxt}>아래 버튼을 눌러서 유형을 선택하세요!</Text>
                <TouchableOpacity
                    underlayColor={'#AAAAAA'}
                    onPress={() => this.setState({onClickBox: !this.state.onClickBox})}
                >
                    <View style={styles.selectBoxWrapper}>
                        <View style={styles.selectBoxRow}>
                            <Text style={styles.selectBoxText}>
                                {this.state.TYPE[this.state.currentTYPE]}
                            </Text>
                            <View style={styles.selectBoxIconWrapper}>
                                <Text style={styles.selectIcon}>
                                    ▼
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {(() => {
                    if (this.state.onClickBox == true) {
                        return this.state.TYPE.map((type, i) => {
                            return (
                                <TouchableOpacity
                                    underlayColor={'#AAAAAA'}
                                    onPress={() => this.setType(i)}
                                    key={i}
                                >
                                    <View style={styles.selectBoxWrapper}>
                                        <View style={styles.selectBoxRow}>
                                            <Text style={styles.selectBoxText}>
                                                {type}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }
                })()}
                {/*////////////////////////////////////////////////////////////////////////////////*/}
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

var styles = StyleSheet.create({
    frame: {
        paddingTop: 20,
    },
    centerTxt: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17,
        textAlign: 'center',
        marginBottom:10,
    },
    inputCoinValue: {
        width: 220,
        height: 45,
        fontSize: 15,
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#000000',
        opacity: 0.3,
        margin: 15,
        paddingLeft: 20,
    },
    selectBoxWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 230,
        height: 40,
        opacity: 0.4,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 17,
        paddingRight: 15,
    },
    selectBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectBoxText: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontSize: 17,
    },
    selectBoxIconWrapper: {
        alignItems: 'flex-end',
    },
    selectIcon: {
        color: '#FFFFFF',
        fontSize: 17,
        opacity: 0.9,
    },
    convertBtn: {
        width: 80,
        height: 30,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#FFFFFF',
        padding: 5,
        alignItems: 'center',
        alignSelf:'center',
        opacity: 0.6,
        margin:15,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15
    },
    result: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17,
        textAlign: 'center',
        margin:5,
    },
});
