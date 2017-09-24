/**
 * Created by kusob on 2017. 7. 13..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View, RefreshControl,
} from 'react-native';
import Common from "../common/common";
import LoadingIcon from 'react-native-loading-spinner-overlay';

export default class Cryptocompare extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            refreshing: false,
            cryptoList: [{}],
            noRfresh: false,
        };
    }

    componentDidMount() {
        this.getRate();
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.getRate();
    }

    getRate() {
        this.setState({ refreshing: true });
        fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USD%22%2C%22KRW%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.error === null) {
                    this.setState({ rate: responseJson.query.results.rate[1].Rate });
                } else {
                    alert("야후api오류로 환율 정보를 가져올 수 없습니다");
                    this.setState({ noRfresh: true });
                    return false;
                }
            })
            .catch((error) => {
                console.error(error);
            }).done(() => this.getCryptocompare());
    }

    getCryptocompare() {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,ETC,XRP,LTC,DASH&tsyms=BTC,KRW,BTC,USD")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ cryptoList: responseJson.RAW, refreshing: false, load: true })
            }).catch((error) => {
                console.error(error);
            }).done();
    }

    render() {
        const tableHead = ['분류', 'KRW', 'USDKRW', 'USD', 'KR - US', 'BTC', ''];
        return (
            <ScrollView contentContainerStyle={styles.frame}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        progressBackgroundColor='#FFFFFF'
                        tintColor='#FFFFFF'
                    />}
            >
                {/* {
                    this.state.load == false &&
                    <LoadingIcon visible={true} />
                }
                {this.state.refreshing == true &&
                    <LoadingIcon visible={true} />
                } */}
                <ScrollView contentContainerStyle={styles.priceWrapper}>
                    <Text style={styles.explain}>
                        실시간 시세 차이에 주의하세요!{'\n'}
                        아래로 끌어 당겨서 새로고침하세요
                    </Text>
                    {this.state.load == true &&
                        <View>
                            <View style={styles.thead}>
                                <View style={styles.th1}>
                                    <Text style={styles.htxt}>{tableHead[0]}</Text>
                                </View>
                                <View style={styles.th2}>
                                    <Text style={styles.htxt}>{tableHead[1]}</Text>
                                </View>
                                <View style={styles.th6}>
                                    <Text style={styles.htxt}>{tableHead[5]}</Text>
                                </View>
                            </View>
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[0]}
                                val1={this.state.cryptoList.BTC.KRW.PRICE} val2={this.state.cryptoList.BTC.BTC.PRICE} />
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[1]}
                                val1={this.state.cryptoList.ETH.KRW.PRICE} val2={this.state.cryptoList.ETH.BTC.PRICE} />
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[2]}
                                val1={this.state.cryptoList.ETC.KRW.PRICE} val2={this.state.cryptoList.ETC.BTC.PRICE} />
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[3]}
                                val1={this.state.cryptoList.XRP.KRW.PRICE} val2={this.state.cryptoList.XRP.BTC.PRICE} />
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[4]}
                                val1={this.state.cryptoList.LTC.KRW.PRICE} val2={this.state.cryptoList.LTC.BTC.PRICE} />
                            <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[5]}
                                val1={this.state.cryptoList.DASH.KRW.PRICE}
                                val2={parseFloat(this.state.cryptoList.DASH.BTC.PRICE).toFixed(8)} />
                            <View style={styles.betweenTable} />
                            {/*////////////////////////////////여기까지 첫번째 테이블////////////////////////////////*/}
                            <View style={styles.thead}>
                                <View style={styles.th1}>
                                    <Text style={styles.htxt}>{tableHead[0]}</Text>
                                </View>
                                <View style={styles.th5}>
                                    <Text style={styles.htxt}>{tableHead[4]}</Text>
                                </View>
                                <View style={styles.th3}>
                                    <Text style={styles.htxt}>{tableHead[2]}</Text>
                                </View>
                            </View>

                            {/*{Object.getOwnPropertyNames(this.state.cryptoList)[0]}*/}
                            <Tr2 val0='BTC'
                                val1={parseFloat(this.state.cryptoList.BTC.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.BTC.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Tr2 val0="ETH"
                                val1={parseFloat(this.state.cryptoList.ETH.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.ETH.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Tr2 val0="ETC"
                                val1={parseFloat(this.state.cryptoList.ETC.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.ETC.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Tr2 val0="XRP"
                                val1={parseFloat(this.state.cryptoList.XRP.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.XRP.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Tr2 val0="LTC"
                                val1={parseFloat(this.state.cryptoList.LTC.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.LTC.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Tr2 val0="DASH"
                                val1={parseFloat(this.state.cryptoList.DASH.KRW.PRICE)}
                                val2={(parseFloat(this.state.cryptoList.DASH.USD.PRICE) * parseFloat(this.state.rate)).toFixed(2)}
                            />
                            <Text style={styles.origin}>
                                데이터 출처 : https://www.cryptocompare.com/
                        </Text>
                        </View>
                    }
                </ScrollView>
            </ScrollView >
        );
    }
}

class Tr1 extends Component {
    render() {
        return (
            <View style={styles.tr}>
                <View style={styles.td1}>
                    <Text style={styles.title}>{this.props.val0}</Text>
                </View>
                <View style={styles.td2}>
                    <Text style={styles.txt}>{this.props.val1}</Text>
                </View>
                <View style={styles.td6}>
                    <Text style={styles.txt}>
                        {this.props.val2}
                    </Text>
                </View>
            </View>
        );
    }
}

class Tr2 extends Component {
    render() {
        var KRW = parseFloat(this.props.val1);
        var USDKRW = parseFloat(this.props.val2);
        var KR_US = (KRW - USDKRW).toFixed(1);
        return (
            <View style={styles.tr}>
                <View style={styles.td1}>
                    <Text style={styles.title}>
                        {this.props.val0}
                    </Text>
                </View>
                <View style={styles.td5}>
                    <Text style={styles.txt}>
                        {(KRW - USDKRW).toFixed(1) + " (" + (100 / (KRW / KR_US)).toFixed(2) + "%)"}
                    </Text>
                </View>
                <View style={styles.td3}>
                    <Text style={styles.txt}>
                        {this.props.val2}
                    </Text>
                </View>
            </View>
        );
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        flex: 1,
    },
    priceWrapper: {
        alignItems: 'center',
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 17,
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
    },
    thead: {
        width: wid * 0.9,
        flexDirection: 'row',
    },
    th1: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        paddingVertical: 3, //table head padding
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th2: {
        flex: 2.5,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th3: {
        flex: 2.2,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th5: {
        flex: 2.8,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th6: { //BTC
        flex: 2.5,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    htxt: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 10,
        opacity: 0.8
    },
    tr: {
        width: wid * 0.9,
        flexDirection: 'row',
    },
    td1: { // 분류
        flex: 1,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.5,
        backgroundColor: '#22214B',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
    },
    td2: { //KRW
        flex: 2.5,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td3: { //USDKRW
        flex: 2.2,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td5: {
        flex: 2.8,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td6: { //비율
        flex: 2.5,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    htxt: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    txt: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    betweenTable: {
        margin: 5,
    },
    origin: {
        marginVertical: 10,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: '#FFFFFF',
        fontSize: 14,
    },
});

