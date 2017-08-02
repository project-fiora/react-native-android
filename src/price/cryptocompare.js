/**
 * Created by kusob on 2017. 7. 13..
 */

import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Common from "../common/common";
import LoadingIcon from "../common/loadingIcon";

export default class Cryptocompare extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false,
            refreshing: false,
            cryptoList: [{}],
        };
    }

    componentDidMount() {
        this.getRate();
    }

    componentWillUnmount() {
        clearTimeout();
    }

    getRate() {
        this.setState({refreshing: true});
        fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USD%22%2C%22KRW%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({rate: responseJson.query.results.rate[1].Rate});
            })
            .catch((error) => {
                console.error(error);
            }).done(() => this.getCryptocompare());
    }

    getCryptocompare() {
        fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,ETC,XRP,LTC,DASH&tsyms=BTC,KRW,BTC,USD")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({cryptoList: responseJson.RAW, refreshing: false, load: true})
            }).catch((error) => {
            console.error(error);
        }).done(()=>{
            setTimeout(
                () => {
                    this.getRate();
                }, 5000
            );
        });
    }

    render() {
        const tableHead = ['분류', 'KRW', 'USDKRW', 'USD', 'KR - US', 'BTC', ''];
        return (
            <ScrollView contentContainerStyle={styles.priceWrapper}>
                {this.state.load == false &&
                <LoadingIcon/>
                }
                {this.state.refreshing == true &&
                <LoadingIcon/>
                }
                <Text style={styles.explain}>
                    실시간 시세 차이에 주의하세요!
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
                         val1={this.state.cryptoList.BTC.KRW.PRICE} val2={this.state.cryptoList.BTC.BTC.PRICE}/>
                    <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[1]}
                         val1={this.state.cryptoList.ETH.KRW.PRICE} val2={this.state.cryptoList.ETH.BTC.PRICE}/>
                    <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[2]}
                         val1={this.state.cryptoList.ETC.KRW.PRICE} val2={this.state.cryptoList.ETC.BTC.PRICE}/>
                    <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[3]}
                         val1={this.state.cryptoList.XRP.KRW.PRICE} val2={this.state.cryptoList.XRP.BTC.PRICE}/>
                    <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[4]}
                         val1={this.state.cryptoList.LTC.KRW.PRICE} val2={this.state.cryptoList.LTC.BTC.PRICE}/>
                    <Tr1 val0={Object.getOwnPropertyNames(this.state.cryptoList)[5]}
                         val1={this.state.cryptoList.DASH.KRW.PRICE}
                         val2={parseFloat(this.state.cryptoList.DASH.BTC.PRICE).toFixed(8)}/>
                    <View style={styles.betweenTable}/>
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
const dpi = Common.getRatio();
const styles = StyleSheet.create({
    priceWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    loadingIcon: {
        width: wid * 0.2,
        height: hei * 0.1,
        marginTop: hei * 0.1,
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16 * dpi,
        marginTop: 15 * dpi,
        marginBottom: 10 * dpi,
        textAlign: 'center',
    },
    thead: {
        width: wid * 0.9,
        height: hei * 0.04,
        flexDirection: 'row',
    },
    th1: {
        flex: 1,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th2: {
        flex: 2.5,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th3: {
        flex: 2.2,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th5: {
        flex: 2.8,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th6: { //BTC
        flex: 2.5,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    htxt: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 10 * dpi,
        opacity: 0.8
    },
    tr: {
        width: wid * 0.9,
        height: hei * 0.04,
        flexDirection: 'row',
    },
    td1: { // 분류
        flex: 1,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.5,
        backgroundColor: '#22214B',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1 * dpi,
    },
    td2: { //KRW
        flex: 2.5,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3 * dpi,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1 * dpi,
    },
    td3: { //USDKRW
        flex: 2.2,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3 * dpi,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1 * dpi,
    },
    td5: {
        flex: 2.8,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3 * dpi,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1 * dpi,
    },
    td6: { //비율
        flex: 2.5,
        borderWidth: 1 * dpi,
        borderRadius: 7 * dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3 * dpi,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1 * dpi,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 15 * dpi,
        fontWeight: 'bold',
    },
    htxt: {
        color: '#FFFFFF',
        fontSize: 16 * dpi,
        fontWeight: 'bold',
    },
    txt: {
        color: '#FFFFFF',
        fontSize: 15 * dpi,
    },
    betweenTable: {
        margin: 5,
    },
    origin: {
        marginTop: 10 * dpi,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: '#FFFFFF',
        fontSize: 13 * dpi,
    },
});

