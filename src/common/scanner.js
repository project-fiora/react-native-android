/**
 * Created by kusob on 2017. 7. 17..
 */

import React, {Component} from 'react';
import {AsyncStorage, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Actions} from 'react-native-router-flux';
import QRCodeScanner from "react-native-qrcode-scanner";
import Common from "./common";

export default class Scanner extends Component {
    async onRead(obj) {
        alert('스캔 완료!\n' + obj.data + '\n지갑 주소를 확인하세요');
        console.log("scanning");
        console.log(obj);
        try {
            await AsyncStorage.setItem('walletAddQrcodeTmp', obj.data.toString());
        } catch (error) {
            alert("스캔 후 저장 오류 : " + error);
        }
        Actions.main({goTo: 'myWalletAdd'});
    }

    render() {
        return (
            <QRCodeScanner
                onRead={(obj) => this.onRead(obj)}
                bottomContent={
                    <TouchableOpacity
                        style={styles.backBtn}
                        underlayColor={'#000000'}
                        onPress={() => Actions.main({goTo: 'myWalletAdd'})}
                    >
                        <Text style={styles.btnText}>
                            뒤로가기
                        </Text>
                    </TouchableOpacity>
                }
                showMarker={true}
            />

        );
    }
}

const dpi = Common.getRatio();
const styles = StyleSheet.create({
    backBtn: {
        width: 80 * dpi,
        height: 40 * dpi,
        borderWidth: 1 * dpi,
        borderRadius: 20 * dpi,
        borderColor: '#000000',
        padding: 5 * dpi,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        margin: 15 * dpi,
    },
    btnText: {
        color: '#000000',
        fontSize: 15 * dpi,
    },
});