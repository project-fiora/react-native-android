import React, {Component} from "react";
import {Text, View, StyleSheet} from "react-native";
import QRCode from "react-native-qrcode";
import Common from "./common";

export default class WalletInfo extends Component {
    render() {
        return (
            <View>
                <Text style={styles.contentText}>
                    {/*지갑번호 : {this.props.wallet_Id}{'\n'}*/}
                    지갑이름 : {this.props.wallet_name}{'\n'}
                    지갑유형 : {this.props.wallet_type}{'\n'}
                    잔액 : {this.props.balance}{'\n'}
                    지갑주소 ▼ {'\n'}{this.props.wallet_add}{'\n'}
                    QR 코드 ▼
                </Text>
                <View style={styles.qrCodeWrapper}>
                    <QRCode
                        value={this.props.qrcode}
                        size={220}
                        bgColor='black'
                        fgColor='white'/>
                </View>
            </View>
        );
    }
}

const dpi = Common.getRatio();
const wid = Common.winWidth();
const styles = StyleSheet.create({
    contentText: {
        color: '#FFFFFF',
        fontSize: 17 * dpi,
        marginTop: 10 * dpi,
        opacity: 0.8,
        marginBottom: 5 * dpi,
        alignSelf: 'flex-start',
    },
    qrCodeWrapper: {
        alignSelf: 'center',
        width: 0.65 * wid,
        height: 0.65 * wid,
    },
});