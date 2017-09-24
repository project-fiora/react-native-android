/**
 * Created by kusob on 2017. 7. 14..
 */

import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Common from "../common/common";
import LoadingIcon from 'react-native-loading-spinner-overlay';

export default class Coinmarketcap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: true,
            list: [],
        };
    }

    componentDidMount() {
        this.getPriceInfo();
    }

    componentWillUnmount() {
        clearTimeout(this.TimerId);
    }

    getPriceInfo() {
        this.setState({ refreshing: true }, () => {
            fetch("https://api.coinmarketcap.com/v1/ticker/?limit=6")
                .then((response) => response.json()).then((responseJson) => {
                    this.setState({ list: responseJson, refreshing: false });
                }).catch((error) => {
                    console.error(error);
                }).done(() => {
                    this.TimerId = setTimeout(
                        () => {
                            this.getPriceInfo();
                        }, 5000
                    );
                });
        });
    }

    render() {
        const tableHead = ['분류', '비율(BTC)', '순환공급량', 'Volume', '변화율', 'Price'];
        return (
            <ScrollView contentContainerStyle={styles.frame}>
                {this.state.refreshing &&
                    <LoadingIcon visible={true}/>
                }
                <ScrollView contentContainerStyle={styles.priceWrapper}>
                    <Text style={styles.explain}>
                        실시간 시세 차이에 주의하세요!
                    </Text>
                    <View style={styles.thead}>
                        <View style={styles.th1}>
                            <Text style={styles.htxt}>{tableHead[0]}</Text>
                        </View>
                        <View style={styles.th2}>
                            <Text style={styles.htxt}>{tableHead[1]}</Text>
                        </View>
                        <View style={styles.th}>
                            <Text style={styles.htxt}>{tableHead[2]}</Text>
                        </View>
                    </View>
                    {this.state.list.map((info, i) => {
                        return (
                            <View key={i} style={styles.tr}>
                                <View style={styles.td1}>
                                    <Text style={styles.title}>{info.symbol}</Text>
                                </View>
                                <View style={styles.td2}>
                                    <Text style={styles.txt}>{parseFloat(info.price_btc).toFixed(8)}</Text>
                                </View>
                                <View style={styles.td}>
                                    <Text style={styles.txt}>{info.available_supply} {info.symbol}</Text>
                                </View>
                            </View>
                        );
                    })}
                    <View style={styles.betweenTable} />
                    {/*////////////////////////////////여기까지 첫번째 테이블////////////////////////////////*/}
                    <View style={styles.thead}>
                        <View style={styles.th1}>
                            <Text style={styles.htxt}>{tableHead[0]}</Text>
                        </View>
                        <View style={styles.th6}>
                            <Text style={styles.htxt}>{tableHead[5]}</Text>
                        </View>
                        <View style={styles.th4}>
                            <Text style={styles.htxt}>{tableHead[3]}</Text>
                        </View>
                        <View style={styles.th5}>
                            <Text style={styles.htxt}>{tableHead[4]}</Text>
                        </View>
                    </View>
                    {this.state.list.map((info, i) => {
                        return (
                            <View key={i} style={styles.tr}>
                                <View style={styles.td1}>
                                    <Text style={styles.title}>{info.symbol}</Text>
                                </View>
                                <View style={styles.td6}>
                                    <Text style={styles.txt}>$ {parseFloat(info.price_usd).toFixed(1)}</Text>
                                </View>
                                <View style={styles.td4}>
                                    <Text style={styles.txt}>${parseFloat(info["24h_volume_usd"]).toFixed(0)}</Text>
                                </View>
                                <View style={styles.td5}>
                                    <Text style={styles.txt}>{parseFloat(info.percent_change_24h).toFixed(2)} %</Text>
                                </View>
                            </View>
                        );
                    })}
                    <Text style={styles.origin}>
                        데이터 출처 : http://coinmarketcap.com/
                    </Text>
                </ScrollView>
            </ScrollView>
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
        alignItems: 'center'
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
        justifyContent: 'center',
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
        paddingVertical: 3, //Table Head Padding
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th2: {
        flex: 1.9,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th: {
        flex: 3,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th4: {
        flex: 1.9,
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
        flex: 1.25,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th6: { //비율
        flex: 1.5,
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
        fontSize: 11,
        opacity: 0.8,
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
        backgroundColor: '#22214B',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1,
    },
    td2: { //비율?
        flex: 1.9,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td: { //supply
        flex: 3,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td4: { //volume
        flex: 1.9,
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
        flex: 1.25,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3,
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 1,
    },
    td6: { //price
        flex: 1.5,
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
        fontSize: 16,
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
        marginRight: 0.05 * wid,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: '#FFFFFF',
        fontSize: 14,
    },
});

