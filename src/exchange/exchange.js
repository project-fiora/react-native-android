/**
 * Created by kusob on 2017. 7. 1..
 */

import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Text, TextInput, TouchableHighlight,
    View
} from 'react-native';

export default class Exchange extends Component {
    render() {

        return (
            <View style={styles.frame}>
                <Text style={styles.txt}>
                    자동화 거래소 기능은...{'\n'}
                    수요를 보고 업데이트하겠습니다!{'\n'}
                    서버 유지 비용이 많이들어요 ㅠ.ㅠ{'\n'}
                </Text>
                <Text style={styles.devText}>
                    개발자 후원하기{'\n'}{'\n'}
                    BTC ▼{'\n'}1HkJXbAu6SZGhYcCLBhoLUqxqzv38ud15H{'\n'}{'\n'}
                    <Image source={require('../common/img/ds_btc_qrcode.png')} style={styles.btcQrCodeImg}/>
                    {'\n'}{'\n'}
                    ETH ▼{'\n'}0x067D4CCED4E804F7A1B1B85870B434E074689E2F{'\n'}{'\n'}
                    XRP ▼{'\n'}rp2diYfVtpbgEMyaoWnuaWgFCAkqCAEg28{'\n'}(TAG : 1019635554){'\n'}
                </Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    frame:{
        padding:20,
    },
    txt:{
        color:'#FFFFFF',
        opacity:0.8,
        padding:1,
        fontSize:17,
    },
    devText:{
        color:'#FFFFFF',
        opacity:0.8,
        padding:1,
        fontSize:15,
    },
    btcQrCodeImg:{
        width:150,
        height:150,
    },
});

