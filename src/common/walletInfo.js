import React, {Component} from "react";
import {Text, View, StyleSheet} from "react-native";
import QRCode from "react-native-qrcode";
import Common from "./common";

export default class WalletInfo extends Component {
    render() {
        return (
            <View style={styles.frame}>
                {/*지갑번호 : {this.props.wallet_Id}{'\n'}*/}
                {/*<View style={styles.walletNameWrapper}>*/}
                {/*<Text style={styles.walletName}>지갑이름</Text>*/}
                {/*<Text style={styles.realWalletName}>{this.props.wallet_name}</Text>*/}
                {/*</View>*/}
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
                <View style={styles.qrCodeWrapper}>
                    <QRCode
                        value={this.props.qrcode}
                        size={200}
                        bgColor='black'
                        fgColor='white'
                    />
                </View>
                <Text style={styles.centerText}>{this.props.wallet_add}</Text>
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
        paddingHorizontal: 0.15 * wid,
    },
    walletNameWrapper: {
        marginVertical: 0.03 * hei,
        opacity: 0.9,
    },
    walletName: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
        alignSelf: 'flex-start',
    },
    realWalletName: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
        alignSelf: 'flex-end',
    },
    betweenRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textLeft: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    textRight: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    hr: {
        borderTopWidth: 1 * dpi,
        // borderStyle:'dotted',  <= not working
    },
    balance: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    realBalance: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
    },
    qrCodeWrapper: {
        marginTop: 10 * dpi,
        alignSelf: 'center',
    },
    centerText: {
        // color: '#FFFFFF',
        fontSize: 17 * dpi,
        textAlign: 'center',
    },
});