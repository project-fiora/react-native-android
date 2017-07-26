/**
 * Created by kusob on 2017. 7. 17..
 */

import React, {Component} from 'react';
import {AsyncStorage, Text, TouchableOpacity, StyleSheet, View} from "react-native";
import {Actions} from 'react-native-router-flux';
import QRCodeScanner from "react-native-qrcode-scanner";

export default class Scanner extends Component {
    async onRead(){
        alert('스캔 완료!\n' + obj.data + '\n지갑 주소를 확인하세요');
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
                onRead={(obj) => this.onRead()}
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

const styles = StyleSheet.create({
    backBtn: {
        width: 80,
        height: 40,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#000000',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        margin: 15,
    },
    btnText: {
        color: '#000000',
        fontSize: 15
    },
});