/**
 * Created by kusob on 2017. 7. 14..
 */

import React, {Component} from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Common from "../common/common";

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
        setInterval(
            () => {
                this.getPriceInfo();
            }, 4000
        );
    }

    getPriceInfo() {
        fetch("https://api.coinmarketcap.com/v1/ticker/?limit=6")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({list: responseJson, refreshing: false});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const tableHead = ['분류', '비율(BTC)', '순환공급량', 'Volume', '변화율', 'Price'];
        return (
            <ScrollView
                contentContainerStyle={styles.priceWrapper}
            >
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
                <View style={styles.betweenTable}/>
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
        );
    }
}

const wid = Common.winWidth();
const hei = Common.winHeight();
const dpi = Common.getRatio();
const styles = StyleSheet.create({
    priceWrapper: {
        flex: 1,
        alignItems: 'center'
    },
    explain: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16*dpi,
        margin: 5*dpi,
        textAlign: 'center',
    },
    thead: {
        width: wid * 0.9,
        height: hei *0.04,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    th1: {
        flex: 1,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th2: {
        flex: 1.9,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th: {
        flex: 3,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th4: {
        flex: 1.9,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th5: {
        flex: 1.25,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    th6: { //비율
        flex: 1.5,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 1*dpi,
        backgroundColor: '#000000',
        opacity: 0.5,
    },
    htxt: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 10*dpi,
        opacity: 0.8
    },
    tr: {
        width: wid * 0.9,
        height: hei *0.04,
        flexDirection: 'row',
    },
    td1: { // 분류
        flex: 1,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        backgroundColor: '#22214B',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent:'center',
        margin: 1*dpi,
    },
    td2: { //비율?
        flex: 1.9,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3*dpi,
        alignItems: 'flex-end',
        justifyContent:'center',
        margin: 1*dpi,
    },
    td: { //supply
        flex: 3,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3*dpi,
        alignItems: 'flex-end',
        justifyContent:'center',
        margin: 1*dpi,
    },
    td4: { //volume
        flex: 1.9,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3*dpi,
        alignItems: 'flex-end',
        justifyContent:'center',
        margin: 1*dpi,
    },
    td5: {
        flex: 1.25,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3*dpi,
        alignItems: 'flex-end',
        justifyContent:'center',
        margin: 1*dpi,
    },
    td6: { //price
        flex: 1.5,
        borderWidth: 1*dpi,
        borderRadius: 7*dpi,
        borderColor: '#FFFFFF',
        opacity: 0.8,
        paddingRight: 3*dpi,
        alignItems: 'flex-end',
        justifyContent:'center',
        margin: 1*dpi,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14*dpi,
        fontWeight: 'bold',
    },
    htxt: {
        color: '#FFFFFF',
        fontSize: 14*dpi,
        fontWeight: 'bold',
    },
    txt: {
        color: '#FFFFFF',
        fontSize: 14*dpi,
    },
    betweenTable: {
        margin: 5*dpi,
    },
    origin: {
        marginTop: 10*dpi,
        marginRight: 12*dpi,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: '#FFFFFF',
        fontSize: 13*dpi,
    },
});

