import React, {Component} from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import QRCode from "react-native-qrcode";
import Common from "./common";

export default class WalletInfo extends Component {
    render() {
        return (
            <View style={styles.frame}>
                {/*지갑번호 : {this.props.wallet_Id}{'\n'}*/}
                <View style={styles.infoWrapper}>
                    <View style={styles.betweenRow}>
                        <Text style={styles.textLeft}>지갑이름</Text>
                        <Text style={styles.textRight}>{this.props.wallet_name}</Text>
                    </View>
                    <View style={styles.betweenRow}>
                        <Text style={styles.textLeft}>지갑유형</Text>
                        <Text style={styles.textRight}>{this.props.wallet_type}</Text>
                    </View>
                    <View style={styles.hr}/>
                    <View style={styles.betweenRow}>
                        <Text style={styles.balance}>잔 액</Text>
                        <Text style={styles.realBalance}>{this.props.balance}</Text>
                    </View>
                    <View style={styles.hr}/>
                    <View style={styles.hr}/>
                </View>
                <View style={styles.qrCodeWrapper}>
                    <QRCode
                        value={this.props.wallet_add}
                        size={200}
                        bgColor='black'
                        fgColor='white'
                    />
                </View>
                <Text style={styles.centerText}>{this.props.wallet_add}</Text>
                <TouchableOpacity
                    style={styles.searchBtn}
                    underlayColor={'#000000'}
                    onPress={() => this.goTo(this.state.rightBtnGoTo)}
                >
                    <Text style={styles.searchBtnText}>거래기록조회</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const hei = Common.winHeight();
const styles = StyleSheet.create({
    frame: {
        marginVertical: 0.03 * hei,
    },
    infoWrapper:{
        paddingHorizontal: 0.15 * wid,
    },
    betweenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5 * dpi,
    },
    textLeft: {
        color: '#DBCEFF',
        fontSize: 17 * dpi,
        opacity: 0.7,
    },
    textRight: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        opacity: 0.9,
    },
    hr: {
        borderColor: '#FFFFFF',
        borderTopWidth: 0.6 * dpi,
        opacity: 0.8,
        // borderStyle:'dashed',  //<= not working
    },
    balance: {
        color: '#DBCEFF',
        fontSize: 19 * dpi,
    },
    realBalance: {
        color: '#FFFFFF',
        fontSize: 19 * dpi,
    },
    qrCodeWrapper: {
        marginTop: 10 * dpi,
        alignSelf: 'center',
    },
    centerText: {
        marginVertical: 3 * dpi,
        color: '#FFFFFF',
        fontSize: 14 * dpi,
        textAlign: 'center',
    },
    searchBtn: {
        width:0.35*wid,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        paddingVertical:5*dpi,
        marginTop:10*dpi,
    },
    searchBtnText: {
        color: '#FFFFFF',
        fontSize: 14 * dpi
    },
});